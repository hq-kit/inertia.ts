import {
    Switch as SwitchPrimitive,
    type SwitchProps as SwitchPrimitiveProps,
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'

const trackStyles = tv({
    base: [
        'mr-2 h-5 w-8 bg-muted cursor-pointer rounded-[calc(var(--radius)+2px)] border-2 border-transparent transition',
        'group-focus:ring-4',
        'group-focus:ring-4 group-invalid:ring-danger/20',
        'group-disabled:cursor-default group-disabled:opacity-50',
    ],
    variants: {
        variant: {
            primary: 'group-selected:bg-primary group-focus:ring-primary/20',
            secondary:
                'group-selected:bg-secondary group-focus:ring-secondary/20',
            success: 'group-selected:bg-success group-focus:ring-success/20',
            danger: 'group-selected:bg-danger group-focus:ring-danger/20',
            warning: 'group-selected:bg-warning group-focus:ring-warning/20',
            muted: 'group-selected:bg-muted-foreground group-focus:ring-foreground/20',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
})

const switchStyles = tv({
    slots: {
        base: 'group inline-flex touch-none lg:text-sm items-center',
        ball: 'group-selected:ml-3 group-selected:group-data-[pressed]:ml-2 group-pressed:w-5 block size-4 origin-right rounded-[calc(var(--radius)+2px)] bg-primary-foreground shadow transition-all',
    },
})

const { base, ball } = switchStyles()

interface SwitchProps
    extends SwitchPrimitiveProps,
        VariantProps<typeof trackStyles> {}

const Switch = ({ children, variant, className, ...props }: SwitchProps) => {
    return (
        <SwitchPrimitive
            {...props}
            className={(values) =>
                base({
                    className:
                        typeof className === 'function'
                            ? className(values)
                            : className,
                })
            }
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            {(values) => (
                <>
                    <span className={trackStyles({ variant })}>
                        <span className={ball()} />
                    </span>
                    {typeof children === 'function'
                        ? children(values)
                        : children}
                </>
            )}
        </SwitchPrimitive>
    )
}

export { Switch }
