import { useEffect, useState, useRef } from "react";
import { User, Pencil, Trash2, Check, X } from "lucide-react";

interface ContactItemProps
{
    email: string;
    alias: string;
    contact_id?: string;
    avatar_url?: string;
    onDelete?: ( email: string ) => void;
    onUpdate?: ( email: string, alias: string, contact_id?: string ) => void;
    onSelect?: ( email: string ) => void;
}

export default function ContactItem( {
    email,
    alias: propAlias = "",
    contact_id,
    avatar_url,
    onDelete,
    onUpdate,
    onSelect,
}: ContactItemProps )
{
    const [alias, setAlias] = useState( propAlias );
    const [editing, setEditing] = useState( false );
    const inputRef = useRef<HTMLInputElement>( null );

    // Sinkronisasi alias dari props
    useEffect( () =>
    {
        setAlias( propAlias );
    }, [propAlias] );

    // Fokus otomatis saat mulai edit
    useEffect( () =>
    {
        if ( editing )
        {
            const input = inputRef.current;
            if ( input )
            {
                input.focus();
                const length = input.value.length;
                // taruh cursor di akhir teks
                input.setSelectionRange( length, length );
            }
        }
    }, [editing] );

    const handleSave = () =>
    {
        const trimmed = alias.trim().slice( 0, 12 );
        setAlias( trimmed );
        setEditing( false );
        onUpdate?.( email, trimmed, contact_id );
    };

    const handleCancel = () =>
    {
        setEditing( false );
        setAlias( propAlias );
    };

    const handleDelete = ( e: React.MouseEvent ) =>
    {
        e.stopPropagation();
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
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0 -ml-4 overflow-hidden">
                    { avatar_url ? (
                        <img src={ avatar_url } alt={ alias || email } className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-6 h-6 text-gray-500" />
                    ) }
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
                                    if ( e.target.value.length <= 12 ) setAlias( e.target.value );
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
                            <p className="font-semibold text-sm truncate" title={ alias || "-" }>
                                { alias || "-" }
                            </p>
                            <p className="text-sm text-gray-600 truncate" title={ email }>
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
                        <button onClick={ handleDelete } className="p-2 rounded hover:bg-gray-100">
                            <Trash2 className="w-5 h-5 text-gray-600" />
                        </button>
                    ) }
                </div>
            ) }
        </div>
    );
}
