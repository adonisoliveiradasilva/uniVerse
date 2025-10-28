export interface ICourse {
  code: string;
  name: string;
  periodsQuantity: number;
  description: string;
  institutionAcronym: string;
  subjectsIds: string[];
  createdAt?: string;
  updatedAt?: string;
}
