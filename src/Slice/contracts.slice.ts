import { createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../global.store";
import { ethers } from "ethers";


interface ContractsInterface {
    idpContract: ethers.Contract | undefined;
    tokenContract: ethers.Contract | undefined;
}

const initialState: ContractsInterface = {
    idpContract: undefined,
    tokenContract: undefined
}


export const contractSlice = createSlice({
    name: 'contract',
    initialState,
    reducers: {
        setContract: (state, action) => {
            state.tokenContract = action.payload.token;
            state.idpContract = action.payload.idp;
        }
    },

})

export const { setContract } = contractSlice.actions

const contractCounter = (state: RootState) => state.contract
export const contractSelector = createSelector(contractCounter, (v) => v)

export const contractReducer = contractSlice.reducer