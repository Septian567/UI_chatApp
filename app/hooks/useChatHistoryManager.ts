"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../states";
import { useLazyChatHistory } from "./useLazyChatHistory";

export function useChatHistoryManager()
{
    const activeContact = useSelector( ( state: RootState ) => state.contacts.activeContact );
    const contacts = useSelector( ( state: RootState ) => state.contacts.list );

    const isActiveContactDeleted = activeContact
        ? !contacts.some( ( c ) => c.contact_id === activeContact.contact_id )
        : false;

    const contactId = activeContact?.contact_id;

    const { loading, error, fetchChatHistory } = useLazyChatHistory();

    // 🔹 Trigger fetch hanya jika ada kontak aktif & tidak dihapus
    useEffect( () =>
    {
        if ( !activeContact || isActiveContactDeleted ) return;
        if ( !contactId ) return;

        fetchChatHistory( contactId );
    }, [activeContact, isActiveContactDeleted, contactId, fetchChatHistory] );

    return {
        activeContact,
        contactId,
        isActiveContactDeleted,
        loading,
        error,
    };
}
