'use client';

import React from 'react';

import {
    IconBrandLaravel,
    IconChevronDown,
    IconCircleUser,
    IconGauge,
    IconLogOut,
    IconMoon,
    IconSearch,
    IconSun,
} from 'hq-icons';

import CommandPalette from '@/components/command-palette';
import { useTheme } from '@/components/providers';
import { ToastMessage } from '@/components/toast-message';
import {
    Avatar,
    Button,
    Keyboard,
    Link,
    Menu,
    Sidebar,
    useSidebar,
} from '@/components/ui';
import { PageData, User } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = usePage<PageData>().props.auth;
    const [openCommand, setOpenCommand] = React.useState(false);
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenCommand((openCommand: boolean) => !openCommand);
            }
        };

        document.addEventListener('keydown', down);

        return () => document.removeEventListener('keydown', down);
    }, [setOpenCommand]);
    return (
        <Sidebar.Provider>
            <ToastMessage />
            <CommandPalette isOpen={openCommand} setIsOpen={setOpenCommand} />
            <AppSidebar user={user} />
            <Sidebar.Inset>
                <header className="sticky top-0 flex h-[3.57rem] items-center justify-between gap-x-2 px-4 sm:justify-start">
                    <span className="flex items-center gap-x-4">
                        <Sidebar.Trigger className="-mx-2" />
                        <Button
                            onPress={() => setOpenCommand(true)}
                            className="hidden md:flex"
                            variant="outline"
                            aria-label="Search for products"
                        >
                            <IconSearch />
                            Search
                            <Keyboard keys="⌘K" />
                        </Button>
                    </span>

                    <div className="flex items-center gap-x-2 lg:hidden">
                        <Button
                            onPress={() => setOpenCommand(true)}
                            variant="ghost"
                            aria-label="Search..."
                            size="icon"
                        >
                            <IconSearch />
                        </Button>
                        <Menu>
                            <Menu.Trigger
                                aria-label="Profile"
                                className="group flex items-center gap-x-2"
                            >
                                <Avatar
                                    size="sm"
                                    shape="circle"
                                    src={user.avatar}
                                />
                                <IconChevronDown className="size-4 transition-transform group-pressed:rotate-180" />
                            </Menu.Trigger>
                            <Menu.Content className="min-w-[--trigger-width]">
                                <Menu.Item href={route('profile')}>
                                    <IconCircleUser />
                                    Profile
                                </Menu.Item>
                                <Menu.Item
                                    href={route('logout')}
                                    routerOptions={{ method: 'post' }}
                                >
                                    <IconLogOut />
                                    Log out
                                </Menu.Item>
                            </Menu.Content>
                        </Menu>
                    </div>
                </header>
                <main className="p-4 lg:p-6">{children}</main>
            </Sidebar.Inset>
        </Sidebar.Provider>
    );
}

function AppSidebar({ user }: { user: User }) {
    const { theme, setTheme } = useTheme();
    const { state } = useSidebar();
    const collapsed = state === 'collapsed';
    return (
        <Sidebar variant="floating" collapsible="dock">
            <Sidebar.Header>
                <Link
                    className="flex items-center gap-x-2 group-data-[collapsible=dock]:size-10 group-data-[collapsible=dock]:justify-center"
                    href={route('home')}
                >
                    <IconBrandLaravel className="size-5" />
                    <strong className="font-medium group-data-[collapsible=dock]:hidden">
                        Laravel
                    </strong>
                </Link>
            </Sidebar.Header>
            <Sidebar.Content>
                <Sidebar.Section>
                    <SidebarItem
                        icon={IconGauge}
                        route={'dashboard'}
                        textValue="Dashboard"
                    />
                    <SidebarItem
                        icon={IconCircleUser}
                        route={'profile'}
                        textValue="Profile"
                    />
                </Sidebar.Section>
            </Sidebar.Content>
            <Sidebar.Footer className="hidden items-center lg:flex lg:flex-row">
                <Menu>
                    <Button
                        variant="ghost"
                        aria-label="Profile"
                        slot="close"
                        className="group w-full justify-start group-data-[collapsible=dock]:justify-center"
                    >
                        <Avatar size="sm" shape="square" src={user.avatar} />
                        <span className="flex items-center justify-center group-data-[collapsible=dock]:hidden">
                            {user.name}
                            <IconChevronDown className="absolute right-3 size-4 transition-transform group-pressed:rotate-180" />
                        </span>
                    </Button>
                    <Menu.Content
                        placement={collapsed ? 'right' : 'top'}
                        className={
                            collapsed
                                ? 'sm:min-w-56'
                                : 'min-w-[--trigger-width]'
                        }
                    >
                        <Menu.Item href={route('profile')}>
                            <IconCircleUser />
                            Profile
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item
                            onAction={() =>
                                setTheme(theme === 'light' ? 'dark' : 'light')
                            }
                        >
                            {theme === 'light' ? <IconMoon /> : <IconSun />}
                            Dark Mode
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item
                            isDanger
                            href={route('logout')}
                            routerOptions={{ method: 'post' }}
                        >
                            <IconLogOut />
                            Log out
                        </Menu.Item>
                    </Menu.Content>
                </Menu>
            </Sidebar.Footer>
            <Sidebar.Rail />
        </Sidebar>
    );
}

function SidebarItem({
    icon: Icon,
    allowed = true,
    ...props
}: React.ComponentProps<typeof Sidebar.Item> & {
    route: string;
    allowed?: boolean;
}) {
    if (!allowed) {
        return null;
    }
    return (
        <Sidebar.Item
            href={route(props.route)}
            isCurrent={route().current(props.route.split('.')[0] + '*')}
            icon={Icon}
            {...props}
        />
    );
}
