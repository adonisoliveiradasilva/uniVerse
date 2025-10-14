export interface SideBarItem {
    slug: string;
    title: string;
    icon: string;
    route: string;
}

export interface SideBarSection {
    slug: string;
    title: string;
    items: SideBarItem[];
}