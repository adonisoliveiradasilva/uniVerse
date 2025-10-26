import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormInput } from '../../../atoms/forms/form-input/form-input';
import { TableTdType } from '../../../../core/types/table-td.type';
import { TableAction, TableContextEnum } from '../../../../core/types/table-context.type';
import { Subscription, finalize, take } from 'rxjs';
import { FormBusService } from '../../../../services/rxjs/form-bus-service/form-bus-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModal } from '../../../../services/rxjs/form-modal-service/form-modal-service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../services/rxjs/alert-service/alert-service';
import { SubjectService } from '../../../../services/api/subject-service/subject-service'

@Component({
  selector: 'app-form-subject',
  imports: [FormInput, ReactiveFormsModule, CommonModule],
  templateUrl: './form-subject.html',
  styleUrl: './form-subject.scss'
})
export class FormSubject {
  private _formBusService = inject(FormBusService);
  private _formBuilder = inject(FormBuilder);
  private _subscription = new Subscription();
  private _cdr = inject(ChangeDetectorRef);
  private _formModalService = inject(FormModal);
  private _alertService = inject(AlertService);
  private _subjectService = inject(SubjectService);

  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  action: TableAction | null = null;
  identifier: string | null = null;
  isLoading: boolean = false;

  form!: FormGroup;

  ngOnInit() {
    this.form = this._formBuilder.group({
      nameSubject: ['', [Validators.required, Validators.minLength(3)]],
      hoursSubject: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      codeSubject: ['', [Validators.required, Validators.minLength(3)]],
      descriptionSubject: ['', [Validators.required, Validators.minLength(3)]]
    });

    const currentModal = this._formModalService.currentModal;      
    this.action = currentModal?.action ?? null;
    this.identifier = currentModal?.identifier ?? null;

    this.form.reset();
    if (this.action === 'edit' && this.identifier) {
      this._loadEntityData(this.identifier as string);
    } else {
      this.form.get('codeSubject')?.enable();
      this._formModalService.setNameConfirm(null);
    }

    this._subscription.add(
      this._formBusService.submitForm$.subscribe(() => {
        this._handleSubmit();
      })
    );
  }

  private _loadEntityData(acronym: string) {
    this.isLoading = true;
    // const institutionAcronym = this._institutionService.getCurrentInstitutionAcronym(); // Criar esse método depois
    const institutionAcronym = "UFOP"
    this._subjectService.getSubjectByCode(institutionAcronym, acronym).pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this._cdr.detectChanges();
      })
    ).subscribe(subject => {
        this.form.patchValue({
          nameSubject: subject.name,
          codeSubject: subject.code,
          hoursSubject: subject.hours,
          descriptionSubject: subject.description
        });
        this._formModalService.setNameConfirm(subject.name);        
        this.form.get('codeSubject')?.disable();
      });
  }

  private _handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      this._alertService.warn('Por favor, preencha os campos corretamente. (Mínimo 3 caracteres)');
      return;
    }

    const acronymControl = this.form.get('codeSubject');
    if (acronymControl?.disabled) {
      acronymControl.enable();
    }

    const payload = {
      source: TableContextEnum.Subjects,
      data: this.form.value
    }

    if (this.action === 'edit') {
       acronymControl?.disable();
    }

    this._formBusService.sendPayload(payload);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
