import { useRef, useState, useCallback, useEffect } from "react";

export function useVideoRecorder( streamRef: React.RefObject<MediaStream | null> )
{
    const recorderRef = useRef<MediaRecorder | null>( null );
    const chunksRef = useRef<Blob[]>( [] );
    const timerRef = useRef<NodeJS.Timeout | null>( null );
    const startTimeRef = useRef<number | null>( null );

    const [isRecording, setIsRecording] = useState( false );
    const [previewUrl, setPreviewUrl] = useState<string | null>( null );
    const [duration, setDuration] = useState<number>( 0 ); // dalam detik

    // 🎬 Mulai merekam
    const startRecording = useCallback( () =>
    {
        if ( !streamRef.current ) return;

        chunksRef.current = [];
        const recorder = new MediaRecorder( streamRef.current );
        recorderRef.current = recorder;

        recorder.ondataavailable = ( e ) =>
        {
            if ( e.data.size > 0 )
            {
                chunksRef.current.push( e.data );
            }
        };

        setIsRecording( true );
        setPreviewUrl( null ); // reset preview saat mulai rekam
        setDuration( 0 );
        startTimeRef.current = Date.now();

        // hitung durasi setiap 1 detik
        timerRef.current = setInterval( () =>
        {
            if ( startTimeRef.current )
            {
                const elapsed = Math.floor( ( Date.now() - startTimeRef.current ) / 1000 );
                setDuration( elapsed );
            }
        }, 1000 );

        recorder.start();
    }, [streamRef] );

    // 🛑 Stop + hasilkan file + preview
    const stopRecording = useCallback( async (): Promise<File | null> =>
    {
        return new Promise( ( resolve ) =>
        {
            const recorder = recorderRef.current;
            if ( !recorder ) return resolve( null );

            recorder.onstop = () =>
            {
                const blob = new Blob( chunksRef.current, { type: "video/webm" } );
                const file = new File( [blob], `video-${ Date.now() }.webm`, {
                    type: "video/webm",
                } );

                // buat preview URL
                const url = URL.createObjectURL( blob );
                setPreviewUrl( url );

                setIsRecording( false );

                // hentikan timer durasi
                if ( timerRef.current )
                {
                    clearInterval( timerRef.current );
                    timerRef.current = null;
                }

                resolve( file );
            };

            recorder.stop();
        } );
    }, [] );

    // optional: bersihkan objectURL kalau tidak dipakai lagi
    const clearPreview = useCallback( () =>
    {
        if ( previewUrl )
        {
            URL.revokeObjectURL( previewUrl );
            setPreviewUrl( null );
        }
    }, [previewUrl] );

    // bersihkan interval kalau unmount
    useEffect( () =>
    {
        return () =>
        {
            if ( timerRef.current )
            {
                clearInterval( timerRef.current );
            }
        };
    }, [] );

    return {
        isRecording,
        startRecording,
        stopRecording,
        previewUrl,
        clearPreview,
        duration,
    };
}
