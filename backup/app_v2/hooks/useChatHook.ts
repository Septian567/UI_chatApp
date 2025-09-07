import { useState } from "react";
import { ChatMessage } from "./useChatMessageActions";
import
    {
        useMessageState,
        useMessageEditing,
        useMessageDeletion,
    } from "./chats";

export function useChatHandlers()
{
    const { messages, setMessages } = useMessageState();

    const {
        editingIndex,
        editType,
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleSubmitEdit,
        handleCancelEdit,
    } = useMessageEditing( messages, setMessages );

    const [chatSide, setChatSide] = useState<"kiri" | "kanan">( "kanan" );

    function handleEditIndexChange( i: number | null )
    {
        ( editingIndex as any ) = i;
    }

    function handleEditTypeChange( t: "text" | "file" | null )
    {
        ( editType as any ) = t;
    }

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
        handleEditIndexChange,
        handleEditTypeChange
    );

    const handleSendMessage = ( message: string ) =>
    {
        const newMessage: ChatMessage = {
            text: message,
            time: new Date().toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit" } ),
            side: chatSide,
        };
        setMessages( prev => [...prev, newMessage] );
    };

    const handleSendAudio = ( audioBlob: Blob ) =>
    {
        const audioUrl = URL.createObjectURL( audioBlob );
        const newMessage: ChatMessage = {
            audioUrl,
            time: new Date().toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit" } ),
            side: chatSide,
        };
        setMessages( prev => [...prev, newMessage] );
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
        setMessages( prev => [...prev, newMessage] );
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
    };
}
