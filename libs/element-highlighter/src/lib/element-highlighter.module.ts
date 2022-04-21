import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementHighlighterComponent } from './element-highlighter/element-highlighter.component';
import { ElementHighlighterService } from './element-highlighter.service';

@NgModule({
  imports: [CommonModule],
  declarations: [ElementHighlighterComponent],
  exports: [ElementHighlighterComponent],
  providers: [ElementHighlighterService],
})
export class ElementHighlighterModule {}
