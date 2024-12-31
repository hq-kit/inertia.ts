import { Card } from '@/components/ui';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <Card className="p-6">You're logged in!</Card>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
