import { useState, useEffect } from "react";
import { CornerUpLeft, SendHorizontal, Pencil } from "lucide-react";

interface CameraPreviewProps
{
    file: File;
    caption?: string;
    onCaptionChange?: ( caption: string ) => void;
    onRetake: () => void;
    onSend: ( file: File, caption?: string ) => void;
}

export function CameraPreview( {
    file,
    caption: initialCaption = "",
    onCaptionChange,
    onRetake,
    onSend,
}: CameraPreviewProps )
{
    const [url, setUrl] = useState<string | null>( null );
    const [caption, setCaption] = useState( initialCaption );
    const [isEditingCaption, setIsEditingCaption] = useState( false );

    useEffect( () =>
    {
        const objectUrl = URL.createObjectURL( file );
        setUrl( objectUrl );

        return () =>
        {
            URL.revokeObjectURL( objectUrl );
            setUrl( null );
        };
    }, [file] );

    const isVideo = file.type.startsWith( "video/" );

    const handleCaptionChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        setCaption( e.target.value );
        if ( onCaptionChange ) onCaptionChange( e.target.value );
    };

    const handleCaptionKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) =>
    {
        if ( e.key === "Enter" )
        {
            e.preventDefault();
            onSend( file, caption );
        }
    };

    return (
        <div className="flex flex-col items-center bg-white rounded-xl shadow-xl p-5 w-[550px] max-w-[90vw]">
            {/* Preview */ }
            { url &&
                ( isVideo ? (
                    <video
                        src={ url }
                        controls
                        className="max-h-[400px] w-auto rounded-lg shadow-md mb-6"
                    />
                ) : (
                    <img
                        src={ url }
                        alt="Preview"
                        className="max-h-[400px] w-auto rounded-lg shadow-md mb-6"
                    />
                ) ) }

            {/* Caption editor */ }
            { isEditingCaption ? (
                <input
                    type="text"
                    value={ caption }
                    onChange={ handleCaptionChange }
                    onKeyDown={ handleCaptionKeyDown }
                    placeholder="Tambahkan caption..."
                    className="w-full border rounded-md p-2 mb-3"
                    autoFocus
                    onBlur={ () => setIsEditingCaption( false ) }
                />
            ) : caption ? (
                <div
                    className="w-full text-gray-800 text-sm mb-3 cursor-text"
                    onClick={ () => setIsEditingCaption( true ) }
                >
                    { caption }
                </div>
            ) : null }

            {/* Bottom actions */ }
            <div className="flex justify-between items-center w-full">
                <button
                    onClick={ onRetake }
                    className="p-2 text-gray-700 hover:text-black"
                    title="Retake"
                >
                    <CornerUpLeft size={ 22 } />
                </button>

                <div className="flex items-center">
                    <button
                        className="p-2 text-gray-700 hover:text-black mr-5"
                        title="Add caption"
                        onClick={ () => setIsEditingCaption( true ) }
                    >
                        <Pencil size={ 22 } />
                    </button>

                    <button
                        onClick={ () => onSend( file, caption ) }
                        className="p-3 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center"
                        title="Send"
                    >
                        <SendHorizontal size={ 22 } />
                    </button>
                </div>
            </div>
        </div>
    );
}
