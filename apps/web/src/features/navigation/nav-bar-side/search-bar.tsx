import { useState } from 'react';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import styles from './search-bar.module.scss';

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className={styles.searchBar}>
            <TextInput
                leftSection={<IconButton icon="search" size="sm" />}
                placeholder="Search"
                size="xs"
                spellCheck={false}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
}
