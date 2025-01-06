import { Card, ComboBox, RangeCalendar, Table, Tabs } from '@/components/ui';
import AdminLayout from '@/layouts/admin-layout';
import { formatDate, rupiah, today } from '@/lib/utils';
import { Member, Paginate, Supplier, User } from '@/types';
import { router } from '@inertiajs/react';
import { CalendarDate, parseDate } from '@internationalized/date';
import React from 'react';

interface Props {
    members: Member[];
    suppliers: Supplier[];
    users: User[];
    from: string | null;
    to: string | null;
    user: string;
    member: string;
    type: string;
    supplier: string;
    data: Paginate & { data: any };
}
export default function Timeline(props: Props) {
    const { members, suppliers, users, from, to, data } = props;

    const [member, setMember] = React.useState<string | number | null>(
        props.member,
    );
    const [supplier, setSupplier] = React.useState<string | number | null>(
        props.supplier,
    );
    const [user, setUser] = React.useState<string | number | null>(props.user);
    const [date, setDate] = React.useState<{
        start: CalendarDate | null;
        end: CalendarDate | null;
    }>({
        start: from ? parseDate(from) : parseDate(today),
        end: to ? parseDate(to) : parseDate(today),
    });
    const [type, setType] = React.useState<string | number | null>(props.type);

    function handelDateRange(value: {
        start: CalendarDate | null;
        end: CalendarDate | null;
    }) {
        setDate(value);
        router.get(
            route(route().current() as string),
            {
                from: value.start?.toString(),
                to: value.end?.toString(),
                member,
                user,
                type,
            },
            { preserveState: true },
        );
    }

    function handleUserChange(value: string | number | null) {
        setUser(value);
        router.get(
            route(route().current() as string),
            {
                user: value,
                member,
                from: date.start?.toString(),
                to: date.end?.toString(),
                type,
            },
            { preserveState: true },
        );
    }

    function handleMemberChange(value: string | number | null) {
        setMember(value);
        router.get(
            route(route().current() as string),
            {
                member: value,
                user,
                from: date.start?.toString(),
                to: date.end?.toString(),
                type,
            },
            { preserveState: true },
        );
    }

    function handleSupplierChange(value: string | number | null) {
        setSupplier(value);
        router.get(
            route(route().current() as string),
            {
                supplier: value,
                user,
                from: date.start?.toString(),
                to: date.end?.toString(),
                type,
            },
            { preserveState: true },
        );
    }

    function handleTypeChange(value: string | number | null) {
        setType(value);
        router.get(
            route(route().current() as string),
            {
                type: value,
                member,
                user,
                from: date.start?.toString(),
                to: date.end?.toString(),
            },
            { preserveState: true },
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Card className="flex flex-col gap-4 p-4 lg:flex-row">
                <RangeCalendar
                    value={date as any}
                    onChange={(v) =>
                        handelDateRange(
                            v as {
                                start: CalendarDate | null;
                                end: CalendarDate | null;
                            },
                        )
                    }
                    aria-label="Date"
                />
                <Tabs className="w-full" onSelectionChange={handleTypeChange}>
                    <Tabs.List>
                        <Tabs.Label id="sale">Penjualan</Tabs.Label>
                        <Tabs.Label id="purchase">Pembelian</Tabs.Label>
                    </Tabs.List>
                    <Tabs.Content id="sale">
                        <div className="flex flex-col gap-2">
                            <ComboBox
                                label="Member"
                                placeholder="Semua Member"
                                selectedKey={member}
                                onSelectionChange={handleMemberChange}
                                items={[
                                    { id: '', nickname: 'Semua' },
                                    ...members,
                                ]}
                            >
                                {(item) => (
                                    <ComboBox.Item
                                        id={item.id}
                                        textValue={item.nickname}
                                    >
                                        {item.nickname}
                                    </ComboBox.Item>
                                )}
                            </ComboBox>
                            <ComboBox
                                label="Petugas"
                                placeholder="Semua Petugas"
                                selectedKey={user}
                                onSelectionChange={handleUserChange}
                                items={[{ id: '', name: 'Semua' }, ...users]}
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
                    </Tabs.Content>
                    <Tabs.Content id="purchase">
                        <div className="flex flex-col gap-2">
                            <ComboBox
                                label="Supplier"
                                placeholder="Semua Supplier"
                                selectedKey={supplier}
                                onSelectionChange={handleSupplierChange}
                                items={[
                                    { id: '', name: 'Semua' },
                                    ...suppliers,
                                ]}
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
                            <ComboBox
                                label="Petugas"
                                placeholder="Semua Petugas"
                                selectedKey={user}
                                onSelectionChange={handleUserChange}
                                items={[{ id: '', name: 'Semua' }, ...users]}
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
                    </Tabs.Content>
                </Tabs>
            </Card>
            <Card className="p-4">
                <Table aria-label="Data">
                    <Table.Header>
                        <Table.Column isRowHeader>#</Table.Column>
                        <Table.Column>
                            {type === 'sale' ? 'Member' : 'Supplier'}
                        </Table.Column>
                        <Table.Column>Total</Table.Column>
                        <Table.Column>Tanggal</Table.Column>
                    </Table.Header>
                    <Table.Body renderEmptyState={() => <Table.Empty />}>
                        {data.data.length > 0 &&
                            data.data.map((item: any, i: number) => (
                                <Table.Row key={i}>
                                    <Table.Cell>{i + 1}</Table.Cell>
                                    <Table.Cell>
                                        {type === 'purchase'
                                            ? item.supplier?.name
                                            : item.member?.nickname || 'Anonim'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {rupiah(item.total)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {formatDate(item.created_at)}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
            </Card>
        </div>
    );
}

Timeline.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
