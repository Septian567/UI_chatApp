import { useLayoutEffect, useRef, useState } from "react";
import { MessageMenu } from "./MessageMenu";
import { ChatBubble } from "./ChatBubble";
import { SoftDeletedMessage } from "../../hooks/useSoftDelete";

interface ChatTextMessageProps {
    messageId: string;
    text: string;
    time: string;
    isSoftDeleted?: boolean;
    onEditClick?: () => void;
    onDeleteClick?: (messageId: string) => void;
    onSoftDeleteClick?: () => void;
    onToggleMenu?: (isOpen: boolean) => void;
    align?: "left" | "right";
}

function hasLongWord(text: string, maxLength: number = 20) {
    return text.split(/\s+/).some((word) => word.length > maxLength);
}

export default function ChatTextMessage({
    messageId,
    text,
    time,
    isSoftDeleted = false,
    onEditClick,
    onDeleteClick,
    onSoftDeleteClick,
    onToggleMenu,
    align = "right",
}: ChatTextMessageProps) {
    const textRef = useRef<HTMLSpanElement | null>(null);
    const [isMultiLine, setIsMultiLine] = useState(false);

    useLayoutEffect(() => {
        if (!isSoftDeleted && textRef.current) {
            const el = textRef.current;
            const style = window.getComputedStyle(el);
            const lineHeight = parseFloat(style.lineHeight);
            setIsMultiLine(el.scrollHeight > lineHeight * 1.5);
        } else {
            setIsMultiLine(false);
        }
    }, [text, isSoftDeleted]);

    const breakClass = hasLongWord(text) ? "break-all" : "break-words";

    return (
        <ChatBubble variant={isSoftDeleted ? "media" : "text"} align={align}>
            {isSoftDeleted ? (
                // Flex row agar pesan soft-delete sejajar dengan waktu/menu
                <div className="flex items-center justify-between w-full">
                    <SoftDeletedMessage text={ text }/>
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-700 whitespace-nowrap">
                            {time || "—"}
                        </span>
                        {(onEditClick || onSoftDeleteClick || onDeleteClick) && (
                            <MessageMenu
                                isOwnMessage={align === "right"}
                                isSoftDeleted={isSoftDeleted}
                                onEditClick={onEditClick}
                                onSoftDeleteClick={onSoftDeleteClick}
                                onDeleteClick={() => onDeleteClick?.(messageId)}
                                align={align}
                                onToggle={onToggleMenu}
                            />
                        )}
                    </div>
                </div>
            ) : (
                // Layout biasa untuk teks normal
                <div className={`flex ${isMultiLine ? "flex-col" : "flex-row items-end gap-2"}`}>
                    <div className="flex-1">
                        <span
                            ref={textRef}
                            className={`whitespace-pre-wrap ${breakClass} text-black block`}
                        >
                            {text}
                        </span>
                    </div>

                    <div className={`flex items-center gap-1 ${isMultiLine ? "justify-end mt-1 self-end" : "translate-y-[2px]"}`}>
                        <span className="text-xs text-gray-700 whitespace-nowrap">{time || "—"}</span>
                        {(onEditClick || onSoftDeleteClick || onDeleteClick) && (
                            <MessageMenu
                                isOwnMessage={align === "right"}
                                isSoftDeleted={isSoftDeleted}
                                onEditClick={onEditClick}
                                onSoftDeleteClick={onSoftDeleteClick}
                                onDeleteClick={() => onDeleteClick?.(messageId)}
                                align={align}
                                onToggle={onToggleMenu}
                            />
                        )}
                    </div>
                </div>
            )}
        </ChatBubble>
    );
}
