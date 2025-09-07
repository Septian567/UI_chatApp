interface TabMenuProps
{
    activeMenu: "user" | "contact";
    onChange: ( menu: "user" | "contact" ) => void;
}

export default function TabMenu( { activeMenu, onChange }: TabMenuProps )
{
    return (
        <div className="flex gap-8 mt-6 px-6">
            <button
                onClick={ () => onChange( "user" ) }
                className={ `pb-1 ${ activeMenu === "user"
                        ? "border-b-2 border-black font-semibold"
                        : "text-gray-600"
                    }` }
            >
                User
            </button>
            <button
                onClick={ () => onChange( "contact" ) }
                className={ `pb-1 ${ activeMenu === "contact"
                        ? "border-b-2 border-black font-semibold"
                        : "text-gray-600"
                    }` }
            >
                Kontak
            </button>
        </div>
    );
}
