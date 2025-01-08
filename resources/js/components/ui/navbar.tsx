import React from 'react';

import { LayoutGroup, motion } from 'framer-motion';
import { IconMenu } from 'hq-icons';
import { Link, type LinkProps } from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { Button } from './button';
import { Sheet } from './sheet';
import { cn, cr, useMediaQuery } from './utils';

type NavbarOptions = {
    side?: 'left' | 'right';
    isSticky?: boolean;
    variant?: 'navbar' | 'floating' | 'inset';
};

type NavbarContextProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    isCompact: boolean;
    toggleNavbar: () => void;
} & NavbarOptions;

const NavbarContext = React.createContext<NavbarContextProps | null>(null);

function useNavbar() {
    const context = React.useContext(NavbarContext);
    if (!context) {
        throw new Error('useNavbar must be used within a Navbar.');
    }

    return context;
}

interface NavbarProviderProps
    extends React.ComponentProps<'header'>,
        NavbarOptions {
    defaultOpen?: boolean;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const navbarStyles = tv({
    base: 'relative isolate flex w-full min-h-svh flex-col',
    variants: {
        variant: {
            floating: 'pt-2 px-2.5',
            navbar: 'md:divide-y',
            inset: 'bg-muted dark:bg-background',
        },
    },
});

const Navbar = ({
    children,
    isOpen: openProp,
    onOpenChange: setOpenProp,
    defaultOpen = false,
    className,
    side = 'left',
    isSticky = false,
    variant = 'navbar',
    ...props
}: NavbarProviderProps) => {
    const isCompact = useMediaQuery('(max-width: 1023px)');
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            if (setOpenProp) {
                return setOpenProp?.(
                    typeof value === 'function' ? value(open) : value,
                );
            }

            _setOpen(value);
        },
        [setOpenProp, open],
    );

    const toggleNavbar = React.useCallback(() => {
        setOpen((open) => !open);
    }, [setOpen]);

    const contextValue = React.useMemo<NavbarContextProps>(
        () => ({
            open,
            setOpen,
            isCompact,
            toggleNavbar,
            variant,
            isSticky,
            side,
        }),
        [open, setOpen, isCompact, toggleNavbar, variant, isSticky, side],
    );
    return (
        <NavbarContext.Provider value={contextValue}>
            <header
                data-variant={variant}
                className={navbarStyles({ variant, className })}
                {...props}
            >
                {children}
            </header>
        </NavbarContext.Provider>
    );
};

const navStyles = tv({
    base: [
        'hidden nav h-[--navbar-height] [--navbar-height:3.5rem] px-4 group peer lg:flex items-center w-full',
        '[&>div]:max-w-[1680px] lg:[&>div]:flex [&>div]:items-center [&>div]:w-full [&>div]:mx-auto',
    ],
    variants: {
        isSticky: {
            true: 'sticky z-20 top-0',
        },
        variant: {
            floating:
                'bg-background max-w-[1680px] mx-auto shadow-sm border rounded-lg sm:px-4',
            navbar: 'bg-background sm:px-6',
            inset: [
                'bg-muted mx-auto dark:bg-background sm:px-6',
                '[&>div]:max-w-[1680px] lg:[&>div]:flex [&>div]:items-center [&>div]:w-full [&>div]:mx-auto',
            ],
        },
    },
});

interface NavbarProps extends React.ComponentProps<'div'> {
    variant?: 'navbar' | 'floating' | 'inset';
    isSticky?: boolean;
    side?: 'left' | 'right';
}

const Nav = ({ className, ...props }: NavbarProps) => {
    const { isCompact, side, variant, isSticky, open, setOpen } = useNavbar();

    if (isCompact) {
        return (
            <Sheet isOpen={open} onOpenChange={setOpen} {...props}>
                <Sheet.Content
                    side={side}
                    aria-label="Compact Navbar"
                    data-navbar="compact"
                    classNames={{
                        content: 'text-foreground [&>button]:hidden',
                    }}
                    isStack={variant === 'floating'}
                >
                    <Sheet.Body className="px-2 sm:px-4">
                        {props.children}
                    </Sheet.Body>
                </Sheet.Content>
            </Sheet>
        );
    }

    return (
        <div className={navStyles({ isSticky, variant, className })} {...props}>
            <div>{props.children}</div>
        </div>
    );
};

const Trigger = ({
    className,
    onPress,
    ...props
}: React.ComponentProps<typeof Button>) => {
    const { toggleNavbar } = useNavbar();
    return (
        <Button
            data-sidebar="trigger"
            variant="ghost"
            aria-label={props['aria-label'] || 'Toggle Navbar'}
            size="icon"
            className={className}
            onPress={(event) => {
                onPress?.(event);
                toggleNavbar();
            }}
            {...props}
        >
            <IconMenu />
            <span className="sr-only">Toggle Navbar</span>
        </Button>
    );
};

const Section = ({ className, ...props }: React.ComponentProps<'div'>) => {
    const { isCompact } = useNavbar();
    const id = React.useId();
    return (
        <LayoutGroup id={id}>
            <div
                data-slot="navbar-section"
                className={cn(
                    'flex',
                    isCompact
                        ? 'flex-col gap-y-4'
                        : 'flex-row items-center gap-x-3',
                    className,
                )}
                {...props}
            >
                {props.children}
            </div>
        </LayoutGroup>
    );
};

const navItemStyles = tv({
    base: [
        'relative rounded-lg lg:text-sm px-2 flex items-center gap-x-2 [&>[data-slot=icon]]:-mx-0.5 text-muted-foreground outline-none transition-colors',
        'hover:text-foreground focus:text-foreground pressed:text-foreground focus-visible:outline-1 focus-visible:outline-primary',
        'disabled:opacity-60 disabled:cursor-default',
        '[&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:shrink-0',
    ],
    variants: {
        isCurrent: {
            true: 'text-foreground',
        },
    },
});

interface ItemProps extends LinkProps {
    isCurrent?: boolean;
}

const Item = ({ className, isCurrent, ...props }: ItemProps) => {
    const { variant, isCompact } = useNavbar();
    return (
        <Link
            slot="navbar-item"
            aria-current={isCurrent ? 'page' : undefined}
            className={cr(className, (className, ...renderProps) =>
                navItemStyles({ ...renderProps, isCurrent, className }),
            )}
            {...props}
        >
            {(values) => (
                <>
                    {typeof props.children === 'function'
                        ? props.children(values)
                        : props.children}

                    {(isCurrent || values.isCurrent) &&
                        !isCompact &&
                        variant !== 'floating' && (
                            <motion.span
                                layoutId="current-indicator"
                                className="absolute inset-x-2 bottom-[calc(var(--navbar-height)*-0.33)] h-0.5 rounded-full bg-foreground"
                            />
                        )}
                </>
            )}
        </Link>
    );
};

const Logo = ({ className, ...props }: LinkProps) => {
    return (
        <Link
            className={cn(
                'flex items-center gap-x-2 rounded-lg px-2 py-4 text-foreground focus:outline-none focus-visible:outline-1 focus-visible:outline-primary lg:mr-4 lg:px-0 lg:py-0',
                className,
            )}
            {...props}
        />
    );
};

const Flex = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return (
        <div
            className={cn('flex items-center gap-2 sm:gap-3', className)}
            {...props}
        />
    );
};

const compactStyles = tv({
    base: 'lg:hidden flex peer-has-[[data-variant=floating]]:border bg-background justify-between',
    variants: {
        variant: {
            floating: 'border h-12 rounded-lg px-3.5',
            inset: 'h-14 px-4',
            navbar: 'h-14 border-b px-4',
        },
    },
});

const Compact = ({ className, ...props }: React.ComponentProps<'div'>) => {
    const { variant } = useNavbar();
    return <div className={compactStyles({ variant, className })} {...props} />;
};

const insetStyles = tv({
    base: 'grow px-0 py-4 lg:px-4 lg:py-10',
    variants: {
        variant: {
            floating: '',
            inset: 'bg-background dark:brightness-150 lg:rounded-lg lg:shadow-sm lg:ring-1 lg:ring-dark/5',
            navbar: '',
        },
    },
});

const Inset = ({ className, ...props }: React.ComponentProps<'div'>) => {
    const { variant } = useNavbar();
    return (
        <main
            data-variant={variant}
            className={cn(
                'flex flex-1 flex-col',
                variant === 'inset' && 'pb-2 lg:px-2',
                className,
            )}
        >
            <div className={insetStyles({ variant, className })}>
                <div className="container">{props.children}</div>
            </div>
        </main>
    );
};

Navbar.Nav = Nav;
Navbar.Inset = Inset;
Navbar.Compact = Compact;
Navbar.Flex = Flex;
Navbar.Trigger = Trigger;
Navbar.Logo = Logo;
Navbar.Item = Item;
Navbar.Section = Section;

export { Navbar };
