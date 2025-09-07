"use client";

import { Search } from "react-feather";

interface SearchBoxProps
{
    onSearch: ( query: string ) => void;
}

export default function SearchBox( { onSearch }: SearchBoxProps )
{
    return (
        <form className="relative mb-4" onSubmit={ ( e ) => e.preventDefault() }>
            <Search className="absolute top-2.5 left-3 text-gray-400" size={ 16 } />
            <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 bg-transparent text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={ ( e ) => onSearch( e.target.value ) }
            />
        </form>
    );
}
