export interface ITask {
    id: number;
    title: string;
    description: string;
    subjectCode: string | null;
    taskType: string;
    startDate: string;
    endDate: string;
    finished: boolean;
}

export interface ITaskRequest {
    title: string;
    description: string;
    subjectCode: string | null;
    tag: string;
    startTime: string;
    endTime: string;
    date: string;
}