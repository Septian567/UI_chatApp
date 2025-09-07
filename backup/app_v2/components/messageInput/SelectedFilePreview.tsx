import { X } from "react-feather";
import { useMemo } from "react";

interface SelectedFilePreviewProps
{
    file: File;
    onCancel: () => void;
}

export function SelectedFilePreview( { file, onCancel }: SelectedFilePreviewProps )
{
    const isImage = file.type.startsWith( "image/" );
    const isVideo = file.type.startsWith( "video/" );

    // Buat URL preview untuk gambar / video
    const previewUrl = useMemo( () =>
    {
        if ( isImage || isVideo )
        {
            return URL.createObjectURL( file );
        }
        return null;
    }, [file, isImage, isVideo] );

    return (
        <div className="border p-2 mb-2 rounded bg-gray-50 shadow-sm">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700 truncate max-w-[200px]">
                    { isImage
                        ? "🖼️ Gambar"
                        : isVideo
                            ? "🎬 Video"
                            : `📎 ${ file.name }` }
                </span>
                <button
                    onClick={ onCancel }
                    className="text-gray-500 hover:text-red-600"
                >
                    <X size={ 16 } />
                </button>
            </div>

            {/* Jika file adalah gambar, tampilkan thumbnail */ }
            { isImage && previewUrl && (
                <div className="mt-2">
                    <img
                        src={ previewUrl }
                        alt={ file.name }
                        className="max-h-40 rounded border object-contain"
                    />
                </div>
            ) }

            {/* Jika file adalah video, tampilkan player */ }
            { isVideo && previewUrl && (
                <div className="mt-2">
                    <video
                        src={ previewUrl }
                        controls
                        className="max-h-40 rounded border object-contain"
                    />
                </div>
            ) }
        </div>
    );
}
