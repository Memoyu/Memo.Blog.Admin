import { configureStore } from '@reduxjs/toolkit';
import { UserLoginReducer, UserReducer, UserShowReducer } from './slices/userSlice.ts';

export const store = configureStore({
    reducer: {
        userInfo: UserReducer,
        userShow: UserShowReducer,
        userLogin: UserLoginReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
