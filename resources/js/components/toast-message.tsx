import { Toast } from '@/components/ui';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Toaster = {
    type: string;
    message: string;
};

export function ToastMessage() {
    // @ts-expect-error no-type
    const { toaster } = usePage<{ toaster: Toaster }>().props;
    useEffect(() => {
        if (toaster && toaster?.message) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (toast as any)[toaster.type](toaster.message);
        }
    }, [toaster]);
    return <Toast />;
}
