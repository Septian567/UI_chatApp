"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, LoginUserData, ApiResponse, AuthApiResponse } from "../utils/apiUtils";

export default function LoginPage()
{
    const router = useRouter();
    const [email, setEmail] = useState( "" );
    const [password, setPassword] = useState( "" );
    const [loading, setLoading] = useState( false );
    const [error, setError] = useState<string | null>( null );

    const handleLogin = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        setLoading( true );
        setError( null );

        const payload: LoginUserData = { email, password };

        try
        {
            const response: ApiResponse<AuthApiResponse> = await loginUser( payload );
            console.log( "Login API Response:", response );

            if ( response.success && response.data )
            {
                const { token, user } = response.data;

                // Simpan token dan user di localStorage
                localStorage.setItem( "token", token );
                localStorage.setItem( "user", JSON.stringify( user ) );

                // Redirect ke halaman utama
                router.push( "/" );
            } else
            {
                setError( response.message || "Login gagal. Periksa email dan password." );
            }
        } catch ( err )
        {
            setError( ( err as Error ).message || "Terjadi kesalahan saat login." );
        } finally
        {
            setLoading( false );
        }
    };

    const handleRegister = () =>
    {
        router.push( "/register" ); // redirect ke halaman register
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

                { error && <div className="p-2 text-red-600 bg-red-100 rounded">{ error }</div> }

                <form className="space-y-4" onSubmit={ handleLogin }>
                    <div>
                        <label className="block mb-1 text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={ email }
                            onChange={ ( e ) => setEmail( e.target.value ) }
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={ password }
                            onChange={ ( e ) => setPassword( e.target.value ) }
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={ loading }
                        className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        { loading ? "Loading..." : "Login" }
                    </button>
                </form>

                <button
                    onClick={ handleRegister }
                    className="w-full py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                    Register
                </button>
            </div>
        </div>
    );
}
