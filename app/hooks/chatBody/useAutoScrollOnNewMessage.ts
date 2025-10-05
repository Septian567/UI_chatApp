import { useEffect, useRef } from "react";
import { ChatMessage } from "../../types/chat";

export function useAutoScrollOnNewMessage( messages: ChatMessage[], bottomRef: React.RefObject<HTMLDivElement | null>, chatBodyRef: React.RefObject<HTMLDivElement | null> )
{
    const prevMessageCount = useRef( messages.length );

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
    }, [messages, bottomRef, chatBodyRef] );
}
