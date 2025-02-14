export interface Reschedule {
    id: string;
    scheduleId: string;
    reason: string;
    newDate: string;
    status: "ACCEPTED" | "REJECTED" | "RESCHEDULED" | "PENDING" | "CANCELED" | "ONGOING" | "COMPLETED";
    created_at: string;
    updated_at: string;
  }