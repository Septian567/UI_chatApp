import { X, Check } from "react-feather";

interface EditActionsProps
{
    onCancel: () => void;
    onSave: () => void;
}

export function EditActions( { onCancel, onSave }: EditActionsProps )
{
    return (
        <div className="flex mr-2 items-center">
            <div className="w-9 h-9 hover:bg-gray-200 flex items-center justify-center transition">
                <button onClick={ onCancel } title="Batal" className="w-full h-full flex items-center justify-center">
                    <X size={ 18 } />
                </button>
            </div>
            <div className="w-9 h-9 hover:bg-gray-200 flex items-center justify-center transition">
                <button onClick={ onSave } title="Simpan" className="w-full h-full flex items-center justify-center">
                    <Check size={ 18 } />
                </button>
            </div>
        </div>
    );
}
