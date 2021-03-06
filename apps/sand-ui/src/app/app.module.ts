import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from '@sandstrom-projects/material';
import { ElementHighlighterModule } from '@sandstroms/element-highlighter';
import { FileExplorerComponent } from './apps/file-explorer/file-explorer.component';
import { TalentTreeComponent } from './apps/talent-tree/talent-tree.component';

const routes: Route[] = [{ path: '', redirectTo: '/', pathMatch: 'full' }];

@NgModule({
  declarations: [AppComponent, FileExplorerComponent, TalentTreeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    ElementHighlighterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
