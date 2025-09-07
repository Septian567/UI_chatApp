import { Phone, Mail, User, LogOut } from "react-feather";

export type HorizontalSubMenu = "user" | "chat" | "contact";

export const MAIN_MENU_ITEMS = [
    { label: "Contacts", icon: <Phone size={ 18} />, key: "contacts" },
{ label: "Chat", icon: <Mail size={ 18 } />, key: "chat" },
{ label: "Profile", icon: <User size={ 18 } />, key: "profile" },
{ label: "Logout", icon: <LogOut size={ 18 } />, key: null },
];

export const HORIZONTAL_MENU_LABELS: HorizontalSubMenu[] = ["user", "contact", "chat"];

export const HORIZONTAL_MENU_CONTENT: Record<HorizontalSubMenu, string> = {
    user: "Sidebar says: welcome to horizontal user.",
    contact: "Sidebar says: these are quick contacts.",
    chat: "Sidebar says: recent sidebar chats.",
};

export const LOCAL_STORAGE_KEYS = {
    MAIN_MENU_VISIBLE: "sidebar:mainMenuVisible",
    HORIZONTAL_MENU: "sidebar:horizontalMenu",
};

export function capitalize( text: string )
{
    return text.charAt( 0 ).toUpperCase() + text.slice( 1 );
}
