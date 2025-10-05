// utils/softDeleteMessageApi.ts
import axios from "axios";
import { BASE_URL } from "./apiConfig";

export interface DeletedMessage
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

export interface DeleteMessageResponse
{
    message: string;
    data: DeletedMessage;
}

/**
 * Soft delete / sembunyikan pesan tertentu
 * @param messageId ID pesan yang ingin dihapus
 * @returns DeleteMessageResponse
 */
export async function softDeleteMessage( messageId: string ): Promise<DeleteMessageResponse>
{
    try
    {
        const token = localStorage.getItem( "token" );

        if ( !token )
        {
            throw new Error( "Token tidak ditemukan. Pastikan user sudah login." );
        }

        const response = await axios.delete<DeleteMessageResponse>(
            `${ BASE_URL }/messages/${ messageId }`,
            {
                headers: {
                    Authorization: `Bearer ${ token }`,
                },
            }
        );

        console.log( "DEBUG: softDeleteMessage response:", response.data );
        return response.data;
    } catch ( err: any )
    {
        if ( err.response )
        {
            console.error( "DEBUG: Gagal menghapus pesan:", err.response.data );
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
