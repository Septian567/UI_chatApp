import { ChatMessage } from "../types/chat";
import { softDeleteMessage as apiSoftDeleteMessage } from "../utils/softDeleteMessageApi";
import { Ban } from "lucide-react";
import React from "react";

/* ---------------- Default Text ---------------- */
export const SOFT_DELETED_MESSAGES = [
    "Pesan telah dihapus",
    "Pesan telah dihapus"
] as const;

export const DEFAULT_SOFT_DELETED_TEXT = SOFT_DELETED_MESSAGES[0];
export const DEFAULT_FILE_DELETED_TEXT = SOFT_DELETED_MESSAGES[1];

/* ---------------- Utility ---------------- */
export function isSoftDeletedMessage( text?: string | null ): boolean
{
    if ( !text ) return false;
    return (
        SOFT_DELETED_MESSAGES.includes(
            text as ( typeof SOFT_DELETED_MESSAGES )[number]
        ) || text.startsWith( "[deleted]" )
    );
}

/**
 * Mengubah pesan menjadi soft deleted (hanya tampil di sisi user)
 */
export function softDeleteMessage( message: ChatMessage ): ChatMessage
{
    const isFileOrAudio =
        !!message.fileUrl ||
        !!message.audioUrl ||
        !!message.attachments?.length ||
        !!message.caption;

    return {
        ...message,
        text: !isFileOrAudio ? DEFAULT_SOFT_DELETED_TEXT : "",
        caption: isFileOrAudio ? DEFAULT_FILE_DELETED_TEXT : "",
        fileUrl: undefined,
        fileName: undefined,
        fileType: undefined,
        audioUrl: undefined,
        videoUrl: undefined,
        attachments: [],
        isSoftDeleted: true,
        isDeleted: false,
        updatedAt: new Date().toISOString(),
    };
}

/**
 * Melakukan soft delete ke server dan update lokal
 */
export async function softDeleteMessageWithApi(
    message: ChatMessage
): Promise<ChatMessage>
{
    const idToDelete = message.id || message.message_id;
    if ( !idToDelete ) return message;

    try
    {
        await apiSoftDeleteMessage( idToDelete );
        return softDeleteMessage( message );
    } catch ( err )
    {
        console.error( "DEBUG: gagal soft delete API:", err );
        return message;
    }
}

/**
 * Mengembalikan pesan dari kondisi soft deleted
 */
export function undoSoftDeleteMessage( message: ChatMessage ): ChatMessage
{
    // Jika pesan teks biasa
    if ( message.text === DEFAULT_SOFT_DELETED_TEXT && !message.audioUrl )
    {
        return { ...message, text: "", isSoftDeleted: false };
    }

    // Jika pesan file (gambar, video, dokumen)
    if ( message.caption === DEFAULT_FILE_DELETED_TEXT )
    {
        return { ...message, caption: "", isSoftDeleted: false };
    }

    // Jika pesan audio
    if ( message.audioUrl === undefined && message.text === DEFAULT_SOFT_DELETED_TEXT )
    {
        return { ...message, text: "", isSoftDeleted: false };
    }

    return message;
}

/* ---------------- Komponen ---------------- */
interface SoftDeletedMessageProps
{
    text: string;
    time?: string;
}

export const SoftDeletedMessage: React.FC<SoftDeletedMessageProps> = ( {
    text,
    time,
} ) =>
{
    return (
        <div className="flex items-center gap-2 text-gray-500 text-sm pl-2 min-w-1 flex-wrap">
            <Ban size={ 16 } className="text-gray-500 flex-shrink-0" />
            <span className="italic break-words">{ text }</span>
            { time && (
                <span className="ml-5 text-gray-700 text-xs whitespace-nowrap">
                    { time }
                </span>
            ) }
        </div>
    );
};
