interface MessageTextareaProps
{
    value: string;
    onChange: ( value: string ) => void;
    onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
    placeholder: string;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function MessageTextarea( {
    value,
    onChange,
    onKeyDown,
    placeholder,
    textareaRef
}: MessageTextareaProps )
{
    return (
        <textarea
            ref={ textareaRef }
            value={ value }
            onChange={ ( e ) => onChange( e.target.value ) }
            onKeyDown={ onKeyDown }
            rows={ 1 }
            placeholder={ placeholder }
            className="flex-1 resize-none bg-transparent px-0 py-2 focus:outline-none text-black leading-tight max-h-32 overflow-y-auto"
        />
    );
}
