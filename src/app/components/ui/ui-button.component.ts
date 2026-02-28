import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="getButtonClasses()"
      [disabled]="disabled"
      [type]="type"
      (click)="handleClick($event)"
      #buttonElement>
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class UiButtonComponent {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'default';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() className: string = '';
  @Input() loading: boolean = false;
  
  @Output() buttonClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }

  getButtonClasses(): string {
    const baseClasses = 'btn';
    const variantClass = `btn-${this.variant}`;
    const sizeClass = this.size !== 'default' ? `btn-${this.size}` : '';
    const loadingClass = this.loading ? 'opacity-50 cursor-not-allowed' : '';
    
    return [
      baseClasses,
      variantClass,
      sizeClass,
      loadingClass,
      this.className
    ].filter(Boolean).join(' ');
  }
}