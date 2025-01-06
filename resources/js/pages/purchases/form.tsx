import {
    Button,
    buttonVariants,
    Card,
    ComboBox,
    Description,
    Form,
    Heading,
    Link,
    TextField,
} from '@/components/ui';
import AdminLayout from '@/layouts/admin-layout';
import { today } from '@/lib/utils';
import { FormSetting, Purchase, Supplier } from '@/types';
import { useForm } from '@inertiajs/react';
import { IconArrowLeft } from 'hq-icons';
import React from 'react';

interface Props {
    purchase: Purchase;
    form: FormSetting;
    suppliers: Supplier[];
}

export default function PurchasesForm({ purchase, form, suppliers }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: form.method,
        supplier_id: purchase?.supplier_id || '',
        total: purchase?.total || 0,
        created_at: purchase?.created_at || today,
    });

    function onSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        post(form.route, { onSuccess: () => reset() });
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
                <Card className="flex w-full flex-col items-center justify-center gap-4 p-4 lg:flex-row">
                    <div className="flex w-full items-start gap-4">
                        <TextField
                            autoFocus
                            aria-label="Tanggal Pembelian"
                            name="created_at"
                            type="date"
                            value={data.created_at}
                            onChange={(e) => setData('created_at', e!)}
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
                    </div>
                    <Button
                        type="submit"
                        className="w-full lg:w-auto"
                        isPending={processing}
                        isDisabled={processing}
                    >
                        Buat Transaksi
                    </Button>
                </Card>
            </Form>
        </>
    );
}

PurchasesForm.layout = (page: React.ReactNode) => (
    <AdminLayout children={page} />
);
