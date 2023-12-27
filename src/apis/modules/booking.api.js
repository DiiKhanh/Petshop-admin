import privateClient from "../client/private.client";

const endpoints = {
  getAll: "Appointment/get-all",
  update: ({ id }) => `Appointment/updateStatus/${id}`
};

const bookingApi = {
  getAll:  async () => {
    try {
      const response = await privateClient.get(endpoints.getAll);
      return { response };
    } catch (err) {
      return { err };}
  },
  update:  async ({ id, result, status }) => {
    try {
      const response = await privateClient.put(endpoints.update({ id }), { result, status });
      return { response };
    } catch (err) {
      return { err };}
  }
};

export default bookingApi;