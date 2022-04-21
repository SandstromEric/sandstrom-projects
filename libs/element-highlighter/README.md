# Angular Element Highlighter

Angular Element Highlighter is an Angular library for highlighting elements with a backdrop around the element.

## Prerequsites

Requires version 10+ @angular/core and @angular/cdk

## Installation

```bash
npm install @sandstroms/element-highlighter
```

## Usage

```typescript
import { ElementHighlighterModule } from '@sandstroms/element-highlighter';

@NgModule({
  imports: [ElementHighlighterModule],
})
export class Module {}
```

## Examples

### Template

```HTML
<div spHighlight="test1" spHighlightNext="test2" spHighlightTooltip="Tooltip text here.">
    Test 1
</div>
<div spHighlight="test2" spHighlightNext="test3">
    Test 2
</div>
<div spHighlight="test3" spHighlightNext="test4">
    Test 3
</div>
<div spHighlight="test4" (spHighlightBackDropClick)="onBackDropClick()"
        spHighlightDisableBackdropAutoClose spHighlightTooltip="This is the end">
    Test 4
</div>
```

### Component

```typescript
import { Component, OnInit } from '@angular/core';
import { ElementHighlighterService } from '@sandstroms/element-highlighter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private highlightService: ElementHighlighterService) {}

  ngOnInit(): void {
    this.highlightService.activeElementChanges.subscribe((key) => {
      console.log('current active element is: ' + key);
    });

    this.showHighlight('test1');
  }

  showHighlight(key: string) {
    this.highlightService.setActiveElement(key);
  }

  closeOverlay() {
    this.highlightService.close();
  }

  onBackDropClick() {
    this.closeOverlay();
  }
}
```

## Documentation

### Properties

| Name                                                                                   | Description                                                                           |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `@Input() spHightlight: string`                                                        | Key for element to target highlighting                                                |
| `@Input() spHighlightNext: string`                                                     | Key on which element to automatically highlight next when current highlight is closed |
| `@Input() spHighlightTooltip: string`                                                  | Tooltip for highlight when opened                                                     |
| `@Input() spHighlightDisableBackdropAutoClose: boolean`                                | Whether to automatically close the highlight on backdrop click                        |
| `@Output() spHighlightBackDropClick: EventEmitter<{key: string, event: PointerEvent}>` | Whether to automatically close the highlight on backdrop click                        |

### ElementHighlighterService

| Name                                             | Description                                          |
| ------------------------------------------------ | ---------------------------------------------------- |
| activeElementChanges: Observable<string \| null> | Observable that updates the current active element   |
| setActiveElement(key: string): void              | Sets the current active element that matches the key |
| close(): void                                    | Sets the current active element to null              |

## License

[MIT](https://choosealicense.com/licenses/mit/)
