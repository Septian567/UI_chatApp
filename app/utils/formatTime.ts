// utils/formatTime.ts

/**
 * Format waktu menjadi HH:mm (24 jam).
 */
export function formatTime24( dateString: string ): string
{
    const date = new Date( dateString );
    const hours = date.getHours().toString().padStart( 2, "0" );
    const minutes = date.getMinutes().toString().padStart( 2, "0" );
    return `${ hours }:${ minutes }`;
}

/**
 * Format waktu fleksibel (default 24 jam).
 * Bisa diperluas nanti (misal 12 jam dengan AM/PM).
 */
export function formatTime( dateString: string, use24Hour: boolean = true ): string
{
    const date = new Date( dateString );
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart( 2, "0" );

    if ( !use24Hour )
    {
        const suffix = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${ hours }:${ minutes } ${ suffix }`;
    }

    return `${ hours.toString().padStart( 2, "0" ) }:${ minutes }`;
}
