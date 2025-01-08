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

export type PageData = {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
