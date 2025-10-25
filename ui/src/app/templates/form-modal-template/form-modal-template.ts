import { Component, inject } from '@angular/core';
import { TableAction, TableContextEnum, TableContextType } from '../../core/types/table-context.type';
import { FormModal } from '../../services/rxjs/form-modal-service/form-modal-service';
import { CommonModule } from '@angular/common';
import { ShellHeader } from '../../shared/atoms/shell/shell-header/shell-header';
import { FormInstitution } from '../../shared/organisms/forms/form-institution/form-institution';
import { Button } from '../../shared/atoms/buttons/button/button';
import { FormBusService } from '../../services/rxjs/form-bus-service/form-bus-service';
import { InstitutionService } from '../../services/api/institution-service/institution-service';
import { FormConfirmDisplayDelete } from '../../shared/organisms/forms/form-confirm-display-delete/form-confirm-display-delete';

@Component({
  selector: 'app-form-modal-template',
  imports: [CommonModule, ShellHeader, FormInstitution, Button, FormConfirmDisplayDelete],
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

  private _formModalService = inject(FormModal)
  private _formBusService = inject(FormBusService);
  private _institutionService = inject(InstitutionService);

  get getTableContextEnum(): typeof TableContextEnum {
    return TableContextEnum
  }

  ngOnInit() {
    this._formModalService.modalStack$.subscribe(stack => {
      const currentModal = stack.at(-1);
      if(currentModal){
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
      if (payload && this.action === 'create') {
        switch (payload.source) {
          case TableContextEnum.Institution:
            const institutionData = {
              name: payload.data.nameInstitution,
              acronym: payload.data.acronymInstitution
            };
            this._institutionService.createInstitution(institutionData).subscribe({
              next: () => this.close()
            });
            break;
        }
      }else if (payload && this.action === 'edit') {
        switch (payload.source) {
          case TableContextEnum.Institution:
            const institutionData = {
              name: payload.data.nameInstitution,
              acronym: payload.data.acronymInstitution
            };
            this._institutionService.updateInstitution(institutionData).subscribe({
              next: () => this.close()
            });
            break;
        }
      }else if (payload && this.action === 'delete') {
        switch (payload.source) {
          case TableContextEnum.Institution:
            this._institutionService.deleteInstitution(this.identifier as string).subscribe({
              next: () => {
                this._formModalService.closeAll();
              }
            });
            break;
        }
      }
    })
  }

  resolveTitle(context: TableContextType | null, action: TableAction | null): string {
    if (!context) return '';
    const map: Record<TableContextType, { create: string; edit: string; delete: string; default: string }> = {
      [TableContextEnum.Institution]: {
        create: "Criar nova Instituição",
        edit: "Editar Instituição",
        delete: "Deletar Instituição",
        default: "Criar nova Instituição"
      },
      [TableContextEnum.Courses]: {
        create: "Criar novo Curso",
        edit: "Editar Curso",
        delete: "Deletar Curso",
        default: "Criar novo Curso"
      },
      [TableContextEnum.Subjects]: {
        create: "Criar nova Disciplina",
        edit: "Editar Disciplina",
        delete: "Deletar Disciplina",
        default: "Criar nova Disciplina"
      },
      [TableContextEnum.User]: {
        create: "Criar novo Usuário",
        edit: "Editar Usuário",
        delete: "Deletar Usuário",
        default: "Criar novo Usuário"
      }
    };
    const key = (action ?? 'default') as 'create' | 'edit' | 'delete' | 'default';
    return map[context][key] ?? '';
  }

  resolveSubtitle(context: TableContextType | null, action: TableAction | null): string {
    if (!context) return '';
    const map: Record<TableContextType, { create: string; edit: string; delete: string; default: string }> = {
      [TableContextEnum.Institution]: {
        create: "Preencha as informações da nova Instituição",
        edit: "Preencha as informações da Instituição",
        delete: "Confirme a exclusão da Instituição",
        default: "Preencha as informações da nova Instituição"
      },
      [TableContextEnum.Courses]: {
        create: "Preencha as informações do novo Curso",
        edit: "Preencha as informações do Curso",
        delete: "Confirme a exclusão do Curso",
        default: "Preencha as informações do novo Curso"
      },
      [TableContextEnum.Subjects]: {
        create: "Preencha as informações da nova Disciplina",
        edit: "Preencha as informações da Disciplina",
        delete: "Confirme a exclusão da Disciplina",
        default: "Preencha as informações da nova Disciplina"
      },
      [TableContextEnum.User]: {
        create: "Preencha as informações do novo Usuário",
        edit: "Preencha as informações do Usuário",
        delete: "Confirme a exclusão do Usuário",
        default: "Preencha as informações do novo Usuário"
      }
    };
    const key = (action ?? 'default') as 'create' | 'edit' | 'delete' | 'default';
    return map[context][key] ?? '';
  }

  close() {
    this._formModalService.closeModal();
  }

  openDelete(){
    this._formModalService.openModal(this.context, 'delete', this.identifier, this.nameConfirm);
  }

  confirmDelete() {
    this._formBusService.triggerSubmit();
  }

  save() {
    this._formBusService.triggerSubmit();
  }
}
