"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage()
{
    const [email, setEmail] = useState( "" );
    const [password, setPassword] = useState( "" );

    const router = useRouter();

    const handleLogin = ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        console.log( "Login clicked", { email, password } );
    }

    const handleRegister = () =>
    {
        router.push( "/register" );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h1>Login</h1>
                <form onSubmit={ handleLogin }>
                    <input
                        type="email"
                        placeholder="Email"
                        value={ email }
                        onChange={ ( e ) => setEmail( e.target.value ) }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={ password }
                        onChange={ ( e ) => setPassword( e.target.value ) }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >Login</button>
                </form>

                <button
                    type="button"
                    onClick={ handleRegister }
                    className="w-full py-2 text-white bg-blue-600 rounded-lg hover:ng-blue-700 transition"
                >Register</button>
            </div>

        </div>
    );
}