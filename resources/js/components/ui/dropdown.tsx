import { IconCheck } from 'hq-icons'
import {
    Collection,
    Header,
    ListBoxItem as ListBoxItemPrimitive,
    type ListBoxItemProps,
    ListBoxSection,
    type ListBoxSectionProps,
    Text,
    type TextProps,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { cn, cr } from './utils'

const dropdownItemStyles = tv({
    base: [
        'group flex cursor-default select-none items-center gap-x-1.5 rounded-[calc(var(--radius)-1px)] py-2 pl-2.5 relative pr-1.5 text-base outline outline-0 forced-color-adjust-none lg:text-sm',
        'has-submenu:open:data-[danger=true]:bg-danger/20 has-submenu:open:data-[danger=true]:text-danger',
        'has-submenu:open:bg-primary has-submenu:open:text-primary-foreground [&[data-has-submenu][data-open]>[data-slot=icon]]:text-primary-foreground',
        '[&_[data-slot=avatar]]:-mr-0.5 [&_[data-slot=avatar]]:size-6 sm:[&_[data-slot=avatar]]:size-5',
        '[&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-muted-foreground [&[data-hovered]>[data-slot=icon]]:text-primary-foreground [&[data-focused]>[data-slot=icon]]:text-primary-foreground [&[data-danger]>[data-slot=icon]]:text-danger/60',
    ],
    variants: {
        isDisabled: {
            false: 'text-foreground',
            true: 'text-muted-foreground forced-colors:text-[GrayText]',
        },
        isFocused: {
            false: 'data-[danger=true]:text-danger',
            true: [
                'bg-primary text-primary-foreground forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
                'data-[danger=true]:bg-danger data-[danger=true]:text-danger-foreground',
                '[&_.text-muted-foreground]:text-primary-foreground/80 [&[data-slot=label]]:text-primary-foreground [&[data-slot=description]]:text-primary-foreground',
            ],
        },
    },
    compoundVariants: [
        {
            isFocused: false,
            isOpen: true,
            className: 'bg-muted',
        },
    ],
})

const dropdownSectionStyles = tv({
    slots: {
        section:
            "-mt-[5px] pb-0.5 xss3 flex flex-col gap-y-0.5 after:content-[''] after:block after:h-[5px]",
        header: 'text-sm d-head font-medium text-muted-foreground bg-background px-4 py-2 truncate min-w-[--trigger-width] sticky -top-[5px] backdrop-blur -mt-px -mb-0.5 -mx-1 z-10 supports-[-moz-appearance:none]:bg-background border-y [&+*]:mt-1',
    },
})

const { section, header } = dropdownSectionStyles()

interface DropdownSectionProps<T> extends ListBoxSectionProps<T> {
    title?: string
}

const DropdownSection = <T extends object>({
    className,
    ...props
}: DropdownSectionProps<T>) => {
    return (
        <ListBoxSection className={section({ className })}>
            {'title' in props && (
                <Header className={header()}>{props.title}</Header>
            )}
            <Collection items={props.items}>{props.children}</Collection>
        </ListBoxSection>
    )
}

const DropdownItem = ({ className, ...props }: ListBoxItemProps) => {
    const textValue =
        props.textValue ||
        (typeof props.children === 'string' ? props.children : undefined)
    return (
        <ListBoxItemPrimitive
            textValue={textValue}
            className={cr(className, (className, renderProps) =>
                dropdownItemStyles({ ...renderProps, className }),
            )}
            {...props}
        >
            {cr(props.children, (children, { isSelected }) => (
                <>
                    <span className="flex flex-1 items-center gap-2 truncate font-normal group-selected:font-medium">
                        {children}
                    </span>

                    {isSelected && (
                        <span className="absolute right-2 top-3 lg:top-2.5">
                            <IconCheck />
                        </span>
                    )}
                </>
            ))}
        </ListBoxItemPrimitive>
    )
}

interface DropdownItemSlot extends TextProps {
    label?: TextProps['children']
    description?: TextProps['children']
    classNames?: {
        label?: TextProps['className']
        description?: TextProps['className']
    }
}

const DropdownItemDetails = ({
    label,
    description,
    classNames,
    ...props
}: DropdownItemSlot) => {
    const { slot, children, title, ...restProps } = props

    return (
        <div className="flex flex-col gap-y-1" {...restProps}>
            {label && (
                <Text
                    slot={slot ?? 'label'}
                    className={cn('font-medium lg:text-sm', classNames?.label)}
                    {...restProps}
                >
                    {label}
                </Text>
            )}
            {description && (
                <Text
                    slot={slot ?? 'description'}
                    className={cn(
                        'text-xs text-muted-foreground',
                        classNames?.description,
                    )}
                    {...restProps}
                >
                    {description}
                </Text>
            )}
            {!title && children}
        </div>
    )
}

export {
    DropdownItem,
    DropdownItemDetails,
    dropdownItemStyles,
    DropdownSection,
    dropdownSectionStyles,
}
