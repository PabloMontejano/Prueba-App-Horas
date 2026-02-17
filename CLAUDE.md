# AZ CRM — Claude Instructions

## What This Project Is

AZ CRM is the investment banking pipeline management platform for AZ Capital SA. It tracks the deal lifecycle: Companies → Contacts → Ideas → Pitches → Deals. Each stage has its own status-based workflow with Kanban and table views.

**Repo:** https://github.com/victorm-az/az-crm

## Tech Stack

- **Frontend:** React 19 + Vite 7 + Tailwind CSS 3
- **Backend:** Supabase (Postgres + Auth + RLS) + Vercel Serverless Functions
- **State:** TanStack React Query v5
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Charts:** Recharts
- **Exports:** ExcelJS
- **Dates:** date-fns
- **Email:** Resend (via `/api/send-invite`)

## Project Structure

```
AZ-CRM/
├── api/                          # Vercel serverless functions (Phase 3)
├── supabase/migrations/          # Database schema (SQL)
├── src/
│   ├── main.jsx                  # Entry point
│   ├── App.jsx                   # Router + layout + auth
│   ├── index.css                 # Global styles + Tailwind
│   ├── lib/                      # Core utilities
│   │   ├── supabase.js           # Supabase client
│   │   ├── queryClient.js        # React Query config
│   │   ├── permissions.js        # 4-tier role system (admin>manager>user>viewer)
│   │   ├── auditLog.js           # Action logging
│   │   ├── validation.js         # Form validation helpers
│   │   └── constants.js          # Deal types, sectors, statuses, etc.
│   ├── hooks/                    # All data fetching & mutations
│   │   ├── useAuth.jsx           # Auth state, employee, session
│   │   ├── usePermissions.jsx    # Role-based permission flags
│   │   ├── useCompanies.jsx      # CRUD companies + FK joins
│   │   ├── useContacts.jsx       # CRUD contacts
│   │   ├── useIdeas.jsx          # CRUD ideas + status management
│   │   ├── useEmployees.jsx      # Employee list for dropdowns
│   │   ├── useGroups.jsx         # Group CRUD
│   │   ├── useActivities.jsx     # Polymorphic activities on any entity
│   │   └── useDashboard.jsx      # Stats aggregation
│   ├── pages/
│   │   ├── Dashboard.jsx         # Stats cards + pipeline funnel
│   │   ├── Companies.jsx         # Company list with search/filters
│   │   ├── Contacts.jsx          # Contact list with search
│   │   ├── Pipeline.jsx          # Tabbed: Ideas | Pitches | Deals
│   │   └── Login.jsx
│   └── components/
│       ├── ui/                   # Reusable UI (Modal, Badge, Tabs, Toast, etc.)
│       ├── layout/               # Header, Sidebar, Breadcrumbs
│       ├── companies/            # AddCompanyModal, CompanyDetailModal
│       ├── contacts/             # AddContactModal, ContactDetailModal
│       └── pipeline/             # Board, Cards, Table, Filters, AddIdeaModal, IdeaDetailModal
├── vercel.json
├── vite.config.js
└── package.json
```

## Key Patterns

### Roles & Permissions
- 4-tier: `admin` > `manager` > `user` > `viewer`
- Default role for new employees: `user`
- Permissions in `src/lib/permissions.js`: `canEdit()`, `canDelete()`, `canManageUsers()`, etc.
- No process/workspace concept — all data is global, filtered by role

### Data Flow
- All data through React Query hooks in `src/hooks/`
- Each hook exports: query function + mutations hook
- Mutations use `mutateAsync` and invalidate related query keys on success
- Audit logging via `logAction()` on all mutations

### Pipeline Architecture
- Status-based Kanban: columns = status values (not a separate stages table)
- Ideas → Pitches → Deals promotion (Phase 2)
- Responsibles A/B/C = direct FK columns on each entity
- Economics flow down: Pitch fees copy to Deal on promotion

### Polymorphic Patterns
- Activities: `entity_type` + `entity_id` on company/contact/idea/pitch/deal
- Files: same polymorphic pattern
- Stakeholders: `entity_type` (pitch/deal) + `entity_id`

### Database
- All tables prefixed with `azr_`
- 15 tables with full RLS policies
- Triggers: updated_at, auto-sector, auto-weighted-fee, last-contact-date
- Key constraint: Ideas/Pitches/Deals each have their own status CHECK constraint

## Environment Variables

### Frontend (VITE_ prefix)
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Server-side (api/ functions only)
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
```

## Phase Implementation Status

- **Phase 1 (MVP):** Foundation + Companies + Contacts + Ideas Pipeline + Dashboard ✅
- **Phase 2:** Pitches, Deals, Promotion, Economics, Competitors, Files, Export
- **Phase 3:** User Management, Audit Viewer, Import, API Functions

## Common Tasks

### Adding a new hook
1. Create `src/hooks/useYourHook.jsx`
2. Export query function and mutations hook
3. Use `useQuery`/`useMutation` from `@tanstack/react-query`
4. Invalidate related query keys in mutation `onSuccess`
5. Log actions via `logAction()` from `src/lib/auditLog.js`

### Adding a new page
1. Create `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`
3. Add nav link in `src/components/layout/Sidebar.jsx`
