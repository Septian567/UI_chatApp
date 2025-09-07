"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../states";
import ChatHeader from "./ChatHeader";
import MessageInput from "../messageInput/MessageInput";
import ChatBody from "./ChatBody";
import { useChatHandlers } from "../../hooks/useChatHook";
import { useEffect } from "react";
import { loadChatFromStorage, saveChatToStorage, ChatMessage } from "../../utils/chatStorage";

interface ChatPageProps
{
    isMobile: boolean;
    onBack: () => void;
    sidebarWidth?: number | string;
}

export default function ChatPage( { isMobile, onBack }: ChatPageProps )
{
    const activeContact = useSelector(
        ( state: RootState ) => state.contacts.activeContact
    );

    const contactId = activeContact?.email || activeContact?.alias || "bento";
    const contactName = activeContact?.alias || activeContact?.name || "Bento";

    const {
        messages,
        setMessages,
        editingIndex,
        editType,
        editingMessage,
        handleEditTextMessage,
        handleEditFileMessage,
        handleSubmitEdit,
        handleCancelEdit,
        handleDeleteTextMessage,
        handleSoftDeleteTextMessage,
        handleSoftDeleteFileMessage,
        handleDeleteFileMessage,
        handleSoftDeleteAudioMessage,
        handleDeleteAudioMessage,
        handleSendMessage,
        handleSendAudio,
        handleSendFile,
        chatSide,
        setChatSide,
    } = useChatHandlers();

    // 🔹 Load chat saat kontak berubah
    useEffect( () =>
    {
        const savedMessages: ChatMessage[] = loadChatFromStorage( contactId );
        setMessages( savedMessages );
    }, [contactId] );

    // 🔹 Simpan chat setiap kali messages berubah
    useEffect( () =>
    {
        saveChatToStorage( contactId, messages );
    }, [contactId, messages] );

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
                setMessages={ setMessages }
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
