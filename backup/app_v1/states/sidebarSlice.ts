import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type HorizontalSubMenu = "user" | "chat" | "contact";

interface SidebarState
{
    isMainMenuVisible: boolean;
    activeHorizontalMenu: HorizontalSubMenu;
}

const initialState: SidebarState = {
    isMainMenuVisible: false,
    activeHorizontalMenu: "chat",
};

const sidebarSlice = createSlice( {
    name: "sidebar",
    initialState,
    reducers: {
        setMainMenuVisible( state, action: PayloadAction<boolean> )
        {
            state.isMainMenuVisible = action.payload;
            if ( typeof window !== "undefined" )
            {
                localStorage.setItem( "sidebar:mainMenuVisible", action.payload.toString() );
            }
        },
        setActiveHorizontalMenu( state, action: PayloadAction<HorizontalSubMenu> )
        {
            state.activeHorizontalMenu = action.payload;
            if ( typeof window !== "undefined" )
            {
                localStorage.setItem( "sidebar:horizontalMenu", action.payload );
            }
        },
    },
} );

export const { setMainMenuVisible, setActiveHorizontalMenu } = sidebarSlice.actions;

export const HORIZONTAL_MENU_LABELS: HorizontalSubMenu[] = ["user", "contact", "chat"];

export default sidebarSlice.reducer;
