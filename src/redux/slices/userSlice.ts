import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorage, setLocalStorage } from '@utils/storage';
import { USER } from '@common/constant';

export interface UserInfo {
    userId: string;
    username: string;
    nickname: string;
    avatar: string;
    showModal: boolean;
}

const initialUser = JSON.parse(getLocalStorage(USER) ?? '{}');

const initialState: UserInfo = initialUser;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state: UserInfo, action: PayloadAction<UserInfo>) => {
            state = action.payload;
            setLocalStorage(USER, JSON.stringify(state));
            // console.log('完成配置');
        },
        toggleUserModal: (state: UserInfo, action: PayloadAction<boolean>) => {
            state.showModal = action.payload;
            if (state.showModal) {
            }
        },
    },
});

export const { setUserInfo, toggleUserModal } = userSlice.actions;

export default userSlice.reducer;
