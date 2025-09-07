import React from "react";
import { useImagePreview } from "../../hooks/useImagePreview";

interface ImagePreviewProps
{
    fileUrl: string;
    fileName: string;
    align?: "left" | "right"; // ➕ TAMBAHKAN PROP ALIGN
}

export default function ImagePreview( { fileUrl, fileName, align = "right" }: ImagePreviewProps ) // ➕ DEFAULT VALUE
{
    const { isModalOpen, scale, openModal, closeModal, handleWheel } = useImagePreview();

    return (
        <>
            <div className={ `mb-2 cursor-pointer ${ align === "left" ? "text-left" : "text-right" }` } onClick={ openModal }>
                <img
                    src={ fileUrl }
                    alt={ fileName }
                    style={ { width: "8cm" } }
                    className="rounded shadow border"
                />
            </div>

            { isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={ closeModal }>
                    <div className="absolute top-4 right-6 text-2xl cursor-pointer z-50" onClick={ closeModal }>
                        <span style={ { color: "white", fontWeight: "bold" } }>&times;</span>
                    </div>
                    <div onClick={ ( e ) => e.stopPropagation() } onWheel={ handleWheel }>
                        <img
                            src={ fileUrl }
                            alt={ fileName }
                            className="rounded shadow max-h-screen max-w-full transition-transform"
                            style={ { transform: `scale(${ scale })` } }
                        />
                    </div>
                </div>
            ) }
        </>
    );
}