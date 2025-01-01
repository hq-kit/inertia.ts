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
import { Paginate, Supplier } from '@/types';
import { IconEllipsisVertical, IconPencil, IconTrash } from 'hq-icons';
import React from 'react';
import SuppliersForm from './form';

interface Props {
    suppliers: Paginate & { data: Supplier[] };
}

export default function SuppliersIndex({ suppliers }: Props) {
    const [openForm, setOpenForm] = React.useState(
        route().current() === 'suppliers.create' ||
            route().current() === 'suppliers.edit',
    );

    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteRoute, setDeleteRoute] = React.useState('');

    function deleteSupplier(id: number) {
        setDeleteRoute(route('suppliers.destroy', id));
        setOpenDelete(true);
    }

    return (
        <>
            <SuppliersForm isOpen={openForm} setIsOpen={setOpenForm} />
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Heading className="text-xl">Suppliers</Heading>
                    <Description>Manajemen Suppliers</Description>
                </div>
                <div className="flex flex-row gap-2">
                    <Link
                        variant="unstyled"
                        className={buttonVariants({ variant: 'success' })}
                        href={route('suppliers.create')}
                    >
                        Supplier Baru
                    </Link>
                </div>
            </div>
            <PageOptions />
            <Card>
                <Table aria-label="Suppliers">
                    <Table.Header className="text-center">
                        <Table.Column className="w-3" isRowHeader>
                            #
                        </Table.Column>
                        <Table.Column>Nama</Table.Column>
                        <Table.Column>Telepon</Table.Column>
                        <Table.Column>Alamat</Table.Column>
                        <Table.Column />
                    </Table.Header>
                    <Table.Body
                        renderEmptyState={() => (
                            <div className="py-2 text-center text-lg">
                                Belum ada supplier.
                            </div>
                        )}
                    >
                        {suppliers.data.length > 0 &&
                            suppliers.data.map((supplier, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell className="text-center">
                                        {i + 1}
                                    </Table.Cell>
                                    <Table.Cell>{supplier.name}</Table.Cell>
                                    <Table.Cell>
                                        {supplier.phone ?? '-'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {supplier.address ?? '-'}
                                    </Table.Cell>
                                    <Table.Cell className="text-right">
                                        <DeleteModal
                                            route={deleteRoute}
                                            isOpen={openDelete}
                                            setIsOpen={setOpenDelete}
                                        />
                                        <Menu>
                                            <Button variant="ghost" size="icon">
                                                <IconEllipsisVertical />
                                            </Button>
                                            <Menu.Content
                                                aria-label="Supplier actions"
                                                placement="bottom end"
                                            >
                                                <Menu.Item
                                                    href={route(
                                                        'suppliers.edit',
                                                        supplier.id,
                                                    )}
                                                >
                                                    <IconPencil />
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    isDanger
                                                    onAction={() =>
                                                        deleteSupplier(
                                                            supplier.id,
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
                meta={suppliers.meta}
                links={suppliers.links}
                only={['suppliers']}
            />
        </>
    );
}

SuppliersIndex.layout = (page: React.ReactNode) => (
    <AdminLayout children={page} />
);
