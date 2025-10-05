// utils/apiUser.ts
import { ApiResponse, UserProfile, handleFetchResponse } from "./apiUtils";
import { BASE_URL } from "./apiConfig";

export const getAllUsers = async (): Promise<ApiResponse<UserProfile[]>> =>
{
    try
    {
        const token = localStorage.getItem( "token" );
        if ( !token ) throw new Error( "Token tidak ditemukan. User belum login." );

        const response = await fetch( `${ BASE_URL }/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ token }`,
            },
        } );

        const json = await handleFetchResponse( response );
        return { success: true, data: json };
    } catch ( error: any )
    {
        console.error( "API Error:", error );
        return { success: false, message: error.message || "Network error" };
    }
};
