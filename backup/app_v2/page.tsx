"use client";

import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import { useSidebarLayout } from "./hooks/useSidebarLayout";
import { useSidebarNavigation } from "./hooks/useSidebarNavigation";
import ChatPage from "./components/chat/ChatPage";
import ContactsPage from "./components/contacts/ContactsPage";
import ProfilePage from "./components/profile/ProfilePage";

export default function Home()
{
  const {
    mainContent,
    isMobile,
    showSidebarOnMobile,
    computeSidebarWidth,
    setShowSidebarOnMobile,
  } = useSidebarLayout();

  const { handleMainMenuClick } = useSidebarNavigation( isMobile );

  // Tambahan: simpan alias/nama kontak yang dipilih
  const [selectedContact, setSelectedContact] = useState<string | null>( null );

  const renderMainContent = () =>
  {
    const commonProps = {
      isMobile,
      onBack: () => setShowSidebarOnMobile( true ),
    };

    switch ( mainContent )
    {
      case "chat":
        return (
          <ChatPage
            { ...commonProps }
            sidebarWidth={ isMobile ? 0 : computeSidebarWidth() }
            contactName={ selectedContact || "Bento" } // default Bento
          />
        );
      case "contacts":
        return (
          <ContactsPage
            { ...commonProps }
            onContactClick={ ( aliasOrName: string ) =>
            {
              setSelectedContact( aliasOrName ); // simpan alias kontak
              handleMainMenuClick( "chat" ); // langsung pindah ke chat
            } }
          />
        );
      case "profile":
        return <ProfilePage { ...commonProps } />;
      default:
        return (
          <main className="flex-1 p-6 overflow-auto bg-white">
            <p className="text-gray-700">Silakan pilih menu dari sidebar.</p>
          </main>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      { ( !isMobile || showSidebarOnMobile ) && (
        <Sidebar
          onMainMenuClick={ handleMainMenuClick }
          width={ isMobile ? "100%" : computeSidebarWidth() }
        />
      ) }

      { ( !isMobile || !showSidebarOnMobile ) && renderMainContent() }
    </div>
  );
}
