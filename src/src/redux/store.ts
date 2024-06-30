import { configureStore } from '@reduxjs/toolkit';
import { UserLoginReducer, UserReducer, UserShowReducer } from './slices/userSlice.ts';
import { UnreadMessageNumSliceReducer } from './slices/notificationSlice.ts';

export const store = configureStore({
    reducer: {
        userInfo: UserReducer,
        userShow: UserShowReducer,
        userLogin: UserLoginReducer,
        unreadMessageNum: UnreadMessageNumSliceReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
