import { useState } from "react";

export type ChatMessage = {
    text?: string;
    audioUrl?: string;
    fileUrl?: string | null;
    fileName?: string;
    caption?: string | null;
    duration?: number;
    time: string;
    isSoftDeleted?: boolean;
};

export function useMessageState()
{
    const [messages, setMessages] = useState<ChatMessage[]>( [] );
    return { messages, setMessages };
}
