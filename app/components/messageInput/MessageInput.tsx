import { useState } from "react";
import { Camera as CameraIcon } from "lucide-react";
import { useMessageInput } from "../../hooks/useMessageInput";
import { EditBanner } from "./EditBanner";
import { SelectedFilePreview } from "./SelectedFilePreview";
import { FileInputButton } from "./FileInputButton";
import { MessageTextarea } from "./MessageTextarea";
import { EditActions } from "./EditActions";
import SendActions from "./SendActions";
import CameraModal from "../cameraModal/CameraModal";

interface MessageInputProps
{
    onSend: ( message: string ) => void;
    onSendAudio?: ( audioBlob: Blob ) => void;
    onSendFile?: ( file: File, caption?: string ) => void;
    isEditing?: boolean;
    initialEditValue?: string;
    onCancelEdit?: () => void;
    onSubmitEdit?: ( editedMessage: string ) => void;
}

export default function MessageInput( {
    onSend,
    onSendAudio,
    onSendFile,
    isEditing = false,
    initialEditValue = "",
    onCancelEdit,
    onSubmitEdit,
}: MessageInputProps )
{
    const {
        message,
        setMessage,
        textareaRef,
        handleSend,
        handleKeyDown,
        handleFileChange,
        selectedFile,
        cancelFile,
    } = useMessageInput( {
        isEditing,
        initialEditValue,
        onSend,
        onSubmitEdit,
        onCancelEdit,
        onSendFile,
    } );

    const [isCameraModalOpen, setCameraModalOpen] = useState( false );
    const [isRecording, setIsRecording] = useState( false ); // NEW

    return (
        <>
            {/* Modal Kamera */ }
            <CameraModal
                isOpen={ isCameraModalOpen }
                onClose={ () => setCameraModalOpen( false ) }
                onCapturePhoto={ ( file, caption ) =>
                {
                    if ( onSendFile ) onSendFile( file, caption );
                } }
                onCaptureVideo={ ( file, caption ) =>
                {
                    if ( onSendFile ) onSendFile( file, caption );
                } }
            />

            {/* Input area */ }
            <div className="border-t border-black py-2 bg-white w-full px-2">
                { isEditing && <EditBanner initialEditValue={ initialEditValue } /> }
                { selectedFile && (
                    <SelectedFilePreview file={ selectedFile } onCancel={ cancelFile } />
                ) }

                <div className="flex items-end gap-3">
                    <FileInputButton onChange={ handleFileChange } />

                    <MessageTextarea
                        value={ message }
                        onChange={ setMessage }
                        onKeyDown={ handleKeyDown }
                        placeholder={
                            isEditing
                                ? "Edit pesan..."
                                : selectedFile
                                    ? "Tulis caption..."
                                    : "Tulis pesan..."
                        }
                        textareaRef={ textareaRef }
                    />

                    { isEditing ? (
                        <EditActions onCancel={ onCancelEdit! } onSave={ handleSend } />
                    ) : (
                        <div className="flex items-center gap-1">
                            {/* Kamera muncul hanya kalau tidak sedang rekam */ }
                            { !isRecording && (
                                <button
                                    onClick={ () => setCameraModalOpen( true ) }
                                    className="p-2 hover:bg-gray-200 rounded-full"
                                    aria-label="Open camera"
                                >
                                    <CameraIcon size={ 20 } />
                                </button>
                            ) }

                            <SendActions
                                onSend={ handleSend }
                                onSendAudio={ onSendAudio }
                                showAudioRecorder={ message.trim() === "" && !selectedFile }
                                onRecordingChange={ setIsRecording } // NEW
                            />
                        </div>
                    ) }
                </div>
            </div>
        </>
    );
}
