"use client";

import UserItem from "../contacts/UserItem";
import { useSelector } from "react-redux";
import { RootState } from "../../states";

interface ContactMenuProps
{
    filteredContacts: any[];
    setActiveContact: ( c: any ) => void;
    onMainMenuClick: ( menu: string ) => void;
}

export default function ContactMenu( { filteredContacts, setActiveContact, onMainMenuClick }: ContactMenuProps )
{
    // Ambil map avatar dari Redux
    const avatarMap = useSelector( ( state: RootState ) =>
        state.users.list.reduce( ( acc, u ) =>
        {
            acc[u.email] = u.avatar_url ?? "";
            return acc;
        }, {} as Record<string, string> )
    );

    return (
        <div className="space-y-0 ml-2">
            { filteredContacts.length > 0 ? (
                filteredContacts.map( ( c ) => (
                    <div
                        key={ `contact-${ c.email }` }
                        onClick={ () =>
                        {
                            setActiveContact( c );
                            onMainMenuClick( "chat" );
                        } }
                        className="cursor-pointer hover:bg-gray-100 rounded-lg"
                    >
                        <UserItem
                            username={ c.username || c.name || "-" }
                            email={ c.email }
                            alias={ c.alias }
                            avatar_url={ avatarMap[c.email] || undefined } // pakai avatar dari API
                            readOnly
                            compact
                            showAliasAsName
                        />
                    </div>
                ) )
            ) : (
                <p className="text-gray-500 text-sm">No contacts found</p>
            ) }
        </div>
    );
}
