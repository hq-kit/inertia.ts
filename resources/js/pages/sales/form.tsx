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
import { FormSetting, Member, Sale } from '@/types';
import { useForm } from '@inertiajs/react';
import { IconArrowLeft } from 'hq-icons';
import React from 'react';

interface Props {
    sale: Sale;
    form: FormSetting;
    members: Member[];
}

export default function SalesForm({ sale, form, members }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: form.method,
        member_id: sale?.member_id || '',
        user_id: sale?.user_id || '',
        total: sale?.total || 0,
        created_at: sale?.created_at || today,
    });

    function onSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        post(form.route, { onSuccess: () => reset() });
    }

    const customers = [...members, { id: '', name: 'Anonim' }];

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Heading className="text-xl">Penjualan Baru</Heading>
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
            <Form onSubmit={onSubmit} validationErrors={errors}>
                <Card className="flex w-full flex-col items-center justify-center gap-4 p-4 lg:flex-row">
                    <div className="flex w-full items-start gap-4">
                        <TextField
                            autoFocus
                            aria-label="Tanggal Penjualan"
                            name="created_at"
                            type="date"
                            value={data.created_at}
                            onChange={(e) => setData('created_at', e!)}
                            errorMessage={errors?.created_at}
                            isRequired
                        />
                        <ComboBox
                            className="gap-0"
                            placeholder="Customer"
                            aria-label="Customer"
                            name="member_id"
                            allowsCustomValue
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

SalesForm.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
