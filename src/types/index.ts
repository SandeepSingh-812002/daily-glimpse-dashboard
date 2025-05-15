
export interface Task {
  id: string;
  description: string;
  completionPercentage: number;
  status: "Pending" | "In Progress" | "Completed";
  comment?: string;
  issuedBy: string;
  project?: string;
}

export interface ReportingTask {
  id: string;
  reporting_id: string;
  task_id: string;
  description: string;
  completion_percentage: number;
  status: "Pending" | "In Progress" | "Completed";
  comment?: string;
  project?: string;
  created_at: Date;
}

export interface Report {
  id: string;
  user_id: string;
  date: Date;
  is_on_leave: boolean;
  is_half_day: boolean;
  created_at: Date;
  tasks: ReportingTask[];
}

export type ReportStatus = "on-leave" | "half-day" | "completed" | "none";
