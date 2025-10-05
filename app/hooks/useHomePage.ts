"use client";

import { useState, useEffect } from "react";

export function useHomePage( isMobile: boolean, setShowSidebarOnMobile: ( value: boolean ) => void )
{
    const [selectedContact, setSelectedContact] = useState<string | null>( null );
    const [isClient, setIsClient] = useState( false );
    const [hydrated, setHydrated] = useState( false );
    const [showHomePage, setShowHomePage] = useState( true );

    // Set isClient ketika komponen mount
    useEffect( () =>
    {
        setIsClient( true );
    }, [] );

    // Delay render sampai state siap
    useEffect( () =>
    {
        if ( isClient && isMobile !== undefined )
        {
            setHydrated( true );
        }
    }, [isClient, isMobile] );

    // Props umum untuk child
    const commonProps = {
        isMobile,
        onBack: () => setShowSidebarOnMobile( true ),
    };

    return {
        selectedContact,
        setSelectedContact,
        hydrated,
        showHomePage,
        setShowHomePage,
        commonProps,
    };
}
