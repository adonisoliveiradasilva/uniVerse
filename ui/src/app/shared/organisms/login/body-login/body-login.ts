import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormInput } from '../../../atoms/forms/form-input/form-input';
import { Button } from '../../../atoms/buttons/button/button';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../../services/api/student-service/student-service';
import { AlertService } from '../../../../services/rxjs/alert-service/alert-service';

type AuthState = 'login' | 'register' | 'awaitingApproval' | 'forgotPassword'; 

@Component({
  selector: 'app-body-login',
  imports: [FormInput, Button, AsyncPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './body-login.html',
  styleUrl: './body-login.scss'
})
export class BodyLogin {
  private _router = inject(Router);
  private _fb = inject(FormBuilder);
  private _studentService = inject(StudentService);
  private _alertService = inject(AlertService);

  private _authState$ = new BehaviorSubject<AuthState>('login');
  public authState$ = this._authState$.asObservable();

  loginForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  registerForm: FormGroup = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]]
  });

  forgotPasswordForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this._alertService.warn('Por favor, preencha seu email e senha.');
      return;
    }
    console.log('Login data:', this.loginForm.value);
    this._router.navigate(['/']);
  }

  goToRegister(): void {
    this._authState$.next('register');
  }

  goToForgotPassword(): void {
    this._authState$.next('forgotPassword');
  }

  goBackToLogin(): void {
    this._authState$.next('login');
  }

  createAccount(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this._alertService.warn('Por favor, preencha os campos corretamente.');
      return;
    }

    const studentData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email
    };

    this._studentService.createStudent(studentData).subscribe({
      next: () => {
        this._authState$.next('awaitingApproval');
        this.registerForm.reset();
      },
      error: (err) => {
        console.error('Erro ao criar conta:', err);
      }
    });
  }

  sendEmail(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      this._alertService.warn('Por favor, preencha o campo de e-mail corretamente.');
      return;
    }

    this._studentService.sendEmailForgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this._authState$.next('awaitingApproval');
        this.forgotPasswordForm.reset();
      },
      error: (err) => {
        console.error('Erro ao criar conta:', err);
      }
    });

    this._authState$.next('login');
  }
}

