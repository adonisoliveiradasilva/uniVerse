import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TableAction, TableContextType } from '../../../core/types/table-context.type';
import { ITableContext } from '../../../core/models/table.model';

@Injectable({
  providedIn: 'root'
})
export class FormModal {
  private _modalStack = new BehaviorSubject<ITableContext[]>([]);
  readonly modalStack$ = this._modalStack.asObservable();

  openModal(context: TableContextType, action: TableAction, identifier: string | null = null, nameConfirm: string | null = null) {
    const currentStack = this._modalStack.value;
    this._modalStack.next([...currentStack, { context, action, identifier, nameConfirm }]);
  }

  closeModal() {
    const currentStack = this._modalStack.value;
    if (currentStack.length > 0) {
      this._modalStack.next(currentStack.slice(0, -1));
    }
  }

  closeAll() {
    this._modalStack.next([]);
  }

  setNameConfirm(name: string | null) {
    const currentStack = this._modalStack.value;
    if (currentStack.length === 0) {
      return;
    }

    const currentModal = currentStack[currentStack.length - 1];

    const updatedModal: ITableContext = {
      ...currentModal,
      nameConfirm: name
    };

    const newStack = [
      ...currentStack.slice(0, -1),
      updatedModal
    ];

    this._modalStack.next(newStack);
  }

  get currentModal(): ITableContext | null {
    const stack = this._modalStack.value;
    return stack.length ? stack[stack.length - 1] : null;
  }
}
