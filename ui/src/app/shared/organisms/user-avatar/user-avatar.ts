import { Component } from '@angular/core';
import { ShellHeader } from '../../atoms/shell/shell-header/shell-header';
import { ButtonActiveDarkMode } from '../../atoms/buttons/button-active-dark-mode/button-active-dark-mode';

@Component({
  selector: 'app-user-avatar',
  imports: [ShellHeader, ButtonActiveDarkMode],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.scss'
})
export class UserAvatar {

}
