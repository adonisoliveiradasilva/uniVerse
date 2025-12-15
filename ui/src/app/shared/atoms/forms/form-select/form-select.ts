import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, forwardRef, ViewChild, ChangeDetectorRef, inject, OnInit, Injector } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, ControlValueAccessor, NgControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { IButtonMenuOption } from '../../../../core/models/button-menu-option.model';

@Component({
  selector: 'app-form-select',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatMenuModule, FormsModule],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelect),
      multi: true
    }
  ]
})
export class FormSelect implements ControlValueAccessor, OnInit {
  @Input() label!: string;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() @HostBinding('style.width') width: string = '100%';
  @Input() options!: IButtonMenuOption[];

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  
  searchOption: string = '';
  selectedOption: IButtonMenuOption = { label: 'Selecionar' };
  
  public ngControl: NgControl | null = null;

  private _cdr = inject(ChangeDetectorRef);
  private _injector = inject(Injector);

  ngOnInit() {
    this.ngControl = this._injector.get(NgControl, null);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get isInvalid(): boolean {
    return !!(this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty));
  }

  onChange: any = (value: any) => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (!this.options) {
      setTimeout(() => this.writeValue(value), 50);
      return;
    }
   
    const selected = this.options.find(opt => opt.label === value);
    this.selectedOption = selected || { label: 'Selecionar' };
    this._cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdr.detectChanges();
  }

  get getMenuFarmItems(): IButtonMenuOption[] {
    if (!this.options) return [];
    if (!this.searchOption) return this.options;
    return this.options.filter(item => 
      item.label.toLowerCase().includes(this.searchOption.toLowerCase())
    );
  }

  preventMenuClose(event: Event) {
    event.stopPropagation();
  }

  onMenuOpened() {
    this.menuTrigger.menuClosed.subscribe(() => {
      if (this.searchOption) {
        this.menuTrigger.openMenu();
      }
    });
  }

  selectOption(option: IButtonMenuOption) {
    this.selectedOption = option;
    this.onChange(option.label); 
    this.onTouched();
  }
}