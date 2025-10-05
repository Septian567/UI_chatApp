// utils/updateContactApi.ts
import { BASE_URL } from "./apiConfig";

// Tipe payload untuk update kontak
export interface ContactUpdatePayload
{
    alias: string;
}

// Tipe response dari API
export interface ContactResponse
{
    user_id: string;
    contact_id: string;
    alias: string;
    created_at: string;
}

// Tipe standar untuk response API
export interface ApiResponse<T>
{
    success: boolean;
    data?: T;
    message?: string;
}

/**
 * Update alias kontak tertentu
 * @param contactId ID kontak
 * @param payload Data yang akan diupdate (alias)
 * @returns ApiResponse<ContactResponse>
 */
export const updateContact = async (
    contactId: string,
    payload: ContactUpdatePayload
): Promise<ApiResponse<ContactResponse>> =>
{
    try
    {
        const token = localStorage.getItem( "token" );

        if ( !token )
        {
            throw new Error( "Token tidak ditemukan. User belum login." );
        }

        const response = await fetch( `${ BASE_URL }/me/contacts/${ contactId }`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ token }`,
            },
            body: JSON.stringify( payload ),
        } );

        const json = await response.json();

        if ( !response.ok )
        {
            throw new Error( json.message || "Gagal mengupdate kontak" );
        }

        return {
            success: true,
            data: json,
        };
    } catch ( error: any )
    {
        console.error( "API Error (updateContact):", error );
        return {
            success: false,
            message: error.message,
        };
    }
};
