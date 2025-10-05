"use client";

import { useEffect, useRef, useCallback } from "react";

interface ResizerProps
{
    onResize?: ( newWidth: number ) => void;
}

export default function Resizer( { onResize }: ResizerProps )
{
    const isResizing = useRef( false );
    const animationFrameId = useRef<number | null>( null );

    const handleResize = useCallback( ( newWidth: number ) =>
    {
        if ( animationFrameId.current )
        {
            cancelAnimationFrame( animationFrameId.current );
        }

        animationFrameId.current = requestAnimationFrame( () =>
        {
            onResize?.( newWidth );
        } );
    }, [onResize] );

    useEffect( () =>
    {
        const handleMouseDown = ( e: MouseEvent ) =>
        {
            e.preventDefault();
            e.stopPropagation();
            isResizing.current = true;

            const startX = e.clientX;
            const startWidth = document.querySelector( 'aside' )?.getBoundingClientRect().width || 0;
            document.body.classList.add( 'resizing' );

            const handleMouseMove = ( moveEvent: MouseEvent ) =>
            {
                if ( !isResizing.current ) return;

                moveEvent.preventDefault();
                moveEvent.stopPropagation();

                const newWidth = Math.max( 200, startWidth + ( moveEvent.clientX - startX ) );
                handleResize( newWidth );
            };

            const handleMouseUp = () =>
            {
                isResizing.current = false;
                document.removeEventListener( "mousemove", handleMouseMove );
                document.removeEventListener( "mouseup", handleMouseUp );
                document.removeEventListener( "mouseleave", handleMouseUp );
                document.body.classList.remove( 'resizing' );
                
                if ( animationFrameId.current )
                {
                    cancelAnimationFrame( animationFrameId.current );
                }
            };

            document.addEventListener( "mousemove", handleMouseMove );
            document.addEventListener( "mouseup", handleMouseUp );
            document.addEventListener( "mouseleave", handleMouseUp );
        };

        const resizer = document.getElementById( "resizer" );
        if ( resizer )
        {
            resizer.addEventListener( "mousedown", handleMouseDown as EventListener );
            resizer.addEventListener( "touchstart", handleMouseDown as EventListener, { passive: false } );
        }

        return () =>
        {
            if ( resizer )
            {
                resizer.removeEventListener( "mousedown", handleMouseDown as EventListener );
                resizer.removeEventListener( "touchstart", handleMouseDown as EventListener );
            }

            if ( animationFrameId.current )
            {
                cancelAnimationFrame( animationFrameId.current );
            }
        };
    }, [handleResize] );

    return (
        <div
            id="resizer"
            className="absolute top-0 right-0 w-2 h-full cursor-col-resize z-50"
            style={ {
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
            } }
        />
    );
}