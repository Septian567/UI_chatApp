// utils/getChatHistoryApi.ts
import axios from "axios";

export interface Attachment
{
    media_type: string;   // contoh: "image", "audio", "video", "file"
    media_url: string;    // contoh: "https://chat-app-bucket.../file.png"
    media_name: string;   // contoh: "sample.png"
    media_size: number;   // ukuran file dalam byte
}

export interface ChatHistoryItem
{
    message_id: string;
    from_user_id: string;
    to_user_id: string;
    message_text: string;
    is_deleted: boolean;
    is_visible: boolean;
    hidden_at: string | null;
    created_at: string;
    read_at: string | null;
    updated_at: string;
    attachments: Attachment[];
}

export async function getChatHistory( contactId?: string ): Promise<ChatHistoryItem[]>
{
    if ( !contactId )
    {
        console.warn( "DEBUG: contactId tidak ada, skip fetch chat history." );
        return []; // ❌ langsung return array kosong, tidak error
    }

    try
    {
        const token = localStorage.getItem( "token" );
        const userId = localStorage.getItem( "userId" );

        if ( !token || !userId )
        {
            throw new Error( "Token atau userId tidak ditemukan. Pastikan user sudah login." );
        }

        const response = await axios.get<ChatHistoryItem[]>(
            `http://localhost:5000/messages/${ userId }/with/${ contactId }`,
            {
                headers: {
                    Authorization: `Bearer ${ token }`,
                },
            }
        );

        console.log( "DEBUG: getChatHistory response:", response.data );
        return response.data;
    } catch ( err: any )
    {
        let message = "Unknown error";
        if ( err instanceof Error )
        {
            message = err.message;
        } else if ( err?.response?.data?.message )
        {
            message = err.response.data.message;
        } else if ( err?.response?.statusText )
        {
            message = `HTTP ${ err.response.status }: ${ err.response.statusText }`;
        }

       
        return []; 
    }
}
