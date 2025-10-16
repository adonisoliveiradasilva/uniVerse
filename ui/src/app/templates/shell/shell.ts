import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/organisms/sidebar/sidebar';
import { ShellHeader } from '../../shared/atoms/shell/shell-header/shell-header';
import { FormModalTemplate } from '../form-modal-template/form-modal-template';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, ShellHeader, FormModalTemplate],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {

}
