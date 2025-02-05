import React from 'react'

import { Group, TextField, type Key } from 'react-aria-components'
import { type ListData } from 'react-stately'

import { Description, Input, Label, type FieldProps } from './field'
import { Tag, type RestrictedVariant, type TagGroupProps } from './tag-group'
import { cn } from './utils'

interface TagItemProps {
    id: number
    name: string
}

interface TagFieldProps extends Pick<TagGroupProps, 'shape'>, FieldProps {
    variant?: RestrictedVariant
    isDisabled?: boolean
    max?: number
    className?: string
    children?: React.ReactNode
    name?: string
    list: ListData<TagItemProps>
    onItemInserted?: (tag: TagItemProps) => void
    onItemCleared?: (tag: TagItemProps | undefined) => void
}

const TagField = ({
    variant = 'primary',
    name,
    className,
    list,
    onItemCleared,
    onItemInserted,
    ...props
}: TagFieldProps) => {
    const [isInvalid, setIsInvalid] = React.useState(false)
    const [inputValue, setInputValue] = React.useState('')

    const existingTagCount = list.items.length
    const maxTags = props.max !== undefined ? props.max : Infinity
    const maxTagsToAdd = maxTags - existingTagCount

    const insertTag = () => {
        const tagNames = inputValue.split(/,/)
        if (maxTagsToAdd <= 0) {
            setIsInvalid(true)
            setInputValue('')
            const timeoutId = setTimeout(() => {
                setIsInvalid(false)
            }, 2000)

            return () => clearTimeout(timeoutId)
        }

        tagNames.slice(0, maxTagsToAdd).forEach((tagName) => {
            const formattedName = tagName
                .trim()
                .replace(/\s+/g, ' ')
                .replace(/[\t\r\n]/g, '')

            if (
                formattedName &&
                !list.items.some(
                    ({ name }) =>
                        name.toLowerCase() === formattedName.toLowerCase(),
                )
            ) {
                const tag = {
                    id: (list.items.at(-1)?.id ?? 0) + 1,
                    name: formattedName,
                }

                list.append(tag)
                onItemInserted?.(tag)
            }
        })

        setInputValue('')
    }

    const clearInvalidFeedback = () => {
        if (maxTags - list.items.length <= maxTagsToAdd) {
            setIsInvalid(false)
        }
    }

    const onRemove = (keys: Set<Key>) => {
        list.remove(...keys)
        onItemCleared?.(list.getItem([...keys][0]))
        clearInvalidFeedback()
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            insertTag()
        }

        if (e.key === 'Backspace' && inputValue === '') {
            popLast()
            clearInvalidFeedback()
        }
    }

    const popLast = React.useCallback(() => {
        if (list.items.length == 0) {
            return
        }

        const endKey = list.items[list.items.length - 1]

        if (endKey !== null) {
            list.remove(endKey.id)
            onItemCleared?.(list.getItem(endKey.id))
        }
    }, [list, onItemCleared])

    return (
        <div className={cn('flex w-full flex-col gap-1', className)}>
            {props.label && <Label>{props.label}</Label>}
            <Group
                className={cn(
                    'flex flex-col',
                    props.isDisabled && 'opacity-50',
                )}
            >
                <Tag.Group
                    variant={variant}
                    shape={props.shape}
                    aria-label="List item inserted"
                    onRemove={onRemove}
                >
                    <div
                        className={cn(
                            'relative flex min-h-10 flex-row flex-wrap items-center bg-background transition',
                            'rounded-lg border px-1 shadow-sm',
                            'has-[input[data-focused=true]]:border-primary',
                            'has-[input[data-invalid=true][data-focused=true]]:border-danger has-[input[data-invalid=true]]:border-danger has-[input[data-invalid=true]]:ring-danger/20',
                            'has-[input[data-focused=true]]:ring-4 has-[input[data-focused=true]]:ring-primary/20',
                        )}
                    >
                        <div className="flex flex-1 flex-wrap items-center">
                            <Tag.List
                                items={list.items}
                                className={cn(
                                    list.items.length !== 0
                                        ? 'gap-1.5 px-0.5 py-1.5'
                                        : 'gap-0',
                                    props.shape === 'square' &&
                                        '[&_.tag]:rounded-[calc(var(--radius)-4px)]',
                                    'outline-none [&_.tag]:cursor-default last:[&_.tag]:-mr-1',
                                )}
                            >
                                {(item) => <Tag.Item>{item.name}</Tag.Item>}
                            </Tag.List>
                            <TextField
                                isDisabled={props.isDisabled}
                                aria-label={
                                    props?.label ??
                                    (props['aria-label'] || props.placeholder)
                                }
                                isInvalid={isInvalid}
                                onKeyDown={onKeyDown}
                                onChange={setInputValue}
                                value={inputValue}
                                {...props}
                            >
                                <Input
                                    className="inline w-auto"
                                    placeholder={
                                        maxTagsToAdd <= 0
                                            ? 'Remove one to add more'
                                            : props.placeholder
                                    }
                                />
                            </TextField>
                        </div>
                    </div>
                </Tag.Group>
                {name && (
                    <input
                        hidden
                        name={name}
                        value={list.items.map((i) => i.name).join(',')}
                        readOnly
                    />
                )}
            </Group>
            {props.description && (
                <Description>{props.description}</Description>
            )}
        </div>
    )
}

export { TagField, type TagItemProps }
