import { useState, useMemo } from "react";

interface User
{
    name: string;
    email: string;
}

interface Contact
{
    name: string;
    email: string;
    alias?: string;
}

export function useSearchFilter( users: User[], contacts: Contact[] )
{
    const [searchQuery, setSearchQuery] = useState( "" );

    const filteredUsers = useMemo(
        () =>
            users.filter(
                ( u ) =>
                    u.name.toLowerCase().includes( searchQuery.toLowerCase() ) ||
                    u.email.toLowerCase().includes( searchQuery.toLowerCase() )
            ),
        [users, searchQuery]
    );

    const filteredContacts = useMemo(
        () =>
            contacts.filter(
                ( c ) =>
                    ( c.alias || c.name ).toLowerCase().includes( searchQuery.toLowerCase() ) ||
                    c.email.toLowerCase().includes( searchQuery.toLowerCase() )
            ),
        [contacts, searchQuery]
    );

    return { searchQuery, setSearchQuery, filteredUsers, filteredContacts };
}
