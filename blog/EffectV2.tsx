import { useEffect } from "react";

export default function Clock()
{
    const now = new Date().toLocaleTimeString();

    useEffect( () =>
    {
        document.title = `Sekarang jam ${now}`
    }, [now] )
    
    useEffect( () =>
    {
        
    })

    return (
        <div>
            <h1>Jam Sekarang (dengan useEffect):</h1>
            <p>{ now }</p>
            <small>Cek tab browser, title sudah berubah</small>
        </div>
    );
}

