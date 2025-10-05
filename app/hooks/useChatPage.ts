"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../states";
import { updateMessageForContact } from "../states/chatSlice";
import { useMessageEditing } from "./chats";
import { useMessageActions } from "./useChatMessageActions";
import { editMessage } from "../utils/editMessageApi";
import { useChatSocket } from "./useChatSocket";
import { useMapSendMessageResponse } from "./useMapSendMessageResponse";
import { useSendMessage } from "./useSendMessage";
import { useSendFile } from "./useSendFile";
import { useSendAudio } from "./useSendAudio";

export function useChatPage()
{
    const dispatch = useDispatch();
    const activeContact = useSelector(
        ( state: RootState ) => state.contacts.activeContact
    );
    const contactId = activeContact?.contact_id || "default";
    const messages = useSelector(
        ( state: RootState ) => state.chat[contactId] || []
    );
    const currentUserId = localStorage.getItem( "userId" ) || "";

    const {
        editingIndex,
        editType,
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleCancelEdit,
        setEditingIndex,
        setEditType,
    } = useMessageEditing( messages, () => { } );

    const {
        handleSoftDeleteTextMessage,
        handleSoftDeleteFileMessage,
        handleSoftDeleteAudioMessage,
        handleDeleteMessageForUser,
        handleDeleteFileMessageForUser,
        handleDeleteAudioMessageForUser,
    } = useMessageActions( contactId, editingIndex, setEditingIndex, setEditType );


    // 🔹 Init socket listener
    const socket = useChatSocket( contactId, currentUserId );
    const { mapSendMessageResponse } = useMapSendMessageResponse();

    // --- Handle submit edit ---
    const handleSubmitEdit = async ( editedText: string ) =>
    {
        if ( !editingMessage?.id ) return;

        try
        {
            const updatedRaw = await editMessage( editingMessage.id, editedText );
            const updated = mapSendMessageResponse( updatedRaw );

            const newText = editType === "text" ? updated.message_text : undefined;
            const newCaption = editType === "file" ? updated.message_text : undefined;

            dispatch(
                updateMessageForContact( {
                    contactId,
                    messageId: updated.message_id,
                    newText,
                    newCaption,
                    updatedAt: updated.updated_at ?? undefined,
                } )
            );

            if ( socket )
            {
                socket.emit( "editMessage", {
                    messageId: updated.message_id,
                    newText,
                    newCaption,
                } );
            }
        } catch ( err )
        {
            console.error( "Gagal edit pesan:", err );
        }

        handleCancelEdit();
    };

    // --- Socket listener untuk messageUpdated ---
    useEffect( () =>
    {
        if ( !socket ) return;

        const handleMessageUpdated = ( msg: any ) =>
        {
            const mappedMsg = mapSendMessageResponse( msg );

            dispatch(
                updateMessageForContact( {
                    contactId,
                    messageId: mappedMsg.message_id,
                    newText: mappedMsg.message_text,
                    newCaption:
                        mappedMsg.attachments && mappedMsg.attachments.length > 0
                            ? mappedMsg.message_text
                            : undefined,
                    updatedAt: mappedMsg.updated_at ?? undefined,
                } )
            );
        };

        socket.on( "messageUpdated", handleMessageUpdated );

        return () =>
        {
            socket.off( "messageUpdated", handleMessageUpdated );
        };
    }, [contactId, dispatch] );

    // --- Send text, file & audio pakai hooks ---
    const { handleSendMessage } = useSendMessage( contactId, currentUserId );
    const { handleSendFile, isSendingFile } = useSendFile(
        contactId,
        currentUserId
    );
    const { handleSendAudio, isSendingAudio } = useSendAudio(
        contactId,
        currentUserId
    );

    return {
        messages,
        editingIndex,
        editType,
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleSubmitEdit,
        handleCancelEdit,
        handleDeleteTextMessage: handleDeleteMessageForUser,
        handleSoftDeleteTextMessage,
        handleDeleteFileMessage: handleDeleteFileMessageForUser,
        handleSoftDeleteFileMessage,
        handleDeleteAudioMessage: handleDeleteAudioMessageForUser,
        handleSoftDeleteAudioMessage,
        handleSendMessage,
        handleSendAudio,
        handleSendFile,
        isSendingFile,
        isSendingAudio,
    };
}
