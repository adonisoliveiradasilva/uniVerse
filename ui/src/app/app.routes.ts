import { Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { App } from './app';

export const routes: Routes = [
    {
        path: 'login',
        component: PageLogin
    },
    {
        path: '',
        component: App
    },
    {
        path: '**',
        redirectTo: 'login'
    }

];
