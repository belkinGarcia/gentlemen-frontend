import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  // Simulate some unavailable dates (e.g., weekends)
  private unavailableDates = [5, 6, 12, 13, 19, 20, 26, 27]; // Saturdays and Sundays in Oct 2025

  constructor() { }

   isDateUnavailable(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  getAvailableTimesForDate(date: Date): string[] {
    // In a real app, this would make an API call. Here we'll return a mock list.
    // Let's pretend weekdays have full schedules and other days have none.
     if (!this.isDateUnavailable(date)) { // Monday to Friday
      return [
        '03:00 PM', '03:20 PM', '03:40 PM', '04:00 PM', '04:20 PM', '04:40 PM',
        '05:00 PM', '05:20 PM', '05:40 PM', '06:00 PM', '06:20 PM', '06:40 PM',
        '07:00 PM', '07:20 PM', '07:40 PM', '08:00 PM', '08:20 PM'
      ];
    }
    return [];
  }
}