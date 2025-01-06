import CategoryIcon from '@/components/category-icon';
import SearchProducts from '@/components/search-products';
import {
    Badge,
    Button,
    buttonVariants,
    Card,
    ComboBox,
    Description,
    Form,
    Heading,
    Link,
    NumberField,
    Popover,
    Separator,
    ShowMore,
    Table,
    TextField,
} from '@/components/ui';
import AdminLayout from '@/layouts/admin-layout';
import { formatDate, rupiah, today } from '@/lib/utils';
import { Product, Purchase, PurchaseDetail, Supplier } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconPencil, IconTrash } from 'hq-icons';
import React from 'react';

interface Props {
    purchase: Purchase;
    purchaseDetails: PurchaseDetail[];
    suppliers: Supplier[];
}
export default function FormDetails({
    purchase,
    purchaseDetails,
    suppliers,
}: Props) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showEditPurchase, setShowEditPurchase] =
        React.useState<boolean>(false);

    const { data, setData, put, processing, errors } = useForm({
        supplier_id: purchase.supplier.id || '',
        total: purchase.total,
        discount: purchase.discount,
        tax: purchase.tax,
        shipping: purchase.shipping,
        created_at: purchase?.created_at || today,
    });

    function updatePurchase(e: { preventDefault: () => void }) {
        setLoading(true);
        e.preventDefault();
        put(route('purchases.update', purchase.id), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                setShowEditPurchase(false);
            },
        });
    }

    function addItem(product: Product) {
        setLoading(true);
        const { id, sell_price } = product;
        const itemExists = purchaseDetails.find(
            (item) => item.product_id === id,
        );
        if (itemExists) changeQuantity(itemExists.id, itemExists.quantity + 1);
        else
            router.post(
                route('purchase-details.store'),
                {
                    purchase_id: purchase.id,
                    product_id: id,
                    quantity: 1,
                    price: sell_price,
                    subtotal: sell_price,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => setLoading(false),
                    onFinish: () => setLoading(false),
                },
            );
    }

    function changeQuantity(id: number, quantity: number) {
        setLoading(true);
        if (quantity < 1) {
            removeItem(id);
            return;
        }
        const currentPrice = purchaseDetails.find(
            (item) => item.id === id,
        )!.price;
        router.put(
            route('purchase-details.update', id),
            {
                quantity,
                subtotal: quantity * currentPrice,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setLoading(false),
                onFinish: () => setLoading(false),
            },
        );
    }

    function removeItem(id: number) {
        setLoading(true);
        router.delete(route('purchase-details.destroy', id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setLoading(false),
            onFinish: () => setLoading(false),
        });
    }

    function changePrice(id: number, price: number) {
        setLoading(true);
        const currentQuantity = purchaseDetails.find(
            (item) => item.id === id,
        )!.quantity;
        router.put(
            route('purchase-details.update', id),
            {
                price,
                subtotal: currentQuantity * price,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setLoading(false),
                onFinish: () => setLoading(false),
            },
        );
    }

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Heading className="text-xl">Detail Pembelian</Heading>
                    <Description>Isi form di bawah ini</Description>
                </div>
                <div className="flex flex-row gap-2">
                    <Link
                        variant="unstyled"
                        className={buttonVariants({ variant: 'success' })}
                        href={route('purchases.index')}
                    >
                        <IconArrowLeft />
                        Kembali
                    </Link>
                </div>
            </div>
            <div className="flex flex-col items-start gap-4 py-4 lg:flex-row">
                <Card className="p-4 pb-2">
                    <SearchProducts onAction={addItem} />
                    <ShowMore as="text" text="Daftar Item" className="py-2" />
                    <Table aria-label="Purchase Details">
                        <Table.Header>
                            <Table.Column isRowHeader>Nama</Table.Column>
                            <Table.Column className="w-24">
                                Quantity
                            </Table.Column>
                            <Table.Column className="w-40">Harga</Table.Column>
                            <Table.Column className="w-40">
                                Subtotal
                            </Table.Column>
                            <Table.Column className="w-10" />
                        </Table.Header>
                        <Table.Body renderEmptyState={() => <Table.Empty />}>
                            {purchaseDetails.map((item) => (
                                <Table.Row key={item.product_id}>
                                    <Table.Cell className="flex items-center gap-2 py-4">
                                        <CategoryIcon
                                            category={
                                                item.product.category.slug
                                            }
                                        />
                                        <Badge>{item.product.name}</Badge>
                                    </Table.Cell>
                                    <Table.Cell className="py-0">
                                        <NumberField
                                            minValue={0}
                                            id={item.product.name}
                                            aria-label="Quantity"
                                            value={item.quantity}
                                            onChange={(v) =>
                                                changeQuantity(item.id, v)
                                            }
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="py-0">
                                        <NumberField
                                            step={100}
                                            minValue={0}
                                            id={item.product.name}
                                            aria-label="Price"
                                            value={item.price}
                                            onChange={(v) =>
                                                changePrice(item.id, v)
                                            }
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="py-0">
                                        {rupiah(item.subtotal)}
                                    </Table.Cell>
                                    <Table.Cell className="py-0">
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="icon"
                                            onPress={() => removeItem(item.id)}
                                        >
                                            <IconTrash />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Card>
                <div className="flex w-full flex-col gap-4 lg:max-w-sm">
                    <Card className="p-4">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <Heading className="sm:text-lg">Rincian</Heading>
                            <Popover
                                isOpen={showEditPurchase}
                                onOpenChange={setShowEditPurchase}
                            >
                                <Popover.Trigger className="flex items-center gap-2 font-semibold text-primary outline-none">
                                    <IconPencil />
                                    Ubah
                                </Popover.Trigger>
                                <Popover.Content>
                                    <Form
                                        onSubmit={updatePurchase}
                                        className="space-y-2"
                                    >
                                        <TextField
                                            autoFocus
                                            aria-label="Tanggal Pembelian"
                                            name="created_at"
                                            type="date"
                                            value={data.created_at}
                                            onChange={(e) =>
                                                setData('created_at', e!)
                                            }
                                            errorMessage={errors?.created_at}
                                            isRequired
                                        />
                                        <ComboBox
                                            isRequired
                                            className="gap-0"
                                            placeholder="Supplier"
                                            aria-label="Supplier"
                                            name="supplier_id"
                                            selectedKey={data.supplier_id}
                                            onSelectionChange={(e) =>
                                                setData('supplier_id', e!)
                                            }
                                            items={suppliers}
                                            errorMessage={errors?.supplier_id}
                                        >
                                            {(item) => (
                                                <ComboBox.Item
                                                    id={item.id}
                                                    textValue={item.name}
                                                >
                                                    {item.name}
                                                </ComboBox.Item>
                                            )}
                                        </ComboBox>
                                        <NumberField
                                            label="Diskon"
                                            step={500}
                                            minValue={0}
                                            value={data.discount}
                                            onChange={(value) =>
                                                setData('discount', value)
                                            }
                                            errorMessage={errors?.discount}
                                        />
                                        <NumberField
                                            label="Pajak"
                                            step={500}
                                            minValue={0}
                                            value={data.tax}
                                            onChange={(value) =>
                                                setData('tax', value)
                                            }
                                            errorMessage={errors?.tax}
                                        />
                                        <NumberField
                                            label="Ongkos Kirim"
                                            step={500}
                                            minValue={0}
                                            value={data.shipping}
                                            onChange={(value) =>
                                                setData('shipping', value)
                                            }
                                            errorMessage={errors?.shipping}
                                        />
                                        <Button
                                            variant="success"
                                            className="w-full"
                                            type="submit"
                                            isPending={processing}
                                            isDisabled={processing}
                                        >
                                            Simpan
                                        </Button>
                                    </Form>
                                </Popover.Content>
                            </Popover>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>Tanggal</div>
                            <div>{formatDate(purchase.created_at)}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>Supplier</div>
                            <div>{purchase.supplier.name}</div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>Items</div>
                            <div>{purchaseDetails.length}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>Subtotal</div>
                            <div>{rupiah(purchase.subtotal)}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>Pajak</div>
                            <div>{rupiah(purchase.tax)}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>Ongkos Kirim</div>
                            <div>{rupiah(purchase.shipping)}</div>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2 border-t pt-2 text-sm text-muted-foreground">
                            <div>Diskon</div>
                            <div>{rupiah(purchase.discount)}</div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                            <div>TOTAL</div>
                            <div>{rupiah(purchase.total)}</div>
                        </div>
                    </Card>
                    <Link
                        variant="unstyled"
                        href={route('purchases.create')}
                        className={buttonVariants({ variant: 'success' })}
                    >
                        Transaksi Baru
                    </Link>
                </div>
            </div>
        </>
    );
}

FormDetails.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
