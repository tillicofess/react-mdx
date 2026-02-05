import { jwtDecode } from 'jwt-decode';

export interface KeycloakUser {
    sub: string;
    preferred_username?: string;
    email?: string;
    name?: string;
    realm_access?: {
        roles: string[];
    };
}

export function decodeUser(token?: string): KeycloakUser | null {
    if (!token) return null;

    try {
        return jwtDecode<KeycloakUser>(token);
    } catch {
        return null;
    }
}
