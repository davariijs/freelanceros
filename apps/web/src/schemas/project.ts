import { Task } from "@/schemas/task";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "PAUSED";

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  dueDate?: string | null;
  clientId?: string | null;
  client?: { id: string; name: string } | null;
  tasks?: Task[];
  createdAt: string;
}
