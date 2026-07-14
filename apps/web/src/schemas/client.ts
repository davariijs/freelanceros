export type ClientStatus = "ACTIVE" | "INACTIVE";

export interface ClientSocial {
  platform: string;
  value: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  socials?: ClientSocial[] | null;
  status: ClientStatus;
  userId: string;
  createdAt: string;
}
