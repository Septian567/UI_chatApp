import { useState, useMemo } from "react";

interface User
{
    email: string;
    username: string;
    alias?: string;
}

interface Contact
{
    email: string;
    username?: string;
    alias?: string;
}

export function useSearchFilter( users: User[], contacts: Contact[] )
{
    const [searchQuery, setSearchQuery] = useState( "" );

    // Sinkronisasi alias dari contacts ke users
    const usersWithAlias = useMemo( () =>
    {
        return users.map( u =>
        {
            const contact = contacts.find( c => c.email === u.email );
            return {
                ...u,
                alias: contact?.alias || u.alias || "",
            };
        } );
    }, [users, contacts] );

    const filteredUsers = useMemo(
        () =>
            usersWithAlias.filter(
                u =>
                    ( u.username || "" ).toLowerCase().includes( searchQuery.toLowerCase() ) ||
                    ( u.email || "" ).toLowerCase().includes( searchQuery.toLowerCase() ) ||
                    ( u.alias || "" ).toLowerCase().includes( searchQuery.toLowerCase() )
            ),
        [usersWithAlias, searchQuery]
    );

    const filteredContacts = useMemo(
        () =>
            contacts.filter(
                c =>
                    ( ( c.alias || c.username || "" ).toLowerCase().includes( searchQuery.toLowerCase() ) ) ||
                    ( c.email || "" ).toLowerCase().includes( searchQuery.toLowerCase() )
            ),
        [contacts, searchQuery]
    );

    return { searchQuery, setSearchQuery, filteredUsers, filteredContacts };
}
