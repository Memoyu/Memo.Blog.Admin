import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import { UserModel, UserStoreModel } from '@src/common/model';
import { userGet } from '@src/utils/request';

interface UserState {
    userInfo?: UserStoreModel; //用户信息
    token: string;
    logged: boolean;
    showUserModal: boolean;
    setUser: (user: UserModel) => void;
    toggleUserShow: (state: boolean) => void;
    login: (token: string) => void;
    logout: () => void;
}

const useUserStore = createWithEqualityFn<UserState>()(
    persist(
        (set) => ({
            userInfo: undefined,
            token: '',
            logged: false,
            showUserModal: false,
            setUser: (user: UserModel) => {
                let userStore: UserStoreModel = {
                    userId: user.userId,
                    username: user.username,
                    nickname: user.nickname,
                    avatar: user.avatar,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                };
                set({ userInfo: userStore });
            },
            toggleUserShow: (state: boolean) => {
                if (state) {
                    userGet().then((res) => {
                        if (res.isSuccess && res.data) {
                            let user = res.data;
                            let userStore: UserStoreModel = {
                                userId: user.userId,
                                username: user.username,
                                nickname: user.nickname,
                                avatar: user.avatar,
                                email: user.email,
                                phoneNumber: user.phoneNumber,
                            };
                            set({ userInfo: userStore });
                        }
                    });
                }

                set({ showUserModal: state });
            },
            login: (token: string) => {
                set({ token: token, logged: true });
            },
            logout: () => {
                set({ token: '', logged: false });
                set({ userInfo: undefined, token: '', logged: false });
            },
        }),
        {
            name: 'user-store', // name of the item in the storage (must be unique)
        }
    )
);

export default useUserStore;
