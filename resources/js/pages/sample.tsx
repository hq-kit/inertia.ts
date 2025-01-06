import React from 'react';

import { DateRangePicker, TextField } from '@/components/ui';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';

export default function DateRangePickerControlledDemo() {
    const now = today(getLocalTimeZone());
    const tomorrowWeek = today(getLocalTimeZone()).add({ days: 12 });

    const [value, setValue] = React.useState({
        start: now,
        end: tomorrowWeek,
    });

    const [date, setDate] = React.useState(
        today(getLocalTimeZone()).toString(),
    );

    console.log(parseDate(date));

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="space-y-3">
                <div className="divide-y [&_p]:py-2">
                    <p>
                        {value
                            ? `${value.start.toString()} to ${value.end.toString()}`
                            : '-- to --'}
                    </p>
                </div>
                <DateRangePicker
                    value={value}
                    onChange={(newValue) => setValue(newValue!)}
                    label="Event date"
                />
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e!)}
                />
            </div>
        </div>
    );
}
