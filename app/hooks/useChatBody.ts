import { useEffect, useRef, useState, useCallback } from "react";
import { ChatMessage } from "../types/chat";

export function useChatBody( messages: ChatMessage[] )
{
    const bottomRef = useRef<HTMLDivElement | null>( null );
    const chatBodyRef = useRef<HTMLDivElement | null>( null );
    const prevMessageCount = useRef( messages.length );
    const [isMenuOpen, setIsMenuOpen] = useState( false );
    const [isScrollable, setIsScrollable] = useState( false );
    const blockersRef = useRef<{ wheel?: any; touch?: any; key?: any } | null>( null );
    const hasScrolledToBottom = useRef( false );

    const checkScrollable = useCallback( () =>
    {
        const el = chatBodyRef.current;
        if ( !el ) return;
        setIsScrollable( el.scrollHeight > el.clientHeight + 1 );
    }, [] );

    // Scroll otomatis pertama kali saat semua content siap
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
    }, [checkScrollable] );

    // Auto scroll saat ada pesan baru
    useEffect( () =>
    {
        if ( !bottomRef.current || !chatBodyRef.current ) return;

        if ( messages.length > prevMessageCount.current )
        {
            const medias = chatBodyRef.current.querySelectorAll( "img, video" );
            let loadedCount = 0;

            if ( medias.length > 0 )
            {
                medias.forEach( ( media ) =>
                {
                    const isReady =
                        ( media.tagName === "IMG" && ( media as HTMLImageElement ).complete ) ||
                        ( media.tagName === "VIDEO" && ( media as HTMLVideoElement ).readyState >= 1 );

                    if ( isReady )
                    {
                        loadedCount++;
                    } else
                    {
                        const loadEvent = media.tagName === "IMG" ? "load" : "loadedmetadata";

                        const onLoaded = () =>
                        {
                            loadedCount++;
                            if ( loadedCount === medias.length )
                            {
                                bottomRef.current?.scrollIntoView( { behavior: "smooth" } );
                            }
                        };

                        media.addEventListener( loadEvent, onLoaded, { once: true } );
                        media.addEventListener( "error", onLoaded, { once: true } );
                    }
                } );

                if ( loadedCount === medias.length )
                {
                    bottomRef.current.scrollIntoView( { behavior: "smooth" } );
                }
            } else
            {
                bottomRef.current.scrollIntoView( { behavior: "smooth" } );
            }
        }

        prevMessageCount.current = messages.length;
    }, [messages] );

    // Block scroll saat menu terbuka
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
    }, [isMenuOpen, isScrollable] );

    return { bottomRef, chatBodyRef, isMenuOpen, setIsMenuOpen };
}
