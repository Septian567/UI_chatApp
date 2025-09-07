import { useEffect, useState, useCallback } from "react";
import { useMediaStream } from "./useMediaStream";
import { usePhotoCapture } from "./usePhotoCapture";
import { useVideoRecorder } from "./useVideoRecorder";

interface UseCameraOptions
{
    isOpen: boolean;
    onClose: () => void;
    onCapturePhoto?: ( file: File ) => void;
    onCaptureVideo?: ( file: File ) => void;
}

export interface UseCameraControllerResult
{
    videoRef: ReturnType<typeof useMediaStream>["videoRef"];
    mode: "photo" | "video";
    facing: ReturnType<typeof useMediaStream>["facing"];
    flipCamera: ReturnType<typeof useMediaStream>["flipCamera"];
    isRecording: boolean;
    duration: number; // <-- tambahkan ini
    handlePhotoClick: () => Promise<File | null>;
    handleVideoClick: () => Promise<File | null>;
    restartCamera: () => Promise<void>;
    error: string | null;
}

export function useCameraController( {
    isOpen,
}: UseCameraOptions ): UseCameraControllerResult
{
    const [mode, setMode] = useState<"photo" | "video">( "photo" );

    const {
        videoRef,
        streamRef,
        facing,
        flipCamera,
        startCamera,
        stopCamera,
        error,
    } = useMediaStream();

    const { takePhoto } = usePhotoCapture( videoRef );
    const { isRecording, startRecording, stopRecording, duration } =
        useVideoRecorder( streamRef ); // <-- ambil durasi

    useEffect( () =>
    {
        if ( isOpen ) startCamera();
        return cleanupCamera;
    }, [isOpen, facing] );

    const cleanupCamera = useCallback( () =>
    {
        if ( isRecording ) stopRecording();
        stopCamera();
    }, [isRecording, stopRecording, stopCamera] );

    const restartCamera = useCallback( async () =>
    {
        await startCamera();
    }, [startCamera] );

    const handlePhotoClick = useCallback( async (): Promise<File | null> =>
    {
        if ( mode !== "photo" )
        {
            setMode( "photo" );
            return null;
        }

        if ( !videoRef.current )
        {
            await startCamera();
            return null;
        }

        return new Promise<File | null>( ( resolve ) =>
        {
            takePhoto( ( file ) =>
            {
                resolve( file );
                stopCamera(); // Kamera mati setelah foto
            } );
        } );
    }, [mode, videoRef, startCamera, stopCamera, takePhoto] );

    const handleVideoClick = useCallback( async (): Promise<File | null> =>
    {
        if ( mode !== "video" )
        {
            setMode( "video" );
            return null;
        }

        if ( isRecording )
        {
            const file = await stopRecording();
            if ( file ) stopCamera(); // Kamera mati setelah video
            return file;
        }

        startRecording();
        return null;
    }, [mode, isRecording, startRecording, stopRecording, stopCamera] );

    return {
        videoRef,
        mode,
        facing,
        flipCamera,
        isRecording,
        duration,
        handlePhotoClick,
        handleVideoClick,
        restartCamera,
        error,
    };
}
