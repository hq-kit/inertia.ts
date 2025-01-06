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

export interface PurchaseDetail {
    id: number;
    purchase_id?: number;
    purchase?: Purchase;
    product_id: number;
    product: Product;
    quantity: number;
    price: number;
    subtotal: number;
    created_at?: string;
}

export interface Purchase {
    id: number;
    supplier_id: number;
    supplier: Supplier;
    user_id: number;
    user: string;
    created_at: string;
    purchase_details: PurchaseDetail[];
    discount: number;
    tax: number;
    shipping: number;
    subtotal: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export interface SaleDetail {
    id: number;
    sale_id: number;
    sale: Sale;
    product_id: number;
    product: Product;
    quantity: number;
    price: number;
    subtotal: number;
    modal: number;
    created_at: string;
}

export interface Sale {
    id: number;
    member_id?: number;
    member?: Member;
    customer: string;
    user_id: number;
    user: string;
    created_at: string;
    sale_details: SaleDetail[];
    subtotal: number;
    discount: number;
    total: number;
    profit: number;
    cashless: boolean;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
