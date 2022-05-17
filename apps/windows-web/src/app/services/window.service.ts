import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    private destroy_subject = new Subject<string>();
    private activeCounter = 0;

    private pinned_windows_subject = new BehaviorSubject<any[]>([]);
    private pinned_windows_map: Map<string, any> = new Map();

    //constructor() { }

    get onDestroy() {
        return this.destroy_subject.asObservable();
    }

    destroy(id: string) {
        this.destroy_subject.next(id);
    }

    get active() {
        return this.activeCounter;
    }

    setAsActive() {
        this.activeCounter++;
        return this.active;
    }

    get pinnedWindowsChanges() {
        return this.pinned_windows_subject.asObservable();
    }

    get pinnedWindowsValue() {
        return this.pinned_windows_subject.getValue();
    }

    addPinnedWindow(window: any) {
        this.pinned_windows_map.set(window.id, window);
        this.setPinnedWindows();
    }

    removePinnedWindow(window: any) {
        this.pinned_windows_map.delete(window.id);
        this.setPinnedWindows();
    }

    getPinnedWindow(id: string) {
        return this.pinned_windows_map.get(id);
    }

    isWindowPinned(id: string) {
        return this.pinned_windows_map.has(id);
    }

    private setPinnedWindows() {
        this.pinned_windows_subject.next(Array.from(this.pinned_windows_map.values()));
    }
}
