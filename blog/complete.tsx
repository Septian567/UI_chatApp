"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage()
{
    const router = useRouter();

    // State input
    const [email, setEmail] = useState( "" );
    const [password, setPassword] = useState( "" );
    const [error, setError] = useState( "" );
    const [loading, setLoading] = useState( false );

    // Handler login
    const handleLogin = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        setError( "" );
        setLoading( true );

        try
        {
            // Simulasi login
            console.log( "Login clicked", { email, password } );

            // Contoh redirect setelah login sukses
            // router.push("/dashboard");
        } catch ( err )
        {
            setError( "Login gagal, coba lagi" );
        } finally
        {
            setLoading( false );
        }
    };

    // Handler redirect register
    const handleRegister = () =>
    {
        router.push( "/register" );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

                { error && (
                    <p className="text-red-500 text-center">{ error }</p>
                ) }

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
                        { loading ? "Logging in..." : "Login" }
                    </button>
                </form>

                <button
                    type="button"
                    onClick={ handleRegister }
                    className="w-full py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                    Register
                </button>
            </div>
        </div>
    );
}
