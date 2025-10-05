import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states";
import
    {
        setContacts,
        updateContactAlias,
        deleteContact as deleteContactRedux,
        setActiveContact,
    } from "../../states/contactsSlice";
import { getContacts } from "../../utils/contactApiUtils";
import { createContact } from "../../utils/createContactApi";
import { updateContact as updateContactApi } from "../../utils/updateContactApi";
import { deleteContact as deleteContactApi } from "../../utils/deleteContactApi";
import { deleteConversation } from "../../utils/deleteConversationApi";

interface User
{
    email: string;
    username?: string;
    alias?: string;
    avatar_url?: string;
    userId: string;
}

interface Contact
{
    email: string;
    alias: string;
    avatar_url?: string;
    contact_id: string;
}

export function useContactsPage( token?: string )
{
    const dispatch = useDispatch();

    const contacts = useSelector( ( state: RootState ) => state.contacts.list as Contact[] );
    const activeContact = useSelector( ( state: RootState ) => state.contacts.activeContact );

    const usersRedux = useSelector( ( state: RootState ) => state.users.list as User[] );
    const [users, setUsers] = useState<User[]>( [] );

    const [activeMenu, setActiveMenu] = useState<"user" | "contact">( "contact" );
    const [loading, setLoading] = useState( true );
    const [error, setError] = useState<string | null>( null );

    const [addingUser, setAddingUser] = useState( false );
    const [newUserName, setNewUserName] = useState( "" );
    const [newUserEmail, setNewUserEmail] = useState( "" );

    const currentUserToken = token || localStorage.getItem( "token" ) || "";

    useEffect( () =>
    {
        setUsers( usersRedux );
    }, [usersRedux] );

    useEffect( () =>
    {
        const fetchContacts = async () =>
        {
            setLoading( true );
            try
            {
                const data = await getContacts();
                const mapped = data.map( ( c: any ) => ( {
                    email: c.email,
                    alias: c.alias?.trim() || "",
                    avatar_url: c.avatar_url || "",
                    contact_id: c.contact_id || c.contactId || c.id,
                } ) );
                dispatch( setContacts( mapped ) );
            } catch ( err: any )
            {
                setError( err.message || "Failed to fetch contacts" );
            } finally
            {
                setLoading( false );
            }
        };
        fetchContacts();
    }, [dispatch, currentUserToken] );

    // ================================
    // Tambahkan User baru
    // ================================
    const handleAddUser = () =>
    {
        if ( !newUserName || !newUserEmail ) return alert( "Nama & Email harus diisi" );

        const exists = users.find( u => u.email.toLowerCase() === newUserEmail.toLowerCase() );
        if ( exists ) return alert( "User sudah ada" );

        const newUser: User = {
            userId: crypto.randomUUID(),
            username: newUserName,
            email: newUserEmail,
            alias: newUserName,
        };

        setUsers( prev => [...prev, newUser] );
        setNewUserName( "" );
        setNewUserEmail( "" );
        setAddingUser( false );
    };

    const handleCancelUser = () =>
    {
        setAddingUser( false );
        setNewUserName( "" );
        setNewUserEmail( "" );
    };

    // ================================
    // Update alias kontak/user
    // ================================
    const handleUpdateContact = async ( email: string, alias: string ) =>
    {
        if ( !email ) return alert( "Email tidak valid" );

        const normalizedEmail = email.toLowerCase();
        let user = users.find( u => u.email.toLowerCase() === normalizedEmail );

        if ( !user )
        {
            const contact = contacts.find( c => c.email.toLowerCase() === normalizedEmail );
            if ( !contact ) return alert( "User tidak ditemukan" );

            user = {
                email: contact.email,
                userId: contact.contact_id || crypto.randomUUID(),
                username: contact.alias || "",
                alias: contact.alias || "",
                avatar_url: contact.avatar_url,
            };
            setUsers( prev => [...prev, user!] );
        }

        let contact = contacts.find( c => c.email.toLowerCase() === normalizedEmail );

        try
        {
            let updatedAlias = alias;

            if ( contact && contact.contact_id )
            {
                const result = await updateContactApi( contact.contact_id, { alias } );
                if ( !result.success || !result.data ) throw new Error( result.message || "Gagal update kontak" );

                updatedAlias = result.data.alias;
                dispatch( updateContactAlias( { contact_id: contact.contact_id, alias: updatedAlias } ) );
            } else
            {
                const newContact = await createContact( { contactId: user.userId, alias }, currentUserToken );
                contact = {
                    email: user.email,
                    alias: newContact.alias,
                    avatar_url: user.avatar_url,
                    contact_id: newContact.contact_id,
                };
                dispatch(
                    setContacts( [
                        ...contacts.filter( c => c.email.toLowerCase() !== normalizedEmail ),
                        contact,
                    ] )
                );
                updatedAlias = newContact.alias;
            }

            setUsers( prev =>
                prev.map( u =>
                    u.email.toLowerCase() === normalizedEmail ? { ...u, alias: updatedAlias } : u
                )
            );
        } catch ( err: any )
        {
            console.error( "Update contact error:", err.message || err );
            alert( `Gagal update kontak: ${ err.message || "Unknown error" }` );
        }
    };

    const handleUpdateAliasFromUser = async ( username: string, email: string, alias: string ) =>
    {
        await handleUpdateContact( email, alias );
    };

    // ================================
    // Hapus kontak
    // ================================
    const handleDeleteContact = async ( email: string ) =>
    {
        const contact = contacts.find( c => c.email === email );
        if ( !contact?.contact_id ) return alert( "contact_id tidak ditemukan." );

        try
        {
            try
            {
                const convResult = await deleteConversation( contact.contact_id );
                console.log( "Percakapan dihapus:", convResult.message );
            } catch ( convErr: any )
            {
                if ( convErr.response?.status === 404 )
                {
                    console.info( "Tidak ada percakapan untuk kontak ini, lanjut hapus kontak." );
                } else
                {
                    throw convErr;
                }
            }

            const result = await deleteContactApi( contact.contact_id );
            if ( !result.success ) throw new Error( result.message || "Gagal menghapus kontak" );

            dispatch( deleteContactRedux( contact.contact_id ) );

            if ( activeContact?.contact_id === contact.contact_id )
            {
                dispatch( setActiveContact( null ) );
            }

            setUsers( prev => prev.map( u => ( u.email === email ? { ...u, alias: "" } : u ) ) );
            console.log( "Kontak & percakapan berhasil dihapus:", email );
        } catch ( err: any )
        {
            console.error( "Delete contact error:", err.message || err );
            alert( `Gagal menghapus kontak: ${ err.message || "Unknown error" }` );
        }
    };

    const usersWithAlias = users.map( u =>
    {
        const contact = contacts.find( c => c.email === u.email );
        return {
            ...u,
            alias: contact?.alias || u.alias || "",
            contact_id: contact?.contact_id,
        };
    } );

    return {
        activeMenu,
        setActiveMenu,
        users: usersWithAlias,
        contacts,
        addingUser,
        setAddingUser,
        newUserName,
        setNewUserName,
        newUserEmail,
        setNewUserEmail,
        handleAddUser,
        handleCancelUser,
        handleUpdateContact,
        handleUpdateAliasFromUser,
        handleDeleteContact,
        loading,
        error,
    };
}
