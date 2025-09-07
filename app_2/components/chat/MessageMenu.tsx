import { MoreVertical, Edit3, Slash, Trash2 } from "react-feather";
import { useMenu } from "../../hooks/useMenu";
import { createPortal } from "react-dom";
import { useRef, useEffect, useState } from "react";

interface MessageMenuProps
{
    isSoftDeleted: boolean;
    align?: "left" | "right";
    onEditClick?: () => void;
    onSoftDeleteClick?: () => void;
    onDeleteClick?: () => void;
    onToggle?: ( isOpen: boolean ) => void;
}

export function MessageMenu( {
    isSoftDeleted,
    align = "right",
    onEditClick,
    onSoftDeleteClick,
    onDeleteClick,
    onToggle,
}: MessageMenuProps )
{
    const { isOpen, setIsOpen, menuRef } = useMenu();
    const buttonRef = useRef<HTMLButtonElement>( null );
    const [position, setPosition] = useState<{ top: number; left: number }>( { top: 0, left: 0 } );

    const handleClick = ( callback?: () => void ) =>
    {
        if ( callback ) callback();
        setIsOpen( false );
        onToggle?.( false );
    };

    const calculatePosition = () =>
    {
        if ( buttonRef.current )
        {
            const rect = buttonRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            let left: number;
            const menuWidth = menuRef.current?.offsetWidth ?? 176; // fallback default w-44

            if ( align === "right" )
            {
                left = rect.right + window.scrollX - menuWidth;
            } else
            {
                left = rect.left + window.scrollX;
                if ( left + menuWidth > viewportWidth - 15 )
                {
                    left = viewportWidth - menuWidth - 15;
                }
            }

            setPosition( {
                top: rect.bottom + window.scrollY + 4,
                left,
            } );
        }
    };

    const handleToggleButton = () =>
    {
        if ( !isOpen )
        {
            calculatePosition(); // ✅ hitung posisi sebelum buka
        }
        setIsOpen( prev => !prev );
    };

    useEffect( () =>
    {
        onToggle?.( isOpen );
    }, [isOpen, onToggle] );

    useEffect( () =>
    {
        if ( !isOpen ) return;

        function updatePosition()
        {
            calculatePosition();
        }

        updatePosition();
        window.addEventListener( "resize", updatePosition );
        window.addEventListener( "scroll", updatePosition );

        return () =>
        {
            window.removeEventListener( "resize", updatePosition );
            window.removeEventListener( "scroll", updatePosition );
        };
    }, [isOpen, align] );

    const menu = (
        <div
            ref={ menuRef }
            className="absolute w-44 bg-white border rounded shadow text-sm z-[9999]"
            style={ { top: position.top, left: position.left, position: "absolute" } }
        >
            { align === "left" ? (
                <button
                    type="button"
                    className="flex items-center gap-2 w-full text-left px-3 py-1 hover:bg-gray-100"
                    onClick={ () => handleClick( onDeleteClick ) }
                >
                    <Trash2 size={ 14 } /> Hapus untuk saya
                </button>
            ) : !isSoftDeleted ? (
                <>
                    { onEditClick && (
                        <button
                            type="button"
                            className="flex items-center gap-2 w-full text-left px-3 py-1 hover:bg-gray-100"
                            onClick={ () => handleClick( onEditClick ) }
                        >
                            <Edit3 size={ 14 } /> Edit
                        </button>
                    ) }
                    { onSoftDeleteClick && (
                        <button
                            type="button"
                            className="flex items-center gap-2 w-full text-left px-3 py-1 hover:bg-gray-100"
                            onClick={ () => handleClick( onSoftDeleteClick ) }
                        >
                            <Slash size={ 14 } /> Hapus pesan
                        </button>
                    ) }
                    <button
                        type="button"
                        className="flex items-center gap-2 w-full text-left px-3 py-1 hover:bg-gray-100"
                        onClick={ () => handleClick( onDeleteClick ) }
                    >
                        <Trash2 size={ 14 } /> Hapus untuk saya
                    </button>
                </>
            ) : (
                <button
                    type="button"
                    className="flex items-center gap-2 w-full text-left px-3 py-1 hover:bg-gray-100"
                    onClick={ () => handleClick( onDeleteClick ) }
                >
                    <Trash2 size={ 14 } /> Hapus untuk saya
                </button>
            ) }
        </div>
    );

    return (
        <div className="relative">
            <button
                type="button"
                ref={ buttonRef }
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={ handleToggleButton }
            >
                <MoreVertical size={ 16 } />
            </button>
            { isOpen && createPortal( menu, document.body ) }
        </div>
    );
}
