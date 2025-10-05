"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, User, Check, ArrowLeft } from "lucide-react";
import { getProfile, updateProfile, UserProfile } from "../../utils/apiUtils";
import { useDispatch } from "react-redux";
import { updateUserAvatar, updateUserName } from "../../states/usersSlice";
import type { AppDispatch } from "../../states";

interface ProfilePageProps
{
    isMobile: boolean;
    onBack: () => void;
}

export default function ProfilePage( { isMobile, onBack }: ProfilePageProps )
{
    const dispatch = useDispatch<AppDispatch>();

    const [profileImage, setProfileImage] = useState<string | null>( null );
    const fileInputRef = useRef<HTMLInputElement>( null );

    const [username, setUsername] = useState<string>( "anonim" );
    const [email, setEmail] = useState<string>( "loading..." );
    const [isEditingName, setIsEditingName] = useState( false );
    const [loading, setLoading] = useState( true );
    const [saving, setSaving] = useState( false );

    // Ambil data profile saat mount
    useEffect( () =>
    {
        const fetchProfile = async () =>
        {
            setLoading( true );
            try
            {
                const response = await getProfile();
                if ( response.success && response.data )
                {
                    const user: UserProfile = response.data;
                    setUsername( user.username ?? "anonim" );
                    setEmail( user.email ?? "tidak tersedia" );
                    setProfileImage( user.avatar_url ?? null );
                } else
                {
                    console.error( response.message );
                    setUsername( "anonim" );
                    setEmail( "tidak tersedia" );
                    setProfileImage( null );
                }
            } catch ( err )
            {
                console.error( "Gagal mengambil profile:", err );
                setUsername( "anonim" );
                setEmail( "tidak tersedia" );
                setProfileImage( null );
            } finally
            {
                setLoading( false );
            }
        };
        fetchProfile();
    }, [] );

    // Update profile API
    const saveProfile = async ( newUsername?: string, avatarFile?: File ) =>
    {
        setSaving( true );
        try
        {
            const response = await updateProfile( {
                username: newUsername ?? username,
                avatar: avatarFile,
            } );

            if ( response.success && response.data )
            {
                const user: UserProfile = response.data;
                const newAvatarUrl = user.avatar_url
                    ? `${ user.avatar_url }?t=${ Date.now() }`
                    : null;

                setUsername( user.username ?? "anonim" );
                setEmail( user.email ?? "tidak tersedia" );
                setProfileImage( newAvatarUrl );

                // 🔹 Dispatch update ke Redux agar ContactsPage langsung update
                if ( user.email )
                {
                    if ( newAvatarUrl )
                    {
                        dispatch( updateUserAvatar( { email: user.email, avatar_url: newAvatarUrl } ) );
                    }
                    if ( user.username )
                    {
                        dispatch( updateUserName( { email: user.email, username: user.username } ) );
                    }
                }
            } else
            {
                alert( response.message || "Gagal update profil" );
            }
        } catch ( err )
        {
            alert( ( err as Error ).message || "Terjadi kesalahan saat update profil" );
        } finally
        {
            setSaving( false );
            setIsEditingName( false );
        }
    };

    const handleFileChange = async ( event: React.ChangeEvent<HTMLInputElement> ) =>
    {
        const file = event.target.files?.[0];
        if ( file )
        {
            const reader = new FileReader();
            reader.onload = () => setProfileImage( reader.result as string );
            reader.readAsDataURL( file );

            // update avatar otomatis
            await saveProfile( undefined, file );
        }
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    if ( loading )
    {
        return (
            <main className="flex-1 flex items-center justify-center bg-gray-50 min-h-screen">
                <p className="text-gray-500">Memuat profil...</p>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col bg-gray-50 min-h-screen">
            <div className="w-full border-b border-gray-300 px-6 py-4 flex items-center">
                { isMobile && (
                    <button onClick={ onBack } className="mr-3 text-black">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                ) }
                <h1 className="text-xl font-bold">Profil Saya</h1>
            </div>

            <div className="flex flex-col items-start p-6">
                <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
                    <div
                        onClick={ handleAvatarClick }
                        className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 cursor-pointer mb-6 group"
                    >
                        { profileImage ? (
                            <img src={ profileImage } alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                        ) }
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <Pencil className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <input
                        ref={ fileInputRef }
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={ handleFileChange }
                        disabled={ saving }
                    />

                    <div className="w-full flex items-center justify-between border-b border-gray-200 py-2">
                        { isEditingName ? (
                            <input
                                type="text"
                                value={ username ?? "" }
                                onChange={ ( e ) => setUsername( e.target.value ) }
                                onBlur={ () => saveProfile( username ) }
                                onKeyDown={ ( e ) => e.key === "Enter" && saveProfile( username ) }
                                autoFocus
                                className="w-full text-gray-800 font-semibold bg-transparent focus:outline-none"
                                disabled={ saving }
                            />
                        ) : (
                            <p className="text-gray-800 font-semibold">{ username ?? "anonim" }</p>
                        ) }
                        { isEditingName ? (
                            <Check
                                className="w-4 h-4 text-green-500 cursor-pointer"
                                onClick={ () => saveProfile( username ) }
                            />
                        ) : (
                            <Pencil
                                className="w-4 h-4 text-gray-400 cursor-pointer"
                                onClick={ () => setIsEditingName( true ) }
                            />
                        ) }
                    </div>

                    <div className="w-full flex flex-col border-b border-gray-200 py-2 mt-4">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{ email ?? "tidak tersedia" }</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
