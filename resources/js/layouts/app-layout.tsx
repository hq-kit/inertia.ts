import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, Button, Menu, Navbar, Separator } from '@/components/ui';
import { usePage } from '@inertiajs/react';
import {
    IconBrandLaravel,
    IconChevronDown,
    IconGauge,
    IconLogOut,
    IconSearch,
    IconSettings,
} from 'hq-icons';
import { PropsWithChildren, ReactNode } from 'react';

export default function AppLayout({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    return (
        <Navbar>
            <Navbar.Nav>
                <Navbar.Logo href="#">
                    <IconBrandLaravel className="size-5" />
                </Navbar.Logo>
                <Navbar.Section>
                    <Navbar.Item href="/" isCurrent={route().current('home')}>
                        Home
                    </Navbar.Item>
                    <Navbar.Item
                        href={route('dashboard')}
                        isCurrent={route().current('dashboard')}
                    >
                        Dashboard
                    </Navbar.Item>
                </Navbar.Section>
                <Navbar.Section className="ml-auto hidden lg:flex">
                    <div className="flex items-center gap-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Search for products"
                        >
                            <IconSearch />
                        </Button>
                        <ThemeToggle />
                    </div>
                    <Separator
                        orientation="vertical"
                        className="ml-1 mr-3 h-6"
                    />
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
                            <Menu.Item href={route('profile.edit')}>
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
                </Navbar.Section>
            </Navbar.Nav>
            <Navbar.Compact>
                <Navbar.Flex>
                    <Navbar.Trigger className="-ml-2" />
                </Navbar.Flex>
                <Navbar.Flex>
                    <Navbar.Flex>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Search for products"
                        >
                            <IconSearch />
                        </Button>
                        <ThemeToggle />
                    </Navbar.Flex>
                </Navbar.Flex>
            </Navbar.Compact>
            <Navbar.Inset>{children}</Navbar.Inset>
        </Navbar>
    );
}
