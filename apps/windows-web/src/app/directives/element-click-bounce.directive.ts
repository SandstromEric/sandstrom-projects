import { Directive, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[spElementClickBounce]'
})
export class ElementClickBounceDirective {
    target: HTMLElement | null = null;
    @HostListener('mousedown', ['$event.target']) onMouseDown(target: HTMLElement) {
        this.target = target;
        this.renderer.setStyle(target, 'transition', 'transform 0.1s ease-in-out');
        this.renderer.setStyle(target, 'transform', 'scale(0.8)');
    }

    @HostListener('document:mouseup', ['$event.target']) onMouseUp(target: HTMLElement) {
        if (this.target) {
            this.renderer.setStyle(this.target, 'transform', 'scale(1)');
        }

        this.target = null;
    }

    constructor(private renderer: Renderer2) {

    }

}
