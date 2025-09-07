// states/layoutSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState
{
    mainContent: string;
    sidebarWidth: number;
    isMobile: boolean;
    showSidebarOnMobile: boolean;
}

const initialState: LayoutState = {
    mainContent: "",
    sidebarWidth: 280,
    isMobile: false,
    showSidebarOnMobile: false,
};

const layoutSlice = createSlice( {
    name: "layout",
    initialState,
    reducers: {
        setMainContent( state, action: PayloadAction<string> )
        {
            state.mainContent = action.payload;
        },
        setSidebarWidth( state, action: PayloadAction<number> )
        {
            state.sidebarWidth = action.payload;
            localStorage.setItem( "sidebarWidth", action.payload.toString() );
        },
        setIsMobile( state, action: PayloadAction<boolean> )
        {
            state.isMobile = action.payload;
        },
        setShowSidebarOnMobile( state, action: PayloadAction<boolean> )
        {
            state.showSidebarOnMobile = action.payload;
        },
        loadLayoutFromStorage( state )
        {
            if ( typeof window === "undefined" ) return;
            const storedWidth = localStorage.getItem( "sidebarWidth" );
            if ( storedWidth )
            {
                state.sidebarWidth = parseInt( storedWidth, 10 );
            }
        },
    },
} );

export const {
    setMainContent,
    setSidebarWidth,
    setIsMobile,
    setShowSidebarOnMobile,
    loadLayoutFromStorage,
} = layoutSlice.actions;

export default layoutSlice.reducer;
