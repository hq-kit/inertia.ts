import { IconSearch, IconX } from 'hq-icons'
import {
    SearchField as SearchFieldPrimitive,
    type SearchFieldProps as SearchFieldPrimitiveProps,
    type ValidationResult,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Button } from './button'
import { Description, FieldError, FieldGroup, Input, Label } from './field'
import { Loader } from './loader'
import { ctr } from './utils'

const searchFieldStyles = tv({
    slots: {
        base: 'group flex min-w-10 flex-col gap-y-1.5',
        searchIcon:
            'ml-2.5 size-4 shrink-0 text-muted-foreground group-disabled:text-muted-foreground forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]',
        clearButton: [
            'mr-1 size-8 text-muted-foreground group-empty:invisible pressed:bg-transparent hover:bg-transparent hover:text-foreground pressed:text-foreground',
        ],
        input: '[&::-webkit-search-cancel-button]:hidden',
    },
})

const { base, searchIcon, clearButton, input } = searchFieldStyles()

interface SearchFieldProps extends SearchFieldPrimitiveProps {
    label?: string
    placeholder?: string
    description?: string
    errorMessage?: string | ((validation: ValidationResult) => string)
    isPending?: boolean
}

const SearchField = ({
    className,
    placeholder,
    label,
    description,
    errorMessage,
    isPending,
    ...props
}: SearchFieldProps) => {
    return (
        <SearchFieldPrimitive
            aria-label={placeholder ?? props['aria-label'] ?? 'Search...'}
            {...props}
            className={ctr(className, base())}
        >
            {label && <Label>{label}</Label>}
            <FieldGroup>
                <IconSearch aria-hidden className={searchIcon()} />
                <Input
                    placeholder={placeholder ?? 'Search...'}
                    className={input()}
                />
                {isPending ? (
                    <Loader variant="spin" className="mr-2.5" />
                ) : (
                    <Button
                        size="icon"
                        variant="ghost"
                        className={clearButton()}
                    >
                        <IconX aria-hidden />
                    </Button>
                )}
            </FieldGroup>
            {description && <Description>{description}</Description>}
            <FieldError>{errorMessage}</FieldError>
        </SearchFieldPrimitive>
    )
}

export { SearchField, type SearchFieldProps }
