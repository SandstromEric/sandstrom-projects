import { Component, OnInit } from '@angular/core';
import { ElementHighlighterService } from '@sandstroms/element-highlighter';

@Component({
    selector: 'sp-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'sand-ui';
    menuOpened = false;
    constructor(private highlightService: ElementHighlighterService) { }

    ngOnInit(): void {
        console.log('test');
    }

    toggleDrawer() {
        this.menuOpened = !this.menuOpened;
    }

    updateOverlay(key: string) {
        this.highlightService.setActiveElement(key);
    }

    closeOverlay() {
        this.highlightService.close();
    }

    onBackDropClick(event: unknown) {
        console.log(event)
        this.closeOverlay();
    }
}
