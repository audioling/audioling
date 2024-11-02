import { useState } from 'react';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import styles from './search-bar.module.scss';

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className={styles.searchBar}>
            <TextInput
                placeholder="Search"
                size="xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
}
