export interface IEnrolledSubjectRequest {
  status: 'cursando' | 'aprovado' | 'reprovado';
  grade: number | null;
  absences: number;
}

export interface IEnrolledSubject extends IEnrolledSubjectRequest {
  subjectCode: string;
}


export interface IPeriod {
  id: number;
  studentEmail: string;
  subjects: IEnrolledSubject[]; 
}