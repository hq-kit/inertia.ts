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
import { Category, Paginate } from '@/types';
import { IconEllipsisVertical, IconPencil, IconTrash } from 'hq-icons';
import React from 'react';
import CategoriesForm from './form';

interface Props {
    categories: Paginate & { data: Category[] };
}

export default function CategoriesIndex({ categories }: Props) {
    const [openForm, setOpenForm] = React.useState(
        route().current() === 'categories.create' ||
            route().current() === 'categories.edit',
    );

    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteRoute, setDeleteRoute] = React.useState('');

    function deleteCategory(id: number) {
        setDeleteRoute(route('categories.destroy', id));
        setOpenDelete(true);
    }

    return (
        <>
            <CategoriesForm isOpen={openForm} setIsOpen={setOpenForm} />
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Heading className="text-xl">Categories</Heading>
                    <Description>Manajemen Categories</Description>
                </div>
                <div className="flex flex-row gap-2">
                    <Link
                        variant="unstyled"
                        className={buttonVariants({ variant: 'success' })}
                        href={route('categories.create')}
                    >
                        Category Baru
                    </Link>
                </div>
            </div>
            <PageOptions />
            <Card>
                <Table aria-label="Categories">
                    <Table.Header className="text-center">
                        <Table.Column className="w-3" isRowHeader>
                            #
                        </Table.Column>
                        <Table.Column>Nama</Table.Column>
                        <Table.Column />
                    </Table.Header>
                    <Table.Body
                        renderEmptyState={() => (
                            <div className="py-2 text-center text-lg">
                                Belum ada category.
                            </div>
                        )}
                    >
                        {categories.data.length > 0 &&
                            categories.data.map((category, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell className="text-center">
                                        {i + 1}
                                    </Table.Cell>
                                    <Table.Cell>{category.name}</Table.Cell>
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
                                                aria-label="Category actions"
                                                placement="bottom end"
                                            >
                                                <Menu.Item
                                                    href={route(
                                                        'categories.edit',
                                                        category.id,
                                                    )}
                                                >
                                                    <IconPencil />
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    isDanger
                                                    onAction={() =>
                                                        deleteCategory(
                                                            category.id,
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
                meta={categories.meta}
                links={categories.links}
                only={['categories']}
            />
        </>
    );
}

CategoriesIndex.layout = (page: React.ReactNode) => (
    <AdminLayout children={page} />
);
