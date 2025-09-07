import UserItem from "./UserItem";
import AddUserForm from "./AddUserForm";

interface UserListProps
{
    users: { name: string; email: string }[];
    onAliasSave: ( name: string, email: string, alias: string ) => void;
    addingUser: boolean;
    newUserName: string;
    newUserEmail: string;
    onNameChange: ( value: string ) => void;
    onEmailChange: ( value: string ) => void;
    onAdd: () => void;
    onCancel: () => void;
    onOpen: () => void;
}

export default function UserList( {
    users,
    onAliasSave,
    addingUser,
    newUserName,
    newUserEmail,
    onNameChange,
    onEmailChange,
    onAdd,
    onCancel,
    onOpen,
}: UserListProps )
{
    return (
        <div className="space-y-4 pb-10">
            { users.map( ( u ) => (
                <UserItem
                    key={ u.email }
                    name={ u.name }
                    email={ u.email }
                    onAliasSave={ onAliasSave }
                />
            ) ) }

            <AddUserForm
                addingUser={ addingUser }
                newUserName={ newUserName }
                newUserEmail={ newUserEmail }
                onNameChange={ onNameChange }
                onEmailChange={ onEmailChange }
                onAdd={ onAdd }
                onCancel={ onCancel }
                onOpen={ onOpen }
            />
        </div>
    );
}
