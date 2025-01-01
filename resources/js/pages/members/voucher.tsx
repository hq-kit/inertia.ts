import { Button, Form, Modal, NumberField, Popover } from '@/components/ui';
import { rupiah } from '@/lib/utils';
import { Member } from '@/types';
import { useForm } from '@inertiajs/react';
import React from 'react';

export function Voucher({ member }: { member: Member }) {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const { data, setData, put, errors, processing } = useForm({
        voucher: member.voucher,
    });
    function updateVoucher(e: { preventDefault: () => void }) {
        e.preventDefault();
        put(route('members.update-voucher', member.id), {
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    }
    return (
        <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button
                onPress={() => setIsOpen(!isOpen)}
                variant={member.voucher > 0 ? 'success' : 'danger'}
                className="h-6"
            >
                {rupiah(member.voucher ?? 0)}
            </Button>
            <Popover.Content placement="left">
                <Popover.Header className="mb-4">
                    <Popover.Title>Update Voucher</Popover.Title>
                    <Popover.Description>{member.name}</Popover.Description>
                </Popover.Header>
                <Form onSubmit={updateVoucher}>
                    <NumberField
                        step={500}
                        id="voucher"
                        name="voucher"
                        aria-label="Voucher"
                        value={data.voucher}
                        onChange={(e) => setData('voucher', e)}
                        errorMessage={errors.voucher}
                    />
                    <Popover.Footer>
                        <Button
                            type="submit"
                            isPending={processing}
                            isDisabled={processing}
                        >
                            Simpan
                        </Button>
                    </Popover.Footer>
                </Form>
            </Popover.Content>
        </Popover>
    );
}

export function ResetVouchers() {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const { data, setData, put, errors, processing } = useForm({
        voucher: 25000,
    });
    function resetVoucher(e: { preventDefault: () => void }) {
        e.preventDefault();
        put(route('members.reset-voucher'), {
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    }
    return (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button variant="danger">Reset Voucher</Button>
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>Reset Voucher</Modal.Title>
                    <Modal.Description>
                        Tindakan ini akan mereset voucher untuk semua member
                    </Modal.Description>
                </Modal.Header>
                <Form onSubmit={resetVoucher}>
                    <NumberField
                        step={500}
                        id="voucher"
                        name="voucher"
                        aria-label="Voucher"
                        value={data.voucher}
                        onChange={(e) => setData('voucher', e)}
                        errorMessage={errors.voucher}
                    />
                    <Modal.Footer>
                        <Button
                            type="submit"
                            variant="danger"
                            isPending={processing}
                            isDisabled={processing}
                        >
                            Reset Voucher
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Content>
        </Modal>
    );
}
