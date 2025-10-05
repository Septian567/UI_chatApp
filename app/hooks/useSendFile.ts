"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addMessageToContact} from "../states/chatSlice";
import { ChatMessage} from "../types/chat";
import { sendMessage } from "../utils/sendMessageApi";
import { formatTime24 } from "../utils/formatTime";
import { useMapSendMessageResponse } from "./useMapSendMessageResponse";

export function useSendFile( contactId: string, currentUserId: string )
{
    const dispatch = useDispatch();
    const { mapSendMessageResponse } = useMapSendMessageResponse();
    const [isSendingFile, setIsSendingFile] = useState( false );

    const handleSendFile = async ( file: File, caption?: string ) =>
    {
        if ( !contactId ) return;
        setIsSendingFile( true );

        try
        {
            const apiResponseRaw = await sendMessage( contactId, caption || "", [file] );
            console.log( "DEBUG: apiResponseRaw", apiResponseRaw );

            const apiResponse = mapSendMessageResponse( apiResponseRaw );
            console.log( "DEBUG: apiResponse mapped attachments", apiResponse.attachments );

            const serverAttachment = apiResponse.attachments?.[0];
            const side = apiResponse.from_user_id === currentUserId ? "kanan" : "kiri";

            const newMessage: ChatMessage = {
                id: apiResponse.message_id,
                text: caption || "",
                caption: caption || "",
                fileUrl: serverAttachment?.mediaUrl || URL.createObjectURL( file ),
                fileName: serverAttachment?.mediaName || file?.name || "",
                fileType: serverAttachment?.mediaType || file?.type || "",
                audioUrl:
                    serverAttachment?.mediaType === "audio" ? serverAttachment?.mediaUrl : undefined,
                time: formatTime24( apiResponse.created_at ),
                side,
                attachments: apiResponse.attachments || [],
            };

            console.log( "DEBUG: newMessage after sendFile", newMessage );

            dispatch( addMessageToContact( { contactId, message: newMessage } ) );
        } catch ( err )
        {
            console.error( "Gagal mengirim file:", err );
        } finally
        {
            setIsSendingFile( false );
        }
    };

    return { handleSendFile, isSendingFile };
}
