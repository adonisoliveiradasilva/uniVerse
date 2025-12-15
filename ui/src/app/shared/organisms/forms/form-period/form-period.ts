import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription, finalize, take, map } from 'rxjs';

// Componentes Visuais
import { FormSelect } from '../../../atoms/forms/form-select/form-select';
import { FormInput } from '../../../atoms/forms/form-input/form-input';

// Serviços
import { PeriodService } from '../../../../services/api/period-service/period-service';
import { SubjectService } from '../../../../services/api/subject-service/subject-service'; // <--- IMPORTANTE
import { FormBusService } from '../../../../services/rxjs/form-bus-service/form-bus-service';
import { FormModal } from '../../../../services/rxjs/form-modal-service/form-modal-service';
import { AlertService } from '../../../../services/rxjs/alert-service/alert-service';

// Modelos e Constantes
import { IButtonMenuOption } from '../../../../core/models/button-menu-option.model';
import { ISubject } from '../../../../core/models/entitys/ISubject.model';
import { PERIOD_STATUS_OPTIONS } from '../../../../core/data/period-status.data'; // <--- A NOVA CONSTANTE
import { TableAction, TableContextEnum } from '../../../../core/types/table-context.type';

@Component({
  selector: 'app-form-period',
  imports: [ReactiveFormsModule, CommonModule, FormSelect, FormInput],
  templateUrl: './form-period.html',
  styleUrl: './form-period.scss'
})
export class FormPeriod implements OnInit, OnDestroy {
  // Injeções
  private _formBuilder = inject(FormBuilder);
  private _periodService = inject(PeriodService);
  private _subjectService = inject(SubjectService); // Serviço para buscar disciplinas
  private _formModalService = inject(FormModal);
  private _formBusService = inject(FormBusService);
  private _alertService = inject(AlertService);
  private _cdr = inject(ChangeDetectorRef);

  // Variáveis de Estado
  form!: FormGroup;
  isLoading: boolean = false;
  periodId: number | null = null;
  action: TableAction | null = null;
  subjectCodeIdentifier: string | null = null;
  
  private _subscription = new Subscription();

  statusOptions: IButtonMenuOption[] = PERIOD_STATUS_OPTIONS;
  subjectOptions: IButtonMenuOption[] = [];

  ngOnInit() {
    this.form = this._formBuilder.group({
      subjectCode: ['', [Validators.required]], 
      status: ['cursando', [Validators.required]],
      grade: [null, [Validators.min(0), Validators.max(10)]],
      absences: [0, [Validators.required, Validators.min(0)]]
    });

    const currentModal = this._formModalService.currentModal;
    this.action = currentModal?.action ?? null;
    this.subjectCodeIdentifier = currentModal?.identifier ?? null;
    this.periodId = this._periodService.getCurrentPeriodId();

    if (!this.periodId) {
       this._alertService.error("Erro: Período não identificado.");
       this._formModalService.closeModal();
       return;
    }

    if (this.action === 'edit' && this.subjectCodeIdentifier) {
        this._setupEditMode();
    } else if (this.action === 'create') {
        this._setupCreateMode();
    }

    this._subscription.add(
      this._formBusService.submitForm$.subscribe(() => {
        if (this._formModalService.currentModal?.context === TableContextEnum.Periods) {
            this._handleSubmit();
        }
      })
    );
  }

  private _setupCreateMode() {
    this.form.get('subjectCode')?.enable();
    this._loadAvailableSubjects();
  }

  private _loadAvailableSubjects() {
    this.isLoading = true;
    this._subjectService.getAvailableSubjects().pipe(
      take(1),
      map((subjects: ISubject[]) => 
        subjects.map((subject, index) => ({
          id: index,
          label: subject.code
        }))
      ),
      finalize(() => {
        this.isLoading = false;
        this._cdr.detectChanges();
      })
    ).subscribe({
      next: (options) => {
        this.subjectOptions = options;
        if (options.length === 0) {
            this._alertService.warn("Você não possui disciplinas disponíveis para vincular.");
        }
      },
      error: () => this._alertService.error("Erro ao carregar disciplinas disponíveis.")
    });
  }

  private _setupEditMode() {
    this.form.get('subjectCode')?.disable();
    
    const currentSubjects = this._periodService.getCurrentPeriodSubjects();
    const subjectToEdit = currentSubjects.find(s => s.subjectCode === this.subjectCodeIdentifier);

    if (subjectToEdit) {
        this.subjectOptions = [{ id: 1, label: subjectToEdit.subjectCode }];
        
        this.form.patchValue({
            subjectCode: subjectToEdit.subjectCode,
            status: subjectToEdit.status,
            grade: subjectToEdit.grade,
            absences: subjectToEdit.absences
        });
        this._formModalService.setNameConfirm(subjectToEdit.subjectCode);
    }
  }

  private _handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._alertService.warn('Preencha os campos obrigatórios.');
      return;
    }

    if (this.action === 'create') {
        this._handleCreate();
    } else if (this.action === 'edit') {
        this._handleEdit();
    }
  }

  private _handleCreate() {
    if (!this.periodId) return;
    
    const newSubjectEntry = {
      subjectCode: this.form.value.subjectCode,
      status: this.form.value.status,
      grade: this.form.value.grade,
      absences: this.form.value.absences
    };

    const currentSubjects = this._periodService.getCurrentPeriodSubjects();
    
    const existingSubjectsDto = currentSubjects.map(s => ({
      subjectCode: s.subjectCode,
      status: s.status,
      grade: s.grade,
      absences: s.absences
    }));

    const updatedSubjectList = [...existingSubjectsDto, newSubjectEntry];
    
    this._periodService.updatePeriodSubjectsList(this.periodId, updatedSubjectList)
      .pipe(take(1))
      .subscribe({
        next: () => this._formModalService.closeModal(),
        error: (err) => console.error("Falha ao adicionar disciplina", err)
      });
  }

  private _handleEdit() {
      if (!this.periodId || !this.subjectCodeIdentifier) return;

      const payload = {
        status: this.form.value.status,
        grade: this.form.value.grade,
        absences: this.form.value.absences
      };

      this._periodService.updateEnrolledSubjectDetails(this.periodId, this.subjectCodeIdentifier, payload)
        .pipe(take(1))
        .subscribe({
            next: () => this._formModalService.closeModal(),
            error: (err) => console.error(err)
        });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}