import CustomAudioPlayer from "../messageInput/CustomAudioPlayer";
import { DEFAULT_SOFT_DELETED_TEXT } from "./deletedMessage";
import { MessageMenu } from "./MessageMenu";
import { ChatBubble } from "./ChatBubble";

interface ChatAudioMessageProps
{
    audioUrl: string;
    time: string;
    duration?: number;
    isSoftDeleted?: boolean;
    textStatus?: string;
    align?: "left" | "right";
    onSoftDeleteClick?: () => void;
    onDeleteClick?: () => void;
    onToggleMenu?: ( isOpen: boolean ) => void; // 🔹 indikator toggle menu
}

export default function ChatAudioMessage( {
    audioUrl,
    time,
    duration,
    isSoftDeleted,
    textStatus,
    align = "right", // default kanan
    onSoftDeleteClick,
    onDeleteClick,
    onToggleMenu, // 🔹 diterima
}: ChatAudioMessageProps )
{
    return (
        <ChatBubble variant="media" align={ align }>
            <div className="flex flex-col gap-1 w-full max-w-xs">
                {/* Baris utama: play, wave, waktu, menu */ }
                <div className="flex items-center justify-between gap-3">
                    { isSoftDeleted ? (
                        <span className="text-sm text-gray-500 italic">
                            { textStatus || DEFAULT_SOFT_DELETED_TEXT }
                        </span>
                    ) : (
                        <div className="flex items-center gap-3 flex-1">
                            <CustomAudioPlayer src={ audioUrl } manualDuration={ duration } />
                            <span className="text-xs text-gray-700 whitespace-nowrap">
                                { time }
                            </span>
                        </div>
                    ) }

                    { ( onSoftDeleteClick || onDeleteClick ) && (
                        <MessageMenu
                            isSoftDeleted={ !!isSoftDeleted }
                            onSoftDeleteClick={ onSoftDeleteClick }
                            onDeleteClick={ onDeleteClick }
                            align={ align }
                            onToggle={ onToggleMenu } // 🔹 diteruskan ke MessageMenu
                        />
                    ) }
                </div>

                {/* Indikator waktu di bawah */ }
                { !isSoftDeleted && (
                    <div className="flex justify-between text-[11px] text-gray-500 pl-7">
                        <span>0:00</span>
                        <span>
                            { duration
                                ? `${ Math.floor( duration / 60 ) }:${ String(
                                    Math.floor( duration % 60 )
                                ).padStart( 2, "0" ) }`
                                : "--:--" }
                        </span>
                    </div>
                ) }
            </div>
        </ChatBubble>
    );
}
