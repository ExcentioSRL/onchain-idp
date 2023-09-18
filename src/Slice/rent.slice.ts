import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { RentStatus, UserRentInterface } from '../Interfaces/RentInterfaces';
import { RootState } from '../global.store';

interface LabelValue<T = any> {
    label: string;
    value: T;
}

export interface RentState {
    user: UserRentInterface | undefined,
    platform: string | undefined,

    disabled: boolean,
    status: RentStatus,
}

const initialState: RentState = {
    user: undefined,
    platform: undefined,

    disabled: true,
    status: RentStatus.ACCOUNT,
}

export const changerentPage = (statusCode: RentStatus) => {
    switch (statusCode) {
        case RentStatus.ACCOUNT:
            return RentStatus.ACCOUNT;
        case RentStatus.CHOOSEDATE:
            return RentStatus.CHOOSEDATE;
        case RentStatus.CHOOSEPLATFORM:
            return RentStatus.CHOOSEPLATFORM;
        default:
            return RentStatus.ACCOUNT;
    }
}


export const rentSlice = createSlice({
    name: 'rent',
    initialState,
    reducers: {
        changeState: (state, action: PayloadAction<LabelValue<UserRentInterface | string | Date | undefined>>) => {
            switch (action.payload.label) {
                case "user":
                    state.user = action.payload.value as UserRentInterface;
                    break;

                case "platform":
                    state.platform = action.payload.value as string;
                    break;
            }
            state.disabled = state.platform === undefined || state.user === undefined
        },
        changeStatus: (state, action: PayloadAction<RentStatus>) => {
            state.status = changerentPage(action.payload);
        },
    },

})

export const { changeState, changeStatus } = rentSlice.actions

const rentState = (state: RootState) => state.rent
export const rentSelector = createSelector(rentState, (m) => m)

export const rentReducer = rentSlice.reducer

