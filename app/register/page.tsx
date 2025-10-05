"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, RegisterUserData, ApiResponse, AuthApiResponse } from "../utils/apiUtils";

export default function RegisterPage()
{
    const router = useRouter();
    const [username, setUsername] = useState( "" );
    const [email, setEmail] = useState( "" );
    const [password, setPassword] = useState( "" );
    const [confirmPassword, setConfirmPassword] = useState( "" );
    const [loading, setLoading] = useState( false );
    const [error, setError] = useState<string | null>( null );
    const [success, setSuccess] = useState<string | null>( null );

    const handleRegister = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();

        if ( password !== confirmPassword )
        {
            setError( "Password dan konfirmasi password harus sama!" );
            setSuccess( null );
            return;
        }

        setLoading( true );
        setError( null );
        setSuccess( null );

        const payload: RegisterUserData = { username, email, password };

        try
        {
            const response: ApiResponse<AuthApiResponse> = await registerUser( payload );
            console.log( "API Response:", response );

            if ( response.success && response.data )
            {
                const { token, user } = response.data;

                // Simpan token & user di localStorage
                localStorage.setItem( "token", token );
                localStorage.setItem( "user", JSON.stringify( user ) );

                setError( null );
                setSuccess( "Registrasi berhasil!" );

                setTimeout( () =>
                {
                    router.push( "/login" );
                }, 2000 );
            } else
            {
                setError( response.message || "Terjadi kesalahan saat registrasi." );
                setSuccess( null );
            }
        } catch ( err )
        {
            setError( ( err as Error ).message || "Terjadi kesalahan saat registrasi." );
            setSuccess( null );
        } finally
        {
            setLoading( false );
        }
    };

    const handleGoToLogin = () => router.push( "/login" );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>

                { error && <div className="p-2 text-red-600 bg-red-100 rounded">{ error }</div> }
                { success && <div className="p-2 text-green-700 bg-green-100 rounded">{ success }</div> }

                <form className="space-y-4" onSubmit={ handleRegister }>
                    <div>
                        <label htmlFor="username" className="block mb-1 text-gray-700">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={ username }
                            onChange={ ( e ) => setUsername( e.target.value ) }
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1 text-gray-700">Email</label>
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
                        <label htmlFor="password" className="block mb-1 text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={ password }
                            onChange={ ( e ) => setPassword( e.target.value ) }
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1 text-gray-700">Konfirmasi Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={ confirmPassword }
                            onChange={ ( e ) => setConfirmPassword( e.target.value ) }
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={ loading }
                        className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        { loading ? "Loading..." : "Register" }
                    </button>
                </form>

                <button
                    onClick={ handleGoToLogin }
                    className="w-full py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
