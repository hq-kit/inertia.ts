import { Button, Form, TextField } from '@/components/ui';
import GuestLayout from '@/layouts/guest-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />

            <Form
                validationErrors={errors}
                className="grid gap-4"
                onSubmit={submit}
            >
                <TextField
                    isRequired
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    label="Email"
                    autoComplete="username"
                    onChange={(e) => setData('email', e)}
                    errorMessage={errors?.email}
                    isInvalid={!!errors?.email}
                />

                <TextField
                    isRequired
                    isRevealable
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    label="Password"
                    autoComplete="new-password"
                    autoFocus
                    onChange={(e) => setData('password', e)}
                />

                <TextField
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    autoComplete="new-password"
                    onChange={(e) => setData('password_confirmation', e)}
                    label="Confirm Password"
                    isRequired
                    isRevealable
                    errorMessage={errors?.password_confirmation}
                    isInvalid={!!errors?.password_confirmation}
                />

                <div className="flex items-center justify-end">
                    <Button
                        type="submit"
                        isPending={processing}
                        isDisabled={processing}
                    >
                        Reset Password
                    </Button>
                </div>
            </Form>
        </>
    );
}

ResetPassword.layout = (page: React.ReactNode) => (
    <GuestLayout title="Reset Password" description="">
        {page}
    </GuestLayout>
);
