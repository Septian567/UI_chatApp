import { useEffect, useRef } from "react";

export function useBlockScroll(
    isMenuOpen: boolean,
    chatBodyRef: React.RefObject<HTMLDivElement | null>,
    isScrollable: boolean
)
{
    const blockersRef = useRef<{ wheel?: any; touch?: any; key?: any } | null>( null );

    useEffect( () =>
    {
        const el = chatBodyRef.current;
        if ( !el ) return;

        const cleanup = () =>
        {
            if ( !blockersRef.current ) return;
            el.removeEventListener( "wheel", blockersRef.current.wheel );
            el.removeEventListener( "touchmove", blockersRef.current.touch );
            window.removeEventListener( "keydown", blockersRef.current.key );
            blockersRef.current = null;
        };

        if ( isMenuOpen && isScrollable )
        {
            const wheelHandler = ( e: WheelEvent ) => e.preventDefault();
            const touchHandler = ( e: TouchEvent ) => e.preventDefault();
            const keyHandler = ( e: KeyboardEvent ) =>
            {
                const blockedKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"];
                if ( blockedKeys.includes( e.key ) ) e.preventDefault();
            };

            el.addEventListener( "wheel", wheelHandler, { passive: false } );
            el.addEventListener( "touchmove", touchHandler, { passive: false } );
            window.addEventListener( "keydown", keyHandler );

            blockersRef.current = { wheel: wheelHandler, touch: touchHandler, key: keyHandler };
        } else
        {
            cleanup();
        }

        return cleanup;
    }, [isMenuOpen, isScrollable, chatBodyRef] );
}
