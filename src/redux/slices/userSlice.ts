import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@utils/storage';
import { USER, TOKEN } from '@common/constant';
import { UserModel } from '@src/common/model';
import { userGet } from '@src/utils/request';
import { store } from '../store';

export interface UserInfo {
    userId: string;
    username: string;
    nickname: string;
    avatar: string;
    email: string;
    phoneNumber: string;
}

export interface UserLogin {
    token: string;
    logged: boolean;
}

const initialUser = JSON.parse(getLocalStorage(USER) ?? '{}');
const initialUserState: UserInfo = initialUser;
const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        setUserInfo: (state: UserInfo, action: PayloadAction<UserModel>) => {
            console.log('set user', action);
            let user = action.payload;
            state = {
                userId: user.userId,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar,
                email: user.email,
                phoneNumber: user.phoneNumber,
            };
            setLocalStorage(USER, JSON.stringify(state));

            return state;
        },
    },
});

const userShowSlice = createSlice({
    name: 'user-show',
    initialState: false,
    reducers: {
        toggleUserShow: (state: boolean, action: PayloadAction<boolean>) => {
            if (action.payload) {
                userGet().then((res) => {
                    if (res.isSuccess && res.data) {
                        store.dispatch(setUserInfo(res.data));
                    }
                });
            }

            return action.payload;
        },
    },
});

const userToken = getLocalStorage(TOKEN) ?? '';
const initialUserLogin: UserLogin = { token: userToken, logged: userToken.length > 0 };
const userLoginSlice = createSlice({
    name: 'user-login',
    initialState: initialUserLogin,
    reducers: {
        login: (state: UserLogin, action: PayloadAction<string>) => {
            let token = action.payload;
            state = { token: token, logged: token.length > 0 };
            setLocalStorage(TOKEN, token);

            return state;
        },
        logout: (state: UserLogin) => {
            state = { token: '', logged: false };
            removeLocalStorage(TOKEN);
            removeLocalStorage(USER);
            return state;
        },
    },
});

export const { setUserInfo } = userSlice.actions;
export const { toggleUserShow } = userShowSlice.actions;
export const { login, logout } = userLoginSlice.actions;

export const UserReducer = userSlice.reducer;
export const UserShowReducer = userShowSlice.reducer;
export const UserLoginReducer = userLoginSlice.reducer;
