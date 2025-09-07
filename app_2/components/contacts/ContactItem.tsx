import { useEffect, useState, useRef } from "react";
import { User, Pencil, Trash2, Check, X } from "lucide-react";

interface ContactItemProps
{
    name: string;
    email: string;
    onDelete?: ( email: string ) => void;
    onUpdate?: ( email: string, newAlias: string ) => void;
    onSelect?: ( email: string ) => void;
}

export default function ContactItem( {
    name,
    email,
    onDelete,
    onUpdate,
    onSelect,
}: ContactItemProps )
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
        const trimmed = alias.trim().slice( 0, 12 );
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

    const handleDelete = ( e: React.MouseEvent ) =>
    {
        e.stopPropagation();
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

    return (
        <div
            className="flex items-start justify-between p-4 border-b cursor-pointer hover:bg-gray-50"
            onClick={ () => !editing && onSelect?.( email ) }
        >
            <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0 -ml-4">
                    <User className="w-6 h-6 text-gray-500" />
                </div>


                <div className="flex flex-col min-w-0">
                    { editing ? (
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                ref={ inputRef }
                                type="text"
                                value={ alias }
                                onChange={ ( e ) =>
                                {
                                    if ( e.target.value.length <= 12 )
                                    {
                                        setAlias( e.target.value );
                                    }
                                } }
                                onKeyDown={ handleKeyDown }
                                placeholder="alias..."
                                className="border rounded px-2 py-1 text-sm"
                            />
                            <button
                                onClick={ ( e ) =>
                                {
                                    e.stopPropagation();
                                    handleSave();
                                } }
                                className="p-1 rounded hover:bg-gray-200"
                            >
                                <Check className="w-4 h-4 text-black" />
                            </button>
                            <button
                                onClick={ ( e ) =>
                                {
                                    e.stopPropagation();
                                    handleCancel();
                                } }
                                className="p-1 rounded hover:bg-gray-200"
                            >
                                <X className="w-4 h-4 text-black" />
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Alias / Name */ }
                            <p
                                className="font-semibold text-sm truncate overflow-hidden whitespace-nowrap max-w-[180px] sm:max-w-[250px]"
                                title={ alias || name }
                            >
                                { alias || name }
                            </p>

                            {/* Email */ }
                            <p
                                className="text-sm text-gray-600 truncate overflow-hidden whitespace-nowrap max-w-[180px] sm:max-w-[250px]"
                                title={ email }
                            >
                                { email }
                            </p>
                        </>
                    ) }
                </div>
            </div>

            { !editing && (
                <div className="flex gap-2">
                    <button
                        onClick={ ( e ) =>
                        {
                            e.stopPropagation();
                            setEditing( true );
                        } }
                        className="p-2 rounded hover:bg-gray-100"
                    >
                        <Pencil className="w-5 h-5 text-gray-600" />
                    </button>
                    { alias && (
                        <button
                            onClick={ handleDelete }
                            className="p-2 rounded hover:bg-gray-100"
                        >
                            <Trash2 className="w-5 h-5 text-gray-600" />
                        </button>
                    ) }
                </div>
            ) }
        </div>
    );
}
