import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";

interface UseMessageInputProps
{
    isEditing?: boolean;
    initialEditValue?: string;
    onSend: ( message: string ) => void;
    onSubmitEdit?: ( editedMessage: string ) => void;
    onCancelEdit?: () => void;
    onSendFile?: ( file: File, caption?: string ) => void;
}

export function useMessageInput( {
    isEditing = false,
    initialEditValue = "",
    onSend,
    onSubmitEdit,
    onCancelEdit,
    onSendFile,
}: UseMessageInputProps )
{
    const [message, setMessage] = useState( "" );
    const [selectedFile, setSelectedFile] = useState<File | null>( null );

    const textareaRef = useRef<HTMLTextAreaElement>( null );

    // Atur nilai awal ketika edit
    useEffect( () =>
    {
        setMessage( isEditing ? initialEditValue : "" );
    }, [isEditing, initialEditValue] );

    // Fokus ke textarea ketika edit
    useEffect( () =>
    {
        if ( isEditing && textareaRef.current )
        {
            const el = textareaRef.current;
            el.focus();
            el.selectionStart = el.selectionEnd = el.value.length;
        }
    }, [isEditing] );

    const handleSend = () =>
    {
        if ( isEditing && onSubmitEdit )
        {
            if ( message.trim() )
            {
                onSubmitEdit( message.trim() );
            }
            resetInput();
            return;
        }

        if ( selectedFile && onSendFile )
        {
            onSendFile( selectedFile, message.trim() || undefined );
        } else if ( message.trim() )
        {
            onSend( message.trim() );
        }
        resetInput();
    };

    const handleKeyDown = ( e: KeyboardEvent<HTMLTextAreaElement> ) =>
    {
        if ( e.key === "Enter" && !e.shiftKey )
        {
            e.preventDefault();
            handleSend();
        } else if ( e.key === "Escape" && isEditing )
        {
            e.preventDefault();
            onCancelEdit?.();
        }
    };

    const handleFileChange = ( e: ChangeEvent<HTMLInputElement> ) =>
    {
        const file = e.target.files?.[0];
        if ( file )
        {
            setSelectedFile( file );
            setTimeout( () => textareaRef.current?.focus(), 0 );
        }
        e.target.value = "";
    };

    const cancelFile = () =>
    {
        setSelectedFile( null );
    };

    const resetInput = () =>
    {
        setMessage( "" );
        setSelectedFile( null );
    };

    // Auto-resize textarea
    useEffect( () =>
    {
        const el = textareaRef.current;
        if ( el )
        {
            el.style.height = "auto";
            el.style.height = `${ Math.min( el.scrollHeight, 128 ) }px`;
        }
    }, [message] );

    return {
        message,
        setMessage,
        textareaRef,
        handleSend,
        handleKeyDown,
        handleFileChange,
        selectedFile,
        cancelFile,
        resetInput,
    };
}
