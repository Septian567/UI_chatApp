import { ReactNode } from "react";

interface ChatBubbleProps {
    children: ReactNode;
    variant?: "text" | "media";
    fixedWidth?: string;
    align?: "left" | "right"; // ➕ posisi bubble
}

export function ChatBubble({
    children,
    variant = "text",
    fixedWidth,
    align = "right", // default kanan (hijau)
}: ChatBubbleProps) {
    const isRight = align === "right";

    return (
        <div
            className={`flex mb-4 relative ${
                isRight ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`
                    rounded-lg px-3 py-3 shadow border border-black
                    ${isRight ? "bg-green-200" : "bg-white"}
                    ${
                        fixedWidth
                            ? `w-[${fixedWidth}]`
                            : variant === "media"
                            ? "w-[7cm] max-w-[5cm] sm:max-w-md"
                            : "max-w-xs sm:max-w-sm"
                    }
                `}
            >
                {children}
            </div>
        </div>
    );
}
