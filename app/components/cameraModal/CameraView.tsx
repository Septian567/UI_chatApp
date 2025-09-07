import { RefreshCcw } from "lucide-react";
import { RefObject } from "react";

interface CameraViewProps
{
    videoRef: RefObject<HTMLVideoElement>;
    flipCamera: () => void;
    error?: string | null;
}

export function CameraView( { videoRef, flipCamera, error }: CameraViewProps )
{
    return (
        <div className="p-5">
            <div className="relative mx-auto w-full">
                <div
                    className="relative w-full overflow-hidden rounded-lg bg-black"
                    style={ { aspectRatio: "4 / 3" } }
                >
                    <button
                        onClick={ flipCamera }
                        className="absolute top-2 left-2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow"
                        title="Flip camera"
                    >
                        <RefreshCcw size={ 18 } />
                    </button>

                    <video
                        ref={ videoRef }
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>
            { error && (
                <p className="mt-3 text-sm text-red-600 text-center">{ error }</p>
            ) }
        </div>
    );
}
