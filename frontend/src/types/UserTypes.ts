export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  userStatus: UserStatus;
  authId: string;
  label?: string;
  value?: string;
};

export type GetUsersResponse = {
  users: User[];
} | null;

export type CountUsersResponse = {
  numResults: number;
} | null;

export enum UserRole {
  ADMIN = "Admin",
  REGULAR_STAFF = "Regular Staff",
  RELIEF_STAFF = "Relief Staff",
}

export enum UserStatus {
  INVITED = "Invited",
  ACTIVE = "Active",
  DEACTIVATED = "Deactivated",
}
