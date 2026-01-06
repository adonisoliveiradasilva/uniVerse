import { Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { Shell } from './templates/shell/shell';
import { Dashboard } from './pages/dashboard/dashboard';
import { PageSubjects } from './pages/page-subjects/page-subjects';
import { PageSetPasswordComponent } from './pages/page-set-password/page-set-password';
import { authGuard } from './core/guards/auth-guard';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { PagePeriods } from './pages/page-periods/page-periods';
import { PageSchedule } from './pages/page-schedule/page-schedule';

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
            },
            {
                path: 'schedule',
                component: PageSchedule
            },
            {
                path: 'periods',
                component: PagePeriods
            }
        ]
    },

    {
        path: '**',
        component: PageNotFound
    }

];
