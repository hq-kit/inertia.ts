import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    email_verified_at?: string;
    avatar?: string;
    created_at: string;
    role: 'admin' | 'manager' | 'user';
}

export interface FormSetting {
    title: string;
    route: string;
    method: 'post' | 'put';
}

export interface ModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Paginate {
    meta: {
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
        path: string;
        per_page: number;
        links: {
            active: boolean;
            label: string;
            url: string | null;
        }[];
    };
    links: {
        first: string | null;
        last: string | null;
        next: string | null;
        prev: string | null;
    };
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    products: Product[];
}

export interface Supplier {
    id: number;
    name: string;
    phone?: string;
    address?: string;
    created_at: string;
}

export interface Member {
    id: number;
    name: string;
    nickname?: string;
    phone?: string;
    voucher: number;
    created_at: string;
}

export interface Product {
    id: number;
    category: Category;
    category_id: number;
    owner?: string;
    owner_price?: number;
    name: string;
    buy_price: number;
    sell_price: number;
    stock: number;
    unit: string;
    created_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
