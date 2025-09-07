import { useState, useEffect, useRef } from "react";

export function useMenu<T extends HTMLElement = HTMLDivElement>()
{
    const [isOpen, setIsOpen] = useState( false );
    const menuRef = useRef<T | null>( null );

    useEffect( () =>
    {
        const handleClickOutside = ( event: MouseEvent ) =>
        {
            if ( menuRef.current && !menuRef.current.contains( event.target as Node ) )
            {
                setIsOpen( false );
            }
        };

        document.addEventListener( "mousedown", handleClickOutside );
        return () =>
        {
            document.removeEventListener( "mousedown", handleClickOutside );
        };
    }, [] );

    return { isOpen, setIsOpen, menuRef };
}
