import { CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragRelease, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, HostListener, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FileExplorerComponent } from './apps/file-explorer/file-explorer.component';
import { OrdleComponent } from './apps/ordle/ordle.component';
import { TalentTreeComponent } from './apps/talent-tree/talent-tree.component';
import { WindowService } from './services/window.service';
import { WindowComponent } from './window/window.component';

@Component({
    selector: 'sandstrom-projects-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('windows', { read: ViewContainerRef },) windows!: ViewContainerRef;

    applications = [FileExplorerComponent, FileExplorerComponent, FileExplorerComponent, FileExplorerComponent]

    windowRefs: { [key: string]: ComponentRef<WindowComponent> } = {}

    pinnedWindows$ = this.windowService.pinnedWindowsChanges;

    leftMenuOpened = false;
    homeMenuOpened = false;
    rightMenuOpened = false;
    currentPointerPosition: { x: number, y: number } = { x: 0, y: 0 };
    @HostListener('document:mousedown', ['$event']) onMouseDown(event: any) {
        if (event.target?.innerText === 'home' || event.target?.innerText === 'menu' || event.target?.innerText === 'settings') {
            return;
        }

        if (!event.target.classList.contains('drawer')) {
            this.leftMenuOpened = false;
            this.rightMenuOpened = false;
            this.homeMenuOpened = false;
        }
    }

    @HostListener('document:mouseup', ['$event']) onMouseUp(event: any) {

        if (event.target?.innerText === 'home') {
            this.homeMenuOpened = !this.homeMenuOpened;
            this.leftMenuOpened = false;
            this.rightMenuOpened = false;
            return;
        }

        if (event.target?.innerText === 'menu') {
            this.leftMenuOpened = !this.leftMenuOpened;
            this.rightMenuOpened = false;
            this.homeMenuOpened = false;
            return;
        }

        if (event.target?.innerText === 'settings') {
            this.rightMenuOpened = !this.rightMenuOpened;
            this.leftMenuOpened = false;
            this.homeMenuOpened = false;
            return;
        }

        if (!event.target.classList.contains('drawer')) {
            this.leftMenuOpened = false;
            this.rightMenuOpened = false;
            this.homeMenuOpened = false;
        }
    }

    constructor(private windowService: WindowService, private cdr: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        this.windowService.onDestroy.subscribe((id) => {
            this.windowService.removePinnedWindow(id);
            this.windowRefs[id].destroy();
            delete this.windowRefs[id];
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            /* for (let app of this.applications) {
                const data = { id: this.generateId, component: app };
                const injector = Injector.create({ providers: [{ provide: 'Application', useValue: data }] });
                const ref = this.windows.createComponent(WindowComponent, { injector });
                this.windowRefs[data.id] = ref;
            } */
            const windows = [{clazz: 'rogue', spec: 'assassination'}, {clazz: 'evoker', spec: 'devastation'}]
            for (const window of windows) {
                const data = { id: this.generateId, component: TalentTreeComponent, applicationData: window };
                const injector = Injector.create({ providers: [{ provide: 'Application', useValue: data }] });
                const ref = this.windows.createComponent(WindowComponent, { injector });
                
                this.windowRefs[data.id] = ref;
            }
        }, 0);
    }

    get generateId() {
        const typedArray = new Uint8Array(10);
        const randomValues = window.crypto.getRandomValues(typedArray);
        return randomValues.join('');
    }

    cdkDragDropped(event: CdkDragDrop<any[]>) {
        moveItemInArray(this.windowService.pinnedWindowsValue, event.previousIndex, event.currentIndex);
    }

    cdkDragMoved(event: CdkDragMove<any>) {
        this.currentPointerPosition = event.pointerPosition;
    }

    cdkDragReleased(event: CdkDragRelease<any>, { id }: { id: string }) {
        if (this.currentPointerPosition.y > 60) {
            this.windowService.removePinnedWindow({ id });
            this.cdr.detectChanges();
        }
    }

    setWindowAsActive({ id }: { id: string }) {
        const comp = this.windowRefs[id]?.instance;
        if (comp) {
            comp.setWindowAsActive();
        }
    }

    toggleHomeMenu() {
        this.homeMenuOpened = !this.homeMenuOpened;
    }

    toggleLeftMenu() {
        this.leftMenuOpened = !this.leftMenuOpened;
    }

    toggleRightMenu() {
        this.rightMenuOpened = !this.rightMenuOpened;
    }
}

const talentTree = {
    clazz: 'Rogue',
    spec: 'Assassination',
    gridLengthx: 18,
    gridLengthy: 10,
    startingTalent: 0,
    talents: [
        {   
            id: 0,
            name: 'Garrote',
            col: 3,
            row: 1,
            requirements: null,
            totalPoints: 1,
            type: 'active'
        },
        {
            id: 1,
            name: 'Blind',
            col: 9,
            row: 1,
            requirements: null,
            totalPoints: 1,
            type: 'active'
        },
        {
            id: 2,
            name: 'Sap',
            col: 15,
            row: 1,
            requirements: null,
            totalPoints: 1,
            type: 'active'
        },
        {
            id: 3,
            name: 'Evasion',
            col: 5,
            row: 2,
            requirements: {
                id: 0
            },
            totalPoints: 1,
            type: 'active'
        },
        {
            id: 4,
            name: 'Feint',
            col: 9,
            row: 2,
            requirements: {
                id: 1
            },
            totalPoints: 1,
            type: 'active'
        },
        {
            id: 31224,
            name: 'Cloak of Shadows',
            col: 13,
            row: 2,
            requirements: {
                id: 2
            },
            totalPoints: 1,
            type: 'active'
        },
    ]
}