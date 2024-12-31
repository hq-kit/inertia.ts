import React from 'react';

import { IconCircleUser, IconGauge, IconHome, IconLogIn } from 'hq-icons';

import { Command } from '@/components/ui';
import { Link, usePage } from '@inertiajs/react';

export default function CommandPalette({
    isOpen,
    setIsOpen,
}: {
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { user } = usePage().props.auth;
    return (
        <>
            <Command isOpen={isOpen} onOpenChange={setIsOpen}>
                <Command.Input placeholder="Quick search..." />
                <Command.List>
                    <Command.Section heading="Pages">
                        <Command.Item asChild>
                            <Link href={route('home')}>
                                <IconHome /> Home
                            </Link>
                        </Command.Item>
                        {user ? (
                            <>
                                <Command.Item asChild>
                                    <Link href={route('dashboard')}>
                                        <IconGauge /> Dashboard
                                    </Link>
                                </Command.Item>
                                <Command.Item asChild>
                                    <Link href={route('profile')}>
                                        <IconCircleUser /> Profile
                                    </Link>
                                </Command.Item>
                            </>
                        ) : (
                            <>
                                <Command.Item asChild>
                                    <Link href={route('login')}>
                                        <IconLogIn /> Login
                                    </Link>
                                </Command.Item>
                                <Command.Item asChild>
                                    <Link href={route('register')}>
                                        <IconCircleUser /> Register
                                    </Link>
                                </Command.Item>
                            </>
                        )}
                    </Command.Section>
                </Command.List>
            </Command>
        </>
    );
}
