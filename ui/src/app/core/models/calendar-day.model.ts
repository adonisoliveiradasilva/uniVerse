export interface ICalendarDay {
    date: Date;
    dayNumber: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    taskCount?: number;
}