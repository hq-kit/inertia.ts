import type {
    DateValue,
    RangeCalendarProps as RangeCalendarPrimitiveProps,
} from 'react-aria-components'
import {
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    RangeCalendar as RangeCalendarPrimitive,
    Text,
} from 'react-aria-components'
import { twJoin } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { Calendar } from './calendar'
import { ctr, focusRing } from './utils'

const cellRangeStyles = tv({
    extend: focusRing,
    base: 'flex h-full w-full items-center tabular-nums justify-center rounded-lg forced-color-adjust-none',
    variants: {
        selectionState: {
            none: 'group-hover:bg-muted-foreground/15 group-pressed:bg-muted-foreground/20 forced-colors:group-pressed:bg-[Highlight]',
            middle: [
                'group-hover:bg-primary/20 forced-colors:group-hover:bg-[Highlight]',
                'group-invalid:group-hover:bg-red-200 group-invalid:text-red-500 dark:group-invalid:group-hover:bg-red-900 forced-colors:group-invalid:group-hover:bg-[Mark]',
                'group-pressed:bg-primary forced-colors:text-[HighlightText] forced-colors:group-pressed:bg-[Highlight]',
                'group-invalid:group-pressed:bg-red-300 dark:group-invalid:group-pressed:bg-red-800 forced-colors:group-invalid:group-pressed:bg-[Mark]',
            ],
            cap: 'bg-primary text-primary-foreground group-invalid:bg-danger group-invalid:text-danger-foreground forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:group-invalid:bg-[Mark]',
        },
        isDisabled: {
            true: 'text-muted-foreground/70 forced-colors:text-[GrayText]',
        },
    },
})

interface RangeCalendarProps<T extends DateValue>
    extends Omit<RangeCalendarPrimitiveProps<T>, 'visibleDuration'> {
    errorMessage?: string
}

const RangeCalendar = <T extends DateValue>({
    errorMessage,
    className,
    ...props
}: RangeCalendarProps<T>) => {
    return (
        <RangeCalendarPrimitive
            className={ctr(className, 'max-w-[17.5rem] sm:max-w-[15.8rem]')}
            {...props}
        >
            <Calendar.Header type="range-calendar" />
            <CalendarGrid className="[&_td]:border-collapse [&_td]:px-0">
                <Calendar.GridHeader />
                <CalendarGridBody>
                    {(date) => (
                        <CalendarCell
                            date={date}
                            className={twJoin([
                                'group size-10 cursor-default outline outline-0 outside-month:text-zinc-300 selection-start:rounded-s-lg selection-end:rounded-e-lg lg:size-9 lg:text-sm forced-colors:selected:bg-[Highlight] forced-colors:invalid:selected:bg-[Mark]',
                                'selected:bg-primary/10 selected:text-primary dark:selected:bg-primary/15 forced-colors:selected:text-[HighlightText]',
                                '[td:first-child_&]:rounded-s-lg [td:last-child_&]:rounded-e-lg',
                                'invalid:selected:bg-red-100 dark:invalid:selected:bg-red-700/30',
                            ])}
                        >
                            {({
                                formattedDate,
                                isSelected,
                                isSelectionStart,
                                isSelectionEnd,
                                ...renderProps
                            }) => (
                                <span
                                    className={cellRangeStyles({
                                        ...renderProps,
                                        selectionState:
                                            isSelected &&
                                            (isSelectionStart || isSelectionEnd)
                                                ? 'cap'
                                                : isSelected
                                                  ? 'middle'
                                                  : 'none',
                                    })}
                                >
                                    {formattedDate}
                                </span>
                            )}
                        </CalendarCell>
                    )}
                </CalendarGridBody>
            </CalendarGrid>
            {errorMessage && (
                <Text slot="errorMessage" className="text-sm text-danger">
                    {errorMessage}
                </Text>
            )}
        </RangeCalendarPrimitive>
    )
}

export { RangeCalendar }
