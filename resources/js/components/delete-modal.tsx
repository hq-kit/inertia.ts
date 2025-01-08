import { Button, Modal } from '@/components/ui'
import { router } from '@inertiajs/react'

interface Props {
    title?: string
    description?: string
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    route: string
    children?: React.ReactNode
}

export default function DeleteModal({
    title = 'Delete!',
    description = 'Are you sure you want to delete this item?',
    isOpen,
    setIsOpen,
    route,
    children,
}: Props) {
    return (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            {children ?? <Modal.Trigger className="sr-only" />}
            <Modal.Content isDismissable={false}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                    <Modal.Description>{description}</Modal.Description>
                </Modal.Header>
                <Modal.Footer>
                    <Modal.Close>Cancel</Modal.Close>
                    <Button
                        onPress={() =>
                            router.delete(route, {
                                preserveScroll: true,
                                onSuccess: () => setIsOpen(false),
                            })
                        }
                        variant="danger"
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
