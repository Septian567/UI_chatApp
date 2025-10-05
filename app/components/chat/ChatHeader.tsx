"use client";

import { ArrowLeft, User } from "react-feather";

interface ChatHeaderProps
{
    isMobile: boolean;
    onBack: () => void;
    contactName?: string;
    contactId?: string;
    avatarUrl?: string; // ✅ prop baru
}

export default function ChatHeader( {
    isMobile,
    onBack,
    contactName,
    avatarUrl,
}: ChatHeaderProps )
{
    return (
        <div className="border-b border-black">
            <div className="flex items-center justify-between pl-6 pr-4 py-3 w-full">
                <div className="flex items-center gap-3">
                    { isMobile && (
                        <button onClick={ onBack } className="text-black">
                            <ArrowLeft size={ 20 } />
                        </button>
                    ) }
                    <div className="flex items-center gap-3">
                        {/* ✅ Kalau ada avatarUrl tampilkan foto, kalau tidak tampilkan ikon default */ }
                        { avatarUrl ? (
                            <img
                                src={ avatarUrl }
                                alt={ contactName || "Kontak" }
                                className="w-10 h-10 rounded-full border border-black object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white">
                                <User size={ 20 } className="text-black" />
                            </div>
                        ) }
                        <h2 className="text-lg font-semibold text-black">
                            { contactName?.trim() || "Bento" }
                        </h2>
                    </div>
                </div>

                {/* Bagian kanan header (kosong sekarang) */ }
                <div />
            </div>
        </div>
    );
}
