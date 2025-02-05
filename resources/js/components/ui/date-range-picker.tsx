import {
    DateRangePicker as DateRangePickerPrimitive,
    type DateRangePickerProps as DateRangePickerPrimitiveProps,
    type DateValue,
    type ValidationResult,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { DateInput } from './date-field'
import { DatePickerIcon, DatePickerOverlay } from './date-picker'
import { Description, FieldError, FieldGroup, Label } from './field'
import { ctr } from './utils'

const dateRangePickerStyles = tv({
    slots: {
        base: 'group flex flex-col gap-y-1.5',
        dateRangePickerInputStart: 'px-2 lg:text-sm tabular-nums text-base',
        dateRangePickerInputEnd:
            'flex-1 px-2 py-1.5 tabular-nums text-base lg:text-sm',
        dateRangePickerDash:
            'text-foreground group-disabled:text-muted-foreground forced-colors:text-[ButtonText] group-disabled:forced-colors:text-[GrayText]',
    },
})
const {
    base,
    dateRangePickerInputStart,
    dateRangePickerInputEnd,
    dateRangePickerDash,
} = dateRangePickerStyles()

interface DateRangePickerProps<T extends DateValue>
    extends DateRangePickerPrimitiveProps<T> {
    label?: string
    description?: string
    errorMessage?: string | ((validation: ValidationResult) => string)
}

const DateRangePicker = <T extends DateValue>({
    label,
    className,
    description,
    errorMessage,
    ...props
}: DateRangePickerProps<T>) => {
    return (
        <DateRangePickerPrimitive {...props} className={ctr(className, base())}>
            {label && <Label>{label}</Label>}
            <FieldGroup className="w-auto min-w-40">
                <DateInput
                    slot="start"
                    className={dateRangePickerInputStart()}
                />
                <span aria-hidden="true" className={dateRangePickerDash()}>
                    –
                </span>
                <DateInput slot="end" className={dateRangePickerInputEnd()} />
                <DatePickerIcon />
            </FieldGroup>
            {description && <Description>{description}</Description>}
            <FieldError>{errorMessage}</FieldError>
            <DatePickerOverlay range />
        </DateRangePickerPrimitive>
    )
}

export { DateRangePicker, type DateRangePickerProps }
