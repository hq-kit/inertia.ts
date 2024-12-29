import { Button, Form, TextField } from '@/components/ui';
import GuestLayout from '@/layouts/guest-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-4 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <Form
                onSubmit={submit}
                validationErrors={errors}
                className="grid gap-4"
            >
                <TextField
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    label="Email"
                    autoFocus
                    onChange={(e) => setData('email', e)}
                    errorMessage={errors?.email}
                    isInvalid={!!errors?.email}
                />

                <div className="flex items-center justify-end">
                    <Button
                        type="submit"
                        isDisabled={processing}
                        isPending={processing}
                    >
                        Email Password Reset Link
                    </Button>
                </div>
            </Form>
        </>
    );
}

ForgotPassword.layout = (page: React.ReactNode) => (
    <GuestLayout
        title="Forgot Password"
        description="Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one."
    >
        {page}
    </GuestLayout>
);
