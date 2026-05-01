(function () {
    const SESSION_KEY = 'fm_auth_session_v2';
    const LEGACY_USER_KEY = 'user';
    const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
    const PUBLIC_PATHS = new Set(['/index-complete.html']);

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
        const record = accounts[username];
        if (!record || !window.crypto || !window.crypto.subtle) {
            return null;
        }

        const derived = await hashPassword(password, record);
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
