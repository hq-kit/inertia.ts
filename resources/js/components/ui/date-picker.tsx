import React from 'react'

import { IconCalendarDays } from 'hq-icons'
import {
    DatePicker as DatePickerPrimitive,
    type DatePickerProps as DatePickerPrimitiveProps,
    type DateValue,
    type DialogProps,
    type PopoverProps,
    type ValidationResult,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Button } from './button'
import { Calendar } from './calendar'
import { DateInput } from './date-field'
import { Description, FieldError, FieldGroup, Label } from './field'
import { Popover } from './popover'
import { RangeCalendar } from './range-calendar'
import { ctr } from './utils'

const datePickerStyles = tv({
    slots: {
        base: 'group flex flex-col gap-y-1.5',
        datePickerIcon:
            'group mr-1 h-7 [&_[data-slot=icon]]:text-muted-foreground w-8 rounded-lg outline-offset-0 hover:bg-transparent pressed:bg-transparent',
        calendarIcon: 'group-open:text-foreground',
        datePickerInput: 'w-full px-2 text-base lg:text-sm',
        dateRangePickerInputStart: 'px-2 lg:text-sm text-base',
        dateRangePickerInputEnd: 'flex-1 px-2 py-1.5 lg:text-sm text-base',
        dateRangePickerDash:
            'text-foreground group-disabled:opacity-50 forced-colors:text-[ButtonText] group-disabled:forced-colors:text-[GrayText]',
    },
})

const { base, datePickerIcon, calendarIcon, datePickerInput } =
    datePickerStyles()

interface DatePickerOverlayProps
    extends Omit<DialogProps, 'children' | 'className' | 'style'>,
        Omit<PopoverProps, 'children' | 'className' | 'style'> {
    className?: string | ((values: { defaultClassName?: string }) => string)
    children?: React.ReactNode
    closeButton?: boolean
    range?: boolean
}

const DatePickerOverlay = ({
    closeButton = true,
    range,
    ...props
}: DatePickerOverlayProps) => {
    return (
        <Popover.Content
            showArrow={false}
            className="flex justify-center p-4 sm:min-w-[17rem] sm:max-w-[17.2rem] sm:p-2 sm:pt-3"
            {...props}
        >
            {range ? <RangeCalendar /> : <Calendar />}
            {closeButton && (
                <div className="mx-auto flex w-full max-w-[inherit] justify-center py-2.5 sm:hidden">
                    <Popover.Close shape="circle" className="w-full">
                        Close
                    </Popover.Close>
                </div>
            )}
        </Popover.Content>
    )
}

const DatePickerIcon = () => (
    <Button size="icon" variant="ghost" className={datePickerIcon()}>
        <IconCalendarDays aria-hidden className={calendarIcon()} />
    </Button>
)

interface DatePickerProps<T extends DateValue>
    extends DatePickerPrimitiveProps<T> {
    label?: string
    description?: string
    errorMessage?: string | ((validation: ValidationResult) => string)
    portal?: Element
}

const DatePicker = <T extends DateValue>({
    label,
    className,
    description,
    errorMessage,
    ...props
}: DatePickerProps<T>) => {
    return (
        <DatePickerPrimitive {...props} className={ctr(className, base())}>
            {label && <Label>{label}</Label>}
            <FieldGroup className="min-w-40">
                <DateInput className={datePickerInput()} />
                <DatePickerIcon />
            </FieldGroup>
            {description && <Description>{description}</Description>}
            <FieldError>{errorMessage}</FieldError>
            <DatePickerOverlay UNSTABLE_portalContainer={props.portal} />
        </DatePickerPrimitive>
    )
}

export {
    DatePicker,
    DatePickerIcon,
    DatePickerOverlay,
    type DatePickerProps,
    type DateValue,
    type ValidationResult,
}
