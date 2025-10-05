import { useState } from "react";


export type ChatMessage = {
    id?: string;                     // opsional agar kompatibel dengan message_id
    message_id?: string;
    text?: string;
    caption?: string | null;
    time: string;
    side?: "kiri" | "kanan";         // penting untuk render posisi chat
    audioUrl?: string;
    videoUrl?: string;
    fileUrl?: string | null;
    fileName?: string;
    fileType?: string;
    duration?: number;
    isDeleted?: boolean;             // pesan dihapus permanen
    isSoftDeleted?: boolean;         // pesan dihapus untuk saya
    updatedAt?: string;
    attachments?: {
        mediaUrl: string;
        mediaName?: string;
        mediaType?: string;
    }[];
};

export function useMessageState()
{
    const [messages, setMessages] = useState<ChatMessage[]>( [] );
    return { messages, setMessages };
}