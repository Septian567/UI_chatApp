import { Play, Pause } from "lucide-react";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

interface AudioPreviewProps
{
    fileUrl: string;
    fileName: string;
    align?: "left" | "right"; // ➕ TAMBAHKAN PROP ALIGN
}

export default function AudioPreview( { fileUrl, fileName, align = "right" }: AudioPreviewProps ) // ➕ DEFAULT VALUE
{
    const {
        audioRef,
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleSeek,
        formatTime,
    } = useAudioPlayer( fileUrl );

    return (
        <div className={ `w-full ${ align === "left" ? "text-left" : "text-right" }` }>
            <audio
                ref={ audioRef }
                src={ fileUrl }
                onTimeUpdate={ handleTimeUpdate }
                onLoadedMetadata={ handleLoadedMetadata }
                className="hidden"
            />
            <div className="flex items-center gap-2">
                <button onClick={ togglePlay } className="p-2 text-black">
                    { isPlaying ? <Pause size={ 20 } /> : <Play size={ 20 } /> }
                </button>
                <input
                    type="range"
                    min={ 0 }
                    max={ duration || 0 }
                    value={ currentTime }
                    onChange={ handleSeek }
                    step="0.1"
                    className="flex-1 h-1 bg-gray-300 rounded-lg accent-green-600"
                />
                <span className="text-xs text-gray-700">
                    { formatTime( currentTime ) } / { formatTime( duration ) }
                </span>
            </div>
            <p className="text-sm mt-1 truncate">{ fileName }</p>
        </div>
    );
}