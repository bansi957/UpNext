import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import chatReducer from './chatSlice';


export const Store = configureStore({
  reducer:{
    user:userReducer,
    chat:chatReducer
  }
})
