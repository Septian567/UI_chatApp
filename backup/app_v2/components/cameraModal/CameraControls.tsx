import { Camera, Video, StopCircle, PauseCircle, PlayCircle } from "lucide-react";
import { useRecordingTimer } from "../../hooks/camera/useRecordingTimer";

interface CameraControlsProps
{
    mode: "photo" | "video";
    isRecording: boolean;
    handlePhotoClick: () => void;
    handleVideoClick: () => void;
    onPauseResume?: ( paused: boolean ) => void;
}

export function CameraControls( {
    mode,
    isRecording,
    handlePhotoClick,
    handleVideoClick,
    onPauseResume,
}: CameraControlsProps )
{
    const { seconds, isPaused, setIsPaused, formatTime } = useRecordingTimer(
        isRecording,
        mode === "video"
    );

    if ( mode === "video" && isRecording )
    {
        return (
            <div className="px-5 pb-5 flex justify-between items-center w-full">
                {/* Timer */ }
                <span className="text-sm text-gray-800 font-medium">
                    { formatTime( seconds ) }
                </span>

                {/* Stop button */ }
                <button
                    onClick={ handleVideoClick }
                    className="h-12 w-12 rounded-full flex items-center justify-center bg-red-600 text-white hover:bg-red-700"
                    title="Stop Recording"
                >
                    <StopCircle size={ 28 } />
                </button>

                {/* Pause / Resume */ }
                <button
                    onClick={ () =>
                    {
                        const newPaused = !isPaused;
                        setIsPaused( newPaused );
                        onPauseResume?.( newPaused );
                    } }
                    className="p-2 text-gray-700 hover:text-black"
                    title={ isPaused ? "Resume Recording" : "Pause Recording" }
                >
                    { isPaused ? <PlayCircle size={ 28 } /> : <PauseCircle size={ 28 } /> }
                </button>
            </div>
        );
    }

    return (
        <div className="px-5 pb-5 flex justify-center gap-6">
            { mode === "photo" ? (
                <>
                    {/* Ambil foto */ }
                    <button
                        onClick={ handlePhotoClick }
                        className="h-12 w-12 rounded-full flex items-center justify-center bg-green-500 text-white hover:bg-green-600"
                        title="Photo"
                    >
                        <Camera size={ 20 } />
                    </button>

                    {/* Mode video */ }
                    <button
                        onClick={ handleVideoClick }
                        className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300"
                        title="Video"
                    >
                        <Video size={ 20 } />
                    </button>
                </>
            ) : (
                <>
                    {/* Start video */ }
                    <button
                        onClick={ handleVideoClick }
                        className="h-12 w-12 rounded-full flex items-center justify-center bg-green-500 text-white hover:bg-green-600"
                        title="Start Video"
                    >
                        <Video size={ 22 } />
                    </button>

                    {/* Photo */ }
                    <button
                        onClick={ handlePhotoClick }
                        className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300"
                        title="Photo"
                    >
                        <Camera size={ 20 } />
                    </button>
                </>
            ) }
        </div>
    );
}
