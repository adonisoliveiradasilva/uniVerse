import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-input',
  imports: [ CommonModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss'
})
export class FormInput implements OnInit {
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() value: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  private _showPassword: boolean = false;
  private _type: string = '';

  ngOnInit(): void{
    this._type = this.type;
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
  }

  onToggleEye(): void{
    if (this._type === 'password') {
      this._type = 'text';
    } else {
      this._type = 'password';
    }
    this._showPassword = !this._showPassword;
  }

  get showPassword(): boolean {
    return this._showPassword;
  }

  get inputType(): string {
    return this._type;
  }
}
