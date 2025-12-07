export const UserRole = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
} as const;

// Define a type alias for the union of all possible string values
export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const AuthPermission = {
    ADMIN: 'admin',
    SELF: 'self',
} as const;

// Define a type alias for the union of all possible string values
export type AuthPermissionType = typeof AuthPermission[keyof typeof AuthPermission];

