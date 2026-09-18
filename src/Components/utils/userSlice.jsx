import { createSlice } from "@reduxjs/toolkit";

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem("rasoi_user");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  currentUser: getSavedUser(),
  isAuthModalOpen: false,
  authModalMode: "signin", // 'signin' | 'signup'
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthModalOpen = false;
      try {
        localStorage.setItem("rasoi_user", JSON.stringify(action.payload));
      } catch (e) {
        console.error("Failed to save user to localStorage", e);
      }
    },
    logout: (state) => {
      state.currentUser = null;
      try {
        localStorage.removeItem("rasoi_user");
      } catch (e) {
        console.error("Failed to remove user from localStorage", e);
      }
    },
    updateProfile: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        try {
          localStorage.setItem("rasoi_user", JSON.stringify(state.currentUser));
        } catch (e) {
          console.error("Failed to update user in localStorage", e);
        }
      }
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      if (action.payload?.mode) {
        state.authModalMode = action.payload.mode;
      }
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthModalMode: (state, action) => {
      state.authModalMode = action.payload;
    },
  },
});

export const {
  loginSuccess,
  logout,
  updateProfile,
  openAuthModal,
  closeAuthModal,
  setAuthModalMode,
} = userSlice.actions;

export default userSlice.reducer;
