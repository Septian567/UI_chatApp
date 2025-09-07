"use client";

import { useState, useEffect } from "react";
import { ChatMessage } from "./useChatMessageActions";

export function useMessageState( storageKey: string )
{
    const [messages, setMessages] = useState<ChatMessage[]>( [] );

    // Load dari localStorage saat pertama kali mount
    useEffect( () =>
    {
        const saved = localStorage.getItem( storageKey );
        if ( saved )
        {
            setMessages( JSON.parse( saved ) );
        } else
        {
            setMessages( [] );
        }
    }, [storageKey] );

    // Simpan ke localStorage setiap ada perubahan messages
    useEffect( () =>
    {
        localStorage.setItem( storageKey, JSON.stringify( messages ) );
    }, [messages, storageKey] );

    return { messages, setMessages };
}
