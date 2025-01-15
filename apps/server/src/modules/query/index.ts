import type { IdFactoryModule } from '@/modules/id/index.js';

type QueryMetadata = {
    dateFinished: string | null;
    dateStarted: string | null;
    isRunning: boolean;
    totalRecordCount: number | null;
};

export type Query<T extends Record<string, unknown> = Record<string, unknown>> = {
    abortController: AbortController;
    metadata: T & QueryMetadata;
};

export const TRACK_INDEX_JOB_ID = 'tracks-index';

export const initQueryModule = (modules: { idFactory: IdFactoryModule }) => {
    const { idFactory } = modules;

    const queries = new Map<string, Query>();

    return {
        // ANCHOR - Abort
        abort: async (args: { id: string }) => {
            const job = queries.get(args.id);
            if (job) {
                job.abortController.abort();
            }
        },
        // ANCHOR - Create
        create: async (args: { id?: string; metadata?: QueryMetadata }) => {
            const abortId = args.id || idFactory.generate();
            const abortController = new AbortController();
            queries.set(abortId, {
                abortController,
                metadata: args.metadata || {
                    dateFinished: null,
                    dateStarted: null,
                    isRunning: true,
                    totalRecordCount: null,
                },
            });
            return abortController;
        },
        // ANCHOR - Find
        find: async (args: { id: string }) => {
            return queries.get(args.id);
        },
        findAll: async () => {
            // Return as an object
            return Object.fromEntries(queries.entries());
        },
        // ANCHOR - Get Metadata
        getMetadata: async (args: { id: string }) => {
            const job = queries.get(args.id);
            if (job) {
                return job.metadata;
            }
            return null;
        },

        isAborted: async (args: { id: string }) => {
            const job = queries.get(args.id);
            if (job) {
                return job.abortController.signal.aborted;
            }
            return false;
        },
        // ANCHOR - Update
        update: async (args: { id: string; metadata: (prev: QueryMetadata) => QueryMetadata }) => {
            const job = queries.get(args.id);
            if (job) {
                job.metadata = args.metadata(job.metadata);
                queries.set(args.id, job);
            }
        },
    };
};

export type SerializedOperator =
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

type Operator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'neq' | 'in';
type FunctionOperator = 'notIn' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'match';
export type AllOperators = Operator | FunctionOperator;

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

type QueryBuilderCondition = {
    condition: {
        [K in SerializedOperator]?: OperatorValue;
    };
    field: string;
};

type QueryBuilderGroup = {
    conditions: (QueryBuilderCondition | QueryBuilderGroup)[];
    operator: 'AND' | 'OR';
};

const operators: Record<Operator, string> = {
    eq: '=',
    gt: '>',
    gte: '>=',
    in: 'in',
    lt: '<',
    lte: '<=',
    neq: '!=',
};

function deserializeOperator(operator: SerializedOperator): AllOperators {
    switch (operator) {
        case 'is':
            return 'eq';
        case 'isNot':
            return 'neq';
        case 'isIn':
            return 'in';
        case 'isNotIn':
            return 'notIn';
        case 'contains':
            return 'contains';
        case 'notContains':
            return 'notContains';
        case 'startsWith':
            return 'startsWith';
        case 'endsWith':
            return 'endsWith';
        case 'match':
            return 'match';
        case 'isGreaterThan':
            return 'gt';
        case 'isGreaterThanOrEqual':
            return 'gte';
        case 'isLessThan':
            return 'lt';
        case 'isLessThanOrEqual':
            return 'lte';
        case 'isInTheRange':
            return 'in';
        default:
            return 'eq';
    }
}

export function buildQuery(
    query: QueryBuilderCondition | QueryBuilderGroup,
    fields: Record<string, { type: string; value: string }>,
): string {
    function buildConditionTree(node: QueryBuilderCondition | QueryBuilderGroup): string {
        if ('field' in node) {
            const filterKey = fields[node.field].value;
            const [op, val] = Object.entries(node.condition)[0];
            const operator = deserializeOperator(op as SerializedOperator);
            const value = typeof val === 'number' || typeof val === 'boolean' ? val : `"${val}"`;

            if (operator === 'contains') {
                return `$contains($lowercase(${filterKey}), $lowercase(${value}))`;
            }

            if (operator === 'notContains') {
                return `$not($contains($lowercase(${filterKey}), $lowercase(${value})))`;
            }

            if (operator === 'match') {
                return `$match($lowercase(${filterKey}), $lowercase(${value}))`;
            }

            if (operator === 'in') {
                return `${value} in ${filterKey}`;
            }

            if (operator === 'notIn') {
                return `$not(${value} in ${filterKey})`;
            }

            if (operator === 'startsWith') {
                return `$match($lowercase(${filterKey}), /^${val}/)`;
            }

            if (operator === 'endsWith') {
                return `$match($lowercase(${filterKey}), /${val}$/)`;
            }

            return `${filterKey} ${operators[operator as Operator]} ${value}`;
        } else {
            // Logical group (AND/OR)
            const conditions = node.conditions.map(buildConditionTree);
            return `(${conditions.join(` ${node.operator.toLowerCase()} `)})`;
        }
    }

    const result = `$[${buildConditionTree(query)}]`;
    return result;
}

export type QueryModule = ReturnType<typeof initQueryModule>;
