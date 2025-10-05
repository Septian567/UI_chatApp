import { useRef, useState } from "react";
import { ChatMessage } from "../../types/chat";
import { useBlockScroll } from "./useBlockScroll";
import { useAutoScrollOnNewMessage } from "./useAutoScrollOnNewMessage";
import { useInitialScroll } from "./useInitialScroll";

export function useChatBody( messages: ChatMessage[] )
{
    const bottomRef = useRef<HTMLDivElement | null>( null );
    const chatBodyRef = useRef<HTMLDivElement | null>( null );
    const [isMenuOpen, setIsMenuOpen] = useState( false );

    // hitung isScrollable otomatis
    const isScrollable = useInitialScroll( chatBodyRef, bottomRef );

    useAutoScrollOnNewMessage( messages, bottomRef, chatBodyRef );
    useBlockScroll( isMenuOpen, chatBodyRef, isScrollable );

    return { bottomRef, chatBodyRef, isMenuOpen, setIsMenuOpen };
}
