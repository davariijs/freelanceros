import { Task, TaskPriority } from "@/schemas/task";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "PAUSED";

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  clientId?: string | null;
  client?: { id: string; name: string } | null;
  tasks?: Task[];
  createdAt: string;
  shareToken?: string | null;
  isShared: boolean;
}
