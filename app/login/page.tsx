"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage()
{
    const router = useRouter();
    const [email, setEmail] = useState( "" );
    const [password, setPassword] = useState( "" );

    const handleLogin = ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        // Logika login bisa ditambahkan di sini
        console.log( "Login clicked", { email, password } );
    };

    const handleRegister = () =>
    {
        router.push( "/register" ); // redirect ke halaman register
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
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
                        className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
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
