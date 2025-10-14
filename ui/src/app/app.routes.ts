import { Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { Shell } from './pages/shell/shell';
import { Dashboard } from './pages/dashboard/dashboard';
import { Institutions } from './pages/institutions/institutions';

export const routes: Routes = [
    {
        path: 'login',
        component: PageLogin
    },
    {
        path: '',
        component: Shell,
        children: [
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'institutions',
                component: Institutions
            },
        ]
    },

    {
        path: '**',
        redirectTo: 'login'
    }

];
