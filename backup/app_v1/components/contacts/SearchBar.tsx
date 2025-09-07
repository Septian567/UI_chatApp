import { Search } from "lucide-react";

interface SearchBarProps
{
    placeholder: string;
    value: string;
    onChange: ( value: string ) => void;
}

export default function SearchBar( { placeholder, value, onChange }: SearchBarProps )
{
    return (
        <div className="flex items-center gap-3 px-6 mt-6">
            <input
                type="text"
                placeholder={ placeholder }
                value={ value }
                onChange={ ( e ) => onChange( e.target.value ) }
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="p-2 rounded-full hover:bg-gray-100">
                <Search className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
}
