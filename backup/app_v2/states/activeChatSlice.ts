import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActiveChatState
{
    email: string | null;
    name: string; // alias atau nama default
}

const initialState: ActiveChatState = {
    email: null,
    name: "Bento",
};

const activeChatSlice = createSlice( {
    name: "activeChat",
    initialState,
    reducers: {
        setActiveChat: (
            state,
            action: PayloadAction<{ email: string; name: string }>
        ) =>
        {
            state.email = action.payload.email;
            state.name = action.payload.name;
        },
        clearActiveChat: ( state ) =>
        {
            state.email = null;
            state.name = "Bento";
        },
    },
} );

export const { setActiveChat, clearActiveChat } = activeChatSlice.actions;
export default activeChatSlice.reducer;
