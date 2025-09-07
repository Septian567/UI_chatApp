import { ChatMessage } from "./useMessageState";

export function useMessageSending(
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
)
{
    const getTime = () =>
    {
        const now = new Date();
        const hours = now.getHours().toString().padStart( 2, "0" );
        const minutes = now.getMinutes().toString().padStart( 2, "0" );
        return `${ hours }.${ minutes }`;
    };

    const handleSendMessage = ( message: string ) =>
    {
        const newMessage: ChatMessage = { text: message, time: getTime() };
        setMessages( ( prev ) => [...prev, newMessage] );
    };

    const handleSendAudio = async ( audioBlob: Blob ) =>
    {
        const audioUrl = URL.createObjectURL( audioBlob );
        const audio = new Audio();
        audio.src = audioUrl;

        await new Promise<void>( ( resolve ) =>
        {
            audio.addEventListener( "loadedmetadata", () => resolve() );
        } );

        const newMessage: ChatMessage = { audioUrl, time: getTime() };
        setMessages( ( prev ) => [...prev, newMessage] );
    };

    const handleSendFile = ( file: File, caption?: string ) =>
    {
        const fileUrl = URL.createObjectURL( file );
        const newMessage: ChatMessage = {
            fileUrl,
            fileName: file.name,
            caption: caption?.trim() || undefined,
            time: getTime(),
        };
        setMessages( ( prev ) => [...prev, newMessage] );
    };

    return { handleSendMessage, handleSendAudio, handleSendFile };
}
