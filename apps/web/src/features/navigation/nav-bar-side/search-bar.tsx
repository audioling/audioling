import { useState } from 'react';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import styles from './search-bar.module.scss';

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className={styles.searchBar}>
            <TextInput
                placeholder="Search"
                rightSection={
                    <>
                        {searchQuery ? (
                            <IconButton icon="x" size="md" onClick={handleClearSearch} />
                        ) : (
                            <IconButton icon="search" size="md" />
                        )}
                    </>
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
}
