// app/hooks/useMapSendMessageResponse.ts
export interface SendMessageResponse
{
    message_id: string;
    message_text: string;
    text: string;
    from_user_id: string;
    to_user_id: string;
    created_at: string;
    updated_at: string | null;
    attachments: {
        mediaType: string;
        mediaUrl: string;
        mediaName: string;
        mediaSize: number;
    }[];
    read_at: string | null;
    is_deleted: boolean;
    deleted_at: string | null;
}

export function useMapSendMessageResponse()
{
    function mapSendMessageResponse( apiResponse: any ): SendMessageResponse
    {
        const mappedAttachments = ( apiResponse.attachments || [] ).map( ( a: any ) =>
        {
            const mediaType = a.mediaType || a.media_type || "file";
            const mediaUrl = a.mediaUrl || a.media_url || "";
            const mediaName = a.mediaName || a.media_name || "";
            const mediaSize = a.mediaSize || a.media_size || 0;

            // Deteksi tipe file berdasarkan ekstensi atau mediaType
            let normalizedMediaType = mediaType.toLowerCase();

            if ( normalizedMediaType === "file" )
            {
                const ext = mediaName.split( "." ).pop()?.toLowerCase();
                if ( ext === "webm" || ext === "mp3" || ext === "wav" ) normalizedMediaType = "audio";
                else if ( ext === "mp4" || ext === "mov" || ext === "avi" ) normalizedMediaType = "video";
                else if ( ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif" ) normalizedMediaType = "image";
            }

            return {
                mediaType: normalizedMediaType,
                mediaUrl,
                mediaName,
                mediaSize,
            };
        } );

        const text = apiResponse.message_text || "";

        return {
            message_id: apiResponse.message_id,
            message_text: apiResponse.message_text,
            text,
            from_user_id: apiResponse.from_user_id,
            to_user_id: apiResponse.to_user_id,
            created_at: apiResponse.created_at,
            updated_at: apiResponse.updated_at || null,
            attachments: mappedAttachments,
            read_at: apiResponse.read_at || null,
            is_deleted: apiResponse.is_deleted || false,
            deleted_at: apiResponse.deleted_at || null,
        };
    }

    return { mapSendMessageResponse };
}
