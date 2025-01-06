import { Button, Form, Modal, TextField } from '@/components/ui';
import { wait } from '@/lib/utils';
import { FormSetting, Member, ModalProps } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';

export default function MembersForm({ isOpen, setIsOpen }: ModalProps) {
    // @ts-expect-error no-type
    const { member, form } = usePage<{
        member: Member;
        form: FormSetting;
    }>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: form.method,
        name: member.name || '',
        nickname: member.nickname || '',
        phone: member.phone || '',
    });

    function onSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        post(form.route, { onSuccess: () => onClose() });
    }

    function onClose() {
        reset();
        setIsOpen(false);
        wait(300).then(() => router.get(route('members.index')));
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
                            label="Nama Panggilan"
                            name="nickname"
                            value={data.nickname}
                            onChange={(e) => setData('nickname', e)}
                            errorMessage={errors?.nickname}
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
