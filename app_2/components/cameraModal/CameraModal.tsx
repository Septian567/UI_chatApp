import { useState } from "react";
import { useCameraController } from "../../hooks/camera";
import { CameraHeader } from "./CameraHeader";
import { CameraView } from "./CameraView";
import { CameraControls } from "./CameraControls";
import { CameraPreview } from "./CameraPreview";

interface CameraModalProps
{
    isOpen: boolean;
    onClose: () => void;
    onCapturePhoto?: ( file: File, caption?: string ) => void;
    onCaptureVideo?: ( file: File, caption?: string ) => void;
}

export default function CameraModal( {
    isOpen,
    onClose,
    onCapturePhoto,
    onCaptureVideo,
}: CameraModalProps )
{
    const {
        videoRef,
        mode,
        isRecording,
        flipCamera,
        handlePhotoClick,
        handleVideoClick,
        restartCamera,
        error,
    } = useCameraController( { isOpen, onClose } );

    const [previewFile, setPreviewFile] = useState<File | null>( null );
    const [previewCaption, setPreviewCaption] = useState( "" );

    if ( !isOpen ) return null;

    // reset preview + caption kalau modal ditutup
    const handleClose = () =>
    {
        setPreviewFile( null );
        setPreviewCaption( "" );
        onClose();
    };

    const handleRetake = async () =>
    {
        setPreviewFile( null );
        setPreviewCaption( "" );
        await restartCamera();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */ }
            <div className="absolute inset-0 bg-black/50" onClick={ handleClose } />
            <div className="relative bg-white rounded-xl w-[550px] max-w-[90vw] shadow-2xl overflow-hidden">
                <CameraHeader mode={ mode } isRecording={ isRecording } onClose={ handleClose } />

                { previewFile ? (
                    <CameraPreview
                        file={ previewFile }
                        caption={ previewCaption }
                        onCaptionChange={ setPreviewCaption }
                        onRetake={ handleRetake }
                        onSend={ ( file, caption ) =>
                        {
                            if ( mode === "photo" && onCapturePhoto ) onCapturePhoto( file, caption );
                            if ( mode === "video" && onCaptureVideo ) onCaptureVideo( file, caption );
                            setPreviewFile( null );
                            setPreviewCaption( "" );
                            handleClose(); // kamera mati hanya saat modal ditutup
                        } }
                    />
                ) : (
                    <>
                        <CameraView videoRef={ videoRef } flipCamera={ flipCamera } error={ error } />
                        <CameraControls
                            mode={ mode }
                            isRecording={ isRecording }
                            handlePhotoClick={ async () =>
                            {
                                const file = await handlePhotoClick();
                                if ( file ) setPreviewFile( file );
                            } }
                            handleVideoClick={ async () =>
                            {
                                const file = await handleVideoClick();
                                if ( file ) setPreviewFile( file );
                            } }
                        />
                    </>
                ) }
            </div>
        </div>
    );
}
