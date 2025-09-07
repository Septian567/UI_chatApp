import { useState } from "react";
import { ChatMessage } from "./useChatMessageActions";
import
    {
        useMessageEditing,
        useMessageDeletion,
    } from "./chats";

interface ChatHandlersProps
{
    messages: ChatMessage[];
    setMessages: ( msgs: ChatMessage[] ) => void;
}

export function useChatHandlers( { messages, setMessages }: ChatHandlersProps )
{
    // ── Edit state lokal untuk index/type ──
    const [editingIndex, setEditingIndex] = useState<number | null>( null );
    const [editType, setEditType] = useState<"text" | "file" | null>( null );

    const {
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleSubmitEdit,
        handleCancelEdit,
    } = useMessageEditing( messages, setMessages, editingIndex, editType );

    const {
        handleDeleteTextMessage,
        handleSoftDeleteTextMessage,
        handleSoftDeleteFileMessage,
        handleDeleteFileMessage,
        handleSoftDeleteAudioMessage,
        handleDeleteAudioMessage,
    } = useMessageDeletion(
        messages,
        setMessages,
        editingIndex,
        setEditingIndex,
        setEditType
    );

    const [chatSide, setChatSide] = useState<"kiri" | "kanan">( "kanan" );

    // ── Handler kirim pesan ──
    const handleSendMessage = ( text: string ) =>
    {
        if ( !text.trim() ) return;
        const newMessage: ChatMessage = {
            text,
            time: new Date().toISOString(),
            side: chatSide,
        };
        setMessages( [...messages, newMessage] );
    };

    const handleSendAudio = ( audioBlob: Blob ) =>
    {
        const audioUrl = URL.createObjectURL( audioBlob );
        const newMessage: ChatMessage = {
            audioUrl,
            time: new Date().toISOString(),
            side: chatSide,
        };
        setMessages( [...messages, newMessage] );
    };

    const handleSendFile = ( file: File, caption?: string ) =>
    {
        const fileUrl = URL.createObjectURL( file );
        const newMessage: ChatMessage = {
            fileUrl,
            fileName: file.name,
            caption: caption?.trim() || undefined,
            time: new Date().toISOString(),
            side: chatSide,
        };
        setMessages( [...messages, newMessage] );
    };

    return {
        messages,
        setMessages,
        editingIndex,
        editType,
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleSubmitEdit,
        handleCancelEdit,
        handleDeleteTextMessage,
        handleSoftDeleteTextMessage,
        handleSoftDeleteFileMessage,
        handleDeleteFileMessage,
        handleSoftDeleteAudioMessage,
        handleDeleteAudioMessage,
        handleSendMessage,
        handleSendAudio,
        handleSendFile,
        chatSide,
        setChatSide,
        setEditingIndex,
        setEditType,
    };
}
