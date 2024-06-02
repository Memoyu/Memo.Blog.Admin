import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const userNotifyTotalSlice = createSlice({
    name: 'user-notify-total',
    initialState: 0,
    reducers: {
        setUserNotifyTotal: (state: number, action: PayloadAction<number>) => {
            state = action.payload;
            return state;
        },
    },
});

export const { setUserNotifyTotal } = userNotifyTotalSlice.actions;

export const UserNotifyTotalReducer = userNotifyTotalSlice.reducer;
