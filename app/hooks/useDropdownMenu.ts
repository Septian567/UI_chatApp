import { useState, useEffect, useRef } from "react";

export function useDropdownMenu<T extends HTMLElement = HTMLDivElement>()
{
    const [dropdownOpen, setDropdownOpen] = useState( false );
    const dropdownRef = useRef<T | null>( null );

    useEffect( () =>
    {
        const handleClickOutside = ( event: MouseEvent ) =>
        {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains( event.target as Node )
            )
            {
                setDropdownOpen( false );
            }
        };

        document.addEventListener( "mousedown", handleClickOutside );
        return () =>
        {
            document.removeEventListener( "mousedown", handleClickOutside );
        };
    }, [] );

    return {
        dropdownOpen,
        setDropdownOpen,
        dropdownRef,
    };
}
