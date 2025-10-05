"use client";

import { useDispatch } from "react-redux";
import { addMessageToContact} from "../states/chatSlice";
import { ChatMessage } from "../types/chat";
import { sendMessage } from "../utils/sendMessageApi";
import { useMapSendMessageResponse } from "./useMapSendMessageResponse";
import { formatTime24 } from "../utils/formatTime";

export function useSendMessage( contactId: string, currentUserId: string )
{
    const dispatch = useDispatch();
    const { mapSendMessageResponse } = useMapSendMessageResponse();

    const handleSendMessage = async ( message: string ) =>
    {
        if ( !contactId ) return;

        try
        {
            const apiResponseRaw = await sendMessage( contactId, message );
            const apiResponse = mapSendMessageResponse( apiResponseRaw );

            const side = apiResponse.from_user_id === currentUserId ? "kanan" : "kiri";

            const newMessage: ChatMessage = {
                id: apiResponse.message_id,
                text: apiResponse.message_text || "",
                caption: "",
                time: formatTime24( apiResponse.created_at ),
                side,
                attachments: apiResponse.attachments || [],
            };

            dispatch( addMessageToContact( { contactId, message: newMessage } ) );
        } catch ( err: any )
        {
            console.error( "Gagal mengirim pesan:", err.response?.data || err.message );
        }
    };

    return { handleSendMessage };
}
