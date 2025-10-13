import { Component } from '@angular/core';
import { FormInput } from '../../../atoms/forms/form-input/form-input';
import { LoginButton } from '../../../atoms/login/login-button/login-button';

@Component({
  selector: 'app-body-login',
  imports: [FormInput, LoginButton],
  templateUrl: './body-login.html',
  styleUrl: './body-login.scss'
})
export class BodyLogin {

}
