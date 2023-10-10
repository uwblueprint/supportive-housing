export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  userStatus: UserStatus;
  authId: string;
};

export type GetUsersParams = {
  returnAll: boolean;
  resultsPerPage: number;
  nextCursor: number;
  prevCursor: number;
  direction: string | undefined;
};

export type UpdateUserParams = Omit<User, "email" | "userStatus" | "authId">;

export type UserLabel = {
  label: string;
  value: number;
};

export type GetUsersResponse = {
  users: User[];
  nextCursor: number;
  prevCursor: number;
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
