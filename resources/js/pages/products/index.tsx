import CategoryIcon from '@/components/category-icon';
import DeleteModal from '@/components/delete-modal';
import PageOptions from '@/components/page-options';
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
import { rupiah } from '@/lib/utils';
import { Paginate, Product } from '@/types';
import { IconEllipsisVertical, IconPencil, IconTrash } from 'hq-icons';
import React from 'react';
import ProductsForm from './form';

interface Props {
    products: Paginate & { data: Product[] };
}

export default function ProductsIndex({ products }: Props) {
    const [openForm, setOpenForm] = React.useState(
        route().current() === 'products.create' ||
            route().current() === 'products.edit',
    );

    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteRoute, setDeleteRoute] = React.useState('');

    function deleteProduct(id: number) {
        setDeleteRoute(route('products.destroy', id));
        setOpenDelete(true);
    }

    return (
        <>
            <ProductsForm isOpen={openForm} setIsOpen={setOpenForm} />
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Heading className="text-xl">Products</Heading>
                    <Description>Manajemen Products</Description>
                </div>
                <div className="flex flex-row gap-2">
                    <Link
                        variant="unstyled"
                        className={buttonVariants({ variant: 'success' })}
                        href={route('products.create')}
                    >
                        Product Baru
                    </Link>
                </div>
            </div>
            <PageOptions />
            <Card>
                <Table aria-label="Products">
                    <Table.Header>
                        <Table.Column className="w-3" isRowHeader>
                            #
                        </Table.Column>
                        <Table.Column>Nama</Table.Column>
                        <Table.Column>Harga Beli</Table.Column>
                        <Table.Column>Harga Jual</Table.Column>
                        <Table.Column>Stok</Table.Column>
                        <Table.Column />
                    </Table.Header>
                    <Table.Body
                        renderEmptyState={() => (
                            <div className="py-2 text-center text-lg">
                                Belum ada product.
                            </div>
                        )}
                    >
                        {products.data.length > 0 &&
                            products.data.map((product, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell className="text-center">
                                        {i + 1}
                                    </Table.Cell>
                                    <Table.Cell className="flex items-center gap-2">
                                        <CategoryIcon
                                            category={product.category.slug}
                                        />
                                        <Badge
                                            variant={
                                                product.owner
                                                    ? 'warning'
                                                    : 'primary'
                                            }
                                        >
                                            {product.name}
                                        </Badge>
                                        {product.owner && (
                                            <Badge variant="danger">
                                                {product.owner}
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {rupiah(product.buy_price)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {rupiah(product.sell_price)}
                                    </Table.Cell>
                                    <Table.Cell>{product.stock}</Table.Cell>
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
                                                        'products.edit',
                                                        product.id,
                                                    )}
                                                >
                                                    <IconPencil />
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    isDanger
                                                    onAction={() =>
                                                        deleteProduct(
                                                            product.id,
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
                meta={products.meta}
                links={products.links}
                only={['products']}
            />
        </>
    );
}

ProductsIndex.layout = (page: React.ReactNode) => (
    <AdminLayout children={page} />
);
