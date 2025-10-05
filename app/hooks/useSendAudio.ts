"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addMessageToContact} from "../states/chatSlice";
import { ChatMessage } from "../types/chat";
import { sendMessage } from "../utils/sendMessageApi";
import { formatTime24 } from "../utils/formatTime";
import { useMapSendMessageResponse } from "./useMapSendMessageResponse";
import { useChatHistory } from "./useChatHistory";

export function useSendAudio( contactId: string, currentUserId: string )
{
    const dispatch = useDispatch();
    const { mapSendMessageResponse } = useMapSendMessageResponse();
    const { refetch: refetchChatHistory } = useChatHistory( contactId );

    const [isSendingAudio, setIsSendingAudio] = useState( false );

    const handleSendAudio = async ( audioBlob: Blob ) =>
    {
        if ( !contactId || contactId === "default" ) return;

        const file = new File( [audioBlob], `audio_${ Date.now() }.webm`, {
            type: "audio/webm",
        } );

        setIsSendingAudio( true );

        try
        {
            const apiResponseRaw = await sendMessage( contactId, "", [file] );
            const apiResponse = mapSendMessageResponse( apiResponseRaw );

            const serverAttachment = apiResponse.attachments?.[0];
            const side =
                apiResponse.from_user_id === currentUserId ? "kanan" : "kiri";

            const newMessage: ChatMessage = {
                id: apiResponse.message_id,
                text: "",
                caption: "",
                audioUrl: serverAttachment?.mediaUrl || URL.createObjectURL( file ),
                fileName: serverAttachment?.mediaName || file?.name || "",
                fileType: serverAttachment?.mediaType || file?.type || "",
                time: formatTime24( apiResponse.created_at ),
                side,
                attachments: apiResponse.attachments || [],
            };

            dispatch( addMessageToContact( { contactId, message: newMessage } ) );

            // Realtime refresh chat history
            refetchChatHistory();
        } catch ( err )
        {
            console.error( "Gagal mengirim audio:", err );
        } finally
        {
            setIsSendingAudio( false );
        }
    };

    return { handleSendAudio, isSendingAudio };
}
