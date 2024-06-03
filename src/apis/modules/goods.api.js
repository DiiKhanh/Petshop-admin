import privateClient from "../client/private.client";

const endpoints = {
  getAll: "Goods/get-all",
  add: "Goods/create-goods"
};

const goodsApi = {
  getAll: async () => {
    try {
      const response = await privateClient.get(
        endpoints.getAll
      );
      return { response };
    } catch (err) {
      return { err };}
  },
  add: async ({ productName, quantity, price, supplier, phoneNumber,
    address, note
  }) => {
    try {
      const response = await privateClient.post(
        endpoints.add,
        {
          productName, quantity, price, supplier, phoneNumber,
          address, note
        }
      );
      return { response };
    } catch (err) {
      return { err };}
  }
};

export default goodsApi;