import * as React from 'react';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Heading } from './heading';

const card = tv({
    slots: {
        root: [
            'bg-background w-full card rounded-lg [&:has(table)_.footer]:border-t [&:has(table)]:overflow-hidden text-foreground [&_table]:overflow-hidden',
        ],
        header: 'flex flex-col space-y-1.5 px-6 py-5',
        title: 'sm:leading-6 leading-none font-semibold tracking-tight',
        description: 'text-base text-muted-foreground sm:text-sm',
        content:
            'px-6 pb-6 [&:has(table)_thead]:bg-muted/40 has-[table]:p-0 [&:has(table)+.footer]:py-5 [&:has(table)]:border-t',
        footer: 'footer flex items-center p-6 pt-0',
    },
});

const { root, header, title, description, content, footer } = card();

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    borderless?: boolean;
}

const Card = ({ className, borderless = false, ...props }: CardProps) => {
    return (
        <div
            className={root({
                className: twMerge(
                    clsx(className, !borderless && 'border shadow-sm'),
                ),
            })}
            {...props}
        />
    );
};

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    withoutPadding?: boolean;
}

const Header = ({
    withoutPadding = false,
    className,
    title,
    description,
    children,
    ...props
}: HeaderProps) => (
    <div
        className={header({
            className: twMerge(clsx(className, withoutPadding && 'px-0 pt-0')),
        })}
        {...props}
    >
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
        {!title && typeof children === 'string' ? (
            <Title>{children}</Title>
        ) : (
            children
        )}
    </div>
);

const Title = ({
    className,
    level = 3,
    ...props
}: React.ComponentProps<typeof Heading>) => {
    return (
        <Heading level={level} className={title({ className })} {...props} />
    );
};

const Description = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            {...props}
            slot="description"
            className={description({ className })}
            {...props}
        />
    );
};

const Content = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={content({ className })} {...props} />;
};

const Footer = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={footer({ className })} {...props} />;
};

Card.Content = Content;
Card.Description = Description;
Card.Footer = Footer;
Card.Header = Header;
Card.Title = Title;

export { Card };
