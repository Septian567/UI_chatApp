interface EditBannerProps
{
    initialEditValue: string;
}

export function EditBanner( {
    initialEditValue
}: EditBannerProps )
{
    if ( !initialEditValue ) return null;

    return (
        <div className="bg-green-100 border border-green-300 text-green-800 text-sm rounded px-4 py-2 mb-2 shadow w-full">
            <div className="font-semibold mb-1 flex items-center gap-1">
                <span className="text-green-700">✏️ Edit message </span>
            </div>
            <div className="whitespace-pre-line text-black">{ initialEditValue }</div>
        </div>
    )

}