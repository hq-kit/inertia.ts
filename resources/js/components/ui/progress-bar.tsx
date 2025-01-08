import { motion } from 'framer-motion';
import {
    ProgressBar as ProgressBarPrimitive,
    type ProgressBarProps as ProgressBarPrimitiveProps,
} from 'react-aria-components';

import { Label } from './field';
import { ctr } from './utils';

interface ProgressBarProps extends ProgressBarPrimitiveProps {
    label?: string;
}

const ProgressBar = ({ label, className, ...props }: ProgressBarProps) => {
    return (
        <ProgressBarPrimitive
            {...props}
            className={ctr(className, 'flex flex-col')}
        >
            {({ percentage, valueText, isIndeterminate }) => (
                <>
                    <div className="flex justify-between gap-2">
                        {label && <Label>{label}</Label>}
                        <span className="text-sm tabular-nums text-muted-foreground">
                            {valueText}
                        </span>
                    </div>
                    <div className="relative h-2 min-w-64 overflow-hidden rounded-lg bg-muted outline outline-1 -outline-offset-1 outline-transparent">
                        {!isIndeterminate ? (
                            <motion.div
                                className="absolute left-0 top-0 h-full rounded-lg bg-primary forced-colors:bg-[Highlight]"
                                initial={{ width: '0%' }}
                                animate={{ width: `${percentage}%` }}
                                transition={{
                                    duration: 0.5,
                                    ease: 'easeInOut',
                                }}
                            />
                        ) : (
                            <motion.div
                                className="absolute top-0 h-full rounded-lg bg-primary forced-colors:bg-[Highlight]"
                                initial={{ left: '0%', width: '40%' }}
                                animate={{ left: ['0%', '100%', '0%'] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: 'easeInOut',
                                }}
                            />
                        )}
                    </div>
                </>
            )}
        </ProgressBarPrimitive>
    );
};

export { ProgressBar };
