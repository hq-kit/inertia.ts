import React from 'react'

import {
    Button,
    OverlayArrow,
    Tooltip as TooltipPrimitive,
    type TooltipProps as TooltipPrimitiveProps,
    TooltipTrigger,
} from 'react-aria-components'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

import { cr } from './utils'

export const tooltipStyles = tv({
    base: [
        'group rounded-lg [&_strong]:font-medium border text-background px-3 py-1.5 text-sm will-change-transform dark:shadow-none',
        'placement-left:slide-in-from-right-1 placement-right:slide-in-from-left-1 placement-top:slide-in-from-bottom-1 placement-bottom:slide-in-from-top-1',
    ],
    variants: {
        variant: {
            default:
                'bg-background text-foreground [&_.tarrow]:fill-background [&_.tarrow]:stroke-muted',
            inverse:
                'border-transparent bg-foreground text-background [&_.tarrow]:fill-foreground [&_.tarrow]:stroke-transparent',
        },
        isEntering: {
            true: 'animate-in fade-in',
        },
        isExiting: {
            true: 'animate-in fade-in direction-reverse',
        },
    },
})

const Tooltip = (props: React.ComponentProps<typeof TooltipTrigger>) => (
    <TooltipTrigger {...props}>{props.children}</TooltipTrigger>
)

interface ContentProps
    extends Omit<TooltipPrimitiveProps, 'children'>,
        VariantProps<typeof tooltipStyles> {
    showArrow?: boolean
    children: React.ReactNode
}

const Content = ({
    showArrow = true,
    variant = 'default',
    children,
    ...props
}: ContentProps) => {
    return (
        <TooltipPrimitive
            {...props}
            offset={10}
            className={cr(props.className, (className, renderProps) =>
                tooltipStyles({
                    ...renderProps,
                    variant,
                    className,
                }),
            )}
        >
            {showArrow && (
                <OverlayArrow>
                    <svg
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        className="tarrow group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
                    >
                        <path d="M0 0 L6 6 L12 0" />
                    </svg>
                </OverlayArrow>
            )}
            {children}
        </TooltipPrimitive>
    )
}

Tooltip.Trigger = Button
Tooltip.Content = Content

export { Tooltip }
