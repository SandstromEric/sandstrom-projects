import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, TemplateRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { distinctUntilChanged, firstValueFrom, fromEvent, skip, Subscription, takeUntil, timer } from 'rxjs';
import { ElementHighlighterService } from '../element-highlighter.service';
import { SpHighlightTooltipPosition } from '../element-highlighter.model';

@Component({
    selector: '[spHighlight]',
    templateUrl: './element-highlighter.component.html',
    styleUrls: ['./element-highlighter.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ElementHighlighterComponent implements AfterViewInit, OnDestroy {
    @Input('spHighlight') highlightElement = '';
    @Input('spHighlightNext') highlightNext = '';
    @Input('spHighlightTooltip') highlightTooltip: string | TemplateRef<any> = '';
    @Input('spHighlightTooltipPosition') prefferedTooltipPosition: SpHighlightTooltipPosition = 'top'; 
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

    constructor(private elementRef: ElementRef, private highlightService: ElementHighlighterService, private renderer: Renderer2, private viewContainerRef: ViewContainerRef) { }

    ngAfterViewInit() {
        
        this.highlightSubscription = this.highlightService.activeElementChanges.pipe(
            skip(1),
            distinctUntilChanged()
        ).subscribe(key => {
            this.currentKey = key;
            if (key === this.highlightElement) {
                this.positionElement();
            } else {
                if (key !== this.highlightElement) {
                    this.elementRef.nativeElement.classList.remove('sp-highlighted');
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
                document.querySelector('.sp-highlight-overlay')?.setAttribute('style', `
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
                /* document.querySelector('.sp-highlight-tooltip')?.setAttribute('style', 
                `
                    top: ${this.highlightTooltip instanceof TemplateRef ? `${boundingRect.top - 30}px` : `${boundingRect.top - 60}px`};
                    left: ${boundingRect.left + (boundingRect.width / 2)}px;
                    transform: translateX(-50%);
                    padding: ${this.highlightTooltip instanceof TemplateRef ? '0' : '10px'};
                `
                ); */

                this.checkTooltipPosition();
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
        this.elementRef.nativeElement.classList.add('sp-highlighted');
        const overlayEl = this.renderer.createElement('div');
        this.renderer.addClass(overlayEl, 'sp-highlight-overlay');
        //this.renderer.addClass(document.body, 'sp-highlight-overlay-active');
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
        
        let tooltipEl;
        if(this.highlightTooltip instanceof TemplateRef) {
            tooltipEl = this.viewContainerRef.createEmbeddedView(this.highlightTooltip);
        } else {
            if(this.highlightTooltip?.length) {
                tooltipEl = this.renderer.createElement('div');
                tooltipEl.innerHTML = this.highlightTooltip;
            }
        }

        if(tooltipEl) {
            const container = this.renderer.createElement('div');
            this.renderer.addClass(container, 'sp-highlight-tooltip');
            this.renderer.setStyle(container, 'padding', `${this.highlightTooltip instanceof TemplateRef ? '0' : '1rem'}`);
            this.renderer.addClass(document.body, 'sp-highlight-overlay-active');
            
            if(this.highlightTooltip instanceof TemplateRef) {
                for ( var node of tooltipEl.rootNodes ) {
                    this.renderer.appendChild(container, node);
                }
            } else {
                this.renderer.appendChild(container, tooltipEl);
            }

            document.body.append(container);
            dispatchEvent(new Event('resize'));
        }
        
    }

    checkTooltipPosition() {
        const boundingRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
        const container = document.querySelector('.sp-highlight-tooltip');
        if(container) {
            const tooltipRect: DOMRect = container.getBoundingClientRect();
            const positions = {
                top: () => {
                    this.renderer.removeClass(container, 'bottom');
                    this.renderer.removeClass(container, 'left');
                    this.renderer.removeClass(container, 'right');
                    this.renderer.addClass(container, 'top');
                    container.setAttribute('style', `
                        top: ${boundingRect.top - tooltipRect.height - 10}px;
                        left: ${boundingRect.left + (boundingRect.width / 2)}px;
                        padding: ${this.highlightTooltip instanceof TemplateRef ? '0' : '1rem'};
                        transform: translateX(-50%);
                    `);
                },
                right: () => {
                    this.renderer.removeClass(container, 'top');
                    this.renderer.removeClass(container, 'left');
                    this.renderer.removeClass(container, 'bottom');
                    this.renderer.addClass(container, 'right');
                    container.setAttribute('style', `
                        top: ${boundingRect.top + (boundingRect.height / 2) - 10}px;
                        left: ${boundingRect.right + 10}px;
                        padding: ${this.highlightTooltip instanceof TemplateRef ? '0' : '1rem'};
                        transform: translateY(-50%);
                    `);
                },
                left: () => {
                    this.renderer.removeClass(container, 'top');
                    this.renderer.removeClass(container, 'bottom');
                    this.renderer.removeClass(container, 'right');
                    this.renderer.addClass(container, 'left');
                    container.setAttribute('style', `
                        top: ${boundingRect.top + (boundingRect.height / 2) - 10}px;
                        left: ${boundingRect.left - tooltipRect.width - 10}px;
                        padding: ${this.highlightTooltip instanceof TemplateRef ? '0' : '1rem'};
                        transform: translateY(-50%);
                    `);
                },
                bottom: () => {
                    this.renderer.removeClass(container, 'top');
                    this.renderer.removeClass(container, 'left');
                    this.renderer.removeClass(container, 'right');
                    this.renderer.addClass(container, 'bottom');
                    container.setAttribute('style', `
                        top: ${boundingRect.bottom + 10}px;
                        left: ${boundingRect.left + (boundingRect.width / 2)}px;
                        padding: ${this.highlightTooltip instanceof TemplateRef ? '0' : '1rem'};
                        transform: translateX(-50%);
                    `);
                }
            }
            
            let checkOrder: SpHighlightTooltipPosition[] = ['top', 'right', 'left','bottom'];
            positions[this.prefferedTooltipPosition]();
            checkOrder.splice(checkOrder.indexOf(this.prefferedTooltipPosition), 1);
            let isClipping = !this.isElementInViewport(container);

            while (checkOrder.length && isClipping) {
                positions[checkOrder[0]]();
                checkOrder.splice(0, 1);
                isClipping = !this.isElementInViewport(container); 
            }

            if(isClipping) {
                positions[this.prefferedTooltipPosition]();
            }
        }
    }

    async removeOverlay(showNext = false) {
        const overlayEl = document.querySelector('.sp-highlight-overlay');
        const tooltipEl = document.querySelector('.sp-highlight-tooltip');

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
        } else {
            this.highlightService.close();
            this.renderer.removeClass(document.body, 'sp-highlight-overlay-active');
        }

    }

    isElementInViewport (el: any) {
        var rect = el.getBoundingClientRect();
    
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
        );
    }
}

