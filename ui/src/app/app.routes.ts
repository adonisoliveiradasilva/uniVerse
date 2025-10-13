import { Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';

export const routes: Routes = [
    {
        path: 'login',
        component: PageLogin
    },
        {
        path: '**',
        redirectTo: 'login'
    }

];
