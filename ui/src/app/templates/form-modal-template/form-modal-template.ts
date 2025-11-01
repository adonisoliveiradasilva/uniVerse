import { Component, inject } from '@angular/core';
import { TableAction, TableContextEnum, TableContextType } from '../../core/types/table-context.type';
import { FormModal } from '../../services/rxjs/form-modal-service/form-modal-service';
import { CommonModule } from '@angular/common';
import { ShellHeader } from '../../shared/atoms/shell/shell-header/shell-header';
import { Button } from '../../shared/atoms/buttons/button/button';
import { FormBusService } from '../../services/rxjs/form-bus-service/form-bus-service';
import { SubjectService } from '../../services/api/subject-service/subject-service';
import { FormConfirmDisplayDelete } from '../../shared/organisms/forms/form-confirm-display-delete/form-confirm-display-delete';
import { FormSubject } from '../../shared/organisms/forms/form-subject/form-subject';

@Component({
  selector: 'app-form-modal-template',
  imports: [CommonModule, ShellHeader, Button, FormConfirmDisplayDelete, FormSubject],
  standalone: true,
  templateUrl: './form-modal-template.html',
  styleUrl: './form-modal-template.scss'
})
export class FormModalTemplate {
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

  get getTableContextEnum(): typeof TableContextEnum {
    return TableContextEnum;
  }

  ngOnInit() {
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
    });

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
        }
      }

      else if (this.action === 'delete') {
        switch (payload.source) {
          case TableContextEnum.Subjects:
            this._subjectService.deleteSubject(this.identifier as string).subscribe({
              next: () => this._formModalService.closeAll()
            });
            break;
        }
      }
    });
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
      }
    };
    const key = (action ?? 'default') as 'create' | 'edit' | 'delete' | 'default';
    return map[context][key] ?? '';
  }

}
