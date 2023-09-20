import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { rentReducer } from './Slice/rent.slice';
import { userReducer } from './Slice/user.slice';

export const globalStore = configureStore({
    reducer: {
        rent: rentReducer,
        user: userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk),
})
export type RootState = ReturnType<typeof globalStore.getState>
export type AppDispatch = typeof globalStore.dispatch;
