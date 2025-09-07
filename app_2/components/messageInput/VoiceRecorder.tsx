import { Mic, Pause, Play, Trash2, Send } from "react-feather";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

interface AudioRecorderProps
{
    onSendAudio: ( audio: Blob, url: string ) => void;
}

export default function AudioRecorder( { onSendAudio }: AudioRecorderProps )
{
    const {
        recording,
        paused,
        recordTime,
        startRecording,
        pauseRecording,
        stopRecording,
        cancelRecording,
        formatTime,
    } = useAudioRecorder( { onSendAudio } );

    const renderWaveIndicator = () => (
        <div className="flex items-center gap-[2px] w-6 h-4 mt-[10px]">
            <div className="w-[3px] h-full bg-red-500 animate-wave1 rounded"></div>
            <div className="w-[3px] h-full bg-red-500 animate-wave2 rounded"></div>
            <div className="w-[3px] h-full bg-red-500 animate-wave3 rounded"></div>
            <div className="w-[3px] h-full bg-red-500 animate-wave2 rounded"></div>
            <div className="w-[3px] h-full bg-red-500 animate-wave1 rounded"></div>
        </div>
    );

    return (
        <div className="flex items-center gap-2">
            { !recording && (
                <button
                    onClick={ startRecording }
                    className="text-black"
                    title="Mulai rekam"
                >
                    <Mic size={ 20 } className="relative top-[-2px]" />
                </button>
            ) }

            { recording && (
                <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg">
                    <button onClick={ cancelRecording } title="Batalkan">
                        <Trash2 size={ 18 } className="text-black" />
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-red-600 text-sm">
                            ● { formatTime( recordTime ) }
                        </span>
                        { renderWaveIndicator() }
                    </div>

                    <button onClick={ pauseRecording } title={ paused ? "Lanjutkan" : "Pause" }>
                        { paused ? (
                            <Play size={ 18 } className="text-black" />
                        ) : (
                            <Pause size={ 18 } className="text-black" />
                        ) }
                    </button>

                    {/* Send lebih turun */ }
                    <button onClick={ stopRecording } title="Kirim">
                        <Send size={ 18 } className="text-black" />
                    </button>
                </div>
            ) }
        </div>
    );
}
