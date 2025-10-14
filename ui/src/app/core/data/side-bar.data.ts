import { SideBarSection } from "../models/side-bar-item.model";

export const SIDE_BAR_DATA: SideBarSection[] = [
    {
        slug: 'student_area',
        title: 'Área do Aluno',
        items: [
            {
                slug: 'dashboard',
                title: 'Dashboard',
                icon: 'fas fa-table-cells-large',
                route: '/dashboard'
            },
            {
                slug: 'periods',
                title: 'Períodos',
                icon: 'fas fa-list-check',
                route: '/periods'
            },
            {
                slug: 'diary',
                title: 'Agenda',
                icon: 'fas fa-calendar-week',
                route: '/diary'
            }
        ]
    },
    {
        slug: 'institutional_area',
        title: 'Área institucional',
        items: [
            {
                slug: 'courses',
                title: 'Dashboard',
                icon: 'fas fa-graduation-cap',
                route: '/courses'
            },
            {
                slug: 'subjects',
                title: 'Subject',
                icon: 'fas fa-book',
                route: '/subjects'
            }
        ]
    },
    {
        slug: 'administrative_area',
        title: 'Área administrativa',
        items: [
            {
                slug: 'institutions',
                title: 'Institutions',
                icon: 'fas fa-building-columns',
                route: '/institutions'
            },
            {
                slug: 'students',
                title: 'Alunos',
                icon: 'fas fa-people-group',
                route: '/students'
            }
        ]
    }
]