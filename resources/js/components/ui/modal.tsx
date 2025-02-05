import React from 'react'

import {
    DialogTrigger,
    ModalOverlay as ModalOverlayPrimitive,
    Modal as ModalPrimitive,
    type DialogProps,
    type DialogTriggerProps,
    type ModalOverlayProps,
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'

import { Dialog } from './dialog'
import { cr } from './utils'

const modalOverlayStyles = tv({
    base: [
        'fixed left-0 top-0 isolate z-50 h-[--visual-viewport-height] w-full',
        'flex items-end text-center sm:block',
        '[--visual-viewport-vertical-padding:16px] sm:[--visual-viewport-vertical-padding:32px]',
    ],
    variants: {
        isBlurred: {
            true: 'backdrop-blur',
            false: 'bg-dark/15 dark:bg-dark/40',
        },
        isEntering: {
            true: 'ease-out animate-in fade-in',
        },
        isExiting: {
            true: 'duration-200 ease-in animate-out fade-out',
        },
    },
})
const modalContentStyles = tv({
    base: [
        'max-h-full w-full rounded-t-lg ring-1 ring-dark/5 bg-background text-foreground text-left align-middle shadow-lg',
        'dark:ring-muted sm:rounded-lg overflow-hidden',
        'sm:fixed sm:left-[50vw] sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
    ],
    variants: {
        isEntering: {
            true: [
                'animate-in ease-out duration-200 slide-in-from-bottom-[20%]',
                'sm:slide-in-from-bottom-auto sm:slide-in-from-top-[80%] sm:slide-in-from-left-1/2',
            ],
        },
        isExiting: {
            true: [
                'duration-200 ease-in animate-out slide-out-to-bottom-56',
                'sm:exiting:slide-out-to-top-[80%] sm:slide-out-to-left-1/2',
            ],
        },
        size: {
            xs: 'sm:max-w-xs',
            sm: 'sm:max-w-sm',
            md: 'sm:max-w-md',
            lg: 'sm:max-w-lg sm:has-[[role=alertdialog]]:max-w-lg sm:has-[[role=dialog]]:max-w-lg',
            xl: 'sm:max-w-xl',
            '2xl': 'sm:max-w-2xl',
            '3xl': 'sm:max-w-3xl',
            '4xl': 'sm:max-w-4xl',
            '5xl': 'sm:max-w-5xl',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
})

type ModalProps = DialogTriggerProps
const Modal = (props: ModalProps) => {
    return <DialogTrigger {...props} />
}

interface ModalContentProps
    extends Omit<React.ComponentProps<typeof Modal>, 'children'>,
        Omit<ModalOverlayProps, 'className'>,
        VariantProps<typeof modalContentStyles> {
    'aria-label'?: DialogProps['aria-label']
    'aria-labelledby'?: DialogProps['aria-labelledby']
    role?: DialogProps['role']
    closeButton?: boolean
    isBlurred?: boolean
    classNames?: {
        overlay?: ModalOverlayProps['className']
        content?: ModalOverlayProps['className']
    }
}

const ModalContent = ({
    classNames,
    isDismissable = true,
    isBlurred = false,
    children,
    size,
    role,
    closeButton = true,
    ...props
}: ModalContentProps) => {
    const _isDismissable = role === 'alertdialog' ? false : isDismissable
    return (
        <ModalOverlayPrimitive
            isDismissable={_isDismissable}
            className={cr(classNames?.overlay, (className, renderProps) => {
                return modalOverlayStyles({
                    ...renderProps,
                    isBlurred,
                    className,
                })
            })}
            {...props}
        >
            <ModalPrimitive
                className={cr(classNames?.content, (className, renderProps) =>
                    modalContentStyles({
                        ...renderProps,
                        size,
                        className,
                    }),
                )}
                {...props}
            >
                {(values) => (
                    <Dialog role={role}>
                        {typeof children === 'function'
                            ? children(values)
                            : children}
                        {closeButton && (
                            <Dialog.CloseIndicator
                                close={values.state.close}
                                isDismissable={_isDismissable}
                            />
                        )}
                    </Dialog>
                )}
            </ModalPrimitive>
        </ModalOverlayPrimitive>
    )
}

Modal.Trigger = Dialog.Trigger
Modal.Header = Dialog.Header
Modal.Title = Dialog.Title
Modal.Description = Dialog.Description
Modal.Footer = Dialog.Footer
Modal.Body = Dialog.Body
Modal.Close = Dialog.Close
Modal.Content = ModalContent

export { Modal, modalContentStyles, modalOverlayStyles }
