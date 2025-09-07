import { useCallback } from "react";
import { UseCameraControllerResult } from "./useCameraController";

interface CameraControlsOptions
{
    camera: UseCameraControllerResult;
    onClose: () => void;
}

export function useCameraControls( { camera, onClose }: CameraControlsOptions )
{
    const { mode, isRecording, handlePhotoClick, handleVideoClick } = camera;

    const handlePhoto = useCallback( async () =>
    {
        const file = await handlePhotoClick();
        if ( file ) onClose();
    }, [handlePhotoClick, onClose] );

    const handleVideo = useCallback( async () =>
    {
        const file = await handleVideoClick();
        if ( file ) onClose();
    }, [handleVideoClick, onClose] );

    return { handlePhoto, handleVideo, isRecording, mode };
}
