"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../states";
import ChatHeader from "./ChatHeader";
import MessageInput from "../messageInput/MessageInput";
import ChatBody from "./ChatBody";
import { useChatHandlers } from "../../hooks/useChatHandlers";
import { useEffect } from "react";
import { loadChatFromStorage, saveChatToStorage, ChatMessage } from "../../utils/chatStorage";
import { setChatMessages } from "../../states/chatSlice";

interface ChatPageProps
{
    isMobile: boolean;
    onBack: () => void;
    sidebarWidth?: number | string;
}

export default function ChatPage( { isMobile, onBack }: ChatPageProps )
{
    const dispatch = useDispatch();

    const activeContact = useSelector( ( state: RootState ) => state.contacts.activeContact );
    const contactId = activeContact?.email || activeContact?.alias || "bento";
    const contactName = activeContact?.alias || activeContact?.name || "Bento";

    const messages = useSelector( ( state: RootState ) => state.chat.chats[contactId] || [] );

    const setMessagesWithStorage = ( newMessages: ChatMessage[] ) =>
    {
        dispatch( setChatMessages( { contactId, messages: newMessages } ) );
        saveChatToStorage( contactId, newMessages );
    };

    const chatHandlers = useChatHandlers( { messages, setMessages: setMessagesWithStorage } );

    // Load chat dari localStorage jika Redux kosong
    useEffect( () =>
    {
        if ( messages.length === 0 )
        {
            const savedMessages: ChatMessage[] = loadChatFromStorage( contactId );
            dispatch( setChatMessages( { contactId, messages: savedMessages } ) );
        }
    }, [contactId, dispatch] );

    return (
        <main className="flex-1 flex flex-col bg-transparent text-black overflow-hidden">
            <ChatHeader
                isMobile={ isMobile }
                onBack={ onBack }
                contactName={ contactName }
                onChatKiri={ () => chatHandlers.setChatSide( "kiri" ) }
                onChatKanan={ () => chatHandlers.setChatSide( "kanan" ) }
            />

            <ChatBody
                messages={ messages }
                setMessages={ setMessagesWithStorage }
                onEditTextMessage={ chatHandlers.handleEditTextMessage }
                onDeleteTextMessage={ chatHandlers.handleDeleteTextMessage }
                onSoftDeleteTextMessage={ chatHandlers.handleSoftDeleteTextMessage }
                onEditFileMessage={ chatHandlers.handleEditFileMessage }
                onDeleteFileMessage={ chatHandlers.handleDeleteFileMessage }
                onSoftDeleteFileMessage={ chatHandlers.handleSoftDeleteFileMessage }
                onDeleteAudioMessage={ chatHandlers.handleDeleteAudioMessage }
                onSoftDeleteAudioMessage={ chatHandlers.handleSoftDeleteAudioMessage }
            />

            <MessageInput
                onSend={ chatHandlers.handleSendMessage }
                onSendAudio={ chatHandlers.handleSendAudio }
                onSendFile={ chatHandlers.handleSendFile }
                isEditing={ chatHandlers.editingIndex !== null }
                initialEditValue={
                    chatHandlers.editType === "text"
                        ? chatHandlers.editingMessage?.text || ""
                        : chatHandlers.editType === "file"
                            ? chatHandlers.editingMessage?.caption || ""
                            : ""
                }
                onSubmitEdit={ chatHandlers.handleSubmitEdit }
                onCancelEdit={ chatHandlers.handleCancelEdit }
            />
        </main>
    );
}
