export type TableContextType = 'institution' | 'courses' | 'subjects' | 'user' | 'department';

export type TableAction = 'create' | 'edit' | 'delete';


export enum TableContextEnum {
  Institution = 'institution',
  Courses = 'courses',
  Subjects = 'subjects',
  User = 'user',
  Department = 'department'
}