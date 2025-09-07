export function formatDuration( seconds: number ): string
{
    if ( !isFinite( seconds ) || isNaN( seconds ) ) return "00:00";
    const minutes = Math.floor( seconds / 60 );
    const secs = Math.floor( seconds % 60 );
    return `${ minutes }:${ secs.toString().padStart( 2, "0" ) }`;
}
