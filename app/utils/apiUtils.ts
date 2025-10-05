// utils/apiUtils.ts
import { BASE_URL } from "./apiConfig";

export interface RegisterUserData
{
    email: string;
    username: string;
    password: string;
}

export interface LoginUserData
{
    email: string;
    password: string;
}

export interface AuthApiResponse
{
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        avatar_url: string;
    };
}

export interface ApiResponse<T = any>
{
    success: boolean;
    data?: T;
    message?: string;
}

/**
 * Helper untuk parsing JSON dan validasi status response
 */
export const handleFetchResponse = async ( response: Response ) =>
{
    let json: any = {};
    try
    {
        json = await response.json();
    } catch
    {
        json = {};
    }

    if ( !response.ok )
    {
        throw new Error( json.message || "API request failed" );
    }

    return json;
};

/**
 * POST request umum
 */
export const postRequest = async <T>( endpoint: string, data: object ): Promise<ApiResponse<T>> =>
{
    try
    {
        const response = await fetch( `${ BASE_URL }${ endpoint }`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( data ),
        } );

        const json = await handleFetchResponse( response );
        return { success: true, data: json, message: json.message };
    } catch ( error: any )
    {
        console.error( "API Error:", error );
        return { success: false, message: error.message || "Network error" };
    }
};

/**
 * Auth API
 */
export const registerUser = ( userData: RegisterUserData ) =>
    postRequest<AuthApiResponse>( "/auth/register", userData );

export const loginUser = async ( userData: LoginUserData ): Promise<ApiResponse<AuthApiResponse>> =>
{
    try
    {
        const response = await fetch( `${ BASE_URL }/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( userData ),
        } );

        const json = await handleFetchResponse( response );

        localStorage.setItem( "token", json.token );
        localStorage.setItem( "userId", json.user.id );
        localStorage.setItem( "user", JSON.stringify( json.user ) );

        return { success: true, data: json, message: json.message };
    } catch ( error: any )
    {
        console.error( "Login Error:", error );
        return { success: false, message: error.message || "Network error" };
    }
};

/**
 * User Profile
 */
export interface UserProfile
{
    id: string;
    username: string;
    email: string;
    avatar_url: string;
}

export const getProfile = async (): Promise<ApiResponse<UserProfile>> =>
{
    try
    {
        const token = localStorage.getItem( "token" );
        if ( !token ) throw new Error( "Token tidak ditemukan. User belum login." );

        const response = await fetch( `${ BASE_URL }/me`, {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${ token }` },
        } );

        const json = await handleFetchResponse( response );
        return { success: true, data: json };
    } catch ( error: any )
    {
        console.error( "Get Profile Error:", error );
        return { success: false, message: error.message || "Network error" };
    }
};

export const logoutUser = async (): Promise<ApiResponse<{ message: string }>> =>
{
    try
    {
        const token = localStorage.getItem( "token" );
        const response = await fetch( `${ BASE_URL }/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...( token ? { Authorization: `Bearer ${ token }` } : {} ) },
        } );

        const json = await handleFetchResponse( response );

        localStorage.removeItem( "token" );
        localStorage.removeItem( "userId" );
        localStorage.removeItem( "user" );

        return { success: true, data: json, message: json.message };
    } catch ( error: any )
    {
        console.error( "Logout Error:", error );
        return { success: false, message: error.message || "Network error" };
    }
};

/**
 * Update Profile (username + avatar)
 */
export const updateProfile = async ( data: { username?: string; avatar?: File } ): Promise<ApiResponse<UserProfile>> =>
{
    try
    {
        const token = localStorage.getItem( "token" );
        if ( !token ) throw new Error( "Token tidak ditemukan. User belum login." );

        const formData = new FormData();
        if ( data.username ) formData.append( "username", data.username );
        if ( data.avatar ) formData.append( "avatar", data.avatar );

        const response = await fetch( `${ BASE_URL }/me`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${ token }` }, // jangan set Content-Type saat pakai FormData
            body: formData,
        } );

        const json = await handleFetchResponse( response );

        // Tambahkan timestamp di avatar_url supaya selalu refresh
        const updated: UserProfile = {
            ...json,
            avatar_url: json.avatar_url ? `${ json.avatar_url }?t=${ Date.now() }` : "",
        };

        return { success: true, data: updated, message: json.message || "Profil berhasil diperbarui" };
    } catch ( error: any )
    {
        console.error( "Update Profile Error:", error );
        return { success: false, message: error.message || "Network error" };
    }
};
