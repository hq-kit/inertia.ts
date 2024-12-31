import { cn, Pagination, useMediaQuery } from '@/components/ui';

interface Paginate {
    meta: {
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
        path: string;
        per_page: number;
        links: {
            active: boolean;
            label: string;
            url: string | null;
        }[];
    };
    links: {
        first: string | null;
        last: string | null;
        next: string | null;
        prev: string | null;
    };
}

interface PaginateProps extends Paginate {
    className?: string;
    only?: string[];
}

export default function Paginator({
    className,
    only,
    meta,
    links,
}: PaginateProps) {
    const isDesktop = useMediaQuery('(min-width: 1500px)');
    const routerOptions = {
        only: only,
        preserveScroll: true,
        preserveState: true,
    };
    return (
        <div
            className={cn(
                'mt-6 flex w-full flex-col-reverse items-center gap-3 xl:flex-row xl:justify-between',
                className,
            )}
        >
            <div>
                Showing {meta.from} to {meta.to} of {meta.total} results
            </div>
            <div>
                <Pagination>
                    {isDesktop ? (
                        <Pagination.List>
                            <Pagination.Item
                                routerOptions={routerOptions}
                                role="first"
                                isDisabled={!links.prev}
                                href={links.first ?? '#'}
                            />
                            <Pagination.Item
                                routerOptions={routerOptions}
                                role="previous"
                                isDisabled={!links.prev}
                                href={links.prev ?? '#'}
                            />
                            {meta.links.map(
                                (link, i) =>
                                    link.label.length <= 3 && (
                                        <Pagination.Item
                                            routerOptions={routerOptions}
                                            key={i}
                                            isCurrent={link.active}
                                            href={link.url ?? '#'}
                                        >
                                            {link.label}
                                        </Pagination.Item>
                                    ),
                            )}
                            <Pagination.Item
                                routerOptions={routerOptions}
                                role="next"
                                isDisabled={!links.next}
                                href={links.next ?? '#'}
                            />
                            <Pagination.Item
                                routerOptions={routerOptions}
                                role="last"
                                isDisabled={!links.next}
                                href={links.last ?? '#'}
                            />
                        </Pagination.List>
                    ) : (
                        <Pagination.List>
                            <Pagination.Item
                                routerOptions={routerOptions}
                                role="first"
                                isDisabled={!links.prev}
                                href={links.first ?? '#'}
                            />
                            <Pagination.Item
                                routerOptions={routerOptions}
                                role="previous"
                                isDisabled={!links.prev}
                                href={links.prev ?? '#'}
                            />
                            <Pagination.Section
                                aria-label="Pagination. Segment"
                                className="rounded-lg border"
                            >
                                <Pagination.Item role="label">
                                    {meta.current_page}
                                </Pagination.Item>
                                <Pagination.Item role="separator" />
                                <Pagination.Item
                                    className="text-muted-foreground"
                                    role="label"
                                >
                                    {meta.last_page}
                                </Pagination.Item>
                            </Pagination.Section>
                            <Pagination.Item
                                routerOptions={routerOptions}
                                role="next"
                                isDisabled={!links.next}
                                href={links.next ?? '#'}
                            />
                            <Pagination.Item
                                routerOptions={routerOptions}
                                role="last"
                                isDisabled={!links.next}
                                href={links.last ?? '#'}
                            />
                        </Pagination.List>
                    )}
                </Pagination>
            </div>
        </div>
    );
}
