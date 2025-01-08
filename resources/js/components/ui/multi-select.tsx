import React from 'react'

import { IconChevronDown } from 'hq-icons'
import { useFilter } from 'react-aria'
import {
    ComboBox,
    Group,
    type ComboBoxProps,
    type Key,
    type ValidationResult,
} from 'react-aria-components'
import { useListData, type ListData } from 'react-stately'

import { Button } from './button'
import { Description, FieldError, Input, Label } from './field'
import { ListBox } from './list-box'
import { Popover } from './popover'
import { Tag, type RestrictedVariant } from './tag-group'
import { VisuallyHidden, cn } from './utils'

interface FieldState {
    selectedKey: Key | null
    inputValue: string
}

interface SelectedKey {
    id: Key
    textValue: string
}

interface MultipleSelectProps<T extends object>
    extends Omit<
        ComboBoxProps<T>,
        | 'children'
        | 'validate'
        | 'allowsEmptyCollection'
        | 'selectedKey'
        | 'inputValue'
        | 'className'
        | 'value'
        | 'onSelectionChange'
        | 'onInputChange'
    > {
    label?: string
    description?: string
    variant?: RestrictedVariant
    items: Array<T>
    selectedList: ListData<T>
    className?: string
    onItemAdd?: (key: Key) => void
    onItemRemove?: (key: Key) => void
    renderEmptyState?: (inputValue: string) => React.ReactNode
    tag: (item: T) => React.ReactNode
    children: React.ReactNode | ((item: T) => React.ReactNode)
    max?: number
    min?: number
    errorMessage?: string | ((validation: ValidationResult) => string)
    portal?: Element
}

const MultiSelect = <T extends SelectedKey>({
    children,
    variant = 'primary',
    items,
    selectedList,
    onItemRemove,
    onItemAdd,
    className,
    name,
    renderEmptyState,
    max,
    min,
    errorMessage,
    ...props
}: MultipleSelectProps<T>) => {
    const tagGroupId = React.useId()
    const triggerRef = React.useRef<HTMLDivElement | null>(null)
    const [width, setWidth] = React.useState(0)

    const { contains } = useFilter({ sensitivity: 'base' })
    const selectedKeys = selectedList.items.map((i) => i.id)

    const filter = React.useCallback(
        (item: T, filterText: string) =>
            !selectedKeys.includes(item.id) &&
            contains(item.textValue, filterText),
        [contains, selectedKeys],
    )

    const accessibleList = useListData({
        initialItems: items,
        filter,
    })

    const [fieldState, setFieldState] = React.useState<FieldState>({
        selectedKey: null,
        inputValue: '',
    })

    const onRemove = React.useCallback(
        (keys: Set<Key>) => {
            if (min !== undefined && selectedList.items.length <= min) return

            const key = keys.values().next().value
            selectedList.remove(key as Key)
            setFieldState({
                inputValue: '',
                selectedKey: null,
            })
            onItemRemove?.(key as Key)
        },
        [selectedList, onItemRemove, min],
    )

    const onSelectionChange = (id: Key | null) => {
        if (!id) return

        const item = accessibleList.getItem(id)

        if (!item) return

        if (
            !selectedKeys.includes(id) &&
            (max === undefined || selectedList.items.length < max)
        ) {
            selectedList.append(item)
            setFieldState({
                inputValue: '',
                selectedKey: id,
            })
            onItemAdd?.(id)
        }

        accessibleList.setFilterText('')
    }

    const onInputChange = (v: string) => {
        setFieldState((prevState) => ({
            inputValue: v,
            selectedKey: v === '' ? null : prevState.selectedKey,
        }))

        accessibleList.setFilterText(v)
    }

    const deleteLast = React.useCallback(() => {
        if (
            selectedList.items.length == 0 ||
            (min !== undefined && selectedList.items.length <= min)
        ) {
            return
        }

        const lastKey = selectedList.items[selectedList.items.length - 1]

        if (lastKey !== null) {
            selectedList.remove(lastKey.id)
            onItemRemove?.(lastKey.id)
        }

        setFieldState({
            inputValue: '',
            selectedKey: null,
        })
    }, [selectedList, onItemRemove, min])

    const onKeyDownCapture = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Backspace' && fieldState.inputValue === '') {
                deleteLast()
            }
        },
        [deleteLast, fieldState.inputValue],
    )

    React.useEffect(() => {
        const trigger = triggerRef.current
        if (!trigger) return

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.target.clientWidth)
            }
        })

        observer.observe(trigger)
        return () => {
            observer.unobserve(trigger)
        }
    }, [triggerRef])

    const triggerButtonRef = React.useRef<HTMLButtonElement | null>(null)

    return (
        <Group
            className={cn(
                'group flex w-full min-w-fit flex-col gap-1.5',
                className,
            )}
        >
            {props.label && <Label>{props.label}</Label>}
            <div
                ref={triggerRef}
                className={cn(
                    'relative flex min-h-10 flex-row flex-wrap items-center rounded-lg border px-1 shadow-sm transition',
                    'has-[input[data-focused=true]]:border-primary',
                    'has-[input[data-invalid=true][data-focused=true]]:border-danger has-[input[data-invalid=true]]:border-danger',
                    'has-[input[data-focused=true]]:ring-4 has-[input[data-focused=true]]:ring-primary/20',
                    className,
                )}
            >
                <Tag.Group
                    aria-label="Selected items"
                    variant={variant}
                    id={tagGroupId}
                    onRemove={onRemove}
                >
                    <Tag.List
                        items={selectedList.items}
                        className={cn(
                            selectedList.items.length !== 0 && 'px-1 py-1.5',
                            'gap-1.5 outline-none [&_.tag]:rounded-[calc(var(--radius)-2.5px)] last:[&_.tag]:-mr-1',
                        )}
                    >
                        {props.tag}
                    </Tag.List>
                </Tag.Group>
                <ComboBox
                    {...props}
                    aria-label="Available items"
                    allowsEmptyCollection
                    className={cn('group peer flex flex-1', className)}
                    items={accessibleList.items}
                    selectedKey={fieldState.selectedKey}
                    inputValue={fieldState.inputValue}
                    onSelectionChange={onSelectionChange}
                    onInputChange={onInputChange}
                >
                    <div
                        className={cn(
                            'inline-flex flex-1 flex-wrap items-center px-0',
                            className,
                        )}
                    >
                        <FieldError>{errorMessage}</FieldError>
                        <Input
                            className="ml-1 flex-1 px-0.5 py-1 shadow-none ring-0"
                            onBlur={() => {
                                setFieldState({
                                    inputValue: '',
                                    selectedKey: null,
                                })
                                accessibleList.setFilterText('')
                            }}
                            onKeyDownCapture={onKeyDownCapture}
                        />

                        <VisuallyHidden>
                            <Button
                                slot="remove"
                                aria-label="Remove"
                                variant="ghost"
                                size="icon"
                                ref={triggerButtonRef}
                            >
                                <IconChevronDown />
                            </Button>
                        </VisuallyHidden>
                    </div>
                    <Popover.Picker
                        UNSTABLE_portalContainer={props.portal}
                        className="max-w-none"
                        style={{ width: `${width}px` }}
                        triggerRef={triggerRef}
                        trigger="ComboBox"
                    >
                        <ListBox.Picker
                            renderEmptyState={() =>
                                renderEmptyState ? (
                                    renderEmptyState(fieldState.inputValue)
                                ) : (
                                    <Description className="block p-3">
                                        {fieldState.inputValue ? (
                                            <>
                                                No results found for:{' '}
                                                <strong className="font-semibold">
                                                    {fieldState.inputValue}
                                                </strong>
                                            </>
                                        ) : (
                                            `No options`
                                        )}
                                    </Description>
                                )
                            }
                            selectionMode="multiple"
                        >
                            {children}
                        </ListBox.Picker>
                    </Popover.Picker>
                </ComboBox>
                <div className="relative ml-auto flex items-center justify-center px-1 [&_button>svg]:transition peer-data-[open]:[&_button>svg]:rotate-180">
                    <button
                        type="button"
                        className="-mr-2 grid size-8 place-content-center rounded-lg text-muted-foreground hover:text-foreground focus:text-foreground"
                        onClick={() => triggerButtonRef.current?.click()}
                        tabIndex={-1}
                    >
                        <IconChevronDown className="size-4" />
                    </button>
                </div>
            </div>

            {name && (
                <input
                    hidden
                    name={name}
                    value={selectedKeys.join(',')}
                    readOnly
                />
            )}

            {props.description && (
                <Description>{props.description}</Description>
            )}
        </Group>
    )
}

const MultiSelectItem = ListBox.Item

MultiSelect.Item = MultiSelectItem
MultiSelect.Tag = Tag.Item

export { MultiSelect, type SelectedKey }
