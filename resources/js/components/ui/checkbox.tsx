import { IconCheck, IconMinus } from 'hq-icons'
import {
    Checkbox as CheckboxPrimitive,
    CheckboxGroup as CheckboxGroupPrimitive,
    type CheckboxGroupProps as CheckboxGroupPrimitiveProps,
    type CheckboxProps as CheckboxPrimitiveProps,
    type ValidationResult
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Description, FieldError, Label } from './field'
import { cn, cr } from './utils'

interface CheckboxGroupProps extends Omit<CheckboxGroupPrimitiveProps, 'children'> {
    label?: string
    children?: React.ReactNode
    description?: string
    errorMessage?: string | ((validation: ValidationResult) => string)
}

const CheckboxGroup = (props: CheckboxGroupProps) => {
    return (
        <CheckboxGroupPrimitive
            {...props}
            className={cn('group flex flex-col gap-y-1.5', props.className)}
        >
            <Label>{props.label}</Label>
            <>{props.children}</>
            {props.description && <Description className='block'>{props.description}</Description>}
            <FieldError>{props.errorMessage}</FieldError>
        </CheckboxGroupPrimitive>
    )
}

const checkboxStyles = tv({
    base: 'racc group flex items-center gap-1.5 text-sm transition',
    variants: {
        isDisabled: {
            false: 'opacity-100',
            true: 'opacity-50'
        }
    }
})

const boxStyles = tv({
    base: 'flex size-4 [&>svg]:size-3 flex-shrink-0 items-center justify-center rounded-[calc(var(--radius)*0.5)] border text-background transition',
    variants: {
        isSelected: {
            false: 'border-muted',
            true: [
                'border-primary/70 bg-primary text-primary-foreground',
                'group-invalid:border-danger/70 group-invalid:bg-danger group-invalid:text-danger-foreground'
            ]
        },
        isFocused: {
            true: [
                'border-primary/70 ring-4 ring-primary/20',
                'group-invalid:border-danger/70 group-invalid:text-danger-foreground group-invalid:ring-danger/20'
            ]
        },
        isInvalid: {
            true: 'border-danger/70 bg-danger/20 text-danger-foreground ring-danger/20'
        }
    }
})

interface CheckboxProps extends CheckboxPrimitiveProps {
    description?: string
    label?: string
    children?: React.ReactNode
}

const Checkbox = ({ className, description, label, children, ...props }: CheckboxProps) => {
    return (
        <CheckboxPrimitive
            {...props}
            className={cr(className, (className, renderProps) =>
                checkboxStyles({ ...renderProps, className })
            )}
        >
            {({ isSelected, isIndeterminate, ...renderProps }) => (
                <div className={cn('flex gap-x-1.5', description ? 'items-start' : 'items-center')}>
                    <div
                        className={boxStyles({
                            ...renderProps,
                            isSelected: isSelected || isIndeterminate,
                            className: description ? 'mt-1' : 'mt-px'
                        })}
                    >
                        {isIndeterminate ? <IconMinus /> : isSelected ? <IconCheck /> : null}
                    </div>

                    <div className='flex flex-col gap-1'>
                        {label ? <Label>{label}</Label> : children}
                        {description && <Description>{description}</Description>}
                    </div>
                </div>
            )}
        </CheckboxPrimitive>
    )
}

export { Checkbox, CheckboxGroup }
