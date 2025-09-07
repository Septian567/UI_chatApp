import { useState, useRef } from "react";

interface UseAudioRecorderProps
{
    onSendAudio: ( audio: Blob, url: string ) => void;
}

export function useAudioRecorder( { onSendAudio }: UseAudioRecorderProps )
{
    const [recording, setRecording] = useState( false );
    const [paused, setPaused] = useState( false );
    const [recordTime, setRecordTime] = useState( 0 );
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>( null );

    const chunksRef = useRef<Blob[]>( [] );
    const timerRef = useRef<NodeJS.Timeout | null>( null );

    const startRecording = async () =>
    {
        const stream = await navigator.mediaDevices.getUserMedia( { audio: true } );
        const recorder = new MediaRecorder( stream, {
            mimeType: "audio/webm;cpdecs=opus",
        } );

        recorder.ondataavailable = ( e ) =>
        {
            if ( e.data.size > 0 ) chunksRef.current.push( e.data );
        };

        recorder.onstop = () =>
        {
            const blob = new Blob( chunksRef.current, {
                type: "audio/webm;codecs=opus",
            } );
            const url = URL.createObjectURL( blob );
            onSendAudio( blob, url );
            reset();
        }

        recorder.start();
        setMediaRecorder( recorder );
        setRecording( true );
        setPaused( false );

        timerRef.current = setInterval( () =>
        {
            setRecordTime( ( prev ) => prev + 1 );
        }, 1000 );
    };

    const pauseRecording = () =>
    {
        if ( !mediaRecorder ) return;

        if ( mediaRecorder.state === "recording" )
        {
            mediaRecorder.pause();
            setPaused( true );
            clearInterval( timerRef.current! );
        } else if ( mediaRecorder.state === "paused" )
        {
            mediaRecorder.resume();
            setPaused( false );
            timerRef.current = setInterval( () =>
            {
                setRecordTime( ( prev ) => prev + 1 );
            }, 1000 );
        }
    };

    const stopRecording = () =>
    {
        if ( mediaRecorder && mediaRecorder.state !== "inactive" )
        {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach( ( track ) => track.stop() );
        }
        clearInterval( timerRef.current! );
    }

    const cancelRecording = () =>
    {
        if ( mediaRecorder && mediaRecorder.state !== "inactive" )
        {
            mediaRecorder.onstop = null;
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach( ( track ) => track.stop() );
        }
        reset();
    }

    const reset = () =>
    {
        chunksRef.current = [];
        setRecording( false );
        setPaused( false );
        setMediaRecorder( null );
        setRecordTime( 0 );
        clearInterval( timerRef.current! );
    };

    const formatTime = ( sec: number ) => `0${ Math.floor( sec / 60 ) }:${ ( sec % 60 ).toString().padStart( 2, "0" ) }`;

    return {
        recording,
        paused,
        recordTime,
        startRecording,
        pauseRecording,
        stopRecording,
        cancelRecording,
        formatTime
    };
}