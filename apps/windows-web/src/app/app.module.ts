import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@sandstrom-projects/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WindowComponent } from './window/window.component';
import { FileExplorerComponent } from './apps/file-explorer/file-explorer.component';
import { ElementClickBounceDirective } from './directives/element-click-bounce.directive';
import { OrdleComponent } from './apps/ordle/ordle.component';

@NgModule({
  declarations: [
    AppComponent,
    WindowComponent,
    FileExplorerComponent,
    ElementClickBounceDirective,
    OrdleComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
