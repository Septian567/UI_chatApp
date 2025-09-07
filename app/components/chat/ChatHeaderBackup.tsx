"use client";

import { ArrowLeft, User } from "react-feather";
import { useState, useRef } from "react";

interface ChatHeaderProps
{
    isMobile: boolean;
    onBack: () => void;
    onChatKiri?: () => void;
    onChatKanan?: () => void;
}

export default function ChatHeader( {
    isMobile,
    onBack,
    onChatKiri,
    onChatKanan,
}: ChatHeaderProps )
{
    const [activeButton, setActiveButton] = useState<"kiri" | "kanan" | null>(
        null
    );
    const [profileImage, setProfileImage] = useState<string | null>( null );
    const fileInputRef = useRef<HTMLInputElement>( null );

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

    const handleImageChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        const file = e.target.files?.[0];
        if ( file )
        {
            const imageUrl = URL.createObjectURL( file );
            setProfileImage( imageUrl );
        }
    };

    const openFilePicker = () =>
    {
        fileInputRef.current?.click();
    };

    return (
        <div className="border-b border-black">
            <div className="flex items-center justify-between pl-6 pr-4 py-3 w-full">
                {/* Kiri */ }
                <div className="flex items-center gap-3">
                    { isMobile && (
                        <button onClick={ onBack } className="text-black">
                            <ArrowLeft size={ 20 } />
                        </button>
                    ) }
                    <div className="flex items-center gap-3">
                        <div
                            className="relative w-10 h-10 rounded-full border border-black overflow-hidden cursor-pointer"
                            onClick={ openFilePicker }
                            title="Ganti Foto Profil"
                        >
                            { profileImage ? (
                                <img
                                    src={ profileImage }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-white">
                                    <User size={ 20 } className="text-black" />
                                </div>
                            ) }
                            <input
                                type="file"
                                accept="image/*"
                                ref={ fileInputRef }
                                onChange={ handleImageChange }
                                className="hidden"
                            />
                        </div>
                        <h2 className="text-lg font-semibold text-black">Bento</h2>
                    </div>
                </div>

                {/* Kanan */ }
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