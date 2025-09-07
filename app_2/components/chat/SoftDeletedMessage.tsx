import { Ban } from "lucide-react";

interface SoftDeletedMessageProps
{
    text: string;
}

export function SoftDeletedMessage( { text }: SoftDeletedMessageProps )
{
    return (
        <div className="flex items-center gap-1 text-gray-500 italic text-sm">
            <Ban size={ 16 } className="text-gray-500" />
            <span>{ text }</span>
        </div>
    )
}