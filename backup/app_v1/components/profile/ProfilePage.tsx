import { useState, useRef } from "react";
import { Pencil, User, Check, ArrowLeft } from "lucide-react";

interface ProfilePageProps
{
    isMobile: boolean;
    onBack: () => void;
}

export default function ProfilePage( { isMobile, onBack }: ProfilePageProps )
{
    const [profileImage, setProfileImage] = useState<string | null>( null );
    const fileInputRef = useRef<HTMLInputElement>( null );

    const [username, setUsername] = useState( "anonim" );
    const [email] = useState( "sdm12345dika@gmail.com" ); // email tetap

    const [isEditingName, setIsEditingName] = useState( false );

    const handleFileChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
    {
        const file = event.target.files?.[0];
        if ( file )
        {
            const reader = new FileReader();
            reader.onload = () => setProfileImage( reader.result as string );
            reader.readAsDataURL( file );
        }
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    return (
        <main className="flex-1 flex flex-col bg-gray-50 min-h-screen">
            {/* Header */ }
            <div className="w-full border-b border-gray-300 px-6 py-4 flex items-center">
                { isMobile && (
                    <button onClick={ onBack } className="mr-3 text-black">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                ) }
                <h1 className="text-xl font-bold">Profil Saya</h1>
            </div>

            {/* Konten */ }
            <div className="flex flex-col items-start p-6">
                <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
                    {/* Avatar */ }
                    <div
                        onClick={ handleAvatarClick }
                        className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 cursor-pointer mb-6 group"
                    >
                        { profileImage ? (
                            <img
                                src={ profileImage }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
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
                    />

                    {/* Username */ }
                    <div className="w-full flex items-center justify-between border-b border-gray-200 py-2">
                        { isEditingName ? (
                            <input
                                type="text"
                                value={ username }
                                onChange={ ( e ) => setUsername( e.target.value ) }
                                onBlur={ () => setIsEditingName( false ) }
                                onKeyDown={ ( e ) =>
                                    e.key === "Enter" && setIsEditingName( false )
                                }
                                autoFocus
                                className="w-full text-gray-800 font-semibold bg-transparent focus:outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 font-semibold">
                                { username }
                            </p>
                        ) }
                        { isEditingName ? (
                            <Check
                                className="w-4 h-4 text-green-500 cursor-pointer"
                                onClick={ () => setIsEditingName( false ) }
                            />
                        ) : (
                            <Pencil
                                className="w-4 h-4 text-gray-400 cursor-pointer"
                                onClick={ () => setIsEditingName( true ) }
                            />
                        ) }
                    </div>

                    {/* Email (Read Only) */ }
                    <div className="w-full flex flex-col border-b border-gray-200 py-2 mt-4">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{ email }</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
