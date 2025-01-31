export interface Schedule {
  id: string;
  taskName: string;
  startDate: string;
  endDate: string;
  engineer_id: string;
  admin_id: string;
  customer_id: string;
  product_id: string; 
  location: string | null;
  activity: string | null;
  adminName: string;
  engineerName: string;
  status?: "ACCEPTED" | "REJECTED" | "RESCHEDULED" | "PENDING" | "CANCELED" | "ONGOING" | "COMPLETED";
  created_at: string;
  updated_at: string;
}