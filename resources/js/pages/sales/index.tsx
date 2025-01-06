import DeleteModal from '@/components/delete-modal';
import PageOptionsTransaction from '@/components/page-options-transactions';
import Paginator from '@/components/paginator';
import {
    Badge,
    Button,
    buttonVariants,
    Card,
    Description,
    Heading,
    Link,
    Menu,
    Table,
} from '@/components/ui';
import AdminLayout from '@/layouts/admin-layout';
import { formatDate, rupiah } from '@/lib/utils';
import { Paginate, Sale } from '@/types';
import { IconEllipsisVertical, IconPencil, IconTrash } from 'hq-icons';
import React from 'react';

interface Props {
    sales: Paginate & { data: Sale[] };
}

export default function SalesIndex({ sales }: Props) {
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteRoute, setDeleteRoute] = React.useState('');

    function deleteSale(id: number) {
        setDeleteRoute(route('sales.destroy', id));
        setOpenDelete(true);
    }

    return (
        <>
            <DeleteModal
                isOpen={openDelete}
                setIsOpen={setOpenDelete}
                route={deleteRoute}
            />
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Heading className="text-xl">Penjualan</Heading>
                    <Description>Manajemen Penjualan</Description>
                </div>
                <div className="flex flex-row gap-2">
                    <Link
                        variant="unstyled"
                        className={buttonVariants({ variant: 'success' })}
                        href={route('sales.create')}
                    >
                        Penjualan Baru
                    </Link>
                </div>
            </div>
            <PageOptionsTransaction />
            <Card>
                <Table aria-label="Penjualan">
                    <Table.Header>
                        <Table.Column className="w-3" isRowHeader>
                            #
                        </Table.Column>
                        <Table.Column>Customer</Table.Column>
                        <Table.Column>Tanggal</Table.Column>
                        <Table.Column>Total</Table.Column>
                        <Table.Column>Petugas</Table.Column>
                        <Table.Column />
                    </Table.Header>
                    <Table.Body
                        renderEmptyState={() => (
                            <div className="py-2 text-center text-lg">
                                Belum ada penjualan.
                            </div>
                        )}
                    >
                        {sales.data.length > 0 &&
                            sales.data.map((sale, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell className="text-center">
                                        {i + 1}
                                    </Table.Cell>
                                    <Table.Cell className="flex items-center gap-2">
                                        {sale.customer}
                                        {sale.cashless ? (
                                            <Badge variant="danger">BON</Badge>
                                        ) : null}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {formatDate(sale.created_at)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {rupiah(sale.total)}
                                    </Table.Cell>
                                    <Table.Cell>{sale.user}</Table.Cell>
                                    <Table.Cell>
                                        <DeleteModal
                                            route={deleteRoute}
                                            isOpen={openDelete}
                                            setIsOpen={setOpenDelete}
                                        />
                                        <Menu>
                                            <Button
                                                variant="ghost"
                                                className="size-6"
                                            >
                                                <IconEllipsisVertical />
                                            </Button>
                                            <Menu.Content
                                                aria-label="Product actions"
                                                placement="bottom end"
                                            >
                                                <Menu.Item
                                                    href={route(
                                                        'sales.show',
                                                        sale.id,
                                                    )}
                                                >
                                                    <IconPencil />
                                                    Detail
                                                </Menu.Item>
                                                <Menu.Item
                                                    isDanger
                                                    onAction={() =>
                                                        deleteSale(sale.id)
                                                    }
                                                >
                                                    <IconTrash />
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Content>
                                        </Menu>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
            </Card>
            <Paginator meta={sales.meta} links={sales.links} only={['sales']} />
        </>
    );
}

SalesIndex.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
