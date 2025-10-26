import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormInput } from '../../../atoms/forms/form-input/form-input';
import { TableTdType } from '../../../../core/types/table-td.type';
import { TableAction, TableContextEnum } from '../../../../core/types/table-context.type';
import { Subscription, finalize, take } from 'rxjs';
import { FormBusService } from '../../../../services/rxjs/form-bus-service/form-bus-service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormModal } from '../../../../services/rxjs/form-modal-service/form-modal-service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../services/rxjs/alert-service/alert-service';
import { CourseService } from '../../../../services/api/course-service/course-service'

@Component({
  selector: 'app-form-course',
  imports: [FormInput, ReactiveFormsModule, CommonModule],
  templateUrl: './form-course.html',
  styleUrl: './form-course.scss'
})
export class FormCourse {
private _formBusService = inject(FormBusService);
  private _formBuilder = inject(FormBuilder);
  private _subscription = new Subscription();
  private _cdr = inject(ChangeDetectorRef);
  private _formModalService = inject(FormModal);
  private _alertService = inject(AlertService);
  private _courseService = inject(CourseService);

  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  action: TableAction | null = null;
  identifier: string | null = null;
  isLoading: boolean = false;

  form!: FormGroup;

  ngOnInit() {
    this.form = this._formBuilder.group({
      nameCourse: ['', [Validators.required, Validators.minLength(3)]],
      periodsQuantityCourse: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), this.notZeroValidator]],
      descriptionCourse: [''],
      codeCourse: ['', [Validators.required, Validators.minLength(3)]]
    });

    const currentModal = this._formModalService.currentModal;      
    this.action = currentModal?.action ?? null;
    this.identifier = currentModal?.identifier ?? null;

    this.form.reset();
    if (this.action === 'edit' && this.identifier) {
      this._loadEntityData(this.identifier as string);
    } else {
      this.form.get('codeCourse')?.enable();
      this._formModalService.setNameConfirm(null);
    }

    this._subscription.add(
      this._formBusService.submitForm$.subscribe(() => {
        this._handleSubmit();
      })
    );
  }

  notZeroValidator(control: AbstractControl): ValidationErrors | null {
    const value = Number(control.value);
    if (isNaN(value)) return null;
    return value === 0 ? { notZero: true } : null;
  }

  private _loadEntityData(acronym: string) {
    this.isLoading = true;
    // const institutionAcronym = this._institutionService.getCurrentInstitutionAcronym(); // Criar esse método depois
    const institutionAcronym = "UFOP"
    this._courseService.getCourseByCode(institutionAcronym, acronym).pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this._cdr.detectChanges();
      })
    ).subscribe(course => {
        this.form.patchValue({
          nameCourse: course.name,
          codeCourse: course.code,
          periodsQuantityCourse: course.periodsQuantity,
          descriptionCourse: course.description
        });
        this._formModalService.setNameConfirm(course.name);        
        this.form.get('codeCourse')?.disable();
      });
  }

  private _handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      this._alertService.warn('Por favor, preencha os campos corretamente. (Mínimo 3 caracteres)');
      return;
    }

    const acronymControl = this.form.get('codeCourse');
    if (acronymControl?.disabled) {
      acronymControl.enable();
    }

    const payload = {
      source: TableContextEnum.Courses,
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
