import { Paper } from '@/features/ui/paper/paper.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { Title } from '@/features/ui/title/title.tsx';

interface ItemCountCardProps {
    count: number;
    label: string;
}

export function ItemCountCard({ count, label }: ItemCountCardProps) {
    return (
        <Paper>
            <Stack gap="xs">
                <Title order={3}>{count}</Title>
                <Text size="lg">{label}</Text>
            </Stack>
        </Paper>
    );
}
