import { Component, inject, OnInit } from '@angular/core';
import { ButtonActiveDarkMode } from '../../atoms/buttons/button-active-dark-mode/button-active-dark-mode';
import { IStudent } from '../../../core/models/entitys/IStudent.model';
import { AuthService } from '../../../services/api/auth-service/auth-service';

@Component({
  selector: 'app-user-avatar',
  imports: [ButtonActiveDarkMode],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.scss'
})
export class UserAvatar implements OnInit {
  private _name: string = '';
  private _acronym: string = '';
  
  private _authService = inject(AuthService);

  ngOnInit(): void { 
    const userDataString = localStorage.getItem('currentUser');
    if (userDataString) {
      const user = JSON.parse(userDataString) as IStudent;
      this._name = user.name;
      this._acronym = this._generateAcronym(this._name);
    }
  }

  _generateAcronym(name: string): string {
    const words = name.split(' ');
    let acronym = '';
    for (const word of words) {
      if (word.length > 0) {
        acronym += word[0].toUpperCase();
      }
    }
    return acronym;
  }

  get getName(): string {
    return this._name;
  }

  get getAcronym(): string {
    return this._acronym;
  }

  logout(): void {
    this._authService.logout();
  }

}
