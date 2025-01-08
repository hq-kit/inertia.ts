import { Ziggy as ziggy } from '@/ziggy'
import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import ReactDOMServer from 'react-dom/server'
import { route, RouteName } from 'ziggy-js'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} / ${appName}` : appName),
        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            // @ts-expect-error no-type
            global.route<RouteName> = (name, params, absolute) =>
                // @ts-expect-error no-type
                route(name, params, absolute, {
                    ...ziggy,
                    // @ts-expect-error no-type
                    location: new URL(page.props.ziggy.location),
                })

            return <App {...props} />
        },
    }),
)
