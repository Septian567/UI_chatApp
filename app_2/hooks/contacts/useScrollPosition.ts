// useScrollPosition.ts
import { useRef, useEffect, useCallback } from "react";
import { throttle } from "lodash";

export function useScrollPositions<T extends string>( activeMenu: T )
{
    const scrollRef = useRef<HTMLDivElement>( null );
    const scrollPositionsRef = useRef<Record<T, number>>( {} as Record<T, number> );

    // simpan posisi scroll pakai ref supaya tidak trigger re-render
    const handleScroll = useCallback(
        throttle( () =>
        {
            if ( !scrollRef.current ) return;
            scrollPositionsRef.current[activeMenu] = scrollRef.current.scrollTop;
        }, 100 ), // hanya update setiap 100ms
        [activeMenu]
    );

    useEffect( () =>
    {
        if ( scrollRef.current )
        {
            scrollRef.current.scrollTop = scrollPositionsRef.current[activeMenu] || 0;
        }
    }, [activeMenu] );

    return { scrollRef, handleScroll };
}
