"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import
    {
        setMainMenuVisible,
        setActiveHorizontalMenu,
        HorizontalSubMenu,
        HORIZONTAL_MENU_LABELS,
    } from "../states/sidebarSlice";
import { RootState } from "../states";

export function useSidebarState()
{
    const dispatch = useDispatch();
    const isMainMenuVisible = useSelector( ( state: RootState ) => state.sidebar.isMainMenuVisible );
    const activeHorizontalMenu = useSelector( ( state: RootState ) => state.sidebar.activeHorizontalMenu );

    useEffect( () =>
    {
        if ( typeof window !== "undefined" )
        {
            const storedMainMenu = localStorage.getItem( "sidebar:mainMenuVisible" );
            const storedHorizontal = localStorage.getItem( "sidebar:horizontalMenu" );

            if ( storedMainMenu !== null )
            {
                dispatch( setMainMenuVisible( storedMainMenu === "true" ) );
            }

            if ( storedHorizontal && ["user", "contact", "chat"].includes( storedHorizontal ) )
            {
                dispatch( setActiveHorizontalMenu( storedHorizontal as HorizontalSubMenu ) );
            }
        }
    }, [dispatch] );

    const toggleMainMenu = () =>
    {
        dispatch( setMainMenuVisible( !isMainMenuVisible ) );
    };

    const updateHorizontalMenu = ( menu: HorizontalSubMenu ) =>
    {
        dispatch( setActiveHorizontalMenu( menu ) );
    };

    return {
        isMainMenuVisible,
        toggleMainMenu,
        activeHorizontalMenu,
        updateHorizontalMenu,
        HORIZONTAL_MENU_LABELS,
    };
}
