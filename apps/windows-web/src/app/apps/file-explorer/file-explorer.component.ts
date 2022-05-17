import { Component, OnDestroy, OnInit } from '@angular/core';
import { Application } from '../../models/application';

@Component({
    selector: 'sandstrom-projects-file-explorer',
    templateUrl: './file-explorer.component.html',
    styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent extends Application implements OnInit, OnDestroy {
    icon = 'folder';
    name = 'File Explorer';

    constructor() {
        super();
    }

    ngOnInit(): void {
        console.log('file init');
    }

    ngOnDestroy() {
        console.log('destroy');
    }
}
