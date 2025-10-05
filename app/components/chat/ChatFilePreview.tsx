import React from "react";
import FilePreview from "../filePreview/FilePreview";
import ImagePreview from "../filePreview/ImagePreview";
import VideoPreview from "../filePreview/VideoPreview";
import AudioPreview from "../filePreview/AudioPreview";
import { SOFT_DELETED_MESSAGES } from "./deletedMessage";

interface ChatFilePreviewProps
{
    fileUrl: string;
    fileName: string;
    fileExtension?: string;
    isImage: boolean;
    isVideo: boolean;
    isAudio: boolean;
    fileIcon: React.ReactNode;
    handleDownload: () => void;
    isSoftDeleted: boolean;
    duration?: string;
    caption?: string;
    time?: string;
    align?: "left" | "right";
    isActive?: boolean; // 🔹 kontrol visibility untuk persistent media
}

// Komponen kecil untuk caption + time
function CaptionWithTime( { caption, time, align }: { caption?: string; time?: string; align?: "left" | "right" } )
{
    if ( !caption && !time ) return null;

    return (
        <div className={ `flex justify-between items-end mt-1 ${ align === "left" ? "flex-row" : "flex-row-reverse" }` }>
            <div className={ `text-base break-words ${ caption ? "text-black" : "invisible" }` }>
                { caption || "placeholder" }
            </div>
            { time && <div className="text-xs text-gray-700 whitespace-nowrap">{ time }</div> }
        </div>
    );
}

export function ChatFilePreview( {
    fileUrl,
    fileName,
    fileExtension,
    isImage,
    isVideo,
    isAudio,
    fileIcon,
    handleDownload,
    isSoftDeleted,
    duration,
    caption,
    time,
    align = "right",
    isActive = true, // default true
}: ChatFilePreviewProps )
{
    // Soft deleted, tampilkan teks soft delete + time
    if ( isSoftDeleted )
    {
        return (
            <div
                className={ `flex justify-between items-end mt-1 text-sm text-gray-500 italic ${ align === "left" ? "flex-row" : "flex-row-reverse"
                    } ${ !isActive ? "hidden" : "" }` }
            >
                <div>{ SOFT_DELETED_MESSAGES[1] }</div>
                { time && <div className="text-xs text-gray-700">{ time }</div> }
            </div>
        );
    }

    // Render file preview hanya kalau fileUrl ada
    if ( !fileUrl )
    {
        return <CaptionWithTime caption={ caption } time={ time } align={ align } />;
    }

    // Render file preview sesuai tipe
    if ( isImage )
    {
        return (
            <div className={ `flex flex-col ${ !isActive ? "hidden" : "" }` }>
                <ImagePreview fileUrl={ fileUrl } fileName={ fileName } align={ align } />
                <CaptionWithTime caption={ caption } time={ time } align={ align } />
            </div>
        );
    }

    if ( isVideo )
    {
        return (
            <div className={ `flex flex-col ${ !isActive ? "hidden" : "" }` }>
                <VideoPreview fileUrl={ fileUrl } fileName={ fileName } duration={ duration } align={ align } preload="auto" />
                <CaptionWithTime caption={ caption } time={ time } align={ align } />
            </div>
        );
    }

    if ( isAudio )
    {
        return (
            <div className={ `flex flex-col ${ !isActive ? "hidden" : "" }` }>
                <AudioPreview fileUrl={ fileUrl } fileName={ fileName } duration={ duration } align={ align } preload="auto" />
                <CaptionWithTime caption={ caption } time={ time } align={ align } />
            </div>
        );
    }

    return (
        <div className={ `flex flex-col ${ !isActive ? "hidden" : "" }` }>
            <FilePreview
                fileUrl={ fileUrl }
                fileName={ fileName }
                fileExtension={ fileExtension || "" }
                fileIcon={ fileIcon }
                onDownload={ handleDownload }
                align={ align }
            />
            <CaptionWithTime caption={ caption } time={ time } align={ align } />
        </div>
    );
}
