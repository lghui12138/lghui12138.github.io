(function () {
    const SESSION_KEY = 'fm_session_v2';
    const AUTH_SESSION_KEY = 'fm_auth_session_v2';
    const LEGACY_USER_KEY = 'fluidMechanicsUser';
    const REDIRECT_KEY = 'fm_auth_redirect';
    const FINGERPRINT_KEY = 'fm_device_fp';
    const BOOTSTRAP_GUARD_KEY = '__FM_AUTH_GUARD__';
    const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
    const IDLE_TTL_MS = 45 * 60 * 1000;
    const ACTIVITY_TOUCH_INTERVAL_MS = 15 * 1000;
    const SERVER_VALIDATE_INTERVAL_MS = 60 * 1000;
    const REDIRECT_LOOP_KEY = 'fm_auth_redirect_loop';
    const REDIRECT_LOOP_WINDOW_MS = 12000;
    const REDIRECT_LOOP_MAX = 4;
    const PUBLIC_PATHS = new Set(['/', '/index.html', '/index-complete.html', '/index-complete']);
    const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    let activityTrackingInstalled = false;
    let lastTouchAt = 0;
    let serverValidationInstalled = false;
    let lastServerValidationAt = 0;
    let serverValidationInFlight = null;
    let volatileSession = null;

    function normalizePath(pathname) {
        if (!pathname) return '/';
        if (pathname === '/') return '/';
        return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    }

    function readJson(key) {
        try {
            const raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function writeJson(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            return false;
        }
    }

    function removeLocalValue(key) {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            return false;
        }
        return true;
    }

    function writeText(key, value) {
        try {
            window.localStorage.setItem(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    function writeUserBridge(user) {
        if (!isValidUser(user)) {
            return;
        }
        writeJson(LEGACY_USER_KEY, user);
        writeJson('currentUser', user);
        writeText('currentUsername', user.username || user.name || '');
    }

    function clearUserBridge() {
        removeLocalValue(LEGACY_USER_KEY);
        removeLocalValue('currentUser');
        removeLocalValue('currentUsername');
    }

    function writeSessionBridge(session) {
        writeJson(SESSION_KEY, session);
        writeJson(AUTH_SESSION_KEY, session);
    }

    function readSessionValue(key) {
        try {
            return window.sessionStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function writeSessionValue(key, value) {
        try {
            window.sessionStorage.setItem(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    function removeSessionValue(key) {
        try {
            window.sessionStorage.removeItem(key);
        } catch (error) {
            return false;
        }
        return true;
    }

    function isValidUser(user) {
        return !!(user && typeof user.username === 'string' && typeof user.role === 'string' && typeof user.name === 'string');
    }

    function getEdgeUser() {
        const edge = window.__FM_EDGE_AUTH__;
        if (!edge || typeof edge !== 'object') {
            return null;
        }

        const user = {
            username: String(edge.username || edge.user || '').trim(),
            name: String(edge.name || edge.username || '用户').trim(),
            role: edge.role === 'teacher' ? 'teacher' : 'student'
        };

        const deviceId = String(edge.deviceId || '').trim();
        const deviceLabel = String(edge.deviceLabel || '').trim();
        if (deviceId) {
            user.deviceId = deviceId;
        }
        if (deviceLabel) {
            user.deviceLabel = deviceLabel;
        }

        return isValidUser(user) ? user : null;
    }

    function createSessionRecord(user, ttlMs) {
        const effectiveTtl = typeof ttlMs === 'number' && ttlMs > 0 ? ttlMs : SESSION_TTL_MS;
        const now = Date.now();
        return {
            version: 2,
            issuedAt: now,
            expiresAt: now + effectiveTtl,
            lastActive: now,
            origin: window.location.origin,
            user
        };
    }

    function readStoredSessionRecord() {
        const primary = readJson(SESSION_KEY);
        if (primary && isSessionValid(primary)) {
            return { key: SESSION_KEY, session: primary };
        }

        const fallback = readJson(AUTH_SESSION_KEY);
        if (fallback && isSessionValid(fallback)) {
            return { key: AUTH_SESSION_KEY, session: fallback };
        }

        if (primary) {
            return { key: SESSION_KEY, session: primary };
        }

        if (fallback) {
            return { key: AUTH_SESSION_KEY, session: fallback };
        }

        return { key: null, session: null };
    }

    function readSessionRecord() {
        const stored = readStoredSessionRecord();
        if (stored.session && isSessionValid(stored.session)) {
            return stored;
        }

        if (volatileSession && isSessionValid(volatileSession)) {
            return { key: null, session: volatileSession, volatile: true };
        }

        const edgeUser = getEdgeUser();
        if (edgeUser) {
            volatileSession = createSessionRecord(edgeUser, SESSION_TTL_MS);
            return { key: null, session: volatileSession, edge: true };
        }

        return stored;
    }

    function readSession() {
        return readSessionRecord().session;
    }

    function getSessionPayload(session) {
        if (!session || typeof session !== 'object') {
            return null;
        }

        if (session.payload && typeof session.payload === 'object') {
            return session.payload;
        }

        if (session.version === 2 && isValidUser(session.user)) {
            return session;
        }

        return null;
    }

    function getSessionUser(session) {
        const payload = getSessionPayload(session);
        return payload && isValidUser(payload.user) ? payload.user : null;
    }

    function isSignedSession(session) {
        return !!(session && typeof session === 'object' && session.payload && typeof session.sig === 'string');
    }

    function isSessionValid(session) {
        const payload = getSessionPayload(session);
        const user = getSessionUser(session);

        if (!payload || !user) {
            return false;
        }

        if (typeof payload.issuedAt !== 'number' || typeof payload.expiresAt !== 'number') {
            return false;
        }

        if (Date.now() >= payload.expiresAt) {
            return false;
        }

        if (payload.lastActive && Date.now() - payload.lastActive > IDLE_TTL_MS) {
            return false;
        }

        if (session.origin && session.origin !== window.location.origin) {
            return false;
        }

        return true;
    }

    function clearSession() {
        volatileSession = null;
        removeLocalValue(SESSION_KEY);
        removeLocalValue(AUTH_SESSION_KEY);
        clearUserBridge();
    }

    function sameSessionUser(left, right) {
        return !!(left && right &&
            String(left.username || '').trim() === String(right.username || '').trim() &&
            String(left.role || '').trim() === String(right.role || '').trim());
    }

    function saveSession(user, ttlMs) {
        const session = createSessionRecord(user, ttlMs);

        volatileSession = session;
        writeSessionBridge(session);
        writeUserBridge(user);
        return session;
    }

    function ensureEdgeSession() {
        const edgeUser = getEdgeUser();
        if (!edgeUser) {
            return null;
        }

        const record = readStoredSessionRecord();
        const current = isSessionValid(record.session) ? getSessionUser(record.session) : null;
        if (!current || current.username !== edgeUser.username || current.role !== edgeUser.role) {
            clearSession();
            saveSession(edgeUser, SESSION_TTL_MS);
        }

        return edgeUser;
    }

    function getUser() {
        const session = readSession();
        if (!isSessionValid(session)) {
            return null;
        }
        return getSessionUser(session);
    }

    function isTeacher() {
        const user = getUser();
        return !!(user && user.role === 'teacher');
    }

    function revealPage() {
        document.documentElement.removeAttribute('data-auth-pending');
    }

    function isLoginShellPath(pathname, params) {
        const normalized = normalizePath(pathname).toLowerCase();
        return normalized === '/_edge-login' ||
            normalized === '/_edge-fast-login' ||
            normalized === '/_edge-register' ||
            normalized === '/_edge-forgot-password' ||
            ((normalized === '/' || normalized === '/index-complete' || normalized === '/index-complete.html') && params && params.has('auth'));
    }

    function canonicalProtectedPath(pathname) {
        const normalized = normalizePath(pathname);
        const lower = normalized.toLowerCase();
        if (lower === '/knowledge' || lower === '/knowledge.html' || lower === '/modules/knowledge-detail' || lower === '/modules/knowledge-detail.html') return '/modules/knowledge-detail';
        if (lower === '/teacher-panel' || lower === '/teacher-panel.html') return '/teacher-panel';
        if (lower === '/modules/teacher-panel' || lower === '/modules/teacher-panel.html') return '/modules/teacher-panel';
        if (lower === '/question-bank-home' || lower === '/question-bank-home.html') return '/question-bank-home.html';
        if (lower === '/question-bank' || lower === '/question-bank.html' || lower === '/modules/question-bank' || lower === '/modules/question-bank.html') return '/modules/question-bank.html';
        if (lower === '/practice-dynamic' || lower === '/practice-dynamic.html' || lower === '/modules/practice-dynamic' || lower === '/modules/practice-dynamic.html') return '/modules/practice-dynamic.html';
        if (lower === '/modules/real-exams-dynamic' || lower === '/modules/real-exams-dynamic.html') return '/modules/real-exams-dynamic.html';
        if (lower === '/simulated-exams' || lower === '/simulated-exams.html' || lower === '/modules/simulated-exams-dynamic' || lower === '/modules/simulated-exams-dynamic.html') return '/modules/simulated-exams-dynamic.html';
        if (lower === '/resources' || lower === '/resources.html') return '/resources.html';
        if (lower === '/modules/wu-wangyi-fluid-reading' || lower === '/modules/wu-wangyi-fluid-reading.html' || lower === '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt') {
            return '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt';
        }
        if (lower === '/modules/wang-hongwei-fluid-reading' || lower === '/modules/wang-hongwei-fluid-reading.html' || lower === '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt') {
            return '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt';
        }
        if (lower.startsWith('/modules/') || lower.startsWith('/resources/')) {
            const last = lower.split('/').pop() || '';
            if (last && !last.includes('.')) return normalized;
            if (last && last.endsWith('.html')) return normalized.slice(0, -5);
        }
        return normalized;
    }

    function sanitizeInternalPath(pathname, fallback, depth) {
        if (typeof pathname !== 'string') {
            return fallback;
        }

        const trimmed = pathname.trim();
        if (!trimmed || trimmed.startsWith('//') || /[\u0000-\u001f\u007f\\]/.test(trimmed) || /javascript:/i.test(trimmed)) {
            return fallback;
        }

        try {
            const parsed = new URL(trimmed, window.location.origin);
            if (parsed.origin !== window.location.origin) {
                return fallback;
            }
            parsed.pathname = canonicalProtectedPath(parsed.pathname);
            if (isLoginShellPath(parsed.pathname, parsed.searchParams)) {
                const nested = parsed.searchParams.get('next');
                return nested && depth !== 2 ? sanitizeInternalPath(nested, fallback, (depth || 0) + 1) : fallback;
            }
            return `${parsed.pathname}${parsed.search}${parsed.hash}`;
        } catch (error) {
            return fallback;
        }
    }

    function getNextTarget() {
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next') || readSessionValue(REDIRECT_KEY) || '';
        return sanitizeInternalPath(next, null);
    }

    function consumeNextTarget() {
        const next = getNextTarget();
        removeSessionValue(REDIRECT_KEY);
        return next;
    }

    function bytesToBase64(bytes) {
        let text = '';
        for (let index = 0; index < bytes.length; index += 1) {
            text += String.fromCharCode(bytes[index]);
        }
        return window.btoa(text);
    }

    async function sha256Base64(text) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error('crypto_unavailable');
        }

        const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return bytesToBase64(new Uint8Array(digest));
    }

    async function getDeviceFingerprint() {
        let cached = '';
        try {
            cached = window.localStorage.getItem(FINGERPRINT_KEY);
        } catch (error) {
            cached = '';
        }
        if (cached) {
            return cached;
        }

        const source = [
            navigator.userAgent,
            navigator.language,
            `${window.screen.width}x${window.screen.height}`,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || '',
            navigator.platform || ''
        ].join('|');
        const fingerprint = await sha256Base64(source);
        try {
            window.localStorage.setItem(FINGERPRINT_KEY, fingerprint);
        } catch (error) {}
        return fingerprint;
    }

    async function signPayload(payload) {
        const fingerprint = payload && payload.fp ? payload.fp : await getDeviceFingerprint();
        if (payload) {
            payload.fp = fingerprint;
        }
        return sha256Base64(`${JSON.stringify(payload)}::${fingerprint}`);
    }

    async function loadSession() {
        const edgeUser = getEdgeUser();
        const record = readSessionRecord();
        const session = record.session;

        if (!isSessionValid(session)) {
            if (edgeUser) {
                return saveSession(edgeUser, SESSION_TTL_MS);
            }
            clearSession();
            return null;
        }

        const user = getSessionUser(session);
        const edgeTrusted = sameSessionUser(user, edgeUser);
        if (edgeTrusted && !isSignedSession(session)) {
            return session;
        }
        if (edgeTrusted && isSignedSession(session)) {
            return saveSession(edgeUser, SESSION_TTL_MS);
        }

        if (user && user.deviceId) {
            const fingerprint = await getDeviceFingerprint();
            if (!fingerprint || user.deviceId !== fingerprint) {
                clearSession();
                return null;
            }
        }

        if (isSignedSession(session)) {
            const payload = session.payload;
            const fingerprint = await getDeviceFingerprint();

            if (!payload.fp || payload.fp !== fingerprint) {
                clearSession();
                return null;
            }

            const expectedSignature = await signPayload(payload);
            if (session.sig !== expectedSignature) {
                clearSession();
                return null;
            }
        }

        return session;
    }

    function isProtectedHtml(pathname) {
        const normalized = normalizePath(pathname);
        if (PUBLIC_PATHS.has(normalized)) {
            return false;
        }
        const lower = normalized.toLowerCase();
        const last = lower.split('/').pop() || '';
        return normalized === '/' ||
            lower.endsWith('.html') ||
            lower === '/knowledge' ||
            lower === '/question-bank' ||
            lower === '/practice-dynamic' ||
            lower === '/simulated-exams' ||
            lower === '/resources' ||
            ((lower.startsWith('/modules/') || lower.startsWith('/resources/')) && last && !last.includes('.'));
    }

    async function touchSession(force) {
        const currentTime = Date.now();
        if (!force && currentTime - lastTouchAt < ACTIVITY_TOUCH_INTERVAL_MS) {
            return false;
        }

        const record = readSessionRecord();
        const session = record.session;
        const payload = getSessionPayload(session);
        if (!record.key || !session || !payload) {
            return false;
        }

        lastTouchAt = currentTime;
        if (session.payload) {
            session.payload.lastActive = currentTime;
            if (isSignedSession(session)) {
                session.sig = await signPayload(session.payload);
            }
        } else {
            session.lastActive = currentTime;
        }

        writeSessionBridge(session);
        return true;
    }

    function queueTouch(force) {
        touchSession(force).catch(function () {
            return null;
        });
    }

    function installActivityTracking() {
        if (activityTrackingInstalled) {
            return;
        }

        activityTrackingInstalled = true;
        ACTIVITY_EVENTS.forEach(function (eventName) {
            window.addEventListener(
                eventName,
                function () {
                    if (isSessionValid(readSession())) {
                        queueTouch(false);
                    }
                },
                eventName === 'keydown' ? false : { passive: true }
            );
        });
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible' && isSessionValid(readSession())) {
                queueTouch(true);
            }
        });
        window.addEventListener('pageshow', function () {
            if (isSessionValid(readSession())) {
                queueTouch(true);
            }
        });
    }

    async function validateServerSession(options) {
        const opts = options && typeof options === 'object' ? options : {};
        const pathname = normalizePath(window.location.pathname);
        const target = `${pathname}${window.location.search}${window.location.hash}`;
        const loginPage = sanitizeInternalPath(opts.loginPage, '/index-complete.html');
        const requiredRole = opts.requireRole === 'teacher' ? 'teacher' : '';
        const failClosed = !!(opts.failClosed || requiredRole || isProtectedHtml(pathname));
        const current = readSession();
        if (!isSessionValid(current)) {
            clearSession();
            return false;
        }

        const nowTime = Date.now();
        if (!opts.force && serverValidationInFlight) {
            return serverValidationInFlight;
        }
        if (!opts.force && nowTime - lastServerValidationAt < SERVER_VALIDATE_INTERVAL_MS) {
            return true;
        }

        serverValidationInFlight = (async function () {
            lastServerValidationAt = Date.now();
            try {
                const response = await window.fetch('/api/auth/me', {
                    cache: 'no-store',
                    credentials: 'same-origin',
                    headers: { Accept: 'application/json' }
                });
                let data = null;
                try {
                    data = await response.json();
                } catch (_) {
                    data = null;
                }
                if (!response.ok || !data || !data.ok || !data.authenticated || !data.user) {
                    const terminalAuthFailure = response.status === 401 || response.status === 403 || response.status === 409 || response.status === 402;
                    if (!terminalAuthFailure && !failClosed) {
                        return true;
                    }
                    clearSession();
                    if (opts.redirectOnFail && isProtectedHtml(pathname)) {
                        if (response.status === 402 || (data && data.error === 'payment_required')) {
                            redirectToLocked(target);
                        } else {
                            redirectToLogin(loginPage, (data && data.error) || (requiredRole ? 'teacher_required' : 'required'), target);
                        }
                    }
                    return false;
                }

                const serverRole = data.user.role === 'teacher' ? 'teacher' : 'student';
                const serverAccess = String(data.user.access || data.user.status || 'active').toLowerCase();
                if (serverAccess && !['active', 'teacher', 'admin'].includes(serverAccess)) {
                    clearSession();
                    if (opts.redirectOnFail && isProtectedHtml(pathname)) {
                        redirectToLocked(target);
                    }
                    return false;
                }
                if (requiredRole && serverRole !== requiredRole) {
                    clearSession();
                    if (opts.redirectOnFail && isProtectedHtml(pathname)) {
                        redirectToLogin(loginPage, 'teacher_required', target);
                    }
                    return false;
                }

                const record = readSessionRecord();
                const session = record.session;
                const payload = getSessionPayload(session);
                const user = getSessionUser(session);
                if (record.key && session && payload && user) {
                    const nextUser = Object.assign({}, user, {
                        username: String(data.user.username || user.username || '').trim(),
                        role: serverRole,
                        name: user.name || data.user.username || '用户'
                    });
                    if (data.user.sessionDeviceId) nextUser.deviceId = String(data.user.sessionDeviceId).trim();
                    if (data.user.boundDeviceLabel) nextUser.deviceLabel = String(data.user.boundDeviceLabel).trim();
                    if (session.payload) {
                        session.payload.user = nextUser;
                        session.payload.lastActive = Date.now();
                        if (isSignedSession(session)) {
                            session.sig = await signPayload(session.payload);
                        }
                    } else {
                        session.user = nextUser;
                        session.lastActive = Date.now();
                    }
                    writeSessionBridge(session);
                    writeUserBridge(nextUser);
                }
                return true;
            } catch (_) {
                if (failClosed) {
                    return false;
                }
                return true;
            } finally {
                serverValidationInFlight = null;
            }
        })();

        return serverValidationInFlight;
    }

    function installServerValidation(options) {
        if (serverValidationInstalled) {
            return;
        }

        serverValidationInstalled = true;
        const opts = Object.assign({}, options || {});
        validateServerSession(Object.assign({}, opts, { force: true })).catch(function () {
            return null;
        });
        window.setInterval(function () {
            if (isSessionValid(readSession())) {
                validateServerSession(opts).catch(function () {
                    return null;
                });
            }
        }, SERVER_VALIDATE_INTERVAL_MS);
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible' && isSessionValid(readSession())) {
                validateServerSession(Object.assign({}, opts, { force: true })).catch(function () {
                    return null;
                });
            }
        });
        window.addEventListener('focus', function () {
            if (isSessionValid(readSession())) {
                validateServerSession(Object.assign({}, opts, { force: true })).catch(function () {
                    return null;
                });
            }
        });
    }

    function getBootstrapGuardOptions() {
        const options = window[BOOTSTRAP_GUARD_KEY];
        return options && typeof options === 'object' ? options : null;
    }

    function trackRedirectLoop(reason, target) {
        const now = Date.now();
        const normalizedTarget = sanitizeInternalPath(target || window.location.pathname, '/index-complete');
        const key = `${reason || 'required'}:${normalizedTarget}`;
        let record = null;
        try {
            record = JSON.parse(window.sessionStorage.getItem(REDIRECT_LOOP_KEY) || 'null');
        } catch (_) {
            record = null;
        }
        if (!record || record.key !== key || now - Number(record.firstAt || 0) > REDIRECT_LOOP_WINDOW_MS) {
            record = { key, count: 1, firstAt: now };
        } else {
            record.count = Number(record.count || 0) + 1;
        }
        try {
            window.sessionStorage.setItem(REDIRECT_LOOP_KEY, JSON.stringify(record));
        } catch (_) {}
        return record.count >= REDIRECT_LOOP_MAX;
    }

    function clearRedirectLoop() {
        removeSessionValue(REDIRECT_LOOP_KEY);
    }

    function buildLoginUrl(loginPage, reason, target) {
        const separator = loginPage.includes('?') ? '&' : '?';
        return `${loginPage}${separator}auth=${reason}&next=${encodeURIComponent(target)}`;
    }

    function redirectToLogin(loginPage, reason, target) {
        writeSessionValue(REDIRECT_KEY, target);
        if (trackRedirectLoop(reason, target)) {
            clearSession();
            const repairTarget = sanitizeInternalPath(target || '/index-complete', '/index-complete');
            window.location.replace('/_edge-reset?next=' + encodeURIComponent(repairTarget));
            return;
        }
        window.location.replace(buildLoginUrl(loginPage, reason, target));
    }

    function redirectToLocked(target) {
        const next = sanitizeInternalPath(target || '/index-complete', '/index-complete');
        window.location.replace('/_edge-locked?next=' + encodeURIComponent(next));
    }

    function enforcePageGuard(options) {
        const bootstrapOptions = getBootstrapGuardOptions() || {};
        const opts = Object.assign({}, bootstrapOptions, options || {});
        const pathname = normalizePath(window.location.pathname);
        const loginPage = sanitizeInternalPath(opts.loginPage, '/_edge-login');
        const target = `${pathname}${window.location.search}${window.location.hash}`;
        ensureEdgeSession();
        const session = readSession();

        if (!isSessionValid(session)) {
            clearSession();

            if (!isProtectedHtml(pathname) || PUBLIC_PATHS.has(pathname)) {
                revealPage();
                return false;
            }

            redirectToLogin(loginPage, 'required', target);
            return false;
        }

        const user = getSessionUser(session);
        if (opts.teacherOnly && (!user || user.role !== 'teacher')) {
            redirectToLogin(loginPage, 'teacher_required', target);
            return false;
        }

        installActivityTracking();
        loadSession()
            .then(async function (verifiedSession) {
                const verifiedUser = getSessionUser(verifiedSession);

                if (!verifiedSession || !verifiedUser) {
                    redirectToLogin(loginPage, 'required', target);
                    return;
                }

                const serverOk = await validateServerSession({
                    loginPage: loginPage,
                    redirectOnFail: true,
                    force: true,
                    failClosed: true,
                    requireRole: opts.teacherOnly ? 'teacher' : ''
                });
                if (!serverOk) {
                    return;
                }

                const serverUser = getSessionUser(readSession()) || verifiedUser;
                if (opts.teacherOnly && serverUser.role !== 'teacher') {
                    redirectToLogin(loginPage, 'teacher_required', target);
                    return;
                }

                writeJson(LEGACY_USER_KEY, serverUser);
                queueTouch(true);
                installServerValidation({
                    loginPage: loginPage,
                    redirectOnFail: true,
                    requireRole: opts.teacherOnly ? 'teacher' : ''
                });
                clearRedirectLoop();
                revealPage();
            })
            .catch(function () {
                clearSession();
                redirectToLogin(loginPage, 'required', target);
            });
        return true;
    }

    window.FMSecurity = {
        SESSION_KEY,
        AUTH_SESSION_KEY,
        LEGACY_USER_KEY,
        SESSION_TTL_MS,
        IDLE_TTL_MS,
        readSession,
        loadSession,
        isAuthenticated: function () {
            return isSessionValid(readSession());
        },
        getUser,
        isTeacher,
        saveSession,
        clearSession,
        getNextTarget,
        consumeNextTarget,
        guardPage: enforcePageGuard,
        touchSession
    };

    enforcePageGuard();
})();
