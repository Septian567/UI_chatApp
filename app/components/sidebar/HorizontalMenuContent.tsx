"use client";

import UserMenu from "./UserMenu";
import ContactMenu from "./ContactMenu";
import ChatMenu from "./ChatMenu";

interface HorizontalMenuContentProps
{
    activeMenu: string;
    contacts: any[];
    filteredUsers: any[];
    filteredContacts: any[];
    handleAliasSave: ( email: string, alias: string ) => void;
    setActiveContact: ( c: any ) => void;
    onMainMenuClick: ( menu: string ) => void;
}

export default function HorizontalMenuContent( {
    activeMenu,
    contacts,
    filteredUsers,
    filteredContacts,
    handleAliasSave,
    setActiveContact,
    onMainMenuClick,
}: HorizontalMenuContentProps )
{
    if ( activeMenu === "user" )
    {
        return (
            <UserMenu
                filteredUsers={ filteredUsers }
                contacts={ contacts }
                handleAliasSave={ handleAliasSave }
            />
        );
    }

    if ( activeMenu === "contact" )
    {
        return (
            <ContactMenu
                filteredContacts={ filteredContacts }
                setActiveContact={ setActiveContact }
                onMainMenuClick={ onMainMenuClick }
            />
        );
    }

    if ( activeMenu === "chat" )
    {
        return (
            <ChatMenu
                filteredContacts={ filteredContacts }
                setActiveContact={ setActiveContact }
                onMainMenuClick={ onMainMenuClick }
            />
        );
    }

    return null;
}
