import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderLogin } from '../../shared/organisms/login/header-login/header-login';
import { BodyRegister } from '../../shared/organisms/login/body-register/body-register';
import { AlertSurface } from '../../shared/organisms/alert-surface/alert-surface';
import { Loading } from '../../shared/atoms/loading/loading';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [
    CommonModule,
    HeaderLogin,
    BodyRegister,
    AlertSurface,
    Loading
  ],
  templateUrl: './page-set-password.html',
  styleUrls: ['./page-set-password.scss']
})
export class PageSetPasswordComponent implements OnInit {
  private _route = inject(ActivatedRoute);

  public token: string | null = null;
  public invalidToken = false;

  ngOnInit(): void {
    this._route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }
}

