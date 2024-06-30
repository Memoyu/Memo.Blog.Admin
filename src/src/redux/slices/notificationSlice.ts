import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UnreadMessageNum, MessageType } from '@src/common/model';

const initialUnreadMessageNum: UnreadMessageNum = {
    total: 0,
    user: 0,
    comment: 0,
    like: 0,
};

const unreadMessageNumSlice = createSlice({
    name: 'unread-notification-num',
    initialState: initialUnreadMessageNum,
    reducers: {
        setUnreadMessageNum: (state: UnreadMessageNum, action: PayloadAction<UnreadMessageNum>) => {
            state = action.payload;
            return state;
        },
        incrementTypeNum: (
            state: UnreadMessageNum,
            action: PayloadAction<{ num: number; type: MessageType }>
        ) => {
            let num = action.payload.num;
            let type = action.payload.type;
            switch (type) {
                case MessageType.User:
                    state.user += num;
                    break;
                case MessageType.Comment:
                    state.comment += num;
                    break;
                case MessageType.Like:
                    state.like += num;
                    break;
            }
            state.total += num;
            return state;
        },
    },
});

export const { setUnreadMessageNum, incrementTypeNum } = unreadMessageNumSlice.actions;
export const UnreadMessageNumSliceReducer = unreadMessageNumSlice.reducer;
