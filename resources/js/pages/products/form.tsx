import CategoryIcon from '@/components/category-icon';
import {
    Button,
    Checkbox,
    ComboBox,
    Form,
    Modal,
    NumberField,
    Select,
    TextField,
} from '@/components/ui';
import { wait } from '@/lib/utils';
import { FormSetting, Member, ModalProps, Product } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';

export default function ProductsForm({ isOpen, setIsOpen }: ModalProps) {
    const [titipan, setTitipan] = React.useState(false);
    const [members, setMembers] = React.useState<Member[]>([]);
    // @ts-expect-error no-type
    const { product, form, categories } = usePage<{
        product: Product;
        form: FormSetting;
        categories: { id: number; name: string }[];
    }>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: form.method,
        category_id: product.category_id || '',
        owner: product.owner || '',
        name: product.name || '',
        buy_price: product.buy_price || 0,
        sell_price: product.sell_price || 0,
        stock: product.stock || 0,
        unit: product.unit || 'pcs',
    });

    function onSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        post(form.route, { onSuccess: () => onClose() });
    }

    function onClose() {
        reset();
        setIsOpen(false);
        wait(300).then(() => router.get(route('products.index')));
    }

    React.useEffect(() => {
        if (!titipan) setData('owner', '');
    }, [titipan]);

    const fetchMembers = async () => {
        const { data } = await axios.get(route('members.all'));
        setMembers(data as Member[]);
    };
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Trigger className="sr-only" />
            <Modal.Content size="4xl">
                <Modal.Header>
                    <Modal.Title>{form.title}</Modal.Title>
                    <Modal.Description>
                        Fill in the details below
                    </Modal.Description>
                </Modal.Header>
                <Form onSubmit={onSubmit} validationErrors={errors}>
                    <Modal.Body className="grid gap-3 lg:grid-cols-6">
                        <TextField
                            className="col-span-2"
                            id="name"
                            label="Nama Produk"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e)}
                            errorMessage={errors?.name}
                            autoFocus
                            isRequired
                        />
                        <Select
                            className="col-span-2"
                            label="Kategori"
                            name="category_id"
                            selectedKey={data.category_id}
                            onSelectionChange={(e) => setData('category_id', e)}
                            errorMessage={errors?.category_id}
                            items={categories}
                        >
                            {(item) => (
                                <Select.Item id={item.id}>
                                    <CategoryIcon
                                        category={item.name.toLowerCase()}
                                    />
                                    {item.name}
                                </Select.Item>
                            )}
                        </Select>
                        <div className="col-span-2 grid items-start">
                            <Checkbox
                                label="Titipan"
                                id="titipan"
                                isSelected={titipan}
                                onChange={() => {
                                    fetchMembers();
                                    setTitipan(!titipan);
                                }}
                            />
                            {titipan && (
                                <ComboBox
                                    allowsCustomValue={true}
                                    placeholder="Pemilik"
                                    aria-label="Member"
                                    name="owner"
                                    onSelectionChange={(e) =>
                                        setData('owner', String(e))
                                    }
                                    onInputChange={(e) => setData('owner', e)}
                                    items={members}
                                    errorMessage={errors?.owner}
                                >
                                    {(item) => (
                                        <ComboBox.Item
                                            id={item.nickname}
                                            textValue={item.nickname}
                                        >
                                            {item.nickname}
                                        </ComboBox.Item>
                                    )}
                                </ComboBox>
                            )}
                        </div>

                        <NumberField
                            step={100}
                            className="col-span-2"
                            name="buy_price"
                            id="buy_price"
                            label="Harga Beli"
                            value={data.buy_price}
                            onChange={(e) => setData('buy_price', e)}
                            errorMessage={errors?.buy_price}
                        />
                        <NumberField
                            step={100}
                            className="col-span-2"
                            name="sell_price"
                            id="sell_price"
                            label="Harga Jual"
                            value={data.sell_price}
                            onChange={(e) => setData('sell_price', e)}
                            errorMessage={errors?.sell_price}
                        />

                        <NumberField
                            name="stock"
                            id="stock"
                            label="Stok"
                            value={data.stock}
                            onChange={(e) => setData('stock', e)}
                            errorMessage={errors?.stock}
                        />
                        <Select
                            label="Unit"
                            name="unit"
                            selectedKey={data.unit}
                            onSelectionChange={(e) =>
                                setData('unit', String(e))
                            }
                            errorMessage={errors?.unit}
                            items={units}
                        >
                            {(item) => (
                                <Select.Item
                                    id={item.id}
                                    textValue={item.textValue}
                                >
                                    {item.textValue}
                                </Select.Item>
                            )}
                        </Select>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" isDisabled={processing}>
                            Simpan
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

const units = [
    { id: 'pcs', textValue: 'pcs' },
    { id: 'pack', textValue: 'pack' },
    { id: 'kg', textValue: 'kg' },
    { id: 'liter', textValue: 'liter' },
    { id: 'box', textValue: 'box' },
    { id: 'tablet', textValue: 'tablet' },
    { id: 'sachet', textValue: 'sachet' },
];
