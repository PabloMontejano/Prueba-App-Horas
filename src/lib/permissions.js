// ============================================================
// AZ-CRM: Permissions Library
// 4-tier role system: admin > manager > user > viewer
// ============================================================

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  VIEWER: 'viewer',
})

export const ROLE_LABELS = Object.freeze({
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
  viewer: 'Viewer',
})

export const getRoleLabel = (role) => ROLE_LABELS[role] || role

const ROLE_HIERARCHY = [
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.USER,
  ROLES.VIEWER,
]

const getRoleRank = (role) => {
  const index = ROLE_HIERARCHY.indexOf(role)
  return index === -1 ? Infinity : index
}

const hasMinRole = (role, minRole) => getRoleRank(role) <= getRoleRank(minRole)

// --- Permission checks ---

/** Can create/edit entities? Requires user role or above. */
export const canEdit = (role) => hasMinRole(role, ROLES.USER)

/** Can delete entities? Requires manager role or above. */
export const canDelete = (role) => hasMinRole(role, ROLES.MANAGER)

/** Can manage users, groups, invitations? Requires admin. */
export const canManageUsers = (role) => hasMinRole(role, ROLES.ADMIN)

/** Can view Settings page? Requires admin. */
export const canViewSettings = (role) => hasMinRole(role, ROLES.ADMIN)

/** Can view audit logs? Requires manager or above. */
export const canViewAuditLog = (role) => hasMinRole(role, ROLES.MANAGER)

/** Can manage groups? Requires admin. */
export const canManageGroups = (role) => hasMinRole(role, ROLES.ADMIN)

/** Can manage invitations? Requires manager or above. */
export const canManageInvitations = (role) => hasMinRole(role, ROLES.MANAGER)

/** Is admin? */
export const isAdmin = (role) => role === ROLES.ADMIN

// --- Composite permission object ---

export const buildPermissions = (role) => ({
  role,
  edit: canEdit(role),
  delete: canDelete(role),
  manageUsers: canManageUsers(role),
  manageGroups: canManageGroups(role),
  manageInvitations: canManageInvitations(role),
  viewAuditLog: canViewAuditLog(role),
  viewSettings: canViewSettings(role),
  isAdmin: isAdmin(role),
})
