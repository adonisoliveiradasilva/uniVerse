import { Component } from '@angular/core';
import { LoginLogo } from '../login/login-logo/login-logo';

@Component({
  selector: 'app-loading',
  imports: [LoginLogo],
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class Loading {

}
