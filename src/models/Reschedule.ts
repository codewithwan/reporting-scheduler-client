export interface Reschedule {
  id: string;
  scheduleId: string;
  requestedBy: any;
  reason: string;
  newDate: string;
  status: "ACCEPTED" | "REJECTED" | "RESCHEDULED" | "PENDING" | "CANCELED" | "ONGOING" | "COMPLETED" | "APPROVED";
  created_at: string;
  updated_at: string;
}