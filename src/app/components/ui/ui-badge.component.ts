import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getBadgeClasses()">
      <ng-content></ng-content>
    </span>
  `,
  styles: []
})
export class UiBadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() className: string = '';

  getBadgeClasses(): string {
    const baseClass = 'badge';
    let variantClass = '';
    
    switch (this.variant) {
      case 'pending':
        variantClass = 'status-pending';
        break;
      case 'approved':
        variantClass = 'status-approved';
        break;
      case 'rejected':
        variantClass = 'status-rejected';
        break;
      default:
        variantClass = `badge-${this.variant}`;
    }
    
    return [baseClass, variantClass, this.className].filter(Boolean).join(' ');
  }
}