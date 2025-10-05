// utils/deleteConversationApi.ts
import axios from "axios";
import { BASE_URL } from "./apiConfig";

export interface DeleteConversationResponse
{
    message: string;     // contoh: "Percakapan berhasil disembunyikan"
    hiddenCount: number; // contoh: 77
}

/**
 * Menghapus percakapan antara user dan contact tertentu
 * @param contactId ID contact
 * @returns DeleteConversationResponse
 */
export async function deleteConversation( contactId: string ): Promise<DeleteConversationResponse>
{
    try
    {
        const token = localStorage.getItem( "token" );
        const userId = localStorage.getItem( "userId" );

        if ( !token || !userId )
        {
            throw new Error( "Token atau userId tidak ditemukan. Pastikan user sudah login." );
        }

        const response = await axios.delete<DeleteConversationResponse>(
            `${ BASE_URL }/messages/conversation/${ userId }/${ contactId }`,
            {
                headers: {
                    Authorization: `Bearer ${ token }`,
                },
            }
        );

        console.log( "DEBUG: deleteConversation response:", response.data );
        return response.data;
    } catch ( err: any )
    {
        if ( err.response )
        {
            console.error( "DEBUG: Gagal menghapus percakapan:", err.response.data );
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
