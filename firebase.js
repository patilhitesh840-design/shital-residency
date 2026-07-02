// Firebase and Firestore Database Service Layer for GrandDome Society Management System

const firebase = window.firebase;
const MOCK_STORAGE_KEY_SESSION = 'granddome_session';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeGSRjG3N15LDSHVNzJTiZsfwp3AycRng",
  authDomain: "shital-residency.firebaseapp.com",
  projectId: "shital-residency",
  storageBucket: "shital-residency.firebasestorage.app",
  messagingSenderId: "1003744246810",
  appId: "1:1003744246810:web:788d30995ff8c3ec4f25a3",
  measurementId: "G-6TPGFMJWYX"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const db = firebase.firestore();
export const isDemoMode = false;

export const authService = {
    login: async (emailOrFlat, password) => {
        let email = emailOrFlat.trim();
        if (!email.includes('@')) {
            const snap = await db.collection('members').where('flatNo', '==', email).get();
            if (snap.empty) {
                throw new Error(`Plot ${email} is not registered.`);
            }
            email = snap.docs[0].data().email;
        }
        
        try {
            const userCred = await auth.signInWithEmailAndPassword(email, password);
            const fbUser = userCred.user;
            
            const adminSnap = await db.collection('admins').doc(fbUser.uid).get();
            if (adminSnap.exists) {
                const adminData = adminSnap.data();
                const session = { email: fbUser.email, role: 'admin', name: adminData.name, uid: fbUser.uid };
                localStorage.setItem(MOCK_STORAGE_KEY_SESSION, JSON.stringify(session));
                return session;
            }
            
            const memberSnap = await db.collection('members').doc(fbUser.uid).get();
            if (memberSnap.exists) {
                const memberData = memberSnap.data();
                const session = {
                    email: fbUser.email,
                    role: 'resident',
                    name: memberData.name,
                    flatNo: memberData.flatNo,
                    building: memberData.building || "",
                    phone: memberData.phone || "",
                    id: fbUser.uid
                };
                localStorage.setItem(MOCK_STORAGE_KEY_SESSION, JSON.stringify(session));
                return session;
            }
            throw new Error("No role assigned for this user.");
        } catch (err) {
            // Self-seeding Admin user on fresh database
            if (email === 'admin@society.com' && password === 'admin123' && err.code === 'auth/user-not-found') {
                const userCred = await auth.createUserWithEmailAndPassword(email, password);
                const uid = userCred.user.uid;
                const newAdmin = {
                    id: uid,
                    name: 'Society Admin',
                    email: email,
                    role: 'admin'
                };
                await db.collection('admins').doc(uid).set(newAdmin);
                
                const session = { email: email, role: 'admin', name: newAdmin.name, uid: uid };
                localStorage.setItem(MOCK_STORAGE_KEY_SESSION, JSON.stringify(session));
                return session;
            }
            throw err;
        }
    },
    logout: async () => {
        await auth.signOut();
        localStorage.removeItem(MOCK_STORAGE_KEY_SESSION);
        return true;
    },
    getCurrentUser: () => {
        const session = localStorage.getItem(MOCK_STORAGE_KEY_SESSION);
        return session ? JSON.parse(session) : null;
    },
    registerResident: async (residentData) => {
        const flat = residentData.flatNo.trim();
        const email = residentData.email.toLowerCase().trim();
        
        const flatSnap = await db.collection('members').where('flatNo', '==', flat).get();
        if (!flatSnap.empty) {
            throw new Error(`Plot ${flat} is already registered!`);
        }
        
        const emailSnap = await db.collection('members').where('email', '==', email).get();
        if (!emailSnap.empty) {
            throw new Error(`Email ${email} is already in use!`);
        }
        
        const userCred = await auth.createUserWithEmailAndPassword(email, residentData.password);
        const uid = userCred.user.uid;
        
        const newResident = {
            id: uid,
            name: residentData.name.trim(),
            email: email,
            phone: residentData.phone.trim(),
            flatNo: flat,
            building: "",
            status: residentData.status || "Owner",
            membersCount: Number(residentData.membersCount) || 3,
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        await db.collection('members').doc(uid).set(newResident);
        
        const session = {
            email: newResident.email,
            role: 'resident',
            name: newResident.name,
            flatNo: newResident.flatNo,
            building: newResident.building,
            phone: newResident.phone,
            id: uid
        };
        localStorage.setItem(MOCK_STORAGE_KEY_SESSION, JSON.stringify(session));
        return session;
    },
    registerAdmin: async (adminData) => {
        const email = adminData.email.toLowerCase().trim();
        const userCred = await auth.createUserWithEmailAndPassword(email, adminData.password);
        const uid = userCred.user.uid;
        
        const newAdmin = {
            id: uid,
            name: adminData.name.trim(),
            email: email,
            role: 'admin'
        };
        await db.collection('admins').doc(uid).set(newAdmin);
        
        const session = { email: newAdmin.email, role: 'admin', name: newAdmin.name, uid: uid };
        localStorage.setItem(MOCK_STORAGE_KEY_SESSION, JSON.stringify(session));
        return session;
    },
    resetPassword: async (email) => {
        await auth.sendPasswordResetEmail(email.trim());
        return true;
    }
};

export const dbService = {
    getMembers: async () => {
        const snap = await db.collection('members').get();
        const list = [];
        snap.forEach(doc => list.push(doc.data()));
        return list;
    },
    addMember: async (memberData) => {
        const flat = memberData.flatNo.trim();
        const email = memberData.email.toLowerCase().trim();
        
        const snap = await db.collection('members').where('flatNo', '==', flat).get();
        if (!snap.empty) {
            throw new Error(`Plot ${flat} is already occupied!`);
        }
        
        const secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
        try {
            const userCred = await secondaryApp.auth().createUserWithEmailAndPassword(email, "resident123");
            const uid = userCred.user.uid;
            await secondaryApp.auth().signOut();
            
            const newMember = {
                id: uid,
                joinDate: new Date().toISOString().split('T')[0],
                name: memberData.name.trim(),
                email: email,
                phone: memberData.phone.trim(),
                flatNo: flat,
                building: "",
                status: memberData.status || "Owner",
                membersCount: Number(memberData.membersCount) || 3
            };
            await db.collection('members').doc(uid).set(newMember);
            return newMember;
        } finally {
            await secondaryApp.delete();
        }
    },
    updateMember: async (id, updatedData) => {
        await db.collection('members').doc(id).update(updatedData);
        return true;
    },
    deleteMember: async (id) => {
        await db.collection('members').doc(id).delete();
        return true;
    },
    importMembers: async (membersList) => {
        let count = 0;
        for (let index = 0; index < membersList.length; index++) {
            const m = membersList[index];
            const flat = String(m.flatNo || m.Flat || '').trim();
            const name = String(m.name || m.Name || '').trim();
            const email = String(m.email || m.Email || '').trim() || `resident_${flat}@society.com`;
            const phone = String(m.phone || m.Phone || '').trim() || '9876543210';
            const status = String(m.status || m.Status || 'Owner').trim();
            const mcount = parseInt(m.membersCount || m.Members || '3', 10);
            
            if (name && flat) {
                const snap = await db.collection('members').where('flatNo', '==', flat).get();
                if (snap.empty) {
                    const secondaryApp = firebase.initializeApp(firebaseConfig, `SecondaryImport_${index}`);
                    try {
                        const userCred = await secondaryApp.auth().createUserWithEmailAndPassword(email, "resident123");
                        const uid = userCred.user.uid;
                        await secondaryApp.auth().signOut();
                        
                        const newM = {
                            id: uid,
                            name,
                            flatNo: flat,
                            building: "",
                            email,
                            phone,
                            status,
                            membersCount: mcount,
                            joinDate: new Date().toISOString().split('T')[0]
                        };
                        await db.collection('members').doc(uid).set(newM);
                        count++;
                    } catch (err) {
                        if (err.code === 'auth/email-already-in-use') {
                            const mockId = 'm_imp_' + Date.now() + '_' + index;
                            const newM = {
                                id: mockId,
                                name,
                                flatNo: flat,
                                building: "",
                                email,
                                phone,
                                status,
                                membersCount: mcount,
                                joinDate: new Date().toISOString().split('T')[0]
                            };
                            await db.collection('members').doc(mockId).set(newM);
                            count++;
                        }
                    } finally {
                        await secondaryApp.delete();
                    }
                }
            }
        }
        return count;
    },
    getBills: async (flatNo = null) => {
        let ref = db.collection('bills');
        if (flatNo) ref = ref.where('flatNo', '==', flatNo);
        const snap = await ref.get();
        const list = [];
        snap.forEach(doc => {
            const d = doc.data();
            d.id = doc.id;
            list.push(d);
        });
        return list;
    },
    addBill: async (billData) => {
        const total = Number(billData.electricity || 0) + 
                      Number(billData.garbage || 0) + 
                      Number(billData.maintenance || 0);
        const newBill = {
            flatNo: billData.flatNo,
            month: billData.month,
            electricity: Number(billData.electricity || 0),
            garbage: Number(billData.garbage || 0),
            maintenance: Number(billData.maintenance || 0),
            lateFee: 0,
            total: total,
            dueDate: billData.dueDate,
            status: 'Pending',
            paymentDate: null,
            paymentMethod: null
        };
        const docRef = await db.collection('bills').add(newBill);
        newBill.id = docRef.id;
        return newBill;
    },
    updateBill: async (id, updatedFields) => {
        const doc = await db.collection('bills').doc(id).get();
        if (doc.exists) {
            const current = doc.data();
            const merged = { ...current, ...updatedFields };
            merged.total = Number(merged.electricity || 0) + 
                           Number(merged.garbage || 0) + 
                           Number(merged.maintenance || 0) + 
                           Number(merged.lateFee || 0);
            await db.collection('bills').doc(id).set(merged);
            return true;
        }
        return false;
    },
    getComplaints: async (flatNo = null) => {
        let ref = db.collection('complaints');
        if (flatNo) ref = ref.where('flatNo', '==', flatNo);
        const snap = await ref.get();
        const list = [];
        snap.forEach(doc => {
            const d = doc.data();
            d.id = doc.id;
            list.push(d);
        });
        return list;
    },
    addComplaint: async (complaintData) => {
        const newComplaint = {
            flatNo: complaintData.flatNo,
            category: complaintData.category,
            title: complaintData.title,
            description: complaintData.description,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            reply: ''
        };
        const docRef = await db.collection('complaints').add(newComplaint);
        newComplaint.id = docRef.id;
        return newComplaint;
    },
    updateComplaint: async (id, updatedFields) => {
        await db.collection('complaints').doc(id).update(updatedFields);
        return true;
    },
    getDashboardStats: async () => {
        const membersList = [];
        const membersSnap = await db.collection('members').get();
        membersSnap.forEach(doc => membersList.push(doc.data()));
        
        const billsList = [];
        const billsSnap = await db.collection('bills').get();
        billsSnap.forEach(doc => billsList.push(doc.data()));
        
        const totalMembers = membersList.length;
        const totalFlats = 50;
        const occupiedFlats = new Set(membersList.map(m => m.flatNo)).size;
        
        const pendingBillsList = billsList.filter(b => b.status === 'Pending');
        const paidBillsList = billsList.filter(b => b.status === 'Paid');
        
        const pendingBillsCount = pendingBillsList.length;
        const paidBillsCount = paidBillsList.length;
        
        const totalPenalties = billsList.reduce((sum, b) => sum + (b.lateFee || 0), 0);
        const totalIncome = paidBillsList.reduce((sum, b) => sum + (b.total || 0), 0);
        const totalOutstanding = pendingBillsList.reduce((sum, b) => sum + (b.total || 0), 0);
        
        const monthlyHistory = {};
        billsList.forEach(b => {
            if (!monthlyHistory[b.month]) {
                monthlyHistory[b.month] = { revenue: 0, pending: 0 };
            }
            if (b.status === 'Paid') {
                monthlyHistory[b.month].revenue += b.total;
            } else {
                monthlyHistory[b.month].pending += b.total;
            }
        });
        
        return {
            totalMembers,
            totalFlats,
            occupiedFlats,
            pendingBillsCount,
            paidBillsCount,
            totalIncome,
            totalOutstanding,
            totalPenalties,
            monthlyHistory
        };
    }
};
