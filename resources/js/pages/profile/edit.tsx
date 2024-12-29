import { Card, Tabs } from '@/components/ui';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import DeleteUser from './partials/delete-user';
import UpdatePassword from './partials/update-password';
import UpdateProfileInformation from './partials/update-profile';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <>
            <Card borderless>
                <Card.Header withoutPadding>
                    <Card.Title>User Setting</Card.Title>
                    <Card.Description>
                        Manage your account settings and preferences.
                    </Card.Description>
                </Card.Header>
            </Card>
            <Tabs
                className="w-full gap-x-24"
                isResponsive
                aria-label="E-Learning Platform"
            >
                <Tabs.List className="h-fit">
                    <Tabs.Label id="account">Account</Tabs.Label>
                    <Tabs.Label id="security">Security</Tabs.Label>
                    <Tabs.Label id="danger">Danger Area</Tabs.Label>
                </Tabs.List>
                <Tabs.Content id="account">
                    <UpdateProfileInformation
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </Tabs.Content>
                <Tabs.Content id="security">
                    <UpdatePassword />
                </Tabs.Content>
                <Tabs.Content id="danger">
                    <DeleteUser />
                </Tabs.Content>
            </Tabs>
        </>
    );
}

Edit.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
