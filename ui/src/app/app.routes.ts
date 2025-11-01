import { Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { Shell } from './templates/shell/shell';
import { Dashboard } from './pages/dashboard/dashboard';
import { PageInstitutions } from './pages/page-institutions/page-institutions';
import { PageSubjects } from './pages/page-subjects/page-subjects';
import { PageCourses } from './pages/page-courses/page-courses';
import { PageUsers } from './pages/page-users/page-users';

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
            },
            {
                path: 'courses',
                component: PageCourses
            },
            {
                path: 'institutions',
                component: PageInstitutions
            },
            {
                path: 'users',
                component: PageUsers
            }
        ]
    },

    {
        path: '**',
        redirectTo: 'login'
    }

];
