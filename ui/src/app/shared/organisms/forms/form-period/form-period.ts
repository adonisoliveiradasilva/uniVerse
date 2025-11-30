import { Component, inject } from '@angular/core';
import { FormBusService } from '../../../../services/rxjs/form-bus-service/form-bus-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormSelect } from '../../../atoms/forms/form-select/form-select';
import { FormInput } from '../../../atoms/forms/form-input/form-input';


@Component({
  selector: 'app-form-period',
  imports: [ReactiveFormsModule, CommonModule, FormSelect, FormInput],
  templateUrl: './form-period.html',
  styleUrl: './form-period.scss'
})
export class FormPeriod {
  private _formBusService = inject(FormBusService);
  private _formBuilder = inject(FormBuilder);

  form!: FormGroup;
  isLoading: boolean = false;

  ngOnInit() {
    this.form = this._formBuilder.group({
      // nameSubject: ['', [Validators.required, Validators.minLength(3)]],
      // hoursSubject: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      // codeSubject: ['', [Validators.required, Validators.minLength(3)]],
      // descriptionSubject: ['']
    });
  }

}