"use client";

import React from "react";

type HorizontalSubMenu = "user" | "chat" | "contact";

interface HorizontalMenuProps
{
    active: HorizontalSubMenu;
    onChange: ( menu: HorizontalSubMenu ) => void;
    items: HorizontalSubMenu[];
}

export default function HorizontalMenu( {
    active,
    onChange,
    items,
}: HorizontalMenuProps )
{
    return (
        <div className="mb-2 text-sm">
            <div className="inline-flex gap-2">
                { items.map( ( item ) => (
                    <button
                        key={ item }
                        onClick={ () => onChange( item ) }
                        className={ `px-3 py-2 rounded border text-sm ${ active === item
                                ? "bg-gray-200 border-gray-400 text-black"
                                : "hover:bg-gray-100 border-gray-300 text-gray-800"
                            }` }
                    >
                        { capitalize( item ) }
                    </button>
                ) ) }
            </div>
        </div>
    );
}

// Utility
function capitalize( text: string )
{
    return text.charAt( 0 ).toUpperCase() + text.slice( 1 );
}
