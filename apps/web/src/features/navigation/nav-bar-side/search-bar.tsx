import { useState } from 'react';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div>
            <TextInput
                disabled
                leftIcon="search"
                placeholder="Search"
                size="sm"
                spellCheck={false}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
}
