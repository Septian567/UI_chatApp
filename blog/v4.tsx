"use client"
import { useState } from "react";

export default function LoginPage()
{
    const [email, setEmail] = useState( "" );
    const [password, setPassword] = useState( "" );

    const handleLogin = ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        console.log( "Login clicked", { email, password } );
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={ email }
                    onChange={ ( e ) => setEmail( e.target.value ) }
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={ password }
                    onChange={ ( e ) => setPassword( e.target.value ) }
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}