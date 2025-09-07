import { Check, X, Plus } from "lucide-react";

interface AddUserFormProps
{
    addingUser: boolean;
    newUserName: string;
    newUserEmail: string;
    onNameChange: ( value: string ) => void;
    onEmailChange: ( value: string ) => void;
    onAdd: () => void;
    onCancel: () => void;
    onOpen: () => void;
}

export default function AddUserForm( {
    addingUser,
    newUserName,
    newUserEmail,
    onNameChange,
    onEmailChange,
    onAdd,
    onCancel,
    onOpen,
}: AddUserFormProps )
{
    if ( addingUser )
    {
        return (
            <div className="flex items-center gap-2 border p-3 rounded-lg">
                <input
                    type="text"
                    value={ newUserName }
                    onChange={ ( e ) => onNameChange( e.target.value ) }
                    placeholder="Username..."
                    className="border rounded px-2 py-1 text-sm flex-1"
                />
                <input
                    type="email"
                    value={ newUserEmail }
                    onChange={ ( e ) => onEmailChange( e.target.value ) }
                    placeholder="Email..."
                    className="border rounded px-2 py-1 text-sm flex-1"
                />
                <button onClick={ onAdd } className="p-2 rounded hover:bg-gray-200">
                    <Check className="w-4 h-4 text-black" />
                </button>
                <button onClick={ onCancel } className="p-2 rounded hover:bg-gray-200">
                    <X className="w-4 h-4 text-black" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={ onOpen }
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
            <Plus className="w-4 h-4" />
            Tambah User
        </button>
    );
}
