import React from 'react'

import {
    DateField as DateFieldPrimitive,
    type DateFieldProps as DateFieldPrimitiveProps,
    DateInput as DateInputPrimitive,
    type DateInputProps,
    DateSegment,
    type DateValue,
    type ValidationResult
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Description, FieldError, FieldGroup, Label } from './field'
import { cn, ctr } from './utils'

interface DateFieldProps<T extends DateValue> extends DateFieldPrimitiveProps<T> {
    label?: string
    description?: string
    errorMessage?: string | ((validation: ValidationResult) => string)
    prefix?: React.ReactNode
    suffix?: React.ReactNode
}

const DateField = <T extends DateValue>({
    prefix,
    suffix,
    label,
    description,
    errorMessage,
    ...props
}: DateFieldProps<T>) => {
    return (
        <DateFieldPrimitive
            {...props}
            className={ctr(props.className, 'flex group flex-col gap-y-1.5')}
        >
            {label && <Label>{label}</Label>}
            <FieldGroup>
                {prefix ? <span data-slot='prefix'>{prefix}</span> : null}
                <DateInput />
                {suffix ? <span data-slot='suffix'>{suffix}</span> : null}
            </FieldGroup>
            {description && <Description>{description}</Description>}
            <FieldError>{errorMessage}</FieldError>
        </DateFieldPrimitive>
    )
}

const segmentStyles = tv({
    base: 'inline shrink-0 sm:uppercase tabular-nums rounded-lg p-0.5 tracking-wider text-foreground caret-transparent outline outline-0 forced-color-adjust-none type-literal:px-0 lg:text-sm forced-colors:text-[ButtonText]',
    variants: {
        isPlaceholder: {
            true: 'text-muted-foreground'
        },
        isDisabled: {
            true: 'text-foreground/50 forced-colors:text-[GrayText]'
        },
        isFocused: {
            true: [
                'bg-primary text-primary-foreground forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
                'invalid:bg-danger invalid:text-danger-foreground'
            ]
        }
    }
})

const DateInput = ({ className, ...props }: Omit<DateInputProps, 'children'>) => {
    return (
        <DateInputPrimitive
            className={cn(
                'bg-transparent p-2 text-base text-foreground placeholder-muted-foreground lg:text-sm',
                className
            )}
            {...props}
        >
            {(segment) => <DateSegment segment={segment} className={segmentStyles} />}
        </DateInputPrimitive>
    )
}

export { DateField, DateInput, segmentStyles, type DateFieldProps }
