// /states/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage
{
    text?: string;
    audioUrl?: string;
    fileUrl?: string;
    caption?: string;
    time: string;
    side: "kiri" | "kanan";
    isSoftDeleted?: boolean;
}

interface ChatState
{
    [contactId: string]: ChatMessage[];
}

const initialState: ChatState = {};

const chatSlice = createSlice( {
    name: "chat",
    initialState,
    reducers: {
        setChat: ( state, action: PayloadAction<{ contactId: string; messages: ChatMessage[] }> ) =>
        {
            state[action.payload.contactId] = action.payload.messages;
        },
        addMessage: ( state, action: PayloadAction<{ contactId: string; message: ChatMessage }> ) =>
        {
            if ( !state[action.payload.contactId] ) state[action.payload.contactId] = [];
            state[action.payload.contactId].push( action.payload.message );
        },
        updateMessage: (
            state,
            action: PayloadAction<{ contactId: string; index: number; message: ChatMessage }>
        ) =>
        {
            state[action.payload.contactId][action.payload.index] = action.payload.message;
        },
        deleteMessage: ( state, action: PayloadAction<{ contactId: string; index: number }> ) =>
        {
            state[action.payload.contactId].splice( action.payload.index, 1 );
        },
    },
} );

export const { setChat, addMessage, updateMessage, deleteMessage } = chatSlice.actions;
export default chatSlice.reducer;
