"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage()
{
    const router = useRouter();
    const [username, setUsername] = useState( "" );
    const [email, setEmail] = useState( "" );
    const [password, setPassword] = useState( "" );
    const [confirmPassword, setConfirmPassword] = useState( "" );

    const handleRegister = ( e: React.FormEvent ) =>
    {
        e.preventDefault();

        if ( password !== confirmPassword )
        {
            alert( "Password dan konfirmasi password harus sama!" );
            return;
        }

        // Data yang dikirim ke API
        const payload = {
            username,
            email,
            password,
        };

        console.log( "Register clicked", payload );

        // Contoh redirect ke login setelah register
        router.push( "/login" );
    };

    const handleGoToLogin = () =>
    {
        router.push( "/login" );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
                <form className="space-y-4" onSubmit={ handleRegister }>
                    <div>
                        <label className="block mb-1 text-gray-700" htmlFor="username">
                            Username
                        </label>
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
                    <div>
                        <label className="block mb-1 text-gray-700" htmlFor="confirmPassword">
                            Konfirmasi Password
                        </label>
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
                        className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                        Register
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
