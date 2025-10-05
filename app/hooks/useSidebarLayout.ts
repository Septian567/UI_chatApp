"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import
    {
        setSidebarWidth,
        setIsMobile,
        setShowSidebarOnMobile,
        loadLayoutFromStorage,
    } from "../states/layoutSlice";
import { RootState } from "../states";
import { BREAKPOINTS, MAX_SIDEBAR_WIDTH, MIN_SIDEBAR_WIDTH } from "../lib/constants";
import { useSidebarNavigation } from "./useSidebarNavigation";

export function useSidebarLayout()
{
    const dispatch = useDispatch();

    const {
        mainContent,
        sidebarWidth,
        isMobile,
        showSidebarOnMobile,
    } = useSelector( ( state: RootState ) => state.layout );

    const { handleMainMenuClick } = useSidebarNavigation( isMobile );

    const [hasMounted, setHasMounted] = useState( false );

    useEffect( () =>
    {
        setHasMounted( true );
    }, [] );

    useEffect( () =>
    {
        if ( hasMounted )
        {
            dispatch( loadLayoutFromStorage() );
        }
    }, [dispatch, hasMounted] );

    useEffect( () =>
    {
        if ( !hasMounted ) return;

        const updateIsMobile = () =>
        {
            dispatch( setIsMobile( window.innerWidth <= BREAKPOINTS.MOBILE_MAX_WIDTH ) );
        };

        updateIsMobile();
        window.addEventListener( "resize", updateIsMobile );
        return () => window.removeEventListener( "resize", updateIsMobile );
    }, [dispatch, hasMounted] );

    const handleResize = useCallback( ( newWidth: number ) =>
    {
        const calculatedWidth = Math.min(
            Math.max( MIN_SIDEBAR_WIDTH, newWidth ),
            MAX_SIDEBAR_WIDTH
        );
        dispatch( setSidebarWidth( calculatedWidth ) );
    }, [dispatch] );

    const computeSidebarWidth = useCallback( () =>
    {
        if ( !hasMounted ) return sidebarWidth;

        const width = window.innerWidth;

        if ( BREAKPOINTS.SPECIAL_WIDTHS.includes( width ) ) return 250;
        if ( width <= 540 ) return 220;

        return sidebarWidth;
    }, [sidebarWidth, hasMounted] );

    if ( !hasMounted )
    {
        return {
            mainContent: "",
            sidebarWidth: 260,
            isMobile: false,
            showSidebarOnMobile: true,
            handleMainMenuClick: () => { },
            computeSidebarWidth: () => 260,
            setShowSidebarOnMobile: () => { },
            handleResize: () => { },
        };
    }

    return {
        mainContent,
        sidebarWidth,
        isMobile,
        showSidebarOnMobile,
        handleMainMenuClick,
        computeSidebarWidth,
        handleResize,
        setShowSidebarOnMobile: ( val: boolean ) => dispatch( setShowSidebarOnMobile( val ) ),
    };
}