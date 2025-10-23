import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../services/rxjs/loading/loading';
@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class Loading {
  private _loadingService = inject(LoadingService);
    public loading$: Observable<boolean> = this._loadingService.loading$;
}
