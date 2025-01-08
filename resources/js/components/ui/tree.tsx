import React from 'react'

import { IconMinus } from 'hq-icons'
import type {
    ButtonProps,
    TreeItemProps,
    TreeProps,
} from 'react-aria-components'
import {
    Button,
    UNSTABLE_TreeItemContent as TreeItemContent,
    UNSTABLE_TreeItem as TreeItemPrimitive,
    UNSTABLE_Tree as TreePrimitive,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Checkbox } from './checkbox'
import { cr } from './utils'

const treeStyles = tv({
    base: 'flex border max-h-96 min-w-72 py-2 rounded-lg bg-background cursor-default lg:text-sm flex-col overflow-auto outline-none',
    variants: {
        isFocusVisible: {
            true: 'outline-offset-[-1px] outline-2 outline-primary',
        },
    },
})

const Tree = <T extends object>({ className, ...props }: TreeProps<T>) => {
    return (
        <TreePrimitive
            className={cr(className, (className, renderProps) =>
                treeStyles({
                    ...renderProps,
                    className,
                }),
            )}
            {...props}
        >
            {props.children}
        </TreePrimitive>
    )
}

const itemStyles = tv({
    base: [
        '[&_[slot=chevron]_.indicator]:-rotate-90 outline-none [--padding:20px] p-[0.286rem_0.286rem_0.286rem_0.571rem] pl-[calc((var(--tree-item-level)-1)*20px+0.571rem+var(--padding))]',
        '[&_[slot=chevron]]:outline-none [&_[slot=chevron]_svg]:text-muted-foreground',
        'data-[has-child-rows]:[--padding:0px]',
    ],
    variants: {
        isExpanded: {
            true: '[&_[slot=chevron]_svg]:text-foreground [&_[slot=chevron]_.indicator]:rotate-0 [&_[slot=chevron]_svg]:transition',
        },
        isFocusVisible: {
            true: '[&_[slot=chevron]_svg]:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary',
        },
        isDisabled: {
            true: 'opacity-50',
        },
    },
})

const TreeItem = <T extends object>({
    className,
    ...props
}: TreeItemProps<T>) => {
    return (
        <TreeItemPrimitive
            className={cr(className, (className, renderProps) =>
                itemStyles({
                    ...renderProps,
                    className,
                }),
            )}
            {...props}
        >
            {props.children}
        </TreeItemPrimitive>
    )
}

const ItemContent = (props: React.ComponentProps<typeof TreeItemContent>) => (
    <TreeItemContent {...props}>
        <div className="flex items-center">
            <>{props.children as React.ReactNode}</>
        </div>
    </TreeItemContent>
)

const Indicator = () => (
    <Button className="relative shrink-0" slot="chevron">
        <div className="indicator relative ml-auto flex size-5 items-center justify-center">
            <IconMinus className="absolute size-3" />
            <IconMinus className="indicator absolute size-3" />
        </div>
    </Button>
)

const ItemCheckbox = () => <Checkbox slot="selection" />

const ItemLabel = (props: ButtonProps) => (
    <Button
        style={{
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        }}
        {...props}
    />
)

TreeItem.Label = ItemLabel
TreeItem.Indicator = Indicator
TreeItem.Checkbox = ItemCheckbox
TreeItem.Content = ItemContent

export { Tree, TreeItem }
