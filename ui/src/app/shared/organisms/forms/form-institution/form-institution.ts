import { ChangeDetectorRef, Component, inject, Output } from '@angular/core';
import { FormInput } from '../../../atoms/forms/form-input/form-input';
import { TableTdType } from '../../../../core/types/table-td.type';
import { TableAction, TableContextEnum } from '../../../../core/types/table-context.type';
import { Subscription, finalize, take } from 'rxjs';
import { FormBusService } from '../../../../services/rxjs/form-bus-service/form-bus-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITableRow } from '../../../../core/models/table.model';
import { FormModal } from '../../../../services/rxjs/form-modal-service/form-modal-service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../services/rxjs/alert-service/alert-service';
import { InstitutionService } from '../../../../services/api/institution-service/institution-service'
@Component({
  selector: 'app-form-institution',
  imports: [FormInput, ReactiveFormsModule, CommonModule],
  templateUrl: './form-institution.html',
  styleUrl: './form-institution.scss'
})
export class FormInstitution {
  private _formBusService = inject(FormBusService);
  private _formBuilder = inject(FormBuilder);
  private _subscription = new Subscription();
  private _cdr = inject(ChangeDetectorRef);
  private _formModalService = inject(FormModal);
  private _alertService = inject(AlertService);
  private _institutionService = inject(InstitutionService);

  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  action: TableAction | null = null;
  identifier: string | null = null;
  isLoading: boolean = false;

  form!: FormGroup;

  _rows: ITableRow[] = [
    {
      id: 'DECEA',
      name: 'DECEA'
    },
    {
      id: 'DECSI',
      name: 'DECSI'
    },
    {
      id: 'DEELT',
      name: 'DEELT'
    }
  ]

  _columns = [ 
    {
      key: 'name',
      header: 'Nome do departamento',
      type: TableTdType.Text
    },
  ]

  ngOnInit() {
    this.form = this._formBuilder.group({
      nameInstitution: ['', [Validators.required, Validators.minLength(3)]],
      acronymInstitution: ['', [Validators.required, Validators.minLength(3)]],
    });

    // this._formModalService.modalStack$.subscribe(stack => {
      const currentModal = this._formModalService.currentModal;      
      this.action = currentModal?.action ?? null;
      this.identifier = currentModal?.identifier ?? null;

      this.form.reset();
      if (this.action === 'edit' && this.identifier) {
        this._loadEntityData(this.identifier as string);
      } else {
        this.form.get('acronymInstitution')?.enable();
        this._formModalService.setNameConfirm(null);
      }
    // });

    this._subscription.add(
      this._formBusService.submitForm$.subscribe(() => {
        this._handleSubmit();
      })
    );
  }

  private _loadEntityData(acronym: string) {
    this.isLoading = true;
    this._institutionService.getInstitutionByAcronym(acronym).pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this._cdr.detectChanges();
      })
    ).subscribe(institution => {
        this.form.patchValue({
          nameInstitution: institution.name,
          acronymInstitution: institution.acronym
        });
        this._formModalService.setNameConfirm(institution.name);        
        this.form.get('acronymInstitution')?.disable();
      });
  }

  private _handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      this._alertService.warn('Por favor, preencha os campos corretamente. (Mínimo 3 caracteres)');
      return;
    }

    const acronymControl = this.form.get('acronymInstitution');
    if (acronymControl?.disabled) {
      acronymControl.enable();
    }

    const payload = {
      source: TableContextEnum.Institution,
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
