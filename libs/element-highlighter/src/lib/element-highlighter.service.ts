import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ElementHighlighterService {
    private activeElementSubject = new BehaviorSubject<string | null>(null);
    //constructor() { }

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
