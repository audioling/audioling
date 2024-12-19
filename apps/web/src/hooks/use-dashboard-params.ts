import { useParams } from 'react-router';

export function useDashboardParams() {
    const { libraryId } = useParams() as { libraryId: string };
    return { libraryId };
}
