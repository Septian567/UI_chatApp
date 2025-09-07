import { X } from "lucide-react";

interface CameraHeaderProps
{
    mode: "photo" | "video";
    isRecording: boolean;
    onClose: () => void;
}

export function CameraHeader( { mode, isRecording, onClose }: CameraHeaderProps )
{
    return (
        <div className="flex items-center justify-between px-5 py-4">
            <h3 className="text-lg font-semibold">
                { mode === "photo"
                    ? "Take a photo"
                    : isRecording
                        ? "Recording video..."
                        : "Take a video" }
            </h3>
            <button
                onClick={ onClose }
                className="p-2 hover:bg-gray-100"
                aria-label="Close"
            >
                <X size={ 18 } />
            </button>
        </div>
    );
}
