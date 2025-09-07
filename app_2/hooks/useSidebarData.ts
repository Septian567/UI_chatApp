import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../states";
import { setUsers, updateAlias } from "../states/usersSlice";
import
    {
        setContacts,
        updateContactAlias,
        setActiveContact,
    } from "../states/contactsSlice";

export function useSidebarData()
{
    const dispatch = useDispatch();
    const users = useSelector( ( state: RootState ) => state.users.list );
    const contacts = useSelector( ( state: RootState ) => state.contacts.list );

    const [searchQuery, setSearchQuery] = useState( "" );

    // Load data awal dari localStorage
    useEffect( () =>
    {
        const savedUsers = JSON.parse( localStorage.getItem( "users" ) || "[]" );
        const savedContacts = JSON.parse( localStorage.getItem( "contacts" ) || "[]" );
        if ( savedUsers.length > 0 ) dispatch( setUsers( savedUsers ) );
        if ( savedContacts.length > 0 ) dispatch( setContacts( savedContacts ) );
    }, [dispatch] );

    // Update alias user/contact
    const handleAliasSave = ( name: string, email: string, alias: string ) =>
    {
        dispatch( updateAlias( { email, alias } ) );
        dispatch( updateContactAlias( { email, alias } ) );

        const updatedUsers = users.map( ( u ) =>
            u.email === email ? { ...u, alias } : u
        );
        const updatedContacts = contacts.map( ( c ) =>
            c.email === email ? { ...c, alias } : c
        );

        localStorage.setItem( "users", JSON.stringify( updatedUsers ) );
        localStorage.setItem( "contacts", JSON.stringify( updatedContacts ) );
    };

    // Filter user
    const filteredUsers = useMemo( () =>
    {
        if ( !searchQuery.trim() ) return users;

        return users.filter( ( u ) =>
        {
            const contact = contacts.find( ( c ) => c.email === u.email );
            const aliasToCheck = contact?.alias || u.alias || "";
            return (
                u.name.toLowerCase().includes( searchQuery.toLowerCase() ) ||
                u.email.toLowerCase().includes( searchQuery.toLowerCase() ) ||
                aliasToCheck.toLowerCase().includes( searchQuery.toLowerCase() )
            );
        } );
    }, [users, contacts, searchQuery] );

    // Filter contacts
    const filteredContacts = useMemo( () =>
    {
        if ( !searchQuery.trim() ) return contacts;
        return contacts.filter( ( c ) =>
            ( c.alias || c.name || "" )
                .toLowerCase()
                .includes( searchQuery.toLowerCase() )
        );
    }, [contacts, searchQuery] );

    // Untuk dipakai Sidebar
    return {
        users,
        contacts,
        searchQuery,
        setSearchQuery,
        handleAliasSave,
        filteredUsers,
        filteredContacts,
        setActiveContact: ( contact: any ) => dispatch( setActiveContact( contact ) ),
    };
}
