import { useEffect, useRef, useState } from "react";

interface UseCameraOptions
{
    isOpen: boolean;
    onCapturePhoto?: ( file: File ) => void;
    onCaptureVideo?: ( file: File ) => void;
}

export function useCamera( { isOpen, onCapturePhoto, onCaptureVideo }: UseCameraOptions )
{
    const videoRef = useRef<HTMLVideoElement | null>( null );
    const streamRef = useRef<MediaStream | null>( null );
    const recorderRef = useRef<MediaRecorder | null>( null );
    const chunksRef = useRef<Blob[]>( [] );

    const [mode, setMode] = useState<"photo" | "video">( "photo" );
    const [facing, setFacing] = useState<"user" | "environment">( "environment" );
    const [isRecording, setIsRecording] = useState( false );
    const [error, setError] = useState<string | null>( null );

    const startCamera = async () =>
    {
        setError( null );
        try
        {
            const stream = await navigator.mediaDevices.getUserMedia( {
                video: { facingMode: facing },
                audio: true,
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
            setError( "Tidak bisa mengakses kamera/mikrofon. Cek izin browser." );
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
        setFacing( ( p ) => ( p === "user" ? "environment" : "user" ) );
    };

    // PHOTO
    const takePhoto = () =>
    {
        if ( !videoRef.current ) return;
        const v = videoRef.current;
        const canvas = document.createElement( "canvas" );
        canvas.width = v.videoWidth || 1280;
        canvas.height = v.videoHeight || 720;
        const ctx = canvas.getContext( "2d" );
        ctx?.drawImage( v, 0, 0, canvas.width, canvas.height );
        canvas.toBlob(
            ( blob ) =>
            {
                if ( !blob ) return;
                const file = new File( [blob], `photo-${ Date.now() }.jpg`, {
                    type: "image/jpeg",
                } );
                onCapturePhoto?.( file );
            },
            "image/jpeg"
        );
    };

    // VIDEO
    const startRecording = () =>
    {
        if ( !streamRef.current ) return;
        chunksRef.current = [];
        const rec = new MediaRecorder( streamRef.current );
        recorderRef.current = rec;

        rec.ondataavailable = ( e ) => e.data.size && chunksRef.current.push( e.data );
        rec.onstop = () =>
        {
            const blob = new Blob( chunksRef.current, { type: "video/webm" } );
            const file = new File( [blob], `video-${ Date.now() }.webm`, {
                type: "video/webm",
            } );
            onCaptureVideo?.( file );
        };

        rec.start();
        setIsRecording( true );
    };

    const stopRecording = () =>
    {
        recorderRef.current?.stop();
        setIsRecording( false );
    };

    // Effect untuk start/stop kamera
    useEffect( () =>
    {
        if ( !isOpen ) return;
        startCamera();
        return () =>
        {
            if ( isRecording ) recorderRef.current?.stop();
            stopCamera();
        };
    }, [isOpen, facing] );

    return {
        videoRef,
        mode,
        setMode,
        facing,
        flipCamera,
        isRecording,
        startRecording,
        stopRecording,
        takePhoto,
        error,
    };
}
