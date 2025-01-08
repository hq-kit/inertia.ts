import { SearchField, Select, cn } from '@/components/ui'
import { router, usePage } from '@inertiajs/react'
import React from 'react'
import { type Key } from 'react-aria-components'
import { useDebouncedCallback } from 'use-debounce'

const Shows = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
]

interface Props {
    className?: string
}

interface PageOptions {
    show: number
    search: string
}

export default function PageOptions({ className }: Props) {
    const { page_options } = usePage<{ page_options: PageOptions }>().props

    const [show, setShow] = React.useState<Key>(page_options.show || 10)
    const [search, setSearch] = React.useState<string>(
        page_options.search || '',
    )

    function handlePerPage(value: Key) {
        setShow(value)
        if (search.length === 0)
            router.get(
                route(route().current() as string),
                { show: value },
                { preserveState: true },
            )
        else
            router.get(
                route(route().current() as string),
                { q: search, show: value },
                { preserveState: true },
            )
    }

    const handleSearch = useDebouncedCallback((value) => {
        setSearch(value)
        if (value) {
            if (show === 10)
                router.get(
                    route(route().current() as string),
                    { q: value },
                    { preserveState: true },
                )
            else
                router.get(
                    route(route().current() as string),
                    { q: value, show },
                    { preserveState: true },
                )
        } else {
            if (show === 10)
                router.get(
                    route(route().current() as string),
                    {},
                    { preserveState: true },
                )
            else
                router.get(
                    route(route().current() as string),
                    { show },
                    { preserveState: true },
                )
        }
    }, 300)

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
            <SearchField aria-label="Search" onChange={handleSearch} />
        </div>
    )
}
