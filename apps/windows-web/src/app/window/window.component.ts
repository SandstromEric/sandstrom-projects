import { CdkDragMove, DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, ElementRef, HostBinding, HostListener, Inject, OnDestroy, OnInit, Renderer2, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Application } from '../models/application';
import { WindowService } from '../services/window.service';

@Component({
    selector: 'sandstrom-projects-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss'],
})
export class WindowComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('header') header!: ElementRef;
    @ViewChild('window', { read: ViewContainerRef }) window!: ViewContainerRef;

    applicationRef!: ComponentRef<Application>;
    dragElMovedSubscription!: Subscription;
    dragElEndedSubscription!: Subscription;

    windowMinWidth = 500;
    windowMinHeight = 400;

    windowWidth = this.windowMinWidth;
    windowHeight = this.windowMinHeight;
    currentlyActive = 0;
    
    dragEl: DragRef;

    startDragWidth!: number;
    startDragHeight!: number;
    @HostBinding('class.fullscreen') fullscreen = false;
    @HostBinding('class.active') get active() {
        return this.windowService.active === this.currentlyActive;
    }

    @HostBinding('class.resizing') resizing = false;
    @HostBinding('class.dragging') dragging = false;
    @HostBinding('class.mat-elevation-z4') get shadow() {
        return !this.fullscreen && !this.pinned;
    }

    @HostBinding('class.pinned') get pinned() {
        return this.windowService.isWindowPinned(this.data.id);
    }

    @HostBinding('style')
    get myStyle(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(`min-width: ${this.windowMinWidth}px; min-height: ${this.windowMinHeight}px; z-index: ${this.currentlyActive};`);
    }

    @HostListener('mousedown', ['$event']) click() {
        if (!this.active) {
            this.setWindowAsActive();
            this.cdr.detectChanges();
        }
    }

    constructor(
        private cdkDrag: DragDrop,
        private element: ElementRef,
        private renderer: Renderer2,
        private sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef,
        private windowService: WindowService,
        @Inject('Application') public data: { id: string, component: Type<Application>, applicationData?: any },
    ) {
        this.dragEl = this.cdkDrag.createDrag(this.element.nativeElement);
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.currentlyActive = this.windowService.setAsActive();
        }, 100);

    }

    ngAfterViewInit() {
        this.applicationRef = this.window.createComponent(this.data.component);
        this.cdr.detectChanges();

        this.dragEl.withHandles([this.header.nativeElement]);

        this.dragElMovedSubscription = this.dragEl.moved.subscribe((event) => {
            this.dragging = true;

            if (this.fullscreen) {
                this.toggleFullscreen();
                this.dragEl.setFreeDragPosition({ x: event.pointerPosition.x / 2, y: event.pointerPosition.y - 16 });
            }
        });

        this.dragElEndedSubscription = this.dragEl.ended.subscribe((event) => {
            this.dragging = false;

            if (!this.fullscreen && event.dropPoint.y < 0) {
                this.toggleFullscreen();
            }

            if (event.dropPoint.y > 0 && event.dropPoint.y < 32) {
                this.windowService.addPinnedWindow(this.data);
            }
        });
    }

    ngOnDestroy() {
        this.dragElMovedSubscription.unsubscribe();
        this.dragElEndedSubscription.unsubscribe();
    }

    exit() {
        this.windowService.destroy(this.data.id);
    }

    setPosition(x: number, y: number) {
        this.dragEl.setFreeDragPosition({ x, y });
    }

    toggleFullscreen() {
        this.fullscreen = !this.fullscreen;
        const windowEl: HTMLElement = this.element.nativeElement;

        if (this.fullscreen) {
            this.windowWidth = windowEl.clientWidth;
            this.windowHeight = windowEl.clientHeight;
            this.renderer.setStyle(windowEl, 'width', `100%`);
            this.renderer.setStyle(windowEl, 'height', `100%`);
        } else {
            this.renderer.setStyle(windowEl, 'width', `${this.windowWidth}px`);
            this.renderer.setStyle(windowEl, 'height', `${this.windowHeight}px`);
        }
        setTimeout(() => {
           window.dispatchEvent(new Event('resize')); 
        }, 300);
        
        
    }

    
    cdkDragResizeStarted() {
        this.resizing = true;
        this.startDragWidth = this.element.nativeElement.clientWidth;
        this.startDragHeight = this.element.nativeElement.clientHeight;
    }

    cdkDragResizeMoved(event: CdkDragMove) {
        window.dispatchEvent(new Event('resize'));
        this.renderer.setStyle(this.element.nativeElement, 'width', `${this.startDragWidth + event.distance.x}px`);
        this.renderer.setStyle(this.element.nativeElement, 'height', `${this.startDragHeight + event.distance.y}px`);
        this.windowWidth = this.startDragWidth + event.distance.x;
        this.windowHeight = this.startDragHeight + event.distance.y;
    }

    cdkDragResizeEnded() {
        this.resizing = false;
    }

    setWindowAsActive() {
        if (!this.active) {
            this.currentlyActive = this.windowService.setAsActive();
        }
    }

    get matrix() {
        const values = this.element.nativeElement.style.transform.split(/\w+\(|\);?/);
        if (!values[1] || !values[1].length) {
            return {
                x: 0,
                y: 0,
            };
        }
        const result: string[] = values[1].split(/,\s?/g).map((item: string) => item.substring(0, item.length - 3));

        return {
            x: parseInt(result[0]),
            y: parseInt(result[1]),
        };
    }
}
