"use client";

import { MoreVertical, User, Trash2 } from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Contact } from "../../states/contactsSlice";
import { useChatMenuLogic } from "../../hooks/useChatMenuLogic";
import { formatTime24 } from "../../utils/formatTime";

interface ChatMenuProps
{
    setActiveContact: ( c: Contact ) => void;
    onMainMenuClick: ( menu: string ) => void;
    filteredContacts: any[]; // ✅ tetap ada untuk kompatibilitas
}

export default function ChatMenu( {
    setActiveContact,
    onMainMenuClick,
    filteredContacts, // ✅ tambahkan di parameter agar tidak "unused"
}: ChatMenuProps )
{
    const {
        lastMessages,
        loading,
        contactsList,
        avatarMap,
        selectedContact,
        setSelectedContact,
        showConfirm,
        setShowConfirm,
        openMenuIndex,
        setOpenMenuIndex,
        menuRef,
        handleClearConversation,
    } = useChatMenuLogic();

    if ( loading )
        return <p className="text-gray-500 text-sm ml-6">Loading chats...</p>;

    if ( !lastMessages.length )
        return <p className="text-gray-500 text-sm ml-6">No recent chats</p>;

    return (
        <div className="space-y-0 -ml-4">
            { lastMessages.map( ( msg, index ) =>
            {
                const contactId = msg.chat_partner_id;
                const contact =
                    contactsList.find( ( c ) => c.contact_id === contactId ) ||
                    filteredContacts.find( ( c ) => c.contact_id === contactId ) || // ✅ fallback optional
                    null;

                const displayName =
                    contact?.alias || contact?.email || contactId;
                const lastMessageText = msg.is_deleted
                    ? "Pesan telah dihapus"
                    : msg.message_text || "Pesan telah dihapus";

                return (
                    <div
                        key={ `chat-${ contactId }` }
                        className={ `rounded-lg flex flex-col p-2 ${ openMenuIndex === index
                            ? "bg-white"
                            : "hover:bg-gray-100 cursor-pointer"
                            }` }
                        onClick={ () =>
                        {
                            if ( openMenuIndex === index ) return;
                            setActiveContact(
                                contact || {
                                    contact_id: contactId,
                                    email: contactId,
                                    alias: contactId,
                                }
                            );
                            onMainMenuClick( "chat" );
                        } }
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0 mr-3 overflow-hidden">
                                { avatarMap[contactId] ? (
                                    <img
                                        src={ avatarMap[contactId] }
                                        alt={ displayName }
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-6 h-6 text-gray-500" />
                                ) }
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-semibold text-sm truncate">
                                    { displayName }
                                </span>
                                <div className="flex items-center justify-between mt-0 min-w-0">
                                    <span className="text-sm text-gray-600 truncate min-w-0 flex-1">
                                        { lastMessageText }
                                    </span>

                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2 relative">
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            { msg.created_at
                                                ? formatTime24( msg.created_at )
                                                : "" }
                                        </span>
                                        <button
                                            className="p-1"
                                            onClick={ ( e ) =>
                                            {
                                                e.stopPropagation();
                                                setOpenMenuIndex(
                                                    openMenuIndex === index
                                                        ? null
                                                        : index
                                                );
                                            } }
                                        >
                                            <MoreVertical className="w-4 h-4 text-gray-500" />
                                        </button>

                                        { openMenuIndex === index && (
                                            <div
                                                ref={ menuRef }
                                                className="absolute right-0 top-6 w-44 bg-white border rounded-lg shadow-lg z-50 overflow-hidden"
                                            >
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 w-full text-left text-gray-900"
                                                    onClick={ ( e ) =>
                                                    {
                                                        e.stopPropagation();
                                                        setSelectedContact(
                                                            contactId
                                                        );
                                                        setShowConfirm( true );
                                                        setOpenMenuIndex( null );
                                                    } }
                                                >
                                                    <Trash2
                                                        size={ 16 }
                                                        className="shrink-0 text-gray-600"
                                                    />
                                                    <span className="text-sm">
                                                        Hapus percakapan
                                                    </span>
                                                </button>
                                            </div>
                                        ) }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } ) }

            <DeleteConfirmModal
                open={ showConfirm }
                onClose={ () => setShowConfirm( false ) }
                onConfirm={ () =>
                    selectedContact &&
                    handleClearConversation( selectedContact )
                }
            />
        </div>
    );
}
