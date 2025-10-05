"use client";

import UserItem from "../contacts/UserItem";
import { useSelector } from "react-redux";
import { RootState } from "../../states";

interface UserMenuProps
{
    filteredUsers: any[];
    contacts: any[];
    handleAliasSave: ( email: string, alias: string ) => void;
}

export default function UserMenu( { filteredUsers, contacts, handleAliasSave }: UserMenuProps )
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
            { filteredUsers.length > 0 ? (
                filteredUsers.map( ( u ) =>
                {
                    const contact = contacts.find( ( c ) => c.email === u.email );
                    return (
                        <UserItem
                            key={ `user-${ u.email }` }
                            username={ u.username || u.name || "-" }
                            email={ u.email }
                            alias={ contact?.alias || u.alias }
                            avatar_url={ avatarMap[u.email] || undefined } // pakai avatar dari API
                            onAliasSave={ handleAliasSave }
                            readOnly
                            compact
                        />
                    );
                } )
            ) : (
                <p className="text-gray-500 text-sm">No users found</p>
            ) }
        </div>
    );
}
