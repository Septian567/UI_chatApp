import { useFilePreview } from "../../hooks/useFilePreview";
import { ChatFilePreview } from "./ChatFilePreview";
import { MessageMenu } from "./MessageMenu";
import { ChatBubble } from "./ChatBubble";
import
    {
        SoftDeletedMessage,
        isSoftDeletedMessage,
        DEFAULT_FILE_DELETED_TEXT,
    } from "../../hooks/useSoftDelete";

interface ChatFileMessageProps
{
    fileUrl: string;
    fileName?: string;
    caption?: string;
    fileType?: string;
    time: string;
    align?: "left" | "right";
    onEditClick?: () => void;
    onSoftDeleteClick?: () => void;
    onDeleteClick?: () => void;
    onToggleMenu?: ( isOpen: boolean ) => void;
    isActive?: boolean;
    isDeleted?: boolean;
}

export default function ChatFileMessage( {
    fileUrl,
    fileName = "Dokumen",
    caption,
    time,
    align = "right",
    onEditClick,
    onSoftDeleteClick,
    onDeleteClick,
    onToggleMenu,
    isActive = true,
    isDeleted = false,
}: ChatFileMessageProps )
{
    const { fileExtension, isImage, isVideo, isAudio, fileIcon, handleDownload } =
        useFilePreview( fileUrl, fileName );

    const isSoftDeleted = isDeleted || isSoftDeletedMessage( caption );
    const displayCaption = isSoftDeleted ? DEFAULT_FILE_DELETED_TEXT : caption || "";

    const TimeAndMenu = (
        <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-gray-700 whitespace-nowrap">{ time }</span>
            { ( onEditClick || onSoftDeleteClick || onDeleteClick ) && (
                <MessageMenu
                    isOwnMessage={ align === "right" }
                    isSoftDeleted={ isSoftDeleted }
                    onEditClick={ onEditClick }
                    onSoftDeleteClick={ onSoftDeleteClick }
                    onDeleteClick={ onDeleteClick }
                    align={ align }
                    onToggle={ onToggleMenu }
                />
            ) }
        </div>
    );

    return (
        <ChatBubble variant="media" align={ align }>
            <div className="flex flex-col w-full">
                { isSoftDeleted ? (
                    <div className="flex items-center min-h-[1.9rem]">
                        <SoftDeletedMessage text={ displayCaption }/>
                        { TimeAndMenu }
                    </div>
                ) : (
                    <div
                        className={ `flex flex-col gap-1 w-full max-w-full ${ !isActive ? "hidden" : ""
                            }` }
                    >
                        <ChatFilePreview
                            fileUrl={ fileUrl }
                            fileName={ fileName }
                            fileExtension={ fileExtension }
                            isImage={ isImage }
                            isVideo={ isVideo }
                            isAudio={ isAudio }
                            fileIcon={ fileIcon }
                            handleDownload={ handleDownload }
                            duration={ isVideo || isAudio ? "0:00" : undefined }
                            isSoftDeleted={ isSoftDeleted }
                            align={ align }
                            isActive={ isActive }
                        />
                        { displayCaption && (
                            <span className="whitespace-pre-wrap break-words text-black">
                                { displayCaption }
                            </span>
                        ) }
                        <div className="flex items-center gap-1 self-end mt-1">{ TimeAndMenu }</div>
                    </div>
                ) }
            </div>
        </ChatBubble>
    );
}
