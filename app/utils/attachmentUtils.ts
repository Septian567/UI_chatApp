// utils/attachmentUtils.ts
export function determineAttachmentType( attachment: any ): string
{
    const fileName = attachment.media_name?.toLowerCase() || "";
    const mediaType = attachment.media_type;

    // Prioritas video
    const isVideo =
        ( fileName.endsWith( ".webm" ) && fileName.includes( "video" ) ) ||
        mediaType === "video";

    // Voice note setelah video
    const isVoiceNote =
        fileName.endsWith( ".webm" ) &&
        mediaType === "file" &&
        fileName.includes( "audio" );

    if ( isVideo ) return "video";
    if ( isVoiceNote ) return "voice_note";
    if ( mediaType === "audio" ) return "audio_file";
    if ( mediaType === "image" ) return "image";

    return "file";
}
