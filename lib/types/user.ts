export type Role = "super_admin" | "admin" | "editor" | "viewer";

export interface Permission {
  id: string;
  name: string;
  description: string;
  section: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
  active: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

