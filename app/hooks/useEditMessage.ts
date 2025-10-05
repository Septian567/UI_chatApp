// hooks/useEditMessage.ts
"use client";

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { editMessage } from "../utils/editMessageApi";
import { updateMessageForContact } from "../states/chatSlice";
import { useMapSendMessageResponse } from "./useMapSendMessageResponse";

export function useEditMessage(
    contactId: string,
    socket: any,
    editType: "text" | "file" | null,
    handleCancelEdit: () => void
)
{
    const dispatch = useDispatch();
    const { mapSendMessageResponse } = useMapSendMessageResponse();

    const handleSubmitEdit = useCallback(
        async ( messageId: string, editedText: string ) =>
        {
            if ( !messageId ) return;

            try
            {
                const updatedRaw = await editMessage( messageId, editedText );
                const updated = mapSendMessageResponse( updatedRaw );

                const newText = editType === "text" ? updated.message_text : undefined;
                const newCaption = editType === "file" ? updated.message_text : undefined;

                // Update redux state
                dispatch(
                    updateMessageForContact( {
                        contactId,
                        messageId: updated.message_id,
                        newText,
                        newCaption,
                        updatedAt: updated.updated_at ?? undefined,
                    } )
                );

                // Emit realtime update ke server
                if ( socket )
                {
                    socket.emit( "editMessage", {
                        messageId: updated.message_id,
                        newText,
                        newCaption,
                    } );
                }
            } catch ( err )
            {
                console.error( "Gagal edit pesan:", err );
            }

            handleCancelEdit();
        },
        [contactId, dispatch, editType, mapSendMessageResponse, socket, handleCancelEdit]
    );

    return { handleSubmitEdit };
}
