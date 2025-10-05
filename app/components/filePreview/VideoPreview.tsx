import React, { useState, useCallback } from "react";
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
    align?: "left" | "right";
    preload?: string;
    poster?: string;
    isActive?: boolean; // apakah video sedang ditampilkan
}

const ThumbnailOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={ onClose }>
        <div className="absolute top-4 right-6 text-2xl cursor-pointer z-50" onClick={ onClose }>
            <span style={ { color: "white", fontWeight: "bold" } }>&times;</span>
        </div>
        <div onClick={ ( e ) => e.stopPropagation() } className="max-w-full max-h-screen flex justify-center">
            <video src={ fileUrl } controls autoPlay className="rounded-lg shadow max-h-screen max-w-full border border-black" />
        </div>
    </div>
);

function VideoPreviewComponent( {
    fileUrl,
    duration = "00:00",
    caption,
    time,
    isSoftDeleted = false,
    align = "right",
    poster,
    isActive = true,
}: VideoPreviewProps )
{
    const [isModalOpen, setIsModalOpen] = useState( false );
    const [videoDuration, setVideoDuration] = useState( duration );
    const [isPortrait, setIsPortrait] = useState<boolean | null>( null );

    const handleLoadedMetadata = useCallback( ( e: React.SyntheticEvent<HTMLVideoElement> ) =>
    {
        const video = e.currentTarget;
        setVideoDuration( formatDuration( video.duration ) );
        setIsPortrait( video.videoHeight > video.videoWidth );
    }, [] );

    if ( isSoftDeleted )
    {
        return <div className="text-sm text-gray-500 italic">{ DEFAULT_SOFT_DELETED_TEXT }</div>;
    }

    return (
        <div className={ `${ align === "left" ? "text-left" : "text-right" } ${ !isActive ? "hidden" : "" }` }>
            <div
                className="relative mb-2 cursor-pointer rounded-lg overflow-hidden w-full flex justify-center bg-green-100 border border-black"
                onClick={ () => setIsModalOpen( true ) }
            >
                <video
                    src={ fileUrl }
                    poster={ poster }
                    preload="auto" // 🔹 muat video langsung
                    onLoadedMetadata={ handleLoadedMetadata }
                    className={ `${ isPortrait === null ? "opacity-0" : "opacity-100"
                        } h-auto w-full object-contain border-black rounded-lg transition-opacity duration-300` }
                    muted
                    controls={ false }
                />
                <ThumbnailOverlay />
                <DurationBadge duration={ videoDuration } />
            </div>

            <CaptionWithTime caption={ caption } time={ time } />

            { isModalOpen && <VideoModal fileUrl={ fileUrl } onClose={ () => setIsModalOpen( false ) } /> }
        </div>
    );
}

export default React.memo( VideoPreviewComponent );
