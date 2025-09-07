import { Dispatch, SetStateAction } from "react";
import
    {
        DEFAULT_SOFT_DELETED_TEXT,
        DEFAULT_FILE_DELETED_TEXT,
    } from "../components/chat/deletedMessage";

export interface ChatMessage
{
    text?: string;
    audioUrl?: string;
    fileUrl?: string | null;
    fileName?: string;
    caption?: string | null;
    duration?: number;
    time: string;
    isSoftDeleted?: boolean;
    side: "kiri" | "kanan";
}

export function useChatMessageActions(
    setMessages: Dispatch<SetStateAction<ChatMessage[]>>
)
{
    const softDelete = (
        index: number,
        updates: Partial<ChatMessage> & { isSoftDeleted?: boolean } = {}
    ) =>
    {
        setMessages( ( prev ) =>
        {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                isSoftDeleted: true,
                ...updates,
            };
            return updated;
        } );
    };

    const handleSoftDeleteTextMessage = ( index: number ) =>
        softDelete( index, { text: DEFAULT_SOFT_DELETED_TEXT } );

    const handleSoftDeleteFileMessage = ( index: number ) =>
        softDelete( index, {
            fileUrl: null,
            caption: DEFAULT_SOFT_DELETED_TEXT,
        } );

    const handleSoftDeleteAudioMessage = ( index: number ) =>
        softDelete( index, { audioUrl: null, text: DEFAULT_SOFT_DELETED_TEXT } );

    const handleDeleteMessage = ( index: number ) =>
        setMessages( ( prev ) => prev.filter( ( _, i ) => i !== index ) );

    const handleDeleteFileMessage = ( index: number ) =>
        setMessages( ( prev ) => prev.filter( ( _, i ) => i !== index ) );

    const handleDeleteAudioMessage = ( index: number ) =>
        softDelete( index, { audioUrl: null, text: DEFAULT_FILE_DELETED_TEXT } );

    return {
        handleSoftDeleteTextMessage,
        handleSoftDeleteFileMessage,
        handleSoftDeleteAudioMessage,
        handleDeleteMessage,
        handleDeleteFileMessage,
        handleDeleteAudioMessage,
    };
}
