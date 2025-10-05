import { useRef, useState, useEffect, useCallback } from "react";

interface UseAudioPlayerReturn
{
    audioRef: React.RefObject<HTMLAudioElement | null>;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isLoading: boolean;
    error: string | null;
    togglePlay: () => void;
    handleLoadedMetadata: () => void;
    handleSeek: ( time: number ) => void;
    formatTime: ( time: number ) => string;
}

export function useAudioPlayer( fileUrl: string ): UseAudioPlayerReturn
{
    const audioRef = useRef<HTMLAudioElement>( null );
    const [isPlaying, setIsPlaying] = useState( false );
    const [currentTime, setCurrentTime] = useState( 0 );
    const [duration, setDuration] = useState( 0 );
    const [isLoading, setIsLoading] = useState( true );
    const [error, setError] = useState<string | null>( null );

    // Update current time secara real-time
    useEffect( () =>
    {
        const audio = audioRef.current;
        if ( !audio ) return;

        const handleTimeUpdate = () =>
        {
            setCurrentTime( audio.currentTime );
        };

        const handleLoadStart = () =>
        {
            setIsLoading( true );
            setError( null );
        };

        const handleLoadedMetadata = () =>
        {
            setDuration( audio.duration || 0 );
            setIsLoading( false );
        };

        const handleLoadedData = () =>
        {
            setIsLoading( false );
        };

        const handleError = () =>
        {
            setIsLoading( false );
            setError( "Failed to load audio" );
            setIsPlaying( false );
        };

        const handleEnded = () =>
        {
            setIsPlaying( false );
            setCurrentTime( 0 );
        };

        // Add event listeners
        audio.addEventListener( 'timeupdate', handleTimeUpdate );
        audio.addEventListener( 'loadstart', handleLoadStart );
        audio.addEventListener( 'loadedmetadata', handleLoadedMetadata );
        audio.addEventListener( 'loadeddata', handleLoadedData );
        audio.addEventListener( 'error', handleError );
        audio.addEventListener( 'ended', handleEnded );

        // Cleanup
        return () =>
        {
            audio.removeEventListener( 'timeupdate', handleTimeUpdate );
            audio.removeEventListener( 'loadstart', handleLoadStart );
            audio.removeEventListener( 'loadedmetadata', handleLoadedMetadata );
            audio.removeEventListener( 'loadeddata', handleLoadedData );
            audio.removeEventListener( 'error', handleError );
            audio.removeEventListener( 'ended', handleEnded );
        };
    }, [fileUrl] );

    const togglePlay = useCallback( () =>
    {
        const audio = audioRef.current;
        if ( !audio ) return;

        if ( isPlaying )
        {
            audio.pause();
            setIsPlaying( false );
        } else
        {
            audio.play().catch( ( err ) =>
            {
                setError( "Playback failed" );
                setIsPlaying( false );
                console.error( "Audio playback error:", err );
            } );
            setIsPlaying( true );
        }
    }, [isPlaying] );

    const handleLoadedMetadata = useCallback( () =>
    {
        const audio = audioRef.current;
        if ( audio )
        {
            setDuration( audio.duration || 0 );
            setIsLoading( false );
        }
    }, [] );

    const handleSeek = useCallback( ( time: number ) =>
    {
        const audio = audioRef.current;
        if ( audio )
        {
            audio.currentTime = time;
            setCurrentTime( time );
        }
    }, [] );

    const formatTime = useCallback( ( time: number ) =>
    {
        if ( !isFinite( time ) || time < 0 ) return "0:00";
        const minutes = Math.floor( time / 60 );
        const seconds = Math.floor( time % 60 ).toString().padStart( 2, "0" );
        return `${ minutes }:${ seconds }`;
    }, [] );

    // Reset state when fileUrl changes
    useEffect( () =>
    {
        setIsPlaying( false );
        setCurrentTime( 0 );
        setDuration( 0 );
        setIsLoading( true );
        setError( null );
    }, [fileUrl] );

    return {
        audioRef,
        isPlaying,
        currentTime,
        duration,
        isLoading,
        error,
        togglePlay,
        handleLoadedMetadata,
        handleSeek,
        formatTime,
    };
}