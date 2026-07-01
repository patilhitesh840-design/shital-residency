// Firebase and Mock Database Service Layer for GrandDome Society Management System

// Firebase configuration placeholders
const firebaseConfig = {
    apiKey: "PLACEHOLDER_FIREBASE_API_KEY",
    authDomain: "PLACEHOLDER_SOCIETY-SYSTEM.firebaseapp.com",
    projectId: "PLACEHOLDER_SOCIETY-SYSTEM",
    storageBucket: "PLACEHOLDER_SOCIETY-SYSTEM.appspot.com",
    messagingSenderId: "PLACEHOLDER_MESSAGING_SENDER_ID",
    appId: "PLACEHOLDER_APP_ID"
};

// Check if credentials are real or placeholder
const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey && 
           !firebaseConfig.apiKey.startsWith("PLACEHOLDER") && 
           firebaseConfig.apiKey !== "";
};

// ==========================================
// MOCK DATABASE & AUTHENTICATION (LocalStorage fallback)
// ==========================================

const MOCK_STORAGE_KEY_MEMBERS = 'granddome_members';
const MOCK_STORAGE_KEY_BILLS = 'granddome_bills';
const MOCK_STORAGE_KEY_COMPLAINTS = 'granddome_complaints';
const MOCK_STORAGE_KEY_SESSION = 'granddome_session';

const INITIAL_MEMBERS = [
    { id: 'm1', name: 'Rajesh Sharma', email: 'rajesh@society.com', phone: '9876543210', flatNo: '101', building: 'A', status: 'Owner', membersCount: 4, joinDate: '2025-01-15' },
    { id: 'm2', name: 'Priya Patel', email: 'priya@society.com', phone: '9876543211', flatNo: '102', building: 'A', status: 'Tenant', membersCount: 2, joinDate: '2025-03-10' },
    { id: 'm3', name: 'Amit Verma', email: 'resident@society.com', phone: '9876543212', flatNo: '201', building: 'B', status: 'Owner', membersCount: 3, joinDate: '2024-11-05' },
    { id: 'm4', name: 'Vikram Singh', email: 'vikram@society.com', phone: '9876543213', flatNo: '202', building: 'B', status: 'Owner', membersCount: 5, joinDate: '2025-02-20' },
    { id: 'm5', name: 'Sneha Rao', email: 'sneha@society.com', phone: '9876543214', flatNo: '301', building: 'C', status: 'Tenant', membersCount: 3, joinDate: '2025-05-01' }
];

const INITIAL_BILLS = [
    { id: 'b1', flatNo: '101', month: 'June 2026', electricity: 2450, garbage: 150, maintenance: 2500, lateFee: 0, total: 5100, dueDate: '2026-06-15', status: 'Paid', paymentDate: '2026-06-12', paymentMethod: 'UPI' },
    { id: 'b2', flatNo: '102', month: 'June 2026', electricity: 1850, garbage: 150, maintenance: 2500, lateFee: 0, total: 4500, dueDate: '2026-06-15', status: 'Paid', paymentDate: '2026-06-14', paymentMethod: 'Card' },
    { id: 'b3', flatNo: '201', month: 'June 2026', electricity: 3100, garbage: 150, maintenance: 2500, lateFee: 100, total: 5850, dueDate: '2026-06-15', status: 'Pending', paymentDate: null, paymentMethod: null },
    { id: 'b4', flatNo: '202', month: 'June 2026', electricity: 2900, garbage: 150, maintenance: 2500, lateFee: 0, total: 5550, dueDate: '2026-06-15', status: 'Paid', paymentDate: '2026-06-10', paymentMethod: 'NetBanking' },
    { id: 'b5', flatNo: '301', month: 'June 2026', electricity: 1400, garbage: 150, maintenance: 2500, lateFee: 50, total: 4100, dueDate: '2026-06-15', status: 'Pending', paymentDate: null, paymentMethod: null },
    
    // Older records for analytics
    { id: 'b6', flatNo: '101', month: 'May 2026', electricity: 2200, garbage: 150, maintenance: 2500, lateFee: 0, total: 4850, dueDate: '2026-05-15', status: 'Paid', paymentDate: '2026-05-11', paymentMethod: 'UPI' },
    { id: 'b7', flatNo: '201', month: 'May 2026', electricity: 2800, garbage: 150, maintenance: 2500, lateFee: 0, total: 5450, dueDate: '2026-05-15', status: 'Paid', paymentDate: '2026-05-14', paymentMethod: 'UPI' },
    { id: 'b8', flatNo: '102', month: 'May 2026', electricity: 1900, garbage: 150, maintenance: 2500, lateFee: 0, total: 4550, dueDate: '2026-05-15', status: 'Paid', paymentDate: '2026-05-15', paymentMethod: 'Card' }
];

const INITIAL_COMPLAINTS = [
    { id: 'c1', flatNo: '101', category: 'Plumbing', title: 'Water leakage in bathroom pipe', description: 'There is a constant water leakage in the master bedroom bathroom tap. Please repair it.', date: '2026-06-20', status: 'Resolved', reply: 'Plumber repaired the washer. Fixed.' },
    { id: 'c2', flatNo: '201', category: 'Electricity', title: 'Corridor lights flickering', description: 'The light outside Flat 201 B-wing is flickering constantly since last night.', date: '2026-06-28', status: 'In Progress', reply: 'Electrician has been notified and will replace the bulb by tomorrow.' },
    { id: 'c3', flatNo: '301', category: 'Garbage', title: 'Garbage not collected today', description: 'The garbage collection team did not visit the third floor today.', date: '2026-06-30', status: 'Pending', reply: '' }
];

// Helper to seed data if not present
const seedMockDatabase = () => {
    if (!localStorage.getItem(MOCK_STORAGE_KEY_MEMBERS)) {
        localStorage.setItem(MOCK_STORAGE_KEY_MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    }
    if (!localStorage.getItem(MOCK_STORAGE_KEY_BILLS)) {
        localStorage.setItem(MOCK_STORAGE_KEY_BILLS, JSON.stringify(INITIAL_BILLS));
    }
    if (!localStorage.getItem(MOCK_STORAGE_KEY_COMPLAINTS)) {
        localStorage.setItem(MOCK_STORAGE_KEY_COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    }
};
seedMockDatabase();

// Load Mock helper functions
const getStoredItems = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setStoredItems = (key, items) => localStorage.setItem(key, JSON.stringify(items));

// ==========================================
// EXPORTED INTEGRATED API SERVICES
// ==========================================

export const isDemoMode = !isFirebaseConfigured();

export const authService = {
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const cleanedEmail = email.toLowerCase().trim();
                
                // Admin Login
                if (cleanedEmail === 'admin@society.com' && password === 'admin123') {
                    const session = { email: cleanedEmail, role: 'admin', name: 'Society Admin' };
                    localStorage.setItem(MOCK_STORAGE_KEY_SESSION, JSON.stringify(session));
                    resolve(session);
                    return;
                }

                // Resident Login (either via email or flat number)
                const members = getStoredItems(MOCK_STORAGE_KEY_MEMBERS);
                const resident = members.find(m => 
                    m.email.toLowerCase() === cleanedEmail || 
                    m.flatNo === email.trim()
                );

                if (resident && password === 'resident123') {
                    const session = { 
                        email: resident.email, 
                        role: 'resident', 
                        name: resident.name,
                        flatNo: resident.flatNo,
                        building: resident.building,
                        phone: resident.phone,
                        id: resident.id
                    };
                    localStorage.setItem(MOCK_STORAGE_KEY_SESSION, JSON.stringify(session));
                    resolve(session);
                } else {
                    reject(new Error("Invalid credentials! Hint: Use admin@society.com / admin123 or resident@society.com / resident123"));
                }
            }, 600);
        });
    },

    logout: async () => {
        return new Promise((resolve) => {
            localStorage.removeItem(MOCK_STORAGE_KEY_SESSION);
            resolve(true);
        });
    },

    getCurrentUser: () => {
        const session = localStorage.getItem(MOCK_STORAGE_KEY_SESSION);
        return session ? JSON.parse(session) : null;
    }
};

export const dbService = {
    // -----------------
    // MEMBERS SERVICE
    // -----------------
    getMembers: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(getStoredItems(MOCK_STORAGE_KEY_MEMBERS)), 300);
        });
    },
    
    addMember: async (memberData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const members = getStoredItems(MOCK_STORAGE_KEY_MEMBERS);
                // Validation for unique flatNo
                if (members.some(m => m.flatNo === memberData.flatNo && m.building === memberData.building)) {
                    reject(new Error(`Flat ${memberData.building}-${memberData.flatNo} is already occupied!`));
                    return;
                }
                const newMember = {
                    id: 'm_' + Date.now(),
                    joinDate: new Date().toISOString().split('T')[0],
                    ...memberData
                };
                members.push(newMember);
                setStoredItems(MOCK_STORAGE_KEY_MEMBERS, members);
                resolve(newMember);
            }, 400);
        });
    },

    updateMember: async (id, updatedData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let members = getStoredItems(MOCK_STORAGE_KEY_MEMBERS);
                members = members.map(m => m.id === id ? { ...m, ...updatedData } : m);
                setStoredItems(MOCK_STORAGE_KEY_MEMBERS, members);
                resolve(true);
            }, 400);
        });
    },

    deleteMember: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let members = getStoredItems(MOCK_STORAGE_KEY_MEMBERS);
                members = members.filter(m => m.id !== id);
                setStoredItems(MOCK_STORAGE_KEY_MEMBERS, members);
                resolve(true);
            }, 400);
        });
    },

    importMembers: async (membersList) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const currentMembers = getStoredItems(MOCK_STORAGE_KEY_MEMBERS);
                const imported = [];
                
                membersList.forEach((m, index) => {
                    const flat = String(m.flatNo || m.Flat || '').trim();
                    const bld = String(m.building || m.Building || 'A').trim();
                    const name = String(m.name || m.Name || '').trim();
                    const email = String(m.email || m.Email || '').trim() || `resident_${flat}@society.com`;
                    const phone = String(m.phone || m.Phone || '').trim() || '9876543210';
                    const status = String(m.status || m.Status || 'Owner').trim();
                    const count = parseInt(m.membersCount || m.Members || '3', 10);
                    
                    if (name && flat) {
                        const exists = currentMembers.some(cm => cm.flatNo === flat && cm.building === bld);
                        if (!exists) {
                            const newM = {
                                id: 'm_import_' + Date.now() + '_' + index,
                                name,
                                flatNo: flat,
                                building: bld,
                                email,
                                phone,
                                status,
                                membersCount: count,
                                joinDate: new Date().toISOString().split('T')[0]
                            };
                            currentMembers.push(newM);
                            imported.push(newM);
                        }
                    }
                });

                setStoredItems(MOCK_STORAGE_KEY_MEMBERS, currentMembers);
                resolve(imported.length);
            }, 500);
        });
    },

    // -----------------
    // BILLS SERVICE
    // -----------------
    getBills: async (flatNo = null) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const bills = getStoredItems(MOCK_STORAGE_KEY_BILLS);
                if (flatNo) {
                    resolve(bills.filter(b => b.flatNo === flatNo));
                } else {
                    resolve(bills);
                }
            }, 300);
        });
    },

    addBill: async (billData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const bills = getStoredItems(MOCK_STORAGE_KEY_BILLS);
                const newBill = {
                    id: 'b_' + Date.now(),
                    lateFee: 0,
                    status: 'Pending',
                    paymentDate: null,
                    paymentMethod: null,
                    ...billData
                };
                newBill.total = Number(newBill.electricity || 0) + 
                                 Number(newBill.garbage || 0) + 
                                 Number(newBill.maintenance || 0) + 
                                 Number(newBill.lateFee || 0);
                bills.unshift(newBill);
                setStoredItems(MOCK_STORAGE_KEY_BILLS, bills);
                resolve(newBill);
            }, 400);
        });
    },

    updateBill: async (id, updatedFields) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let bills = getStoredItems(MOCK_STORAGE_KEY_BILLS);
                bills = bills.map(b => {
                    if (b.id === id) {
                        const merged = { ...b, ...updatedFields };
                        merged.total = Number(merged.electricity || 0) + 
                                       Number(merged.garbage || 0) + 
                                       Number(merged.maintenance || 0) + 
                                       Number(merged.lateFee || 0);
                        return merged;
                    }
                    return b;
                });
                setStoredItems(MOCK_STORAGE_KEY_BILLS, bills);
                resolve(true);
            }, 400);
        });
    },

    // -----------------
    // COMPLAINTS SERVICE
    // -----------------
    getComplaints: async (flatNo = null) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const complaints = getStoredItems(MOCK_STORAGE_KEY_COMPLAINTS);
                if (flatNo) {
                    resolve(complaints.filter(c => c.flatNo === flatNo));
                } else {
                    resolve(complaints);
                }
            }, 300);
        });
    },

    addComplaint: async (complaintData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const complaints = getStoredItems(MOCK_STORAGE_KEY_COMPLAINTS);
                const newComplaint = {
                    id: 'c_' + Date.now(),
                    date: new Date().toISOString().split('T')[0],
                    status: 'Pending',
                    reply: '',
                    ...complaintData
                };
                complaints.unshift(newComplaint);
                setStoredItems(MOCK_STORAGE_KEY_COMPLAINTS, complaints);
                resolve(newComplaint);
            }, 400);
        });
    },

    updateComplaint: async (id, updatedFields) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let complaints = getStoredItems(MOCK_STORAGE_KEY_COMPLAINTS);
                complaints = complaints.map(c => c.id === id ? { ...c, ...updatedFields } : c);
                setStoredItems(MOCK_STORAGE_KEY_COMPLAINTS, complaints);
                resolve(true);
            }, 300);
        });
    },

    // -----------------
    // STATS / ANALYTICS
    // -----------------
    getDashboardStats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const members = getStoredItems(MOCK_STORAGE_KEY_MEMBERS);
                const bills = getStoredItems(MOCK_STORAGE_KEY_BILLS);
                
                const totalMembers = members.length;
                const totalFlats = 50; // Total flats capacity
                const occupiedFlats = new Set(members.map(m => `${m.building}-${m.flatNo}`)).size;
                
                const pendingBillsList = bills.filter(b => b.status === 'Pending');
                const paidBillsList = bills.filter(b => b.status === 'Paid');
                
                const pendingBillsCount = pendingBillsList.length;
                const paidBillsCount = paidBillsList.length;
                
                // Calculate monthly income for current/recent billing cycles
                const totalPenalties = bills.reduce((sum, b) => sum + (b.lateFee || 0), 0);
                const totalIncome = paidBillsList.reduce((sum, b) => sum + (b.total || 0), 0);
                const totalOutstanding = pendingBillsList.reduce((sum, b) => sum + (b.total || 0), 0);

                // Group bills by month for charts (last 6 months)
                const monthlyHistory = {};
                bills.forEach(b => {
                    if (!monthlyHistory[b.month]) {
                        monthlyHistory[b.month] = { revenue: 0, pending: 0 };
                    }
                    if (b.status === 'Paid') {
                        monthlyHistory[b.month].revenue += b.total;
                    } else {
                        monthlyHistory[b.month].pending += b.total;
                    }
                });

                resolve({
                    totalMembers,
                    totalFlats,
                    occupiedFlats,
                    pendingBillsCount,
                    paidBillsCount,
                    totalIncome,
                    totalOutstanding,
                    totalPenalties,
                    monthlyHistory
                });
            }, 500);
        });
    }
};
