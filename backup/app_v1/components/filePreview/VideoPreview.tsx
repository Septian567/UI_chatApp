import { useEffect, useState, useCallback } from "react";
import { Play } from "lucide-react";
import { formatDuration } from "../../utils/format";
import { DEFAULT_SOFT_DELETED_TEXT } from "../chat/deletedMessage";
import CaptionWithTime from "../common/CaptionWithTime";

interface VideoPreviewProps
{
    fileUrl: string;
    fileName?: string;
    duration?: string;
    caption?: string;
    time?: string;
    isSoftDeleted?: boolean;
    align?: "left" | "right"; // ➕ TAMBAHKAN PROP ALIGN
}

const ThumbnailOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/30 p-3 rounded-md flex items-center justify-center w-12 h-12">
            <Play className="w-6 h-6 text-white" />
        </div>
    </div>
);

const DurationBadge = ( { duration }: { duration: string } ) => (
    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
        { duration }
    </div>
);

const VideoModal = ( { fileUrl, onClose }: { fileUrl: string; onClose: () => void } ) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={ onClose }
    >
        <div
            className="absolute top-4 right-6 text-2xl cursor-pointer z-50"
            onClick={ onClose }
        >
            <span style={ { color: "white", fontWeight: "bold" } }>&times;</span>
        </div>

        <div
            onClick={ ( e ) => e.stopPropagation() }
            className="max-w-full max-h-screen flex justify-center"
        >
            <video
                src={ fileUrl }
                controls
                autoPlay
                className="rounded-lg shadow max-h-screen max-w-full border border-black"
            />
        </div>
    </div>
);

export default function VideoPreview( {
    fileUrl,
    duration = "00:00",
    caption,
    time,
    isSoftDeleted = false,
    align = "right", // ➕ DEFAULT VALUE
}: VideoPreviewProps )
{
    const [isModalOpen, setIsModalOpen] = useState( false );
    const [videoDuration, setVideoDuration] = useState( duration );
    const [isPortrait, setIsPortrait] = useState<boolean | null>( null );

    useEffect( () =>
    {
        const handleKeyDown = ( e: KeyboardEvent ) =>
        {
            if ( e.key === "Escape" ) setIsModalOpen( false );
        };
        document.addEventListener( "keydown", handleKeyDown );
        return () => document.removeEventListener( "keydown", handleKeyDown );
    }, [] );

    const handleLoadedMetadata = useCallback(
        ( e: React.SyntheticEvent<HTMLVideoElement> ) =>
        {
            const video = e.currentTarget;
            setVideoDuration( formatDuration( video.duration ) );
            setIsPortrait( video.videoHeight > video.videoWidth );
        },
        []
    );

    const videoClassName =
        isPortrait === null
            ? "opacity-0"
            : isPortrait
                ? "h-64 w-auto object-contain border-black rounded-lg"
                : "w-full h-auto object-contain border-black rounded-lg";

    if ( isSoftDeleted )
    {
        return (
            <div className="text-sm text-gray-500 italic">
                { DEFAULT_SOFT_DELETED_TEXT }
            </div>
        );
    }

    return (
        <div className={ `${ align === "left" ? "text-left" : "text-right" }` }>
            <div
                className="relative mb-2 cursor-pointer rounded-lg overflow-hidden w-full flex justify-center bg-green-100 border border-black"
                onClick={ () => setIsModalOpen( true ) }
            >
                <video
                    src={ fileUrl || undefined }
                    onLoadedMetadata={ handleLoadedMetadata }
                    className={ videoClassName }
                    muted
                    controls={ false }
                />
                <ThumbnailOverlay />
                <DurationBadge duration={ videoDuration } />
            </div>

            <CaptionWithTime caption={ caption } time={ time } align={ align } />

            { isModalOpen && (
                <VideoModal fileUrl={ fileUrl } onClose={ () => setIsModalOpen( false ) } />
            ) }
        </div>
    );
}