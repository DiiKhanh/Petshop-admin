import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    user: null
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        localStorage.removeItem("token-admin");
      } else if (action.payload.token) {
        localStorage.setItem("token-admin", action.payload.token);
      }
      state.user = action.payload;
    }
  }
});

export const {
  setUser
} = userSlice.actions;

export default userSlice.reducer;