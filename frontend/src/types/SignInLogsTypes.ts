export type SignInLog = {
  id: number;
  firstName: string,
  lastName: string,
  time: string
}

export type GetSignInLogsParams = {
  pageNumber?: number;
  resultsPerPage?: number;
  startDate: string;
  endDate: string;
}

export type GetSignInLogsResponse = {
  signInLogs: SignInLog[];
} | null;

export type CountSignInLogsParams = {
  startDate: string;
  endDate: string;
};

export type CountSignInLogsResponse = {
  numResults: number;
} | null;