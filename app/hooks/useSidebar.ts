import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../states";
import { updateUserAlias, addUser } from "../states/usersSlice";
import { setContacts, updateContactAlias } from "../states/contactsSlice";

export function useSidebar( searchQuery: string )
{
    const dispatch = useDispatch();
    const users = useSelector( ( state: RootState ) => state.users.list );
    const contacts = useSelector( ( state: RootState ) => state.contacts.list );

    // Load dari localStorage saat pertama kali
    useEffect( () =>
    {
        const savedUsers = JSON.parse( localStorage.getItem( "users" ) || "[]" );
        const savedContacts = JSON.parse( localStorage.getItem( "contacts" ) || "[]" );
        if ( savedUsers.length > 0 ) dispatch( addUser( savedUsers as any ) ); // bisa disesuaikan
        if ( savedContacts.length > 0 ) dispatch( setContacts( savedContacts ) );
    }, [dispatch] );

    // Update alias
    const handleAliasSave = ( username: string, email: string, alias: string ) =>
    {
        // Update user alias (Redux + API)
        dispatch( updateUserAlias( { email, alias } ) as any );

        // Update contact alias (Redux lokal)
        const contact = contacts.find( ( c ) => c.email === email );
        if ( contact && contact.contact_id )
        {
            dispatch( updateContactAlias( { contact_id: contact.contact_id, alias } ) );
        }

        // Update localStorage
        const updatedUsers = users.map( ( u ) =>
            u.email === email ? { ...u, alias } : u
        );
        const updatedContacts = contacts.map( ( c ) =>
            c.email === email ? { ...c, alias } : c
        );

        localStorage.setItem( "users", JSON.stringify( updatedUsers ) );
        localStorage.setItem( "contacts", JSON.stringify( updatedContacts ) );
    };

    // Filter hasil pencarian
    const filteredUsers = useMemo( () =>
    {
        if ( !searchQuery.trim() ) return users;
        return users.filter( ( u ) =>
        {
            const contact = contacts.find( ( c ) => c.email === u.email );
            const aliasToCheck = contact?.alias || u.alias || "";
            return (
                u.username.toLowerCase().includes( searchQuery.toLowerCase() ) ||
                u.email.toLowerCase().includes( searchQuery.toLowerCase() ) ||
                aliasToCheck.toLowerCase().includes( searchQuery.toLowerCase() )
            );
        } );
    }, [users, contacts, searchQuery] );

    const filteredContacts = useMemo( () =>
    {
        if ( !searchQuery.trim() ) return contacts;
        return contacts.filter( ( c ) =>
            ( c.alias || "" ).toLowerCase().includes( searchQuery.toLowerCase() )
        );
    }, [contacts, searchQuery] );

    return {
        users,
        contacts,
        filteredUsers,
        filteredContacts,
        handleAliasSave,
    };
}
