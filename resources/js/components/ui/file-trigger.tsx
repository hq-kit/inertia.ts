import { IconCamera, IconFolder, IconPaperclip } from 'hq-icons'
import {
    FileTrigger as FileTriggerPrimitive,
    type FileTriggerProps as FileTriggerPrimitiveProps,
} from 'react-aria-components'

import { Button, type ButtonProps } from './button'

interface FileTriggerProps
    extends FileTriggerPrimitiveProps,
        Omit<ButtonProps, 'children'> {
    withIcon?: boolean
}

const FileTrigger = ({
    variant = 'primary',
    size = 'md',
    shape = 'square',
    withIcon = true,
    ...props
}: FileTriggerProps) => {
    return (
        <>
            <FileTriggerPrimitive {...props}>
                <Button
                    isDisabled={props.isDisabled}
                    variant={variant}
                    size={size}
                    shape={shape}
                >
                    {withIcon && (
                        <>
                            {props.defaultCamera ? (
                                <IconCamera />
                            ) : props.acceptDirectory ? (
                                <IconFolder />
                            ) : (
                                <IconPaperclip className="rotate-45" />
                            )}
                        </>
                    )}
                    {props.children ? (
                        props.children
                    ) : (
                        <>
                            {props.allowsMultiple
                                ? 'Browse a files'
                                : props.acceptDirectory
                                  ? 'Browse'
                                  : 'Browse a file'}
                            ...
                        </>
                    )}
                </Button>
            </FileTriggerPrimitive>
        </>
    )
}

export { FileTrigger }
