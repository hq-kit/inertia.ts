import React from 'react'

import { IconX } from 'hq-icons'
import {
    Button,
    TagGroup as TagGroupPrimitive,
    type TagGroupProps as TagGroupPrimitiveProps,
    TagList as TagListPrimitive,
    type TagListProps,
    Tag as TagPrimitive,
    type TagProps as TagPrimitiveProps,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { badgeVariants } from './badge'
import { Description, Label } from './field'
import { cn, cr } from './utils'

const { variant } = badgeVariants.variants

const variants = {
    primary: {
        base: [
            variant.primary,
            '[&_[slot=remove]:hover]:bg-primary [&_[slot=remove]:hover]:text-primary-foreground',
        ],
        selected: [
            'bg-primary dark:hover:bg-primary dark:bg-primary hover:bg-primary ring-primary ring-inset text-primary-foreground dark:text-primary-foreground hover:text-primary-foreground',
            '[&_[slot=remove]:hover]:bg-primary-foreground/80 [&_[slot=remove]:hover]:text-primary',
        ],
    },
    secondary: {
        base: [
            variant.secondary,
            '[&_[slot=remove]:hover]:bg-foreground [&_[slot=remove]:hover]:text-background',
        ],
        selected: [
            'bg-foreground ring-foreground/50 text-background dark:bg-foreground/90 dark:text-secondary ring-inset',
            '[&_[slot=remove]:hover]:bg-background [&_[slot=remove]:hover]:text-secondary-foreground',
        ],
    },
    success: {
        base: [
            variant.success,
            '[&_[slot=remove]:hover]:bg-success [&_[slot=remove]:hover]:text-success-foreground',
        ],
        selected: [
            'bg-success dark:bg-success ring-success ring-inset dark:text-success-foreground dark:hover:bg-success hover:bg-success text-success-foreground hover:text-success-foreground',
            '[&_[slot=remove]:hover]:bg-success-foreground/80 [&_[slot=remove]:hover]:text-success',
        ],
    },
    warning: {
        base: [
            variant.warning,
            '[&_[slot=remove]:hover]:bg-warning [&_[slot=remove]:hover]:text-warning-foreground',
        ],
        selected: [
            'bg-warning dark:hover:bg-warning dark:bg-warning dark:text-background hover:bg-warning text-warning-foreground hover:text-warning-foreground',
            '[&_[slot=remove]:hover]:bg-warning-foreground/80 [&_[slot=remove]:hover]:text-warning',
        ],
    },
    danger: {
        base: [
            variant.danger,
            '[&_[slot=remove]:hover]:bg-danger [&_[slot=remove]:hover]:text-danger-foreground',
        ],
        selected: [
            'bg-danger dark:bg-danger dark:hover:bg-danger/90 hover:bg-danger text-danger-foreground ring-danger hover:text-danger-foreground',
            '[&_[slot=remove]:hover]:bg-danger-foreground/80 [&_[slot=remove]:hover]:text-danger',
        ],
    },
    info: {
        base: [
            variant.info,
            '[&_[slot=remove]:hover]:bg-info [&_[slot=remove]:hover]:text-info-foreground',
        ],
        selected: [
            'bg-info dark:bg-info dark:hover:bg-info/90 hover:bg-info text-info-foreground ring-info hover:text-info-foreground',
            '[&_[slot=remove]:hover]:bg-info-foreground/80 [&_[slot=remove]:hover]:text-info',
        ],
    },
    dark: {
        base: [variant.dark],
        selected: [
            'bg-dark hover:bg-dark/90 ring-inset ring-dark/50 text-dark-foreground',
            '[&_[slot=remove]:hover]:bg-dark-foreground/80 [&_[slot=remove]:hover]:text-dark',
        ],
    },
    outline: {
        base: [variant.outline],
        selected: [
            'bg-transparent ring-inset ring-foreground/50 text-foreground',
            '[&_[slot=remove]:hover]:bg-foreground/80 [&_[slot=remove]:hover]:text-foreground',
        ],
    },
}

type RestrictedVariant = 'primary' | 'secondary'
type Variant = keyof typeof variant
type Shape = keyof typeof badgeVariants.variants.shape

type TagGroupContextValue = {
    variant: Variant
    shape: Shape
}

const TagGroupContext = React.createContext<TagGroupContextValue>({
    variant: 'primary',
    shape: 'square',
})

export interface TagGroupProps extends TagGroupPrimitiveProps {
    variant?: Variant
    shape?: Shape
    errorMessage?: string
    label?: string
    description?: string
}

const TagGroup = ({ children, ...props }: TagGroupProps) => {
    return (
        <TagGroupPrimitive
            {...props}
            className={cn('flex flex-col flex-wrap gap-1.5', props.className)}
        >
            <TagGroupContext.Provider
                value={{
                    variant: props.variant || 'primary',
                    shape: props.shape || 'square',
                }}
            >
                {props.label && <Label>{props.label}</Label>}
                {children}
                {props.description && (
                    <Description>{props.description}</Description>
                )}
            </TagGroupContext.Provider>
        </TagGroupPrimitive>
    )
}

const TagList = <T extends object>({
    className,
    ...props
}: TagListProps<T>) => {
    return (
        <TagListPrimitive
            {...props}
            className={cn('flex flex-wrap gap-2', className)}
        />
    )
}

const tagStyles = tv({
    base: [badgeVariants.base, 'cursor-pointer tag'],
    variants: {
        isFocused: { true: 'border-ring/85 ring-1' },
        isInvalid: { true: 'border-danger' },
        isDisabled: { true: 'opacity-50 cursor-default' },
        allowsRemoving: { true: 'pr-1' },
    },
})

interface TagProps extends TagPrimitiveProps {
    variant?: Variant
    shape?: Shape
}

const TagItem = ({
    children,
    className,
    variant,
    shape,
    ...props
}: TagProps) => {
    const textValue = typeof children === 'string' ? children : undefined
    const groupContext = React.useContext(TagGroupContext)

    return (
        <TagPrimitive
            textValue={textValue}
            {...props}
            className={cr(className, (_, renderProps) => {
                const finalVariant = variant || groupContext.variant
                const finalShape = shape || groupContext.shape
                return tagStyles({
                    ...renderProps,
                    className: cn([
                        variants[finalVariant as Variant]?.base,
                        badgeVariants.variants.shape[finalShape as Shape],
                        renderProps.isSelected
                            ? variants[finalVariant as Variant].selected
                            : undefined,
                    ]),
                })
            })}
        >
            {({ allowsRemoving }) => {
                return (
                    <>
                        {children as React.ReactNode}
                        {allowsRemoving && (
                            <Button
                                slot="remove"
                                className={cn(
                                    '-mr-0.5 grid size-3.5 place-content-center rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-primary',
                                    className,
                                )}
                            >
                                <span className="-mr-px shrink-0 text-base/4">
                                    <IconX className="size-3" />
                                </span>
                            </Button>
                        )}
                    </>
                )
            }}
        </TagPrimitive>
    )
}

const Tag = {
    Group: TagGroup,
    Item: TagItem,
    List: TagList,
}

export { Tag, type RestrictedVariant }
