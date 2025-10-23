import { Component, inject } from '@angular/core';
import { TableAction, TableContextEnum, TableContextType } from '../../core/types/table-context.type';
import { FormModal } from '../../services/rxjs/form-modal/form-modal';
import { CommonModule } from '@angular/common';
import { ShellHeader } from '../../shared/atoms/shell/shell-header/shell-header';
import { FormInstitution } from '../../shared/organisms/form-institution/form-institution';
import { FormDepartment } from '../../shared/organisms/form-department/form-department';
import { Button } from '../../shared/atoms/buttons/button/button';
import { FormBus } from '../../services/rxjs/form-bus/form-bus';

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

  private _formModalService = inject(FormModal)
  private _formBusService = inject(FormBus);

  get getTitle(): string{
    switch (this.context){
      case TableContextEnum.Institution:
        return "Criar nova Instituição"
      case TableContextEnum.Courses:
        return "Criar novo Curso"
      case TableContextEnum.Subjects:
        return "Criar nova Disciplina"
      case TableContextEnum.User:
        return "Criar novo Usuário"
      case TableContextEnum.Department:
        return "Criar novo Departamento"
      default:
        return ''
    }
  }

  get getSubtitle(): string{
    switch (this.context){
      case TableContextEnum.Institution:
        return "Preencha as informações da nova Instituição"
      case TableContextEnum.Courses:
        return "Preencha as informações do novo Curso"
      case TableContextEnum.Subjects:
        return "Preencha as informações da nova Disciplina"
      case TableContextEnum.User:
        return "Preencha as informações do novo Usuário"
      case TableContextEnum.Department:
        return "Preencha as informações do novo Departamento"
      default:
        return ''
    }
  }

  get getTableContextEnum(): typeof TableContextEnum{
    return TableContextEnum
  }

  ngOnInit() {
    this._formModalService.modalStack$.subscribe(stack => {
      this.isOpen = stack.length > 0;
      this.context = stack.at(-1)?.context ?? null;
    });

    this._formBusService.formPayload$.subscribe(payload => {
      // console.log('📦 Payload recebido do formulário:', payload);
    })
  }

  close() {
    this._formModalService.closeModal();
  }

  save() {
    this._formBusService.triggerSubmit();
  }


}
