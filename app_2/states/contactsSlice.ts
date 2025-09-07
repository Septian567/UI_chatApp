import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Contact
{
    name: string;
    email: string;
    alias?: string;
}

interface ContactsState
{
    list: Contact[];
    activeContact: Contact | null; // Tambahan: menyimpan kontak yang sedang dipilih
}

const CONTACTS_KEY = "contacts_data";
const ACTIVE_CONTACT_KEY = "active_contact"; // Tambahan

// Ambil data awal dari localStorage
const initialContacts: Contact[] = ( () =>
{
    try
    {
        const saved = localStorage.getItem( CONTACTS_KEY );
        return saved ? JSON.parse( saved ) : [];
    } catch
    {
        return [];
    }
} )();

// Ambil kontak aktif terakhir
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
    activeContact: initialActiveContact, // Tambahan
};

const contactsSlice = createSlice( {
    name: "contacts",
    initialState,
    reducers: {
        setContacts: ( state, action: PayloadAction<Contact[]> ) =>
        {
            state.list = action.payload;
            localStorage.setItem( CONTACTS_KEY, JSON.stringify( state.list ) );
        },
        addContact: ( state, action: PayloadAction<Contact> ) =>
        {
            const exists = state.list.some( c => c.email === action.payload.email );
            if ( !exists )
            {
                state.list.push( action.payload );
                localStorage.setItem( CONTACTS_KEY, JSON.stringify( state.list ) );
            }
        },
        updateContactAlias: (
            state,
            action: PayloadAction<{ email: string; alias: string }>
        ) =>
        {
            const contact = state.list.find( c => c.email === action.payload.email );
            if ( contact )
            {
                contact.alias = action.payload.alias;
            } else
            {
                state.list.push( {
                    name: action.payload.alias,
                    email: action.payload.email,
                    alias: action.payload.alias,
                } );
            }
            localStorage.setItem( CONTACTS_KEY, JSON.stringify( state.list ) );
        },
        deleteContact: ( state, action: PayloadAction<string> ) =>
        {
            state.list = state.list.filter( c => c.email !== action.payload );
            localStorage.setItem( CONTACTS_KEY, JSON.stringify( state.list ) );
        },
        // 🔹 Tambahan: set kontak aktif
        setActiveContact: ( state, action: PayloadAction<Contact | null> ) =>
        {
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
    setActiveContact, // 🔹 ekspor action baru
} = contactsSlice.actions;

export default contactsSlice.reducer;
