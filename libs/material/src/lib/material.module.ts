import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
    exports: [
        MatIconModule,
        MatRippleModule
    ]
})
export class MaterialModule { }
