import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class UiCardComponent {
  @Input() className: string = '';

  getCardClasses(): string {
    return ['enhanced-card', this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getHeaderClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class UiCardHeaderComponent {
  @Input() className: string = '';

  getHeaderClasses(): string {
    return ['enhanced-card-header', this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h4 [class]="getTitleClasses()">
      <ng-content></ng-content>
    </h4>
  `,
  styles: []
})
export class UiCardTitleComponent {
  @Input() className: string = '';

  getTitleClasses(): string {
    return ['enhanced-card-title', this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="getDescriptionClasses()">
      <ng-content></ng-content>
    </p>
  `,
  styles: []
})
export class UiCardDescriptionComponent {
  @Input() className: string = '';

  getDescriptionClasses(): string {
    return ['enhanced-card-description', this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getContentClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class UiCardContentComponent {
  @Input() className: string = '';

  getContentClasses(): string {
    return ['enhanced-card-content', this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getFooterClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class UiCardFooterComponent {
  @Input() className: string = '';

  getFooterClasses(): string {
    return ['enhanced-card-footer', this.className].filter(Boolean).join(' ');
  }
}