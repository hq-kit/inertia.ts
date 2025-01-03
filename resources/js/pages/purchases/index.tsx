import DeleteModal from '@/components/delete-modal';
import PageOptions from '@/components/page-options';
import Paginator from '@/components/paginator';
import {
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
import { rupiah } from '@/lib/utils';
import { Paginate, Purchase } from '@/types';
import { IconEllipsisVertical, IconPencil, IconTrash } from 'hq-icons';
import React from 'react';

interface Props {
    purchases: Paginate & { data: Purchase[] };
}

export default function PurchasesIndex({ purchases }: Props) {
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteRoute, setDeleteRoute] = React.useState('');

    function deletePurchase(id: number) {
        setDeleteRoute(route('purchases.destroy', id));
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
                    <Heading className="text-xl">Pembelian</Heading>
                    <Description>Manajemen Pembelian</Description>
                </div>
                <div className="flex flex-row gap-2">
                    <Link
                        variant="unstyled"
                        className={buttonVariants({ variant: 'success' })}
                        href={route('purchases.create')}
                    >
                        Pembelian Baru
                    </Link>
                </div>
            </div>
            <PageOptions />
            <Card>
                <Table aria-label="Pembelian">
                    <Table.Header>
                        <Table.Column className="w-3" isRowHeader>
                            #
                        </Table.Column>
                        <Table.Column>Supplier</Table.Column>
                        <Table.Column>Tanggal</Table.Column>
                        <Table.Column>Total</Table.Column>
                        <Table.Column />
                    </Table.Header>
                    <Table.Body
                        renderEmptyState={() => (
                            <div className="py-2 text-center text-lg">
                                Belum ada pembelian.
                            </div>
                        )}
                    >
                        {purchases.data.length > 0 &&
                            purchases.data.map((purchase, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell className="text-center">
                                        {i + 1}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {purchase.supplier.name}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {purchase.created_at}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {rupiah(purchase.total)}
                                    </Table.Cell>
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
                                                        'purchases.edit',
                                                        purchase.id,
                                                    )}
                                                >
                                                    <IconPencil />
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    isDanger
                                                    onAction={() =>
                                                        deletePurchase(
                                                            purchase.id,
                                                        )
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
            <Paginator
                meta={purchases.meta}
                links={purchases.links}
                only={['purchases']}
            />
        </>
    );
}

PurchasesIndex.layout = (page: React.ReactNode) => (
    <AdminLayout children={page} />
);
