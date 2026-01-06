import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit, forwardRef, Injector } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [CommonModule, ReactiveFormsModule],
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
export class FormInput implements OnInit, ControlValueAccessor {
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() value: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() context: 'default' | 'calendar' = 'default';
  @Input() @HostBinding('style.width') width: string = '100%';

  private _showPassword: boolean = false;
  private _type: string = '';

  public ngControl: NgControl | null = null;

  constructor(private _injector: Injector) {}

  ngOnInit(): void{
    this._type = this.type;
    this.ngControl = this._injector.get(NgControl, null, { self: true, optional: true });
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get isInvalid(): boolean {
    return !!(this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty));
  }

  get showPassword(): boolean {
    return this._showPassword;
  }

  get inputType(): string {
    return this._type;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (this.type === 'number') {
      value = value.replace(/[^0-9]/g, '');
    }

    if (this.type === 'float') {
      value = value.replace(/[^0-9.,]/g, '');
    }
    input.value = value;
    this.value = value;
    this.onChange(value);
  }

  onKeyPress(event: KeyboardEvent) {
    const char = event.key;

    if (this.type === 'number' && !/[0-9]/.test(char)) {
      event.preventDefault();
    }

    if (this.type === 'float' && !/[0-9.,]/.test(char)) {
      event.preventDefault();
    }
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
