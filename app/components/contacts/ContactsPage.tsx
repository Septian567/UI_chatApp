"use client";

import Header from "./ContactHeader";
import SearchBar from "./SearchBar";
import TabMenu from "./TabMenu";
import UserList from "./UserList";
import ContactList from "./ContactList";
import { useScrollPositions } from "../../hooks/contacts/useScrollPosition";
import { useSearchFilter } from "../../hooks/contacts/useSearchFilter";
import { useDispatch } from "react-redux";
import { addUser } from "../../states/usersSlice";
import { setContacts, setActiveContact } from "../../states/contactsSlice";
import { useContactsPage } from "../../hooks/contacts/useContactsPage";
import { useSidebarNavigation } from "../../hooks/useSidebarNavigation";
import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';


interface ContactsPageProps
{
    isMobile: boolean;
    onBack: () => void;
    onContactClick?: ( aliasOrName: string ) => void;
}

export default function ContactsPage( { isMobile, onBack }: ContactsPageProps )
{
    const dispatch = useDispatch();
    const { handleMainMenuClick } = useSidebarNavigation( isMobile );

    // Ambil semua state & handler dari hook
    const {
        activeMenu,
        setActiveMenu,
        users,
        contacts,
        addingUser,
        setAddingUser,
        newUserName,
        setNewUserName,
        newUserEmail,
        setNewUserEmail,
        handleAddUser,
        handleCancelUser,
        handleUpdateAliasFromUser,
        handleDeleteContact,
        handleUpdateContact,
    } = useContactsPage();

    const { scrollRef, handleScroll } = useScrollPositions( activeMenu );

    // Gunakan hook search yang sudah menyesuaikan alias dari kontak
    const { searchQuery, setSearchQuery, filteredUsers, filteredContacts } =
        useSearchFilter(
            users.map( u => ( { ...u, username: u.username || "" } ) ),
            contacts
        );

    // Sinkronkan contacts ke Redux
    useEffect( () =>
    {
        dispatch( setContacts( contacts ) );
    }, [contacts, dispatch] );

    // Sinkronkan users ke Redux (dispatch addUser) — lakukan hanya sekali per user
    useEffect( () =>
    {
        filteredUsers.forEach( u =>
        {
            dispatch(
                addUser( {
                    userId: uuidv4(), // buat ID unik
                    username: u.username || "",
                    email: u.email,
                    alias: u.alias || "",
                } )
            );
        } );
    }, [filteredUsers, dispatch] );

    return (
        <main className="flex-1 flex flex-col bg-white h-screen">
            <Header title="Kontak Saya" isMobile={ isMobile } onBack={ onBack } />

            <TabMenu activeMenu={ activeMenu } onChange={ setActiveMenu } />

            <SearchBar
                placeholder={
                    activeMenu === "user" ? "Cari user ....." : "Cari kontak ....."
                }
                value={ searchQuery }
                onChange={ setSearchQuery }
            />

            <div
                ref={ scrollRef }
                onScroll={ handleScroll }
                className="p-6 text-left flex-1 overflow-y-auto mt-3"
            >
                { activeMenu === "user" ? (
                    <UserList
                        users={ filteredUsers } // langsung pakai filteredUsers
                        onAliasSave={ ( username, email, alias ) =>
                            handleUpdateAliasFromUser( username, email, alias )
                        }
                        addingUser={ addingUser }
                        newUserName={ newUserName }
                        newUserEmail={ newUserEmail }
                        onNameChange={ setNewUserName }
                        onEmailChange={ setNewUserEmail }
                        onAdd={ handleAddUser }
                        onCancel={ handleCancelUser }
                        onOpen={ () => setAddingUser( true ) }
                    />
                ) : (
                    <ContactList
                        contacts={ filteredContacts.map( c =>
                        {
                            // Sinkronisasi alias terbaru dari users
                            const user = users.find( u => u.email === c.email );
                            return {
                                ...c,
                                alias: user?.alias || c.alias || "",
                            };
                        } ) }
                        onDelete={ handleDeleteContact }
                        onUpdate={ handleUpdateContact }
                        onSelect={ email =>
                        {
                            const selectedContact = contacts.find( c => c.email === email );
                            if ( selectedContact )
                            {
                                dispatch(
                                    setActiveContact( {
                                        ...selectedContact,
                                        alias: selectedContact.alias || "",
                                    } )
                                );

                            }
                            handleMainMenuClick( "chat" );
                        } }
                    />
                ) }
            </div>
        </main>
    );
}
