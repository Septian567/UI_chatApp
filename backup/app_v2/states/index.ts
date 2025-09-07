import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";
import layoutReducer from "./layoutSlice";
import usersReducer from "./usersSlice";
import contactsReducer from "./contactsSlice";
import sidebarSearchReducer from "./sidebarSearchSlice";
import activeChatReducer from "./activeChatSlice";
import chatReducer from "./chatSlice";

export const store = configureStore( {
    reducer: {
        sidebar: sidebarReducer,
        layout: layoutReducer,
        users: usersReducer,
        contacts: contactsReducer,
        sidebarSearch: sidebarSearchReducer,
        activeChat: activeChatReducer,
        chat: chatReducer,
    },
} );

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
