import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/organisms/sidebar/sidebar';
import { ShellHeader } from '../../shared/atoms/shell/shell-header/shell-header';
import { FormModalTemplate } from '../form-modal-template/form-modal-template';
import { Loading } from '../../shared/atoms/loading/loading';
import { AlertSurface } from '../../shared/organisms/alert-surface/alert-surface';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, ShellHeader, FormModalTemplate, Loading, AlertSurface],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {

}
