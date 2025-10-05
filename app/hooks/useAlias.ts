import { useEffect, useRef, useState } from "react";

export function useAlias( email: string, initialAlias: string )
{
    const [alias, setAlias] = useState( initialAlias );
    const [isEditing, setIsEditing] = useState( false );
    const inputRef = useRef<HTMLInputElement>( null );

    // Sinkronisasi alias dari props/API
    useEffect( () =>
    {
        setAlias( initialAlias );
    }, [initialAlias] );

    // Fokus otomatis saat mulai edit, cursor di akhir teks
    useEffect( () =>
    {
        if ( isEditing && inputRef.current )
        {
            const input = inputRef.current;
            input.focus();
            const length = input.value.length;
            input.setSelectionRange( length, length ); // cursor di ujung
        }
    }, [isEditing] );

    const startEditing = () => setIsEditing( true );

    const saveAlias = (
        onAliasSave?: ( username: string, email: string, alias: string ) => void,
        username?: string
    ) =>
    {
        const trimmed = alias.trim();
        if ( !trimmed ) return;

        setIsEditing( false );
        if ( onAliasSave && username ) onAliasSave( username, email, trimmed );
    };

    const cancelEditing = () =>
    {
        setIsEditing( false );
        setAlias( initialAlias );
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        onAliasSave?: ( username: string, email: string, alias: string ) => void,
        username?: string
    ) =>
    {
        if ( e.key === "Enter" )
        {
            e.preventDefault();
            saveAlias( onAliasSave, username );
        } else if ( e.key === "Escape" )
        {
            e.preventDefault();
            cancelEditing();
        }
    };

    return {
        alias,
        setAlias,
        isEditing,
        startEditing,
        inputRef,
        saveAlias,
        cancelEditing,
        handleKeyDown,
    };
}
