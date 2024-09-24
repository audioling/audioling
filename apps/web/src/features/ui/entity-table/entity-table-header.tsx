import type { CSSProperties } from 'react';
import { Fragment } from 'react';
import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import styles from './entity-table-header.module.scss';

interface EntityTableHeaderProps<T> {
    headerColumnStyles: CSSProperties;
    table: Table<T>;
    tableId: string;
}

export const EntityTableHeader = <T,>(props: EntityTableHeaderProps<T>) => {
    const { headerColumnStyles, table, tableId } = props;

    return (
        <div className={styles.tableHeaderContainer}>
            <div className={styles.tableHeader}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <div
                        key={headerGroup.id}
                        className={styles.tableHeaderColumn}
                        style={{ ...headerColumnStyles }}
                    >
                        {headerGroup.headers.map((header, index) => {
                            if (header.column.columnDef.size === 0) {
                                return null;
                            }

                            const isLastColumn = index === headerGroup.headers.length - 1;

                            return (
                                <Fragment key={header.id}>
                                    <div>
                                        {header.isPlaceholder ? null : (
                                            <div className={styles.tableHeaderColumnWrapper}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {!isLastColumn && <hr className={styles.tableHeaderDivider} />}
                                </Fragment>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
