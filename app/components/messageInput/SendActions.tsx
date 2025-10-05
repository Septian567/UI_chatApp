import { useState, useRef } from "react";
import { Send, Mic, Pause, Play, Trash2 } from "react-feather";

interface SendActionsProps
{
    onSend: () => void;
    onSendAudio?: ( audio: Blob ) => void;
    showAudioRecorder: boolean;
    onRecordingChange?: ( recording: boolean ) => void; // NEW
}

export default function SendActions( {
    onSend,
    onSendAudio,
    showAudioRecorder,
    onRecordingChange,
}: SendActionsProps )
{
    const [recording, setRecording] = useState( false );
    const [paused, setPaused] = useState( false );
    const [recordTime, setRecordTime] = useState( 0 );
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>( null );

    const chunksRef = useRef<Blob[]>( [] );
    const timerRef = useRef<NodeJS.Timeout | null>( null );

    const startTimer = () =>
    {
        timerRef.current = setInterval( () => setRecordTime( ( prev ) => prev + 1 ), 1000 );
    };
    const stopTimer = () => clearInterval( timerRef.current! );

    const resetRecorder = () =>
    {
        chunksRef.current = [];
        setRecording( false );
        if ( onRecordingChange ) onRecordingChange( false ); // inform parent
        setPaused( false );
        setMediaRecorder( null );
        setRecordTime( 0 );
        stopTimer();
    };

    const startRecording = async () =>
    {
        const stream = await navigator.mediaDevices.getUserMedia( { audio: true } );
        const recorder = new MediaRecorder( stream, { mimeType: "audio/webm;codecs=opus" } );

        recorder.ondataavailable = ( e ) =>
        {
            if ( e.data.size > 0 ) chunksRef.current.push( e.data );
        };
        recorder.onstop = () =>
        {
            const blob = new Blob( chunksRef.current, { type: "audio/webm;codecs=opus" } );
            if ( onSendAudio ) onSendAudio( blob );
            resetRecorder();
        };

        recorder.start();
        setMediaRecorder( recorder );
        setRecording( true );
        if ( onRecordingChange ) onRecordingChange( true ); // inform parent
        setPaused( false );
        startTimer();
    };

    const pauseRecording = () =>
    {
        if ( !mediaRecorder ) return;
        if ( mediaRecorder.state === "recording" )
        {
            mediaRecorder.pause();
            setPaused( true );
            stopTimer();
        } else if ( mediaRecorder.state === "paused" )
        {
            mediaRecorder.resume();
            setPaused( false );
            startTimer();
        }
    };

    const stopRecording = () =>
    {
        if ( mediaRecorder && mediaRecorder.state !== "inactive" )
        {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach( ( t ) => t.stop() );
        }
        stopTimer();
    };

    const cancelRecording = () =>
    {
        if ( mediaRecorder && mediaRecorder.state !== "inactive" )
        {
            mediaRecorder.onstop = null;
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach( ( t ) => t.stop() );
        }
        resetRecorder();
    };

    const formatTime = ( sec: number ) =>
        `0${ Math.floor( sec / 60 ) }:${ ( sec % 60 ).toString().padStart( 2, "0" ) }`;

    const WaveIndicator = () => (
        <div className="flex items-center gap-[2px] w-6 h-4 mt-[10px]">
            { [1, 2, 3, 2, 1].map( ( a, i ) => (
                <div
                    key={ i }
                    className={ `w-[3px] h-full bg-red-500 animate-wave${ a } rounded` }
                ></div>
            ) ) }
        </div>
    );

    // === UI ===
    if ( showAudioRecorder && onSendAudio )
    {
        return (
            <div className="flex items-center justify-end flex-shrink-0 max-w-[160px] sm:max-w-[220px]">
                { !recording ? (
                    <button
                        onClick={ startRecording }
                        className="text-black"
                        title="Mulai rekam"
                    >
                        <Mic size={ 20 } className="relative top-[-2px]" />
                    </button>
                ) : (
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 bg-gray-100 px-2 py-1 rounded-lg max-w-full overflow-hidden">
                        <button onClick={ cancelRecording } title="Batalkan">
                            <Trash2 size={ 18 } className="text-black" />
                        </button>

                        <span className="text-red-600 text-xs sm:text-sm whitespace-nowrap">
                            ● { formatTime( recordTime ) }
                        </span>

                        <WaveIndicator />

                        <button onClick={ pauseRecording } title={ paused ? "Lanjutkan" : "Pause" }>
                            { paused ? (
                                <Play size={ 18 } className="text-black" />
                            ) : (
                                <Pause size={ 18 } className="text-black" />
                            ) }
                        </button>

                        <button onClick={ stopRecording } title="Kirim">
                            <Send size={ 18 } className="text-black" />
                        </button>
                    </div>
                ) }
            </div>
        );
    }

    return (
        <button className="text-black mr-2" onClick={ onSend }>
            <Send size={ 20 } className="relative top-[-2px]" />
        </button>
    );
}
