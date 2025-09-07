import { useRef, useState } from "react";

export function useMediaStream()
{
    const videoRef = useRef<HTMLVideoElement | null>( null );
    const streamRef = useRef<MediaStream | null>( null );
    const [facing, setFacing] = useState<"user" | "environment">( "environment" );
    const [error, setError] = useState<string | null>( null );

    const startCamera = async ( withAudio: boolean = true ) =>
    {
        setError( null );
        try
        {
            const stream = await navigator.mediaDevices.getUserMedia( {
                video: { facingMode: facing },
                audio: withAudio,
            } );

            streamRef.current = stream;

            const videoOnlyStream = new MediaStream( stream.getVideoTracks() );
            if ( videoRef.current )
            {
                videoRef.current.srcObject = videoOnlyStream;
                videoRef.current.muted = true;
                await videoRef.current.play().catch( () => { } );
            }
        } catch ( e )
        {
            const message = e instanceof Error ? e.message : String( e );
            setError( `Tidak bisa mengakses kamera/mikrofon: ${ message }` );
            console.error( e );
        }
    };

    const stopCamera = () =>
    {
        streamRef.current?.getTracks().forEach( ( t ) => t.stop() );
        streamRef.current = null;
    };

    const flipCamera = () =>
    {
        setFacing( ( prev ) => ( prev === "user" ? "environment" : "user" ) );
    };

    return { videoRef, streamRef, facing, flipCamera, startCamera, stopCamera, error };
}
