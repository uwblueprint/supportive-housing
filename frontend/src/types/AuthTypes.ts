import { UserRole } from "./UserTypes";

export type TwoFaResponse = {
  authUser: AuthenticatedUser;
} | null;

export type AuthTokenResponse = {
  requiresTwoFa: boolean;
  authUser: AuthenticatedUser;
};

export type AuthenticatedUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  accessToken: string;
  verified: boolean;
};

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };

export type AuthFlow = "LOGIN" | "SIGNUP";
