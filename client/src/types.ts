export interface SleepRecord {
    id: number;
    date: string;        // "YYYY-MM-DD"
    sleep_start: string;  // "HH:mm"
    sleep_end: string;    // "HH:mm"
    note: string;
    createdAt: string;   // ISO timestamp
    updatedAt: string;   // ISO timestamp
  }
  