import { Play, Pause } from "lucide-react";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

interface AudioPreviewProps
{
    fileUrl: string;
    fileName?: string;
    align?: "left" | "right";
    duration?: string;
    preload?: string;
}

export default function AudioPreview( { fileUrl, fileName, align = "right" }: AudioPreviewProps )
{
    const {
        audioRef,
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        handleLoadedMetadata,
        handleSeek,
        formatTime,
    } = useAudioPlayer( fileUrl );

    return (
        <div className={ `w-full ${ align === "left" ? "text-left" : "text-right" }` }>
            <audio
                ref={ audioRef }
                src={ fileUrl }
                onTimeUpdate={ () => { } }
                onLoadedMetadata={ handleLoadedMetadata }
                className="hidden"
            />
            <div className="flex items-center gap-2 w-full min-w-0">
                <button onClick={ togglePlay } className="p-2 text-black shrink-0">
                    { isPlaying ? <Pause size={ 20 } /> : <Play size={ 20 } /> }
                </button>
                <input
                    type="range"
                    min={ 0 }
                    max={ duration || 0 }
                    value={ currentTime }
                    onChange={ ( e ) => handleSeek( parseFloat( e.target.value ) ) }
                    step="0.1"
                    className="flex-1 h-1 bg-gray-300 rounded-lg accent-green-600 min-w-0"
                />
                <span className="text-xs text-gray-700 shrink-0">
                    { formatTime( currentTime ) } / { formatTime( duration ) }
                </span>
            </div>
            <p className="text-sm mt-1 truncate w-full">{ fileName }</p>
        </div>

    );
}
