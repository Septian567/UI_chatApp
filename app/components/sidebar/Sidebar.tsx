"use client";

import { useEffect, useState, useRef } from "react";
import { Phone, Mail, User, LogOut } from "react-feather";
import HorizontalMenu from "./HorizontalMenu";
import MainMenu from "./MainMenu";
import Resizer from "./Resizer";
import Header from "./Header";
import SearchBox from "./SearchBox";
import { useSidebarState } from "../../hooks/useSidebarState";
import { useSidebarData } from "../../hooks/useSidebarData";
import HorizontalMenuContent from "./HorizontalMenuContent";
import { useDispatch } from "react-redux";
import { setContacts } from "../../states/contactsSlice";
import { getContacts } from "../../utils/contactApiUtils";

interface SidebarProps
{
  onMainMenuClick: ( menu: string ) => void;
  width: number | string;
  onResize?: ( newWidth: number ) => void;
  isResizable?: boolean;
}

const MAIN_MENU_ITEMS = [
  { label: "Contacts", icon: <Phone size={ 18 } />, key: "contacts" },
  { label: "Chat", icon: <Mail size={ 18 } />, key: "chat" },
  { label: "Profile", icon: <User size={ 18 } />, key: "profile" },
  { label: "Logout", icon: <LogOut size={ 18 } />, key: null },
];

export default function Sidebar( { onMainMenuClick, width, onResize, isResizable = true }: SidebarProps )
{
  const dispatch = useDispatch();

  const {
    isMainMenuVisible,
    toggleMainMenu,
    activeHorizontalMenu,
    updateHorizontalMenu,
    HORIZONTAL_MENU_LABELS,
  } = useSidebarState();

  const {
    contacts,
    setSearchQuery,
    handleAliasSave,
    filteredUsers,
    filteredContacts,
    setActiveContact,
  } = useSidebarData();

  const isDesktop = typeof width === "number";
  const sidebarRef = useRef<HTMLDivElement>( null );

  // --- FIX HYDRATION ---
  const [isClient, setIsClient] = useState( false );
  useEffect( () => setIsClient( true ), [] );

  // --- Fetch contacts terbaru saat mount ---
  useEffect( () =>
  {
    const fetchContacts = async () =>
    {
      try
      {
        const token = localStorage.getItem( "token" ) || "";
        const data = await getContacts( token );
        const mapped = data.map( ( c: any ) => ( {
          email: c.email,
          alias: c.alias?.trim() || "",
          avatar_url: c.avatar_url || "",
          contact_id: c.contact_id || c.contactId || c.id,
        } ) );
        dispatch( setContacts( mapped ) );
      } catch ( err )
      {
        console.error( "Failed to fetch contacts:", err );
      }
    };

    fetchContacts();
  }, [dispatch] );

  // --- Fungsi klik kontak ---
  const handleContactClick = ( contact: typeof contacts[0] ) =>
  {
    setActiveContact( contact ); // set activeContact di Redux
    onMainMenuClick( "chat" ); // buka tab chat
  };

  if ( !isClient )
  {
    return (
      <aside
        className="bg-transparent text-black h-screen p-4 flex flex-col relative shrink-0 border-r border-gray-300 overflow-x-hidden"
        style={ { width: typeof width === "number" ? `${ width }px` : width } }
      >
        <div className="text-gray-400 text-sm p-4">Loading...</div>
      </aside>
    );
  }

  return (
    <aside
      ref={ sidebarRef }
      className="bg-transparent text-black h-screen p-4 flex flex-col relative shrink-0 border-r border-gray-300 overflow-x-hidden"
      style={ { width: typeof width === "number" ? `${ width }px` : width, zIndex: 40 } }
    >
      {/* Konten sidebar */ }
      { isDesktop && isResizable && <Resizer onResize={ onResize } /> }

      {/* Bagian Atas */ }
      <div className="flex flex-col gap-2">
        <Header isExpanded={ isMainMenuVisible } onToggle={ toggleMainMenu } />
        { isMainMenuVisible && <MainMenu items={ MAIN_MENU_ITEMS } onClick={ onMainMenuClick } /> }
        <SearchBox onSearch={ setSearchQuery } />
        <HorizontalMenu
          active={ activeHorizontalMenu }
          onChange={ updateHorizontalMenu }
          items={ HORIZONTAL_MENU_LABELS }
        />
      </div>

      {/* Bagian Bawah */ }
      <div className="flex-1 overflow-y-auto overflow-x-hidden mt-2 p-2 text-sm">
        { contacts.length === 0 ? (
          <p className="text-gray-400 text-sm">Loading contacts...</p>
        ) : (
          <HorizontalMenuContent
            activeMenu={ activeHorizontalMenu }
            contacts={ contacts }
            filteredUsers={ filteredUsers }
            filteredContacts={ filteredContacts }
            handleAliasSave={ handleAliasSave }
            setActiveContact={ handleContactClick }
            onMainMenuClick={ onMainMenuClick }
          />
        ) }
      </div>
    </aside>
  );
}
