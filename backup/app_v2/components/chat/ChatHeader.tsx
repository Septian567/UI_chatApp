"use client";

import { ArrowLeft, User } from "react-feather";
import { useState } from "react";

interface ChatHeaderProps
{
    isMobile: boolean;
    onBack: () => void;
    onChatKiri?: () => void;
    onChatKanan?: () => void;
    contactName?: string; // alias kontak
}

export default function ChatHeader( {
    isMobile,
    onBack,
    onChatKiri,
    onChatKanan,
    contactName,
}: ChatHeaderProps )
{
    const [activeButton, setActiveButton] = useState<"kiri" | "kanan" | null>( null );

    const handleClick = ( side: "kiri" | "kanan" ) =>
    {
        setActiveButton( side );
        if ( side === "kiri" )
        {
            onChatKiri?.();
        } else
        {
            onChatKanan?.();
        }
    };

    return (
        <div className="border-b border-black">
            <div className="flex items-center justify-between pl-6 pr-4 py-3 w-full">
                {/* Tombol kembali (khusus mobile) */ }
                <div className="flex items-center gap-3">
                    { isMobile && (
                        <button onClick={ onBack } className="text-black">
                            <ArrowLeft size={ 20 } />
                        </button>
                    ) }
                    <div className="flex items-center gap-3">
                        {/* Ikon profil */ }
                        <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white">
                            <User size={ 20 } className="text-black" />
                        </div>
                        <h2 className="text-lg font-semibold text-black">
                            { contactName?.trim() || "Bento" }
                        </h2>
                    </div>
                </div>

                {/* Tombol kiri & kanan */ }
                <div className="flex items-center gap-2">
                    <button
                        onClick={ () => handleClick( "kiri" ) }
                        className={ `px-3 py-1 border border-black rounded-lg text-sm font-medium transition 
              ${ activeButton === "kiri"
                                ? "bg-yellow-400 text-white"
                                : "hover:bg-gray-100"
                            }` }
                    >
                        kiri
                    </button>
                    <button
                        onClick={ () => handleClick( "kanan" ) }
                        className={ `px-3 py-1 border border-black rounded-lg text-sm font-medium transition 
              ${ activeButton === "kanan"
                                ? "bg-yellow-400 text-white"
                                : "hover:bg-gray-100"
                            }` }
                    >
                        kanan
                    </button>
                </div>
            </div>
        </div>
    );
}
