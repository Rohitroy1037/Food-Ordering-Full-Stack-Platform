import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "rasoi_cart_items";

// Helper to safely load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("Failed to load cart from storage", err);
    return [];
  }
};

// Helper to safely save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save cart to storage", err);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addItems: (state, action) => {
      const incomingItem = action.payload;
      const existingItem = state.items.find((item) => item.id === incomingItem.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        state.items.push({
          ...incomingItem,
          quantity: 1,
        });
      }
      saveCartToStorage(state.items);
    },
    removeItems: (state, action) => {
      const targetId = action.payload;
      const existingItem = state.items.find((item) => item.id === targetId);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.id !== targetId);
        }
      }
      saveCartToStorage(state.items);
    },
    deleteItem: (state, action) => {
      const targetId = action.payload;
      state.items = state.items.filter((item) => item.id !== targetId);
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
});

export const { addItems, removeItems, deleteItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
