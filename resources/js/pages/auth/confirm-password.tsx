import { Button, Form, TextField } from '@/components/ui';
import GuestLayout from '@/layouts/guest-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirm Password" />

            <Form
                validationErrors={errors}
                onSubmit={submit}
                className="grid gap-4"
            >
                <TextField
                    isRevealable
                    isRequired
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    label="Password"
                    errorMessage={errors?.password}
                    isInvalid={!!errors?.password}
                    onChange={(e) => setData('password', e)}
                />

                <div className="flex items-center justify-end">
                    <Button isPending={processing} isDisabled={processing}>
                        Confirm
                    </Button>
                </div>
            </Form>
        </>
    );
}

ConfirmPassword.layout = (page: React.ReactNode) => (
    <GuestLayout
        title="Confirm Password"
        description="This is a secure area of the application. Please confirm your
                password before continuing."
    >
        {page}
    </GuestLayout>
);