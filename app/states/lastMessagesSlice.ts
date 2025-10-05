import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getLastMessagesPerChat, LastMessageItem } from "../utils/getLastMessagePerChatApi";

export interface LastMessagesState
{
    data: LastMessageItem[];
    loading: boolean;
    error: string | null;
}

const initialState: LastMessagesState = {
    data: [],
    loading: false,
    error: null,
};

// ✅ Ambil dari API (untuk inisialisasi atau refresh manual)
export const fetchLastMessages = createAsyncThunk(
    "lastMessages/fetchLastMessages",
    async () =>
    {
        const result = await getLastMessagesPerChat();
        return result;
    }
);

const lastMessagesSlice = createSlice( {
    name: "lastMessages",
    initialState,
    reducers: {
        // ✅ Hapus percakapan dari daftar
        removeLastMessageByContact: ( state, action: PayloadAction<string> ) =>
        {
            state.data = state.data.filter(
                ( msg ) => msg.chat_partner_id !== action.payload
            );
        },

        upsertLastMessage: (
            state,
            action: PayloadAction<{
                chat_partner_id: string;
                message_id: string;
                message_text: string;
                created_at: string;
                is_deleted?: boolean;
            }>
        ) =>
        {
            const {
                chat_partner_id,
                message_id,
                message_text,
                created_at,
                is_deleted,
            } = action.payload;

            const idx = state.data.findIndex(
                ( m ) => m.chat_partner_id === chat_partner_id
            );

            if ( idx !== -1 )
            {
                // update data yang ada
                state.data[idx] = {
                    ...state.data[idx],
                    message_id,
                    message_text,
                    created_at,
                    updated_at: created_at,
                    is_deleted: is_deleted ?? false,
                };

                // pindahkan ke atas biar urutan terbaru
                const updated = state.data[idx];
                state.data.splice( idx, 1 );
                state.data.unshift( updated );
            } else
            {
                // kalau belum ada → tambah baru di urutan atas
                state.data.unshift( {
                    chat_partner_id,
                    from_user_id: chat_partner_id, // default fallback
                    to_user_id: "",
                    message_id,
                    message_text,
                    created_at,
                    updated_at: created_at,
                    read_at: null,
                    is_deleted: is_deleted ?? false,
                    deleted_at: null,
                } );
            }
        },
    },
    extraReducers: ( builder ) =>
    {
        builder
            .addCase( fetchLastMessages.pending, ( state ) =>
            {
                state.loading = true;
                state.error = null;
            } )
            .addCase( fetchLastMessages.fulfilled, ( state, action ) =>
            {
                state.loading = false;
                state.data = action.payload;
            } )
            .addCase( fetchLastMessages.rejected, ( state, action ) =>
            {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch last messages";
            } );
    },
} );

export const { removeLastMessageByContact, upsertLastMessage } =
    lastMessagesSlice.actions;
export default lastMessagesSlice.reducer;
