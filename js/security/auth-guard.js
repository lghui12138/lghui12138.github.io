(function () {
    const SESSION_KEY = 'fm_auth_session_v2';
    const AUTH_SESSION_KEY = 'fm_auth_session';
    const FINGERPRINT_KEY = 'fm_device_fingerprint';
    const BOOTSTRAP_GUARD_KEY = '__FM_GUARD_OPTS__';
    const LEGACY_USER_KEY = 'user';
    const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const IDLE_TTL_MS = 45 * 60 * 1000;
    const ACTIVITY_TOUCH_INTERVAL_MS = 15 * 1000;
    const SERVER_VALIDATE_INTERVAL_MS = 60 * 1000;
    const PUBLIC_PATHS = new Set(['/', '/index.html', '/index-complete.html', '/index-complete']);
    const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    let activityTrackingInstalled = false;
    let lastTouchAt = 0;
    let serverValidationInstalled = false;
    let lastServerValidationAt = 0;
    let serverValidationInFlight = null;

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
        window.localStorage.setItem(key, JSON.stringify(value));
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

    function readSessionRecord() {
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
    function readSession() {
        return readJson(SESSION_KEY);
    }

    function isSessionValid(session) {
        if (!session || session.version !== 2 || !isValidUser(session.user)) {
            return false;
        }

        if (typeof session.issuedAt !== 'number' || typeof session.expiresAt !== 'number') {
            return false;
        }

        if (Date.now() >= session.expiresAt) {
            return false;
        }

        if (session.origin && session.origin !== window.location.origin) {
            return false;
        }

        return true;
    }

    function clearSession() {
        window.localStorage.removeItem(SESSION_KEY);
        window.localStorage.removeItem(AUTH_SESSION_KEY);
        window.localStorage.removeItem(FINGERPRINT_KEY);
        window.localStorage.removeItem(LEGACY_USER_KEY);
    }

    function saveSession(user, ttlMs) {
        const effectiveTtl = typeof ttlMs === 'number' && ttlMs > 0 ? ttlMs : SESSION_TTL_MS;
        const now = Date.now();
        const session = {
            version: 2,
            issuedAt: now,
            expiresAt: now + effectiveTtl,
            origin: window.location.origin,
            user
        };

        writeJson(SESSION_KEY, session);
        writeJson(LEGACY_USER_KEY, user);
        return session;
    }

    function getUser() {
        const session = readSession();
        if (!isSessionValid(session)) {
            return null;
        }
        return session.user;
    }

    function revealPage() {
        document.documentElement.removeAttribute('data-auth-pending');
    }

    function getNextTarget() {
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next') || window.sessionStorage.getItem('fm_auth_redirect') || '';
        if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('javascript:')) {
            return null;
        }
        return next;
    }

    function consumeNextTarget() {
        const next = getNextTarget();
        window.sessionStorage.removeItem('fm_auth_redirect');
        return next;
    }

    function base64ToBytes(base64) {
        return Uint8Array.from(window.atob(base64), char => char.charCodeAt(0));
    }

    function timingSafeEqual(left, right) {
        if (!(left instanceof Uint8Array) || !(right instanceof Uint8Array) || left.length !== right.length) {
            return false;
        }

        let diff = 0;
        for (let index = 0; index < left.length; index += 1) {
            diff |= left[index] ^ right[index];
        }
        return diff === 0;
    }

    async function hashPassword(password, record) {
        const encoder = new TextEncoder();
        const passwordKey = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        const derivedBits = await window.crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: base64ToBytes(record.salt),
                iterations: record.iterations,
                hash: 'SHA-256'
            },
            passwordKey,
            256
        );

        return new Uint8Array(derivedBits);
    }

    async function verifyCredentials(username, password, accounts) {
        var record = accounts[username];
        if (!record || !window.crypto || !window.crypto.subtle) {
            return null;
        }
        const MIN_ITERATIONS = 100000;
        if (typeof record.iterations !== 'number' || record.iterations < MIN_ITERATIONS) {
            return null;
        }

        var derived = await hashPassword(password, record);
        const expected = base64ToBytes(record.hash);
        if (!timingSafeEqual(derived, expected)) {
            return null;
        }

        return {
            username,
            name: record.name,
            role: record.role
        };
    }

async function sha256Base64(text) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error('crypto_unavailable');
        }

        const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return bytesToBase64(new Uint8Array(digest));
    }

    async function getDeviceFingerprint() {
        const cached = window.localStorage.getItem(FINGERPRINT_KEY);
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
        window.localStorage.setItem(FINGERPRINT_KEY, fingerprint);
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
        const record = readSessionRecord();
        const session = record.session;

        if (!isSessionValid(session)) {
            clearSession();
            return null;
        }

        const user = getSessionUser(session);
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
        return normalized === '/' || normalized.endsWith('.html');
    }

    function enforcePageGuard() {
        const pathname = normalizePath(window.location.pathname);
        const session = readSession();

        if (isSessionValid(session)) {
            writeJson(LEGACY_USER_KEY, session.user);
            revealPage();
            return;
        }

        clearSession();

if (!isProtectedHtml(pathname) || PUBLIC_PATHS.has(pathname)) {
            revealPage();
            return;
        }

        const target = `${pathname}${window.location.search}${window.location.hash}`;
        window.sessionStorage.setItem('fm_auth_redirect', target);
        window.location.replace(`/index-complete.html?auth=required&next=${encodeURIComponent(target)}`);
    }

    async function validateServerSession(options) {
        const opts = options && typeof options === 'object' ? options : {};
        const pathname = normalizePath(window.location.pathname);
        const target = `${pathname}${window.location.search}${window.location.hash}`;
        const loginPage = sanitizeInternalPath(opts.loginPage, '/index-complete.html');
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
                const response = await window.fetch('/_edge-health', {
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
                if (!response.ok || !data || !data.ok || !data.user) {
                    clearSession();
                    if (opts.redirectOnFail && isProtectedHtml(pathname)) {
                        redirectToLogin(loginPage, (data && data.error) || 'required', target);
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
                        role: data.user.role === 'teacher' ? 'teacher' : 'student',
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
                    writeJson(record.key, session);
                    writeJson(LEGACY_USER_KEY, nextUser);
                }
                return true;
            } catch (_) {
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
    }

    window.FMSecurity = {
        SESSION_KEY,
        LEGACY_USER_KEY,
        SESSION_TTL_MS,
        readSession,
        isAuthenticated: function () {
            return isSessionValid(readSession());
        },
        getUser,
        saveSession,
        clearSession,
        getNextTarget,
        consumeNextTarget,
        verifyCredentials
    };

    enforcePageGuard();
})();
