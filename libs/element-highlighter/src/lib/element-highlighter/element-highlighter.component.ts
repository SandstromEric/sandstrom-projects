import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { distinctUntilChanged, firstValueFrom, fromEvent, skip, Subscription, takeUntil, timer } from 'rxjs';
import { ElementHighlighterService } from '../element-highlighter.service';

@Component({
    selector: '[spHighlight]',
    templateUrl: './element-highlighter.component.html',
    styleUrls: ['./element-highlighter.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ElementHighlighterComponent implements OnInit, OnDestroy {
    @Input('spHighlight') highlightElement = '';
    @Input('spHighlightNext') highlightNext = '';
    @Input('spHighlightTooltip') highlightTooltip = '';
    @Input('spHighlightDisableBackdropAutoClose')
    get highlightDisableBackdropAutoClose() { return this._highlightDisableBackdropAutoClose; }
    set highlightDisableBackdropAutoClose(value: BooleanInput) {
        this._highlightDisableBackdropAutoClose = coerceBooleanProperty(value);
    }
    private _highlightDisableBackdropAutoClose = false;

    
    @Output() spHighlightBackDropClick = new EventEmitter<{key: string, event: PointerEvent}>();

    highlightSubscription!: Subscription;
    resizeSubscription!: Subscription;
    private currentKey: string | null = null;

    constructor(private elementRef: ElementRef, private highlightService: ElementHighlighterService, private renderer: Renderer2) { }

    ngOnInit() {
        
        this.highlightSubscription = this.highlightService.activeElementChanges.pipe(
            skip(1),
            distinctUntilChanged()
        ).subscribe(key => {
            this.currentKey = key;
            if (key === this.highlightElement) {
                this.positionElement();
            } else {
                if (key !== this.highlightElement) {
                    this.elementRef.nativeElement.classList.remove('highlighted');
                }

                if (key === null) {
                    this.removeOverlay();
                }
            }
        });

        this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => {
            let el = document.querySelector(`[spHighlight="${this.currentKey}"]`);

            if(this.currentKey === this.highlightElement && el) {
                const boundingRect: DOMRect = el.getBoundingClientRect();
                document.querySelector('.highlight-overlay')?.setAttribute('style', `
                    clip-path: polygon(
                        0% 0%, 
                        0% 100%, 
                        ${boundingRect.left}px 100%,
                        ${boundingRect.left}px ${boundingRect.top}px,
                        ${boundingRect.right}px ${boundingRect.top}px, 
                        ${boundingRect.right}px ${boundingRect.bottom}px, 
                        ${boundingRect.left}px ${boundingRect.bottom}px, 
                        ${boundingRect.left}px 100%, 
                        100% 100%, 100% 0%
                    )`
                );
                document.querySelector('.highlight-tooltip')?.setAttribute('style', 
                `
                    top: ${boundingRect.top - 60}px;
                    left: ${boundingRect.left + (boundingRect.width / 2)}px;
                    transform: translateX(-50%);
                `
                );
            }
        });
    }

    ngOnDestroy() {
        if (this.highlightSubscription) {
            this.highlightSubscription.unsubscribe();
        }

        if(this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    }

    positionElement() {
        const boundingRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
        this.elementRef.nativeElement.classList.add('highlighted');
        const overlayEl = this.renderer.createElement('div');
        this.renderer.addClass(overlayEl, 'highlight-overlay');
        this.renderer.setStyle(overlayEl, 'clip-path', `
            polygon(
                0% 0%, 
                0% 100%, 
                ${boundingRect.left}px 100%,
                ${boundingRect.left}px ${boundingRect.top}px,
                ${boundingRect.right}px ${boundingRect.top}px, 
                ${boundingRect.right}px ${boundingRect.bottom}px, 
                ${boundingRect.left}px ${boundingRect.bottom}px, 
                ${boundingRect.left}px 100%, 
                100% 100%, 100% 0%
            )`
        );

        this.renderer.listen(overlayEl, 'click', (event) => {
            if (this.highlightNext?.length || !this._highlightDisableBackdropAutoClose) {
                this.removeOverlay(true);
            }
            const obj: { key: string, event: PointerEvent } = { key: this.highlightElement, event };
            this.spHighlightBackDropClick.emit(obj);
        });

        document.body.append(overlayEl);

        if(this.highlightTooltip.length) {
            const tooltipEl = this.renderer.createElement('div');
            tooltipEl.innerHTML = this.highlightTooltip;
            
            this.renderer.addClass(tooltipEl, 'highlight-tooltip');
            this.renderer.setStyle(tooltipEl, 'top', `${boundingRect.top - 60}px`);
            this.renderer.setStyle(tooltipEl, 'left', `${boundingRect.left + (boundingRect.width / 2)}px`);
            this.renderer.setStyle(tooltipEl, 'transform', `translateX(-50%)`);

            document.body.append(tooltipEl);
        }
    }

    async removeOverlay(showNext = false) {
        const overlayEl = document.querySelector('.highlight-overlay');
        const tooltipEl = document.querySelector('.highlight-tooltip');

        if (overlayEl) {
            this.renderer.addClass(overlayEl, 'fade-out');
        }

        if (tooltipEl) {
            this.renderer.addClass(tooltipEl, 'fade-out');
        }

        await firstValueFrom(timer(500));

        overlayEl?.remove();
        tooltipEl?.remove();

        if (this.highlightNext?.length && showNext) {
            this.highlightService.setActiveElement(this.highlightNext);
        }

    }
}
