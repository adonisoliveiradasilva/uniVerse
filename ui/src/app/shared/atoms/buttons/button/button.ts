import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType } from '../../../../core/types/button-type.type';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() type: ButtonType = 'primary'
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }

  getClass(): any { 
    const type = this.type
    return { 
      'secondary-button': type === 'secondary', 
      'delete-button': type === 'delete', 
      'login-button': type === 'login', 
      'span-button': type === 'span', 
      'register-button': type === 'register'
    };
  }
}
