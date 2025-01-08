import { IconChevronRight } from 'hq-icons';
import type { BreadcrumbProps, BreadcrumbsProps } from 'react-aria-components';
import {
    Breadcrumb,
    Breadcrumbs as BreadcrumbsPrimitive,
    type LinkProps,
} from 'react-aria-components';

import { Link } from './link';
import { cn, ctr } from './utils';

const Breadcrumbs = <T extends object>({
    className,
    ...props
}: BreadcrumbsProps<T>) => {
    return (
        <BreadcrumbsPrimitive
            {...props}
            className={cn('flex items-center gap-2', className)}
        />
    );
};

interface ItemProps extends BreadcrumbProps {
    href?: string;
    separator?: 'slash' | 'chevron' | boolean;
}

const Item = ({
    href,
    separator = true,
    className,
    ...props
}: ItemProps & Partial<Omit<LinkProps, 'className'>>) => {
    const separatorValue = separator === true ? 'chevron' : separator;

    return (
        <Breadcrumb
            {...props}
            className={ctr(className, 'flex items-center gap-2 text-sm')}
        >
            {({ isCurrent }) => (
                <>
                    {<Link href={href} {...props} />}
                    {!isCurrent && separator !== false && (
                        <Separator separator={separatorValue} />
                    )}
                </>
            )}
        </Breadcrumb>
    );
};

const Separator = ({
    separator = 'chevron',
}: {
    separator?: ItemProps['separator'];
}) => {
    return (
        <span
            className={cn(
                '[&>*]:shrink-0 [&>*]:text-muted-foreground [&>[data-slot=icon]]:size-3.5',
            )}
        >
            {separator === 'chevron' && <IconChevronRight />}
            {separator === 'slash' && <span className="select-none">/</span>}
        </span>
    );
};

Breadcrumbs.Item = Item;

export { Breadcrumbs };
