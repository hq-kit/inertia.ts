import CommandPalette from '@/components/command-palette';
import { ThemeToggle } from '@/components/theme-toggle';
import { ToastMessage } from '@/components/toast-message';
import {
    Avatar,
    Button,
    buttonVariants,
    Menu,
    Navbar,
    Separator,
} from '@/components/ui';
import { PageData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    IconBrandLaravel,
    IconChevronDown,
    IconGauge,
    IconHome,
    IconLogOut,
    IconSearch,
    IconSettings,
} from 'hq-icons';
import React, { PropsWithChildren, ReactNode } from 'react';

export default function AppLayout({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
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
        <Navbar>
            <ToastMessage />
            <Navbar.Nav>
                <Navbar.Logo href="#">
                    <IconBrandLaravel className="size-5" />
                </Navbar.Logo>
                <Navbar.Section>
                    <Navbar.Item
                        href={route('home')}
                        isCurrent={route().current('home')}
                    >
                        <IconHome />
                        Home
                    </Navbar.Item>
                    <Navbar.Item
                        href={route('dashboard')}
                        isCurrent={route().current('dashboard')}
                    >
                        <IconGauge />
                        Dashboard
                    </Navbar.Item>
                </Navbar.Section>
                <Navbar.Section className="ml-auto hidden lg:flex">
                    <div className="flex items-center gap-x-2">
                        <Button
                            onPress={() => setOpenCommand(true)}
                            variant="ghost"
                            size="icon"
                            aria-label="Search"
                        >
                            <IconSearch />
                        </Button>
                        <ThemeToggle />
                    </div>
                    <Separator
                        orientation="vertical"
                        className="ml-1 mr-3 h-6"
                    />
                    {user ? (
                        <Menu>
                            <Menu.Trigger
                                aria-label="Open Menu"
                                className="group flex items-center gap-x-2"
                            >
                                <Avatar shape="circle" src={user?.avatar} />
                                <IconChevronDown className="size-4 transition-transform group-pressed:rotate-180" />
                            </Menu.Trigger>
                            <Menu.Content
                                placement="bottom"
                                showArrow
                                className="sm:min-w-56"
                            >
                                <Menu.Header separator>
                                    <span className="block">{user.name}</span>
                                    <span className="font-normal text-muted-foreground">
                                        {user.email}
                                    </span>
                                </Menu.Header>
                                <Menu.Item href={route('dashboard')}>
                                    <IconGauge />
                                    Dashboard
                                </Menu.Item>
                                <Menu.Item href={route('profile')}>
                                    <IconSettings />
                                    Profile
                                </Menu.Item>

                                <Menu.Separator />
                                <Menu.Item
                                    href={route('logout')}
                                    routerOptions={{ method: 'post' }}
                                >
                                    <IconLogOut />
                                    Log out
                                </Menu.Item>
                            </Menu.Content>
                        </Menu>
                    ) : (
                        <Link
                            className={buttonVariants({ variant: 'success' })}
                            href={route('login')}
                        >
                            Login
                        </Link>
                    )}
                </Navbar.Section>
            </Navbar.Nav>
            <Navbar.Compact>
                <Navbar.Flex>
                    <Navbar.Trigger className="-ml-2" />
                </Navbar.Flex>
                <Navbar.Flex>
                    <Navbar.Flex>
                        <Button
                            onPress={() => setOpenCommand(true)}
                            variant="ghost"
                            size="icon"
                            aria-label="Search"
                        >
                            <IconSearch />
                        </Button>
                        <ThemeToggle />
                        {user ? (
                            <Menu>
                                <Menu.Trigger
                                    aria-label="Open Menu"
                                    className="group flex items-center gap-x-2"
                                >
                                    <Avatar shape="circle" src={user?.avatar} />
                                    <IconChevronDown className="size-4 transition-transform group-pressed:rotate-180" />
                                </Menu.Trigger>
                                <Menu.Content
                                    placement="bottom"
                                    showArrow
                                    className="sm:min-w-56"
                                >
                                    <Menu.Header separator>
                                        <span className="block">
                                            {user.name}
                                        </span>
                                        <span className="font-normal text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </Menu.Header>
                                    <Menu.Item href={route('dashboard')}>
                                        <IconGauge />
                                        Dashboard
                                    </Menu.Item>
                                    <Menu.Item href={route('profile')}>
                                        <IconSettings />
                                        Profile
                                    </Menu.Item>

                                    <Menu.Separator />
                                    <Menu.Item
                                        href={route('logout')}
                                        routerOptions={{ method: 'post' }}
                                    >
                                        <IconLogOut />
                                        Log out
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu>
                        ) : (
                            <Link
                                className={buttonVariants({
                                    variant: 'success',
                                })}
                                href={route('login')}
                            >
                                Login
                            </Link>
                        )}
                    </Navbar.Flex>
                </Navbar.Flex>
            </Navbar.Compact>
            <Navbar.Inset>
                <CommandPalette
                    isOpen={openCommand}
                    setIsOpen={setOpenCommand}
                />
                {children}
            </Navbar.Inset>
        </Navbar>
    );
}
