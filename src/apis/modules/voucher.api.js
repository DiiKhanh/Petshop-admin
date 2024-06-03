import privateClient from "../client/private.client";

const endpoints = {
  add: "Voucher/create",
  getAll: "Voucher/all",
  getAdmin: ({ id }) => `Voucher/get-admin/${id}`,
  delete: ({ id }) => `Voucher/delete/${id}`,
  edit: ({ id }) => `Voucher/edit/${id}`
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
  editVoucher: async ({ id, code, discount_value, start_date, end_date, max_usage, isDeleted }) => {
    try {
      const response = await privateClient.post(endpoints.edit({ id }), {
        code, discount_type: "fixed_amount", discount_value, start_date, end_date, max_usage, isDeleted
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
  },
  get: async ({ id }) => {
    try {
      const response = await privateClient.get(endpoints.getAdmin({ id }));
      return { response };
    } catch (err) {
      return { err };}
  }
};

export default voucherApi;