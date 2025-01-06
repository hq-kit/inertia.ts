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
    Switch,
    Table,
    TextField,
} from '@/components/ui';
import AdminLayout from '@/layouts/admin-layout';
import { formatDate, rupiah, today } from '@/lib/utils';
import { Member, Product, Sale, SaleDetail } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconPencil, IconTrash } from 'hq-icons';
import React from 'react';

interface Props {
    sale: Sale;
    saleDetails: SaleDetail[];
    members: Member[];
}
export default function FormDetails({ sale, saleDetails, members }: Props) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showEditSale, setShowEditSale] = React.useState<boolean>(false);
    const customers = [...members, { id: '', name: 'Anonim' }];

    const { data, setData, put, processing, errors } = useForm({
        member_id: sale.member_id || '',
        discount: sale.discount,
        cashless: sale.cashless,
        created_at: sale?.created_at || today,
    });

    function updateSale(e: { preventDefault: () => void }) {
        setLoading(true);
        e.preventDefault();
        put(route('sales.update', sale.id), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                setShowEditSale(false);
            },
        });
    }

    function addItem(product: Product) {
        setLoading(true);
        const { id, sell_price, buy_price } = product;
        const itemExists = saleDetails.find((item) => item.product_id === id);
        if (itemExists) changeQuantity(itemExists.id, itemExists.quantity + 1);
        else
            router.post(
                route('sale-details.store'),
                {
                    sale_id: sale.id,
                    product_id: id,
                    quantity: 1,
                    price: sell_price,
                    modal: buy_price,
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
        const currentPrice = saleDetails.find((item) => item.id === id)!.price;
        router.put(
            route('sale-details.update', id),
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
        router.delete(route('sale-details.destroy', id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setLoading(false),
            onFinish: () => setLoading(false),
        });
    }

    function changePrice(id: number, price: number) {
        setLoading(true);
        const currentQuantity = saleDetails.find(
            (item) => item.id === id,
        )!.quantity;
        router.put(
            route('sale-details.update', id),
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

    const [bayar, setBayar] = React.useState<number>(0);

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Heading className="text-xl">Detail Penjualan</Heading>
                    <Description>Isi form di bawah ini</Description>
                </div>
                <div className="flex flex-row gap-2">
                    <Link
                        variant="unstyled"
                        className={buttonVariants({ variant: 'success' })}
                        href={route('sales.index')}
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
                    <Table aria-label="Sale Details">
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
                            {saleDetails.map((item) => (
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
                                    <Table.Cell className="grid py-0">
                                        <Badge>{rupiah(item.subtotal)}</Badge>
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
                                isOpen={showEditSale}
                                onOpenChange={setShowEditSale}
                            >
                                <Popover.Trigger className="flex items-center gap-2 font-semibold text-primary outline-none">
                                    <IconPencil />
                                    Ubah
                                </Popover.Trigger>
                                <Popover.Content>
                                    <Form
                                        onSubmit={updateSale}
                                        className="space-y-2"
                                    >
                                        <TextField
                                            autoFocus
                                            aria-label="Tanggal Penjualan"
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
                                            placeholder="Customer"
                                            aria-label="Customer"
                                            name="member_id"
                                            selectedKey={data.member_id}
                                            onSelectionChange={(e) =>
                                                setData('member_id', Number(e))
                                            }
                                            items={customers}
                                            errorMessage={errors?.member_id}
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
                            <div>{formatDate(sale.created_at)}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>Customer</div>
                            <div>{sale.customer}</div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>Items</div>
                            <div>{saleDetails.length}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>Subtotal</div>
                            <div>{rupiah(sale.subtotal)}</div>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2 border-t pt-2 text-sm text-muted-foreground">
                            <div>Diskon</div>
                            <div>{rupiah(sale.discount)}</div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                            <div>TOTAL</div>
                            <div>{rupiah(sale.total)}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm">
                            <NumberField
                                className="my-4"
                                step={500}
                                id="bayar"
                                label="Bayar"
                                value={bayar}
                                onChange={setBayar}
                                isDisabled={sale.cashless}
                            />
                            <Switch
                                isDisabled={data.member_id === ''}
                                isSelected={sale.cashless}
                                onChange={(v) =>
                                    router.put(
                                        route('sales.cashless', sale.id),
                                        { cashless: v },
                                    )
                                }
                            >
                                Bon
                            </Switch>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                            <div>Kembalian</div>
                            <div>{rupiah(bayar - sale.total)}</div>
                        </div>
                    </Card>
                    <Link
                        variant="unstyled"
                        href={route('sales.create')}
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
