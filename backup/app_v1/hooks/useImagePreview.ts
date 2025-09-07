import { useEffect, useState } from "react";

export function useImagePreview()
{
    const [isModalOpen, setIsModalOpen] = useState( false );
    const [scale, setScale] = useState( 1 );

    useEffect( () =>
    {
        const handleKeyDown = ( e: KeyboardEvent ) =>
        {
            if ( e.key === "Escape" ) setIsModalOpen( false );
        };
        document.addEventListener( "keydown", handleKeyDown );
        return () => document.removeEventListener( "keydown", handleKeyDown );
    }, [] );

    const handleWheel = ( e: React.WheelEvent ) =>
    {
        e.preventDefault();
        setScale( ( prev ) => Math.max( 0.5, Math.min( 3, prev + ( e.deltaY > 0 ? -0.1 : 0.1 ) ) ) );
    };

    const openModal = () =>
    {
        setIsModalOpen( true );
        setScale( 1 );
    };

    const closeModal = () => setIsModalOpen( false );

    return {
        isModalOpen,
        scale,
        openModal,
        closeModal,
        handleWheel,
    };
}