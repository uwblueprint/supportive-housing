export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  userStatus: UserStatus;
  authId: string;
};

export type GetUserParams = {
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
};

export type UpdateUserParams = Omit<User, "email" | "userStatus" | "authId">;

export type GetUsersResponse = {
  users: User[];
} | null;

export type CountUsersResponse = {
  numResults: number;
} | null;

export type GetUserStatusResponse = {
  userStatus: UserStatus;
  email: string;
};

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
