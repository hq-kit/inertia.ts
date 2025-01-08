import { Button, Card, Form, Link, Note, TextField } from '@/components/ui';
import { PageData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const { user } = usePage<PageData>().props.auth;

    const { data, setData, patch, errors, processing } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section>
            <Card>
                <Card.Header>
                    <Card.Title>Account</Card.Title>
                    <Card.Description>Your account details.</Card.Description>
                </Card.Header>
                <Form onSubmit={submit} validationErrors={errors}>
                    <Card.Content className="space-y-4">
                        {mustVerifyEmail && (
                            <Note variant="warning">
                                Your email address is unverified.
                                <Link
                                    href={route('verification.send')}
                                    variant="primary"
                                    routerOptions={{
                                        method: 'post',
                                    }}
                                >
                                    Click here to re-send the verification
                                    email.
                                </Link>
                            </Note>
                        )}

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-success">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                        <TextField
                            autoFocus
                            label="Name"
                            placeholder="Enter your name"
                            id="name"
                            name="name"
                            isRequired
                            value={data.name}
                            onChange={(e) => setData('name', e)}
                        />
                        <TextField
                            label="Username"
                            placeholder="Enter your username"
                            id="username"
                            name="username"
                            isRequired
                            value={data.username}
                            onChange={(e) => setData('username', e)}
                        />
                        <TextField
                            type="email"
                            isRequired
                            label="Email"
                            placeholder="Enter your email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e)}
                        />
                    </Card.Content>
                    <Card.Footer>
                        <Button
                            type="submit"
                            isPending={processing}
                            isDisabled={processing}
                        >
                            Save
                        </Button>
                    </Card.Footer>
                </Form>
            </Card>
        </section>
    );
}
