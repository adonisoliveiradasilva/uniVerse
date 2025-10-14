import { SideBarSection } from "../models/side-bar-item.model";

export const SIDE_BAR_DATA: SideBarSection[] = [
    {
        slug: 'student_area',
        title: 'Área do Aluno',
        items: [
            {
                slug: 'dashboard',
                title: 'Dashboard',
                subtitle: 'Acompanhe sua jornada acadêmica! ',
                icon: 'fas fa-table-cells-large',
                route: '/dashboard'
            },
            {
                slug: 'periods',
                title: 'Períodos',
                subtitle: 'Acompanhe a sua evolução por período', 
                icon: 'fas fa-list-check',
                route: '/periods'
            },
            {
                slug: 'diary',
                title: 'Agenda',
                subtitle: 'Acompanhe sua agenda acadêmica',
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
                title: 'Cursos',
                subtitle: 'Faça gestão dos cursos',
                icon: 'fas fa-graduation-cap',
                route: '/courses'
            },
            {
                slug: 'subjects',
                title: 'Disciplinas',
                subtitle: 'Faça gestão das disciplinas',
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
                title: 'Instituições',
                subtitle: 'Faça gestão das instituições parceiras',
                icon: 'fas fa-building-columns',
                route: '/institutions'
            },
            {
                slug: 'students',
                title: 'Alunos',
                subtitle: 'Faça gestão dos alunos cadastrados',
                icon: 'fas fa-people-group',
                route: '/students'
            }
        ]
    }
]