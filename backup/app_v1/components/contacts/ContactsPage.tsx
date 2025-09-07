"use client";

import Header from "./ContactHeader";
import SearchBar from "./SearchBar";
import TabMenu from "./TabMenu";
import UserList from "./UserList";
import ContactList from "./ContactList";
import { useScrollPositions } from "../../hooks/contacts/useScrollPosition";
import { useSearchFilter } from "../../hooks/contacts/useSearchFilter";
import { useDispatch } from "react-redux";
import { RootState } from "../../states";
import { addUser } from "../../states/usersSlice";
import { setContacts, setActiveContact } from "../../states/contactsSlice";
import { useContactsPage } from "../../hooks/contacts/useContactsPage";
import { useSidebarNavigation } from "../../hooks/useSidebarNavigation";
import { useEffect } from "react";

interface ContactsPageProps
{
    isMobile: boolean;
    onBack: () => void;
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
        handleAliasSave,
        handleDeleteContact,
        handleUpdateContact,
    } = useContactsPage();

    // Sinkronkan contacts ke Redux
    useEffect( () =>
    {
        dispatch( setContacts( contacts ) );
    }, [contacts, dispatch] );

    // Sinkronkan users ke Redux
    useEffect( () =>
    {
        users.forEach( ( u ) =>
        {
            dispatch( addUser( { name: u.name, email: u.email } ) );
        } );
    }, [users, dispatch] );

    const { scrollRef, handleScroll } = useScrollPositions( activeMenu );
    const { searchQuery, setSearchQuery, filteredUsers, filteredContacts } =
        useSearchFilter( users, contacts );

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
                        users={ filteredUsers }
                        onAliasSave={ handleAliasSave }
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
                        contacts={ filteredContacts }
                        onDelete={ handleDeleteContact }
                        onUpdate={ handleUpdateContact }
                        onSelect={ ( email ) =>
                        {
                            const selectedContact = contacts.find(
                                ( c ) => c.email === email
                            );
                            if ( selectedContact )
                            {
                                // Pastikan alias diambil jika ada, jika tidak gunakan name
                                dispatch(
                                    setActiveContact( {
                                        ...selectedContact,
                                        alias:
                                            selectedContact.alias ||
                                            selectedContact.name ||
                                            "Bento",
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
