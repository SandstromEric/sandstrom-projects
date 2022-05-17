import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
    exports: [
        MatIconModule,
        MatRippleModule
    ]
})
export class MaterialModule {
    constructor(private matIconRegistry: MatIconRegistry) {
        this.matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');
    }
}
