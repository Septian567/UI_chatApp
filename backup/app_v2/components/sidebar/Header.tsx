"use client";

import { ChevronUp, ChevronDown } from "react-feather";

interface HeaderProps
{
    isExpanded: boolean;
    onToggle: () => void;
}

export default function Header( { isExpanded, onToggle }: HeaderProps )
{
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold p-2 flex items-center justify-between">
                Menu
                <button onClick={ onToggle }>
                    { isExpanded ? <ChevronUp size={ 18 } /> : <ChevronDown size={ 18 } /> }
                </button>
            </h2>
        </div>
    );
}
