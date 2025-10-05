import React from "react";
import { useVideoCache } from "../../hooks/useVideoCache";

interface ChatVideoMessageProps
{
    messageId: string;
    videoFile?: File | null;
    align: "left" | "right";
    time: string;
}

export default function ChatVideoMessage( { messageId, videoFile, align, time }: ChatVideoMessageProps )
{
    const videoUrl = useVideoCache( messageId, videoFile );

    return (
        <div className={ `flex ${ align === "right" ? "justify-end" : "justify-start" } mb-2` }>
            { videoUrl ? (
                <video src={ videoUrl } controls className="max-w-xs rounded-md" />
            ) : (
                <div className="w-48 h-32 bg-gray-200 flex items-center justify-center">
                    Loading...
                </div>
            ) }
            <span className="text-xs text-gray-400 ml-2">{ time }</span>
        </div>
    );
}
