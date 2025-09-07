import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../utils/chatStorage";

interface ChatState
{
    chats: Record<string, ChatMessage[]>; // key: contactId/alias
}

const initialState: ChatState = {
    chats: {},
};

const chatSlice = createSlice( {
    name: "chat",
    initialState,
    reducers: {
        setChatMessages: (
            state,
            action: PayloadAction<{ contactId: string; messages: ChatMessage[] }>
        ) =>
        {
            state.chats[action.payload.contactId] = action.payload.messages;
        },
        addMessage: (
            state,
            action: PayloadAction<{ contactId: string; message: ChatMessage }>
        ) =>
        {
            const { contactId, message } = action.payload;
            if ( !state.chats[contactId] ) state.chats[contactId] = [];
            state.chats[contactId].push( message );
        },
        deleteChat: ( state, action: PayloadAction<string> ) =>
        {
            delete state.chats[action.payload];
        },
    },
} );

export const { setChatMessages, addMessage, deleteChat } = chatSlice.actions;
export default chatSlice.reducer;
