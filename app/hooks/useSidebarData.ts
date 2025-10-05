import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../states";
import { fetchUsers, updateUserAlias, User } from "../states/usersSlice";
import
    {
        setContacts,
        updateContactAlias,
        setActiveContact,
        Contact,
    } from "../states/contactsSlice";

interface SidebarData
{
    users: User[];
    contacts: Contact[];
    searchQuery: string;
    setSearchQuery: ( query: string ) => void;
    handleAliasSave: ( email: string, alias: string ) => void;
    filteredUsers: User[];
    filteredContacts: Contact[];
    setActiveContact: ( contact: Contact ) => void;
}

export function useSidebarData(): SidebarData
{
    const dispatch = useDispatch();
    const users = useSelector( ( state: RootState ) => state.users.list );
    const contacts = useSelector( ( state: RootState ) => state.contacts.list );

    const [searchQuery, setSearchQuery] = useState( "" );

    // 🔹 Ambil data user dari API saat pertama kali
    useEffect( () =>
    {
        dispatch( fetchUsers() as any );
    }, [dispatch] );

    // Load contacts dari localStorage jika ada
    useEffect( () =>
    {
        const savedContacts: Contact[] = JSON.parse(
            localStorage.getItem( "contacts" ) || "[]"
        );
        if ( savedContacts.length > 0 ) dispatch( setContacts( savedContacts ) );
    }, [dispatch] );

    // 🔹 Update alias user/contact
    const handleAliasSave = ( email: string, alias: string ) =>
    {
        // update alias user → ke API + Redux
        dispatch( updateUserAlias( { email, alias } ) as any );

        // update alias contact → Redux
        dispatch( updateContactAlias( { contact_id: email, alias } ) );

        // simpan alias untuk kontak di localStorage
        const updatedContacts = contacts.map( ( c ) =>
            c.contact_id === email ? { ...c, alias } : c
        );
        localStorage.setItem( "contacts", JSON.stringify( updatedContacts ) );
    };

    // 🔎 Filter user
    const filteredUsers = useMemo( () =>
    {
        if ( !searchQuery.trim() ) return users;

        return users.filter( ( u ) =>
        {
            const contact = contacts.find( ( c ) => c.contact_id === u.email );
            const aliasToCheck = contact?.alias || u.alias || "";
            return (
                ( u.username || "" ).toLowerCase().includes( searchQuery.toLowerCase() ) ||
                ( u.email || "" ).toLowerCase().includes( searchQuery.toLowerCase() ) ||
                aliasToCheck.toLowerCase().includes( searchQuery.toLowerCase() )
            );
        } );
    }, [users, contacts, searchQuery] );

    // 🔎 Filter contacts
    const filteredContacts = useMemo( () =>
    {
        if ( !searchQuery.trim() ) return contacts;

        return contacts.filter( ( c ) =>
            ( ( c.alias || c.email || "" ).toLowerCase().includes( searchQuery.toLowerCase() ) )
        );
    }, [contacts, searchQuery] );

    return {
        users,
        contacts,
        searchQuery,
        setSearchQuery,
        handleAliasSave,
        filteredUsers,
        filteredContacts,
        setActiveContact: ( contact: Contact ) => dispatch( setActiveContact( contact ) ),
    };
}
