import { useEffect, useRef, useState, useCallback } from "react";
import { ChatMessage } from "./useChatMessageActions";

export function useChatBody( messages: ChatMessage[] )
{
    const bottomRef = useRef<HTMLDivElement | null>( null );
    const prevMessageCount = useRef( messages.length );
    const [isMenuOpen, setIsMenuOpen] = useState( false );
    const chatBodyRef = useRef<HTMLDivElement | null>( null );
    const scrollPos = useRef( 0 );
    const [isScrollable, setIsScrollable] = useState( false );

    const blockersRef = useRef<{
        wheel?: ( e: Event ) => void;
        touch?: ( e: Event ) => void;
        key?: ( e: Event ) => void;
    } | null>( null );

    // cek apakah container butuh scroll
    const checkScrollable = useCallback( () =>
    {
        const el = chatBodyRef.current;
        if ( !el ) return;
        const needsScroll = el.scrollHeight > el.clientHeight + 1;
        setIsScrollable( needsScroll );
    }, [] );

    // atur blocking saat menu dibuka/ditutup
    useEffect( () =>
    {
        const el = chatBodyRef.current;
        if ( !el ) return;

        const cleanupBlockers = () =>
        {
            if ( !blockersRef.current ) return;
            try
            {
                el.removeEventListener( "wheel", blockersRef.current.wheel as EventListener );
                el.removeEventListener( "touchmove", blockersRef.current.touch as EventListener );
                window.removeEventListener( "keydown", blockersRef.current.key as EventListener );
            } catch
            {
                /* ignore */
            }
            blockersRef.current = null;
        };

        if ( isMenuOpen )
        {
            scrollPos.current = el.scrollTop;

            if ( isScrollable )
            {
                el.style.overflowY = "scroll";

                const wheelHandler = ( e: WheelEvent ) => e.preventDefault();
                const touchHandler = ( e: TouchEvent ) => e.preventDefault();
                const keyHandler = ( e: KeyboardEvent ) =>
                {
                    const blockedKeys = [
                        "ArrowUp", "ArrowDown", "PageUp", "PageDown",
                        "Home", "End", " ", "Spacebar"
                    ];
                    if ( blockedKeys.includes( e.key ) )
                    {
                        e.preventDefault();
                    }
                };

                el.addEventListener( "wheel", wheelHandler as EventListener, { passive: false } as AddEventListenerOptions );
                el.addEventListener( "touchmove", touchHandler as EventListener, { passive: false } as AddEventListenerOptions );
                window.addEventListener( "keydown", keyHandler as EventListener );

                blockersRef.current = {
                    wheel: wheelHandler as unknown as ( e: Event ) => void,
                    touch: touchHandler as unknown as ( e: Event ) => void,
                    key: keyHandler as unknown as ( e: Event ) => void,
                };
            } else
            {
                el.style.overflowY = "hidden";
            }

            el.style.pointerEvents = "auto";
        } else
        {
            el.style.overflowY = isScrollable ? "auto" : "hidden";
            el.style.pointerEvents = "auto";
            el.scrollTop = scrollPos.current;
            cleanupBlockers();
        }

        return () => cleanupBlockers();
    }, [isMenuOpen, isScrollable] );

    // evaluasi kebutuhan scroll saat ukuran/pesan berubah
    useEffect( () =>
    {
        const el = chatBodyRef.current;
        if ( !el ) return;

        checkScrollable();

        const onResize = () => checkScrollable();
        window.addEventListener( "resize", onResize );
        const id = requestAnimationFrame( checkScrollable );

        const mediaEls = el.querySelectorAll( "img, video" );
        const onMediaLoad = () => checkScrollable();
        mediaEls.forEach( ( m ) => m.addEventListener( "load", onMediaLoad ) );

        return () =>
        {
            window.removeEventListener( "resize", onResize );
            cancelAnimationFrame( id );
            mediaEls.forEach( ( m ) => m.removeEventListener( "load", onMediaLoad ) );
        };
    }, [messages, checkScrollable] );

    // auto scroll kalau ada pesan baru
    useEffect( () =>
    {
        if ( messages.length > prevMessageCount.current )
        {
            bottomRef.current?.scrollIntoView( { behavior: "smooth" } );
            const mediaElements = document.querySelectorAll( "img, video" );
            mediaElements.forEach( ( el ) =>
            {
                el.addEventListener( "load", () =>
                {
                    bottomRef.current?.scrollIntoView( { behavior: "smooth" } );
                } );
            } );
        }
        prevMessageCount.current = messages.length;
    }, [messages] );

    return { bottomRef, chatBodyRef, isMenuOpen, setIsMenuOpen };
}
