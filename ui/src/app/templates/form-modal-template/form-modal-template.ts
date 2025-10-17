import { Component, inject } from '@angular/core';
import { TableContextEnum, TableContextType } from '../../core/types/table-context.type';
import { FormModal } from '../../services/rxjs/form-modal/form-modal';
import { CommonModule } from '@angular/common';
import { ShellHeader } from '../../shared/atoms/shell/shell-header/shell-header';

@Component({
  selector: 'app-form-modal-template',
  imports: [CommonModule, ShellHeader],
  templateUrl: './form-modal-template.html',
  styleUrl: './form-modal-template.scss'
})
export class FormModalTemplate {
  context: TableContextType | null = null;
  isOpen = false;

  private _formModalService = inject(FormModal)

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
      default:
        return ''
    }
  }

  ngOnInit() {
    this._formModalService.openModal$.subscribe(context => {
      this.context = context;
      this.isOpen = true;
    });
  }

  close() {
    this.isOpen = false;
    this.context = null;
  }
}
