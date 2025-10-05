// utils/contactApi.ts
import { BASE_URL } from "./apiConfig";

export interface ContactCreateBody
{
    contactId: string;
    alias: string;
}

export interface ContactResponse
{
    user_id: string;
    contact_id: string;
    alias: string;
    created_at: string;
    id?: string;
}

/**
 * Membuat contact baru
 * @param body Body request { contactId, alias }
 * @param token Optional: token user, jika tidak diberikan akan ambil dari localStorage
 * @returns ContactResponse
 */
export async function createContact( body: ContactCreateBody, token?: string ): Promise<ContactResponse>
{
    try
    {
        const authToken = token || localStorage.getItem( "token" );
        if ( !authToken )
        {
            throw new Error( "Token tidak ditemukan. User belum login." );
        }

        console.log( "DEBUG: Sending createContact request..." );
        console.log( "DEBUG: URL:", `${ BASE_URL }/contacts` );
        console.log( "DEBUG: Body:", body );
        console.log( "DEBUG: Token:", authToken );

        const response = await fetch( `${ BASE_URL }/contacts`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${ authToken }`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify( body ),
        } );

        const responseText = await response.text();
        let data: any;
        try
        {
            data = JSON.parse( responseText );
        } catch
        {
            data = { message: responseText };
        }

        console.log( "DEBUG: Response status:", response.status );
        console.log( "DEBUG: Response body:", data );

        if ( !response.ok )
        {
            throw new Error( data.message || `Failed to create contact (status ${ response.status })` );
        }

        return data as ContactResponse;
    } catch ( error: any )
    {
        console.error( "API Error (createContact):", error );
        throw error;
    }
}
