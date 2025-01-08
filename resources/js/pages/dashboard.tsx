import { Card } from '@/components/ui'
import AdminLayout from '@/layouts/admin-layout'
import { Head } from '@inertiajs/react'

export default function Dashboard() {
    return (
        <>
            <Head title="Home" />
            <Card className="p-6">This is Dashboard</Card>
        </>
    )
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout children={page} />
