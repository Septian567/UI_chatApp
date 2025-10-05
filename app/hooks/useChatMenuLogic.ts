import { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../states";
import { fetchLastMessages, removeLastMessageByContact } from "../states/lastMessagesSlice";
import { deleteConversation } from "../utils/deleteConversationApi";
import { clearMessagesForContact } from "../states/chatSlice";

export function useChatMenuLogic()
{
    const dispatch = useDispatch<AppDispatch>();
    const { data: lastMessages, loading } = useSelector(
        ( state: RootState ) => state.lastMessages
    );
    const contactsList = useSelector( ( state: RootState ) => state.contacts.list );

    const [selectedContact, setSelectedContact] = useState<string | null>( null );
    const [showConfirm, setShowConfirm] = useState( false );
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>( null );
    const menuRef = useRef<HTMLDivElement | null>( null );

    // Map avatar supaya lebih efisien
    const avatarMap = useMemo(
        () =>
            contactsList.reduce( ( acc, c ) =>
            {
                acc[c.contact_id] = c.avatar_url || "";
                return acc;
            }, {} as Record<string, string> ),
        [contactsList]
    );

    // Fetch last messages
    useEffect( () =>
    {
        dispatch( fetchLastMessages() );
    }, [dispatch] );

    // Tutup menu saat klik di luar
    useEffect( () =>
    {
        function handleClickOutside( e: MouseEvent )
        {
            if ( menuRef.current && !menuRef.current.contains( e.target as Node ) )
            {
                setOpenMenuIndex( null );
            }
        }
        if ( openMenuIndex !== null )
        {
            document.addEventListener( "mousedown", handleClickOutside );
        }
        return () => document.removeEventListener( "mousedown", handleClickOutside );
    }, [openMenuIndex] );

    // Hapus percakapan
    const handleClearConversation = async ( contactId: string ) =>
    {
        try
        {
            // 1️⃣ Hapus percakapan di server
            await deleteConversation( contactId );

            // 2️⃣ Hapus dari lastMessages slice (sidebar)
            dispatch( removeLastMessageByContact( contactId ) );

            // 3️⃣ Hapus dari chat slice (ChatPage)
            dispatch( clearMessagesForContact( { contactId } ) );

            // 4️⃣ Unset kontak aktif jika sedang dipilih
            if ( selectedContact === contactId )
            {
                setSelectedContact( null );
            }
        } catch ( err )
        {
            console.error( "Gagal menghapus percakapan:", err );
        } finally
        {
            setShowConfirm( false );
        }
    };

    return {
        lastMessages,
        loading,
        contactsList,
        avatarMap,
        selectedContact,
        setSelectedContact,
        showConfirm,
        setShowConfirm,
        openMenuIndex,
        setOpenMenuIndex,
        menuRef,
        handleClearConversation,
    };
}
