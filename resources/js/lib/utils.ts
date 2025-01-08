import { PageData } from '@/types'
import { usePage } from '@inertiajs/react'

const wait = (number: number = 1000) =>
    new Promise((resolve) => setTimeout(resolve, number))

const formatDate = (input: string | number): string => {
    const date = new Date(input)
    return date.toLocaleDateString('id-ID', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })
}

const today = new Date().toISOString().split('T')[0]

const Middleware = (role: string | string[]) => {
    const { user } = usePage<PageData>().props.auth
    if (user.role === 'admin') return true
    if (typeof role === 'string') {
        return user.role === role
    }
    return role.includes(user.role)
}

export { formatDate, Middleware, today, wait }
