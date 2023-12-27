import publicClient from "../client/public.client";
import privateClient from "../client/private.client";

const endpoints = {
  getAll: "DogProductItem/get-all-dog-product-item",
  getAllAdmin: "DogProductItem/get-all-dog-product-admin",
  add: "DogProductItem/add-dog-product-item",
  getItem: ({ id }) => `DogProductItem/get-dog-product-item/${id}`,
  editItem: ({ id }) => `DogProductItem/update-dog-product-item/${id}`,
  deleteItem: ({ id }) => `DogProductItem/delete-dog-product-item/${id}`
};

const itemApi = {
  getAllItem: async () => {
    try {
      const response = await publicClient.get(endpoints.getAll);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getAllAdmin: async () => {
    try {
      const response = await privateClient.get(endpoints.getAllAdmin);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  addItem: async ({ itemName, price, category, quantity, description, images, isInStock
  }) => {
    try {
      isInStock = true;
      const isDeleted = false;
      const response = await privateClient.post(
        endpoints.add,
        {
          itemName, price, category, quantity, description, images, isInStock, isDeleted
        }
      );
      return { response };
    } catch (err) {
      return { err };}
  },
  getItem: async ({ id }) => {
    try {
      const response = await publicClient.get(
        endpoints.getItem({ id })
      );
      return { response };
    } catch (err) {
      return { err };}
  },
  editItem: async ({ id, itemName, price, category, quantity, description, images, isDeleted, isInStock
  }) => {
    try {
      const response = await privateClient.put(
        endpoints.editItem({ id }),
        {
          itemName, price, category, quantity, description, images, isDeleted, isInStock
        }
      );
      return { response };
    } catch (err) {
      return { err };}
  },
  deleteItem: async ({ id }) => {
    try {
      const response = await privateClient.delete(
        endpoints.deleteItem({ id })
      );
      return { response };
    } catch (err) {
      return { err };}
  }
};

export default itemApi;