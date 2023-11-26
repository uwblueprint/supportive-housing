import { UserRole } from "./UserTypes";

export type TwoFaResponse = {
  authUser: AuthenticatedUser;
} | null;

export type AuthTokenResponse = {
  requiresTwoFa: boolean;
  authUser: AuthenticatedUser;
} | null;

export type AuthenticatedUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  accessToken: string;
};

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };

export type ErrorResponse = {
  errCode: number;
  errMessage: string;
};

export type AuthFlow = 'LOGIN' | 'SIGNUP';
