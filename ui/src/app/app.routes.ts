import { Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { Shell } from './templates/shell/shell';
import { Dashboard } from './pages/dashboard/dashboard';
import { PageSubjects } from './pages/page-subjects/page-subjects';

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
                path: 'subjects',
                component: PageSubjects
            }
        ]
    },

    {
        path: '**',
        redirectTo: 'login'
    }

];
