import { Button, Checkbox, Form, Link, TextField } from '@/components/ui';
import GuestLayout from '@/layouts/guest-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <Form
                validationErrors={errors}
                onSubmit={submit}
                className="grid gap-4"
            >
                <TextField
                    id="credential"
                    name="credential"
                    value={data.username}
                    label="Username / Email"
                    autoComplete="username"
                    autoFocus
                    onChange={(e) => setData('username', e)}
                    errorMessage={errors?.username}
                    isInvalid={!!errors?.username}
                />
                <TextField
                    isRevealable
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    label="Password"
                    autoComplete="current-password"
                    onChange={(e) => setData('password', e)}
                    errorMessage={errors?.password}
                    isInvalid={!!errors?.password}
                />

                <div className="flex justify-between">
                    <Checkbox
                        name="remember"
                        label="Remember me"
                        isSelected={data.remember}
                        onChange={(e) => setData('remember', e)}
                        isInvalid={!!errors?.remember}
                    />
                    {canResetPassword && (
                        <Link
                            className="text-sm"
                            variant="default"
                            href={route('password.request')}
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-end">
                    {canRegister && (
                        <Link
                            className="text-sm"
                            variant="default"
                            href={route('register')}
                        >
                            Register
                        </Link>
                    )}

                    <Button
                        type="submit"
                        className="ms-4"
                        isPending={processing}
                        isDisabled={processing}
                    >
                        Log in
                    </Button>
                </div>
            </Form>
        </>
    );
}

Login.layout = (page: React.ReactNode) => (
    <GuestLayout title="Log in" description="Log in to your account">
        {page}
    </GuestLayout>
);
