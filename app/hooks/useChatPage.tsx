"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../states";
import
    {
        ChatMessage,
        addMessageToContact,
        setMessagesForContact,
    } from "../states/chatSlice";
import { useMessageEditing, useMessageDeletion } from "./chats";

export function useChatPage()
{
    const dispatch = useDispatch();

    // Ambil kontak aktif dari redux
    const activeContact = useSelector( ( state: RootState ) => state.contacts.activeContact );
    const contactName = activeContact?.alias || activeContact?.name || "Bento";

    // Ambil pesan dari Redux
    const messages = useSelector( ( state: RootState ) => state.chat[contactName] || [] );
    const [chatSide, setChatSide] = useState<"kiri" | "kanan">( "kanan" );

    // --- Hook untuk edit pesan ---
    const {
        editingIndex,
        editType,
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleSubmitEdit,
        handleCancelEdit,
        setEditingIndex,
        setEditType,
    } = useMessageEditing( messages, ( newMessages: ChatMessage[] ) =>
    {
        // Update messages di Redux setelah edit
        dispatch( setMessagesForContact( { contact: contactName, messages: newMessages } ) );
    } );

    // --- Hook untuk hapus / soft delete pesan ---
    const {
        handleDeleteTextMessage,
        handleSoftDeleteTextMessage,
        handleSoftDeleteFileMessage,
        handleDeleteFileMessage,
        handleSoftDeleteAudioMessage,
        handleDeleteAudioMessage,
    } = useMessageDeletion(
        messages,
        ( newMessages: ChatMessage[] ) =>
        {
            dispatch( setMessagesForContact( { contact: contactName, messages: newMessages } ) );
        },
        editingIndex,
        setEditingIndex,
        setEditType
    );

    // --- Fungsi kirim pesan ---
    const handleSendMessage = ( message: string ) =>
    {
        const newMessage: ChatMessage = {
            text: message,
            time: new Date().toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit" } ),
            side: chatSide,
        };
        dispatch( addMessageToContact( { contact: contactName, message: newMessage } ) );
    };

    const handleSendAudio = ( audioBlob: Blob ) =>
    {
        const audioUrl = URL.createObjectURL( audioBlob );
        const newMessage: ChatMessage = {
            audioUrl,
            time: new Date().toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit" } ),
            side: chatSide,
        };
        dispatch( addMessageToContact( { contact: contactName, message: newMessage } ) );
    };

    const handleSendFile = ( file: File, caption?: string ) =>
    {
        const fileUrl = URL.createObjectURL( file );
        const newMessage: ChatMessage = {
            fileUrl,
            fileName: file.name,
            caption: caption?.trim() || undefined,
            time: new Date().toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit" } ),
            side: chatSide,
        };
        dispatch( addMessageToContact( { contact: contactName, message: newMessage } ) );
    };

    return {
        messages,
        chatSide,
        setChatSide,
        editingIndex,
        editType,
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleSubmitEdit,
        handleCancelEdit,
        handleDeleteTextMessage,
        handleSoftDeleteTextMessage,
        handleDeleteFileMessage,
        handleSoftDeleteFileMessage,
        handleDeleteAudioMessage,
        handleSoftDeleteAudioMessage,
        handleSendMessage,
        handleSendAudio,
        handleSendFile,
    };
}
