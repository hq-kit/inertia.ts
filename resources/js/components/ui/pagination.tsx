import React from 'react'

import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconEllipsis,
} from 'hq-icons'
import {
    ListBox,
    ListBoxItem,
    ListBoxSection,
    Separator,
    type ListBoxItemProps,
    type ListBoxProps,
    type ListBoxSectionProps,
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'

import { buttonVariants } from './button'
import { cn, cr } from './utils'

const paginationStyles = tv({
    slots: {
        pagination: 'mx-auto flex w-full justify-center gap-[5px]',
        section: 'flex h-9 gap-[5px]',
        list: 'flex flex-row items-center gap-[5px]',
        itemButton:
            'focus-visible:border-primary text-foreground font-normal cursor-pointer focus:outline-none focus-visible:bg-primary/10 focus-visible:ring-4 focus-visible:ring-primary/20',
        itemLabel: 'h-9 px-3.5 tabular-nums grid place-content-center',
        itemSeparator: 'h-9 grid place-content-center',
        itemEllipsis:
            'flex items-center justify-center focus-visible:border-primary rounded-lg border border-transparent focus:outline-none size-9 focus-visible:bg-primary/10 focus-visible:ring-4 focus-visible:ring-primary/20',
        itemEllipsisIcon: 'flex size-9 items-center justify-center',
        defaultItem:
            'focus-visible:border-primary focus:outline-none size-9 tabular-nums font-normal cursor-pointer disabled:cursor-default focus-visible:bg-primary/10 focus-visible:ring-4 focus-visible:ring-primary/20 disabled:opacity-100',
        itemSeparatorLine:
            'h-5 w-[1.5px] bg-secondary-foreground/40 rotate-[14deg] shrink-0',
    },
})

const {
    pagination,
    section,
    list,
    itemButton,
    itemLabel,
    itemSeparator,
    itemEllipsis,
    itemEllipsisIcon,
    defaultItem,
    itemSeparatorLine,
} = paginationStyles()

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={pagination({ className })}
        {...props}
    />
)

const PaginationSection = <T extends object>({
    className,
    ...props
}: ListBoxSectionProps<T>) => (
    <ListBoxSection {...props} className={section({ className })} />
)

const List = <T extends object>({ className, ...props }: ListBoxProps<T>) => {
    return (
        <ListBox
            orientation="horizontal"
            aria-label={props['aria-label'] || 'Pagination'}
            layout="grid"
            className={cr(className, (className) => list({ className }))}
            {...props}
        />
    )
}

const renderListItem = (
    props: ListBoxItemProps & {
        textValue?: string
        'aria-current'?: string | undefined
        isDisabled?: boolean
        className?: string
    },
    children: React.ReactNode,
) => <ListBoxItem {...props}>{children}</ListBoxItem>

interface PaginationItemProps
    extends ListBoxItemProps,
        VariantProps<typeof buttonVariants> {
    children?: React.ReactNode
    className?: string
    isCurrent?: boolean
    role?:
        | 'label'
        | 'separator'
        | 'ellipsis'
        | 'default'
        | 'last'
        | 'first'
        | 'previous'
        | 'next'
}

const Item = ({
    role = 'default',
    size = 'sm',
    variant = 'outline',
    className,
    isCurrent,
    children,
    ...props
}: PaginationItemProps) => {
    const textValue =
        typeof children === 'string'
            ? children
            : typeof children === 'number'
              ? children.toString()
              : undefined

    const renderPaginationIndicator = (indicator: React.ReactNode) =>
        renderListItem(
            {
                textValue: variant,
                'aria-current': isCurrent ? 'page' : undefined,
                isDisabled: isCurrent,
                className: cn(
                    buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                        className: itemButton(),
                    }),
                    className,
                ),
                ...props,
            },
            indicator,
        )

    switch (role) {
        case 'label':
            return renderListItem(
                {
                    textValue: textValue,
                    className: itemLabel({ className }),
                    ...props,
                },
                children,
            )
        case 'separator':
            return renderListItem(
                {
                    textValue: 'Separator',
                    className: itemSeparator({ className }),
                    ...props,
                },
                <Separator
                    orientation="vertical"
                    className={itemSeparatorLine()}
                />,
            )
        case 'ellipsis':
            return renderListItem(
                {
                    textValue: 'More pages',
                    className: itemEllipsis({ className }),
                    ...props,
                },
                <span aria-hidden className={itemEllipsisIcon({ className })}>
                    <IconEllipsis />
                </span>,
            )
        case 'previous':
            return renderPaginationIndicator(<IconChevronLeft />)
        case 'next':
            return renderPaginationIndicator(<IconChevronRight />)
        case 'first':
            return renderPaginationIndicator(<IconChevronsLeft />)
        case 'last':
            return renderPaginationIndicator(<IconChevronsRight />)
        default:
            return renderListItem(
                {
                    textValue: textValue,
                    'aria-current': isCurrent ? 'page' : undefined,
                    isDisabled: isCurrent,
                    className: cn(
                        buttonVariants({
                            variant: isCurrent ? 'primary' : variant,
                            size,
                            className: defaultItem({ className }),
                        }),
                        className,
                    ),
                    ...props,
                },
                children,
            )
    }
}

Pagination.Item = Item
Pagination.List = List
Pagination.Section = PaginationSection

export { Pagination }
