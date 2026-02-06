import { useMemo, type ReactNode } from 'react';
import { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';
import { AbilityContext } from '@/lib/casl'; // 请根据你的实际路径修改
import { useAuth } from '@/providers/auth/auth';
import { type KeycloakUser } from '@/providers/auth/user';

function defineAbilityFor(user: KeycloakUser | null): MongoAbility {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    if (user?.roles?.includes('admins')) {
        can('manage', 'all');
    } else {
        can('read', 'all');
    }
    cannot('delete', 'Post', { published: true });
    return build();
}


export const AbilityProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const ability = useMemo(() => {
        return defineAbilityFor(user);
    }, [user]);
    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    );
};