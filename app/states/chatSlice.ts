import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage
{
    text?: string;
    fileUrl?: string;
    fileName?: string;
    caption?: string;
    audioUrl?: string;
    time: string;
    side: "kiri" | "kanan";
}

interface ChatState
{
    [contactName: string]: ChatMessage[];
}

const initialState: ChatState = {};

const chatSlice = createSlice( {
    name: "chat",
    initialState,
    reducers: {
        setMessagesForContact: (
            state,
            action: PayloadAction<{ contact: string; messages: ChatMessage[] }>
        ) =>
        {
            state[action.payload.contact] = action.payload.messages;
        },
        addMessageToContact: (
            state,
            action: PayloadAction<{ contact: string; message: ChatMessage }>
        ) =>
        {
            if ( !state[action.payload.contact] ) state[action.payload.contact] = [];
            state[action.payload.contact].push( action.payload.message );
        },
        deleteMessageForContact: (
            state,
            action: PayloadAction<{ contact: string; index: number }>
        ) =>
        {
            state[action.payload.contact]?.splice( action.payload.index, 1 );
        },
    },
} );

export const { setMessagesForContact, addMessageToContact, deleteMessageForContact } =
    chatSlice.actions;

export default chatSlice.reducer;
