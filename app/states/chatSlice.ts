import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { upsertLastMessage, removeLastMessageByContact } from "./lastMessagesSlice";
import { ChatMessage } from "../types/chat";

interface ChatState
{
    [contactId: string]: ChatMessage[];
}

const initialState: ChatState = {};

// Helper: cari last message yang valid
const getLastValidMessage = ( messages: ChatMessage[] ): ChatMessage | undefined =>
{
    // Soft deleted masih valid, hanya skip yang hard deleted
    for ( let i = messages.length - 1; i >= 0; i-- )
    {
        if ( !messages[i].isDeleted ) return messages[i];
    }
    return undefined;
};

const chatSlice = createSlice( {
    name: "chat",
    initialState,
    reducers: {
        setMessagesForContact: (
            state,
            action: PayloadAction<{ contactId: string; messages: ChatMessage[] }>
        ) =>
        {
            state[action.payload.contactId] = [...action.payload.messages];
        },

        addMessageToContact: (
            state,
            action: PayloadAction<{ contactId: string; message: ChatMessage }>
        ) =>
        {
            const { contactId, message } = action.payload;
            const exists = ( state[contactId] || [] ).some(
                ( msg ) =>
                    ( msg.id && message.id && msg.id === message.id ) ||
                    ( msg.message_id && message.message_id && msg.message_id === message.message_id )
            );
            if ( !exists ) state[contactId] = [...( state[contactId] || [] ), message];
        },

        deleteMessageForContact: (
            state,
            action: PayloadAction<{ contactId: string; index: number }>
        ) =>
        {
            const { contactId, index } = action.payload;
            if ( !state[contactId] ) return;
            state[contactId] = state[contactId].filter( ( _, idx ) => idx !== index );
        },

        clearMessagesForContact: (
            state,
            action: PayloadAction<{ contactId: string }>
        ) =>
        {
            state[action.payload.contactId] = [];
        },

        updateMessageForContact: (
            state,
            action: PayloadAction<{
                contactId: string;
                messageId: string;
                newText?: string;
                newCaption?: string;
                newFileUrl?: string;
                newFileName?: string;
                newFileType?: string;
                newAudioUrl?: string;
                attachments?: any[];
                isDeleted?: boolean;
                isSoftDeleted?: boolean;
                isSending?: boolean;
                updatedAt?: string;
            }>
        ) =>
        {
            const { contactId, messageId, ...updates } = action.payload;
            const messages = state[contactId];
            if ( !messages ) return;

            state[contactId] = messages.map( ( msg ) =>
                msg.id === messageId || msg.message_id === messageId
                    ? {
                        ...msg,
                        text: updates.newText ?? msg.text,
                        caption: updates.newCaption ?? msg.caption,
                        fileUrl: updates.newFileUrl ?? msg.fileUrl,
                        fileName: updates.newFileName ?? msg.fileName,
                        fileType: updates.newFileType ?? msg.fileType,
                        audioUrl: updates.newAudioUrl ?? msg.audioUrl,
                        attachments: updates.attachments ?? msg.attachments,
                        isDeleted: updates.isDeleted ?? msg.isDeleted,
                        isSoftDeleted: updates.isSoftDeleted ?? msg.isSoftDeleted,
                        isSending: updates.isSending ?? msg.isSending,
                        updatedAt: updates.updatedAt ?? msg.updatedAt,
                    }
                    : msg
            );
        },

        removeMessageById: (
            state,
            action: PayloadAction<{ contactId: string; messageId: string }>
        ) =>
        {
            const { contactId, messageId } = action.payload;
            if ( !state[contactId] ) return;
            state[contactId] = state[contactId].filter(
                ( msg ) => msg.id !== messageId && msg.message_id !== messageId
            );
        },
    },
} );

// --- Thunks untuk sync dengan lastMessagesSlice ---
export const addMessageAndSync =
    ( payload: { contactId: string; message: ChatMessage } ) =>
        ( dispatch: any ) =>
        {
            dispatch( chatSlice.actions.addMessageToContact( payload ) );
            dispatch(
                upsertLastMessage( {
                    chat_partner_id: payload.contactId,
                    message_id: payload.message.id || payload.message.message_id || Date.now().toString(),
                    message_text: payload.message.text || "",
                    created_at: new Date().toISOString(),
                    is_deleted: payload.message.isDeleted ?? false,
                } )
            );
        };

export const updateMessageAndSync =
    ( payload: {
        contactId: string;
        messageId: string;
        newText?: string;
        isDeleted?: boolean;
        isSoftDeleted?: boolean;
        updatedAt?: string;
    } ) =>
        ( dispatch: any, getState: any ) =>
        {
            dispatch( chatSlice.actions.updateMessageForContact( payload ) );

            const state: ChatState = getState().chat;
            const messages = state[payload.contactId] || [];

            // Cari last valid message (tidak dihapus)
            const lastMsg = [...messages].reverse().find( ( msg ) => !msg.isDeleted );

            if ( lastMsg )
            {
                dispatch(
                    upsertLastMessage( {
                        chat_partner_id: payload.contactId,
                        message_id: lastMsg.id || lastMsg.message_id || Date.now().toString(),
                        message_text: lastMsg.text || "",
                        created_at: lastMsg.updatedAt || new Date().toISOString(),
                        is_deleted: lastMsg.isDeleted ?? false,
                    } )
                );
            } else
            {
                dispatch( removeLastMessageByContact( payload.contactId ) );
            }
        };

export const removeMessageAndSync =
    ( payload: { contactId: string; messageId: string } ) =>
        ( dispatch: any, getState: any ) =>
        {
            dispatch( chatSlice.actions.removeMessageById( payload ) );

            const state: ChatState = getState().chat;
            const messages = state[payload.contactId] || [];
            const lastMsg = getLastValidMessage( messages );

            if ( lastMsg )
            {
                dispatch(
                    upsertLastMessage( {
                        chat_partner_id: payload.contactId,
                        message_id: lastMsg.id || lastMsg.message_id || Date.now().toString(),
                        message_text: lastMsg.text || "",
                        created_at: lastMsg.updatedAt || new Date().toISOString(),
                        is_deleted: lastMsg.isDeleted ?? false,
                    } )
                );
            } else
            {
                dispatch( removeLastMessageByContact( payload.contactId ) );
            }
        };

export const {
    setMessagesForContact,
    addMessageToContact,
    deleteMessageForContact,
    clearMessagesForContact,
    updateMessageForContact,
    removeMessageById,
} = chatSlice.actions;

export default chatSlice.reducer;
