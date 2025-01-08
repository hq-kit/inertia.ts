import { Button, Form, Link } from '@/components/ui'
import GuestLayout from '@/layouts/guest-layout'
import { useForm } from '@inertiajs/react'

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({})

    const submit = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        post(route('verification.send'))
    }

    return (
        <>
            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-success">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <Form
                onSubmit={submit}
                className="mt-4 flex items-center justify-between"
            >
                <Button isDisabled={processing} isPending={processing}>
                    Resend Verification Email
                </Button>

                <Link routerOptions={{ method: 'post' }} href={route('logout')}>
                    Log Out
                </Link>
            </Form>
        </>
    )
}

VerifyEmail.layout = (page: React.ReactNode) => (
    <GuestLayout
        title="Verify Email"
        description="Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another."
    >
        {page}
    </GuestLayout>
)
