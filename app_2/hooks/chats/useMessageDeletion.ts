import { ChatMessage } from "./useMessageState";
import { DEFAULT_SOFT_DELETED_TEXT } from "../../components/chat/deletedMessage";

export function useMessageDeletion(
    messages: ChatMessage[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    editingIndex: number | null,
    setEditingIndex: ( index: number | null ) => void,
    setEditType: ( type: "text" | "file" | null ) => void
)
{
    const resetEditingIfNeeded = ( index: number ) =>
    {
        if ( editingIndex === index )
        {
            setEditingIndex( null );
            setEditType( null );
        } else if ( editingIndex !== null && index < editingIndex )
        {
            setEditingIndex( editingIndex - 1 );
        }
    };

    // 🔹 Hard delete text → remove dari array
    const handleDeleteTextMessage = ( index: number ) =>
    {
        setMessages( ( prev ) => prev.filter( ( _, i ) => i !== index ) );
        resetEditingIfNeeded( index );
    };

    // 🔹 Soft delete text → placeholder
    const handleSoftDeleteTextMessage = ( index: number ) =>
    {
        setMessages( ( prev ) =>
        {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                text: DEFAULT_SOFT_DELETED_TEXT,
                isSoftDeleted: true,
            };
            return updated;
        } );
        resetEditingIfNeeded( index );
    };

    // 🔹 Soft delete file → null-kan file, caption jadi placeholder
    const handleSoftDeleteFileMessage = ( index: number ) =>
    {
        setMessages( ( prev ) =>
        {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                fileUrl: null,
                caption: DEFAULT_SOFT_DELETED_TEXT,
                isSoftDeleted: true,
            };
            return updated;
        } );
        resetEditingIfNeeded( index );
    };

    // 🔹 Hard delete file → remove dari array
    const handleDeleteFileMessage = ( index: number ) =>
    {
        setMessages( ( prev ) => prev.filter( ( _, i ) => i !== index ) );
        resetEditingIfNeeded( index );
    };

    // 🔹 Soft delete audio → kosongkan audioUrl + placeholder text
    const handleSoftDeleteAudioMessage = ( index: number ) =>
    {
        setMessages( ( prev ) =>
        {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                audioUrl: null,
                text: DEFAULT_SOFT_DELETED_TEXT,
                isSoftDeleted: true,
            };
            return updated;
        } );
        resetEditingIfNeeded( index );
    };

    // 🔹 Hard delete audio → remove dari array
    const handleDeleteAudioMessage = ( index: number ) =>
    {
        setMessages( ( prev ) => prev.filter( ( _, i ) => i !== index ) );
        resetEditingIfNeeded( index );
    };

    return {
        handleDeleteTextMessage,
        handleSoftDeleteTextMessage,
        handleSoftDeleteFileMessage,
        handleDeleteFileMessage,
        handleSoftDeleteAudioMessage,
        handleDeleteAudioMessage,
    };
}
