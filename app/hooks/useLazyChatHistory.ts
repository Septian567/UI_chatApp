"use client";

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { getChatHistory, ChatHistoryItem } from "../utils/getChatHistoryApi";
import { setMessagesForContact} from "../states/chatSlice";
import { ChatMessage } from "../types/chat";
import { softDeleteMessage } from "./useSoftDelete";
import { formatTime24 } from "../utils/formatTime";
import { determineAttachmentType } from "../utils/attachmentUtils";

export function useLazyChatHistory()
{
    const dispatch = useDispatch();
    const [loading, setLoading] = useState( false );
    const [error, setError] = useState<string | null>( null );

    const fetchChatHistory = useCallback(
        async ( contactId?: string ) =>
        {
            if ( !contactId ) return;

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
                const history: ChatHistoryItem[] = await getChatHistory( contactId );

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

                dispatch( setMessagesForContact( { contactId, messages: formattedMessages } ) );
            } catch ( err: any )
            {
                setError( err.message || "Unknown error" );
                console.error( "Gagal load chat history:", err );
            } finally
            {
                setLoading( false );
            }
        },
        [dispatch]
    );

    return { loading, error, fetchChatHistory };
}
