import React from 'react'

import { IconMenu, IconPanelLeftClose, IconPanelLeftOpen } from 'hq-icons'
import { Collection, Link, LinkProps, ListBoxSectionProps } from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Accordion, Button, cn, Popover, Sheet, Tooltip, useMediaQuery } from '@/components/ui'

type SidebarContextProps = {
    state: 'expanded' | 'collapsed'
    open: boolean
    setOpen: (open: boolean) => void
    openMobile: boolean
    setOpenMobile: (open: boolean) => void
    isMobile: boolean
    toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a Sidebar.')
    }

    return context
}

const Provider = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'> & {
        defaultOpen?: boolean
        isOpen?: boolean
        onOpenChange?: (open: boolean) => void
    }
>(
    (
        {
            defaultOpen = true,
            isOpen: openProp,
            onOpenChange: setOpenProp,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const isMobile = useMediaQuery('(max-width: 768px)')
        const [openMobile, setOpenMobile] = React.useState(false)

        const [_open, _setOpen] = React.useState(defaultOpen)
        const open = openProp ?? _open
        const setOpen = React.useCallback(
            (value: boolean | ((value: boolean) => boolean)) => {
                if (setOpenProp) {
                    return setOpenProp?.(typeof value === 'function' ? value(open) : value)
                }
                _setOpen(value)
                document.cookie = `sidebar:state=${open}; path=/; max-age=${60 * 60 * 24 * 7}`
            },
            [setOpenProp, open]
        )

        const toggleSidebar = React.useCallback(() => {
            return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
        }, [isMobile, setOpen, setOpenMobile])

        React.useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    toggleSidebar()
                }
            }

            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }, [toggleSidebar])

        const state = open ? 'expanded' : 'collapsed'

        const contextValue = React.useMemo<SidebarContextProps>(
            () => ({
                state,
                open,
                setOpen,
                isMobile,
                openMobile,
                setOpenMobile,
                toggleSidebar
            }),
            [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
        )

        return (
            <SidebarContext.Provider value={contextValue}>
                <div
                    className={cn(
                        'group/sidebar-wrapper [--sidebar-width:16.5rem] [--sidebar-width-icon:3rem] flex min-h-svh w-full text-foreground dark:has-[[data-variant=inset]]:bg-background has-[[data-variant=inset]]:bg-muted/50',
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </div>
            </SidebarContext.Provider>
        )
    }
)
Provider.displayName = 'Provider'

const Inset = ({ className, ...props }: React.ComponentProps<'main'>) => {
    return (
        <main
            className={cn([
                [
                    'relative overflow-hidden flex min-h-svh flex-1 flex-col bg-background',
                    'md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:bg-background md:peer-data-[variant=inset]:rounded-lg',
                    'peer-data-[variant=inset]:overflow-hidden peer-data-[variant=inset]:border peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:my-2 md:peer-data-[variant=inset]:mr-2',
                    'md:peer-data-[variant=sidebar]:overflow-visible'
                ],
                className
            ])}
            {...props}
        />
    )
}

const Sidebar = ({
    side = 'left',
    variant = 'default',
    collapsible = 'offcanvas',
    className,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    side?: 'left' | 'right'
    variant?: 'default' | 'floating' | 'inset'
    collapsible?: 'offcanvas' | 'dock' | 'fixed'
}) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === 'fixed') {
        return (
            <div
                data-state={state}
                data-collapsible={state === 'collapsed' ? collapsible : ''}
                className={cn(
                    'flex min-h-screen h-full w-[--sidebar-width] flex-col bg-background text-foreground',
                    'data-[state=collapsed]:hidden',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }

    if (isMobile) {
        return (
            <Sheet isOpen={openMobile} onOpenChange={setOpenMobile} {...props}>
                <Sheet.Trigger className='sr-only' />
                <Sheet.Content
                    aria-label='Sidebar'
                    data-sidebar='sidebar'
                    data-mobile='true'
                    classNames={{
                        content: 'bg-background text-foreground [&>button]:hidden'
                    }}
                    isStack={variant === 'floating'}
                    side={side}
                >
                    <Sheet.Body className='p-0 sm:p-0'>{children}</Sheet.Body>
                </Sheet.Content>
            </Sheet>
        )
    }
    return (
        <div
            className='group peer hidden md:block'
            data-state={state}
            data-collapsible={state === 'collapsed' ? collapsible : ''}
            data-variant={variant}
            data-side={side}
        >
            <div
                className={cn(
                    'relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear',
                    'group-data-[collapsible=offcanvas]:w-0',
                    'group-data-[side=right]:rotate-180',
                    variant === 'floating' || variant === 'inset'
                        ? 'group-data-[collapsible=dock]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
                        : 'group-data-[collapsible=dock]:w-[--sidebar-width-icon]'
                )}
            />
            <div
                className={cn(
                    'fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex',
                    side === 'left'
                        ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
                        : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
                    variant === 'floating' || variant === 'inset'
                        ? 'p-2 group-data-[collapsible=dock]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
                        : 'group-data-[collapsible=dock]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
                    className
                )}
                {...props}
            >
                <div
                    data-sidebar='sidebar'
                    className={cn(
                        'flex h-full w-full flex-col bg-background group-data-[variant=inset]:bg-transparent group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-muted',
                        variant === 'inset' || state === 'collapsed'
                            ? '[&_[data-sidebar=header]]:border-transparent [&_[data-sidebar=footer]]:border-transparent'
                            : '[&_[data-sidebar=header]]:border-b [&_[data-sidebar=footer]]:border-t'
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

const Trigger = ({ className, onPress, ...props }: React.ComponentProps<typeof Button>) => {
    const { toggleSidebar, state } = useSidebar()
    return (
        <Button
            aria-label={props['aria-label'] || 'Toggle Sidebar'}
            data-sidebar='trigger'
            variant='ghost'
            size='icon'
            className={className}
            onPress={(e) => {
                onPress?.(e)
                toggleSidebar()
            }}
            {...props}
        >
            {state === 'expanded' ? (
                <IconPanelLeftClose className='md:inline hidden' />
            ) : (
                <IconPanelLeftOpen className='md:inline hidden' />
            )}
            {props.children ? (
                <span className='md:hidden inline'>{props?.children as React.ReactNode}</span>
            ) : (
                <IconMenu className='md:hidden inline' />
            )}
            <span className='sr-only'>Toggle Sidebar</span>
        </Button>
    )
}

const header = tv({
    base: 'flex flex-col [&>section+section]:mt-2.5',
    variants: {
        collapsed: {
            false: 'px-5 py-4',
            true: 'px-5 py-4 md:p-0 md:size-9 mt-1 group-data-[variant=floating]:mt-2 md:rounded-lg md:hover:bg-muted md:mx-auto md:justify-center md:items-center'
        }
    }
})

const Header = ({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) => {
    const { state } = React.useContext(SidebarContext)!
    return (
        <div
            data-sidebar='header'
            className={header({ collapsed: state === 'collapsed', className })}
            {...props}
        />
    )
}
const footer = tv({
    base: 'flex flex-col mt-auto',
    variants: {
        collapsed: {
            false: [
                'p-2.5 [&_[data-slot=menu-trigger]>[data-slot=avatar]]:-ml-1.5 [&_[data-slot=menu-trigger]]:w-full [&_[data-slot=menu-trigger]]:hover:bg-muted [&_[data-slot=menu-trigger]]:justify-start [&_[data-slot=menu-trigger]]:flex [&_[data-slot=menu-trigger]]:items-center'
            ],
            true: 'size-12 p-1 [&_[data-slot=menu-trigger]]:size-9 justify-center items-center'
        }
    }
})

const Footer = ({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) => {
    const { state } = React.useContext(SidebarContext)!
    return (
        <div
            {...props}
            data-slot='sidebar-footer'
            className={footer({ collapsed: state === 'collapsed', className })}
            {...props}
        />
    )
}

const Content = ({ children, className, ...props }: React.HTMLProps<HTMLDivElement>) => (
    <nav
        className={cn(
            'flex flex-col overflow-y-auto p-2 space-y-2 [&>section+section]:mt-8',
            className
        )}
        {...props}
    >
        {children}
    </nav>
)

interface SidebarSectionProps<T> extends ListBoxSectionProps<T> {
    title?: string
}

const Section = <T extends object>({ className, ...props }: SidebarSectionProps<T>) => {
    return (
        <div className={cn('flex text-sm flex-col space-y-0.5 section', className)}>
            {props.title && (
                <Header
                    slot='title'
                    className='p-1 group-data-[collapsible=dock]:hidden border-transparent text-muted-foreground'
                >
                    {props.title}
                </Header>
            )}
            <Collection {...props} />
        </div>
    )
}

interface ItemProps extends LinkProps {
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
    isCurrent?: boolean
    textValue: string
    children?: React.ReactNode
    isDanger?: boolean
    className?: string
}

const Item = ({ icon: Icon, isCurrent, isDanger = false, className, ...props }: ItemProps) => {
    const { state, isMobile } = useSidebar()

    if (typeof props.children !== 'undefined') {
        const isExpanded = React.Children.toArray(props.children)
            .map((child) => (child as React.ReactElement).props as ItemProps)
            .some(
                (props) =>
                    props?.isCurrent ||
                    (props?.children &&
                        React.Children.toArray(props.children)
                            .map(
                                (descendant) =>
                                    (descendant as React.ReactElement).props as ItemProps
                            )
                            .some((props) => props?.isCurrent))
            )

        if (state === 'expanded') {
            return (
                <Accordion defaultExpandedKeys={isExpanded ? [1] : []} hideBorder>
                    <Accordion.Item key={1} id={1} className='border-0 pb-0.5 space-y-0.5'>
                        <Accordion.Trigger
                            className={cn(
                                'flex items-center gap-3 outline-none hover:bg-muted focus:bg-muted cursor-pointer rounded-lg px-3 py-2 text-foreground transition-all',
                                className
                            )}
                        >
                            {Icon && <Icon className='shrink-0 size-4' />}
                            {props.textValue}
                        </Accordion.Trigger>
                        <Accordion.Content className='p-0 space-y-0.5 group-data-[collapsible=dock]:hidden [&_.acrt]:ml-4 [&_.subitem]:ml-4 [&_.acrt+&_.subitem]:ml-8'>
                            <Collection {...props} />
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>
            )
        } else {
            return (
                <Popover>
                    <Tooltip closeDelay={0} delay={0}>
                        <Popover.Trigger
                            className={cn(
                                'flex focus:bg-muted h-9 overflow-hidden focus:outline-none hover:bg-muted outline-none items-center gap-3 cursor-pointer rounded-lg -mx-0.5 p-2.5 text-foreground transition-all',
                                className
                            )}
                        >
                            {Icon && <Icon className='shrink-0 size-4' />}
                        </Popover.Trigger>
                        <Tooltip.Content variant='inverse' showArrow={false} placement='right'>
                            {props.textValue}
                        </Tooltip.Content>
                    </Tooltip>
                    <Popover.Content
                        className='p-1.5 min-w-0 flex-col inline-flex gap-0.5'
                        placement='right'
                        aria-label={props.textValue}
                    >
                        <Collection aria-label={props.textValue} {...props} />
                    </Popover.Content>
                </Popover>
            )
        }
    } else {
        if (state === 'collapsed' && !isMobile) {
            return (
                <Tooltip closeDelay={0} delay={0}>
                    <Link
                        aria-current={isCurrent ? 'page' : undefined}
                        data-slot='sidebar-item'
                        href={props.href ?? '#'}
                        className={cn(
                            'focus:outline-none focus:bg-muted hover:bg-muted h-9 inline-flex text-foreground rounded-lg -mx-0.5 p-2.5',
                            {
                                'bg-primary focus:bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground':
                                    isCurrent
                            },
                            {
                                'hover:bg-danger focus:bg-danger/80 hover:text-danger-foreground':
                                    isDanger
                            }
                        )}
                    >
                        {Icon && <Icon data-slot='icon' />}
                        <span className='sr-only'>{props.textValue}</span>
                    </Link>
                    <Tooltip.Content variant='inverse' showArrow={false} placement='right'>
                        {props.textValue}
                    </Tooltip.Content>
                </Tooltip>
            )
        } else {
            return (
                <Link
                    {...props}
                    data-slot='sidebar-item'
                    aria-current={isCurrent ? 'page' : undefined}
                    href={props.href ?? '#'}
                    className={cn(
                        'subitem flex items-center h-9 overflow-hidden gap-3 focus:bg-muted hover:bg-muted outline-none focus:outline-none cursor-pointer rounded-lg px-3 py-2 text-foreground transition-all disabled:opacity-70 disabled:pointer-events-none',
                        {
                            'bg-primary focus:bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground':
                                isCurrent
                        },
                        {
                            'hover:bg-danger focus:bg-danger/80 hover:text-danger-foreground':
                                isDanger
                        }
                    )}
                >
                    {Icon && <Icon className='shrink-0 size-4' />}
                    {props.textValue}
                </Link>
            )
        }
    }
}
const Rail = ({ className, ...props }: React.ComponentProps<'button'>) => {
    const { toggleSidebar } = useSidebar()

    return (
        <button
            data-sidebar='rail'
            aria-label='Toggle Sidebar'
            tabIndex={-1}
            onClick={toggleSidebar}
            title='Toggle Sidebar'
            className={cn(
                'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-primary/40 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
                '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
                '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
                'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-background',
                '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
                '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
                className
            )}
            {...props}
        />
    )
}

Sidebar.Provider = Provider
Sidebar.Inset = Inset
Sidebar.Header = Header
Sidebar.Content = Content
Sidebar.Section = Section
Sidebar.Footer = Footer
Sidebar.Item = Item
Sidebar.Rail = Rail
Sidebar.Trigger = Trigger

export { Sidebar, useSidebar }
