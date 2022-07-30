import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Directive({
  selector: '[sandstromProjectsTalentConnection]'
})
export class TalentConnectionDirective implements OnInit {
    
    private subject = new BehaviorSubject(null)
    @Input() points: string[] = [];
    @Input() parent!: HTMLElement;
    @Input() tree!: string;

    parentSelector!: any;
    parentRect!: any;
    rect1!: any;
    rect2!: any;

    @HostListener('window:resize', ['$event']) onResize() {
        this.subject.next(null);
    }

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {
        this.elementRef.nativeElement.style.stroke = '#000';
        this.elementRef.nativeElement.style.strokeWidth = '3px';
        this.parentSelector = this.parent.closest('.talents-container')

        this.subject.pipe(debounceTime()).subscribe(() => {
            this.rect1 = this.parentSelector?.querySelector(`.${this.tree} .cell-${this.points[1]} a`)?.getBoundingClientRect();
            this.rect2 = this.parentSelector?.querySelector(`.${this.tree} .cell-${this.points[0]} a`)?.getBoundingClientRect();
            this.parentRect = this.parent?.getBoundingClientRect();
            if(this.rect1 && this.rect2 && parent) {
                this.renderer.setAttribute(this.elementRef.nativeElement, 'x1', `${this.rect1?.left - this.parentRect?.left + this.rect1?.width / 2}`);
                this.renderer.setAttribute(this.elementRef.nativeElement, 'x2', `${this.rect2?.left - this.parentRect?.left + this.rect2?.width / 2}`);
                this.renderer.setAttribute(this.elementRef.nativeElement, 'y1', `${this.rect1?.top - this.parentRect?.top + this.rect1?.height / 2}`);
                this.renderer.setAttribute(this.elementRef.nativeElement, 'y2', `${this.rect2?.top - this.parentRect?.top + this.rect2?.height / 2}`);
            }
        })
    }
}
