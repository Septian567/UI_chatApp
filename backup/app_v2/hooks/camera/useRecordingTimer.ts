import { useEffect, useState } from "react";

export function useRecordingTimer( isRecording: boolean, isVideoMode: boolean )
{
    const [seconds, setSeconds] = useState( 0 );
    const [isPaused, setIsPaused] = useState( false );

    useEffect( () =>
    {
        let interval: NodeJS.Timeout | null = null;

        if ( isVideoMode && isRecording && !isPaused )
        {
            interval = setInterval( () =>
            {
                setSeconds( ( prev ) => prev + 1 );
            }, 1000 );
        }

        return () =>
        {
            if ( interval ) clearInterval( interval );
        };
    }, [isRecording, isVideoMode, isPaused] );

    // Reset ketika stop
    useEffect( () =>
    {
        if ( !isRecording )
        {
            setSeconds( 0 );
            setIsPaused( false );
        }
    }, [isRecording] );

    const formatTime = ( sec: number ) =>
    {
        const m = Math.floor( sec / 60 );
        const s = sec % 60;
        return `${ m }:${ s.toString().padStart( 2, "0" ) }`;
    };

    return { seconds, isPaused, setIsPaused, formatTime };
}
