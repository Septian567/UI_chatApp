export default function ChatStaticMessages()
{
    return (
        <>
            {/* Contoh statis kanan */ }
            <div className="flex justify-end mb-4">
                <div className="bg-green-200 rounded-lg px-4 py-2 shadow border border-black w-fit max-w-[85%]">
                    <div className="flex justify-between items-end gap-2">
                        <span className="text-black whitespace-pre-line">halo bre</span>
                        <span className="text-xs text-gray-700 whitespace-nowrap">07.00</span>
                    </div>
                </div>
            </div>

            {/* Contoh statis kiri */ }
            <div className="flex justify-start mb-4">
                <div className="bg-white rounded-lg px-4 py-2 border border-black w-fit max-w-[85%]">
                    <div className="flex justify-between items-end gap-2">
                        <span className="text-black whitespace-pre-line">hallo</span>
                        <span className="text-xs text-gray-700 whitespace-nowrap">07.01</span>
                    </div>
                </div>
            </div>
        </>
    );
}
