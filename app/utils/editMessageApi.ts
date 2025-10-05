// utils/editMessageApi.ts
import axios from "axios";
import { BASE_URL } from "./apiConfig";

export interface EditedMessage
{
    message_id: string;
    from_user_id: string;
    to_user_id: string;
    message_text: string;
    created_at: string;
    read_at: string | null;
    updated_at: string;
    is_deleted: boolean;
    deleted_at: string | null;
}

/**
 * Mengedit pesan tertentu
 * @param messageId ID pesan yang ingin diedit
 * @param newText Teks baru untuk pesan
 * @returns EditedMessage
 */
export async function editMessage( messageId: string, newText: string ): Promise<EditedMessage>
{
    try
    {
        const token = localStorage.getItem( "token" );

        if ( !token )
        {
            throw new Error( "Token tidak ditemukan. Pastikan user sudah login." );
        }

        const response = await axios.put<EditedMessage>(
            `${ BASE_URL }/messages/${ messageId }`,
            { messageText: newText },
            {
                headers: {
                    Authorization: `Bearer ${ token }`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log( "DEBUG: editMessage response:", response.data );
        return response.data;
    } catch ( err: any )
    {
        if ( err.response )
        {
            console.error( "DEBUG: Gagal mengedit pesan:", err.response.data );
        } else if ( err.request )
        {
            console.error( "DEBUG: Tidak ada respons dari server:", err.request );
        } else
        {
            console.error( "DEBUG: Terjadi error:", err.message );
        }
        throw err;
    }
}
