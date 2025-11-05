import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../../../services/api/student-service/student-service';
import { AlertService } from '../../../../services/rxjs/alert-service/alert-service';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../atoms/forms/form-input/form-input';
import { Button } from '../../../atoms/buttons/button/button';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-body-register',
  imports: [CommonModule, ReactiveFormsModule, FormInput, Button],
  templateUrl: './body-register.html',
  styleUrl: './body-register.scss'
})
export class BodyRegister {
  @Input() token: string | null = null;

  private _fb = inject(FormBuilder);

  private _router = inject(Router);
  private _studentService = inject(StudentService);
  private _alertService = inject(AlertService);

  public passwordForm!: FormGroup;
  public isLoading = false;
  public invalidToken = false;

  
  constructor() {
    this.passwordForm = this._fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    if (!this.token) {
      this.invalidToken = true;
      this.passwordForm.disable();
      this._alertService.error("Link inválido ou expirado.");
    }
  }
  
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      if (this.passwordForm.errors?.['passwordMismatch']) {
        this._alertService.warn('As senhas não coincidem.');
      } else {
        this._alertService.warn('Por favor, preencha a senha corretamente (mínimo 8 caracteres).');
      }
      return;
    }

    if (!this.token) {
      this._alertService.error("Token não encontrado. Não é possível definir a senha.");
      return;
    }

    this.isLoading = true;
    const newPassword = this.passwordForm.value.password;

    this._studentService.setPassword(this.token, newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this._alertService.success("Senha definida com sucesso! Você já pode fazer o login.");
        this._router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        console.error("Erro ao definir senha:", err);
        if (err.status === 401 || err.status === 404 || err.status === 403) {
          this.invalidToken = true;
          this.passwordForm.disable();
        } 
      }
    });
  }

  goBackToLogin(): void {
    this._router.navigate(['/login']);
  }
}
