// utils/contactApi.ts
import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "./apiConfig"; // import BASE_URL konsisten

// Contact dari API
export interface Contact
{
    id: string;
    username: string;
    avatar_url: string;
    email: string;
    alias?: string;
    created_at: string;
}

/**
 * Ambil daftar contacts user saat ini
 * Token diambil langsung dari localStorage
 * @returns Array of Contact
 */
export const getContacts = async ( tokenArg?: string ): Promise<Contact[]> =>
{
    try
    {
        // gunakan token dari argumen jika ada, kalau tidak ambil dari localStorage
        const token = tokenArg || localStorage.getItem( "token" );
        if ( !token ) throw new Error( "Token tidak ditemukan. User belum login." );

        const response = await axios.get<Contact[]>(
            `${ BASE_URL }/me/contacts`,
            {
                headers: { Authorization: `Bearer ${ token }` },
            }
        );

        return response.data.map( c => ( {
            ...c,
            alias: c.alias || "",
        } ) );
    } catch ( error: any )
    {
        console.error( "Error fetching contacts:", error.message );
        throw error;
    }
};
