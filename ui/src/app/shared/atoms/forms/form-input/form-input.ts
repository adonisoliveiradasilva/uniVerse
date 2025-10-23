import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [ CommonModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true
    }
  ]
})
export class FormInput implements OnInit {
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() value: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() @HostBinding('style.width') width: string = '100%';

  private _showPassword: boolean = false;
  private _type: string = '';

  ngOnInit(): void{
    this._type = this.type;
  }

  get showPassword(): boolean {
    return this._showPassword;
  }

  get inputType(): string {
    return this._type;
  }

  onInput(event: Event): void {
      const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }

  onToggleEye(): void{
    if (this._type === 'password') {
      this._type = 'text';
    } else {
      this._type = 'password';
    }
    this._showPassword = !this._showPassword;
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
