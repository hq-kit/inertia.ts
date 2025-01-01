import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

const wait = (number: number = 1000) =>
    new Promise((resolve) => setTimeout(resolve, number));

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

export { middleware, rupiah, wait };
