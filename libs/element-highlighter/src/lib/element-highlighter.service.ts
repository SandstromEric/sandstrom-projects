import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ElementHighlighterService {
    private activeElementSubject = new BehaviorSubject<string | null>(null);
    constructor() { 
        /* const svg = this.renderer.createElement('svg');
        const defs = this.renderer.createElement('defs');
        this.renderer.appendChild(svg, defs);
        this.renderer.appendChild(document.body, svg); */
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('height',"0");
        svg.setAttribute('width',"0");
        var svgNS = svg.namespaceURI;
        const defs = document.createElementNS(svgNS,'defs');
        const clipPath = document.createElementNS(svgNS,'clipPath');
        const rect = document.createElementNS(svgNS,'rect');
        rect.setAttribute('x',"5");
        rect.setAttribute('y',"5");
        rect.setAttribute('width',"500");
        rect.setAttribute('height',"500");
        rect.setAttribute('fill','#95B3D7');
        clipPath.id = 'spTest';
        svg.appendChild(defs);
        defs.appendChild(clipPath);
        clipPath.appendChild(rect);
        document.body.appendChild(svg);
    }

    get activeElementChanges() {
        return this.activeElementSubject.asObservable();
    }

    setActiveElement(key: string) {
        this.activeElementSubject.next(key);
    }

    close() {
        this.activeElementSubject.next(null);
    }
}
