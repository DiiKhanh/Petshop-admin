import privateClient from "../client/private.client";

const endpoints = {
  add: "Voucher/create",
  getAll: "Voucher/all",
  delete: ({ id }) => `Voucher/delete/${id}`
};

const voucherApi = {
  addVoucher: async ({ code, discount_value, start_date, end_date, max_usage }) => {
    try {
      const response = await privateClient.post(endpoints.add, {
        code, discount_type: "fixed_amount", discount_value, start_date, end_date, max_usage
      });
      return { response };
    } catch (err) {
      return { err };}
  },
  getAll:  async () => {
    try {
      const response = await privateClient.get(endpoints.getAll);
      return { response };
    } catch (err) {
      return { err };}
  },
  delete: async ({ id }) => {
    try {
      const response = await privateClient.delete(endpoints.delete({ id }));
      return { response };
    } catch (err) {
      return { err };}
  }
};

export default voucherApi;