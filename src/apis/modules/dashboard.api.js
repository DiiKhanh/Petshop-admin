import privateClient from "../client/private.client";

const endpoints = {
  getAll: "Dashboard/get-all",
  getInvoice: "Dashboard/get-invoice"
};

const dashboardApi = {
  getAll:  async () => {
    try {
      const response = await privateClient.get(endpoints.getAll);
      return { response };
    } catch (err) {
      return { err };}
  },
  getInvoice:  async ({ date }) => {
    try {
      const response = await privateClient.post(endpoints.getInvoice, {
        date
      });
      return { response };
    } catch (err) {
      return { err };}
  }
};

export default dashboardApi;