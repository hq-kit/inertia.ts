import React from 'react'

import { IconDot } from 'hq-icons'
import { OTPInput, OTPInputContext } from 'input-otp'

import { cn } from './utils'

interface OTPType
    extends React.ForwardRefExoticComponent<
        React.ComponentPropsWithoutRef<typeof OTPInput> & React.RefAttributes<HTMLInputElement>
    > {
    Group: typeof OTPGroup
    Slot: typeof OTPSlot
    Separator: typeof OTPSeparator
}

const OTP = React.forwardRef<
    React.ElementRef<typeof OTPInput>,
    React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
    <OTPInput
        data-1p-ignore
        ref={ref}
        containerClassName={cn(
            'flex items-center gap-2 has-[:disabled]:opacity-50',
            containerClassName
        )}
        className={cn('disabled:cursor-not-allowed', className)}
        {...props}
    />
)) as OTPType
OTP.displayName = 'OTP'

const OTPGroup = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('flex items-center gap-x-1.5', className)} {...props} />
    )
)
OTPGroup.displayName = 'OTPGroup'

const OTPSlot = React.forwardRef<
    React.ElementRef<'div'>,
    React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext)
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

    return (
        <div
            ref={ref}
            className={cn(
                'relative flex tabular-nums size-10 items-center justify-center rounded-lg border border-muted text-sm transition-all',
                isActive && 'z-10 border-primary/70 ring-4 ring-primary/20',
                className
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                    <div className='h-4 w-px animate-caret-blink bg-foreground duration-1000' />
                </div>
            )}
        </div>
    )
})
OTPSlot.displayName = 'OTPSlot'

const OTPSeparator = React.forwardRef<
    React.ElementRef<'div'>,
    React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
    <div ref={ref} role='separator' {...props}>
        <IconDot className='size-2' />
    </div>
))
OTPSeparator.displayName = 'OTPSeparator'

OTP.Group = OTPGroup
OTP.Slot = OTPSlot
OTP.Separator = OTPSeparator

export { OTP }
