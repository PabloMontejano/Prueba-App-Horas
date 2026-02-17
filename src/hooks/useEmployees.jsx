export const useEmployees = () => ({
  data: [
    { id: 'demo-user-1', name: 'Pablo Montejano', initials: 'PM', email: 'pablo.montejano@azcapital.com', is_active: true },
    { id: 'demo-user-2', name: 'Ana García', initials: 'AG', email: 'ana.garcia@azcapital.com', is_active: true },
    { id: 'demo-user-3', name: 'Carlos López', initials: 'CL', email: 'carlos.lopez@azcapital.com', is_active: true },
  ],
  isLoading: false,
  error: null,
})
