// utils/deleteMessageForUserApi.ts
import axios from "axios";

export interface DeleteMessageResponse
{
    message: string;
    data: {
        message_id: string;
        user_id: string;
        is_visible: boolean;
        hidden_at: string | null;
    };
}

export async function deleteMessageForUser( messageId: string ): Promise<DeleteMessageResponse>
{
    const token = localStorage.getItem( "token" );
    const userId = localStorage.getItem( "userId" ); // ambil dari localStorage

    console.log( "DEBUG: deleteMessageForUser called", { messageId, userId, token } );

    if ( !token || !userId )
    {
        throw new Error( "Token atau userId tidak ditemukan. Pastikan user sudah login." );
    }

    try
    {
        const response = await axios.delete<DeleteMessageResponse>(
            `http://localhost:5000/users/${ userId }/messages/${ messageId }`,
            {
                headers: {
                    Authorization: `Bearer ${ token }`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log( "DEBUG: deleteMessageForUser success", response.data );
        return response.data;
    } catch ( err: any )
    {
        if ( err.response )
        {
            console.error( "DEBUG: deleteMessageForUser response error", err.response.data );
            throw new Error( `Gagal menghapus pesan: ${ JSON.stringify( err.response.data ) }` );
        } else if ( err.request )
        {
            console.error( "DEBUG: deleteMessageForUser no response", err.request );
            throw new Error( "Gagal menghapus pesan: tidak ada respons dari server" );
        } else
        {
            console.error( "DEBUG: deleteMessageForUser error", err.message );
            throw err;
        }
    }
}
