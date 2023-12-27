import privateClient from "../client/private.client.js";


const commentEndpoint = {
  getAll: "Comment/get-all",
  update: ({ id }) => `Comment/update/${id}`
};

const commentApi = {
  getAll: async () => {
    try {
      const response = await privateClient.get(
        commentEndpoint.getAll
      );
      return { response };
    } catch (err) { return { err }; }
  },
  update: async ({ id, isAccept }) => {
    try {
      const response = await privateClient.put(
        commentEndpoint.update({ id }), ({ isAccept })
      );
      return { response };
    } catch (err) { return { err }; }
  }
};

export default commentApi;