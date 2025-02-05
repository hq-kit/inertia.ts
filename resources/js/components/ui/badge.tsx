import React from 'react'

import { tv, type VariantProps } from 'tailwind-variants'

const badgeVariants = tv({
    base: 'inline-flex items-center outline-none transition-colors gap-x-1.5 py-0.5 text-xs/5 font-medium [&_svg]:size-3',
    variants: {
        variant: {
            primary:
                'ring-primary/30 bg-primary/10 dark:bg-primary/15 text-primary hover:bg-primary/15 dark:hover:bg-primary/10',
            secondary:
                'bg-secondary/50 ring-secondary-foreground/20 text-secondary-foreground',
            success:
                'dark:ring-success/30 ring-success/40 bg-success/10 dark:bg-success/15 text-success hover:bg-success/15 dark:hover:bg-success/10',
            info: 'dark:ring-info/30 ring-info/80 bg-info/20 dark:bg-info/15 text-info hover:bg-info/15 dark:hover:bg-info/10',
            warning:
                'dark:ring-warning/40 ring-warning/50 bg-warning/10 dark:bg-warning/15 text-warning hover:bg-warning/15 dark:hover:bg-warning/10',
            danger: 'dark:ring-danger/30 ring-danger/40 bg-danger/10 dark:bg-danger/15 text-danger hover:bg-danger/15 dark:hover:bg-danger/10',
            dark: 'bg-dark hover:bg-dark/90 ring-inset ring-dark/50 text-dark-foreground',
            outline:
                'bg-transparent ring-inset ring-foreground/50 text-foreground',
        },
        shape: {
            square: 'rounded-lg px-1.5',
            circle: 'px-2 rounded-full',
        },
    },
    defaultVariants: {
        variant: 'primary',
        shape: 'square',
    },
})

interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
    className?: string
    children: React.ReactNode
}

const Badge = ({
    children,
    variant,
    shape,
    className,
    ...props
}: BadgeProps) => {
    return (
        <span
            {...props}
            className={badgeVariants({ variant, shape, className })}
        >
            {children}
        </span>
    )
}

export { Badge, badgeVariants }
