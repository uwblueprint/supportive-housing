import { TeamMember } from "../types/TeamMembersTypes";
import baseAPIClient from "./BaseAPIClient";

type TeamMemberSnakeCase = {
  id: number;
  first_name: string;
  last_name: string;
  role: "PM" | "Designer" | "PL" | "Developer";
};

const getTeamMembers = async (): Promise<[TeamMember] | null> => {
  try {
    const { data } = await baseAPIClient.get("/team_members", {});

    const camelCaseData = JSON.parse(data).map(
      (member: {
        id: number;
        first_name: string;
        last_name: string;
        role: "PM" | "Designer" | "PL" | "Developer";
      }) => ({
        id: member.id,
        firstName: member.first_name,
        lastName: member.last_name,
        role: member.role,
      }),
    );

    return camelCaseData;
  } catch (error) {
    return null;
  }
};

const addTeamMember = async (
  firstName: string,
  lastName: string,
  role: string,
): Promise<TeamMember | null> => {
  try {
    const { data } = await baseAPIClient.post("/team_members", {
      firstName,
      lastName,
      role,
    });
    return data;
  } catch (error) {
    return null;
  }
};
export { getTeamMembers, addTeamMember };
