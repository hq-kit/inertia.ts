import React from 'react'

import { IconMenu } from 'hq-icons'
import {
    Button,
    GridListItem,
    GridList as GridListPrimitive,
    type GridListItemProps,
    type GridListProps,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Checkbox } from './checkbox'
import { cr } from './utils'

const gridListStyles = tv({
    base: 'relative group flex [&>[data-drop-target]]:border [&>[data-drop-target]]:border-primary has-[[data-slot=icon]]:[&_[slot=drag]]:sr-only',
    variants: {
        layout: {
            stack: 'flex-col',
            grid: 'flex-wrap gap-2',
        },
    },
})

const GridList = <T extends object>({
    children,
    className,
    ...props
}: GridListProps<T>) => {
    return (
        <GridListPrimitive
            className={cr(className, (className, renderProps) =>
                gridListStyles({ ...renderProps, className }),
            )}
            {...props}
        >
            {children}
        </GridListPrimitive>
    )
}

const itemStyles = tv({
    base: [
        'relative group transition outline-none flex items-center cursor-default h-fit select-none gap-3 px-3 -mb-px py-2 lg:text-sm text-foreground -outline-offset-2',
        'group-data-[layout=stack]:last:mb-0 group-data-[layout=stack]:border-y',
        'group-data-[layout=grid]:has-[[data-slot=icon]]:w-32 group-data-[layout=grid]:has-[[data-slot=icon]]:p-2',
        'group-data-[layout=grid]:rounded-lg group-data-[layout=grid]:flex-col group-data-[layout=grid]:text-center group-data-[layout=grid]:text-wrap group-data-[layout=grid]:[&>div>[data-slot=icon]]:size-10 group-data-[layout=grid]:[&_[data-slot=icon]]:shrink-0',
    ],
    variants: {
        isHovered: { true: 'bg-primary/10' },
        isSelected: {
            true: 'bg-primary/20 z-20 border-muted/50',
        },
        isFocused: {
            true: 'outline-none',
        },
        isFocusVisible: {
            true: 'ring-1 ring-primary outline-none',
        },
        isDisabled: {
            true: 'text-muted-foreground',
        },
    },
})

const Item = ({ className, ...props }: GridListItemProps) => {
    const textValue =
        typeof props.children === 'string' ? props.children : undefined
    return (
        <GridListItem
            textValue={textValue}
            {...props}
            className={cr(className, (className, renderProps) =>
                itemStyles({ ...renderProps, className }),
            )}
        >
            {({ selectionMode, selectionBehavior, allowsDragging }) => (
                <>
                    {allowsDragging && (
                        <Button
                            slot="drag"
                            className="cursor-grab group-data-[layout=grid]:sr-only dragging:cursor-grabbing [&>[data-slot=icon]]:text-muted-foreground"
                        >
                            <IconMenu />
                        </Button>
                    )}
                    {selectionMode === 'multiple' &&
                        selectionBehavior === 'toggle' && (
                            <Checkbox className="-mr-2" slot="selection" />
                        )}
                    {props.children as React.ReactNode}
                </>
            )}
        </GridListItem>
    )
}

const EmptyState = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div className="p-6" {...props} />
)

GridList.Item = Item
GridList.EmptyState = EmptyState

export { GridList }
