import UserItem from "./UserItem";

interface UserListProps
{
    users: {
        name?: string;
        email: string;
        username?: string;
        alias?: string;
        avatar_url?: string;
    }[];
    addingUser?: boolean;
    newUserName?: string;
    newUserEmail?: string;
    onNameChange?: ( value: string ) => void;
    onEmailChange?: ( value: string ) => void;
    onAdd?: () => void;
    onCancel?: () => void;
    onOpen?: () => void;
    onAliasSave: ( username: string, email: string, alias: string ) => void;
}

export default function UserList( {
    users,
    onAliasSave,
}: UserListProps )
{
    return (
        <div className="space-y-4 pb-10">
            { users.map( ( u ) => (
                <UserItem
                    key={ u.email }
                    username={ u.username || u.name || "-" }
                    email={ u.email }
                    alias={ u.alias || "" }
                    avatar_url={ u.avatar_url }
                    onAliasSave={ onAliasSave }
                />
            ) ) }
        </div>
    );
}
