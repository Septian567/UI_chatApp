"use client";

import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps
{
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmModal( { open, onClose, onConfirm }: DeleteConfirmModalProps )
{
    if ( !open ) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80">
                <h2 className="font-semibold text-lg">Hapus percakapan?</h2>
                <p className="text-sm text-gray-600 mt-2">
                    Semua pesan di percakapan ini akan dihapus dari perangkat Anda.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                        onClick={ onClose }
                    >
                        Batal
                    </button>
                    <button
                        className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
                        onClick={ () =>
                        {
                            onConfirm();
                            onClose();
                        } }
                    >
                        <Trash2 size={ 14 } /> Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
