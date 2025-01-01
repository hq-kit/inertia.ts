import { Toast } from '@/components/ui';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast as toaster } from 'sonner';

type Toaster = {
    type: string;
    message: string;
};

export function ToastMessage() {
    // @ts-expect-error no-type
    const { toast } = usePage<{ toast: Toaster }>().props;
    useEffect(() => {
        if (toast && toast?.message) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (toaster as any)[toast.type](toast.message);
        }
    }, [toast]);
    return <Toast />;
}
