import { ArrowLeft } from "lucide-react";

interface HeaderProps {
    title: string;
    isMobile: boolean;
    onBack: () => void;
}

export default function Header({ title, isMobile, onBack }: HeaderProps) {
    return (
        <header className="flex items-center p-4 bg-green-600 text-white">
            {isMobile && (
                <button onClick={onBack} className="mr-4">
                    <ArrowLeft className="w-5 h-5" />
                </button>
            )}
            <h1 className="text-lg font-bold">{title}</h1>
        </header>
    );
}
