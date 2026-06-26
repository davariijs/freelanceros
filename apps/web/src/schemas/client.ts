export type ClientStatus = "ACTIVE" | "INACTIVE";

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  status: ClientStatus;
  userId: string;
  createdAt: string;
}
