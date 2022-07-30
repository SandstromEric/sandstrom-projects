import { ChangeDetectorRef, Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Application } from '../../models/application';
import { TalentTreeService } from '../../services/talent-tree.service';
import { WindowComponent } from '../../window/window.component';
import { TalentTrees } from './talent-tree';

@Component({
    selector: 'sandstrom-projects-talent-tree',
    templateUrl: './talent-tree.component.html',
    styleUrls: ['./talent-tree.component.scss'],
})
export class TalentTreeComponent extends Application implements OnInit {
    icon = 'school';
    loading = false;

    talentTrees: TalentTrees = {
        class: {
            name: '',
            staticTalents: new Map(),
            dynamicTalents: new Map(),
            connections: [],
            maxPoints: 31,
            spentPoints: 0,
        },
        spec: {
            name: '',
            staticTalents: new Map(),
            dynamicTalents: new Map(),
            connections: [],
            maxPoints: 30,
            spentPoints: 0,
        }
    }

    data: any = {}
    checkpoints: number[] = [];
    
    private subjectPointPing = new Subject();
    constructor(@Inject(forwardRef(() => WindowComponent)) private window: WindowComponent, private talentTreeService: TalentTreeService, private cdr: ChangeDetectorRef) {
        super();
        this.data = this.window.data?.applicationData;
    }
    
    async ngOnInit() {
        this.window.windowMinHeight = 554;
        this.window.windowMinWidth = 918;
        this.window.setPosition(50, 50);
        
        this.loading = true;
        const response = await this.talentTreeService.getTalentTree(this.data.clazz, this.data.spec)
        console.log(response)

        for(const key in response) {
            response[key as 'class'| 'spec'].talents.map(item => {
                if(!this.checkpoints.length && item.checkpoints) {
                    this.checkpoints = item.checkpoints;
                }

                this.talentTrees[key as 'class'| 'spec'].name = response[key as 'class'| 'spec'].name;
                this.talentTrees[key as 'class'| 'spec'].staticTalents.set(`${item.cell}`, item)
                this.talentTrees[key as 'class' | 'spec'].dynamicTalents.set(`${item.cell}`, {spent: 0, available: false});
                

                for(const con of item.connections) {
                    if(item.connections.length) { 
                        this.talentTrees[key as 'class'| 'spec'].connections.push([''+item.cell, con]);
                    }
                }
                
            });
        }
        this.loading = false;
        console.log(this.talentTrees)
        
        /* response.classTalentTree.map((item: any) => {
            if(!this.checkpoints.length && item.checkpoints) {
                this.checkpoints = item.checkpoints;
            }
            this.classTalents.set(`${item.cell}`, item)
            this.dynamicClassTalents.set(`${item.cell}`, {spent: 0, available: false});
        });

        response.specTalentTree.map((item: any) => {
            this.specTalents.set(`${item.cell}`, item)
            this.dynamicSpecTalents.set(`${item.cell}`, {spent: 0, available: false});
        });
        
        for(const [index, tree] of [response.classTalentTree, response.specTalentTree].entries()) {
            for(const talent of tree) {
                //this.setNextTalentsAvailability(talent.cell);
                if(talent.connections.length) {
                    for(const con of talent.connections) {
                        if(index === 0) {
                            this.classConnections.push([talent.cell, con])
                        } else {
                            this.specConnections.push([talent.cell, con])
                        }
                        
                    }
                }
            }
        }

        this.loading = false;

        this.subjectPointPing.subscribe(() => {
            
            for(const talent of response.classTalentTree) {
                this.setNextTalentsAvailability(this.dynamicClassTalents, talent.cell);
            }
        }) */
    }

    get name() {
        return this.data.clazz + ' - ' + this.data.spec;
    }

    /* get classPointsLeft() {
        return this.maxClassPoints - this.spentClassPoints;
    }

    get specPointsLeft() {
        return this.maxSpecPoints - this.spentSpecPoints;
    }

    get allTrees() {
        return [this.classTalents, this.specTalents];
    }

    getDynamicCell(tree: Map<string, any>, cell: number) {
        return tree.get(`${cell}`);
    }

    getConnections(index: number) {
        return index === 0 ? this.classConnections : this.specConnections;
    } */

    setDynamicCell(cell: number) {
        /* const dc = this.getDynamicCell(cell);
        const sc = this.classTalents.get(`${cell}`);
        this.setNextTalentsAvailability(sc,dc) */
        //this.dynamicClassTalents.set(cell, {...dc});
    }

    /* setNextTalentsAvailability(tree: Map<string, any>, cell: number) {
        const dc = this.getDynamicCell(tree, cell);
        const sc = this.classTalents.get(`${cell}`);
        if(!sc.connections.length) {
            dc.available = true;
        }

        if(dc.spent === sc.points && sc.requiresMinPoints <= this.spentClassPoints) {
            sc.nextTalents.map((item: any) => {
                const obj = this.dynamicClassTalents.get(`${item}`);
                this.dynamicClassTalents.set(`${item}`,{...obj, available: this.classPointsLeft === 0 ? !!obj.spent : true});
            })
        }

        if(dc.spent !== sc.points) {
            sc.nextTalents.map((item: any) => {
                const obj = this.dynamicClassTalents.get(`${item}`);
                this.dynamicClassTalents.set(`${item}`,{spent: 0, available: false});
            })
        }
    } */

    /* spendPoint(tree: Map<string, any>, cell: any) {
        const dc = this.getDynamicCell(tree, cell);
        const sc = this.classTalents.get(`${cell}`);

        if(dc.spent < sc.points && dc.available && this.classPointsLeft > 0) {
            dc.spent++;
            this.spentClassPoints++;
            this.setNextTalentsAvailability(tree, cell);
            this.subjectPointPing.next(null);
        }
    } */

    refundPoint(cell: any) {
        /* const dc = this.getDynamicCell(cell);
        const sc = this.classTalents.get(`${cell}`);

        if(dc.spent !== 0 && dc.available && this.classPointsLeft > 0) {
            dc.spent--;
            this.spentClassPoints--;
            this.setNextTalentsAvailability(cell);
            this.subjectPointPing.next(null);
        } */
    }

    getIsAvailable(cell1: number, cell2: number) {
        return
    }

    trackByTalent(index: number, item: any) {
        return item.value.cell + item.value.spellId;
    }
}
