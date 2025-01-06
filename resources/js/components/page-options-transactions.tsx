import { DateRangePicker, Select, cn } from '@/components/ui';
import { router, usePage } from '@inertiajs/react';
import { CalendarDate, parseDate } from '@internationalized/date';
import React from 'react';
import { type Key } from 'react-aria-components';
const Shows = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
];

interface Props {
    className?: string;
}

interface PageOptions {
    show: number;
    from: string | null;
    to: string | null;
}

export default function PageOptionsTransaction({ className }: Props) {
    // @ts-expect-error no-type
    const { page_options } = usePage<{ page_options: PageOptions }>().props;

    const [show, setShow] = React.useState<Key>(page_options.show || 10);
    const { from, to } = page_options;

    const [date, setDate] = React.useState<{
        start: CalendarDate | null;
        end: CalendarDate | null;
    }>({
        start: from ? parseDate(from) : null,
        end: to ? parseDate(to) : null,
    });

    function handlePerPage(value: Key) {
        setShow(value);
        router.get(
            route(route().current() as string),
            { show: value },
            { preserveState: true },
        );
    }

    function handelDateRange(value: {
        start: CalendarDate | null;
        end: CalendarDate | null;
    }) {
        setDate(value);
        router.get(
            route(route().current() as string),
            {
                from: value.start?.toString(),
                to: value.end?.toString(),
            },
            { preserveState: true },
        );
    }

    return (
        <div
            className={cn(
                'mb-4 flex flex-row items-center justify-between gap-2',
                className,
            )}
        >
            <Select
                className="w-fit"
                aria-label="Per Page"
                items={Shows}
                selectedKey={show}
                onSelectionChange={handlePerPage}
            >
                {(item) => (
                    <Select.Item id={item.value} textValue={item.label}>
                        {item.label}
                    </Select.Item>
                )}
            </Select>
            <DateRangePicker
                value={date as { start: CalendarDate; end: CalendarDate }}
                onChange={(v) =>
                    handelDateRange(
                        v as {
                            start: CalendarDate | null;
                            end: CalendarDate | null;
                        },
                    )
                }
                aria-label="Date"
            />
        </div>
    );
}
