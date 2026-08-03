export const USER_ROLES = {
  USER: "USER",
  ASTROLOGER: "ASTROLOGER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: {
    canInitiateCall: true,
    canInitiateChat: true,
    canEditBilling: true,
    canAccessAdminTerminal: false,
  },
  [USER_ROLES.ASTROLOGER]: {
    canInitiateCall: false, 
    canInitiateChat: true,
    canEditBilling: false,
    canAccessAdminTerminal: false,
  },
  [USER_ROLES.ADMIN]: {
    canInitiateCall: true,
    canInitiateChat: true,
    canEditBilling: true,
    canAccessAdminTerminal: true,
  }
};