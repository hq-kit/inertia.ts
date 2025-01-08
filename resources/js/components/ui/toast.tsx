import {
    IconCheck,
    IconCircleAlert,
    IconLoaderCircle,
    IconTriangleAlert,
} from 'hq-icons';
import { Toaster, type ToasterProps } from 'sonner';
import { twJoin } from 'tailwind-merge';

import { useTheme } from '@/components/providers';

import { buttonVariants } from './button';

const Toast = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();
    return (
        <Toaster
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            icons={{
                info: <IconCircleAlert />,
                success: <IconCheck />,
                warning: <IconTriangleAlert />,
                error: <IconTriangleAlert />,
                loading: <IconLoaderCircle className="animate-spin" />,
            }}
            toastOptions={{
                unstyled: true,
                closeButton: true,
                classNames: {
                    toast: twJoin(
                        'bg-background ring-1 ring-foreground/10 dark:ring-inset sm:min-w-[22rem] rounded-lg text-foreground overflow-hidden text-[0.925rem] backdrop-blur-xl px-4 py-3 font-normal sm:px-5 sm:py-5',
                        '[&:has([data-icon])_[data-content]]:ml-5',
                        '[&:has([data-button])_[data-close-button="true"]]:hidden',
                        '[&:not([data-description])_[data-title]]:font-normal',
                        '[&:has([data-description])_[data-title]]:!font-medium [&:has([data-description])_[data-title]]:!text-lg',
                        '[&>[data-button]]:absolute [&>[data-button=true]]:bottom-4',
                        '[&>[data-action=true]]:right-4',
                        '[&>[data-cancel=true]]:left-4',
                    ),
                    icon: 'absolute top-[1rem] sm:top-[1.50rem]',
                    content:
                        '[&:not(:has(+button))]:pr-10 [&:has(+button)]:pb-11 md:[&:has(+button)]:pb-9',
                    error: 'bg-danger ring-danger-foreground/10 text-white ring-inset [&>[data-close-button=true]>svg]:text-white',
                    info: 'bg-info ring-info-foreground/10 text-info-foreground ring-inset [&>[data-close-button=true]>svg]:text-info-foreground',
                    warning:
                        'bg-warning text-warning-foreground ring-warning-foreground/10 ring-inset [&>[data-close-button=true]>svg]:text-warning-foreground',
                    success:
                        'bg-primary ring-primary/50 text-primary-foreground ring-inset [&>[data-close-button=true]>svg]:text-primary-foreground',
                    cancelButton: buttonVariants({
                        className: '',
                        size: 'xs',
                        variant: 'outline',
                    }),
                    actionButton: buttonVariants({
                        className: 'self-end justify-self-end',
                        size: 'xs',
                    }),
                    closeButton: twJoin([
                        '[&_svg]:size-5 size-8 absolute top-1/2 transform -translate-y-1/2 right-2 lg:right-3 left-auto grid place-content-center rounded-lg !bg-transparent hover:!bg-dark/20 dark:hover:!bg-white/20 border-0 [&_svg]:text-foreground',
                    ]),
                },
            }}
            {...props}
        />
    );
};

export { Toast };
