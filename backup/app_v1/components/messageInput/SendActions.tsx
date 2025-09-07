import { Send } from "react-feather";
import AudioRecorder from "./VoiceRecorder";

interface SendActionsProps
{
    onSend: () => void;
    onSendAudio?: ( audio: Blob ) => void;
    showAudioRecorder: boolean;
}

export function SendActions( { onSend, onSendAudio, showAudioRecorder }: SendActionsProps )
{
    if ( showAudioRecorder && onSendAudio )
    {
        return <AudioRecorder onSendAudio={ onSendAudio } />;
    }

    return (
        <button className="text-black mr-2" onClick={ onSend }>
            <Send size={ 20 } className="relative top-[-2px]" />
        </button>
    );
}
