import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { AuthUser } from '@/api/api-types.ts';
import type { PutApiUsersIdBody } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { useGetApiUsersIdSuspense, usePutApiUsersId } from '@/api/openapi-generated/users/users.ts';
import { useAuthUser } from '@/features/authentication/stores/auth-store.ts';
import type { GeneralModalChildProps } from '@/features/shared/general-modal/general-modal.tsx';
import { GeneralModal } from '@/features/shared/general-modal/general-modal.tsx';
import { Alert } from '@/features/ui/alert/alert.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Checkbox } from '@/features/ui/checkbox/checkbox.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { Modal } from '@/features/ui/modal/modal.tsx';
import { PasswordInput } from '@/features/ui/password-input/password-input.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';

interface EditProfileFormProps {}

export function EditProfileForm(props: EditProfileFormProps & Partial<GeneralModalChildProps>) {
    const { closeModal } = props;
    const self = useAuthUser() as AuthUser;

    const { data: user } = useGetApiUsersIdSuspense(self.id);

    const form = useForm<PutApiUsersIdBody>({
        defaultValues: {
            displayName: user.data.displayName || '',
            isAdmin: user.data.isAdmin || false,
            isEnabled: user.data.isEnabled || false,
            password: '',
            username: user.data.username || '',
        },
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { mutate } = usePutApiUsersId();

    const handleSubmit = form.handleSubmit((data) => {
        if (data.password && data.password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        mutate(
            {
                data,
                id: user.data.id,
            },
            {
                onSuccess: () => {
                    closeModal?.();
                },
            },
        );
    });

    useEffect(() => {
        form.setFocus('username');
    }, [form]);

    return (
        <form id="edit-profile-form" onSubmit={handleSubmit}>
            <Stack>
                <Group>
                    <TextInput required label="Username" {...form.register('username')} />
                    <TextInput label="Display Name" {...form.register('displayName')} />
                </Group>
                <PasswordInput label="Password" {...form.register('password')} type="password" />
                <PasswordInput
                    label="Confirm Password"
                    required={!!form.watch('password')}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Divider />
                <Group>
                    <Checkbox
                        disabled
                        label="Is Admin"
                        value={Boolean(form.watch('isAdmin'))}
                        onChange={() => {}}
                    />
                    <Checkbox
                        disabled
                        label="Is Enabled"
                        value={Boolean(form.watch('isEnabled'))}
                        onChange={() => {}}
                    />
                </Group>
                {error && <Alert message={error} state="error" />}
                <Modal.ButtonGroup>
                    <Button type="button" variant="default" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="filled">
                        Update
                    </Button>
                </Modal.ButtonGroup>
            </Stack>
        </form>
    );
}

export const EditProfileModal = () => {
    return GeneralModal.call({
        children: <EditProfileForm />,
        closeOnClickOutside: true,
        size: 'md',
        title: 'Edit Profile',
    });
};
