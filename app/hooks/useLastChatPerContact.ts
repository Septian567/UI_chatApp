"use client";

import { useSelector } from "react-redux";
import { RootState } from "../states";

export function useLastMessagePerContact()
{
    const contacts = useSelector( ( state: RootState ) => state.contacts.list );
    const chatData = useSelector( ( state: RootState ) => state.chat );

    return contacts.map( contact =>
    {
        const messages = chatData[contact.email] || [];
        const lastMessage = messages[messages.length - 1];

        let preview = "Belum ada pesan";

        if ( lastMessage )
        {
            if ( lastMessage.text )
            {
                preview = lastMessage.text;
            } else if ( lastMessage.fileUrl )
            {
                preview = lastMessage.caption
                    ? `📎 ${ lastMessage.caption }`
                    : "📎 Mengirim file";
            } else if ( lastMessage.audioUrl )
            {
                preview = "🎤 Pesan suara";
            }
        }

        return {
            ...contact,
            lastMessage: preview,
            lastMessageTime: lastMessage?.time || null
        };
    } );
}
