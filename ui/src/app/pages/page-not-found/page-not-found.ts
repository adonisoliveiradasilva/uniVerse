import { Component, inject } from '@angular/core';
import { HeaderLogin } from '../../shared/organisms/login/header-login/header-login';
import { Button } from '../../shared/atoms/buttons/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [HeaderLogin, Button],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss'
})
export class PageNotFound {
  private _router = inject(Router);

  goToLogin(): void {
    this._router.navigate(['/login']);
  }

}
