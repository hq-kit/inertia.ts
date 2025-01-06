import { Button, ButtonProps } from 'react-aria-components';

export function ItemButton(props: ButtonProps) {
    return (
        <Button
            className="flex flex-col items-center justify-center rounded-lg"
            {...props}
        />
    );
}
