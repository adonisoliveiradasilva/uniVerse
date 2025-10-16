import { Component, inject } from '@angular/core';
import { TableContextType } from '../../core/types/table-context.type';
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
