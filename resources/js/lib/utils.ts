import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

const wait = (number: number = 1000) =>
    new Promise((resolve) => setTimeout(resolve, number));

const formatDate = (input: string | number): string => {
    const date = new Date(input);
    return date.toLocaleDateString('id-ID', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

const middleware = (role: string | string[]) => {
    const { auth } = usePage<PageProps>().props;
    if (typeof role === 'string') {
        return auth.user.role === role;
    }
    return role.includes(auth.user.role);
};
const rupiah = (number: number) =>
    number.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

export { formatDate, middleware, rupiah, wait };
