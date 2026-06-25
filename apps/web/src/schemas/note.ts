export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  taskId?: string | null;
  createdAt: string;
  updatedAt: string;
}
