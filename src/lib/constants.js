// ============================================================
// AZ-CRM: Constants
// All dropdown options, status values, and enums
// ============================================================

// --- Company ---

export const COMPANY_TYPES = [
  'Corporate',
  'Financial Sponsor',
  'Family Office',
  'Institutional Investor',
  'Other',
]

export const OWNERSHIP_TYPES = [
  'Institutional',
  'Large Caps',
  'Family-owned',
]

export const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Energy',
  'Real Estate',
  'Consumer & Retail',
  'Industrials',
  'Infrastructure',
  'Media & Telecom',
  'Education',
  'Agriculture & Food',
  'Transportation & Logistics',
  'Other',
]

export const COMPANY_CATEGORIES = [
  'Client',
  'Target',
  'Both',
]

// --- Deal Types ---

export const DEAL_TYPES = [
  'M&A Sell-Side',
  'M&A Buy-Side',
  'Debt Advisory',
  'ECM',
  'Restructuring',
  'Fairness Opinion',
  'Strategic Advisory',
  'Other',
]

// --- Groups (Departments) ---

export const DEPARTMENT_GROUPS = [
  'M&A',
  'Debt',
  'ECM',
  'Advisory',
  'Restructuring',
]

// --- Pipeline Statuses ---

export const IDEA_STATUSES = [
  'Active',
  'Pursuing',
  'On Hold',
  'Converted to Pitch',
  'Not Pursued',
  'Closed',
]

export const PITCH_STATUSES = [
  'Active',
  'Won',
  'Lost',
  'On Hold',
  'Converted to Deal',
  'Closed',
]

export const DEAL_STATUSES = [
  'Active',
  'On Hold',
  'Won',
  'Lost',
  'Closed',
]

export const MANDATE_STATUSES = [
  'Not Mandated',
  'Pending Approval',
  'Approved',
  'Rejected',
  'In Execution',
  'Lost',
  'Signed',
  'Closed',
]

// --- Activity Types ---

export const ACTIVITY_TYPES = [
  'Meeting',
  'Call',
  'Email',
  'Note',
  'Presentation',
  'Document',
  'Other',
]

// --- Status color mappings ---

export const IDEA_STATUS_COLORS = {
  'Active': 'success',
  'Pursuing': 'info',
  'On Hold': 'warning',
  'Converted to Pitch': 'info',
  'Not Pursued': 'danger',
  'Closed': 'default',
}

export const PITCH_STATUS_COLORS = {
  'Active': 'success',
  'Won': 'success',
  'Lost': 'danger',
  'On Hold': 'warning',
  'Converted to Deal': 'info',
  'Closed': 'default',
}

export const DEAL_STATUS_COLORS = {
  'Active': 'success',
  'On Hold': 'warning',
  'Won': 'success',
  'Lost': 'danger',
  'Closed': 'default',
}

export const MANDATE_STATUS_COLORS = {
  'Not Mandated': 'default',
  'Pending Approval': 'warning',
  'Approved': 'success',
  'Rejected': 'danger',
  'In Execution': 'info',
  'Lost': 'danger',
  'Signed': 'success',
  'Closed': 'default',
}

// --- Contact Types ---

export const CONTACT_ROLES = [
  'CEO',
  'CFO',
  'COO',
  'CTO',
  'Chairman',
  'Board Member',
  'Managing Director',
  'Director',
  'VP',
  'Manager',
  'Analyst',
  'Assistant',
  'Other',
]
