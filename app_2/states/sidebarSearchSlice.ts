import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarSearchState
{
    query: string;
}

const initialState: SidebarSearchState = {
    query: "",
};

const sidebarSearchSlice = createSlice( {
    name: "sidebarSearch",
    initialState,
    reducers: {
        setSidebarSearchQuery: ( state, action: PayloadAction<string> ) =>
        {
            state.query = action.payload;
        },
        clearSidebarSearch: ( state ) =>
        {
            state.query = "";
        },
    },
} );

export const { setSidebarSearchQuery, clearSidebarSearch } = sidebarSearchSlice.actions;
export default sidebarSearchSlice.reducer;
