import { Button, Form, Link, TextField } from '@/components/ui'
import GuestLayout from '@/layouts/guest-layout'
import { useForm } from '@inertiajs/react'
import React from 'react'

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    React.useEffect(() => {
        return () => {
            reset('password', 'password_confirmation')
        }
    }, [])

    const submit = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        post(route('register'))
    }

    return (
        <>
            <Form
                validationErrors={errors}
                onSubmit={submit}
                className="grid gap-4"
            >
                <TextField
                    id="name"
                    name="name"
                    value={data.name}
                    label="Name"
                    autoComplete="name"
                    autoFocus
                    onChange={(e) => setData('name', e)}
                    errorMessage={errors?.name}
                    isInvalid={!!errors?.name}
                />
                <TextField
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    label="Email"
                    autoComplete="email"
                    onChange={(e) => setData('email', e)}
                    errorMessage={errors?.email}
                    isInvalid={!!errors?.email}
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
                <TextField
                    isRevealable
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    label="Confirm Password"
                    autoComplete="current-password"
                    onChange={(e) => setData('password_confirmation', e)}
                    errorMessage={errors?.password_confirmation}
                    isInvalid={!!errors?.password_confirmation}
                />

                <div className="mt-6 flex items-center justify-end">
                    <Link
                        className="text-sm"
                        variant="default"
                        href={route('login')}
                    >
                        Already registered?
                    </Link>

                    <Button
                        type="submit"
                        className="ms-4"
                        isPending={processing}
                        isDisabled={processing}
                    >
                        Register
                    </Button>
                </div>
            </Form>
        </>
    )
}

Register.layout = (page: React.ReactNode) => (
    <GuestLayout title="Register" description="Register a new account">
        {page}
    </GuestLayout>
)
