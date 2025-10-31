import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableSelectService {
  private _selectedIdsSubject = new BehaviorSubject<string[]>([]);
  public selectedIds$: Observable<string[]> = this._selectedIdsSubject.asObservable();

  public toggleSelection(id: string): void {
    const currentIds = this._selectedIdsSubject.getValue();
    
    const index = currentIds.indexOf(id);

    let updatedIds: string[];

    if (index > -1) {
      updatedIds = [...currentIds];
      updatedIds.splice(index, 1);
    } else {
      updatedIds = [...currentIds, id];
    }

    this._selectedIdsSubject.next(updatedIds);
  }

  public setSelection(ids: string[]): void {
    this._selectedIdsSubject.next(ids);
  }

  public clearSelection(): void {
    this._selectedIdsSubject.next([]);
  }

}
