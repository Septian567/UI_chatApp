export interface ChatMessage
{
    id?: string; // ✅ optional agar aman dari runtime API
    message_id?: string;
    text: string;
    caption?: string;
    time: string;
    side: "kiri" | "kanan";
    attachments?: any[];
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    audioUrl?: string;
    videoUrl?: string;
    isDeleted?: boolean;
    isSoftDeleted?: boolean;
    updatedAt?: string;
    isSending?: boolean;
    duration?: number;
}
