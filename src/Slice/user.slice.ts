import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../global.store';
import { LabelValue } from './rent.slice';


export interface UserState {
    userAddress: string,
}

const initialState: UserState = {
    userAddress: "",
}

export const userSlice = createSlice({
    name: 'rent',
    initialState,
    reducers: {
        changeState: (state, action: PayloadAction<LabelValue<string>>) => {
            switch (action.payload.label) {
                case "userAddress":
                    state.userAddress = action.payload.value as string;
                    break;
            }

        },

    },

})

export const { changeState } = userSlice.actions

const userState = (state: RootState) => state.user
export const userSelector = createSelector(userState, (m) => m)

export const userReducer = userSlice.reducer

