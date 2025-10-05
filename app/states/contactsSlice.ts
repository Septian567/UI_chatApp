import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Contact
{
    contact_id: string;
    email: string;
    alias: string;
    avatar_url?: string;
}

interface ContactsState
{
    list: Contact[];
    activeContact: Contact | null;
}

// Hapus inisialisasi kontak dari localStorage
const initialContacts: Contact[] = [];

// Tetap bisa simpan activeContact di localStorage
const ACTIVE_CONTACT_KEY = "active_contact";
const initialActiveContact: Contact | null = ( () =>
{
    try
    {
        const saved = localStorage.getItem( ACTIVE_CONTACT_KEY );
        return saved ? JSON.parse( saved ) : null;
    } catch
    {
        return null;
    }
} )();

const initialState: ContactsState = {
    list: initialContacts,
    activeContact: initialActiveContact,
};

const contactsSlice = createSlice( {
    name: "contacts",
    initialState,
    reducers: {
        setContacts: ( state, action: PayloadAction<Contact[]> ) =>
        {
            state.list = action.payload;
        },
        addContact: ( state, action: PayloadAction<Contact> ) =>
        {
            if ( !action.payload.contact_id )
            {
                console.error( "Contact harus memiliki contact_id!" );
                return;
            }
            const exists = state.list.some( c => c.contact_id === action.payload.contact_id );
            if ( !exists )
            {
                state.list.push( action.payload );
            }
        },
        updateContactAlias: (
            state,
            action: PayloadAction<{ contact_id: string; alias: string }>
        ) =>
        {
            const contact = state.list.find( c => c.contact_id === action.payload.contact_id );
            if ( contact )
            {
                contact.alias = action.payload.alias;
            }
        },
        deleteContact: ( state, action: PayloadAction<string> ) =>
        {
            state.list = state.list.filter( c => c.contact_id !== action.payload );
        },
        setActiveContact: ( state, action: PayloadAction<Contact | null> ) =>
        {
            if ( action.payload && !action.payload.contact_id )
            {
                console.error( "activeContact harus memiliki contact_id!" );
                return;
            }
            state.activeContact = action.payload;
            if ( action.payload )
            {
                localStorage.setItem( ACTIVE_CONTACT_KEY, JSON.stringify( action.payload ) );
            } else
            {
                localStorage.removeItem( ACTIVE_CONTACT_KEY );
            }
        },
    },
} );

export const {
    setContacts,
    addContact,
    updateContactAlias,
    deleteContact,
    setActiveContact,
} = contactsSlice.actions;

export default contactsSlice.reducer;
