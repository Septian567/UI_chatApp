import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User
{
    name: string;
    email: string;
    alias?: string;
}

interface UsersState
{
    list: User[];
}

const USERS_KEY = "users_data";

// Ambil data awal dari localStorage (jika ada)
const initialState: UsersState = {
    list: ( () =>
    {
        try
        {
            const saved = localStorage.getItem( USERS_KEY );
            return saved ? JSON.parse( saved ) : [];
        } catch
        {
            return [];
        }
    } )(),
};

const usersSlice = createSlice( {
    name: "users",
    initialState,
    reducers: {
        setUsers: ( state, action: PayloadAction<User[]> ) =>
        {
            // Hilangkan duplikat berdasarkan email
            const uniqueUsers: User[] = [];
            const emails = new Set<string>();

            action.payload.forEach( u =>
            {
                if ( !emails.has( u.email ) )
                {
                    uniqueUsers.push( u );
                    emails.add( u.email );
                }
            } );

            state.list = uniqueUsers;
            localStorage.setItem( USERS_KEY, JSON.stringify( state.list ) );
        },
        addUser: ( state, action: PayloadAction<{ name: string; email: string; alias?: string }> ) =>
        {
            const exists = state.list.some( u => u.email === action.payload.email );
            if ( !exists )
            {
                state.list.push( action.payload );
                localStorage.setItem( USERS_KEY, JSON.stringify( state.list ) );
            }
        },
        updateAlias: ( state, action: PayloadAction<{ email: string; alias: string }> ) =>
        {
            const { email, alias } = action.payload;
            const user = state.list.find( u => u.email === email );
            if ( user )
            {
                user.alias = alias;
            } else
            {
                // Jika belum ada, tambahkan user baru dengan alias sebagai name
                state.list.push( {
                    name: alias,
                    email,
                    alias,
                } );
            }
            localStorage.setItem( USERS_KEY, JSON.stringify( state.list ) );
        },
    },
} );

export const { setUsers, addUser, updateAlias } = usersSlice.actions;
export default usersSlice.reducer;
