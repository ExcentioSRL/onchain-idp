import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { contractReducer } from './Slice/contracts.slice';

export const globalStore = configureStore({
    reducer: {
        contract: contractReducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk),
})
export type RootState = ReturnType<typeof globalStore.getState>
export type AppDispatch = typeof globalStore.dispatch;
