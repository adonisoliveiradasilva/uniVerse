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

  openModal(context: TableContextType, action: TableAction, identifier: string = '') {
    const currentStack = this._modalStack.value;
    this._modalStack.next([...currentStack, { context, action, identifier }]);
  }

  closeModal() {
    const currentStack = this._modalStack.value;
    if (currentStack.length > 0) {
      this._modalStack.next(currentStack.slice(0, -1)); // remove o último modal
    }
  }

  // closeAll() {
  //   this._modalStack.next([]);
  // }

  get currentModal(): ITableContext | null {
    const stack = this._modalStack.value;
    return stack.length ? stack[stack.length - 1] : null;
  }
}
