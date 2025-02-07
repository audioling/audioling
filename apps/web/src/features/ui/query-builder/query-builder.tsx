import { useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
    attachClosestEdge,
    type Edge,
    extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { ListSortOrder } from '@repo/shared-types';
import clsx from 'clsx';
import { nanoid } from 'nanoid/non-secure';
import { AlbumArtistSelect } from '@/features/shared/album-artist-select/album-artist-select.tsx';
import { AlbumSelect } from '@/features/shared/album-select/album-select.tsx';
import { ArtistSelect } from '@/features/shared/artist-select/artist-select.tsx';
import { GenreSelect } from '@/features/shared/genre-select/genre-select.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton, IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { NumberInput } from '@/features/ui/number-input/number-input.tsx';
import { SelectInput } from '@/features/ui/select-input/select-input.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragTarget } from '@/utils/drag-drop.ts';
import styles from './query-builder.module.scss';

type Operator =
    | 'is'
    | 'isIn'
    | 'isNot'
    | 'isNotIn'
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'match'
    | 'isGreaterThan'
    | 'isGreaterThanOrEqual'
    | 'isLessThan'
    | 'isLessThanOrEqual'
    | 'isInTheRange'
    | 'isNotInTheRange'
    | 'isBefore'
    | 'isAfter'
    | 'inTheLast'
    | 'notInTheLast';

type FunctionOperator = 'contains' | 'match';
type AllOperators = Operator | FunctionOperator;

type OperatorValue = number | string;

type FilterValue =
    | string
    | number
    | boolean
    | { [K in Operator]?: OperatorValue }
    | { [K in FunctionOperator]?: string };

interface FilterCondition {
    [key: string]: FilterValue | FilterValue[];
}

interface AndCondition {
    AND: (FilterCondition | OrCondition | AndCondition)[];
}

interface OrCondition {
    OR: (FilterCondition | OrCondition | AndCondition)[];
}

export type QueryBuilderField = {
    label: string;
    type: string;
    value: string;
};

export type QueryBuilderFields = Record<
    string,
    QueryBuilderField & { operators: QueryBuilderOperator[] }
>;

export type QueryBuilderOperator = {
    input: string;
    label: string;
    value: string;
};

// New nested filter types
export type QueryBuilderCondition = {
    condition: {
        [K in AllOperators]?: OperatorValue;
    };
    conditionId: string;
    field: string;
};

export type QueryBuilderGroup = {
    conditions: (QueryBuilderCondition | QueryBuilderGroup)[];
    groupId: string;
    operator: 'AND' | 'OR';
};

export interface QueryFilter {
    limit?: number;
    rules: QueryBuilderCondition | QueryBuilderGroup;
    sortBy: QuerySortBy[];
}

export interface SerializedQueryFilter {
    limit?: number;
    rules: Omit<QueryBuilderCondition, 'conditionId'> | Omit<QueryBuilderGroup, 'groupId'>;
    sortBy: QuerySortBy[];
}

export function serializeFilter(filter: QueryFilter): SerializedQueryFilter {
    // Helper function to serialize a condition or group
    const serializeRules = (
        rules: QueryBuilderCondition | QueryBuilderGroup,
    ): Omit<QueryBuilderCondition, 'conditionId'> | Omit<QueryBuilderGroup, 'groupId'> | null => {
        // Handle condition
        if ('condition' in rules) {
            const { field, condition } = rules;
            const operator = Object.keys(condition)[0];
            const value = condition[operator as keyof typeof condition];

            // Skip invalid conditions
            if (!field || !operator || !value) {
                return null;
            }

            // Return condition without conditionId
            return { condition, field };
        }

        // Handle group
        const validConditions = rules.conditions
            .map((item) => serializeRules(item))
            .filter((item): item is NonNullable<typeof item> => item !== null);

        // Skip empty groups
        if (validConditions.length === 0) {
            return null;
        }

        // Return group without groupId
        return {
            conditions: validConditions as (QueryBuilderCondition | QueryBuilderGroup)[],
            operator: rules.operator,
        };
    };

    // Filter out invalid sortBy items
    const validSortBy = filter.sortBy.filter((item) => item.direction && item.field);

    const serializedRules = serializeRules(filter.rules);
    if (!serializedRules) {
        // Return minimal valid filter if all rules were invalid
        return {
            rules: { condition: { is: '' }, field: '' },
            sortBy: validSortBy,
        };
    }

    return {
        limit: filter.limit,
        rules: serializedRules,
        sortBy: validSortBy,
    };
}

export interface QuerySortBy {
    direction: 'asc' | 'desc';
    field: string;
}

interface FilterConditionInputProps {
    onChange: (value: string | number | boolean | null) => void;
    type: string | undefined;
    value: string;
}

function FilterConditionInput({ type, onChange, value }: FilterConditionInputProps) {
    switch (type) {
        case 'text':
            return <TextInput value={value} onChange={(e) => onChange(e.target.value)} />;
        case 'number':
            return <NumberInput value={value} onChange={(e) => onChange(e)} />;
        case 'date':
            return null;
        case 'dateRange':
            return null;
        case 'boolean':
            return (
                <SelectInput
                    data={[
                        { label: 'true', value: 'true' },
                        { label: 'false', value: 'false' },
                    ]}
                    value={value}
                    onChange={(e) => onChange(e)}
                />
            );
        case 'select':
            return <SelectInput data={[]} value={value} onChange={(e) => onChange(e)} />;
        case 'albumSelect':
            return <AlbumSelect value={value} onChange={(e) => onChange(e)} />;
        case 'albumArtistSelect':
            return <AlbumArtistSelect value={value} onChange={(e) => onChange(e)} />;
        case 'artistSelect':
            return <ArtistSelect value={value} onChange={(e) => onChange(e)} />;
        case 'genreSelect':
            return <GenreSelect value={value} onChange={(e) => onChange(e)} />;
    }

    return null;
}

interface FilterConditionProps {
    condition: QueryBuilderCondition['condition'];
    conditionId: string;
    field: string;
    fields: QueryBuilderFields;
    index: number;
    onRemove?: (index: number) => void;
    onRowDrop?: (fromId: string, toId: string, edge: Edge) => void;
    onUpdate: (updates: Partial<QueryBuilderCondition> | QueryBuilderGroup) => void;
    operator: string;
}

function FilterCondition({
    condition,
    field,
    fields,
    operator,
    conditionId,
    index,
    onUpdate,
    onRemove,
    onRowDrop,
}: FilterConditionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLButtonElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggedOver, setIsDraggedOver] = useState<Edge | null>(null);

    const operators = fields[field].operators;
    const inputType = operators.find((o) => o.value === operator)?.input;

    useEffect(() => {
        if (!ref.current || !dragHandleRef.current) return;

        return combine(
            draggable({
                element: dragHandleRef.current,
                getInitialData: () => {
                    return dndUtils.generateDragData({
                        id: [conditionId],
                        type: DragTarget.QUERY_BUILDER_ROW,
                    });
                },
                onDragStart: () => {
                    setIsDragging(true);
                },
                onDrop: () => {
                    setIsDragging(false);
                },
            }),
            dropTargetForElements({
                canDrop: ({ source }) => {
                    const data = source.data as DragData;

                    // Prevent dropping on self
                    if (data.id.includes(conditionId)) return false;

                    return dndUtils.isDropTarget(data.type, [DragTarget.QUERY_BUILDER_ROW]);
                },
                element: ref.current,
                getData: ({ input, element }) => {
                    const data = dndUtils.generateDragData({
                        id: [conditionId],
                        type: DragTarget.QUERY_BUILDER_ROW,
                    });

                    return attachClosestEdge(data, {
                        allowedEdges: ['top', 'bottom'],
                        element,
                        input,
                    });
                },
                onDrag: (args) => {
                    const closestEdgeOfTarget: Edge | null = extractClosestEdge(args.self.data);
                    setIsDraggedOver(closestEdgeOfTarget);
                },
                onDragLeave: () => {
                    setIsDraggedOver(null);
                },
                onDrop: ({ source }) => {
                    const data = source.data as DragData;
                    onRowDrop?.(data.id[0], conditionId, isDraggedOver || 'top');
                    setIsDraggedOver(null);
                },
            }),
        );
    }, [conditionId, isDraggedOver, onRowDrop]);

    const handleChangeField = (value: string | null) => {
        if (!value) {
            return onUpdate({ condition: { [operators[0].value]: '' }, field: '' });
        }

        // Fetch operators for the new field
        const newFieldOperators = fields[value].operators;

        return onUpdate({
            condition: { [newFieldOperators[0].value]: '' },
            field: value as keyof typeof fields,
        });
    };

    const handleChangeOperator = (value: string | null) => {
        if (!value) {
            return onUpdate({ condition: {} });
        }

        const operator = fields[field].operators.find((operator) => operator.value === value);

        if (!operator) {
            return;
        }

        return onUpdate({ condition: { [operator.value]: '' } });
    };

    return (
        <Group
            ref={ref}
            className={clsx({
                [styles.dragging]: isDragging,
                [styles.draggedOverTop]: isDraggedOver === 'top',
                [styles.draggedOverBottom]: isDraggedOver === 'bottom',
            })}
            gap="sm"
            my="sm"
        >
            <IconButton ref={dragHandleRef} icon="dragVertical" />
            <SelectInput
                data={Object.entries(fields).map(([key, field]) => ({
                    label: field.label,
                    value: key,
                }))}
                value={field}
                onChange={handleChangeField}
            />
            <SelectInput data={operators} value={operator} onChange={handleChangeOperator} />
            <FilterConditionInput
                type={inputType}
                value={condition[operator as keyof typeof condition] as string}
                onChange={(e) => onUpdate({ condition: { [operator]: e } })}
            />
            <RemoveRuleButton onRemove={() => onRemove?.(index)} />
        </Group>
    );
}

interface GroupOptionsButtonProps {
    isRemoveGroupDisabled?: boolean;
    onAddGroup: () => void;
    onRemoveGroup: () => void;
}

function GroupOptionsButton({
    isRemoveGroupDisabled,
    onAddGroup,
    onRemoveGroup,
}: GroupOptionsButtonProps) {
    return (
        <Menu>
            <Menu.Target>
                <IconButtonWithTooltip
                    icon="ellipsisVertical"
                    tooltipProps={{ label: 'Options', openDelay: 1000 }}
                >
                    Group options
                </IconButtonWithTooltip>
            </Menu.Target>
            <Menu.Content>
                <Menu.Item onSelect={onAddGroup}>Add rule group</Menu.Item>
                <Menu.Item disabled={isRemoveGroupDisabled} onSelect={onRemoveGroup}>
                    Remove rule group
                </Menu.Item>
            </Menu.Content>
        </Menu>
    );
}

interface AddRuleButtonProps {
    onAddRule: () => void;
}

function AddRuleButton({ onAddRule }: AddRuleButtonProps) {
    return (
        <IconButtonWithTooltip
            icon="add"
            tooltipProps={{ label: 'Add a new rule', openDelay: 1000 }}
            onClick={onAddRule}
        >
            Add rule
        </IconButtonWithTooltip>
    );
}

function RemoveRuleButton({ onRemove }: { onRemove: () => void }) {
    return (
        <IconButtonWithTooltip
            icon="remove"
            tooltipProps={{ label: 'Remove rule', openDelay: 1000 }}
            onClick={onRemove}
        />
    );
}

interface RecursiveFilterGroupProps {
    fields: QueryBuilderFields;
    group: QueryBuilderGroup;
    groupId: string;
    onRemove?: (groupId: string) => void;
    onRowDrop?: (fromId: string, toId: string, edge: Edge) => void;
    onUpdate: (updates: QueryBuilderGroup) => void;
}

function RecursiveFilterGroup({
    fields,
    group,
    onUpdate,
    onRemove,
    groupId,
    onRowDrop,
}: RecursiveFilterGroupProps) {
    const handleAddRule = () => {
        onUpdate({
            ...group,
            conditions: [
                ...group.conditions,
                {
                    condition: { is: '' },
                    conditionId: nanoid(),
                    field: 'name' as string,
                },
            ],
        });
    };

    const handleRemoveRule = (index: number) => {
        onUpdate({
            ...group,
            conditions: group.conditions.filter((_, i) => i !== index),
        });
    };

    const handleAddGroup = () => {
        onUpdate({
            ...group,
            conditions: [
                ...group.conditions,
                {
                    conditions: [],
                    groupId: nanoid(),
                    operator: 'AND',
                },
            ],
        });
    };

    const handleRemoveGroup = () => {
        onRemove?.(groupId);
    };

    const handleUpdateCondition = (
        index: number,
        updatedCondition: QueryBuilderGroup | QueryBuilderCondition,
    ) => {
        // Create a new array of conditions with the updated condition at the specified index
        const updatedConditions = [...group.conditions];
        updatedConditions[index] = updatedCondition;

        // Update the entire group with the new conditions
        onUpdate({
            ...group,
            conditions: updatedConditions,
        });
    };

    return (
        <div className={styles.filterGroup}>
            <Group gap="sm">
                <SelectInput
                    data={[
                        { label: 'AND', value: 'AND' },
                        { label: 'OR', value: 'OR' },
                    ]}
                    value={group.operator}
                    onChange={(e) => onUpdate({ ...group, operator: e as 'AND' | 'OR' })}
                />
                <AddRuleButton onAddRule={handleAddRule} />
                <GroupOptionsButton
                    isRemoveGroupDisabled={groupId === 'root'}
                    onAddGroup={handleAddGroup}
                    onRemoveGroup={handleRemoveGroup}
                />
            </Group>

            {group.conditions.map((condition, index) => {
                return 'operator' in condition ? (
                    <RecursiveFilterGroup
                        key={condition.groupId}
                        fields={fields}
                        group={condition}
                        groupId={condition.groupId}
                        onRemove={onRemove}
                        onRowDrop={onRowDrop}
                        onUpdate={(updates) => handleUpdateCondition(index, updates)}
                    />
                ) : (
                    <FilterCondition
                        key={condition.conditionId}
                        condition={condition.condition}
                        conditionId={condition.conditionId}
                        field={condition.field}
                        fields={fields}
                        index={index}
                        operator={Object.keys(condition.condition)[0] || ''}
                        onRemove={handleRemoveRule}
                        onRowDrop={onRowDrop}
                        onUpdate={(updates) => {
                            const newConditions = [...group.conditions];
                            newConditions[index] = { ...condition, ...updates };
                            onUpdate({ ...group, conditions: newConditions });
                        }}
                    />
                );
            })}
        </div>
    );
}

interface SortByConditionProps {
    fields: QueryBuilderField[];
    index: number;
    isRemoveDisabled?: boolean;
    isRowMoveDownDisabled?: boolean;
    onRemove: () => void;
    onRowMoveDown: (index: number) => void;
    onUpdate: (updates: QuerySortBy) => void;
    sortBy: QuerySortBy;
}

function SortByCondition({
    fields,
    index,
    isRemoveDisabled,
    isRowMoveDownDisabled,
    onRemove,
    onRowMoveDown,
    onUpdate,
    sortBy,
}: SortByConditionProps) {
    const itemRef = useRef<HTMLDivElement>(null);

    return (
        <Group ref={itemRef} gap="sm" grow={false}>
            <SelectInput
                data={fields.map((field) => ({ label: field.label, value: field.value }))}
                value={sortBy.field}
                onChange={(e) => onUpdate({ ...sortBy, field: e as string })}
            />
            <SelectInput
                data={[
                    { label: 'Ascending', value: ListSortOrder.ASC },
                    { label: 'Descending', value: ListSortOrder.DESC },
                ]}
                value={sortBy.direction}
                onChange={(e) => onUpdate({ ...sortBy, direction: e as ListSortOrder })}
            />
            <IconButton
                disabled={isRowMoveDownDisabled}
                icon="arrowDown"
                onClick={() => onRowMoveDown(index)}
            />
            <IconButton disabled={isRemoveDisabled} icon="remove" onClick={onRemove} />
        </Group>
    );
}

interface SortByConditionsProps {
    fields: QueryBuilderField[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onRowMoveDown: (index: number) => void;
    onUpdate: (index: number, updates: QuerySortBy) => void;
    sortBy: QuerySortBy[];
}

function SortByConditions({
    fields,
    onAdd,
    onRemove,
    onRowMoveDown,
    onUpdate,
    sortBy,
}: SortByConditionsProps) {
    return (
        <Stack gap="sm">
            {sortBy?.map((condition, index) => (
                <SortByCondition
                    key={`sort-by-${index}`}
                    fields={fields}
                    index={index}
                    isRemoveDisabled={sortBy.length === 1}
                    isRowMoveDownDisabled={index === sortBy.length - 1}
                    sortBy={condition}
                    onRemove={() => onRemove(index)}
                    onRowMoveDown={() => onRowMoveDown(index)}
                    onUpdate={(updates) => onUpdate(index, updates)}
                />
            ))}
            <Button onClick={onAdd}>Add sort</Button>
        </Stack>
    );
}

interface QueryBuilderProps {
    disabled?: boolean;
    filter: QueryFilter;
    onFilterChange: (filter: QueryFilter) => void;
    queryFields: QueryBuilderFields;
    sortFields: QueryBuilderField[];
}

export function QueryBuilder({
    disabled,
    queryFields,
    sortFields,
    filter,
    onFilterChange,
}: QueryBuilderProps) {
    const handleUpdate = (updates: QueryBuilderGroup | Partial<QueryBuilderCondition>) => {
        onFilterChange({
            limit: filter.limit,
            rules: updates as QueryBuilderGroup | QueryBuilderCondition,
            sortBy: filter.sortBy,
        });
    };

    const handleRemoveGroup = (groupIdToRemove: string) => {
        if (!('operator' in filter.rules)) return;

        // Helper function to recursively process the filter structure
        const removeGroupFromConditions = (group: QueryBuilderGroup): QueryBuilderGroup => {
            // First, filter out the group if it's a direct child
            const filteredConditions = group.conditions.filter((condition) => {
                if ('operator' in condition) {
                    return condition.groupId !== groupIdToRemove;
                }
                return true;
            });

            // Then recursively process any nested groups
            const processedConditions = filteredConditions.map((condition) => {
                if ('operator' in condition) {
                    return removeGroupFromConditions(condition);
                }
                return condition;
            });

            return {
                ...group,
                conditions: processedConditions,
            };
        };

        const updatedFilter = removeGroupFromConditions(filter.rules);
        onFilterChange({ ...filter, rules: updatedFilter });
    };

    const handleRowDrop = (fromId: string, toId: string, edge: Edge) => {
        if (!('operator' in filter.rules)) return;

        // Helper function to find and remove item by ID
        const removeItem = (
            group: QueryBuilderGroup,
        ): [QueryBuilderGroup, QueryBuilderCondition | QueryBuilderGroup | undefined] => {
            const conditions = [...group.conditions];
            const itemIndex = conditions.findIndex(
                (item) =>
                    ('conditionId' in item && item.conditionId === fromId) ||
                    ('groupId' in item && item.groupId === fromId),
            );

            if (itemIndex !== -1) {
                const [removed] = conditions.splice(itemIndex, 1);
                return [{ ...group, conditions }, removed];
            }

            // Search nested groups
            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                if ('operator' in condition) {
                    const [updatedGroup, removed] = removeItem(condition);
                    if (removed) {
                        conditions[i] = updatedGroup;
                        return [{ ...group, conditions }, removed];
                    }
                }
            }

            return [group, undefined];
        };

        // Helper function to insert item by ID
        const insertItem = (
            group: QueryBuilderGroup,
            item: QueryBuilderCondition | QueryBuilderGroup,
            edge: Edge,
        ): QueryBuilderGroup => {
            const conditions = [...group.conditions];
            const targetIndex = conditions.findIndex(
                (existing) =>
                    ('conditionId' in existing && existing.conditionId === toId) ||
                    ('groupId' in existing && existing.groupId === toId),
            );

            if (targetIndex !== -1) {
                // Insert after the target if dropping on bottom edge
                const insertPosition = edge === 'bottom' ? targetIndex + 1 : targetIndex;

                conditions.splice(insertPosition, 0, item);
                return { ...group, conditions };
            }

            // Search nested groups
            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                if ('operator' in condition) {
                    conditions[i] = insertItem(condition, item, edge);
                }
            }

            return { ...group, conditions };
        };

        const [afterRemoval, removedItem] = removeItem(filter.rules);
        if (removedItem) {
            const finalFilter = insertItem(afterRemoval, removedItem, edge);
            onFilterChange({ ...filter, rules: finalFilter });
        }
    };

    const handleAddSortBy = () => {
        onFilterChange({
            ...filter,
            sortBy: [...filter.sortBy, { direction: ListSortOrder.ASC, field: '' }],
        });
    };

    const handleRemoveSortBy = (index: number) => {
        onFilterChange({
            ...filter,
            sortBy: filter.sortBy.filter((_, i) => i !== index),
        });
    };

    const handleUpdateSortBy = (index: number, updates: QuerySortBy) => {
        onFilterChange({
            ...filter,
            sortBy: filter.sortBy.map((sortBy, i) => (i === index ? updates : sortBy)),
        });
    };

    const handleRowMoveDown = (index: number) => {
        const sortBy = [...filter.sortBy];
        const [moved] = sortBy.splice(index, 1);
        sortBy.splice(index + 1, 0, moved);
        onFilterChange({ ...filter, sortBy });
    };

    return (
        <div
            className={clsx({
                [styles.container]: true,
                [styles.disabled]: disabled,
            })}
        >
            <Stack gap="sm">
                {'operator' in filter.rules ? (
                    <RecursiveFilterGroup
                        fields={queryFields}
                        group={filter.rules}
                        groupId="root"
                        onRemove={handleRemoveGroup}
                        onRowDrop={handleRowDrop}
                        onUpdate={handleUpdate}
                    />
                ) : (
                    <FilterCondition
                        condition={filter.rules.condition}
                        conditionId={filter.rules.conditionId}
                        field={filter.rules.field}
                        fields={queryFields}
                        index={0}
                        operator={Object.keys(filter.rules.condition)[0] || ''}
                        onRowDrop={handleRowDrop}
                        onUpdate={handleUpdate}
                    />
                )}
            </Stack>
            <SortByConditions
                fields={sortFields}
                sortBy={filter.sortBy}
                onAdd={handleAddSortBy}
                onRemove={handleRemoveSortBy}
                onRowMoveDown={handleRowMoveDown}
                onUpdate={handleUpdateSortBy}
            />
        </div>
    );
}
