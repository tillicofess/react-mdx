import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { type MongoAbility, createMongoAbility } from '@casl/ability';

export const AbilityContext = createContext<MongoAbility>(createMongoAbility());
export const Can = createContextualCan(AbilityContext.Consumer);
