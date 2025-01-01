import DeleteModal from '@/components/delete-modal';
import PageOptions from '@/components/page-options';
import Paginator from '@/components/paginator';
import {
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
import { Member, Paginate } from '@/types';
import { IconEllipsisVertical, IconPencil, IconTrash } from 'hq-icons';
import React from 'react';
import MembersForm from './form';
import { ResetVouchers, Voucher } from './voucher';

interface Props {
    members: Paginate & { data: Member[] };
}

export default function MembersIndex({ members }: Props) {
    const [openForm, setOpenForm] = React.useState(
        route().current() === 'members.create' ||
            route().current() === 'members.edit',
    );

    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteRoute, setDeleteRoute] = React.useState('');

    function deleteMember(id: number) {
        setDeleteRoute(route('members.destroy', id));
        setOpenDelete(true);
    }

    return (
        <>
            <MembersForm isOpen={openForm} setIsOpen={setOpenForm} />
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Heading className="text-xl">Members</Heading>
                    <Description>Manajemen Members</Description>
                </div>
                <div className="flex flex-row gap-2">
                    <ResetVouchers />
                    <Link
                        variant="unstyled"
                        className={buttonVariants({ variant: 'success' })}
                        href={route('members.create')}
                    >
                        Member Baru
                    </Link>
                </div>
            </div>
            <PageOptions />
            <Card>
                <Table aria-label="Members">
                    <Table.Header className="text-center">
                        <Table.Column className="w-3" isRowHeader>
                            #
                        </Table.Column>
                        <Table.Column>Nama</Table.Column>
                        <Table.Column>Telepon</Table.Column>
                        <Table.Column>Voucher</Table.Column>
                        <Table.Column />
                    </Table.Header>
                    <Table.Body
                        renderEmptyState={() => (
                            <div className="py-2 text-center text-lg">
                                Belum ada member.
                            </div>
                        )}
                    >
                        {members.data.length > 0 &&
                            members.data.map((member, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell className="text-center">
                                        {i + 1}
                                    </Table.Cell>
                                    <Table.Cell>{member.name}</Table.Cell>
                                    <Table.Cell>
                                        {member.phone ?? '-'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Voucher member={member} />
                                    </Table.Cell>
                                    <Table.Cell className="text-right">
                                        <DeleteModal
                                            route={deleteRoute}
                                            isOpen={openDelete}
                                            setIsOpen={setOpenDelete}
                                        />
                                        <Menu>
                                            <Button variant="ghost" size="icon">
                                                <IconEllipsisVertical />
                                            </Button>
                                            <Menu.Content
                                                aria-label="Member actions"
                                                placement="bottom end"
                                            >
                                                <Menu.Item
                                                    href={route(
                                                        'members.edit',
                                                        member.id,
                                                    )}
                                                >
                                                    <IconPencil />
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    isDanger
                                                    onAction={() =>
                                                        deleteMember(member.id)
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
                meta={members.meta}
                links={members.links}
                only={['members']}
            />
        </>
    );
}

MembersIndex.layout = (page: React.ReactNode) => (
    <AdminLayout children={page} />
);
