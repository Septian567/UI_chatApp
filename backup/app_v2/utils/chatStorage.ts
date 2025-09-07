export interface ChatMessage
{
    text?: string;
    audioUrl?: string;
    fileUrl?: string;
    caption?: string;
    time: string;
    side: "kiri" | "kanan";
    isSoftDeleted?: boolean;
}

export const CHAT_STORAGE_KEY = ( contactId: string ) => `chat_${ contactId }`;

export const loadChatFromStorage = ( contactId: string ) =>
{
    if ( typeof window === "undefined" ) return [];
    const data = localStorage.getItem( CHAT_STORAGE_KEY( contactId ) );
    return data ? JSON.parse( data ) : [];
};

export const saveChatToStorage = ( contactId: string, messages: any[] ) =>
{
    if ( typeof window === "undefined" ) return;
    localStorage.setItem( CHAT_STORAGE_KEY( contactId ), JSON.stringify( messages ) );
};

