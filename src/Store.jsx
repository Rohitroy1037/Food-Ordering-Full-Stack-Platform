
import {configureStore} from "@reduxjs/toolkit";
import cartReducer from "./Components/utils/cartSlice.jsx";
import userReducer from "./Components/utils/userSlice.jsx";

const store = configureStore({
    reducer:{
        cart: cartReducer,
        user: userReducer,
    }
})


export default store;