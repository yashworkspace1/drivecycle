import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

const apiClient = {
    // Dashboard
    getDashboard: () => api.get('/dashboard').then(res => res.data),

    // ServicePulse / Service Jobs
    getServiceJobs: () => api.get('/service-jobs').then(res => res.data),
    addServiceJob: (data) => api.post('/service-jobs', data).then(res => res.data),

    // RecallReach
    scanAllRecalls: () => api.post('/recalls/scan-all').then(res => res.data),
    getActiveRecalls: () => api.get('/recalls/active').then(res => res.data),
    notifyRecall: (vehicleId) => api.post(`/recalls/notify/${vehicleId}`).then(res => res.data),
    checkVehicleRecall: (vehicleId) => api.get(`/recalls/check/${vehicleId}`).then(res => res.data),

    // TradeIQ
    getHotLeads: () => api.get('/tradeiq/hot-leads').then(res => res.data),
    recalculateAllScores: () => api.post('/tradeiq/recalculate-all').then(res => res.data),
    sendValuation: (customerId) => api.post(`/tradeiq/send-valuation/${customerId}`).then(res => res.data),

    // General entities lookup (for dropdowns etc)
    getCustomers: () => api.get('/customers').then(res => res.data),
    getVehicles: () => api.get('/vehicles').then(res => res.data),

    // Outreach (Preview & Send)
    generateMessage: (data) => api.post('/outreach/generate', data).then(res => res.data),
    sendMessage: (data) => api.post('/outreach/send', data).then(res => res.data),

    // Settings
    updateDealership: (data) => api.put('/settings/dealership', data).then(res => res.data).catch(() => ({})),
    addAdvisor: (data) => api.post('/settings/advisors', data).then(res => res.data).catch(() => ({})),
    removeAdvisor: (id) => api.delete(`/settings/advisors/${id}`).then(res => res.data).catch(() => ({})),
    exportOutreach: () => api.get('/outreach/export', { responseType: 'blob' }).catch(() => ({})),
    resetDemoData: () => api.post('/seed/reset').then(res => res.data).catch(() => ({})),

    // Admin
    adminGetOverview: () => api.get('/admin/overview').then(res => res.data),
    adminGetDealers: () => api.get('/admin/dealers').then(res => res.data),
    adminGetRecalls: () => api.get('/admin/recalls').then(res => res.data),
    adminGetMessages: (params) => api.get('/admin/messages', { params }).then(res => res.data),
    adminGetSystemHealth: () => api.get('/admin/system-health').then(res => res.data),
};

export default apiClient;
