import React from 'react'

import { IconMinus } from 'hq-icons'
import {
    Button,
    DisclosureGroup as DisclosureGroupPrimitive,
    DisclosurePanel,
    Disclosure as DisclosurePrimitive,
    type ButtonProps,
    type DisclosureGroupProps as DisclosureGroupPrimitiveProps,
    type DisclosurePanelProps,
    type DisclosureProps,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { cn, cr } from './utils'

interface DisclosureGroupProps extends DisclosureGroupPrimitiveProps {
    hideBorder?: boolean
    hideIndicator?: boolean
    className?: string
}

const DisclosureGroupContext = React.createContext<DisclosureGroupProps>({})

const DisclosureGroup = ({
    children,
    hideIndicator,
    hideBorder,
    className,
    ...props
}: DisclosureGroupProps) => {
    return (
        <DisclosureGroupPrimitive
            {...props}
            className={({ isDisabled }) =>
                cn([
                    isDisabled
                        ? 'cursor-not-allowed opacity-75'
                        : 'cursor-pointer',
                    hideBorder
                        ? '[&_[data-slot=accordion-item]]:border-none'
                        : '[&_[data-slot=accordion-item]]:border-b',
                ])
            }
        >
            {(values) => (
                <div data-slot="accordion-item-content" className={className}>
                    <DisclosureGroupContext.Provider
                        value={{ hideIndicator, hideBorder }}
                    >
                        {typeof children === 'function'
                            ? children(values)
                            : children}
                    </DisclosureGroupContext.Provider>
                </div>
            )}
        </DisclosureGroupPrimitive>
    )
}

const disclosureStyles = tv({
    base: 'flex group relative w-full flex-col',
    variants: {
        isDisabled: {
            true: 'cursor-not-allowed opacity-75',
        },
        isExpanded: {
            true: 'pb-3',
        },
    },
    compoundVariants: [
        {
            hideBorder: true,
            isExpanded: true,
            className: 'pb-2',
        },
    ],
})

const Disclosure = ({ className, ...props }: DisclosureProps) => {
    return (
        <DisclosurePrimitive
            data-slot="accordion-item"
            {...props}
            className={cr(className, (className, renderProps) =>
                disclosureStyles({ ...renderProps, className }),
            )}
        >
            {props.children}
        </DisclosurePrimitive>
    )
}

const accordionTriggerStyles = tv({
    base: [
        'acrt flex flex-1 group rounded-lg aria-expanded:text-foreground text-muted-foreground sm:text-sm items-center gap-x-2 font-medium',
    ],
    variants: {
        hideBorder: {
            true: 'py-2',
            false: 'py-3',
        },
        isFocused: {
            true: 'outline-none text-foreground',
        },
        isOpen: {
            true: 'text-foreground',
        },
        isDisabled: {
            true: 'opacity-50 cursor-default',
        },
    },
})

const Trigger = ({ className, ...props }: ButtonProps) => {
    const { hideIndicator, hideBorder } = React.useContext(
        DisclosureGroupContext,
    )
    return (
        <Button
            {...props}
            slot="trigger"
            className={cr(className, (className, renderProps) =>
                accordionTriggerStyles({
                    ...renderProps,
                    hideBorder,
                    className,
                }),
            )}
        >
            {(values) => (
                <>
                    {typeof props.children === 'function'
                        ? props.children(values)
                        : props.children}
                    {!hideIndicator && (
                        <div
                            className={cn(
                                'indicator relative ml-auto flex size-3 items-center justify-center',
                                '-rotate-90 transition-transform duration-300 group-aria-expanded:rotate-0',
                            )}
                        >
                            <IconMinus
                                className={cn(
                                    'indicator absolute size-3 transition-opacity',
                                )}
                            />
                            <IconMinus
                                className={cn(
                                    'absolute size-3 transition-all',
                                    'indicator -rotate-90 group-aria-expanded:rotate-0',
                                )}
                            />
                        </div>
                    )}
                </>
            )}
        </Button>
    )
}

const Panel = ({ className, ...props }: DisclosurePanelProps) => {
    return (
        <DisclosurePanel {...props} className={cn('sm:text-sm', className)}>
            {props.children}
        </DisclosurePanel>
    )
}

Disclosure.Trigger = Trigger
Disclosure.Panel = Panel

const Accordion = (props: DisclosureGroupProps) => (
    <DisclosureGroup {...props} />
)
Accordion.Item = Disclosure
Accordion.Trigger = Trigger
Accordion.Content = Panel

const Collapsible = (props: DisclosureProps) => <Disclosure {...props} />
Collapsible.Trigger = Trigger
Collapsible.Content = Panel

export { Accordion, Collapsible }
