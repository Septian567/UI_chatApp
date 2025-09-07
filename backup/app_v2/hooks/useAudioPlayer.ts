import { useRef, useState, useEffect } from "react";

export function useAudioPlayer( fileUrl: string )
{
    const audioRef = useRef<HTMLAudioElement>( null );
    const [isPlaying, setIsPlaying] = useState( false );
    const [currentTime, setCurrentTime] = useState( 0 );
    const [duration, setDuration] = useState( 0 );

    useEffect( () =>
    {
        let rafId: number;

        const update = () =>
        {
            const audio = audioRef.current;
            if ( audio )
            {
                setCurrentTime( audio.currentTime );
                rafId = requestAnimationFrame( update );
            }
        };

        if ( isPlaying )
        {
            rafId = requestAnimationFrame( update );
        }

        return () => cancelAnimationFrame( rafId );
    }, [isPlaying] );

    const togglePlay = () =>
    {
        const audio = audioRef.current;
        if ( !audio ) return;

        if ( isPlaying )
        {
            audio.pause();
        } else
        {
            audio.play();
        }
        setIsPlaying( !isPlaying );
    };

    const handleLoadedMetadata = () =>
    {
        const audio = audioRef.current;
        if ( audio )
        {
            setDuration( audio.duration );
        }
    };

    const handleTimeUpdate = () =>
    {
        const audio = audioRef.current;
        if ( audio )
        {
            setCurrentTime( audio.currentTime );
        }
    }

    const handleSeek = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        const audio = audioRef.current;
        const time = parseFloat( e.target.value );
        if ( audio )
        {
            audio.currentTime = time;
            setCurrentTime( time );
        }
    };

    const formatTime = ( time: number ) =>
    {
        if ( !isFinite( time ) ) return "00:00";
        const minutes = Math.floor( time / 60 );
        const seconds = Math.floor( time % 60 ).toString().padStart( 2, "0" );
        return `${ minutes }:${ seconds }`;
    };

    useEffect( () =>
    {
        const audio = audioRef.current;
        const handleEnded = () =>
        {
            setIsPlaying( false );
            setCurrentTime( 0 ); // reset progress
        };
        audio?.addEventListener( "ended", handleEnded );
        return () => audio?.removeEventListener( "ended", handleEnded );
    }, [] );


    return {
        audioRef,
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        handleLoadedMetadata,
        handleSeek,
        formatTime,
        handleTimeUpdate
    };
}
