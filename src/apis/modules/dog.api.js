import publicClient from "../client/public.client";
import privateClient from "../client/private.client";

const endpoints = {
  getAll: "DogItems/get-all",
  getAllAdmin: "DogItems/get-all-admin",
  add: "DogItems/add-dog",
  getDogByIdAdmin: ({ id }) => `DogItems/get-dog-admin/${id}`,
  editDogById: ({ id }) => `DogItems/update-dog-item/${id}`,
  deleteDog: ({ id }) => `DogItems/delete/${id}`
};

const dogApi = {
  getAll: async () => {
    try {
      const response = await publicClient.get(
        endpoints.getAll
      );
      return { response };
    } catch (err) {
      return { err };}
  },
  getAllDog: async () => {
    try {
      const response = await privateClient.get(
        endpoints.getAllAdmin
      );
      return { response };
    } catch (err) {
      return { err };}
  },
  getDogByIdAdmin: async ({ id }) => {
    try {
      const response = await privateClient.get(
        endpoints.getDogByIdAdmin({ id })
      );
      return { response };
    } catch (err) {
      return { err };}
  },
  editDogById: async ({ id, dogName, speciesName, price, color, origin,
    healthStatus, description, sex, images, age, isDeleted, isInStock
  }) => {
    try {
      const response = await privateClient.put(
        endpoints.editDogById({ id }),
        {
          dogName, speciesName, price, color, origin,
          healthStatus, description, sex, images, age, isDeleted, isInStock
        }
      );
      return { response };
    } catch (err) {
      return { err };}
  },
  addDog: async ({ dogName, speciesName, price, color, origin,
    healthStatus, description, sex, images, age
  }) => {
    try {
      const response = await privateClient.post(
        endpoints.add,
        {
          dogName, speciesName, price, color, origin,
          healthStatus, description, sex, images, age
        }
      );
      return { response };
    } catch (err) {
      return { err };}
  },
  deleteDog: async ({ id }) => {
    try {
      const response = await privateClient.delete(
        endpoints.deleteDog({ id })
      );
      return { response };
    } catch (err) {
      return { err };}
  }
};

export default dogApi;