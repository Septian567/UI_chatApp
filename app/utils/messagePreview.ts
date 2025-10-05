// utils/messagePreview.ts
import { determineAttachmentType } from "./attachmentUtils";

export function getMessagePreview( message: any ): string
{
    if ( message.isDeleted ) return "Pesan telah dihapus";

    // 🔹 Kalau ada teks (caption atau text), langsung tampilkan
    if ( message.text && message.text.trim() !== "" ) return message.text;

    // 🔹 Kalau tidak ada teks, cek attachments
    if ( message.attachments && message.attachments.length > 0 )
    {
        const attachment = message.attachments[0]; // ambil file pertama untuk preview
        const type = determineAttachmentType( attachment );

        switch ( type )
        {
            case "voice_note":
                return "[Audio]";
            case "video":
                return "[Video]";
            case "image":
                return "[Gambar]";
            case "audio_file":
                return "[Audio]";
            default:
                return "[Dokumen]";
        }
    }

    // 🔹 fallback terakhir
    return "[Pesan Kosong]";
}
