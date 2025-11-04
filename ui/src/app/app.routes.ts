import { Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { Shell } from './templates/shell/shell';
import { Dashboard } from './pages/dashboard/dashboard';
import { PageSubjects } from './pages/page-subjects/page-subjects';
import { PageSetPasswordComponent } from './pages/page-set-password/page-set-password';
import { authGuard } from './core/guards/auth-guard';
import { PageNotFound } from './pages/page-not-found/page-not-found';

export const routes: Routes = [
    {
        path: 'login',
        component: PageLogin
    },
    { 
        path: 'set-password', 
        component: PageSetPasswordComponent
    },
    {
        path: '',
        component: Shell,
        canActivate: [authGuard],
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
        component: PageNotFound
    }

];
