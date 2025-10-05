import CustomAudioPlayer from "../messageInput/CustomAudioPlayer";
import { MessageMenu } from "./MessageMenu";
import { ChatBubble } from "./ChatBubble";
import { SoftDeletedMessage } from "../../hooks/useSoftDelete";

interface ChatAudioMessageProps
{
    audioUrl?: string;
    time: string;
    duration?: number;
    isSoftDeleted?: boolean;
    isSending?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    textStatus?: string;
    align?: "left" | "right";
    onSoftDeleteClick?: () => void;
    onDeleteClick?: () => void;
    onToggleMenu?: ( isOpen: boolean ) => void;
}

export default function ChatAudioMessage( {
    audioUrl,
    time,
    duration,
    isSoftDeleted = false,
    isSending = false,
    isLoading = false,
    isError = false,
    textStatus = "Pesan telah dihapus",
    align = "right",
    onSoftDeleteClick,
    onDeleteClick,
    onToggleMenu,
}: ChatAudioMessageProps )
{
    const showSoftDeleted = isSoftDeleted || !audioUrl;

    return (
        <ChatBubble variant="media" align={ align }>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between w-full">
                    { showSoftDeleted ? (
                        <SoftDeletedMessage text={ textStatus } />
                    ) : (
                        <div className="flex items-center gap-3 flex-1 relative">
                            <CustomAudioPlayer src={ audioUrl } manualDuration={ duration } />

                            {/* Overlay loading saat audio sedang dikirim */ }
                            { ( isSending || isLoading ) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-md">
                                    <span className="text-xs text-gray-600">Mengirim...</span>
                                </div>
                            ) }

                            {/* Overlay error jika gagal */ }
                            { isError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-red-100/80 rounded-md">
                                    <span className="text-xs text-red-600">Gagal mengirim</span>
                                </div>
                            ) }

                            <span className="text-xs text-gray-700 whitespace-nowrap">{ time }</span>
                        </div>
                    ) }

                    { ( onSoftDeleteClick || onDeleteClick ) && (
                        <MessageMenu
                            isOwnMessage={ align === "right" }
                            isSoftDeleted={ !!isSoftDeleted }
                            onSoftDeleteClick={ onSoftDeleteClick }
                            onDeleteClick={ onDeleteClick }
                            align={ align }
                            onToggle={ onToggleMenu }
                        />
                    ) }
                </div>
            </div>
        </ChatBubble>
    );
}
