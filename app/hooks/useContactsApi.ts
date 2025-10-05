// hooks/contacts/useContactsApi.ts
import { useEffect, useState } from "react";
import { getContacts, Contact as ApiContact } from "../utils/contactApiUtils";

export function useContactsApi()
{
    const [contacts, setContacts] = useState<ApiContact[]>( [] );
    const [loading, setLoading] = useState<boolean>( true );
    const [error, setError] = useState<string | null>( null );

    useEffect( () =>
    {
        const fetchContacts = async () =>
        {
            try
            {
                setLoading( true );
                const data = await getContacts(); // token diambil dari localStorage
                setContacts( data );
            } catch ( err: any )
            {
                setError( err.message || "Failed to fetch contacts" );
            } finally
            {
                setLoading( false );
            }
        };

        fetchContacts();
    }, [] );

    return { contacts, loading, error, setContacts };
}
