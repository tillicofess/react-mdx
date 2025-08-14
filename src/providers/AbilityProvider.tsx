import { useMemo, type ReactNode } from 'react';
import { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';
import { useAuth } from '@/providers/AuthProvider';
import { type CustomUser } from '@/types/auth';

// 1. 定义创建 Ability 实例的函数 (从你的代码中提取)
// 通常这个函数会放在一个单独的工具文件中，例如 src/lib/ability.ts
function defineAbilityFor(user: CustomUser | null): MongoAbility { // user 可以是 null
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user?.groups?.includes('admins')) {
        can('manage', 'all'); // read-write access to everything
    } else {
        can('read', 'all'); // read-only access to everything
    }

    cannot('delete', 'Post', { published: true });

    return build();
}

// 2. 引入 AbilityContext (从你的构建 Context 的文件中引入)
import { AbilityContext } from '@/lib/casl'; // 请根据你的实际路径修改

// 3. Ability Provider 组件
export const AbilityProvider = ({ children }: { children: ReactNode }) => {
    const { userInfo } = useAuth(); // 获取 AuthProvider 提供的用户信息

    // 使用 useMemo 来缓存 ability 实例
    // 只有当 userInfo 变化时才重新创建 ability 实例
    const ability = useMemo(() => {
        return defineAbilityFor(userInfo);
    }, [userInfo]); // 依赖 userInfo

    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    );
};