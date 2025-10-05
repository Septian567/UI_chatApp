"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Sidebar from "./components/sidebar/Sidebar";
import { useSidebarLayout } from "./hooks/useSidebarLayout";
import { useSidebarNavigation } from "./hooks/useSidebarNavigation";
import { useHomePage } from "./hooks/useHomePage";
import ChatPage from "./components/chat/ChatPage";
import ContactsPage from "./components/contacts/ContactsPage";
import ProfilePage from "./components/profile/ProfilePage";

export default function Home()
{
  const router = useRouter();
  const [loading, setLoading] = useState( true );

  const {
    mainContent,
    isMobile,
    showSidebarOnMobile,
    computeSidebarWidth,
    setShowSidebarOnMobile,
    sidebarWidth,
    handleResize,
  } = useSidebarLayout();

  const { handleMainMenuClick } = useSidebarNavigation( isMobile );

  const {
    selectedContact,
    setSelectedContact,
    hydrated,
    showHomePage,
    setShowHomePage,
    commonProps,
  } = useHomePage( isMobile, setShowSidebarOnMobile );

  useEffect( () =>
  {
    const token = localStorage.getItem( "token" );
    if ( !token )
    {
      router.push( "/login" );
    } else
    {
      setLoading( false );
    }
  }, [router] );

  if ( !hydrated || loading ) return null;

  const handleMenuClick = ( menu: string ) =>
  {
    setShowHomePage( false );
    handleMainMenuClick( menu );
  };

  const handleContactClick = ( aliasOrName: string ) =>
  {
    setSelectedContact( aliasOrName );
    setShowHomePage( false );
    handleMainMenuClick( "chat" );
  };

  const renderContent = () =>
  {
    if ( showHomePage )
    {
      return (
        <main className="flex-1 flex flex-col items-center justify-center bg-white relative">
          { isMobile && (
            <button
              onClick={ () => setShowSidebarOnMobile( true ) }
              className="absolute top-4 left-4 flex items-center text-gray-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>menu</span>
            </button>
          ) }

          <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 2H4a2 2 0 00-2 2v14l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
            </svg>
          </div>

          <p className="text-gray-700 text-center text-lg mt-2">
            masih di proses
          </p>
        </main>
      );
    }

    switch ( mainContent )
    {
      case "chat":
        return (
          <ChatPage
            { ...commonProps }
            sidebarWidth={ isMobile ? 0 : computeSidebarWidth() }
            contactName={ selectedContact || "Bento" }
          />
        );
      case "contacts":
        return <ContactsPage { ...commonProps } onContactClick={ handleContactClick } />;
      case "profile":
        return <ProfilePage { ...commonProps } />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      { ( !isMobile || showSidebarOnMobile ) && (
        <Sidebar
          onMainMenuClick={ handleMenuClick }
          width={ isMobile ? "100%" : sidebarWidth }
          onResize={ isMobile ? undefined : handleResize }
          isResizable={ !isMobile }
        />
      ) }
      <div className="flex-1 flex">{ renderContent() }</div>
    </div>
  );
}