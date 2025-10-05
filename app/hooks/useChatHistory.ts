"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../states";
import { getChatHistory, ChatHistoryItem } from "../utils/getChatHistoryApi";
import { setMessagesForContact} from "../states/chatSlice";
import { ChatMessage} from "../types/chat";
import { softDeleteMessage } from "./useSoftDelete";
import { formatTime24 } from "../utils/formatTime";
import { determineAttachmentType } from "../utils/attachmentUtils";

export function useChatHistory( contactId?: string )
{
    const dispatch = useDispatch();
    const activeContact = useSelector( ( state: RootState ) => state.contacts.activeContact );
    const targetContactId = contactId || activeContact?.contact_id;

    const [loading, setLoading] = useState( false );
    const [error, setError] = useState<string | null>( null );

    const fetchChatHistory = useCallback( async () =>
    {
        if ( !targetContactId ) return; // ⚡ skip fetch jika tidak ada kontak

        const userId = localStorage.getItem( "userId" );
        if ( !userId )
        {
            setError( "User ID tidak ditemukan" );
            return;
        }

        setLoading( true );
        setError( null );

        try
        {
            const history: ChatHistoryItem[] = await getChatHistory( targetContactId );

            const formattedMessages: ChatMessage[] = history.map( ( msg ) =>
            {
                let fileUrl: string | undefined;
                let fileName: string | undefined;
                let fileType: string | undefined;
                let audioUrl: string | undefined;
                let videoUrl: string | undefined;
                let caption: string | undefined;

                if ( msg.attachments && msg.attachments.length > 0 )
                {
                    const attachment = msg.attachments[0];
                    const attachmentType = determineAttachmentType( attachment );

                    fileUrl = attachment.media_url;
                    fileName = attachment.media_name;
                    fileType = attachment.media_type;
                    caption = attachment.caption || msg.message_text || undefined;

                    switch ( attachmentType )
                    {
                        case "voice_note":
                            audioUrl = fileUrl;
                            fileUrl = undefined;
                            fileName = undefined;
                            fileType = undefined;
                            break;
                        case "video":
                            videoUrl = fileUrl;
                            break;
                        default:
                            if ( !caption && msg.message_text ) caption = msg.message_text;
                    }
                }

                let message: ChatMessage = {
                    id: msg.message_id,
                    text: msg.message_text || "",
                    fileUrl,
                    fileName,
                    fileType,
                    caption,
                    audioUrl,
                    videoUrl,
                    time: formatTime24( msg.created_at ),
                    side: msg.from_user_id === userId ? "kanan" : "kiri",
                    isDeleted: !!msg.is_deleted,
                    isSoftDeleted: false,
                    attachments: msg.attachments || [],
                };

                if ( message.isDeleted )
                {
                    message = softDeleteMessage( message );
                }

                return message;
            } );

            dispatch( setMessagesForContact( {
                contactId: targetContactId,
                messages: formattedMessages,
            } ) );
        } catch ( err: any )
        {
            const message =
                err instanceof Error
                    ? err.message
                    : err.response?.data?.message || err.response?.data || "Unknown error";
            setError( message );
        } finally
        {
            setLoading( false );
        }
    }, [targetContactId, dispatch] );

    // ⚡ Hook selalu dipanggil, fetch hanya jika targetContactId valid
    useEffect( () =>
    {
        fetchChatHistory();
    }, [fetchChatHistory] );

    return { loading, error, refetch: fetchChatHistory };
}
