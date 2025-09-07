import { useState, useEffect } from "react";

export function useContactsPage()
{
    const [activeMenu, setActiveMenu] = useState<"user" | "contact">( "contact" );

    const USERS_KEY = "users_data";
    const CONTACTS_KEY = "contacts_data";

    const [users, setUsers] = useState<{ name: string; email: string }[]>( [] );
    const [contacts, setContacts] = useState<
        { name: string; email: string; alias?: string }[]
    >( [] );

    const [addingUser, setAddingUser] = useState( false );
    const [newUserName, setNewUserName] = useState( "" );
    const [newUserEmail, setNewUserEmail] = useState( "" );

    // 🔹 Load users & contacts dari localStorage saat pertama kali mount
    useEffect( () =>
    {
        // Load users
        const savedUsers = localStorage.getItem( USERS_KEY );
        let initialUsers = [];
        if ( savedUsers )
        {
            initialUsers = JSON.parse( savedUsers );
            setUsers( initialUsers );
        } else
        {
            initialUsers = [
                { name: "Steven", email: "Steven@gmail.com" },
                { name: "Septian", email: "Septian@gmail.com" },
            ];
            setUsers( initialUsers );
            localStorage.setItem( USERS_KEY, JSON.stringify( initialUsers ) );
        }

        // Load contacts
        const savedContacts = localStorage.getItem( CONTACTS_KEY );
        let initialContacts = savedContacts ? JSON.parse( savedContacts ) : [];

        // 🔹 Sinkronisasi alias user ke contacts
        initialUsers.forEach( u =>
        {
            const alias = localStorage.getItem( `alias_${ u.email }` );
            if ( alias )
            {
                const exists = initialContacts.find( c => c.email === u.email );
                if ( !exists )
                {
                    initialContacts.push( { name: alias, email: u.email, alias } );
                }
            }
        } );

        setContacts( initialContacts );
        localStorage.setItem( CONTACTS_KEY, JSON.stringify( initialContacts ) );
    }, [] );


    // 🔹 Sync users ke localStorage setiap kali berubah
    useEffect( () =>
    {
        if ( users.length > 0 )
        {
            localStorage.setItem( USERS_KEY, JSON.stringify( users ) );
        }
    }, [users] );

    // 🔹 Sync contacts ke localStorage setiap kali berubah
    useEffect( () =>
    {
        localStorage.setItem( CONTACTS_KEY, JSON.stringify( contacts ) );
    }, [contacts] );

    const isValidEmail = ( email: string ) =>
    {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test( email );
    };

    const handleAddUser = () =>
    {
        const emailTrimmed = newUserEmail.trim().toLowerCase();
        const nameTrimmed = newUserName.trim();

        if ( !nameTrimmed || !emailTrimmed ) return;

        // 🔹 Cek email valid
        if ( !isValidEmail( emailTrimmed ) )
        {
            alert( "Email tidak valid!" );
            return;
        }

        // 🔹 Cek apakah email sudah ada
        const emailExists = users.some( u => u.email.toLowerCase() === emailTrimmed );
        if ( emailExists )
        {
            alert( "Email sudah terdaftar!" );
            return;
        }

        const newUser = { name: nameTrimmed, email: emailTrimmed };

        setUsers( ( prev ) =>
        {
            const updated = [...prev, newUser];
            localStorage.setItem( USERS_KEY, JSON.stringify( updated ) );
            return updated;
        } );

        setNewUserName( "" );
        setNewUserEmail( "" );
        setAddingUser( false );
    };



    const handleCancelUser = () =>
    {
        setNewUserName( "" );
        setNewUserEmail( "" );
        setAddingUser( false );
    };

    // 🔹 Simpan alias → update atau tambahkan contact
    const handleAliasSave = ( name: string, email: string, alias: string ) =>
    {
        setContacts( ( prev ) =>
        {
            const exists = prev.find( ( c ) => c.email === email );
            let updated;
            if ( exists )
            {
                // update alias tanpa mengubah email
                updated = prev.map( ( c ) =>
                    c.email === email ? { ...c, alias } : c
                );
            } else
            {
                updated = [...prev, { name, email, alias }];
            }
            localStorage.setItem( CONTACTS_KEY, JSON.stringify( updated ) );
            return updated;
        } );
    };

    const handleDeleteContact = ( email: string ) =>
    {
        setContacts( ( prev ) =>
        {
            const updated = prev.filter( ( c ) => c.email !== email );
            localStorage.setItem( CONTACTS_KEY, JSON.stringify( updated ) );
            return updated;
        } );
    };

    const handleUpdateContact = ( email: string, newAlias: string ) =>
    {
        setContacts( ( prev ) =>
        {
            const updated = prev.map( ( c ) =>
                c.email === email ? { ...c, alias: newAlias } : c
            );
            localStorage.setItem( CONTACTS_KEY, JSON.stringify( updated ) );
            return updated;
        } );
    };

    return {
        activeMenu,
        setActiveMenu,
        users,
        setUsers,
        contacts,
        setContacts,
        addingUser,
        setAddingUser,
        newUserName,
        setNewUserName,
        newUserEmail,
        setNewUserEmail,
        handleAddUser,
        handleCancelUser,
        handleAliasSave,
        handleDeleteContact,
        handleUpdateContact,
    };
}
