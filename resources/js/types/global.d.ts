import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute, type route as routeFn } from 'ziggy-js';
import { PageProps as AppPageProps } from './';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    /* eslint-disable no-var */
    var route: typeof ziggyRoute;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}

import { type VisitOptions } from '@inertiajs/core';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    let route: typeof routeFn;
}

declare module 'react-aria-components' {
    interface RouterConfig {
        routerOptions: VisitOptions;
    }
}
