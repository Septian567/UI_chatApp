"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../states";
import ChatHeader from "./ChatHeader";
import MessageInput from "../messageInput/MessageInput";
import ChatBody from "./ChatBody";
import { useChatPage } from "../../hooks/useChatPage";

interface ChatPageProps
{
    isMobile: boolean;
    onBack: () => void;
    sidebarWidth?: number | string;
}

export default function ChatPage( { isMobile, onBack }: ChatPageProps )
{
    const activeContact = useSelector( ( state: RootState ) => state.contacts.activeContact );
    const contactName = activeContact?.alias || activeContact?.name || "Bento";

    const {
        messages,
        chatSide,
        setChatSide,
        editingIndex,
        editType,
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleSubmitEdit,
        handleCancelEdit,
        handleDeleteTextMessage,
        handleSoftDeleteTextMessage,
        handleDeleteFileMessage,
        handleSoftDeleteFileMessage,
        handleDeleteAudioMessage,
        handleSoftDeleteAudioMessage,
        handleSendMessage,
        handleSendAudio,
        handleSendFile,
    } = useChatPage();

    return (
        <main className="flex-1 flex flex-col bg-transparent text-black overflow-hidden">
            <ChatHeader
                isMobile={ isMobile }
                onBack={ onBack }
                contactName={ contactName }
                onChatKiri={ () => setChatSide( "kiri" ) }
                onChatKanan={ () => setChatSide( "kanan" ) }
            />
            <ChatBody
                messages={ messages }
                onEditTextMessage={ handleEditTextMessage }
                onDeleteTextMessage={ handleDeleteTextMessage }
                onSoftDeleteTextMessage={ handleSoftDeleteTextMessage }
                onEditFileMessage={ handleEditFileMessage }
                onDeleteFileMessage={ handleDeleteFileMessage }
                onSoftDeleteFileMessage={ handleSoftDeleteFileMessage }
                onDeleteAudioMessage={ handleDeleteAudioMessage }
                onSoftDeleteAudioMessage={ handleSoftDeleteAudioMessage }
            />
            <MessageInput
                onSend={ handleSendMessage }
                onSendAudio={ handleSendAudio }
                onSendFile={ handleSendFile }
                isEditing={ editingIndex !== null }
                initialEditValue={
                    editType === "text"
                        ? editingMessage?.text || ""
                        : editType === "file"
                            ? editingMessage?.caption || ""
                            : ""
                }
                onSubmitEdit={ handleSubmitEdit }
                onCancelEdit={ handleCancelEdit }
            />
        </main>
    );
}
