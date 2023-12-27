import publicClient from "../client/public.client";
import privateClient from "../client/private.client";

const endpoints = {
  signin: "Authenticate/login",
  getInfo: "Authenticate/info"
};

const authApi = {
  signin: async ({ email, password }) => {
    try {
      const response = await publicClient.post(
        endpoints.signin,
        { email, password }
      );
      return { response };
    } catch (err) { return { err };}
  },
  getInfo: async () => {
    try {
      const response = await privateClient.get(endpoints.getInfo);
      return { response };
    } catch (err) {return { err };}
  }
};

export default authApi;