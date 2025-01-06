import { buttonVariants, Card, GridList, Link, Table } from '@/components/ui';
import AdminLayout from '@/layouts/admin-layout';
import { rupiah } from '@/lib/utils';
import { Purchase, Sale, SaleDetail } from '@/types';
import { Head } from '@inertiajs/react';
import {
    IconActivity,
    IconChartColumn,
    IconRupiah,
    IconSquareArrowUpRight,
} from 'hq-icons';

interface Props {
    sales: number;
    sales_count: number;
    purchases: number;
    purchases_count: number;
    products_count: number;
    product_titipan: number;
    profit: number;
    month: string;
    sale: Sale[];
    purchase: Purchase[];
    best_sellers: SaleDetail[];
}

export default function Dashboard(props: Props) {
    const {
        sales,
        purchases,
        sales_count,
        purchases_count,
        products_count,
        product_titipan,
        profit,
        month,
        sale,
        purchase,
        best_sellers,
    } = props;

    return (
        <>
            <Head title="Dashboard" />

            <main className="flex flex-1 flex-col gap-4 md:gap-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Card>
                        <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Card.Title className="text-sm font-medium">
                                Total Penjualan
                            </Card.Title>
                            <IconRupiah className="size-4 text-muted-foreground" />
                        </Card.Header>
                        <Card.Content>
                            <div className="text-2xl font-bold">
                                {rupiah(sales)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                dari {sales_count} penjualan pada {month}
                            </p>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Card.Title className="text-sm font-medium">
                                Total Pembelian
                            </Card.Title>
                            <IconRupiah className="size-4 text-muted-foreground" />
                        </Card.Header>
                        <Card.Content>
                            <div className="text-2xl font-bold">
                                {rupiah(purchases)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                dari {purchases_count} pembelian pada {month}
                            </p>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Card.Title className="text-sm font-medium">
                                Profit
                            </Card.Title>
                            <IconChartColumn className="size-4 text-muted-foreground" />
                        </Card.Header>
                        <Card.Content>
                            <div className="text-2xl font-bold">
                                {rupiah(profit)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Pada {month}
                            </p>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Card.Title className="text-sm font-medium">
                                Jumlah Produk
                            </Card.Title>
                            <IconActivity className="size-4 text-muted-foreground" />
                        </Card.Header>
                        <Card.Content>
                            <div className="text-2xl font-bold">
                                {products_count}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {product_titipan} Produk Titipan
                            </p>
                        </Card.Content>
                    </Card>
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
                    <Card>
                        <Card.Header className="flex flex-row justify-between">
                            <div className="grid gap-1">
                                <Card.Title>Penjualan</Card.Title>
                                <Card.Description>
                                    Penjualan Terbaru
                                </Card.Description>
                            </div>
                            <Link
                                variant="unstyled"
                                className={buttonVariants({
                                    variant: 'outline',
                                })}
                                href={route('sales.index')}
                            >
                                All
                                <IconSquareArrowUpRight />
                            </Link>
                        </Card.Header>
                        <Card.Content>
                            <Table>
                                <Table.Header>
                                    <Table.Column isRowHeader>
                                        Customer
                                    </Table.Column>
                                    <Table.Column className="[&_div]:justify-end">
                                        Total
                                    </Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {sale.map((transaction) => (
                                        <Table.Row key={transaction.id}>
                                            <Table.Cell>
                                                <div className="font-medium">
                                                    {transaction.customer}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                {rupiah(transaction.total)}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Card.Title>Pembelian Terbaru</Card.Title>
                        </Card.Header>
                        <Card.Content className="grid gap-8">
                            {purchase.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center gap-4"
                                >
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            {transaction.supplier.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {transaction.user}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {rupiah(transaction.total)}
                                    </div>
                                </div>
                            ))}
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Card.Title>Produk Terlaris</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <GridList
                                aria-label="Produk Terlaris"
                                items={best_sellers}
                            >
                                {(item) => (
                                    <GridList.Item id={item.product_id}>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">
                                                {/* @ts-expect-error no-type */}
                                                {item.product_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Terjual {item.quantity}
                                            </p>
                                        </div>
                                    </GridList.Item>
                                )}
                            </GridList>
                        </Card.Content>
                    </Card>
                </div>
            </main>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
