import { Button, Form, Modal, Textarea, TextField } from '@/components/ui';
import { wait } from '@/lib/utils';
import { FormSetting, ModalProps, Supplier } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';

export default function SuppliersForm({ isOpen, setIsOpen }: ModalProps) {
    // @ts-expect-error no-type
    const { supplier, form } = usePage<{
        supplier: Supplier;
        form: FormSetting;
    }>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: form.method,
        name: supplier.name || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
    });

    function onSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        post(form.route, { onSuccess: () => onClose() });
    }

    function onClose() {
        reset();
        setIsOpen(false);
        wait(300).then(() => router.get(route('suppliers.index')));
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Trigger className="sr-only" />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>{form.title}</Modal.Title>
                    <Modal.Description>
                        Fill in the details below
                    </Modal.Description>
                </Modal.Header>
                <Form onSubmit={onSubmit} validationErrors={errors}>
                    <Modal.Body className="space-y-2">
                        <TextField
                            label="Nama"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e)}
                            errorMessage={errors?.name}
                            autoFocus
                            isRequired
                        />
                        <TextField
                            label="Telepon"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e)}
                            errorMessage={errors?.phone}
                        />
                        <Textarea
                            label="Alamat"
                            name="address"
                            value={data.address}
                            onChange={(e) => setData('address', e)}
                            errorMessage={errors?.address}
                        />
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
