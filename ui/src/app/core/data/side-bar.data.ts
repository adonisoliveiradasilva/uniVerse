import { SideBarSection } from "../models/side-bar-item.model";

export const SIDE_BAR_DATA: SideBarSection[] = [
    {
        slug: 'home',
        title: 'Home',
        items: [
            {
                slug: 'dashboard',
                title: 'Dashboard',
                subtitle: 'Acompanhe sua jornada acadêmica! ',
                icon: 'fas fa-table-cells-large',
                route: '/dashboard'
            },
        ],
    },
    {
        slug: 'student_area',
        title: 'Área do Aluno',
        items: [
            {
                slug: 'your_periods',
                title: 'Seus Períodos',
                subtitle: 'Acompanhe a sua evolução por período', 
                icon: 'fas fa-list-check',
                route: '/periods'
            },
            {
                slug: 'schedule',
                title: 'Sua Agenda',
                subtitle: 'Acompanhe sua agenda acadêmica',
                icon: 'fas fa-calendar-week',
                route: '/schedule'
            },
            {
                slug: 'subjects',
                title: 'Suas Disciplinas',
                subtitle: 'Faça gestão das disciplinas',
                icon: 'fas fa-book',
                route: '/subjects'
            }
        ]
    }
]