import { useEffect, useState, useRef } from "react";

export function useAlias( email: string, onUpdate?: ( email: string, newAlias: string ) => void, onDelete?: ( email: string ) => void )
{
    const [alias, setAlias] = useState( "" );
    const [editing, setEditing] = useState( false );
    const inputRef = useRef<HTMLInputElement>( null );

    const storageKey = `alias_${ email }`;

    useEffect( () =>
    {
        const savedAlias = localStorage.getItem( storageKey );
        if ( savedAlias ) setAlias( savedAlias );
    }, [storageKey] );

    useEffect( () =>
    {
        if ( editing && inputRef.current )
        {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing] );

    const handleSave = () =>
    {
        const trimmed = alias.trim().slice( 0, 15 );
        if ( trimmed )
        {
            localStorage.setItem( storageKey, trimmed );
            setAlias( trimmed );
            setEditing( false );
            onUpdate?.( email, trimmed );
        }
    };

    const handleCancel = () =>
    {
        setEditing( false );
        const savedAlias = localStorage.getItem( storageKey );
        if ( savedAlias ) setAlias( savedAlias );
    };

    const handleDelete = () =>
    {
        localStorage.removeItem( storageKey );
        setAlias( "" );
        setEditing( false );
        onDelete?.( email );
    };

    const handleKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) =>
    {
        if ( e.key === "Enter" )
        {
            e.preventDefault();
            handleSave();
        }
        if ( e.key === "Escape" )
        {
            e.preventDefault();
            handleCancel();
        }
    };

    return {
        alias,
        setAlias,
        editing,
        setEditing,
        inputRef,
        handleSave,
        handleCancel,
        handleDelete,
        handleKeyDown,
    };
}
