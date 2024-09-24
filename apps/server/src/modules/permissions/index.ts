// import { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';
// import type { DBUser } from '@/models/types.js';

// const Actions = 'create' | 'read' | 'update' | 'delete';
// const Subjects = 'User';

// const p = new createMongoAbility<[Actions, Subjects]>();

// type CRUD = 'create' | 'read' | 'update' | 'delete';
// type Actions = 'create' | 'read' | 'update' | 'delete';
// type Subjects = DomainUser | 'DomainUser';

// const ability = createMongoAbility<[Actions, Subjects]>();

// type AppAbility = MongoAbility<[CRUD, DomainUser | 'DomainUser']>;
// const AppAbility = MongoAbility<[CRUD, DomainUser | 'DomainUser']>;

// const abilityBuilder = new AbilityBuilder<AppAbility>(createMongoAbility);

// abilityBuilder.can('read', 'DomainUser', { _id: 'hello' });

// interface User extends DBUser {
//   kind: 'User';
// }

// type AppAbility = MongoAbility<[CRUD, User | 'User']>;

// const abilityBuilder = new AbilityBuilder<AppAbility>(createMongoAbility);

// const getUserAbilities = (user: DBUser) => {
//   abilityBuilder.can('read', 'User', { id: user.id });
// };
