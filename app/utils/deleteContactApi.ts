// utils/deleteContact.ts
import { BASE_URL } from "./apiConfig";

interface DeletedContact
{
    user_id: string;
    contact_id: string;
}

interface DeleteContactResult
{
    success: boolean;
    data?: DeletedContact;
    message?: string;
}

interface DeleteContactResponse
{
    status: string;
    message: string;
    deletedContact: DeletedContact;
}

/**
 * Menghapus contact berdasarkan contactId
 * @param contactId ID contact yang akan dihapus
 * @returns DeleteContactResult
 */
export const deleteContact = async ( contactId: string ): Promise<DeleteContactResult> =>
{
    try
    {
        const token = localStorage.getItem( "token" );
        if ( !token )
        {
            throw new Error( "Token tidak ditemukan. User belum login." );
        }

        const response = await fetch( `${ BASE_URL }/me/contacts/${ contactId }`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ token }`,
            },
        } );

        const json: DeleteContactResponse = await response.json();

        if ( !response.ok )
        {
            throw new Error( json.message || "Gagal menghapus kontak" );
        }

        return {
            success: true,
            data: json.deletedContact,
        };
    } catch ( error: any )
    {
        console.error( "API Error (deleteContact):", error );
        return {
            success: false,
            message: error.message,
        };
    }
};
