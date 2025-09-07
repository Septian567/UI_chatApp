"use client";

import React, { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";

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
    const [isOpen, setIsOpen] = useState( false );

    const handleLogout = () =>
    {
        setIsOpen( false );
        router.push( "/login" );
    };

    return (
        <>
            <ul className="space-y-1 mb-6">
                { items.map( ( { label, icon, key } ) =>
                    label === "Logout" ? (
                        <li key={ label }>
                            <button
                                onClick={ () => setIsOpen( true ) }
                                className="flex w-full items-center gap-2 p-2 rounded border border-transparent hover:border-gray-300 hover:bg-gray-100 text-left text-black"
                            >
                                { icon } { label }
                            </button>
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

            {/* Modal Logout Confirmation */ }
            <Transition appear show={ isOpen } as={ Fragment }>
                <Dialog as="div" className="relative z-50" onClose={ () => setIsOpen( false ) }>
                    {/* Background overlay */ }
                    <Transition.Child
                        as={ Fragment }
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    {/* Modal panel */ }
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={ Fragment }
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                    Konfirmasi Logout
                                </Dialog.Title>
                                <Dialog.Description className="mt-2 text-sm text-gray-600">
                                    Apa anda yakin ingin logout?
                                </Dialog.Description>

                                <div className="mt-4 flex justify-end gap-3">
                                    <button
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                                        onClick={ () => setIsOpen( false ) }
                                    >
                                        Tidak
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
                                        onClick={ handleLogout }
                                    >
                                        Ya
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
