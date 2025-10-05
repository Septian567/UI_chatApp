import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../states";
import { setMessagesForContact } from "../states/chatSlice";
import { ChatMessage } from "../types/chat";
import { softDeleteMessage, softDeleteMessageWithApi } from "./useSoftDelete";
import { deleteMessageForUser } from "../utils/deleteMessageForUserApi";
import { useChatSocket } from "./useChatSocket";
import { upsertLastMessage, removeLastMessageByContact } from "../states/lastMessagesSlice";

export function useMessageActions(
    contactId: string,
    editingIndex: number | null,
    setEditingIndex: ( index: number | null ) => void,
    setEditType: ( type: "text" | "file" | null ) => void
)
{
    const dispatch = useDispatch();
    const currentUserId = localStorage.getItem( "userId" ) || "";
    const socket = useChatSocket( contactId, currentUserId );

    const messages = useSelector( ( state: RootState ) => state.chat[contactId] || [] );

    const update = ( newMessages: ChatMessage[] ) =>
        dispatch( setMessagesForContact( { contactId, messages: newMessages } ) );

    const resetEditingIfNeeded = ( index: number ) =>
    {
        if ( editingIndex === index )
        {
            setEditingIndex( null );
            setEditType( null );
        } else if ( editingIndex !== null && index < editingIndex )
        {
            setEditingIndex( editingIndex - 1 );
        }
    };

    // --- Sinkronisasi last message sidebar
    const syncLastMessage = ( updatedMessages: ChatMessage[] ) =>
    {
        const lastMsg = [...updatedMessages].reverse().find( msg => !msg.isDeleted );
        if ( lastMsg )
        {
            dispatch(
                upsertLastMessage( {
                    chat_partner_id: contactId,
                    message_id: lastMsg.id || Date.now().toString(),
                    message_text: lastMsg.text || "",
                    created_at: lastMsg.updatedAt || new Date().toISOString(),
                    is_deleted: lastMsg.isDeleted ?? false,
                } )
            );
        } else
        {
            dispatch( removeLastMessageByContact( contactId ) );
        }
    };

    // === Soft delete handlers ===
    const handleSoftDeleteMessage = async ( index: number ) =>
    {
        const msg = messages[index];
        if ( !msg ) return;

        const updatedMsg = softDeleteMessage( msg );
        const updatedMessages = [...messages];
        updatedMessages[index] = updatedMsg;
        update( updatedMessages );
        resetEditingIfNeeded( index );

        syncLastMessage( updatedMessages );

        try
        {
            if ( msg.id && !msg.id.startsWith( "temp-" ) )
            {
                await softDeleteMessageWithApi( msg );
                if ( socket ) socket.emit( "softDeleteMessage", { messageId: msg.id, contactId } );
            }
        } catch ( err )
        {
            console.error( "Gagal soft delete via API:", err );
        }
    };

    const handleSoftDeleteTextMessage = handleSoftDeleteMessage;
    const handleSoftDeleteFileMessage = handleSoftDeleteMessage;
    const handleSoftDeleteAudioMessage = handleSoftDeleteMessage;

    // === Hard delete lokal ===
    const handleDeleteMessage = ( index: number ) =>
    {
        const updated = messages.filter( ( _, i ) => i !== index );
        update( updated );
        resetEditingIfNeeded( index );
        syncLastMessage( updated );
    };

    const handleDeleteFileMessage = handleDeleteMessage;
    const handleDeleteAudioMessage = handleDeleteMessage;

    // === Hard delete via API / server ===
    const handleDeleteMessageForUser = async ( index: number ) =>
    {
        const msg = messages[index];
        if ( !msg ) return;

        const updatedMessages = messages.filter( ( _, i ) => i !== index );
        update( updatedMessages );
        resetEditingIfNeeded( index );
        syncLastMessage( updatedMessages );

        if ( msg.id && !msg.id.startsWith( "temp-" ) && !msg.isSending )
        {
            try
            {
                await deleteMessageForUser( msg.id );
                if ( socket ) socket.emit( "deleteMessage", { messageId: msg.id, contactId } );
            } catch ( err )
            {
                console.error( "Gagal hapus pesan di server:", err );
            }
        }
    };

    const handleDeleteFileMessageForUser = handleDeleteMessageForUser;
    const handleDeleteAudioMessageForUser = handleDeleteMessageForUser;

    return {
        messages,
        handleSoftDeleteTextMessage,
        handleSoftDeleteFileMessage,
        handleSoftDeleteAudioMessage,
        handleDeleteMessage,
        handleDeleteFileMessage,
        handleDeleteAudioMessage,
        handleDeleteFileMessageForUser,
        handleDeleteAudioMessageForUser,
        handleDeleteMessageForUser,
    };
}
