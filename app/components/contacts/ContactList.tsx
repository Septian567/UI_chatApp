import ContactItem from "./ContactItem";

interface Contact
{
    email: string;
    alias: string;
    avatar_url?: string;
    contact_id?: string;
}

interface ContactListProps
{
    contacts: Contact[];
    onDelete: ( email: string ) => void;
    onUpdate: ( email: string, alias: string, contact_id?: string ) => void;
    onSelect?: ( email: string ) => void;
}

export default function ContactList( { contacts, onDelete, onUpdate, onSelect }: ContactListProps )
{
    return (
        <div className="space-y-4 pb-20">
            { contacts.length === 0 && <p className="text-sm text-gray-500">Belum ada kontak.</p> }
            { contacts.map( ( c ) => (
                <ContactItem
                    key={ c.email }
                    email={ c.email }
                    alias={ c.alias }
                    contact_id={ c.contact_id } // ← penting
                    avatar_url={ c.avatar_url }
                    onDelete={ onDelete }
                    onUpdate={ onUpdate }
                    onSelect={ onSelect }
                />
            ) ) }
        </div>
    );
}
