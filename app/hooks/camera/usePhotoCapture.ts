export function usePhotoCapture( videoRef: React.RefObject<HTMLVideoElement | null> )
{
    const takePhoto = ( onCapture: ( file: File ) => void ) =>
    {
        if ( !videoRef.current ) return;
        const v = videoRef.current;
        const canvas = document.createElement( "canvas" );
        canvas.width = v.videoWidth || 1280;
        canvas.height = v.videoHeight || 720;
        const ctx = canvas.getContext( "2d" );
        ctx?.drawImage( v, 0, 0, canvas.width, canvas.height );
        canvas.toBlob(
            ( blob ) =>
            {
                if ( !blob ) return;
                const file = new File( [blob], `photo-${ Date.now() }.jpg`, {
                    type: "image/jpeg",
                } );
                onCapture( file );
            },
            "image/jpeg"
        );
    };

    return { takePhoto };
}
