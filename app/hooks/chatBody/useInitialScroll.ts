import { useEffect, useRef, useCallback, useState } from "react";

export function useInitialScroll(
    chatBodyRef: React.RefObject<HTMLDivElement | null>,
    bottomRef: React.RefObject<HTMLDivElement | null>
)
{
    const hasScrolledToBottom = useRef( false );
    const [isScrollable, setIsScrollable] = useState( false );

    const checkScrollable = useCallback( () =>
    {
        const el = chatBodyRef.current;
        if ( !el ) return false;
        const scrollable = el.scrollHeight > el.clientHeight + 1;
        setIsScrollable( scrollable );
        return scrollable;
    }, [chatBodyRef] );

    useEffect( () =>
    {
        const el = chatBodyRef.current;
        if ( !el || !bottomRef.current ) return;

        const observer = new ResizeObserver( () =>
        {
            checkScrollable();
            if ( !hasScrolledToBottom.current )
            {
                bottomRef.current?.scrollIntoView( { behavior: "auto" } );
                hasScrolledToBottom.current = true;
            }
        } );

        observer.observe( el );
        return () => observer.disconnect();
    }, [checkScrollable, chatBodyRef, bottomRef] );

    return isScrollable;
}
