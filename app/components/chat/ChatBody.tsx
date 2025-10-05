import { useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../states";

import ChatTextMessage from "./ChatTextMessage";
import ChatAudioMessage from "./ChatAudioMessage";
import ChatFileMessage from "./ChatFileMessage";
import { ChatMessage } from "../../types/chat";
import { useChatBody } from "../../hooks/chatBody/useChatBody";
import { isSoftDeletedMessage } from "../../hooks/useSoftDelete";

interface ChatBodyProps
{
    messages: ChatMessage[];

    onEditTextMessage?: ( index: number ) => void;
    onDeleteTextMessage?: ( index: number ) => void;
    onSoftDeleteTextMessage?: ( index: number ) => void;

    onEditFileMessage?: ( index: number ) => void;
    onDeleteFileMessage?: ( index: number ) => void;
    onSoftDeleteFileMessage?: ( index: number ) => void;

    onDeleteAudioMessage?: ( index: number ) => void;
    onSoftDeleteAudioMessage?: ( index: number ) => void;
}

export default function ChatBody( {
    messages,
    onEditTextMessage,
    onDeleteTextMessage,
    onSoftDeleteTextMessage,
    onEditFileMessage,
    onDeleteFileMessage,
    onSoftDeleteFileMessage,
    onDeleteAudioMessage,
    onSoftDeleteAudioMessage,
}: ChatBodyProps )
{
    const { bottomRef, chatBodyRef, setIsMenuOpen } = useChatBody( messages );
    const activeContact = useSelector( ( state: RootState ) => state.contacts.activeContact );
    const firstRender = useRef( true );

    // Scroll ke bawah saat ganti kontak
    useLayoutEffect( () =>
    {
        bottomRef.current?.scrollIntoView( { behavior: "auto" } );
        firstRender.current = false;
    }, [activeContact] );

    const renderMessage = ( msg: ChatMessage, index: number ) =>
    {
        const align: "left" | "right" = msg.side === "kiri" ? "left" : "right";

        const firstAttachment = msg.attachments?.[0];
        const mediaType = firstAttachment?.mediaType;
        const fileName = msg.fileName || firstAttachment?.mediaName || "";
        const isVideoFileName = /^video-\d+\.webm$/i.test( fileName );

        const isTextSoftDeleted = isSoftDeletedMessage( msg.text );
        const isFileSoftDeleted = isSoftDeletedMessage( msg.caption );

        // 1️⃣ Audio (bukan video)
        if ( ( mediaType === "audio" || msg.audioUrl ) && !isVideoFileName )
        {
            return (
                <ChatAudioMessage
                    key={ msg.id || index }
                    audioUrl={ msg.audioUrl || firstAttachment?.mediaUrl }
                    time={ msg.time }
                    duration={ msg.duration }
                    isSoftDeleted={ msg.isSoftDeleted }
                    textStatus={ msg.text || "" }
                    align={ align }
                    onSoftDeleteClick={ !msg.isSoftDeleted ? () => onSoftDeleteAudioMessage?.( index ) : undefined }
                    onDeleteClick={ () => onDeleteAudioMessage?.( index ) }
                    onToggleMenu={ setIsMenuOpen }
                />
            );
        }

        // 2️⃣ File atau video
        if ( msg.fileUrl || msg.caption || firstAttachment )
        {
            return (
                <ChatFileMessage
                    key={ msg.id || index }
                    fileUrl={ msg.fileUrl || firstAttachment?.mediaUrl || "" }
                    fileName={ fileName }
                    fileType={ firstAttachment?.mediaType || msg.fileType }
                    caption={ msg.caption || "" }
                    time={ msg.time }
                    align={ align }
                    isActive={ true }
                    onEditClick={ !isFileSoftDeleted ? () => onEditFileMessage?.( index ) : undefined }
                    onSoftDeleteClick={ !isFileSoftDeleted ? () => onSoftDeleteFileMessage?.( index ) : undefined }
                    onDeleteClick={ () => onDeleteFileMessage?.( index ) }
                    onToggleMenu={ setIsMenuOpen }
                />
            );
        }

        // 3️⃣ Text
        if ( msg.text )
        {
            return (
                <ChatTextMessage
                    key={ msg.id || index }
                    messageId={ msg.id || index.toString() }
                    text={ msg.text }
                    time={ msg.time }
                    isSoftDeleted={ isTextSoftDeleted }
                    onEditClick={ !isTextSoftDeleted ? () => onEditTextMessage?.( index ) : undefined }
                    onSoftDeleteClick={ !isTextSoftDeleted ? () => onSoftDeleteTextMessage?.( index ) : undefined }
                    onDeleteClick={ () => onDeleteTextMessage?.( index ) }
                    onToggleMenu={ setIsMenuOpen }
                    align={ align }
                />
            );
        }

        return null;
    };

    return (
        <div ref={ chatBodyRef } className="flex-1 py-6 w-full responsive-padding overflow-y-auto">
            { messages.map( renderMessage ) }
            <div ref={ bottomRef } />
        </div>
    );
}
