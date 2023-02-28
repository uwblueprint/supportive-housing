import baseAPIClient from "./BaseAPIClient";

const inviteUser = async (email: string, role = "Admin"): Promise<boolean> => {
  try {
    if (email === "") {
      return false;
    }
    await baseAPIClient.post(
      "/invite-users",
      { email, role },
      { withCredentials: true },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const isUserInvited = async (email: string): Promise<boolean> => {
  try {
    if (email === "") {
      return false;
    }
    const { data } = await baseAPIClient.get("/invite-users", {
      params: {
        email,
      },
    });
    if (data?.email === email) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export default {
  isUserInvited,
  inviteUser,
};
