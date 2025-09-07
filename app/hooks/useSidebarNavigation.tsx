"use client";

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setMainContent, setShowSidebarOnMobile } from "../states/layoutSlice";

export function useSidebarNavigation( isMobile: boolean )
{
    const dispatch = useDispatch();

    const handleMainMenuClick = useCallback( ( menu: string ) =>
    {
        const validMenus = ["chat", "contacts", "profile"];
        dispatch( setMainContent( validMenus.includes( menu ) ? menu : "" ) );

        if ( isMobile )
        {
            dispatch( setShowSidebarOnMobile( false ) );
        }
    }, [dispatch, isMobile] );

    return { handleMainMenuClick };
}
