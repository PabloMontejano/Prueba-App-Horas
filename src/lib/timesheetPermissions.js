// ============================================================
// AZ-CRM: Timesheet Permissions Library
// 3-tier role system: admin > owner > user
// ============================================================

export const TS_ROLES = Object.freeze({
  ADMIN: 'admin',
  OWNER: 'owner',
  USER: 'user',
})

export const TS_ROLE_LABELS = Object.freeze({
  admin: 'Admin',
  owner: 'Owner',
  user: 'User',
})

export const getTsRoleLabel = (role) => TS_ROLE_LABELS[role] || role

const TS_ROLE_HIERARCHY = [TS_ROLES.ADMIN, TS_ROLES.OWNER, TS_ROLES.USER]

const getTsRoleRank = (role) => {
  const index = TS_ROLE_HIERARCHY.indexOf(role)
  return index === -1 ? Infinity : index
}

const hasMinTsRole = (role, minRole) => getTsRoleRank(role) <= getTsRoleRank(minRole)

// --- Permission checks ---

/** Can view all employees' timesheets? Requires owner or above. */
export const canViewAllTimesheets = (role) => hasMinTsRole(role, TS_ROLES.OWNER)

/** Can manage internal activities? Requires admin. */
export const canManageInternalActivities = (role) => role === TS_ROLES.ADMIN

/** Can edit/delete any employee's timesheet? Requires admin. */
export const canEditAnyTimesheet = (role) => role === TS_ROLES.ADMIN

/** Can delete timesheet weeks/entries? Requires admin. */
export const canDeleteTimesheets = (role) => role === TS_ROLES.ADMIN

/** Is timesheet admin? */
export const isTsAdmin = (role) => role === TS_ROLES.ADMIN

// --- Composite permission object ---

export const buildTsPermissions = (role) => ({
  tsRole: role,
  viewAll: canViewAllTimesheets(role),
  manageActivities: canManageInternalActivities(role),
  editAny: canEditAnyTimesheet(role),
  deleteAny: canDeleteTimesheets(role),
  isAdmin: isTsAdmin(role),
})
