// Legacy compatibility shim.
// Real authentication now lives in /js/security/auth-guard.js and Cloudflare Pages middleware.
(function () {
    window.SecurityProtection = {
        currentUser: window.FMSecurity?.getUser?.() || null,
        userLevel: window.FMSecurity?.isTeacher?.() ? 'teacher' : 'student',
        init() {
            this.currentUser = window.FMSecurity?.getUser?.() || null;
            this.userLevel = window.FMSecurity?.isTeacher?.() ? 'teacher' : 'student';
            return this;
        },
        isAuthorizedTeacher() {
            return !!window.FMSecurity?.isTeacher?.();
        },
        requireTeacher() {
            return this.isAuthorizedTeacher();
        },
        showLoginForm() {
            window.location.href = '/_edge-fast-login?next=/index-complete';
        },
        showMobileLoginPrompt() {
            this.showLoginForm();
        },
        showDesktopLoginPrompt() {
            this.showLoginForm();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.SecurityProtection.init(), { once: true });
    } else {
        window.SecurityProtection.init();
    }
})();
