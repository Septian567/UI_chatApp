import { Paperclip } from "react-feather";

interface FileInputButtonProps
{
    onChange: ( e: React.ChangeEvent<HTMLInputElement> ) => void;
}

export function FileInputButton( { onChange }: FileInputButtonProps )
{
    return (
        <label className="cursor-pointer text-black ml-2 flex items-center">
            <input type="file" className="hidden" onChange={ onChange } />
            <Paperclip size={ 20 } className="relative top-[-6px]" />
        </label>
    )
}