import ChatTextMessage from "./ChatTextMessage";
import ChatAudioMessage from "./ChatAudioMessage";
import ChatFileMessage from "./ChatFileMessage";
import ChatStaticMessages from "./ChatStaticMessages";
import { useChatMessageActions, ChatMessage } from "../../hooks/useChatMessageActions";
import { isSoftDeletedMessage } from "./deletedMessage";
import { useChatBody } from "../../hooks/useChatBody"; // ✅ import hook baru

interface ChatBodyProps
{
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;

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
    setMessages,
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
    const { handleSoftDeleteFileMessage, handleSoftDeleteTextMessage } =
        useChatMessageActions( setMessages );

    const { bottomRef, chatBodyRef, isMenuOpen, setIsMenuOpen } =
        useChatBody( messages ); // ✅ pakai custom hook

    return (
        <div ref={ chatBodyRef } className="flex-1 py-6 w-full responsive-padding overflow-y-auto">
            <ChatStaticMessages />

            { messages.map( ( msg, index ) =>
            {
                const align: "left" | "right" =
                    msg.side === "kiri" ? "left" : msg.side === "kanan" ? "right" : "right";

                if ( msg.text )
                {
                    const isDeleted = isSoftDeletedMessage( msg.text );
                    return (
                        <ChatTextMessage
                            key={ index }
                            text={ msg.text }
                            time={ msg.time }
                            align={ align }
                            onEditClick={ !isDeleted ? () => onEditTextMessage?.( index ) : undefined }
                            onSoftDeleteClick={
                                !isDeleted
                                    ? () =>
                                        onSoftDeleteTextMessage
                                            ? onSoftDeleteTextMessage( index )
                                            : handleSoftDeleteTextMessage( index )
                                    : undefined
                            }
                            onDeleteClick={ () => onDeleteTextMessage?.( index ) }
                            onToggleMenu={ setIsMenuOpen }
                        />
                    );
                }

                if ( msg.audioUrl || isSoftDeletedMessage( msg.text ) )
                {
                    return (
                        <ChatAudioMessage
                            key={ index }
                            audioUrl={ msg.audioUrl }
                            time={ msg.time }
                            duration={ msg.duration }
                            isSoftDeleted={ msg.isSoftDeleted }
                            textStatus={ msg.text }
                            align={ align }
                            onSoftDeleteClick={
                                !msg.isSoftDeleted ? () => onSoftDeleteAudioMessage?.( index ) : undefined
                            }
                            onDeleteClick={ () => onDeleteAudioMessage?.( index ) }
                            onToggleMenu={ setIsMenuOpen }
                        />
                    );
                }

                if ( msg.fileUrl || msg.caption )
                {
                    const isSoftDeleted = isSoftDeletedMessage( msg.caption );
                    return (
                        <ChatFileMessage
                            key={ index }
                            fileUrl={ msg.fileUrl || "" }
                            fileName={ msg.fileName }
                            caption={ msg.caption || "" }
                            time={ msg.time }
                            align={ align }
                            onEditClick={ !isSoftDeleted ? () => onEditFileMessage?.( index ) : undefined }
                            onSoftDeleteClick={ !isSoftDeleted ? () => onSoftDeleteFileMessage?.( index ) : undefined }
                            onDeleteClick={ () => onDeleteFileMessage?.( index ) }
                            onToggleMenu={ setIsMenuOpen }
                        />
                    );
                }

                return null;
            } ) }
            <div ref={ bottomRef } />
        </div>
    );
}
