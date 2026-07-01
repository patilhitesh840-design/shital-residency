// Login View Module with 3D Glassmorphism Cards
import { authService } from '../firebase.js';
import { Router } from '../router.js';
import { showToast } from '../app.js';

export function renderLogin(container) {
    container.innerHTML = `
        <div class="flex-grow flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 relative">
            <!-- Floating Theme Switcher on Login Page -->
            <button id="login-theme-btn" class="absolute top-6 right-6 w-10 h-10 rounded-xl glass-panel hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center border border-glass-border-light dark:border-glass-border-dark z-20">
                <i data-lucide="sun" class="w-5 h-5 text-amber-400 dark:hidden"></i>
                <i data-lucide="moon" class="w-5 h-5 text-indigo-400 dark:block hidden"></i>
            </button>

            <!-- Brand Logo -->
            <div class="flex flex-col items-center gap-2 mb-8 relative z-10 animate-fade-in">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-glow-primary">
                    <i data-lucide="shield" class="w-8 h-8 text-white"></i>
                </div>
                <h1 class="text-3xl font-display font-extrabold text-gradient tracking-tight">GrandDome</h1>
                <p class="text-xs uppercase tracking-widest text-slate-400 font-semibold -mt-1">Society Management Portal</p>
            </div>

            <!-- 3D Card Container -->
            <div class="w-full max-w-md perspective-1000 h-[500px] relative z-10">
                <div id="flip-card" class="relative w-full h-full duration-700 preserve-3d">
                    
                    <!-- ADMIN LOGIN FACE (FRONT) -->
                    <div class="absolute inset-0 w-full h-full backface-hidden glass-panel border border-glass-border-light dark:border-glass-border-dark rounded-3xl p-8 flex flex-col justify-between shadow-2xl">
                        <div>
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-2xl font-display font-bold">Admin Portal</h2>
                                <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 uppercase tracking-wider">
                                    Secure Staff
                                </span>
                            </div>
                            
                            <form id="admin-form" class="space-y-4">
                                <div class="space-y-1">
                                    <label class="text-xs font-semibold text-slate-400">Security Email</label>
                                    <div class="relative">
                                        <i data-lucide="mail" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                                        <input type="email" id="admin-email" placeholder="admin@society.com" required 
                                            class="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500">
                                    </div>
                                </div>

                                <div class="space-y-1">
                                    <label class="text-xs font-semibold text-slate-400">Access Key / Password</label>
                                    <div class="relative">
                                        <i data-lucide="lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                                        <input type="password" id="admin-password" placeholder="••••••••" required 
                                            class="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500">
                                    </div>
                                </div>

                                <button type="submit" id="admin-submit-btn" class="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 glow-btn">
                                    <span class="submit-text">Authorize Access</span>
                                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                </button>
                            </form>
                        </div>

                        <!-- Card Flip Link -->
                        <div class="text-center pt-4 border-t border-glass-border-light dark:border-glass-border-dark">
                            <p class="text-xs text-slate-400">
                                Are you a resident? 
                                <button id="to-resident-btn" class="text-indigo-400 font-bold hover:underline focus:outline-none ml-1">
                                    Resident Login <i data-lucide="chevron-right" class="inline w-3 h-3"></i>
                                </button>
                            </p>
                        </div>
                    </div>

                    <!-- RESIDENT LOGIN FACE (BACK) -->
                    <div class="absolute inset-0 w-full h-full backface-hidden rotate-y-180 glass-panel border border-glass-border-light dark:border-glass-border-dark rounded-3xl p-8 flex flex-col justify-between shadow-2xl">
                        <div>
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-2xl font-display font-bold">Resident Portal</h2>
                                <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 uppercase tracking-wider">
                                    Homeowner
                                </span>
                            </div>
                            
                            <form id="resident-form" class="space-y-4">
                                <div class="space-y-1">
                                    <label class="text-xs font-semibold text-slate-400">Flat No. or Email</label>
                                    <div class="relative">
                                        <i data-lucide="home" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                                        <input type="text" id="resident-username" placeholder="201 or resident@society.com" required 
                                            class="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500">
                                    </div>
                                </div>

                                <div class="space-y-1">
                                    <label class="text-xs font-semibold text-slate-400">Resident Password</label>
                                    <div class="relative">
                                        <i data-lucide="lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                                        <input type="password" id="resident-password" placeholder="••••••••" required 
                                            class="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500">
                                    </div>
                                </div>

                                <button type="submit" id="resident-submit-btn" class="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold text-sm shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 glow-btn">
                                    <span class="submit-text">Verify Identity</span>
                                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                </button>
                            </form>
                        </div>

                        <!-- Card Flip Link -->
                        <div class="text-center pt-4 border-t border-glass-border-light dark:border-glass-border-dark">
                            <p class="text-xs text-slate-400">
                                Administration staff? 
                                <button id="to-admin-btn" class="text-purple-400 font-bold hover:underline focus:outline-none ml-1">
                                    <i data-lucide="chevron-left" class="inline w-3 h-3"></i> Admin Login
                                </button>
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Demo Info Banner -->
            <div class="mt-8 max-w-sm glass-panel border border-glass-border-light dark:border-glass-border-dark rounded-2xl p-4 text-xs space-y-2 relative z-10 animate-fade-in">
                <h4 class="font-bold flex items-center gap-1 text-amber-500">
                    <i data-lucide="lightbulb" class="w-3.5 h-3.5"></i> Quick Testing Credentials
                </h4>
                <div class="grid grid-cols-2 gap-2 text-slate-400">
                    <div>
                        <strong class="text-slate-300">Admin Login:</strong><br>
                        Email: <code class="text-slate-100 bg-slate-800/40 px-1 rounded">admin@society.com</code><br>
                        Password: <code class="text-slate-100 bg-slate-800/40 px-1 rounded">admin123</code>
                    </div>
                    <div>
                        <strong class="text-slate-300">Resident Login:</strong><br>
                        Email/Flat: <code class="text-slate-100 bg-slate-800/40 px-1 rounded">resident@society.com</code> (or <code class="text-slate-100 bg-slate-800/40 px-1">201</code>)<br>
                        Password: <code class="text-slate-100 bg-slate-800/40 px-1 rounded">resident123</code>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Render Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Bind event handlers
    const card = container.querySelector('#flip-card');
    const toResidentBtn = container.querySelector('#to-resident-btn');
    const toAdminBtn = container.querySelector('#to-admin-btn');
    const loginThemeBtn = container.querySelector('#login-theme-btn');

    // 3D Card Flips
    toResidentBtn.addEventListener('click', () => {
        card.classList.add('rotate-y-180');
    });

    toAdminBtn.addEventListener('click', () => {
        card.classList.remove('rotate-y-180');
    });

    // Theme toggle inside login
    loginThemeBtn.addEventListener('click', () => {
        window.toggleTheme();
        // Update login page theme icon dynamically
        const isDark = document.documentElement.classList.contains('dark');
        const darkIcon = loginThemeBtn.querySelector('.dark\\:block');
        const lightIcon = loginThemeBtn.querySelector('.dark\\:hidden');
        if (isDark) {
            darkIcon.style.display = 'block';
            lightIcon.style.display = 'none';
        } else {
            darkIcon.style.display = 'none';
            lightIcon.style.display = 'block';
        }
    });

    // Handle Admin login form submit
    const adminForm = container.querySelector('#admin-form');
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = container.querySelector('#admin-email').value;
        const password = container.querySelector('#admin-password').value;
        const submitBtn = container.querySelector('#admin-submit-btn');
        const submitText = submitBtn.querySelector('.submit-text');

        setButtonLoading(submitBtn, submitText, true, 'Authorizing...');

        try {
            await authService.login(email, password);
            showToast('Authorization successful! Welcome Admin.', 'success');
            Router.navigate('#/admin');
        } catch (error) {
            showToast(error.message, 'error');
            setButtonLoading(submitBtn, submitText, false, 'Authorize Access');
        }
    });

    // Handle Resident login form submit
    const residentForm = container.querySelector('#resident-form');
    residentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = container.querySelector('#resident-username').value;
        const password = container.querySelector('#resident-password').value;
        const submitBtn = container.querySelector('#resident-submit-btn');
        const submitText = submitBtn.querySelector('.submit-text');

        setButtonLoading(submitBtn, submitText, true, 'Verifying...');

        try {
            await authService.login(username, password);
            showToast('Identity verified! Welcome Resident.', 'success');
            Router.navigate('#/resident');
        } catch (error) {
            showToast(error.message, 'error');
            setButtonLoading(submitBtn, submitText, false, 'Verify Identity');
        }
    });
}

// Button loading state helper
function setButtonLoading(button, textSpan, isLoading, loadingText = 'Processing...') {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('opacity-80', 'cursor-not-allowed');
        textSpan.textContent = loadingText;
        const icon = button.querySelector('[data-lucide]');
        if (icon) icon.classList.add('animate-spin');
    } else {
        button.disabled = false;
        button.classList.remove('opacity-80', 'cursor-not-allowed');
        textSpan.textContent = loadingText;
        const icon = button.querySelector('[data-lucide]');
        if (icon) icon.classList.remove('animate-spin');
    }
}
