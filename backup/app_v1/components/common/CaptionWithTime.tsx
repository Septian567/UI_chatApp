interface CaptionWithTimeProps
{
    caption?: string;
    time?: string;
}

export default function CaptionWithTime( { caption, time }: CaptionWithTimeProps )
{
    if ( !caption && !time ) return null;

    return (
        <div className="flex justify-between mt-1 text-xs text-gray-500 whitespace-pre-line">
            { caption && <div>{ caption }</div> }
            { time && <div>{ time }</div> }
        </div>
    );
}
