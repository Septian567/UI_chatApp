"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import
    {
        AlertDialog,
        AlertDialogTrigger,
        AlertDialogContent,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogCancel,
        AlertDialogAction,
    } from "@/components/ui/alert-dialog";

interface MainMenuItem
{
    label: string;
    icon: React.ReactNode;
    key: string | null;
}

interface MainMenuProps
{
    items: MainMenuItem[];
    onClick: ( key: string ) => void;
}

export default function MainMenu( { items, onClick }: MainMenuProps )
{
    const router = useRouter();
    const [open, setOpen] = useState( false );

    const handleConfirmLogout = () =>
    {
        setOpen( false );
        router.push( "/login" );
    };

    return (
        <ul className="space-y-1 mb-6">
            { items.map( ( { label, icon, key } ) =>
                label === "Logout" ? (
                    <li key={ label }>
                        <AlertDialog open={ open } onOpenChange={ setOpen }>
                            <AlertDialogTrigger asChild>
                                <button
                                    className="flex w-full items-center gap-2 p-2 rounded border border-transparent hover:border-gray-300 hover:bg-gray-100 text-left text-black"
                                >
                                    { icon } { label }
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Apa anda yakin ingin logout?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Tidak</AlertDialogCancel>
                                    <AlertDialogAction onClick={ handleConfirmLogout }>
                                        Ya
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </li>
                ) : (
                    <li key={ label }>
                        <button
                            onClick={ () => key && onClick( key ) }
                            className="flex w-full items-center gap-2 p-2 rounded border border-transparent hover:border-gray-300 hover:bg-gray-100 text-left text-black"
                        >
                            { icon } { label }
                        </button>
                    </li>
                )
            ) }
        </ul>
    );
}

