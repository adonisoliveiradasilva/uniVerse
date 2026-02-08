import { Component, inject, OnInit } from '@angular/core';
import { TableAction, TableContextEnum, TableContextType } from '../../core/types/table-context.type';
import { FormModal } from '../../services/rxjs/form-modal-service/form-modal-service';
import { CommonModule } from '@angular/common';
import { ShellHeader } from '../../shared/atoms/shell/shell-header/shell-header';
import { Button } from '../../shared/atoms/buttons/button/button';
import { FormBusService } from '../../services/rxjs/form-bus-service/form-bus-service';
import { SubjectService } from '../../services/api/subject-service/subject-service';
import { FormConfirmDisplayDelete } from '../../shared/organisms/forms/form-confirm-display-delete/form-confirm-display-delete';
import { FormSubject } from '../../shared/organisms/forms/form-subject/form-subject';
import { FormPeriod } from '../../shared/organisms/forms/form-period/form-period';
import { PeriodService } from '../../services/api/period-service/period-service';
import { IPeriod } from '../../core/models/entitys/IPeriod.model';
import { TaskService } from '../../services/api/task-service/task-service';
import { ScheduleService } from '../../services/rxjs/schedule-service/schedule-service';
import { AlertService } from '../../services/rxjs/alert-service/alert-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-modal-template',
  imports: [CommonModule, ShellHeader, Button, FormConfirmDisplayDelete, FormSubject, FormPeriod],  
  standalone: true,
  templateUrl: './form-modal-template.html',
  styleUrl: './form-modal-template.scss'
})
export class FormModalTemplate implements OnInit {
  context!: TableContextType;
  action: TableAction | null = null;
  isOpen = false;
  title = '';
  subtitle = '';
  nameConfirm: string | null = null;
  identifier: string | null = null;

  private _formModalService = inject(FormModal);
  private _formBusService = inject(FormBusService);
  private _subjectService = inject(SubjectService);
  private _periodService = inject(PeriodService);
  private _taskService = inject(TaskService)
  private _scheduleService = inject(ScheduleService);
  private _alertService = inject(AlertService);
  private _subscription = new Subscription();


  get getTableContextEnum(): typeof TableContextEnum {
    return TableContextEnum;
  }

  ngOnInit() {
    this._subscription.add(
      this._formModalService.modalStack$.subscribe(stack => {
        const currentModal = stack.at(-1);
        if (currentModal) {
          this.context = currentModal.context;
          this.action = currentModal?.action ?? null;
          this.identifier = currentModal?.identifier ?? null;
          this.nameConfirm = currentModal.nameConfirm ?? null;
        }
        this.isOpen = !!currentModal;
        this.title = this.resolveTitle(this.context, this.action);
        this.subtitle = this.resolveSubtitle(this.context, this.action);
      })
    );
    this._subscription.add(

      this._formBusService.formPayload$.subscribe(payload => {
        if (!payload) return;

        if (this.action === 'create') {
          switch (payload.source) {
            case TableContextEnum.Subjects:
              const subjectData = {
                name: payload.data.nameSubject,
                code: payload.data.codeSubject,
                hours: payload.data.hoursSubject,
                description: payload.data.descriptionSubject ?? ''
              };
              this._subjectService.createSubject(subjectData).subscribe({
                next: () => setTimeout(() => this.close(), 0)
              });
              break;
              
            case TableContextEnum.Periods:
              const periodId_create = this._periodService.getCurrentPeriodId();
              const currentSubjects = this._periodService.getCurrentPeriodSubjects();
              
              if (!periodId_create) return;

              const newSubjectCode = payload.data.subjectCode;
              const updatedSubjectList = [...currentSubjects.map(s => s.subjectCode), newSubjectCode];
              
              this._periodService.updatePeriodSubjectsList(periodId_create, updatedSubjectList).subscribe({
                next: () => this.close()
              });
              break;
          }
        }

        else if (this.action === 'edit') {
          switch (payload.source) {
            case TableContextEnum.Subjects:
              const subjectData = {
                name: payload.data.nameSubject,
                code: payload.data.codeSubject,
                hours: payload.data.hoursSubject,
                description: payload.data.descriptionSubject ?? ''
              };
              this._subjectService.updateSubject(subjectData).subscribe({
                next: () => this.close()
              });
              break;
              
            case TableContextEnum.Periods:
              const periodId_edit = this._periodService.getCurrentPeriodId();
              const subjectCode_edit = this.identifier;

              if (!periodId_edit || !subjectCode_edit) return;

              const updateData = {
                status: payload.data.status,
                grade: payload.data.grade,
                absences: payload.data.absences
              };

              this._periodService.updateEnrolledSubjectDetails(periodId_edit, subjectCode_edit, updateData).subscribe({
                next: () => this.close()
              });
              break;
          }
        }

        else if (this.action === 'delete') {
          switch (payload.source) {
            case TableContextEnum.Subjects:
              this._subjectService.deleteSubject(this.identifier as string).subscribe({
                next: () => this._formModalService.closeAll()
              });
              break;
              
            case TableContextEnum.Periods:
              const periodId_delete = this._periodService.getCurrentPeriodId();
              const subjectCode_delete = this.identifier;
              
              if (!periodId_delete || !subjectCode_delete) return;
              
              const currentSubjects_delete = this._periodService.getCurrentPeriodSubjects();
              
              const updatedSubjectList_delete = currentSubjects_delete
                .map(s => s.subjectCode)
                .filter(code => code !== subjectCode_delete);
                
              this._periodService.updatePeriodSubjectsList(periodId_delete, updatedSubjectList_delete).subscribe({
                next: () => this._formModalService.closeAll()
              });
              break;

            case TableContextEnum.Tasks:
              if (!this.identifier) return;
              const idTask = Number(this.identifier);
              this._taskService.deleteTask(idTask, 'email-do-usuario-via-token').subscribe({
                  next: () => {
                    this._formModalService.closeAll();
                    this._scheduleService.notifyCalendarRefresh();
                    this._scheduleService.changeState('view_tasks');
                    this._alertService.success("Tarefa excluída com sucesso!");
                  }
              });
              break;
          }
        }
      })
    )
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  close() {
    this._formModalService.closeModal();
  }

  openDelete() {
    this._formModalService.openModal(this.context, 'delete', this.identifier, this.nameConfirm);
  }

  confirmDelete() {
    this._formBusService.triggerSubmit();
  }

  save() {
    this._formBusService.triggerSubmit();
  }

  resolveTitle(context: TableContextType | null, action: TableAction | null): string {
    if (!context) return '';
    const map: Record<TableContextType, { create: string; edit: string; delete: string; default: string }> = {
      [TableContextEnum.Subjects]: {
        create: "Criar nova Disciplina",
        edit: "Editar Disciplina",
        delete: "Deletar Disciplina",
        default: "Criar nova Disciplina"
      },
      [TableContextEnum.Periods]: {
        create: "Vincular nova Disciplina",
        edit: "Editar dados da Disciplina no Período",
        delete: "Desvincular Disciplina",
        default: "Vincular nova Disciplina"
      },
      [TableContextEnum.Tasks]: {
        create: "Criar Tarefa", 
        edit: "Editar Tarefa",
        delete: "Excluir Tarefa",
        default: "Tarefa"
      }
    };
    const key = (action ?? 'default') as 'create' | 'edit' | 'delete' | 'default';
    return map[context][key] ?? '';
  }

  resolveSubtitle(context: TableContextType | null, action: TableAction | null): string {
    if (!context) return '';
    const map: Record<TableContextType, { create: string; edit: string; delete: string; default: string }> = {
      [TableContextEnum.Subjects]: {
        create: "Preencha as informações da nova Disciplina",
        edit: "Preencha as informações da Disciplina",
        delete: "Confirme a exclusão da Disciplina",
        default: "Preencha as informações da nova Disciplina"
      },
      [TableContextEnum.Periods]: {
        create: "Preencha as informações da Disciplina",
        edit: "Preencha as informações da Disciplina",
        delete: "Confirme a desvinculação da Disciplina",
        default: "Preencha as informações da Disciplina"
      },
      [TableContextEnum.Tasks]: {
        create: "",
        edit: "",
        delete: "Para excluir, digite o nome da tarefa abaixo.",
        default: ""
      }
    };
    const key = (action ?? 'default') as 'create' | 'edit' | 'delete' | 'default';
    return map[context][key] ?? '';
  }
}