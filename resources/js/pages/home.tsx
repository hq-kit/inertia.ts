import { Card } from '@/components/ui'
import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'

export default function Dashboard() {
    return (
        <>
            <Head title="Home" />
            <Card className="p-6">This is Homepage</Card>
        </>
    )
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
