import { Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { Shell } from './pages/shell/shell';

export const routes: Routes = [
    {
        path: 'login',
        component: PageLogin
    },
    {
        path: '',
        component: Shell
    },
    {
        path: '**',
        redirectTo: 'login'
    }

];
