import { Injectable } from '@angular/core';
import { filter, Subject } from 'rxjs';
import { TableContextType } from '../../../core/types/table-context.type';

@Injectable({
  providedIn: 'root'
})
export class FormModal {
  private _openModalSubject = new Subject<TableContextType>();
  openModal$ = this._openModalSubject.asObservable();

  openModal(context: TableContextType) {
    this._openModalSubject.next(context);
  }

  onContext(context: TableContextType) {
    return this.openModal$.pipe(filter(c => c === context));
  }
}
