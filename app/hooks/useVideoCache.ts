import { useEffect, useState } from "react";

export function useVideoCache( messageId: string, file?: File | null )
{
    const [videoUrl, setVideoUrl] = useState<string | null>( null );

    useEffect( () =>
    {
        let url: string;

        const openDB = async (): Promise<IDBDatabase> =>
        {
            return new Promise( ( resolve, reject ) =>
            {
                const request = indexedDB.open( "ChatVideoDB", 1 );
                request.onupgradeneeded = () =>
                {
                    const db = request.result;
                    db.createObjectStore( "videos" );
                };
                request.onsuccess = () => resolve( request.result );
                request.onerror = () => reject( request.error );
            } );
        };

        const getCachedVideo = async ( db: IDBDatabase ): Promise<Blob | null> =>
        {
            return new Promise( ( resolve ) =>
            {
                const tx = db.transaction( "videos", "readonly" );
                const store = tx.objectStore( "videos" );
                const req = store.get( messageId );
                req.onsuccess = () => resolve( req.result || null );
                req.onerror = () => resolve( null );
            } );
        };

        const cacheVideo = async ( db: IDBDatabase, blob: Blob ) =>
        {
            const tx = db.transaction( "videos", "readwrite" );
            const store = tx.objectStore( "videos" );
            store.put( blob, messageId );
        };

        const loadVideo = async () =>
        {
            const db = await openDB();
            let blob = await getCachedVideo( db );

            if ( !blob && file )
            {
                blob = file;
                await cacheVideo( db, blob );
            }

            if ( blob )
            {
                url = URL.createObjectURL( blob );
                setVideoUrl( url );
            }
        };

        loadVideo();

        return () =>
        {
            if ( url ) URL.revokeObjectURL( url );
        };
    }, [messageId, file] );

    return videoUrl;
}
