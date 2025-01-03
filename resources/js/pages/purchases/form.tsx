import {
    Button,
    buttonVariants,
    Card,
    ComboBox,
    Description,
    Form,
    Heading,
    Link,
    SearchField,
    Separator,
    TextField,
} from '@/components/ui';
import AdminLayout from '@/layouts/admin-layout';
import { formatDate, wait } from '@/lib/utils';
import { FormSetting, Product, Purchase, Supplier } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { IconArrowLeft } from 'hq-icons';
import React from 'react';

interface Props {
    purchase: Purchase;
    form: FormSetting;
    suppliers: Supplier[];
    products: Product[];
}

export default function PurchasesForm({
    purchase,
    form,
    suppliers,
    products,
}: Props) {
    console.log(formatDate(new Date().toString()));
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: form.method,
        created_at:
            purchase?.created_at || new Date().toISOString().split('T')[0],
        supplier_id: purchase?.supplier_id || '',
        total: purchase?.total || 0,
    });

    function onSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        post(form.route, { onSuccess: () => onFinish() });
    }

    function onFinish() {
        reset();
        wait(300).then(() => router.get(route('purchases.index')));
    }

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Heading className="text-xl">Pembelian Baru</Heading>
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
            <Form onSubmit={onSubmit} validationErrors={errors}>
                <Card className="flex items-start justify-center gap-4 p-4">
                    <TextField
                        autoFocus
                        label="Tanggal Pembelian"
                        name="created_at"
                        type="date"
                        value={data.created_at}
                        onChange={(e) => setData('created_at', e!)}
                        errorMessage={errors?.created_at}
                        isRequired
                    />
                    <ComboBox
                        isRequired
                        placeholder="Supplier"
                        label="Supplier"
                        name="supplier_id"
                        selectedKey={data.supplier_id}
                        onSelectionChange={(e) => setData('supplier_id', e!)}
                        items={suppliers}
                        errorMessage={errors?.supplier_id}
                    >
                        {(item) => (
                            <ComboBox.Item id={item.id} textValue={item.name}>
                                {item.name}
                            </ComboBox.Item>
                        )}
                    </ComboBox>
                </Card>
                <div className="flex flex-col items-start gap-4 py-4 lg:flex-row">
                    <Card className="p-4">
                        <SearchField
                            id="products"
                            aria-label="Cari Produk"
                            placeholder="Cari Produk"
                        />
                    </Card>
                    <div className="flex w-full flex-col gap-4 lg:max-w-sm">
                        <Card className="p-4">
                            <Heading className="mb-2 sm:text-lg">
                                Rincian
                            </Heading>
                            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                                <div>Items</div>
                                <div>0000</div>
                            </div>
                            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                                <div>Subtotal</div>
                                <div>0000</div>
                            </div>
                            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                                <div>Pajak</div>
                                <div>0000</div>
                            </div>
                            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                                <div>Ongkos Kirim</div>
                                <div>0000</div>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-2 border-t pt-2 text-sm text-muted-foreground">
                                <div>Diskon</div>
                                <div>0000</div>
                            </div>
                            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                                <div>Potongan</div>
                                <div>0000</div>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                                <div>TOTAL</div>
                                <div>0000</div>
                            </div>
                        </Card>
                        <Button
                            isDisabled={processing}
                            isPending={processing}
                            type="submit"
                        >
                            Simpan
                        </Button>
                    </div>
                </div>
            </Form>
        </>
    );
}

PurchasesForm.layout = (page: React.ReactNode) => (
    <AdminLayout children={page} />
);
