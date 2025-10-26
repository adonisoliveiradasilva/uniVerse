export type TableContextType = 'institutions' | 'courses' | 'subjects' | 'user';

export type TableAction = 'create' | 'edit' | 'delete';

export enum TableContextEnum {
  Institutions = 'institutions',
  Courses = 'courses',
  Subjects = 'subjects',
  User = 'user',
}