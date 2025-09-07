import { useFilePreview } from "../../hooks/useFilePreview";
import { ChatFilePreview } from "./ChatFilePreview";
import { MessageMenu } from "./MessageMenu";
import { isSoftDeletedMessage, DEFAULT_FILE_DELETED_TEXT } from "./deletedMessage";
import { ChatBubble } from "./ChatBubble";
import { SoftDeletedMessage } from "./SoftDeletedMessage";

interface ChatFileMessageProps
{
    fileUrl: string;
    fileName?: string;
    caption?: string;
    time: string;
    align?: "left" | "right";
    onEditClick?: () => void;
    onSoftDeleteClick?: () => void;
    onDeleteClick?: () => void;
    onToggleMenu?: ( isOpen: boolean ) => void; // 🔹 indikator toggle menu
}

export default function ChatFileMessage( {
    fileUrl,
    fileName = "Dokumen",
    caption,
    time,
    align,
    onEditClick,
    onSoftDeleteClick,
    onDeleteClick,
    onToggleMenu, // 🔹 diterima
}: ChatFileMessageProps )
{
    const {
        fileExtension,
        isImage,
        isVideo,
        isAudio,
        fileIcon,
        handleDownload,
    } = useFilePreview( fileUrl, fileName );

    const isSoftDeleted = isSoftDeletedMessage( caption );
    const displayCaption = isSoftDeleted ? DEFAULT_FILE_DELETED_TEXT : caption || "";

    // 🔹 Komponen kecil untuk time + menu
    const TimeAndMenu = (
        <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-gray-700 whitespace-nowrap">{ time }</span>
            <MessageMenu
                isSoftDeleted={ isSoftDeleted }
                onEditClick={ onEditClick }
                onSoftDeleteClick={ onSoftDeleteClick }
                onDeleteClick={ onDeleteClick }
                align={ align }
                onToggle={ onToggleMenu } // 🔹 diteruskan ke MessageMenu
            />
        </div>
    );

    return (
        <ChatBubble
            variant="media"
            align={ align }
            fixedWidth={ isSoftDeleted ? "5cm" : undefined } // hanya soft-deleted
        >
            <div className="flex flex-col gap-1">
                { !isSoftDeleted ? (
                    // 📎 Default file message
                    <div className="flex flex-col gap-1 w-full max-w-full">
                        <ChatFilePreview
                            fileUrl={ fileUrl }
                            fileName={ fileName }
                            fileExtension={ fileExtension }
                            isImage={ isImage }
                            isVideo={ isVideo }
                            isAudio={ isAudio }
                            fileIcon={ fileIcon }
                            handleDownload={ handleDownload }
                            duration="0:00"
                            isSoftDeleted={ isSoftDeleted }
                            align={ align }
                        />
                        { displayCaption && (
                            <span className="whitespace-pre-wrap break-words text-black">
                                { displayCaption }
                            </span>
                        ) }

                        {/* Waktu + menu */ }
                        { ( onEditClick || onSoftDeleteClick || onDeleteClick ) && (
                            <div className="flex items-center gap-1 self-end mt-1">
                                { TimeAndMenu }
                            </div>
                        ) }
                    </div>
                ) : (
                    // ✅ Tampilan saat soft deleted sejajar dengan time & menu
                    <div className="flex items-center gap-1 min-h-[1.9rem]">
                        <div className="mr-[2.5px]">
                            <SoftDeletedMessage text={ displayCaption } />
                        </div>
                        { ( onEditClick || onSoftDeleteClick || onDeleteClick ) && TimeAndMenu }
                    </div>
                ) }
            </div>
        </ChatBubble>
    );
}
