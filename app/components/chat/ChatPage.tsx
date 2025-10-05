"use client";

import { useLayoutEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "../messageInput/MessageInput";
import ChatBody from "./ChatBody";
import { useChatPage } from "../../hooks/useChatPage";
import { useChatHistoryManager } from "../../hooks/useChatHistoryManager";
import { ArrowLeft } from "lucide-react";

interface ChatPageProps
{
    isMobile: boolean;
    onBack: () => void;
    sidebarWidth?: number | string;
    contactName?: string;
}

export default function ChatPage( { isMobile, onBack }: ChatPageProps )
{
    // 🔹 Semua logika fetch & pengecekan kontak ada di sini
    const { activeContact, contactId, isActiveContactDeleted, loading, error } =
        useChatHistoryManager();

    const {
        messages,
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

    // 🔹 Scroll ke bawah saat kontak / messages berubah
    useLayoutEffect( () =>
    {
        const el = document.getElementById( "chat-bottom" );
        if ( el ) el.scrollIntoView( { behavior: "auto" } );
    }, [activeContact, messages] );

    // 🔹 Render placeholder jika tidak ada kontak aktif atau kontak dihapus
    if ( !activeContact || isActiveContactDeleted )
    {
        return (
            <main className="flex-1 flex flex-col items-center justify-center text-gray-500 relative">
                { isMobile && (
                    <button
                        onClick={ onBack }
                        className="absolute top-4 left-4 flex items-center text-gray-700 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        <span>menu</span>
                    </button>
                ) }
                <p>silahkan pilih kontak untuk memulai chat</p>
            </main>
        );
    }

    const contactName = activeContact.alias || activeContact.email || "Bento";
    const avatarUrl = activeContact.avatar_url || "";

    return (
        <main className="flex-1 flex flex-col bg-transparent text-black overflow-hidden">
            <ChatHeader
                isMobile={ isMobile }
                onBack={ onBack }
                contactName={ contactName }
                contactId={ contactId! }
                avatarUrl={ avatarUrl }
                
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
