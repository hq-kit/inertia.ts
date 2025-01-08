import React from 'react';

import type {
    RadioGroupProps as RadioGroupPrimitiveProps,
    RadioProps as RadioPrimitiveProps,
    ValidationResult,
} from 'react-aria-components';
import {
    RadioGroup as RadioGroupPrimitive,
    Radio as RadioPrimitive,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { Description, FieldError, Label } from './field';
import { ctr } from './utils';

interface RadioGroupProps extends Omit<RadioGroupPrimitiveProps, 'children'> {
    label?: string;
    children?: React.ReactNode;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
}

const RadioGroup = ({
    label,
    description,
    errorMessage,
    children,
    ...props
}: RadioGroupProps) => {
    return (
        <RadioGroupPrimitive
            {...props}
            className={ctr(props.className, 'group flex flex-col gap-1.5')}
        >
            {label && <Label>{label}</Label>}
            <div className="flex select-none gap-1.5 group-orientation-horizontal:flex-wrap group-orientation-horizontal:gap-1.5 group-orientation-vertical:flex-col sm:group-orientation-horizontal:gap-4">
                {children}
            </div>
            {description && <Description>{description}</Description>}
            <FieldError>{errorMessage}</FieldError>
        </RadioGroupPrimitive>
    );
};

const radioStyles = tv({
    base: 'size-4 shrink-0 rounded-full border transition',
    variants: {
        isSelected: {
            false: 'border-muted',
            true: 'border-[4.5px] border-primary',
        },
        isFocused: {
            true: [
                'border-primary bg-primary/20 ring-4 ring-primary/20',
                'group-invalid:border-danger/70 group-invalid:bg-danger/20 group-invalid:ring-danger/20',
            ],
        },
        isInvalid: {
            true: 'border-danger/70 bg-danger/20',
        },
        isDisabled: {
            true: 'opacity-50',
        },
    },
});

interface RadioProps extends RadioPrimitiveProps {
    description?: string;
}

const Radio = ({ description, ...props }: RadioProps) => {
    return (
        <>
            <RadioPrimitive
                {...props}
                className={ctr(
                    props.className,
                    'group flex items-center gap-1.5 text-sm text-foreground transition disabled:text-foreground/50 forced-colors:disabled:text-[GrayText]',
                )}
            >
                {(renderProps) => (
                    <div className="flex gap-1.5">
                        <div
                            className={radioStyles({
                                ...renderProps,
                                className:
                                    'description' in props ? 'mt-1' : 'mt-0.5',
                            })}
                        />
                        <div className="flex flex-col gap-1">
                            {props.children as React.ReactNode}
                            {description && (
                                <Description className="block">
                                    {description}
                                </Description>
                            )}
                        </div>
                    </div>
                )}
            </RadioPrimitive>
        </>
    );
};

export { Radio, RadioGroup, radioStyles };
