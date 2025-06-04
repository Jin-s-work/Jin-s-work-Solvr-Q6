export interface SleepRecord {
    id: number;
    date: string;        // "YYYY-MM-DD"
    sleepStart: string;  // "HH:mm"
    sleepEnd: string;    // "HH:mm"
    note: string;
    createdAt: string;   // ISO timestamp
    updatedAt: string;   // ISO timestamp
  }
  