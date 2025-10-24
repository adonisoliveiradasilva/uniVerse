import { Component, inject } from '@angular/core';
import { TableAction, TableContextEnum, TableContextType } from '../../core/types/table-context.type';
import { FormModal } from '../../services/rxjs/form-modal/form-modal';
import { CommonModule } from '@angular/common';
import { ShellHeader } from '../../shared/atoms/shell/shell-header/shell-header';
import { FormInstitution } from '../../shared/organisms/form-institution/form-institution';
import { FormDepartment } from '../../shared/organisms/form-department/form-department';
import { Button } from '../../shared/atoms/buttons/button/button';
import { FormBus } from '../../services/rxjs/form-bus/form-bus';
import { InstitutionService } from '../../services/api/institution/institution';

@Component({
  selector: 'app-form-modal-template',
  imports: [CommonModule, ShellHeader, FormInstitution, FormDepartment, Button],
  templateUrl: './form-modal-template.html',
  styleUrl: './form-modal-template.scss'
})
export class FormModalTemplate {
  context: TableContextType | null = null;
  action: TableAction | null = null;
  isOpen = false;
  title = '';
  subtitle = '';

  private _formModalService = inject(FormModal)
  private _formBusService = inject(FormBus);
  private _institutionService = inject(InstitutionService);

  get getTableContextEnum(): typeof TableContextEnum {
    return TableContextEnum
  }

  ngOnInit() {
    this._formModalService.modalStack$.subscribe(stack => {
      const currentModal = stack.at(-1);
      this.isOpen = !!currentModal;
      this.context = currentModal?.context ?? null;
      this.action = currentModal?.action ?? null;
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
      },
      [TableContextEnum.Department]: {
        create: "Criar novo Departamento",
        edit: "Editar Departamento",
        delete: "Deletar Departamento",
        default: "Criar novo Departamento"
      },
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
      },
      [TableContextEnum.Department]: {
        create: "Preencha as informações do novo Departamento",
        edit: "Preencha as informações do Departamento",
        delete: "Confirme a exclusão do Departamento",
        default: "Prenecha as informações do novo Departamento"
      },
    };
    const key = (action ?? 'default') as 'create' | 'edit' | 'delete' | 'default';
    return map[context][key] ?? '';
  }

  close() {
    this._formModalService.closeModal();
  }

  save() {
    this._formBusService.triggerSubmit();
  }
}
