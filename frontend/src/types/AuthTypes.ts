export type LoginResponse = {
  requiresTwoFa: boolean;
  authUser: AuthenticatedUser;
} | null;

export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User";
  accessToken: string;
};

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };
