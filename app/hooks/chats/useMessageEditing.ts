import { useState } from "react";
import { ChatMessage } from "./useMessageState";

export function useMessageEditing(
    messages: ChatMessage[],
    onUpdate: ( newMessages: ChatMessage[] ) => void
)
{
    const [editingIndex, setEditingIndex] = useState<number | null>( null );
    const [editType, setEditType] = useState<"text" | "file" | null>( null );

    const handleEditTextMessage = ( index: number ) =>
    {
        setEditingIndex( index );
        setEditType( "text" );
    };

    const handleEditFileMessage = ( index: number ) =>
    {
        setEditingIndex( index );
        setEditType( "file" );
    };

    const handleSubmitEdit = ( newValue: string ) =>
    {
        if ( editingIndex === null || !editType ) return;

        const updated = [...messages];
        if ( editType === "text" )
        {
            updated[editingIndex] = {
                ...updated[editingIndex],
                text: newValue,
                isSoftDeleted: false,
            };
        } else if ( editType === "file" )
        {
            updated[editingIndex] = {
                ...updated[editingIndex],
                caption: newValue,
                isSoftDeleted: false,
            };
        }

        onUpdate( updated );
        setEditingIndex( null );
        setEditType( null );
    };

    const handleCancelEdit = () =>
    {
        setEditingIndex( null );
        setEditType( null );
    };

    const editingMessage =
        editingIndex !== null ? messages[editingIndex] : null;

    return {
        editingIndex,
        editType,
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleSubmitEdit,
        handleCancelEdit,
        setEditingIndex,
        setEditType,
    };
}
