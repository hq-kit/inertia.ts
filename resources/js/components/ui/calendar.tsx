import React from 'react';

import { IconChevronLeft, IconChevronRight } from 'hq-icons';
import { useDateFormatter } from 'react-aria';
import {
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader as CalendarGridHeaderPrimitive,
    CalendarHeaderCell,
    Calendar as CalendarPrimitive,
    type CalendarProps as CalendarPrimitiveProps,
    CalendarStateContext,
    type DateValue,
    Heading,
    RangeCalendarStateContext,
    Text,
    useLocale,
} from 'react-aria-components';
import { CalendarState, RangeCalendarState } from 'react-stately';
import { tv } from 'tailwind-variants';

import { Button } from './button';
import { Menu } from './menu';
import { cr, ctr, focusRing } from './utils';

const cellStyles = tv({
    extend: focusRing,
    base: 'flex size-10 sm:size-9 cursor-default tabular-nums items-center justify-center rounded-lg lg:text-sm forced-colors:outline-0',
    variants: {
        isSelected: {
            false: 'text-foreground forced-colors:text-[ButtonText] hover:bg-secondary-foreground/15 pressed:bg-secondary-foreground/20',
            true: 'bg-primary text-primary-foreground invalid:bg-danger invalid:text-danger-foreground forced-colors:bg-[Highlight] forced-colors:text-[Highlight] forced-colors:invalid:bg-[Mark]',
        },
        isDisabled: {
            true: 'text-muted-foreground/70 forced-colors:text-[GrayText]',
        },
    },
});

interface CalendarProps<T extends DateValue>
    extends Omit<CalendarPrimitiveProps<T>, 'visibleDuration'> {
    errorMessage?: string;
    className?: string;
}

const Calendar = <T extends DateValue>({
    errorMessage,
    className,
    ...props
}: CalendarProps<T>) => {
    return (
        <CalendarPrimitive
            className={ctr(className, 'max-w-[17.5rem] sm:max-w-[15.8rem]')}
            {...props}
        >
            <CalendarHeader type="calendar" />
            <CalendarGrid className="[&_td]:border-collapse [&_td]:px-0">
                <CalendarGridHeader />
                <CalendarGridBody>
                    {(date) => (
                        <CalendarCell
                            date={date}
                            className={cr(className, (className, renderProps) =>
                                cellStyles({
                                    ...renderProps,
                                    className,
                                }),
                            )}
                        />
                    )}
                </CalendarGridBody>
            </CalendarGrid>
            {errorMessage && (
                <Text slot="errorMessage" className="text-sm text-red-600">
                    {errorMessage}
                </Text>
            )}
        </CalendarPrimitive>
    );
};

const calendarHeaderStyles = tv({
    slots: {
        header: 'flex w-full justify-center gap-1 px-1 pb-5 sm:pb-4',
        heading:
            'mr-2 space-x-1 text-muted-foreground tracking-tight flex-1 text-left font-medium',
        calendarGridHeaderCell:
            'text-sm lg:text-xs font-semibold text-muted-foreground',
    },
});

const { header, heading, calendarGridHeaderCell } = calendarHeaderStyles();

const CalendarHeader = ({
    className,
    type,
    ...props
}: {
    type: 'calendar' | 'range-calendar';
} & React.HTMLAttributes<HTMLDivElement>) => {
    const { direction } = useLocale();
    const stateContext =
        type === 'calendar' ? CalendarStateContext : RangeCalendarStateContext;
    const state = React.useContext(
        stateContext as React.Context<CalendarState | RangeCalendarState>,
    );

    return (
        <header className={header({ className })} {...props}>
            {state ? (
                <div className={heading()}>
                    <MonthDropdown {...state} />
                    <YearDropdown {...state} />
                </div>
            ) : (
                <Heading className={heading()} />
            )}
            <div className="flex items-center gap-1">
                <Button
                    size="icon"
                    className="size-8 sm:size-7 [&_[data-slot=icon]]:text-foreground"
                    shape="circle"
                    variant="ghost"
                    slot="previous"
                >
                    {direction === 'rtl' ? (
                        <IconChevronRight />
                    ) : (
                        <IconChevronLeft aria-hidden />
                    )}
                </Button>
                <Button
                    size="icon"
                    className="size-8 sm:size-7 [&_[data-slot=icon]]:text-foreground"
                    shape="circle"
                    variant="ghost"
                    slot="next"
                >
                    {direction === 'rtl' ? (
                        <IconChevronLeft />
                    ) : (
                        <IconChevronRight />
                    )}
                </Button>
            </div>
        </header>
    );
};

const CalendarGridHeader = () => {
    return (
        <CalendarGridHeaderPrimitive>
            {(day) => (
                <CalendarHeaderCell className={calendarGridHeaderCell()}>
                    {day}
                </CalendarHeaderCell>
            )}
        </CalendarGridHeaderPrimitive>
    );
};

const MonthDropdown = (state: CalendarState | RangeCalendarState) => {
    const { timeZone, focusedDate, setFocusedDate } = state;

    const formatter = useDateFormatter({
        month: 'long',
        timeZone: timeZone,
    });

    const months: string[] = [];
    const numMonths = focusedDate.calendar.getMonthsInYear(focusedDate);
    for (let i = 1; i <= numMonths; i++) {
        const date = focusedDate.set({ month: i });
        months.push(formatter.format(date.toDate(timeZone)));
    }

    const onChange = (e: number) => {
        const date = focusedDate.set({ month: e });
        setFocusedDate(date);
    };

    return (
        <Menu aria-label="Month">
            <Menu.Trigger slot={null}>
                {months[focusedDate.month - 1]}
            </Menu.Trigger>
            <Menu.Content
                onAction={(e) => onChange(Number(e))}
                selectedKeys={[focusedDate.month]}
                items={months.map((month, i) => ({
                    value: i + 1,
                    formatted: month,
                }))}
            >
                {(item) => (
                    <Menu.Item id={item.value}>{item.formatted}</Menu.Item>
                )}
            </Menu.Content>
        </Menu>
    );
};

const YearDropdown = (state: CalendarState | RangeCalendarState) => {
    const { timeZone, focusedDate, setFocusedDate } = state;
    const formatter = useDateFormatter({
        year: 'numeric',
        timeZone: timeZone,
    });

    const years: string[] = [];
    for (let i = -20; i <= 20; i++) {
        const date = focusedDate.add({ years: i });
        years.push(formatter.format(date.toDate(timeZone)));
    }

    const onChange = (e: number) => {
        const date = focusedDate.set({ year: e });
        setFocusedDate(date);
    };

    return (
        <Menu aria-label="Year">
            <Menu.Trigger slot={null}>{years[20]}</Menu.Trigger>
            <Menu.Content
                onAction={(e) => onChange(Number(e))}
                selectedKeys={[focusedDate.year]}
                items={years.map((year) => ({ value: year }))}
            >
                {(item) => <Menu.Item id={item.value}>{item.value}</Menu.Item>}
            </Menu.Content>
        </Menu>
    );
};

Calendar.Header = CalendarHeader;
Calendar.GridHeader = CalendarGridHeader;
export { Calendar };
