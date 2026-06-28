const COOKIE_NAME = '__Host-fm_edge_session';
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const DEFAULT_ENTRY = '/index-complete?full=1';
const INDEX_KEY = 'events:index';
const MAX_INDEX_EVENTS = 800;
const AUDIT_TTL_SECONDS = 180 * 24 * 60 * 60;
const LEARNING_PROGRESS_KEY_PREFIX = 'learning-progress:';
const LEARNING_PROGRESS_EVENT_KEY_PREFIX = 'learning-progress-event:';
const LEARNING_PROGRESS_SCHEMA_VERSION = 1;
const LEARNING_PROGRESS_RECENT_ANSWER_LIMIT = 160;
const LEARNING_PROGRESS_RECENT_SESSION_LIMIT = 60;
const LEARNING_PROGRESS_RECENT_EVENT_LIMIT = 600;
const LEARNING_PROGRESS_MAX_BATCH_EVENTS = 50;
const LEARNING_PROGRESS_R2_PREFIX = 'learning-progress';
const LEARNING_PROGRESS_HEARTBEAT_MAX_SECONDS = 300;
const LEARNING_PROGRESS_QUESTION_MAX_SECONDS = 2 * 60 * 60;
const LEARNING_PROGRESS_QUESTION_LEGACY_MILLIS_GUARD_SECONDS = 10 * 60;
const LEARNING_PROGRESS_EVENT_TYPES = new Set([
  'practice_answer_submit',
  'practice_complete',
  'practice_question_skip',
  'study_heartbeat'
]);
const LOGIN_WINDOW_SECONDS = 10 * 60;
const LOGIN_LOCK_SECONDS = 15 * 60;
const LOGIN_MAX_FAILURES = 6;
const LOGIN_IP_LOCK_SECONDS = 30 * 60;
const LOGIN_IP_MAX_FAILURES = 20;
const REGISTER_CODE_TTL_SECONDS = 10 * 60;
const REGISTER_CODE_WINDOW_SECONDS = 10 * 60;
const REGISTER_CODE_MAX_PER_WINDOW = 3;
const REGISTER_CODE_IP_MAX_PER_WINDOW = 10;
const PASSWORD_RESET_CODE_TTL_SECONDS = 10 * 60;
const PASSWORD_RESET_CODE_WINDOW_SECONDS = 10 * 60;
const PASSWORD_RESET_CODE_MAX_PER_WINDOW = 3;
const PASSWORD_RESET_CODE_IP_MAX_PER_WINDOW = 10;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_HASH_ITERATIONS = 100000;
const PASSWORD_HISTORY_LIMIT = 5;
const AI_RATE_WINDOW_SECONDS = 60;
const AI_RATE_MAX_REQUESTS = 12;
const AI_ENDPOINT = 'https://api.siliconflow.cn/v1/chat/completions';
const AI_DEFAULT_MODEL = 'deepseek-ai/DeepSeek-V3';
const AI_FAST_MODEL = 'Qwen/Qwen2.5-7B-Instruct';
const AI_QUALITY_MODEL = 'deepseek-ai/DeepSeek-R1';
const AI_FALLBACK_KEY = '';
const STUDENT_ACCESS_KEY = 'student-access-policy';
const STUDENT_ACCESS_POLICY_VERSION = 3;
const DEFAULT_ACTIVE_STUDENT_USERS = ['qi', 'chenlei', 'anxin', 'sunruze'];
const DEFAULT_STUDENT_REGISTRATION_USERS = ['chenlei', 'anxin', 'sunruze'];
const RESERVED_STUDENT_REGISTRATION_USERS = ['qi'];
// round373-181103-source-semantic-practice-20260616: 181103 522 来源卡逐题语义复核，381 可刷题，141 源文线索不进默认练习。
// round374-181103-reference-answer-display-20260617: 181103 参考答案从来源说明中拆出，按 HTML/MathJax 独立渲染。
// round375-181103-all-question-web-parity-20260617: 浏览器逐页打开 38 个资料 HTML，并验证 522 张来源卡与 522 个网页答案块。
// Round544: publish the latest 181103 proof-depth answer upgrade while keeping progress durability and private-video claims separately gated.
const EDGE_HOME_VERSION = 'round555-181103-proof-depth-upgrade-20260628';
const EDGE_RUNTIME_JS_VERSION = 'round555-181103-proof-depth-upgrade-20260628';
const WU_WANGYI_READING_PATH = '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html';
const WANG_HONGWEI_READING_PATH = '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html';
const SAFE_NEXT_HOSTS = new Set([
  'lghui.top',
  'www.lghui.top',
  'lghui-fluid-learning.pages.dev'
]);
const PRIVATE_QI_VIDEO_ID = 'qi-meeting-01';
const PRIVATE_QI_VIDEO_KEY = 'private/qi/meeting_01.mp4';
const PRIVATE_QI_VIDEO_KV_META_KEY = `private-media:${PRIVATE_QI_VIDEO_ID}:meta`;
const PRIVATE_QI_VIDEO_KV_CHUNK_PREFIX = `private-media:${PRIVATE_QI_VIDEO_ID}:chunk:`;
const PRIVATE_VIDEO_FIRST_CHUNK_BYTES = 8 * 1024 * 1024;
const PRIVATE_QI_VIDEO_STATIC_MANIFEST_PATH = `/private-media/${PRIVATE_QI_VIDEO_ID}/manifest.json`;
const PRIVATE_QI_VIDEO_STATIC_CHUNK_PREFIX = `/private-media/${PRIVATE_QI_VIDEO_ID}/chunks/chunk-`;
const PRIVATE_QI_VIDEO_STATIC_MAX_RESPONSE_BYTES = PRIVATE_VIDEO_FIRST_CHUNK_BYTES;
const PRIVATE_VIDEO_INDEX_KEY = 'private-video:index';
const PRIVATE_VIDEO_META_PREFIX = 'private-video:';
const PRIVATE_VIDEO_CHUNK_PREFIX = 'private-video-chunk:';
const PRIVATE_VIDEO_R2_PREFIX = 'private/videos';
const PRIVATE_VIDEO_R2_INDEX_KEY = `${PRIVATE_VIDEO_R2_PREFIX}/index.json`;
const PRIVATE_UPLOAD_DEFAULT_CHUNK_BYTES = 2 * 1024 * 1024;
const PRIVATE_UPLOAD_MAX_CHUNK_BYTES = 8 * 1024 * 1024;
const PRIVATE_UPLOAD_KV_MIN_CHUNK_BYTES = 4 * 1024 * 1024;
const PRIVATE_UPLOAD_KV_TARGET_CHUNKS = 320;
const PRIVATE_UPLOAD_MAX_CHUNKS = 12000;
const PRIVATE_VIDEO_WRITE_HEALTH_TTL_MS = 5 * 60 * 1000;
const DEVICE_ID_MIN_LENGTH = 24;
const DEVICE_ID_MAX_LENGTH = 160;
const ACCOUNT_SUMMARY_LIMIT = 160;
const KV_LIST_PAGE_LIMIT = 100;
let PRIVATE_VIDEO_METADATA_WRITE_HEALTH = {
  checkedAt: 0,
  state: 'unknown',
  message: '尚未探测课程元数据写入状态。'
};
let LEARNING_PROGRESS_D1_READY = false;

const SENSITIVE_EXACT_PATHS = new Set([
  '/.auth-browser.env',
  '/output/qa/.auth-browser.env',
  '/data/users.json',
  '/github-setup.html',
  '/github-token-setup.html',
  '/ai-assistant-minimal.html',
  '/test-deepseek-r1-models.html',
  '/login-test.html',
  '/standalone-login.html',
  '/index-beautiful.html',
  '/index-fixed.html',
  '/simple-login.html'
]);

const SENSITIVE_PREFIXES = [
  '/.git/',
  '/.github/',
  '/.wrangler/',
  '/.env',
  '/output/qa/',
  '/functions/',
  '/docs/',
  '/source-materials/',
  '/private-media/'
];

const PROTECTED_SOURCE_PREFIXES = [
  '/resources/fluid-sources/'
];

const PROTECTED_DATA_JSON_PATHS = new Set([
  '/data/fluid-181103-full-material-audit.json',
  '/data/fluid-181103-study-routes.json',
  '/data/fluid-chapter-exam-packs.json',
  '/data/fluid-simulated-exam-packs.json'
]);

const PUBLIC_181103_HTML_ROOT = '/resources/fluid-181103-html';
const PUBLIC_181103_HTML_PREFIX = `${PUBLIC_181103_HTML_ROOT}/`;
const PUBLIC_181103_QUESTION_BANK_PATHS = new Set([
  '/question-banks/181103-material-extracted.json',
  '/question-banks/181103-material-extracted.json.gz'
]);
const BLOCKED_181103_RAW_BINARY_PATTERN = /\.(?:pdf|docx?|pptx?|xlsx?|zip|7z|rar)(?:$|[?#])/i;
const PUBLIC_181103_VIEW_ASSET_PATTERN = /(?:\/|\.html?|\.css|\.js|\.mjs|\.json|\.json\.gz|\.png|\.jpe?g|\.webp|\.gif|\.svg|\.ico|\.avif|\.woff2?|\.ttf|\.map)$/i;

const GZIP_ASSET_PREFIXES = [
  '/data/',
  '/question-banks/',
  '/js/',
  '/vendor/'
];

const PUBLIC_RUNTIME_ASSET_PREFIXES = [
  '/js/',
  '/lib/',
  '/styles/',
  '/modules/js/',
  '/modules/styles/',
  '/vendor/mathjax/'
];
const PUBLIC_RUNTIME_ASSET_ALIASES = new Map([
  ['/safari-compatibility.js', '/safari-compatibility.js'],
  ['/fix-mathjax-rendering.js', '/fix-mathjax-rendering.js'],
  ['/quick-mathjax-fix.js', '/quick-mathjax-fix.js'],
  ['/local-mathjax.js', '/js/core/local-mathjax.js'],
  ['/modules/local-mathjax.js', '/js/core/local-mathjax.js'],
  ['/modules/js/local-mathjax.js', '/js/core/local-mathjax.js'],
  ['/modules/js/core/local-mathjax.js', '/js/core/local-mathjax.js'],
  ['/formula-lite.js', '/js/formula-lite.js'],
  ['/modules/formula-lite.js', '/js/formula-lite.js'],
  ['/modules/js/formula-lite.js', '/js/formula-lite.js'],
  ['/auth-guard.js', '/js/security/auth-guard.js'],
  ['/modules/auth-guard.js', '/js/security/auth-guard.js'],
  ['/modules/js/security/auth-guard.js', '/js/security/auth-guard.js'],
  ['/edge-fluid-performance.js', '/js/edge-fluid-performance.js'],
  ['/modules/edge-fluid-performance.js', '/js/edge-fluid-performance.js'],
  ['/modules/js/edge-fluid-performance.js', '/js/edge-fluid-performance.js']
]);

const SENSITIVE_HTML_PATTERN = /(?:^|\/)[^/]*(?:backup|debug|token|setup|login-test|test)[^/]*\.html$/i;
const SENSITIVE_SECRET_PATH_PATTERN = /(?:^|\/)[^/]*(?:auth-browser|credential|secret|token|cookie|password|api[-_]?key)[^/]*(?:\.env|\.json|\.txt|\.log)?$/i;
const LEGACY_FLUID_PATTERN = /^\/fluid_dynamic(?:_backup|3|_2|_4|_4_backup)?\.html$/i;
const COMPRESSED_STATIC_SUFFIX_PATTERN = /\.(?:gz|br)$/i;

const encoder = new TextEncoder();

const SERVICE_WORKER_KILL_SWITCH = `/*
 * Protected-mode kill switch.
 *
 * The site is now served behind edge authentication, so offline caching is
 * intentionally disabled. This Service Worker replaces older caching workers,
 * clears their caches, then unregisters itself so every protected request goes
 * back to the network and the edge gate.
 */

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    clients.forEach((client) => client.navigate(client.url).catch(() => {}));
    await self.registration.unregister();
  })());
});

self.addEventListener('fetch', () => {
  // No respondWith: allow the browser to use the normal network path.
});
`;

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

function bytesToBase64Url(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value) {
  const base64 = String(value || '').replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(String(value || '').length / 4) * 4, '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function randomBase64Url(byteLength = 16) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

function base64UrlToText(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return atob(base64);
}

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Origin-Agent-Cluster': '?1',
      ...(init.headers || {})
    }
  });
}

function htmlResponse(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'accelerometer=(), camera=(), display-capture=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), serial=(), usb=(), xr-spatial-tracking=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Origin-Agent-Cluster': '?1',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      ...(init.headers || {})
    }
  });
}

function redirectResponse(location, headers = {}) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      ...headers
    }
  });
}

function serviceWorkerKillSwitchResponse(request) {
  return new Response(request.method === 'HEAD' ? '' : SERVICE_WORKER_KILL_SWITCH, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Clear-Site-Data': '"cache", "storage"',
      'Service-Worker-Allowed': '/',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  });
}

function faviconResponse(request) {
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';
  const headers = {
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=86400, immutable',
    'X-Content-Type-Options': 'nosniff'
  };
  if (request.method === 'HEAD') return new Response(null, { status: 200, headers });
  const bytes = Uint8Array.from(atob(pngBase64), (char) => char.charCodeAt(0));
  return new Response(bytes, { status: 200, headers });
}

function stripBodyEncodingHeaders(response) {
  const headers = new Headers(response.headers);
  headers.delete('Content-Encoding');
  headers.delete('Content-Length');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function crossOriginMutationError(request) {
  const method = String(request && request.method || 'GET').toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return '';
  const fetchSite = String(request.headers.get('Sec-Fetch-Site') || '').toLowerCase();
  if (fetchSite === 'cross-site') return 'cross_origin_forbidden';
  const origin = request.headers.get('Origin');
  if (!origin) {
    const referer = request.headers.get('Referer');
    if (!referer) return '';
    try {
      return new URL(referer).origin === new URL(request.url).origin ? '' : 'cross_origin_forbidden';
    } catch (_) {
      return 'cross_origin_forbidden';
    }
  }
  try {
    return new URL(origin).origin === new URL(request.url).origin ? '' : 'cross_origin_forbidden';
  } catch (_) {
    return 'cross_origin_forbidden';
  }
}

function isEntryPath(pathname) {
  return pathname === '/' || pathname === '/index-complete' || pathname === '/index-complete.html';
}

function isProtectedDataJsonPath(pathname) {
  return PROTECTED_DATA_JSON_PATHS.has(normalizePathname(pathname).toLowerCase());
}

function isBlocked181103RawBinaryPath(pathname) {
  const normalized = normalizePathname(pathname).toLowerCase();
  return normalized.startsWith(PUBLIC_181103_HTML_PREFIX) && BLOCKED_181103_RAW_BINARY_PATTERN.test(normalized);
}

function isPublic181103ViewAssetPath(pathname) {
  const normalized = normalizePathname(pathname).toLowerCase();
  if (PUBLIC_181103_QUESTION_BANK_PATHS.has(normalized)) return true;
  if (normalized !== PUBLIC_181103_HTML_ROOT && !normalized.startsWith(PUBLIC_181103_HTML_PREFIX)) return false;
  if (isBlocked181103RawBinaryPath(normalized)) return false;
  const leaf = normalized.split('/').pop() || '';
  if (!leaf.includes('.')) return true;
  return PUBLIC_181103_VIEW_ASSET_PATTERN.test(normalized);
}

function public181103AssetPathOverride(pathname) {
  const normalized = normalizePathname(pathname).toLowerCase();
  if (!isPublic181103ViewAssetPath(normalized)) return '';
  if (normalized === PUBLIC_181103_HTML_ROOT) return `${PUBLIC_181103_HTML_ROOT}/index.html`;
  const leaf = normalized.split('/').pop() || '';
  return leaf && !leaf.includes('.') && normalized.startsWith(PUBLIC_181103_HTML_PREFIX)
    ? `${normalized}/index.html`
    : '';
}

function fullEntryTarget(url) {
  const target = new URL(url.toString());
  target.pathname = '/index-complete';
  target.searchParams.set('full', '1');
  return `${target.pathname}${target.search}${target.hash}`;
}

function cacheControlForAsset(pathname, contentType) {
  const lower = normalizePathname(pathname).toLowerCase();

  if (isPublic181103ViewAssetPath(lower)) {
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp') || lower.endsWith('.gif') || lower.endsWith('.svg')) {
      return 'public, max-age=300, stale-while-revalidate=1800';
    }
    return 'no-store, no-cache, must-revalidate, max-age=0';
  }

  if (contentType.includes('text/html')) {
    return 'private, max-age=120, stale-while-revalidate=300';
  }

  if (lower === '/manifest.json') {
    return 'public, max-age=3600, stale-while-revalidate=86400';
  }

  if (lower.startsWith('/question-banks/')) {
    return 'private, max-age=21600, stale-while-revalidate=86400';
  }

  if (lower.endsWith('.json') || lower.startsWith('/resources/') || lower.startsWith('/data/')) {
    return 'private, max-age=300, stale-while-revalidate=1800';
  }

  if (/\.(?:js|css)$/i.test(lower)) {
    return 'no-cache, must-revalidate';
  }

  if (/\.(?:png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|eot|pdf|mp4)$/i.test(lower)) {
    return 'public, max-age=2592000, stale-while-revalidate=2592000';
  }

  return 'private, max-age=300, stale-while-revalidate=1800';
}

function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;

  header.split(';').forEach((part) => {
    const index = part.indexOf('=');
    if (index < 0) return;
    const name = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (name) cookies[name] = value;
  });

  return cookies;
}

async function signPayload(payload, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function readSession(request, env) {
  const secret = env.AUTH_COOKIE_SECRET;
  if (!secret) return null;

  const cookie = parseCookies(request.headers.get('Cookie'))[COOKIE_NAME];
  if (!cookie || !cookie.includes('.')) return null;

  const [payload, signature] = cookie.split('.', 2);
  const expected = await signPayload(payload, secret);
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const data = JSON.parse(base64UrlToText(payload));
    if (!data || !data.u || !data.exp) return null;
    if (Math.floor(Date.now() / 1000) >= data.exp) return null;
    const username = normalizeUsername(data.u);
    if (!username) return null;
    const passwordSessionVersion = truncate(data.pwv || '', 80);
    const accountState = await readUserAccountAuthState(env, username);
    const staticSessionVersion = await staticAccountSessionVersion(env, username);
    const hasValidStaticSession = !!(staticSessionVersion && passwordSessionVersion &&
      timingSafeEqual(passwordSessionVersion, staticSessionVersion));
    if (!accountState.ok) {
      if (!hasValidStaticSession) return null;
      return {
        username,
        exp: data.exp,
        iat: Number(data.iat || 0),
        passwordSessionVersion,
        deviceId: normalizeDeviceId(data.did),
        deviceLabel: truncate(data.dl || '', 120),
        browserSessionId: truncate(data.bsid || '', 120),
        sessionNonce: truncate(data.sn || '', 80)
      };
    }
    const account = accountState.account;
    if (account && account.disabled) return null;
    if (!account || !account.password) {
      if (!hasValidStaticSession) return null;
      return {
        username,
        exp: data.exp,
        iat: Number(data.iat || 0),
        passwordSessionVersion,
        deviceId: normalizeDeviceId(data.did),
        deviceLabel: truncate(data.dl || '', 120),
        browserSessionId: truncate(data.bsid || '', 120),
        sessionNonce: truncate(data.sn || '', 80)
      };
    }
    const accountPasswordVersion = accountPasswordSessionVersion(account);
    if (!passwordSessionVersion || !accountPasswordVersion) return null;
    if (!timingSafeEqual(passwordSessionVersion, accountPasswordVersion)) return null;
    return {
      username,
      exp: data.exp,
      iat: Number(data.iat || 0),
      passwordSessionVersion,
      deviceId: normalizeDeviceId(data.did),
      deviceLabel: truncate(data.dl || '', 120),
      browserSessionId: truncate(data.bsid || '', 120),
      sessionNonce: truncate(data.sn || '', 80)
    };
  } catch (_) {
    return null;
  }
}

function setSessionHeader(cookie) {
  return `${COOKIE_NAME}=${cookie}; Max-Age=${SESSION_TTL_SECONDS}; Path=/; Secure; HttpOnly; SameSite=Lax`;
}

function clearSessionHeader() {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax`;
}

function deviceBindingKey(username) {
  const normalized = normalizeUsername(username);
  return normalized ? `device-binding:${normalized}` : '';
}

function normalizeStoredDeviceBinding(binding) {
  if (!binding || typeof binding !== 'object') return null;
  const username = normalizeUsername(binding.username);
  const deviceId = normalizeDeviceId(binding.deviceId);
  if (!username || !deviceId) return null;
  return {
    username,
    policyType: String(binding.policyType || '').slice(0, 48),
    deviceId,
    shortDeviceId: shortDeviceId(deviceId),
    label: truncate(binding.label || '', 120),
    browser: truncate(binding.browser || '', 60),
    os: truncate(binding.os || '', 60),
    platform: truncate(binding.platform || '', 80),
    deviceClass: truncate(binding.deviceClass || '', 32),
    isIpad: Boolean(binding.isIpad),
    boundAt: truncate(binding.boundAt || '', 40),
    createdAt: truncate(binding.createdAt || '', 40),
    lastSeenAt: truncate(binding.lastSeenAt || '', 40),
    lastVerifiedAt: truncate(binding.lastVerifiedAt || '', 40),
    lastIp: truncate(binding.lastIp || '', 80),
    lastIpSource: truncate(binding.lastIpSource || '', 40),
    lastIpVerified: Boolean(binding.lastIpVerified),
    firstIp: truncate(binding.firstIp || '', 80),
    firstIpSource: truncate(binding.firstIpSource || '', 40),
    firstIpVerified: Boolean(binding.firstIpVerified),
    lastBrowserSessionId: truncate(binding.lastBrowserSessionId || '', 120),
    firstBrowserSessionId: truncate(binding.firstBrowserSessionId || '', 120),
    sessionNonce: truncate(binding.sessionNonce || '', 80),
    lastUserAgent: truncate(binding.lastUserAgent || '', 240),
    mismatchCount: Number(binding.mismatchCount || 0),
    lastMismatchAt: truncate(binding.lastMismatchAt || '', 40),
    lastMismatchIp: truncate(binding.lastMismatchIp || '', 80),
    lastMismatchIpSource: truncate(binding.lastMismatchIpSource || '', 40),
    lastMismatchIpVerified: Boolean(binding.lastMismatchIpVerified),
    lastMismatchDeviceId: normalizeDeviceId(binding.lastMismatchDeviceId),
    lastMismatchShortId: shortDeviceId(binding.lastMismatchDeviceId || ''),
    lastMismatchLabel: truncate(binding.lastMismatchLabel || '', 120),
    lastMismatchBrowserSessionId: truncate(binding.lastMismatchBrowserSessionId || '', 120),
    lastSource: truncate(binding.lastSource || '', 60),
    updatedAt: truncate(binding.updatedAt || '', 40),
    updatedBy: truncate(binding.updatedBy || '', 80),
    note: truncate(binding.note || '', 160)
  };
}

async function readDeviceBinding(env, username) {
  const key = deviceBindingKey(username);
  if (!env.FM_AUDIT || !key) return null;
  const binding = await readJsonKv(env.FM_AUDIT, key, null);
  return normalizeStoredDeviceBinding(binding);
}

async function writeDeviceBinding(env, username, binding) {
  const key = deviceBindingKey(username);
  const normalized = normalizeStoredDeviceBinding({ ...binding, username });
  if (!env.FM_AUDIT || !key || !normalized) return false;
  try {
    await env.FM_AUDIT.put(key, JSON.stringify(normalized));
    return true;
  } catch (_) {
    return false;
  }
}

function buildDeviceIdentity(request, data = {}) {
  const device = parseClientDevice(request, data);
  return {
    deviceId: device.deviceId || '',
    shortDeviceId: shortDeviceId(device.deviceId || ''),
    label: deviceSummaryLabel(device),
    browser: device.browser || '',
    os: device.os || '',
    platform: device.platform || '',
    deviceClass: device.deviceClass || '',
    browserSessionId: device.browserSessionId || '',
    isIpad: Boolean(device.isIpad),
    device
  };
}

async function createSessionCookie(username, env, options = {}) {
  const now = Math.floor(Date.now() / 1000);
  const deviceId = normalizeDeviceId(options.deviceId);
  const passwordSessionVersion = truncate(options.passwordSessionVersion || '', 80);
  const payloadData = {
    u: normalizeUsername(username),
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  };
  if (passwordSessionVersion) payloadData.pwv = passwordSessionVersion;
  if (deviceId) payloadData.did = deviceId;
  if (options.deviceLabel) payloadData.dl = truncate(options.deviceLabel, 120);
  if (options.browserSessionId) payloadData.bsid = truncate(options.browserSessionId, 120);
  if (options.sessionNonce) payloadData.sn = truncate(options.sessionNonce, 80);
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify(payloadData)));
  const signature = await signPayload(payload, env.AUTH_COOKIE_SECRET);
  return `${payload}.${signature}`;
}

async function rememberVerifiedDeviceBinding(context, username, binding, deviceIdentity, source) {
  if (!binding || !binding.deviceId) return binding;
  const ipInfo = clientIpInfo(context.request);
  const next = {
    ...binding,
    username: normalizeUsername(username),
    lastSeenAt: new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    lastIp: ipInfo.ip,
    lastIpSource: ipInfo.source,
    lastIpVerified: ipInfo.verified,
    lastBrowserSessionId: deviceIdentity.browserSessionId || binding.lastBrowserSessionId || '',
    lastUserAgent: truncate(context.request.headers.get('User-Agent'), 240),
    lastSource: source || binding.lastSource || '',
    label: binding.label || deviceIdentity.label || ''
  };
  await writeDeviceBinding(context.env, username, next);
  return next;
}

function withBindingSessionNonce(binding, updatedBy = '') {
  if (!binding || typeof binding !== 'object') return binding;
  return {
    ...binding,
    sessionNonce: binding.sessionNonce || randomBase64Url(12),
    updatedAt: new Date().toISOString(),
    updatedBy: truncate(updatedBy || '', 80)
  };
}

async function enforceDevicePolicyForLogin(context, username, data = {}, source = 'login') {
  const normalized = normalizeUsername(username);
  const policy = singleDevicePolicy(normalized, context.env);
  const deviceIdentity = buildDeviceIdentity(context.request, data);

  if (!policy.enforced) {
    return { ok: true, policy, deviceIdentity, binding: null };
  }

  if (!deviceIdentity.deviceId) {
    queueAudit(context, 'device_identity_missing', {
      username: normalized,
      source,
      browserSessionId: deviceIdentity.browserSessionId || '',
      deviceProfile: data.deviceProfile || null
    }, { username: normalized });
    return {
      ok: false,
      error: 'device_identity_missing',
      message: '当前浏览器没有拿到唯一设备标识，请直接用系统浏览器重试。',
      policy,
      deviceIdentity
    };
  }

  let binding = await readDeviceBinding(context.env, normalized);
  if (!binding) {
    if (policy.requireIpad && !deviceIdentity.isIpad) {
      queueAudit(context, 'restricted_account_denied', {
        username: normalized,
        source,
        reason: 'ipad_required',
        attemptedDeviceId: deviceIdentity.deviceId,
        attemptedDeviceShortId: deviceIdentity.shortDeviceId,
        attemptedLabel: deviceIdentity.label,
        browserSessionId: deviceIdentity.browserSessionId || '',
        deviceProfile: data.deviceProfile || null
      }, { username: normalized });
      return {
        ok: false,
        error: 'ipad_required',
        message: 'qi 账号现在只允许绑定 iPad 端，请回 iPad 登录。',
        policy,
        deviceIdentity
      };
    }

    const nowIso = new Date().toISOString();
    const ipInfo = clientIpInfo(context.request);
    binding = {
      username: normalized,
      policyType: policy.type,
      deviceId: deviceIdentity.deviceId,
      label: deviceIdentity.label,
      browser: deviceIdentity.browser,
      os: deviceIdentity.os,
      platform: deviceIdentity.platform,
      deviceClass: deviceIdentity.deviceClass,
      isIpad: deviceIdentity.isIpad,
      boundAt: nowIso,
      createdAt: nowIso,
      lastSeenAt: nowIso,
      lastVerifiedAt: nowIso,
      firstIp: ipInfo.ip,
      firstIpSource: ipInfo.source,
      firstIpVerified: ipInfo.verified,
      lastIp: ipInfo.ip,
      lastIpSource: ipInfo.source,
      lastIpVerified: ipInfo.verified,
      firstBrowserSessionId: deviceIdentity.browserSessionId || '',
      lastBrowserSessionId: deviceIdentity.browserSessionId || '',
      sessionNonce: randomBase64Url(12),
      lastUserAgent: truncate(context.request.headers.get('User-Agent'), 240),
      mismatchCount: 0,
      updatedAt: nowIso,
      updatedBy: source,
      lastSource: source,
      note: policy.requireIpad ? 'qi single ipad binding' : 'single device binding'
    };
    const wrote = await writeDeviceBinding(context.env, normalized, binding);
    if (!wrote) {
      return {
        ok: false,
        error: 'device_bind_write_failed',
        message: '设备绑定写入失败，请直接再试一次。',
        policy,
        deviceIdentity
      };
    }
    queueAudit(context, 'device_bind_created', {
      username: normalized,
      source,
      policyType: policy.type,
      deviceId: binding.deviceId,
      deviceShortId: shortDeviceId(binding.deviceId),
      deviceLabel: binding.label,
      browserSessionId: binding.lastBrowserSessionId || '',
      deviceProfile: data.deviceProfile || null
    }, { username: normalized });
    return { ok: true, policy, deviceIdentity, binding };
  }

  if (!binding.sessionNonce) {
    binding = withBindingSessionNonce(binding, source);
    await writeDeviceBinding(context.env, normalized, binding);
  }

  if (binding.deviceId !== deviceIdentity.deviceId) {
    const ipInfo = clientIpInfo(context.request);
    const nextBinding = {
      ...binding,
      mismatchCount: Number(binding.mismatchCount || 0) + 1,
      lastMismatchAt: new Date().toISOString(),
      lastMismatchIp: ipInfo.ip,
      lastMismatchIpSource: ipInfo.source,
      lastMismatchIpVerified: ipInfo.verified,
      lastMismatchDeviceId: deviceIdentity.deviceId,
      lastMismatchLabel: deviceIdentity.label,
      lastMismatchBrowserSessionId: deviceIdentity.browserSessionId || '',
      lastSource: source
    };
    await writeDeviceBinding(context.env, normalized, nextBinding);
    queueAudit(context, 'device_bind_mismatch', {
      username: normalized,
      source,
      policyType: policy.type,
      boundDeviceId: binding.deviceId,
      boundDeviceShortId: shortDeviceId(binding.deviceId),
      boundLabel: binding.label,
      attemptedDeviceId: deviceIdentity.deviceId,
      attemptedDeviceShortId: deviceIdentity.shortDeviceId,
      attemptedLabel: deviceIdentity.label,
      browserSessionId: deviceIdentity.browserSessionId || '',
      deviceProfile: data.deviceProfile || null
    }, { username: normalized });
    return {
      ok: false,
      error: 'device_bound_elsewhere',
      message: policy.requireIpad
        ? 'qi 账号已经绑定唯一 iPad 设备，当前设备不能登录。'
        : '这个账号已经绑定唯一设备，当前设备不能登录。',
      policy,
      deviceIdentity,
      binding: nextBinding
    };
  }

  const verifiedBinding = await rememberVerifiedDeviceBinding(context, normalized, binding, deviceIdentity, source);
  return { ok: true, policy, deviceIdentity, binding: verifiedBinding };
}

async function enforceSessionDevicePolicy(context, session, source = 'request') {
  if (!session || !session.username) return { ok: false, error: 'authentication_required', message: '请先登录。' };
  const normalized = normalizeUsername(session.username);
  const policy = singleDevicePolicy(normalized, context.env);
  if (!policy.enforced) {
    return { ok: true, policy, binding: null };
  }
  if (!session.deviceId) {
    queueAudit(context, 'device_session_missing', { username: normalized, source }, session);
    return {
      ok: false,
      error: 'device_session_missing',
      message: '当前登录不带设备标识，请在原设备重新登录。',
      policy
    };
  }
  const binding = await readDeviceBinding(context.env, normalized);
  if (!binding) {
    queueAudit(context, 'device_binding_missing', {
      username: normalized,
      source,
      sessionDeviceId: session.deviceId,
      sessionDeviceShortId: shortDeviceId(session.deviceId)
    }, session);
    return {
      ok: false,
      error: 'device_binding_missing',
      message: '当前账号的设备绑定缺失，请重新登录。',
      policy
    };
  }
  if (binding.deviceId !== session.deviceId) {
    queueAudit(context, 'concurrent_device_denied', {
      username: normalized,
      source,
      sessionDeviceId: session.deviceId,
      sessionDeviceShortId: shortDeviceId(session.deviceId),
      boundDeviceId: binding.deviceId,
      boundDeviceShortId: shortDeviceId(binding.deviceId),
      boundLabel: binding.label
    }, session);
    return {
      ok: false,
      error: 'device_binding_mismatch',
      message: '这个账号已经在别的设备上绑定，请回原设备登录。',
      policy,
      binding
    };
  }
  if (binding.sessionNonce && session.sessionNonce !== binding.sessionNonce) {
    queueAudit(context, 'device_session_revoked', {
      username: normalized,
      source,
      sessionDeviceId: session.deviceId,
      sessionDeviceShortId: shortDeviceId(session.deviceId),
      boundDeviceId: binding.deviceId,
      boundDeviceShortId: shortDeviceId(binding.deviceId)
    }, session);
    return {
      ok: false,
      error: 'device_session_revoked',
      message: '这个账号的设备绑定已更新，请重新登录。',
      policy,
      binding
    };
  }
  const refreshedBinding = await rememberVerifiedDeviceBinding(context, normalized, binding, {
    browserSessionId: session.browserSessionId || '',
    label: session.deviceLabel || binding.label || ''
  }, source);
  return { ok: true, policy, binding: refreshedBinding };
}

function loginPageResponse(next, message = '', init = {}) {
  const { omitBody, ...responseInit } = init || {};
  const response = htmlResponse(omitBody ? null : renderLogin(next, message), {
    ...responseInit,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, no-transform',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Vary': 'Cookie',
      'Server-Timing': 'edge;desc="login-form"',
      'Timing-Allow-Origin': '*',
      'X-Fluid-Login-Response': omitBody ? 'head' : 'page',
      'X-Fluid-Entry-Version': EDGE_HOME_VERSION,
      ...(responseInit.headers || {})
    }
  });
  return stripBodyEncodingHeaders(response);
}

function fastLoginPageResponse(next, message = '', init = {}) {
  const { omitBody, ...responseInit } = init || {};
  const response = htmlResponse(omitBody ? null : renderFastLogin(next, message), {
    ...responseInit,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, no-transform',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Vary': 'Cookie',
      'Server-Timing': 'edge;desc="fast-login"',
      'Timing-Allow-Origin': '*',
      'X-Fluid-Login-Response': omitBody ? 'fast-head' : 'fast-page',
      'X-Fluid-Entry-Version': EDGE_HOME_VERSION,
      ...(responseInit.headers || {})
    }
  });
  return stripBodyEncodingHeaders(response);
}

function edgeSessionBridgeResponse(session, env, next, init = {}) {
  const response = htmlResponse(renderEdgeSessionBridge(session, env, next), {
    ...init,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, no-transform',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Vary': 'Cookie',
      'Server-Timing': 'edge;desc="login-bridge"',
      'Timing-Allow-Origin': '*',
      'X-Fluid-Login-Response': 'bridge',
      'X-Fluid-Entry-Version': EDGE_HOME_VERSION,
      ...(init.headers || {})
    }
  });
  return stripBodyEncodingHeaders(response);
}

function fastHomeResponse(session, env, init = {}) {
  return htmlResponse(renderFastHome(session, env), {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      'Link': '</question-banks/real-exams-index.json>; rel=prefetch; as=fetch, </data/fluid-simulated-exam-packs.json>; rel=prefetch; as=fetch',
      'Server-Timing': 'edge;desc="fast-home"',
      'Timing-Allow-Origin': '*',
      'Vary': 'Cookie',
      ...(init.headers || {})
    }
  });
}

function canonicalRoutePath(pathname) {
  const normalized = normalizePathname(pathname).replace(/\/+$/, '') || '/';
  const lower = normalized.toLowerCase();
  const textbookTarget = textbookReadingRoutePath(lower);
  if (textbookTarget) return textbookTarget;
  if (lower === '/teacher-panel' || lower === '/teacher-panel.html') return '/teacher-panel';
  if (lower === '/modules/teacher-panel' || lower === '/modules/teacher-panel.html') return '/teacher-panel';
  if (lower === '/knowledge' || lower === '/knowledge.html' || lower === '/modules/knowledge-detail' || lower === '/modules/knowledge-detail.html') return '/modules/knowledge-detail';
  if (lower === '/question-bank-home' || lower === '/question-bank-home.html') return '/question-bank-home.html';
  if (lower === '/question-bank' || lower === '/question-bank.html' || lower === '/modules/question-bank' || lower === '/modules/question-bank.html') return '/modules/question-bank';
  if (lower === '/practice-dynamic' || lower === '/practice-dynamic.html' || lower === '/modules/practice-dynamic' || lower === '/modules/practice-dynamic.html') return '/modules/practice-dynamic.html';
  if (lower === '/modules/real-exams-dynamic' || lower === '/modules/real-exams-dynamic.html' || lower === '/real-exams' || lower === '/real-exams.html') return '/modules/real-exams-dynamic';
  if (lower === '/modules/simulated-exams-dynamic' || lower === '/modules/simulated-exams-dynamic.html' || lower === '/simulated-exams' || lower === '/simulated-exams.html') return '/modules/simulated-exams-dynamic';
  if (lower === '/resources' || lower === '/resources.html') return '/resources';
  if (lower.startsWith('/modules/') || lower.startsWith('/resources/')) {
    const last = lower.split('/').pop() || '';
    if (last && !last.includes('.')) return normalized;
    if (last && last.endsWith('.html')) return normalized.slice(0, -5);
  }
  return null;
}

function routeAssetPath(pathname) {
  const normalized = normalizePathname(pathname).replace(/\/+$/, '') || '/';
  const lower = normalized.toLowerCase();
  if (lower === '/' || lower === '/index-complete' || lower === '/index-complete.html') return '/index-complete.html';
  const textbookTarget = textbookReadingRoutePath(lower);
  if (textbookTarget && textbookTarget !== normalized) return textbookTarget;
  if (lower === '/knowledge' || lower === '/knowledge.html') return '/modules/knowledge-detail';
  if (lower === '/question-bank-home' || lower === '/question-bank-home.html') return '/question-bank-home.html';
  if (lower === '/question-bank' || lower === '/question-bank.html') return '/modules/question-bank.html';
  if (lower === '/practice-dynamic' || lower === '/practice-dynamic.html' || lower === '/modules/practice-dynamic' || lower === '/modules/practice-dynamic.html') return '/modules/practice-dynamic.html';
  return null;
}

function textbookReadingRoutePath(lowerPathname) {
  const lower = String(lowerPathname || '').toLowerCase();
  if (
    lower === '/modules/wu-wangyi-fluid-reading' ||
    lower === '/modules/wu-wangyi-fluid-reading.html' ||
    lower === '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt' ||
    lower === WU_WANGYI_READING_PATH
  ) {
    return WU_WANGYI_READING_PATH.replace(/\.html$/i, '');
  }
  if (
    lower === '/modules/wang-hongwei-fluid-reading' ||
    lower === '/modules/wang-hongwei-fluid-reading.html' ||
    lower === '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt' ||
    lower === WANG_HONGWEI_READING_PATH
  ) {
    return WANG_HONGWEI_READING_PATH.replace(/\.html$/i, '');
  }
  return null;
}

function canonicalRedirectPath(pathname) {
  const normalized = normalizePathname(pathname).replace(/\/+$/, '') || '/';
  const lower = normalized.toLowerCase();
  if (lower === '/practice-dynamic' || lower === '/practice-dynamic.html' || lower === '/modules/practice-dynamic' || lower === '/modules/practice-dynamic.html') return null;
  const canonical = canonicalRoutePath(normalized);
  if (!canonical || canonical === normalized) return null;
  return canonical;
}

function preserveHtmlNextPath(pathname) {
  const normalized = normalizePathname(pathname);
  const lower = normalized.toLowerCase().replace(/\/+$/, '') || '/';
  if (
    lower === '/modules/question-bank.html' ||
    lower === '/modules/practice-dynamic.html' ||
    lower === '/modules/real-exams-dynamic.html' ||
    lower === '/modules/simulated-exams-dynamic.html'
  ) {
    return normalized;
  }
  return null;
}

function isSafeNextHost(hostname) {
  const lower = String(hostname || '').toLowerCase();
  return SAFE_NEXT_HOSTS.has(lower) || lower.endsWith('.lghui-fluid-learning.pages.dev');
}

function isLoginShellTarget(pathname, searchParams) {
  const lower = normalizePathname(pathname).toLowerCase();
  return (
    lower === '/_edge-login' ||
    lower === '/_edge-fast-login' ||
    lower === '/_edge-register' ||
    lower === '/_edge-forgot-password' ||
    ((lower === '/index-complete' || lower === '/index-complete.html' || lower === '/') && searchParams && searchParams.has('auth'))
  );
}

function canonicalInternalTarget(value, depth = 0) {
  if (depth > 2) return DEFAULT_ENTRY;
  try {
    const raw = String(value || '').trim();
    const parsed = new URL(raw, 'https://fluid.local');
    const isSyntheticRelative = parsed.origin === 'https://fluid.local';
    if (!isSyntheticRelative && !isSafeNextHost(parsed.hostname)) return DEFAULT_ENTRY;
    if (isLoginShellTarget(parsed.pathname, parsed.searchParams)) {
      const nested = parsed.searchParams.get('next');
      return nested ? canonicalInternalTarget(nested, depth + 1) : DEFAULT_ENTRY;
    }
    parsed.pathname = preserveHtmlNextPath(parsed.pathname) || canonicalRoutePath(parsed.pathname) || normalizePathname(parsed.pathname);
    if (parsed.searchParams.has('edge_refresh') && parsed.searchParams.get('edge_refresh') !== EDGE_HOME_VERSION) {
      parsed.searchParams.set('edge_refresh', EDGE_HOME_VERSION);
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch (_) {
    return DEFAULT_ENTRY;
  }
}

function safeNext(value) {
  if (!value || typeof value !== 'string') return DEFAULT_ENTRY;
  const raw = value.trim();
  if (/[\u0000-\u001f\u007f\\]/.test(raw)) return DEFAULT_ENTRY;
  if (raw.startsWith('//')) return DEFAULT_ENTRY;
  const isAbsoluteHttp = /^https?:\/\//i.test(raw);
  if (!isAbsoluteHttp && (!raw.startsWith('/') || /^[a-z][a-z0-9+.-]*:/i.test(raw))) return DEFAULT_ENTRY;
  const canonical = canonicalInternalTarget(raw);
  if (canonical === '/') return DEFAULT_ENTRY;
  const pathname = normalizePathname(new URL(canonical, 'https://fluid.local').pathname).toLowerCase();
  if (pathname === '/_edge-login' || pathname.startsWith('/_edge-login/')) return DEFAULT_ENTRY;
  if (pathname === '/_edge-fast-login' || pathname.startsWith('/_edge-fast-login/')) return DEFAULT_ENTRY;
  if (pathname === '/_edge-register' || pathname.startsWith('/_edge-register/')) return DEFAULT_ENTRY;
  if (pathname === '/_edge-forgot-password' || pathname.startsWith('/_edge-forgot-password/')) return DEFAULT_ENTRY;
  if (pathname === '/_edge-logout' || pathname.startsWith('/_edge-logout/')) return DEFAULT_ENTRY;
  if (pathname === '/_edge-reset' || pathname.startsWith('/_edge-reset/')) return DEFAULT_ENTRY;
  if (pathname.startsWith('/api/auth/')) return DEFAULT_ENTRY;
  return canonical;
}

function publicTargetPathForNext(pathname) {
  const normalized = normalizePathname(pathname).replace(/\/+$/, '') || '/';
  const lower = normalized.toLowerCase();
  if (lower === '/modules/question-bank') return '/modules/question-bank.html';
  if (lower === '/modules/practice-dynamic') return '/modules/practice-dynamic.html';
  if (lower === '/modules/real-exams-dynamic') return '/modules/real-exams-dynamic.html';
  if (lower === '/modules/simulated-exams-dynamic') return '/modules/simulated-exams-dynamic.html';
  return normalized;
}

function publicTargetHrefForNext(next) {
  const target = new URL(safeNext(next), 'https://lghui-fluid-learning.pages.dev');
  target.pathname = publicTargetPathForNext(target.pathname);
  target.searchParams.set('edge_refresh', EDGE_HOME_VERSION);
  return target.href;
}

function wantsHtml(request) {
  const pathname = new URL(request.url).pathname;
  const accept = request.headers.get('Accept') || '';
  const destination = request.headers.get('Sec-Fetch-Dest') || '';
  return (
    accept.includes('text/html') ||
    destination === 'document' ||
    pathname === '/' ||
    pathname.endsWith('.html') ||
    (!pathname.split('/').pop().includes('.') && !pathname.startsWith('/api/'))
  );
}

function normalizePathname(pathname) {
  let value = String(pathname || '/');
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch (_) {
      break;
    }
  }
  value = value.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
  if (!value.startsWith('/')) value = `/${value}`;
  const segments = [];
  value.split('/').forEach((segment) => {
    if (!segment || segment === '.') return;
    if (segment === '..') {
      segments.pop();
      return;
    }
    segments.push(segment);
  });
  return `/${segments.join('/')}`;
}

function isSensitiveLegacyPath(pathname) {
  const normalized = normalizePathname(pathname);
  const lower = normalized.toLowerCase();
  const compressedBase = lower.replace(COMPRESSED_STATIC_SUFFIX_PATTERN, '');
  const candidates = compressedBase === lower ? [lower] : [lower, compressedBase];
  return candidates.some((candidate) => {
    if (candidate === '/api' || candidate.startsWith('/api/')) return false;
    if (candidate === '/_edge-forgot-password') return false;
    if (candidate.split('/').some((segment) => segment.startsWith('._') || segment.startsWith('.__'))) return true;
    if (SENSITIVE_EXACT_PATHS.has(candidate)) return true;
    if (SENSITIVE_PREFIXES.some((prefix) => candidate === prefix.replace(/\/$/, '') || candidate.startsWith(prefix))) return true;
    if (SENSITIVE_SECRET_PATH_PATTERN.test(candidate)) return true;
    if (LEGACY_FLUID_PATTERN.test(candidate)) return true;
    return SENSITIVE_HTML_PATTERN.test(candidate);
  });
}

function isProtectedSourceDownload(pathname) {
  const lower = normalizePathname(pathname).toLowerCase();
  return PROTECTED_SOURCE_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

function protectedSourceAuditData(request, url, target) {
  const pathname = normalizePathname(url && url.pathname || '');
  const filename = pathname.split('/').pop() || '';
  const extensionMatch = filename.match(/\.([a-z0-9]{1,12})$/i);
  return {
    target,
    method: String(request && request.method || '').toUpperCase(),
    path: truncate(pathname, 180),
    extension: extensionMatch ? extensionMatch[1].toLowerCase() : '',
    hasRange: !!(request && request.headers.get('Range'))
  };
}

function shouldAuditResource(pathname) {
  const lower = normalizePathname(pathname).toLowerCase();
  return (
    lower.startsWith('/question-banks/') ||
    lower.startsWith('/resources/') ||
    lower.startsWith('/data/') ||
    lower.startsWith('/modules/') ||
    lower.startsWith('/videos/') ||
    lower.endsWith('.json') ||
    lower.endsWith('.pdf') ||
    lower.endsWith('.docx') ||
    lower.endsWith('.pptx') ||
    lower.endsWith('.mp4')
  );
}

function routeAliasPath(pathname) {
  return routeAssetPath(pathname);
}

function publicRuntimeAssetAliasPath(pathname) {
  return PUBLIC_RUNTIME_ASSET_ALIASES.get(normalizePathname(pathname).toLowerCase()) || '';
}

function notFoundResponse(request) {
  if (wantsHtml(request)) {
    return htmlResponse(`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>页面不可用</title>
  <style>
    :root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f6f8fb;color:#12202f}
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px}
    main{width:min(520px,100%);background:#fff;border:1px solid #dce6ef;border-radius:10px;padding:28px;box-shadow:0 18px 60px rgba(18,32,47,.12)}
    h1{margin:0 0 10px;font-size:26px}p{line-height:1.7;color:#50636b}
    a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 14px;border-radius:8px;background:#0f766e;color:#fff;text-decoration:none;font-weight:800}
  </style>
</head>
<body><main><h1>页面不可用</h1><p>这个旧入口或敏感资源已被安全策略关闭。</p><a href="/index-complete?full=1">返回学习平台</a></main></body>
</html>`, { status: 404 });
  }
  return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
}

function normalizeIpAddress(value) {
  let raw = String(value || '').trim();
  if (!raw) return '';
  raw = raw.split(',')[0].trim().replace(/^"|"$/g, '');
  const bracketed = raw.match(/^\[([0-9a-f:.%]+)\](?::\d+)?$/i);
  if (bracketed) raw = bracketed[1];
  const ipv4WithPort = raw.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d{1,5})$/);
  if (ipv4WithPort) raw = ipv4WithPort[1];
  const ipv4 = raw.match(/^(\d{1,3})(?:\.(\d{1,3})){3}$/);
  if (ipv4) {
    const parts = raw.split('.').map((part) => Number(part));
    return parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255) ? raw : '';
  }
  const zoneIndex = raw.indexOf('%');
  if (zoneIndex > -1) raw = raw.slice(0, zoneIndex);
  if (raw.includes(':') && /^[0-9a-f:.]+$/i.test(raw) && raw.length <= 80) return raw.toLowerCase();
  return '';
}

function clientIpInfo(request) {
  const forwardedIp = normalizeIpAddress(request.headers.get('X-Forwarded-For'));
  const cfIp = normalizeIpAddress(request.headers.get('CF-Connecting-IP'));
  if (cfIp) {
    return { ip: cfIp, source: 'cf-connecting-ip', confidence: 'high', verified: true, forwardedIp };
  }
  const trueClientIp = normalizeIpAddress(request.headers.get('True-Client-IP'));
  if (trueClientIp) {
    return { ip: trueClientIp, source: 'true-client-ip', confidence: 'high', verified: true, forwardedIp };
  }
  return {
    ip: '',
    source: forwardedIp ? 'x-forwarded-for-unverified' : 'missing',
    confidence: forwardedIp ? 'unverified' : 'missing',
    verified: false,
    forwardedIp
  };
}

function clientIp(request) {
  return clientIpInfo(request).ip;
}

function auditIpInfoFromEvent(event = {}) {
  const source = String(event.ipSource || '').trim();
  const ip = normalizeIpAddress(event.ip || '');
  const verified = Boolean(event.ipVerified === true || source === 'cf-connecting-ip' || source === 'true-client-ip');
  const forwardedIp = normalizeIpAddress(event.forwardedIp || '');
  return {
    ip: verified ? ip : '',
    unverifiedIp: verified ? '' : ip,
    source: source || (ip ? 'legacy-unverified' : ''),
    confidence: event.ipConfidence || (verified ? 'high' : (ip || forwardedIp ? 'unverified' : 'missing')),
    verified,
    forwardedIp
  };
}

function parseClientDevice(request, data = {}) {
  const profile = data && data.deviceProfile && typeof data.deviceProfile === 'object' ? data.deviceProfile : {};
  const ua = String(request.headers.get('User-Agent') || profile.userAgent || '');
  const platformHint = String(request.headers.get('Sec-CH-UA-Platform') || (profile.uaData && profile.uaData.platform) || profile.platform || '').replace(/^"|"$/g, '');
  const mobileHint = request.headers.get('Sec-CH-UA-Mobile') === '?1' || Boolean(profile.uaData && profile.uaData.mobile);
  const browser = /Edg\//.test(ua) ? 'Edge'
    : /OPR\//.test(ua) ? 'Opera'
      : /Chrome\//.test(ua) || /CriOS\//.test(ua) ? 'Chrome'
        : /Firefox\//.test(ua) ? 'Firefox'
          : /Safari\//.test(ua) && /Version\//.test(ua) ? 'Safari'
            : /MicroMessenger\//.test(ua) ? 'WeChat'
              : 'Unknown';
  const os = /iPhone|iPad|iPod/.test(ua) ? 'iOS'
    : /Android/.test(ua) ? 'Android'
      : /Mac OS X|Macintosh/.test(ua) ? 'macOS'
        : /Windows NT/.test(ua) ? 'Windows'
          : /Linux/.test(ua) ? 'Linux'
            : platformHint || 'Unknown';
  const deviceClass = mobileHint || /Mobile|iPhone|Android/.test(ua) ? 'mobile'
    : /iPad|Tablet/.test(ua) ? 'tablet'
      : 'desktop';
  const deviceId = normalizeDeviceId(data && (data.deviceFingerprint || data.deviceId));
  const screen = profile.screen && typeof profile.screen === 'object' ? profile.screen : null;
  return {
    browser,
    os,
    platform: platformHint || profile.platform || '',
    deviceClass,
    isMobile: deviceClass === 'mobile',
    language: profile.language || request.headers.get('Accept-Language') || '',
    timezone: profile.timezone || '',
    viewport: data && data.viewport ? String(data.viewport).slice(0, 40) : '',
    screen,
    touchPoints: Number(profile.touchPoints || 0),
    hardwareConcurrency: Number(profile.hardwareConcurrency || 0),
    deviceMemory: Number(profile.deviceMemory || 0),
    browserSessionId: data && data.browserSessionId ? String(data.browserSessionId).slice(0, 120) : '',
    deviceId,
    shortDeviceId: shortDeviceId(deviceId),
    rawUserAgent: truncate(ua, 360),
    isIpad:
      /iPad/i.test(ua) ||
      /iPad/i.test(platformHint || '') ||
      ((/Macintosh|Mac OS X/i.test(ua) || /mac/i.test(platformHint || '')) && Number(profile.touchPoints || 0) > 1)
  };
}

function extractClientAuditMeta(body = {}) {
  const browserSessionId = String(body && body.browserSessionId ? body.browserSessionId : '').trim().slice(0, 120);
  const viewport = String(body && body.viewport ? body.viewport : '').trim().slice(0, 40);
  const deviceFingerprint = normalizeDeviceId(body && (body.deviceFingerprint || body.deviceId));
  let deviceProfile = null;
  if (body && body.deviceProfile && typeof body.deviceProfile === 'object') {
    deviceProfile = body.deviceProfile;
  }
  return {
    browserSessionId,
    viewport,
    deviceProfile,
    deviceFingerprint
  };
}

function truncate(value, length = 240) {
  const text = String(value || '');
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

function normalizeDeviceId(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const cleaned = raw.replace(/[^A-Za-z0-9+/_=-]/g, '').slice(0, DEVICE_ID_MAX_LENGTH);
  if (cleaned.length < DEVICE_ID_MIN_LENGTH || cleaned.length > DEVICE_ID_MAX_LENGTH) return '';
  return cleaned;
}

function shortDeviceId(value) {
  const deviceId = normalizeDeviceId(value);
  if (!deviceId) return '';
  if (deviceId.length <= 18) return deviceId;
  return `${deviceId.slice(0, 8)}…${deviceId.slice(-6)}`;
}

function deviceSummaryLabel(device) {
  if (!device || typeof device !== 'object') return 'unknown device';
  return [device.deviceClass, device.os, device.browser].filter(Boolean).join(' / ') || 'unknown device';
}

function configuredAdminUsers(env) {
  return Array.from(new Set([
    ...splitList(env.ADMIN_USERS),
    ...splitList(env.BASIC_AUTH_USERNAME),
    ...splitList(env.LEGACY_TEACHER_USERS || env.AUTH_COMPAT_TEACHER_USERS),
    ...splitList(env.QA_TEACHER_USERS)
  ].map(normalizeUsername).filter(Boolean)));
}

function staticAdminCredentialForUsername(env, username) {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;
  const primaryUsers = Array.from(new Set([
    ...splitList(env.ADMIN_USERS),
    ...splitList(env.BASIC_AUTH_USERNAME)
  ].map(normalizeUsername).filter(Boolean)));
  const primaryPassword = String(env.BASIC_AUTH_PASSWORD || '');
  if (primaryUsers.includes(normalized) && primaryPassword) {
    return { kind: 'primary', password: primaryPassword };
  }

  const legacyUsers = splitList(env.LEGACY_TEACHER_USERS || env.AUTH_COMPAT_TEACHER_USERS)
    .map(normalizeUsername)
    .filter(Boolean);
  const legacyPassword = String(env.LEGACY_TEACHER_PASSWORD || env.AUTH_COMPAT_TEACHER_PASSWORD || '');
  if (legacyUsers.includes(normalized) && legacyPassword) {
    return { kind: 'legacy-teacher', password: legacyPassword };
  }

  const qaTeacherUsers = splitList(env.QA_TEACHER_USERS)
    .map(normalizeUsername)
    .filter(Boolean);
  const qaTeacherPassword = String(env.QA_TEACHER_PASSWORD || '');
  if (qaTeacherUsers.includes(normalized) && qaTeacherPassword) {
    return { kind: 'qa-teacher', password: qaTeacherPassword };
  }
  return null;
}

function staticStudentCredentialForUsername(env, username) {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;
  const qaStudentUsers = splitList(env.QA_STUDENT_USERS)
    .map(normalizeUsername)
    .filter(Boolean);
  const qaStudentPassword = String(env.QA_STUDENT_PASSWORD || '');
  if (qaStudentUsers.includes(normalized) && qaStudentPassword) {
    return { kind: 'qa-student', password: qaStudentPassword };
  }
  return null;
}

function staticCredentialForUsername(env, username) {
  const adminCredential = staticAdminCredentialForUsername(env, username);
  if (adminCredential) return { ...adminCredential, role: 'teacher' };
  const studentCredential = staticStudentCredentialForUsername(env, username);
  if (studentCredential) return { ...studentCredential, role: 'student' };
  return null;
}

function isAdminUsername(username, env) {
  const normalized = normalizeUsername(username);
  if (!normalized) return false;
  return configuredAdminUsers(env).includes(normalized);
}

function singleDevicePolicy(username, env) {
  const normalized = normalizeUsername(username);
  if (!normalized) {
    return { enforced: false, exempt: false, type: 'unknown', label: '未识别账号' };
  }
  if (isAdminUsername(normalized, env)) {
    return { enforced: false, exempt: true, type: 'teacher_multi_device', label: '教师账号多端放行' };
  }
  if (staticStudentCredentialForUsername(env, normalized)) {
    return { enforced: false, exempt: true, type: 'qa_student_multi_device', label: 'QA 学生账号多端放行' };
  }
  if (normalized === 'qi') {
    return { enforced: true, exempt: false, type: 'single_ipad', label: 'qi 单设备 iPad', requireIpad: true };
  }
  return { enforced: true, exempt: false, type: 'single_device', label: '学生单设备' };
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function isAdmin(session, env) {
  if (!session || !session.username) return false;
  return isAdminUsername(session.username, env);
}

function edgeIdentityScript(session, env) {
  const role = isAdmin(session, env) ? 'teacher' : 'student';
  const name = role === 'teacher' ? '刘光辉' : session.username;
  const identity = {
    username: session.username,
    name,
    role,
    deviceId: session.deviceId || '',
    deviceShortId: shortDeviceId(session.deviceId || ''),
    deviceLabel: session.deviceLabel || '',
    issuedAt: Date.now(),
    source: 'cloudflare-edge'
  };
  return `<script>(function(){window.__FM_EDGE_AUTH__=${JSON.stringify(identity).replace(/</g, '\\u003c')};var currentFail=null;try{Object.defineProperty(window,'__fmAuthGuardFail',{configurable:true,get:function(){return function(reason){if(window.__FM_EDGE_AUTH__){try{document.documentElement.removeAttribute('data-auth-pending')}catch(_){}return false}return currentFail?currentFail(reason):false}},set:function(fn){currentFail=typeof fn==='function'?fn:null}})}catch(_){}})();</script>`;
}

function edgeExperienceAssets() {
  return `<link rel="preload" href="/lib/fm-core.js?v=${EDGE_RUNTIME_JS_VERSION}" as="script"><link rel="stylesheet" href="/styles/edge-fluid-upgrade.css?v=${EDGE_RUNTIME_JS_VERSION}"><script defer src="/js/edge-fluid-performance.js?v=${EDGE_RUNTIME_JS_VERSION}"></script><style id="fm-edge-polish">html{text-rendering:optimizeLegibility;-webkit-text-size-adjust:100%;scroll-behavior:smooth}body{-webkit-font-smoothing:antialiased;overscroll-behavior-y:none}a,button,input,select,textarea{touch-action:manipulation}button,input,select,textarea{font:inherit}:focus-visible{outline:2px solid #14b8a6;outline-offset:2px}@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.001ms!important}}</style><script id="fm-edge-boot">performance&&performance.mark&&performance.mark('fm-edge-head-ready');</script>`;
}

async function writeAudit(env, request, type, data = {}, session = null) {
  if (!env.FM_AUDIT) return;

  const now = Date.now();
  const url = new URL(request.url);
  const device = parseClientDevice(request, data);
  const ipInfo = clientIpInfo(request);
  const record = {
    id: `${now}-${crypto.randomUUID()}`,
    at: now,
    iso: new Date(now).toISOString(),
    type,
    user: session && session.username ? session.username : null,
    path: url.pathname,
    method: request.method,
    ip: ipInfo.ip,
    ipSource: ipInfo.source,
    ipConfidence: ipInfo.confidence,
    ipVerified: ipInfo.verified,
    forwardedIp: ipInfo.forwardedIp,
    country: request.cf && request.cf.country ? request.cf.country : null,
    region: request.cf && request.cf.region ? request.cf.region : null,
    city: request.cf && request.cf.city ? request.cf.city : null,
    colo: request.cf && request.cf.colo ? request.cf.colo : null,
    asn: request.cf && request.cf.asn ? request.cf.asn : null,
    timezone: request.cf && request.cf.timezone ? request.cf.timezone : device.timezone || null,
    browserSessionId: device.browserSessionId || null,
    deviceId: device.deviceId || null,
    device,
    userAgent: truncate(request.headers.get('User-Agent'), 360),
    data
  };

  await env.FM_AUDIT.put(`event:${record.id}`, JSON.stringify(record), { expirationTtl: AUDIT_TTL_SECONDS });

  let index = [];
  try {
    index = JSON.parse((await env.FM_AUDIT.get(INDEX_KEY)) || '[]');
    if (!Array.isArray(index)) index = [];
  } catch (_) {
    index = [];
  }
  index.unshift(record.id);
  index = index.slice(0, MAX_INDEX_EVENTS);
  await env.FM_AUDIT.put(INDEX_KEY, JSON.stringify(index), { expirationTtl: AUDIT_TTL_SECONDS });
}

function queueAudit(context, type, data = {}, session = null) {
  const task = writeAudit(context.env, context.request, type, data, session).catch(() => {});
  if (typeof context.waitUntil === 'function') {
    context.waitUntil(task);
  }
  return task;
}

function shouldQueueLearningProgressAudit(progressResult) {
  if (!progressResult) return true;
  const storeMode = String(progressResult.storeMode || progressResult.store || '').toLowerCase();
  return storeMode !== 'kv-single-write-fallback';
}

function learningProgressStorage(env) {
  return env && (env.FM_PROGRESS || env.FM_AUDIT) ? (env.FM_PROGRESS || env.FM_AUDIT) : null;
}

function learningProgressD1(env) {
  return env && env.FM_PROGRESS_DB && typeof env.FM_PROGRESS_DB.prepare === 'function' ? env.FM_PROGRESS_DB : null;
}

function learningProgressR2(env) {
  if (env && env.FM_PROGRESS_R2 && typeof env.FM_PROGRESS_R2.put === 'function') return env.FM_PROGRESS_R2;
  return null;
}

function learningProgressStoreMode(env) {
  if (learningProgressD1(env)) return 'd1';
  if (learningProgressR2(env)) return 'r2-progress';
  if (learningProgressStorage(env)) return 'kv-single-write-fallback';
  return 'unavailable';
}

function learningProgressSource(env) {
  const mode = learningProgressStoreMode(env);
  if (mode === 'd1') return 'server-d1-learning-progress';
  if (mode === 'r2-progress') return 'server-r2-learning-progress';
  if (mode === 'kv-single-write-fallback') return 'server-kv-learning-progress';
  return 'server-learning-progress-unavailable';
}

function learningProgressStoreHealth(env) {
  const storeMode = learningProgressStoreMode(env);
  const durablePrimary = storeMode === 'd1' || storeMode === 'r2-progress';
  const boundary = learningProgressStoreBoundary(storeMode);
  const writeDurabilityGate = learningProgressWriteDurabilityGate(storeMode);
  const persistenceContract = learningProgressPersistenceContract(storeMode);
  return {
    storeMode,
    source: learningProgressSourceFromStore(storeMode, env),
    serverSnapshotStorageReady: storeMode !== 'unavailable',
    serverSnapshotReadyRequiresUserSnapshot: true,
    durablePrimary,
    fullProductionReady: writeDurabilityGate.fullProductionReady,
    degradedKvFallback: storeMode === 'kv-single-write-fallback',
    productionReady: writeDurabilityGate.productionReady,
    status: boundary.status,
    boundary: boundary.message,
    acceptance: boundary.acceptance,
    serverUpgradeInvariant: boundary.serverUpgradeInvariant,
    persistenceContract,
    progressPersistenceLayer: persistenceContract.layer,
    readOnlyNoDrift: persistenceContract.readOnlyNoDrift,
    durablePrimaryWrite: persistenceContract.durablePrimaryWrite,
    fallbackSnapshot: persistenceContract.fallbackSnapshot,
    strictCumulativeServer: writeDurabilityGate.strictCumulativeServer,
    writeDurabilityGate,
    missingAllPrimaryBindings: writeDurabilityGate.missingAllPrimaryBindings,
    strictBlocksWhenPrimaryMissing: writeDurabilityGate.missingAllPrimaryBindings === true,
    missingPrimaryBindings: {
      FM_PROGRESS_DB: storeMode !== 'd1',
      FM_PROGRESS_R2: storeMode !== 'r2-progress'
    }
  };
}

function publicEntryHealthSnapshot() {
  return {
    canonicalHost: 'lghui.top',
    expectedHttpsEntry: 'https://lghui.top/',
    expectedHttpPermanentRedirect: 'http://lghui.top/ -> 301/308 -> https://lghui.top/',
    contentVersionAuthority: 'site-updates.json + EDGE_HOME_VERSION',
    runtimeProvedByThisEndpoint: false,
    httpEntryReady: false,
    externalRepairRequired: true,
    externalRepairReason: 'Worker runtime cannot repair or prove the upstream CDN/GitHub Pages HTTP redirect and certificate authorization state; the live browser gate must verify it after DNS/CDN/GitHub Pages settings are fixed.',
    lastKnownBlocker: 'Round401 live release gate saw lghui.top HTTP entry not returning a permanent 301/308 redirect, with GitHub Pages certificate state bad_authz and external CDN/DNS A records outside repo control.',
    requiredLiveGate: 'node tools/check-public-entry-browser.mjs --json --expected-version ' + EDGE_HOME_VERSION
  };
}

function buildServerHealthSnapshot(env, session) {
  const progressStore = learningProgressStoreHealth(env);
  const progressGate = progressStore.writeDurabilityGate || learningProgressWriteDurabilityGate(progressStore.storeMode);
  const fmAuditAvailable = !!(env && env.FM_AUDIT && typeof env.FM_AUDIT.get === 'function');
  const privateVideoR2Readable = privateVideoR2JsonAvailable(env, 'get');
  const privateVideoR2Writable = privateVideoR2JsonAvailable(env, 'put');
  const privateVideoReady = privateVideoR2Readable && privateVideoR2Writable;
  const publicEntry = publicEntryHealthSnapshot();
  const blockers = [];
  if (!progressGate.strictCumulativeServer) {
    blockers.push({
      id: 'progress-strict-d1-r2-not-ready',
      label: '学习进度 D1/R2 strict 主存储未就绪',
      required: 'FM_PROGRESS_DB or FM_PROGRESS_R2',
      observedStoreMode: progressStore.storeMode,
      reason: progressGate.blockedReason || progressStore.boundary || ''
    });
  }
  if (!privateVideoReady) {
    blockers.push({
      id: 'private-video-r2-not-ready',
      label: '私有视频完整管理存储未就绪',
      required: 'FM_PRIVATE_MEDIA',
      observedStoreMode: fmAuditAvailable ? 'FM_AUDIT metadata only' : 'missing FM_AUDIT/FM_PRIVATE_MEDIA',
      reason: '没有可读写 FM_PRIVATE_MEDIA R2 时，上传、改授权、下架、完整删除清理不能宣称生产恢复。'
    });
  }
  if (publicEntry.externalRepairRequired) {
    blockers.push({
      id: 'public-http-entry-external-repair',
      label: 'lghui.top HTTP 公开入口仍需外部 DNS/CDN/GitHub Pages 修复后复验',
      required: publicEntry.expectedHttpPermanentRedirect,
      observedStoreMode: 'external-public-entry',
      reason: publicEntry.lastKnownBlocker
    });
  }
  return {
    ok: true,
    protected: true,
    version: EDGE_HOME_VERSION,
    edgeHomeVersion: EDGE_HOME_VERSION,
    generatedAt: new Date().toISOString(),
    user: session && session.username ? session.username : '',
    role: isAdmin(session, env) ? 'teacher' : 'student',
    noMutationRead: true,
    cumulativeSourceOfTruth: 'server-progress-snapshot',
    serverUpgradeInvariant: progressStore.serverUpgradeInvariant,
    claims: {
      readNoDriftReady: progressStore.storeMode !== 'unavailable',
      strictProgressWritesReady: progressGate.strictCumulativeServer === true,
      serverKvCumulativeFallback: progressStore.storeMode === 'kv-single-write-fallback',
      localStorageExcludedFromCumulative: true,
      auditEventWindowExcludedFromCumulative: true,
      privateVideoStorageReady: privateVideoReady,
      httpEntryReady: publicEntry.httpEntryReady === true,
      fullProductionReady: progressGate.strictCumulativeServer === true && privateVideoReady && publicEntry.httpEntryReady === true
    },
    learningProgress: {
      requiredBindings: ['FM_PROGRESS_DB', 'FM_PROGRESS_R2'],
      storeMode: progressStore.storeMode,
      source: progressStore.source,
      status: progressStore.status,
      noMutationRead: true,
      cumulativeSourceOfTruth: 'server-progress-snapshot',
      serverUpgradeStable: progressStore.storeMode !== 'unavailable',
      serverSnapshotStorageReady: progressStore.serverSnapshotStorageReady,
      serverSnapshotReady: false,
      progressSnapshotStatus: 'per-user-snapshot-not-read-by-health-endpoint',
      emptySnapshotDoesNotProvePersistence: true,
      serverSnapshotReadyRequiresUserSnapshot: true,
      progressPersistenceLayer: progressStore.progressPersistenceLayer,
      progressPersistenceContract: progressStore.persistenceContract,
      readOnlyNoDrift: progressStore.readOnlyNoDrift,
      durablePrimaryWrite: progressStore.durablePrimaryWrite,
      fallbackSnapshot: progressStore.fallbackSnapshot,
      durablePrimary: progressStore.durablePrimary,
      strictCumulativeServer: progressGate.strictCumulativeServer,
      serverCumulativeWritesAccepted: progressGate.serverCumulativeWritesAccepted,
      fullProductionReady: progressGate.fullProductionReady,
      degradedKvFallback: progressStore.degradedKvFallback,
      missingPrimaryBindings: progressStore.missingPrimaryBindings,
      writeDurabilityGate: progressGate,
      boundary: progressStore.boundary,
      acceptance: progressStore.acceptance,
      serverUpgradeInvariant: progressStore.serverUpgradeInvariant,
      stableCumulativeFields: LEARNING_PROGRESS_STABLE_FIELDS,
      volatileDiagnosticFieldsExcludedFromCumulative: LEARNING_PROGRESS_VOLATILE_DIAGNOSTIC_FIELDS,
      displayContract: 'Student and teacher cumulative answered/correct/sessions/studyTimeSeconds must render only from GET /api/stats or admin server-progress-snapshot rows with noMutationRead=true.'
    },
    privateVideo: {
      requiredBinding: 'FM_PRIVATE_MEDIA',
      fmAuditAvailable,
      r2Readable: privateVideoR2Readable,
      r2Writable: privateVideoR2Writable,
      storageReady: privateVideoReady,
      fullManagementReady: privateVideoReady,
      productionReady: false,
      requiresRealTeacherAccountQa: true,
      boundary: privateVideoReady
        ? 'FM_PRIVATE_MEDIA R2 binding is present; production recovery still requires real teacher/student browser QA for upload, publish, access-change, archive and delete.'
        : 'FM_PRIVATE_MEDIA R2 binding is missing or incomplete; metadata-only/dry-run success cannot be labeled full private-video management.'
    },
    publicEntry,
    blockers
  };
}

function learningProgressSourceFromStore(store, env) {
  const normalized = String(store || '').toLowerCase();
  if (normalized === 'd1') return 'server-d1-learning-progress';
  if (normalized === 'r2' || normalized === 'r2-progress') return 'server-r2-learning-progress';
  if (normalized === 'kv' || normalized === 'kv-single-write-fallback') return 'server-kv-learning-progress';
  if (normalized === 'snapshot') return 'server-learning-progress-snapshot';
  return learningProgressSource(env);
}

function learningProgressStoreModeFromStore(store, env) {
  const normalized = String(store || '').toLowerCase();
  if (normalized === 'd1') return 'd1';
  if (normalized === 'r2' || normalized === 'r2-progress') return 'r2-progress';
  if (normalized === 'kv' || normalized === 'kv-single-write-fallback') return 'kv-single-write-fallback';
  return learningProgressStoreMode(env);
}

function learningProgressStoreModeFromSource(source, fallbackStoreMode = '') {
  const normalized = String(source || '').toLowerCase();
  if (normalized === 'server-d1-learning-progress') return 'd1';
  if (normalized === 'server-r2-learning-progress') return 'r2-progress';
  if (normalized === 'server-kv-learning-progress') return 'kv-single-write-fallback';
  return fallbackStoreMode || 'unavailable';
}

function learningProgressIsPrimaryStoreMode(storeMode) {
  return storeMode === 'd1' || storeMode === 'r2-progress';
}

function learningProgressWriteDurabilityGate(storeMode, options = {}) {
  const normalized = learningProgressStoreModeFromStore(storeMode || '', {});
  const durablePrimary = learningProgressIsPrimaryStoreMode(normalized);
  const serverKvCumulative = normalized === 'kv-single-write-fallback';
  const signals = [];
  const addSignal = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(addSignal);
      return;
    }
    if (typeof value === 'object') {
      addSignal(value.error);
      addSignal(value.code);
      addSignal(value.reason);
      addSignal(value.status);
      return;
    }
    signals.push(String(value));
  };
  addSignal(options.writeSignals);
  addSignal(options.writeErrors);
  addSignal(options.writeWarnings);
  const signalText = signals.join(' ').toLowerCase();
  const writeQuotaExceeded = signals.includes('write_quota_exceeded') || /write_quota_exceeded|quota|limit exceeded|too many writes/.test(signalText);
  const storageUnavailable = normalized === 'unavailable' || signals.includes('storage_unavailable');
  const missingAllPrimaryBindings = !durablePrimary;
  const strictCumulativeServer = durablePrimary && !writeQuotaExceeded && !storageUnavailable;
  const serverCumulativeWritesAccepted = (durablePrimary || serverKvCumulative) && !writeQuotaExceeded && !storageUnavailable;
  const status = writeQuotaExceeded
    ? 'write_quota_exceeded'
    : (strictCumulativeServer
      ? 'strict-cumulative-server'
      : (storageUnavailable ? 'storage_unavailable' : (serverKvCumulative ? 'server-kv-cumulative-limited' : 'missing-primary-d1-r2')));
  return {
    status,
    strictCumulativeServer,
    cumulativeServerClaimAllowed: strictCumulativeServer,
    serverCumulativeWritesAccepted,
    serverKvCumulative,
    durablePrimary,
    fullProductionReady: strictCumulativeServer,
    productionReady: strictCumulativeServer,
    missingAllPrimaryBindings,
    writeQuotaExceeded,
    storageUnavailable,
    missingPrimaryBindings: {
      FM_PROGRESS_DB: normalized !== 'd1',
      FM_PROGRESS_R2: normalized !== 'r2-progress'
    },
    requiredPrimaryBinding: 'FM_PROGRESS_DB or FM_PROGRESS_R2',
    blockedClaim: strictCumulativeServer ? '' : 'D1/R2 strict cumulative server',
    blockedReason: writeQuotaExceeded
      ? 'write_quota_exceeded means the write did not prove durable cumulative progress; fallback/read no-drift cannot be labeled working cumulative server.'
      : (missingAllPrimaryBindings
        ? 'FM_PROGRESS_DB/FM_PROGRESS_R2 missing: Cloudflare KV server snapshots can persist progress across deploys, but cannot be labeled D1/R2 strict cumulative server.'
        : (storageUnavailable ? 'learning progress storage unavailable.' : 'strict cumulative server not proven.')),
    readBoundary: 'GET noMutationRead=true server-progress-snapshot remains read-only evidence, not a write-success proof.',
    machineGate: strictCumulativeServer
      ? 'pass-strict-d1-r2-cumulative'
      : (serverCumulativeWritesAccepted ? 'pass-server-kv-cumulative-block-strict-d1-r2' : 'block-full-production-cumulative')
  };
}

function learningProgressPersistenceContract(storeMode, snapshotState = {}, options = {}) {
  const normalized = learningProgressStoreModeFromStore(storeMode || '', {});
  const gate = learningProgressWriteDurabilityGate(normalized, options);
  const fallbackSnapshot = normalized === 'kv-single-write-fallback';
  const hasServerProgressSnapshot = snapshotState && snapshotState.hasServerProgressSnapshot === true;
  const readOnlyNoDrift = normalized !== 'unavailable';
  const layer = gate.strictCumulativeServer
    ? 'durable-primary-write'
    : (fallbackSnapshot ? 'fallback-snapshot' : (readOnlyNoDrift ? 'read-only-no-drift' : 'storage-unavailable'));
  return {
    contractVersion: 'round415-worker-a-progress-storage-boundary',
    layer,
    cumulativeSourceOfTruth: 'server-progress-snapshot',
    readOnlyNoDrift,
    durablePrimaryWrite: gate.strictCumulativeServer === true,
    fallbackSnapshot,
    fallbackSnapshotOnly: fallbackSnapshot && gate.strictCumulativeServer !== true,
    hasServerProgressSnapshot,
    serverProgressSnapshotRequired: true,
    nonEmptyServerSnapshotRequiredForCumulative: true,
    emptySnapshotCanOverwriteServerTruth: false,
    staleSnapshotCanOverwriteServerTruth: false,
    localCacheCanOverwriteServerTruth: false,
    auditWindowCanOverwriteServerTruth: false,
    loginOrDeployCanMutateCumulative: false,
    fallbackSnapshotDoesNotProveDurablePrimary: fallbackSnapshot,
    strictPrimaryStoreRequiredForFullProduction: true,
    requiredPrimaryBinding: gate.requiredPrimaryBinding,
    readBoundary: 'read-only no-drift means GET/teacher-summary read a non-empty server-progress-snapshot without mutation; it is not a write-success proof.',
    writeBoundary: fallbackSnapshot
      ? 'KV fallback may preserve a server snapshot across login/redeploy, but it remains fallback-snapshot evidence until FM_PROGRESS_DB or FM_PROGRESS_R2 passes strict write/relogin/teacher-summary proof.'
      : gate.readBoundary,
    writeDurabilityGate: gate
  };
}

function learningProgressProductionBlockers(gate = {}) {
  const blockers = [];
  if (gate.writeQuotaExceeded === true || gate.status === 'write_quota_exceeded') blockers.push('write_quota_exceeded');
  if (gate.storageUnavailable === true || gate.status === 'storage_unavailable') blockers.push('storage_unavailable');
  if (gate.strictCumulativeServer !== true) blockers.push('missing FM_PROGRESS_DB/FM_PROGRESS_R2');
  return Array.from(new Set(blockers.filter(Boolean)));
}

function learningProgressWriteSignalsFromResults(results = []) {
  const signals = [];
  (Array.isArray(results) ? results : [results]).forEach((result) => {
    if (!result) return;
    if (result.error) signals.push(result.error);
    if (Array.isArray(result.writeWarnings)) {
      result.writeWarnings.forEach((warning) => {
        if (warning && warning.error) signals.push(warning.error);
      });
    }
    if (Array.isArray(result.writeAttempts)) {
      result.writeAttempts.forEach((attempt) => {
        if (attempt && attempt.ok !== true && attempt.error) signals.push(attempt.error);
      });
    }
  });
  return signals;
}

function learningProgressStoreBoundary(storeMode) {
  const normalized = String(storeMode || '').toLowerCase();
  const serverUpgradeInvariant = '累计时长、答题数和场次只来自 Cloudflare 服务端进度快照；登录、刷新、代码部署、服务器升级、本机 localStorage 和最近审计事件窗都不能把累计值向前推。';
  if (normalized === 'd1' || normalized === 'r2-progress' || normalized === 'r2') {
    return {
      status: 'full-production-ready',
      message: '学习进度使用 D1/R2 主存储，真实账号写入持久化后才能声明完整生产就绪。',
      acceptance: '真实学生账号 POST /api/progress 后重新登录仍能读到同一累计值；教师汇总显示同一主存储来源。',
      serverUpgradeInvariant
    };
  }
  if (normalized === 'kv-single-write-fallback' || normalized === 'kv') {
    return {
      status: 'server-kv-cumulative',
      message: '当前使用 Cloudflare KV 服务端累计快照：答题和学习时长写入服务器 KV，登录/刷新/代码部署不会从本机重算；D1/R2 未绑定前仍不是最强严格主存储。',
      acceptance: '真实学生账号 POST /api/progress 后重新 GET /api/stats、重登和教师汇总必须读到同一 KV 快照；完整 D1/R2 主存储仍需绑定 FM_PROGRESS_DB 或 FM_PROGRESS_R2 后再升级声明。',
      serverUpgradeInvariant
    };
  }
  return {
    status: 'unavailable',
    message: '学习进度主存储不可用，不能声明真实账号累计进度已由服务器接管。',
    acceptance: '绑定 FM_PROGRESS_DB 或 FM_PROGRESS_R2 后重新验证真实学生账号写入和教师汇总。',
    serverUpgradeInvariant
  };
}

function learningProgressBoundaryFromSource(source, fallbackStoreMode = '') {
  const normalized = String(source || '').toLowerCase();
  if (normalized === 'server-d1-learning-progress') return learningProgressStoreBoundary('d1');
  if (normalized === 'server-r2-learning-progress') return learningProgressStoreBoundary('r2-progress');
  if (normalized === 'server-kv-learning-progress') return learningProgressStoreBoundary('kv-single-write-fallback');
  if (!normalized && fallbackStoreMode) return learningProgressStoreBoundary(fallbackStoreMode);
  return {
    status: 'not-cumulative-truth',
    message: '当前行没有服务端累计进度快照；最近审计事件窗只能辅助排查，不能当作累计时长或累计答题真值。',
    acceptance: '等待 /api/progress 或 /api/stats 返回服务器累计快照；KV 可作为服务器累计层，D1/R2 绑定后再升级 strict 主存储声明。',
    serverUpgradeInvariant: learningProgressStoreBoundary('unavailable').serverUpgradeInvariant
  };
}

function learningProgressUsername(session) {
  return normalizeUsername(session && session.username ? session.username : '');
}

function learningProgressKey(username) {
  return `${LEARNING_PROGRESS_KEY_PREFIX}${username}`;
}

function learningSafeKeyPart(value, fallback = 'unknown') {
  const text = String(value == null ? '' : value)
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_.:@-]/gi, '_')
    .slice(0, 180);
  return text || fallback;
}

function learningProgressEventKey(username, eventId) {
  return `${LEARNING_PROGRESS_EVENT_KEY_PREFIX}${username}:${learningSafeKeyPart(eventId, 'event')}`;
}

function learningProgressR2Key(username) {
  return `${LEARNING_PROGRESS_R2_PREFIX}/users/${learningSafeKeyPart(username, 'user')}.json`;
}

function learningProgressR2EventKey(username, eventId) {
  return `${LEARNING_PROGRESS_R2_PREFIX}/events/${learningSafeKeyPart(username, 'user')}/${learningSafeKeyPart(eventId, 'event')}.json`;
}

function createEmptyLearningProgress(username) {
  return {
    version: LEARNING_PROGRESS_SCHEMA_VERSION,
    user: username,
    createdAt: '',
    updatedAt: '',
    totals: {
      answered: 0,
      correct: 0,
      incorrect: 0,
      skipped: 0,
      sessions: 0,
      studyTimeSeconds: 0,
      averageQuestionTimeSeconds: 0,
      lastAnsweredAt: '',
      lastSessionAt: ''
    },
    byBank: {},
    byKnowledge: {},
    byType: {},
    recentAnswers: [],
    recentSessions: [],
    recentEventIds: []
  };
}

function sanitizeProgressMap(raw) {
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
}

function normalizeLearningProgressSnapshot(raw, username) {
  const base = createEmptyLearningProgress(username);
  if (!raw || typeof raw !== 'object') return base;
  const totals = raw.totals && typeof raw.totals === 'object' ? raw.totals : {};
  const normalized = {
    ...base,
    ...raw,
    version: LEARNING_PROGRESS_SCHEMA_VERSION,
    user: username,
    createdAt: truncate(raw.createdAt || base.createdAt, 40),
    updatedAt: truncate(raw.updatedAt || base.updatedAt, 40),
    totals: {
      ...base.totals,
      ...totals,
      answered: clampNumber(totals.answered, 0, 10000000, 0),
      correct: clampNumber(totals.correct, 0, 10000000, 0),
      incorrect: clampNumber(totals.incorrect, 0, 10000000, 0),
      skipped: clampNumber(totals.skipped, 0, 10000000, 0),
      sessions: clampNumber(totals.sessions, 0, 1000000, 0),
      studyTimeSeconds: clampNumber(totals.studyTimeSeconds, 0, 1000000000, 0),
      averageQuestionTimeSeconds: clampNumber(totals.averageQuestionTimeSeconds, 0, 86400, 0),
      lastAnsweredAt: truncate(totals.lastAnsweredAt || '', 40),
      lastSessionAt: truncate(totals.lastSessionAt || '', 40)
    },
    byBank: sanitizeProgressMap(raw.byBank),
    byKnowledge: sanitizeProgressMap(raw.byKnowledge),
    byType: sanitizeProgressMap(raw.byType),
    recentAnswers: Array.isArray(raw.recentAnswers) ? raw.recentAnswers.slice(0, LEARNING_PROGRESS_RECENT_ANSWER_LIMIT) : [],
    recentSessions: Array.isArray(raw.recentSessions) ? raw.recentSessions.slice(0, LEARNING_PROGRESS_RECENT_SESSION_LIMIT) : [],
    recentEventIds: Array.isArray(raw.recentEventIds) ? raw.recentEventIds.slice(0, LEARNING_PROGRESS_RECENT_EVENT_LIMIT) : []
  };
  normalized.totals.averageQuestionTimeSeconds = normalized.totals.answered > 0
    ? Math.round(normalized.totals.studyTimeSeconds / normalized.totals.answered)
    : 0;
  return normalized;
}

function learningProgressSnapshotRank(progress) {
  const totals = learningProgressTotals(progress || {});
  const updatedAt = Date.parse(progress && progress.updatedAt || '') || 0;
  const recentEventCount = Array.isArray(progress && progress.recentEventIds) ? progress.recentEventIds.length : 0;
  return [
    totals.answered + totals.skipped,
    totals.correct + totals.incorrect,
    totals.sessions,
    totals.studyTimeSeconds,
    recentEventCount,
    updatedAt
  ];
}

function compareLearningProgressSnapshots(a, b) {
  const left = learningProgressSnapshotRank(a && a.progress ? a.progress : a);
  const right = learningProgressSnapshotRank(b && b.progress ? b.progress : b);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const diff = Number(left[index] || 0) - Number(right[index] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function learningProgressSnapshotCandidateSummary(candidate) {
  const progress = candidate && candidate.progress ? candidate.progress : null;
  const totals = learningProgressTotals(progress || {});
  return {
    source: candidate && candidate.source ? candidate.source : '',
    storeMode: candidate && candidate.storeMode ? candidate.storeMode : '',
    answered: totals.answered,
    correct: totals.correct,
    incorrect: totals.incorrect,
    skipped: totals.skipped,
    sessions: totals.sessions,
    studyTimeSeconds: totals.studyTimeSeconds,
    updatedAt: progress && progress.updatedAt ? progress.updatedAt : '',
    rank: learningProgressSnapshotRank(progress || {})
  };
}

const LEARNING_PROGRESS_STABLE_FIELDS = Object.freeze([
  'source',
  'storeMode',
  'configuredStoreMode',
  'configuredSource',
  'snapshotSelection',
  'answered',
  'correct',
  'incorrect',
  'skipped',
  'sessions',
  'studyTimeSeconds',
  'averageQuestionTimeSeconds',
  'accuracy',
  'lastAnsweredAt',
  'lastSessionAt'
]);

const LEARNING_PROGRESS_VOLATILE_DIAGNOSTIC_FIELDS = Object.freeze([
  'lastSeen',
  'lastSeenAt',
  'loginSuccess',
  'loginFailed',
  'pageViews',
  'resourceRequests',
  'eventCount',
  'eventWindowAnswers',
  'eventWindowSessions',
  'eventWindowStudyTimeSeconds',
  'recentUserEvents',
  'recentSessions',
  'recentAnswers'
]);

function learningProgressStableKeyFromTotals(totals = {}, identity = {}) {
  const normalizedTotals = learningProgressTotals({ totals });
  return [
    'server-progress-snapshot',
    identity.source || '',
    identity.storeMode || '',
    identity.configuredStoreMode || '',
    identity.configuredSource || '',
    identity.snapshotSelection || '',
    normalizedTotals.answered,
    normalizedTotals.correct,
    normalizedTotals.incorrect,
    normalizedTotals.skipped,
    normalizedTotals.sessions,
    normalizedTotals.studyTimeSeconds,
    normalizedTotals.averageQuestionTimeSeconds,
    normalizedTotals.accuracy,
    normalizedTotals.lastAnsweredAt,
    normalizedTotals.lastSessionAt
  ].map((part) => String(part == null ? '' : part).replace(/[|\r\n]/g, ' ')).join('|');
}

function learningProgressReadInvariant(entry = {}) {
  const progress = entry && entry.progress ? entry.progress : entry;
  const totals = learningProgressTotals(progress || {});
  const identity = {
    source: entry.source || '',
    storeMode: entry.storeMode || '',
    configuredStoreMode: entry.configuredStoreMode || '',
    configuredSource: entry.configuredSource || '',
    snapshotSelection: entry.snapshotSelection || ''
  };
  return {
    stableKey: learningProgressStableKeyFromTotals(totals, identity),
    stableFields: LEARNING_PROGRESS_STABLE_FIELDS,
    volatileDiagnosticFieldsExcludedFromCumulative: LEARNING_PROGRESS_VOLATILE_DIAGNOSTIC_FIELDS,
    noMutationRead: true,
    cumulativeSourceOfTruth: 'server-progress-snapshot',
    loginRefreshDeployInvariant: true,
    diagnosticFieldsMayChange: true,
    diagnosticFieldsDoNotMutateCumulative: true
  };
}

function learningProgressSnapshotState(entry = {}) {
  const progress = entry && entry.progress ? entry.progress : entry;
  const storeMode = String(entry && entry.storeMode || '').toLowerCase();
  const source = String(entry && entry.source || '').toLowerCase();
  const serverSnapshotStorageReady = storeMode !== 'unavailable' && source !== 'server-learning-progress-unavailable';
  const hasSnapshot = hasLearningProgressActivity(progress);
  const persistenceContract = learningProgressPersistenceContract(storeMode, { hasServerProgressSnapshot: hasSnapshot });
  const emptySnapshotReason = hasSnapshot
    ? ''
    : (serverSnapshotStorageReady ? 'no-persisted-learning-progress-snapshot' : 'learning-progress-storage-unavailable');
  return {
    hasServerProgressSnapshot: hasSnapshot,
    snapshotPersisted: hasSnapshot,
    serverSnapshotStorageReady,
    serverSnapshotReady: hasSnapshot,
    emptyServerProgressSnapshot: !hasSnapshot,
    progressSnapshotStatus: hasSnapshot ? 'server-progress-snapshot-present' : 'empty-server-progress-snapshot',
    emptySnapshotReason,
    emptySnapshotDoesNotCreateCumulative: !hasSnapshot,
    emptySnapshotDoesNotProvePersistence: !hasSnapshot,
    emptySnapshotCanOverwriteServerTruth: false,
    staleSnapshotCanOverwriteServerTruth: false,
    localCacheCanOverwriteServerTruth: false,
    auditWindowCanOverwriteServerTruth: false,
    progressPersistenceLayer: persistenceContract.layer,
    readOnlyNoDrift: persistenceContract.readOnlyNoDrift,
    durablePrimaryWrite: persistenceContract.durablePrimaryWrite,
    fallbackSnapshot: persistenceContract.fallbackSnapshot,
    progressPersistenceContract: persistenceContract,
    snapshotSelection: entry.snapshotSelection || ''
  };
}

function classifyStorageWriteError(error) {
  const message = String(error && (error.message || error.name) || '').toLowerCase();
  if (/limit exceeded|quota|too many writes|write.*limit/.test(message)) return 'write_quota_exceeded';
  if (/authentication|permission|forbidden|unauthorized/.test(message)) return 'write_not_authorized';
  return 'write_failed';
}

async function ensureLearningProgressD1(env) {
  const db = learningProgressD1(env);
  if (!db) return false;
  if (LEARNING_PROGRESS_D1_READY) return true;
  await db.prepare(`CREATE TABLE IF NOT EXISTS learning_progress (
    username TEXT PRIMARY KEY,
    snapshot TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS learning_progress_events (
    username TEXT NOT NULL,
    event_id TEXT NOT NULL,
    type TEXT NOT NULL,
    iso TEXT NOT NULL,
    stored_at TEXT NOT NULL,
    PRIMARY KEY (username, event_id)
  )`).run();
  LEARNING_PROGRESS_D1_READY = true;
  return true;
}

async function readLearningProgressD1(env, username) {
  const db = learningProgressD1(env);
  if (!db || !username) return null;
  try {
    await ensureLearningProgressD1(env);
    const row = await db.prepare('SELECT snapshot FROM learning_progress WHERE username = ?')
      .bind(username)
      .first();
    return row && row.snapshot ? normalizeLearningProgressSnapshot(JSON.parse(row.snapshot), username) : null;
  } catch (_) {
    return null;
  }
}

async function writeLearningProgressD1(env, username, progress) {
  const db = learningProgressD1(env);
  if (!db || !username) return { ok: false, store: 'd1', error: 'storage_unavailable' };
  const normalized = normalizeLearningProgressSnapshot(progress, username);
  try {
    await ensureLearningProgressD1(env);
    await db.prepare(`INSERT INTO learning_progress (username, snapshot, created_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(username) DO UPDATE SET snapshot = excluded.snapshot, updated_at = excluded.updated_at`)
      .bind(username, JSON.stringify(normalized), normalized.createdAt, normalized.updatedAt)
      .run();
    return { ok: true, store: 'd1' };
  } catch (error) {
    return { ok: false, store: 'd1', error: classifyStorageWriteError(error) };
  }
}

async function readLearningProgressR2(env, username) {
  const bucket = learningProgressR2(env);
  if (!bucket || !username || typeof bucket.get !== 'function') return null;
  try {
    const object = await bucket.get(learningProgressR2Key(username));
    if (!object) return null;
    const text = typeof object.text === 'function'
      ? await object.text()
      : object.body
        ? await new Response(object.body).text()
        : '';
    return text ? normalizeLearningProgressSnapshot(JSON.parse(text), username) : null;
  } catch (_) {
    return null;
  }
}

async function writeLearningProgressR2(env, username, progress) {
  const bucket = learningProgressR2(env);
  if (!bucket || !username || typeof bucket.put !== 'function') return { ok: false, store: 'r2', error: 'storage_unavailable' };
  const normalized = normalizeLearningProgressSnapshot(progress, username);
  try {
    await bucket.put(learningProgressR2Key(username), JSON.stringify(normalized), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' }
    });
    return { ok: true, store: 'r2-progress' };
  } catch (error) {
    return { ok: false, store: 'r2', error: classifyStorageWriteError(error) };
  }
}

async function hasLearningProgressEventMarker(env, username, eventId, progress) {
  const db = learningProgressD1(env);
  if (db) {
    try {
      await ensureLearningProgressD1(env);
      const row = await db.prepare('SELECT event_id FROM learning_progress_events WHERE username = ? AND event_id = ?')
        .bind(username, eventId)
        .first();
      if (row && row.event_id) return { duplicate: true, store: 'd1' };
    } catch (_) {}
  }
  const bucket = learningProgressR2(env);
  if (bucket && typeof bucket.head === 'function') {
    try {
      const object = await bucket.head(learningProgressR2EventKey(username, eventId));
      if (object) return { duplicate: true, store: 'r2' };
    } catch (_) {}
  }
  const storage = learningProgressStorage(env);
  if (storage && typeof storage.get === 'function') {
    try {
      const marker = await storage.get(learningProgressEventKey(username, eventId));
      if (marker) return { duplicate: true, store: 'kv-single-write-fallback' };
    } catch (_) {}
  }
  if (progress && Array.isArray(progress.recentEventIds) && progress.recentEventIds.includes(eventId)) {
    return { duplicate: true, store: 'snapshot' };
  }
  return { duplicate: false, store: '' };
}

async function writeLearningProgressEventMarker(env, username, event) {
  const db = learningProgressD1(env);
  if (db) {
    try {
      await ensureLearningProgressD1(env);
      await db.prepare(`INSERT OR IGNORE INTO learning_progress_events (username, event_id, type, iso, stored_at)
        VALUES (?, ?, ?, ?, ?)`)
        .bind(username, event.eventId, event.type, event.iso, new Date().toISOString())
        .run();
      return { ok: true, store: 'd1' };
    } catch (error) {
      return { ok: false, store: 'd1', error: classifyStorageWriteError(error) };
    }
  }
  const bucket = learningProgressR2(env);
  if (bucket && typeof bucket.put === 'function') {
    try {
      await bucket.put(learningProgressR2EventKey(username, event.eventId), JSON.stringify({
        user: username,
        eventId: event.eventId,
        type: event.type,
        iso: event.iso,
        storedAt: new Date().toISOString()
      }), {
        httpMetadata: { contentType: 'application/json; charset=utf-8' }
      });
      return { ok: true, store: 'r2-progress' };
    } catch (error) {
      return { ok: false, store: 'r2', error: classifyStorageWriteError(error) };
    }
  }
  const storage = learningProgressStorage(env);
  if (storage && typeof storage.put === 'function') {
    return {
      ok: true,
      store: 'snapshot',
      skippedKvMarkerWrite: true,
      reason: 'kv-fallback-dedupe-via-recentEventIds'
    };
  }
  return { ok: true, store: 'snapshot' };
}

async function readLearningProgressWithSource(env, username) {
  const storeMode = learningProgressStoreMode(env);
  const configuredSource = learningProgressSourceFromStore(storeMode, env);
  if (!username) {
    return {
      progress: createEmptyLearningProgress('unknown'),
      source: 'server-learning-progress-unavailable',
      storeMode,
      configuredStoreMode: storeMode,
      configuredSource,
      snapshotSelection: 'missing-username',
      progressPersistenceContract: learningProgressPersistenceContract(storeMode, { hasServerProgressSnapshot: false }),
      selectedSnapshotContract: 'non-empty-server-snapshot-required',
      snapshotCandidates: []
    };
  }
  const candidates = [];
  const addCandidate = (progress, source, candidateStoreMode) => {
    if (!progress || !hasLearningProgressActivity(progress)) return;
    candidates.push({
      progress: normalizeLearningProgressSnapshot(progress, username),
      source,
      storeMode: candidateStoreMode
    });
  };
  addCandidate(await readLearningProgressD1(env, username), 'server-d1-learning-progress', 'd1');
  addCandidate(await readLearningProgressR2(env, username), 'server-r2-learning-progress', 'r2-progress');

  const storage = learningProgressStorage(env);
  if (storage) {
    try {
      const raw = await storage.get(learningProgressKey(username));
      addCandidate(raw ? JSON.parse(raw) : null, 'server-kv-learning-progress', 'kv-single-write-fallback');
    } catch (_) {}
  }

  if (candidates.length) {
    const selected = candidates.slice().sort((a, b) => compareLearningProgressSnapshots(b, a))[0];
    return {
      progress: selected.progress,
      source: selected.source,
      storeMode: selected.storeMode,
      configuredStoreMode: storeMode,
      configuredSource,
      snapshotSelection: selected.storeMode === storeMode ? 'configured-store' : 'monotonic-cross-store',
      progressPersistenceContract: learningProgressPersistenceContract(selected.storeMode, { hasServerProgressSnapshot: true }),
      selectedSnapshotContract: 'monotonic-non-empty-server-snapshot',
      snapshotCandidates: candidates.map(learningProgressSnapshotCandidateSummary)
    };
  }

  if (!storage) {
    return {
      progress: createEmptyLearningProgress(username),
      source: 'server-learning-progress-unavailable',
      storeMode,
      configuredStoreMode: storeMode,
      configuredSource,
      snapshotSelection: 'no-progress-storage',
      progressPersistenceContract: learningProgressPersistenceContract(storeMode, { hasServerProgressSnapshot: false }),
      selectedSnapshotContract: 'no-server-progress-storage',
      snapshotCandidates: []
    };
  }
  return {
    progress: createEmptyLearningProgress(username),
    source: learningProgressSource(env),
    storeMode,
    configuredStoreMode: storeMode,
    configuredSource,
    snapshotSelection: 'empty-server-progress-snapshot',
    progressPersistenceContract: learningProgressPersistenceContract(storeMode, { hasServerProgressSnapshot: false }),
    selectedSnapshotContract: 'empty-snapshot-does-not-create-cumulative',
    snapshotCandidates: []
  };
}

async function readLearningProgress(env, username) {
  const entry = await readLearningProgressWithSource(env, username);
  return entry.progress;
}

async function writeLearningProgress(env, username, progress) {
  if (!username) return { ok: false, store: 'none', error: 'missing_username' };
  const normalized = normalizeLearningProgressSnapshot(progress, username);
  const writeAttempts = [];
  const d1 = learningProgressD1(env);
  if (d1) {
    const result = await writeLearningProgressD1(env, username, normalized);
    writeAttempts.push({ store: result.store || 'd1', ok: result.ok === true, error: result.error || '' });
    if (result.ok) return { ...result, writeAttempts, writeWarnings: [] };
  }
  const r2 = learningProgressR2(env);
  if (r2) {
    const result = await writeLearningProgressR2(env, username, normalized);
    writeAttempts.push({ store: result.store || 'r2-progress', ok: result.ok === true, error: result.error || '' });
    if (result.ok) return { ...result, writeAttempts, writeWarnings: writeAttempts.filter((item) => item.ok !== true) };
  }
  const storage = learningProgressStorage(env);
  if (!storage) return { ok: false, store: 'none', error: 'storage_unavailable', writeAttempts, writeWarnings: writeAttempts.filter((item) => item.ok !== true) };
  try {
    await storage.put(learningProgressKey(username), JSON.stringify(normalized));
    writeAttempts.push({
      store: 'kv-single-write-fallback',
      ok: true,
      error: ''
    });
    return {
      ok: true,
      store: 'kv-single-write-fallback',
      writeAttempts,
      writeWarnings: writeAttempts.filter((item) => item.ok !== true)
    };
  } catch (error) {
    const kvError = classifyStorageWriteError(error);
    writeAttempts.push({
      store: 'kv-single-write-fallback',
      ok: false,
      error: kvError
    });
    const primaryFailure = writeAttempts.find((item) => item.store === 'd1' || item.store === 'r2' || item.store === 'r2-progress');
    const blockedError = kvError || (primaryFailure ? (primaryFailure.error || 'primary_progress_storage_write_failed') : 'kv_progress_storage_write_failed');
    return {
      ok: false,
      store: primaryFailure ? primaryFailure.store : 'kv-single-write-fallback',
      error: blockedError,
      writeAttempts,
      writeWarnings: writeAttempts.filter((item) => item.ok !== true)
    };
  }
}

function addLearningProgressStat(map, key, isCorrect, seconds) {
  const name = truncate(String(key || '未标注').replace(/\s+/g, ' ').trim(), 120) || '未标注';
  const stat = map[name] || { answered: 0, correct: 0, incorrect: 0, studyTimeSeconds: 0, accuracy: 0 };
  stat.answered += 1;
  if (isCorrect) stat.correct += 1;
  else stat.incorrect += 1;
  stat.studyTimeSeconds += clampNumber(seconds, 0, 7200, 0);
  stat.accuracy = stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0;
  map[name] = stat;
}

function isActiveLearningHeartbeat(data = {}) {
  if (!data || typeof data !== 'object') return false;
  if (data.activeLearning !== true) return false;
  if (!explicitLearningEventId(data)) return false;
  const kind = String(data.activityKind || data.learningActivity || data.context || '').toLowerCase();
  const allowedKind = /^(practice|question|review)$/.test(kind);
  const focusId = String(data.activeQuestionId || data.currentQuestionId || data.questionId || data.learningFocus || '').trim();
  const path = String(data.pagePath || data.pathname || data.path || data.route || '').toLowerCase();
  const learningRoute = /(^|\/)(modules\/question-bank|modules\/real-exams|practice|practice-dynamic|question-bank)(\.html)?(?:$|[/?#])/.test(path);
  const hasHumanInteraction = data.userInteraction === true
    || data.pointerActive === true
    || data.keyboardActive === true
    || data.answerChanged === true
    || data.answerSubmitted === true;
  const pageVisible = data.pageVisible !== false && data.pageVisible === true;
  return allowedKind
    && Boolean(data.practiceSessionId)
    && Boolean(focusId)
    && learningRoute
    && hasHumanInteraction
    && pageVisible
    && data.loginRead !== true
    && data.authEvent !== true;
}

function isLoginOrAuthLearningEvent(data = {}) {
  if (!data || typeof data !== 'object') return false;
  return data.loginRead === true
    || data.authEvent === true
    || data.sessionRefresh === true
    || data.progressReadOnly === true
    || /^(login|logout|auth|session|heartbeat-login-read)$/.test(String(data.activityKind || data.learningActivity || data.context || '').toLowerCase());
}

function explicitLearningEventId(data = {}) {
  const explicit = data && (data.clientEventId || data.eventId || data.practiceEventId);
  return explicit ? learningSafeKeyPart(explicit, '') : '';
}

function normalizeLearningDurationSeconds(raw, {
  maxSeconds,
  unit = '',
  legacyMillisGuardSeconds = maxSeconds,
  assumeMilliseconds = false
} = {}) {
  const numeric = Number(raw);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  const normalizedUnit = String(unit || '').toLowerCase();
  let seconds = numeric;
  if (/^(ms|millisecond|milliseconds)$/.test(normalizedUnit) || assumeMilliseconds) {
    seconds = numeric / 1000;
  } else if (!/^(s|sec|second|seconds)$/.test(normalizedUnit)
    && numeric >= 1000
    && numeric > legacyMillisGuardSeconds
    && numeric <= maxSeconds * 1000) {
    seconds = numeric / 1000;
  }
  const rounded = seconds > 0 && seconds < 1 ? 1 : Math.round(seconds);
  return clampNumber(rounded, 0, maxSeconds, 0);
}

function learningDurationUnit(data = {}) {
  return data.durationUnit || data.timeUnit || data.questionTimeUnit || data.heartbeatUnit || '';
}

function learningQuestionTimeSeconds(data = {}) {
  const unit = learningDurationUnit(data);
  if (data.questionTimeSeconds !== undefined || data.questionTime !== undefined) {
    return normalizeLearningDurationSeconds(
      data.questionTimeSeconds !== undefined ? data.questionTimeSeconds : data.questionTime,
      {
        maxSeconds: LEARNING_PROGRESS_QUESTION_MAX_SECONDS,
        unit,
        legacyMillisGuardSeconds: LEARNING_PROGRESS_QUESTION_LEGACY_MILLIS_GUARD_SECONDS
      }
    );
  }
  if (data.durationSeconds !== undefined) {
    return normalizeLearningDurationSeconds(data.durationSeconds, {
      maxSeconds: LEARNING_PROGRESS_QUESTION_MAX_SECONDS,
      unit: unit || 'seconds'
    });
  }
  if (data.timeSpent !== undefined || data.timeSpentMs !== undefined) {
    return normalizeLearningDurationSeconds(
      data.timeSpentMs !== undefined ? data.timeSpentMs : data.timeSpent,
      {
        maxSeconds: LEARNING_PROGRESS_QUESTION_MAX_SECONDS,
        unit: data.timeSpentMs !== undefined ? 'milliseconds' : (data.timeSpentUnit || unit),
        assumeMilliseconds: !/^(s|sec|second|seconds)$/.test(String(unit || '').toLowerCase())
      }
    );
  }
  return 0;
}

function learningHeartbeatIncrementSeconds(data = {}) {
  const unit = learningDurationUnit(data);
  const raw = data.heartbeatMilliseconds !== undefined
    ? data.heartbeatMilliseconds
    : data.deltaMilliseconds !== undefined
      ? data.deltaMilliseconds
      : data.heartbeatSeconds !== undefined
        ? data.heartbeatSeconds
        : data.deltaSeconds !== undefined
          ? data.deltaSeconds
          : data.activeSeconds !== undefined
            ? data.activeSeconds
            : data.incrementSeconds;
  return normalizeLearningDurationSeconds(raw, {
    maxSeconds: LEARNING_PROGRESS_HEARTBEAT_MAX_SECONDS,
    unit: data.heartbeatMilliseconds !== undefined || data.deltaMilliseconds !== undefined ? 'milliseconds' : unit,
    legacyMillisGuardSeconds: LEARNING_PROGRESS_HEARTBEAT_MAX_SECONDS
  });
}

function normalizeLearningEventId(type, data, request) {
  const explicit = explicitLearningEventId(data);
  if (explicit) return learningSafeKeyPart(explicit, '');
  const requestUrl = request ? new URL(request.url) : null;
  const fallbackParts = [
    type,
    data && data.browserSessionId,
    data && data.practiceSessionId,
    data && data.bankId,
    data && (data.questionId || data.questionNumber),
    data && (data.answeredAt || data.endTime || data.timestamp),
    requestUrl && requestUrl.pathname
  ].filter(Boolean).join(':');
  return learningSafeKeyPart(fallbackParts, `${type}-${Date.now()}`);
}

function sanitizeLearningProgressEvent(type, data = {}, request) {
  const eventType = String(type || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 48);
  if (!LEARNING_PROGRESS_EVENT_TYPES.has(eventType)) return null;
  const explicitEventId = explicitLearningEventId(data);
  const hasExplicitEventId = Boolean(explicitEventId);
  const noMutationReason = isLoginOrAuthLearningEvent(data)
    ? 'login-or-auth-event-not-learning-progress'
    : (!hasExplicitEventId ? 'missing-explicit-learning-event-id' : '');
  const eventId = noMutationReason
    ? learningSafeKeyPart(`${eventType}:${noMutationReason}`, 'ignored-learning-event')
    : normalizeLearningEventId(eventType, data, request);
  const nowIso = new Date().toISOString();
  const isCorrect = Boolean(data.isCorrect);
  const questionTimeSeconds = noMutationReason ? 0 : learningQuestionTimeSeconds(data);
  const heartbeatIncrementSeconds = eventType === 'study_heartbeat' && !noMutationReason && isActiveLearningHeartbeat(data)
    ? learningHeartbeatIncrementSeconds(data)
    : 0;
  const totalTime = noMutationReason
    ? 0
    : (eventType === 'study_heartbeat'
      ? heartbeatIncrementSeconds
      : clampNumber(data.totalTime || data.duration || data.studyTimeSeconds, 0, 12 * 60 * 60, 0));
  return {
    eventId,
    type: eventType,
    iso: truncate(data.answeredAt || data.endTime || data.timestamp || nowIso, 40),
    bankId: truncate(data.bankId || '', 120),
    sessionName: truncate(data.sessionName || '', 180),
    practiceSessionId: truncate(data.practiceSessionId || '', 160),
    questionId: truncate(data.questionId || data.qid || '', 160),
    questionNumber: truncate(data.questionNumber || '', 40),
    questionTitle: truncate(data.questionTitle || data.title || '', 220),
    questionType: truncate(data.questionType || data.type || '未知题型', 120),
    knowledge: truncate(data.knowledge || data.category || data.knowledgePoint || '未标注知识点', 120),
    userAnswer: truncate(data.userAnswer || '', 160),
    correctAnswer: truncate(data.correctAnswer || '', 160),
    isCorrect,
    questionTimeSeconds,
    totalQuestions: clampNumber(data.totalQuestions, 0, 100000, 0),
    answered: clampNumber(data.answered, 0, 100000, 0),
    correct: clampNumber(data.correct, 0, 100000, 0),
    incorrect: clampNumber(data.incorrect, 0, 100000, 0),
    totalTime,
    averageTime: clampNumber(data.averageTime, 0, 7200, 0),
    noMutationWrite: Boolean(noMutationReason),
    ignoredReason: noMutationReason
  };
}

function applyLearningProgressDelta(progress, event) {
  const totals = progress.totals;
  const nowIso = new Date().toISOString();
  if (!progress.createdAt) progress.createdAt = nowIso;
  progress.updatedAt = nowIso;
  progress.recentEventIds = [event.eventId, ...(progress.recentEventIds || []).filter((id) => id !== event.eventId)]
    .slice(0, LEARNING_PROGRESS_RECENT_EVENT_LIMIT);

  if (event.type === 'practice_answer_submit') {
    totals.answered += 1;
    totals.studyTimeSeconds += event.questionTimeSeconds;
    totals.lastAnsweredAt = event.iso;
    if (event.isCorrect) totals.correct += 1;
    else totals.incorrect += 1;
    addLearningProgressStat(progress.byBank, event.bankId || '未知题库', event.isCorrect, event.questionTimeSeconds);
    addLearningProgressStat(progress.byKnowledge, event.knowledge || '未标注知识点', event.isCorrect, event.questionTimeSeconds);
    addLearningProgressStat(progress.byType, event.questionType || '未知题型', event.isCorrect, event.questionTimeSeconds);
    progress.recentAnswers = [{
      eventId: event.eventId,
      iso: event.iso,
      bankId: event.bankId,
      sessionName: event.sessionName,
      practiceSessionId: event.practiceSessionId,
      questionId: event.questionId,
      questionNumber: event.questionNumber,
      questionTitle: event.questionTitle,
      questionType: event.questionType,
      knowledge: event.knowledge,
      userAnswer: event.userAnswer,
      correctAnswer: event.correctAnswer,
      isCorrect: event.isCorrect,
      questionTimeSeconds: event.questionTimeSeconds
    }, ...(progress.recentAnswers || [])].slice(0, LEARNING_PROGRESS_RECENT_ANSWER_LIMIT);
  }

  if (event.type === 'practice_question_skip') {
    totals.skipped += 1;
    totals.lastAnsweredAt = event.iso;
  }

  if (event.type === 'practice_complete') {
    totals.sessions += 1;
    totals.lastSessionAt = event.iso;
    progress.recentSessions = [{
      eventId: event.eventId,
      iso: event.iso,
      bankId: event.bankId,
      sessionName: event.sessionName,
      practiceSessionId: event.practiceSessionId,
      totalQuestions: event.totalQuestions,
      answered: event.answered,
      correct: event.correct,
      incorrect: event.incorrect,
      totalTime: event.totalTime,
      averageTime: event.averageTime
    }, ...(progress.recentSessions || [])].slice(0, LEARNING_PROGRESS_RECENT_SESSION_LIMIT);
  }

  if (event.type === 'study_heartbeat') {
    totals.studyTimeSeconds += event.totalTime;
  }

  totals.averageQuestionTimeSeconds = totals.answered > 0
    ? Math.round(totals.studyTimeSeconds / totals.answered)
    : 0;
  return progress;
}

function isNoopLearningProgressEvent(event) {
  return event && (event.noMutationWrite === true
    || (event.type === 'study_heartbeat' && clampNumber(event.totalTime, 0, LEARNING_PROGRESS_HEARTBEAT_MAX_SECONDS, 0) <= 0));
}

async function mergeLearningProgressEvent(context, session, type, data = {}) {
  const username = learningProgressUsername(session);
  const storeMode = learningProgressStoreMode(context.env);
  if (!username || storeMode === 'unavailable') return { ok: false, error: username ? 'storage_unavailable' : 'login_required', storeMode };

  const event = sanitizeLearningProgressEvent(type, data, context.request);
  if (!event) return { ok: false, error: 'not_progress_event' };

  const previousProgressEntry = await readLearningProgressWithSource(context.env, username);
  const previousProgress = previousProgressEntry.progress;
  if (isNoopLearningProgressEvent(event)) {
    return {
      ok: true,
      ignored: true,
      noMutationWrite: true,
      eventId: event.eventId,
      ignoredReason: event.ignoredReason || 'no-progress-delta',
      store: previousProgressEntry.storeMode || storeMode,
      storeMode: previousProgressEntry.storeMode || storeMode,
      configuredStoreMode: storeMode,
      source: previousProgressEntry.source || learningProgressSourceFromStore(storeMode, context.env),
      progress: previousProgress
    };
  }
  const marker = await hasLearningProgressEventMarker(context.env, username, event.eventId, previousProgress);
  if (marker.duplicate) {
    const markerStoreMode = marker.store === 'snapshot'
      ? previousProgressEntry.storeMode
      : learningProgressStoreModeFromStore(marker.store || storeMode, context.env);
    const markerSource = marker.store === 'snapshot'
      ? previousProgressEntry.source
      : learningProgressSourceFromStore(marker.store || storeMode, context.env);
    return {
      ok: true,
      duplicate: true,
      eventId: event.eventId,
      store: marker.store || storeMode,
      storeMode: markerStoreMode,
      configuredStoreMode: storeMode,
      source: markerSource,
      progress: previousProgress
    };
  }

  const progress = applyLearningProgressDelta(JSON.parse(JSON.stringify(previousProgress)), event);
  const writeResult = await writeLearningProgress(context.env, username, progress);
  const actualStoreMode = learningProgressStoreModeFromStore(writeResult.store || storeMode, context.env);
  if (!writeResult.ok) {
    return {
      ok: false,
      duplicate: false,
      eventId: event.eventId,
      store: writeResult.store || storeMode,
      storeMode: actualStoreMode,
      configuredStoreMode: storeMode,
      source: learningProgressSourceFromStore(writeResult.store || storeMode, context.env),
      error: writeResult.error || 'progress_write_failed',
      writeAttempts: writeResult.writeAttempts || [],
      writeWarnings: writeResult.writeWarnings || [],
      progress: previousProgress
    };
  }
  const markerResult = await writeLearningProgressEventMarker(context.env, username, event);

  return {
    ok: true,
    duplicate: false,
    eventId: event.eventId,
    store: writeResult.store || storeMode,
    storeMode: actualStoreMode,
    configuredStoreMode: storeMode,
    source: learningProgressSourceFromStore(writeResult.store || storeMode, context.env),
    markerStore: markerResult.store || '',
    markerWarning: markerResult.ok ? '' : (markerResult.error || 'marker_write_failed'),
    writeAttempts: writeResult.writeAttempts || [],
    writeWarnings: writeResult.writeWarnings || [],
    progress
  };
}

function learningProgressTotals(progress) {
  const totals = progress && progress.totals ? progress.totals : {};
  const answered = clampNumber(totals.answered, 0, 10000000, 0);
  const correct = clampNumber(totals.correct, 0, 10000000, 0);
  return {
    answered,
    correct,
    incorrect: clampNumber(totals.incorrect, 0, 10000000, 0),
    skipped: clampNumber(totals.skipped, 0, 10000000, 0),
    sessions: clampNumber(totals.sessions, 0, 1000000, 0),
    studyTimeSeconds: clampNumber(totals.studyTimeSeconds, 0, 1000000000, 0),
    averageQuestionTimeSeconds: answered > 0 ? Math.round(clampNumber(totals.studyTimeSeconds, 0, 1000000000, 0) / answered) : 0,
    accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    lastAnsweredAt: truncate(totals.lastAnsweredAt || '', 40),
    lastSessionAt: truncate(totals.lastSessionAt || '', 40)
  };
}

function hasLearningProgressActivity(progress) {
  const totals = learningProgressTotals(progress || {});
  return Boolean(totals.answered || totals.correct || totals.incorrect || totals.skipped || totals.sessions || totals.studyTimeSeconds);
}

function learningProgressAccuracyRows(map, limit = 8) {
  return Object.entries(sanitizeProgressMap(map))
    .map(([name, stat]) => ({
      name,
      answered: clampNumber(stat && stat.answered, 0, 10000000, 0),
      correct: clampNumber(stat && stat.correct, 0, 10000000, 0),
      accuracy: clampNumber(stat && stat.accuracy, 0, 100, 0)
    }))
    .filter((row) => row.answered)
    .sort((a, b) => b.answered - a.answered || a.name.localeCompare(b.name))
    .slice(0, limit);
}

async function readJsonKv(namespace, key, fallback) {
  if (!namespace) return fallback;
  try {
    const raw = await namespace.get(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

async function writeJsonKv(namespace, key, value, ttl = AUDIT_TTL_SECONDS) {
  if (!namespace) return false;
  try {
    await namespace.put(key, JSON.stringify(value), { expirationTtl: ttl });
    return true;
  } catch (_) {
    return false;
  }
}

async function sha256Base64Url(text) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(String(text || '')));
  return bytesToBase64Url(new Uint8Array(digest));
}

async function sha256HexFromBuffer(buffer) {
  if (!(buffer instanceof ArrayBuffer)) return '';
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function normalizeUsername(value) {
  const username = String(value || '').trim().normalize('NFKC').toLowerCase().replace(/\s+/g, '_');
  if (!username || username.length < 2 || username.length > 32) return '';
  if (!/^(?=.*[\p{L}\p{N}])[\p{L}\p{N}_.-]{2,32}$/u.test(username)) return '';
  return username;
}

function splitList(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  try {
    const parsed = JSON.parse(String(value));
    if (Array.isArray(parsed)) return parsed;
  } catch (_) {}
  return String(value).split(/[\s,，、;；]+/).map((item) => item.trim()).filter(Boolean);
}

function normalizeEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) return '';
  return email;
}

function registerCodeKey(username, email) {
  return `register-code:${username}:${email}`;
}

function passwordResetCodeKey(username, email) {
  return `password-reset-code:${username}:${email}`;
}

function registerUserRateKey(username, email) {
  return `register-rate:${username}:${email}`;
}

function passwordResetUserRateKey(username, email) {
  return `password-reset-rate:${username}:${email}`;
}

function registerIpRateKey(request) {
  const ip = clientIp(request) || 'unknown-ip';
  return `register-rate-ip:${ip}`;
}

function passwordResetIpRateKey(request) {
  const ip = clientIp(request) || 'unknown-ip';
  return `password-reset-rate-ip:${ip}`;
}

async function consumeSimpleRate(env, key, maxHits, windowSeconds) {
  if (!env.FM_AUDIT) return { ok: true, remaining: maxHits };
  const state = await readJsonKv(env.FM_AUDIT, key, { hits: [] });
  const now = Date.now();
  const hits = Array.isArray(state.hits)
    ? state.hits.filter((time) => now - time < windowSeconds * 1000)
    : [];

  if (hits.length >= maxHits) {
    return {
      ok: false,
      retryAfter: Math.ceil((windowSeconds * 1000 - (now - hits[0])) / 1000)
    };
  }

  hits.push(now);
  await writeJsonKv(env.FM_AUDIT, key, { hits }, windowSeconds * 2);
  return { ok: true, remaining: Math.max(0, maxHits - hits.length) };
}

async function createPasswordRecord(password) {
  const salt = randomBase64Url(16);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64UrlToBytes(salt),
      iterations: PASSWORD_HASH_ITERATIONS,
      hash: 'SHA-256'
    },
    key,
    256
  );
  return {
    alg: 'PBKDF2-SHA256',
    iterations: PASSWORD_HASH_ITERATIONS,
    salt,
    hash: bytesToBase64Url(new Uint8Array(bits))
  };
}

async function verifyPassword(password, record) {
  if (!record || record.alg !== 'PBKDF2-SHA256' || !record.salt || !record.hash) return false;
  const iterations = Math.max(1, Math.min(Number(record.iterations || PASSWORD_HASH_ITERATIONS), PASSWORD_HASH_ITERATIONS));
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64UrlToBytes(record.salt),
      iterations,
      hash: 'SHA-256'
    },
    key,
    256
  );
  return timingSafeEqual(bytesToBase64Url(new Uint8Array(bits)), record.hash);
}

async function readUserAccount(env, username) {
  if (!env.FM_AUDIT || !username) return null;
  return readJsonKv(env.FM_AUDIT, `account:${username}`, null);
}

async function readUserAccountAuthState(env, username) {
  const normalized = normalizeUsername(username);
  if (!normalized) return { ok: false, account: null, error: 'missing_username' };
  if (!env.FM_AUDIT) return { ok: false, account: null, error: 'account_storage_unavailable' };
  try {
    const raw = await env.FM_AUDIT.get(`account:${normalized}`);
    return { ok: true, account: raw ? JSON.parse(raw) : null };
  } catch (error) {
    return {
      ok: false,
      account: null,
      error: truncate(error && error.message ? error.message : error, 160)
    };
  }
}

async function writeUserAccount(env, username, account) {
  if (!env.FM_AUDIT || !username) return false;
  try {
    await env.FM_AUDIT.put(`account:${username}`, JSON.stringify(account));
  } catch (_) {
    return false;
  }
  if (account.email) {
    try {
      await env.FM_AUDIT.put(`account-email:${account.email}`, JSON.stringify({ username }));
    } catch (_) {
      // The account record is authoritative. A transient email-index write must not
      // make registration or login fail after the password has been stored.
    }
  }
  return true;
}

function accountPasswordSessionVersion(account) {
  if (!account || account.disabled) return '';
  const explicit = truncate(account.passwordSessionVersion || '', 80);
  if (explicit) return explicit;
  const changedAt = truncate(account.passwordChangedAt || '', 40);
  return changedAt ? `changed:${changedAt}` : '';
}

async function staticAccountSessionVersion(env, username) {
  const normalized = normalizeUsername(username);
  const credential = staticCredentialForUsername(env, normalized);
  const secret = String(env.AUTH_COOKIE_SECRET || '');
  if (!normalized || !credential || !credential.password || !secret) return '';
  const digest = await sha256Base64Url(`static-account-v3:${normalized}:${credential.kind}:${credential.password}:${secret}`);
  return truncate(`static:${digest}`, 80);
}

function ensureAccountPasswordSessionVersion(account) {
  if (!account || account.disabled || !account.password) return '';
  const existing = accountPasswordSessionVersion(account);
  if (existing) return existing;
  account.passwordSessionVersion = randomBase64Url(18);
  account.updatedAt = new Date().toISOString();
  return account.passwordSessionVersion;
}

function passwordHistoryRecord(item) {
  if (!item || typeof item !== 'object') return null;
  if (item.alg && item.salt && item.hash) return item;
  if (item.password && typeof item.password === 'object') return passwordHistoryRecord(item.password);
  return null;
}

function normalizedPasswordHistory(account, replacedAt = '') {
  const history = [];
  const push = (item) => {
    const record = passwordHistoryRecord(item);
    if (!record) return;
    history.push({
      password: record,
      passwordChangedAt: truncate(item && item.passwordChangedAt || item && item.changedAt || '', 40),
      replacedAt: truncate(item && item.replacedAt || replacedAt || '', 40)
    });
  };
  if (account && account.password) {
    push({
      password: account.password,
      passwordChangedAt: account.passwordChangedAt || account.updatedAt || account.createdAt || '',
      replacedAt
    });
  }
  if (account && Array.isArray(account.passwordHistory)) {
    account.passwordHistory.forEach(push);
  }
  return history.slice(0, PASSWORD_HISTORY_LIMIT);
}

async function passwordMatchesHistory(password, account) {
  const history = normalizedPasswordHistory({ passwordHistory: account && account.passwordHistory || [] });
  for (const item of history) {
    if (await verifyPassword(password, item.password)) return true;
  }
  return false;
}

async function validateNewAccountPassword(env, username, password, account) {
  const normalized = normalizeUsername(username);
  if (!normalized || !password) {
    return { ok: false, error: 'invalid_password', message: '新密码不正确。' };
  }
  const staticCredential = staticCredentialForUsername(env, normalized);
  if (isAdminUsername(normalized, env) && staticCredential && staticCredential.password &&
    timingSafeEqual(password, staticCredential.password)) {
    return {
      ok: false,
      error: 'password_reused_static',
      message: '新密码不能改回旧默认密码或环境变量里的旧密码。'
    };
  }
  if (account && account.password && await verifyPassword(password, account.password)) {
    return { ok: false, error: 'password_unchanged', message: '新密码不能和当前密码完全一样。' };
  }
  if (await passwordMatchesHistory(password, account)) {
    return {
      ok: false,
      error: 'password_reused_recent',
      message: '新密码不能改回最近使用过的旧密码。'
    };
  }
  return { ok: true };
}

function registrationUsers(env) {
  const configured = splitList(env.STUDENT_REGISTRATION_USERS || env.ALLOWED_STUDENT_REGISTRATION_USERS);
  const reserved = new Set(RESERVED_STUDENT_REGISTRATION_USERS.map(normalizeUsername));
  return Array.from(new Set([...DEFAULT_STUDENT_REGISTRATION_USERS, ...configured].map(normalizeUsername).filter(Boolean)))
    .filter((user) => !reserved.has(user));
}

async function readStudentAccessPolicy(env) {
  const configuredActiveValue = env.ACTIVE_STUDENT_USERS || env.STUDENT_ACTIVE_USERS || '';
  const configuredActive = splitList(configuredActiveValue);
  const configuredLocked = splitList(env.LOCKED_STUDENT_USERS || env.STUDENT_LOCKED_USERS);
  const saved = await readJsonKv(env.FM_AUDIT, STUDENT_ACCESS_KEY, {});
  const savedPolicyVersion = Number(saved && (saved.policyVersion || saved.version || 0)) || 0;
  const defaultActiveSet = new Set(DEFAULT_ACTIVE_STUDENT_USERS.map(normalizeUsername));
  const activeUsers = Array.from(new Set([
    ...DEFAULT_ACTIVE_STUDENT_USERS,
    ...configuredActive,
    ...splitList(saved && saved.activeUsers),
    ...splitList(saved && saved.allowedUsers)
  ].map(normalizeUsername).filter(Boolean)));
  const savedLockedUsers = [
    ...splitList(saved && saved.lockedUsers),
    ...splitList(saved && saved.disabledUsers)
  ].map(normalizeUsername).filter(Boolean);
  const explicitDefaultLocks = splitList(saved && (saved.lockedDefaultUsers || saved.explicitDefaultLockedUsers))
    .map(normalizeUsername)
    .filter((user) => defaultActiveSet.has(user));
  const legacyDefaultLocksIgnored = savedPolicyVersion < STUDENT_ACCESS_POLICY_VERSION
    ? savedLockedUsers.filter((user) => defaultActiveSet.has(user))
    : [];
  const lockedUsers = Array.from(new Set([
    ...configuredLocked,
    ...savedLockedUsers.filter((user) => !defaultActiveSet.has(user)),
    ...explicitDefaultLocks
  ].map(normalizeUsername).filter(Boolean)));
  return {
    activeUsers,
    lockedUsers,
    policyVersion: STUDENT_ACCESS_POLICY_VERSION,
    legacyDefaultLocksIgnored,
    updatedAt: saved && saved.updatedAt || null,
    updatedBy: saved && saved.updatedBy || null
  };
}

async function writeStudentAccessPolicy(env, policy, session) {
  if (!env.FM_AUDIT) return false;
  const defaultActiveSet = new Set(DEFAULT_ACTIVE_STUDENT_USERS.map(normalizeUsername));
  const activeUsers = Array.from(new Set(splitList(policy && policy.activeUsers).map(normalizeUsername).filter(Boolean)));
  const requestedLockedUsers = Array.from(new Set(splitList(policy && policy.lockedUsers).map(normalizeUsername).filter(Boolean)));
  const lockedUsers = requestedLockedUsers.filter((user) => !defaultActiveSet.has(user));
  const lockedDefaultUsers = requestedLockedUsers.filter((user) => defaultActiveSet.has(user));
  try {
    await env.FM_AUDIT.put(STUDENT_ACCESS_KEY, JSON.stringify({
      policyVersion: STUDENT_ACCESS_POLICY_VERSION,
      activeUsers,
      lockedUsers,
      lockedDefaultUsers,
      updatedAt: new Date().toISOString(),
      updatedBy: normalizeUsername(session && session.username) || null
    }));
    return true;
  } catch (_) {
    return false;
  }
}

async function studentAccessStatus(env, username) {
  const normalized = normalizeUsername(username);
  if (!normalized) return { ok: false, reason: 'missing_user', activeUsers: [], lockedUsers: [] };
  const policy = await readStudentAccessPolicy(env);
  if (policy.lockedUsers.includes(normalized)) return { ok: false, reason: 'locked', ...policy };
  if (!policy.activeUsers.includes(normalized)) return { ok: false, reason: 'not_allowed', ...policy };
  return { ok: true, reason: 'active', ...policy };
}

async function verifyStoredAccountPassword(env, username, password) {
  const account = await readUserAccount(env, username);
  return verifyStoredAccountRecordPassword(env, username, account, password);
}

async function verifyStoredAccountRecordPassword(env, username, account, password) {
  if (!account || account.disabled || !account.password) return false;
  const ok = await verifyPassword(password, account.password);
  if (!ok) return false;
  ensureAccountPasswordSessionVersion(account);
  account.lastLoginAt = new Date().toISOString();
  try {
    await writeUserAccount(env, username, account);
  } catch (_) {
    // A transient KV write-limit failure must not block a valid login.
  }
  return account;
}

async function hasStoredAccountPassword(env, username) {
  const account = await readUserAccount(env, username);
  return !!(account && !account.disabled && account.password);
}

async function verifyCurrentAccountPassword(env, username, password) {
  const normalized = normalizeUsername(username);
  if (!normalized || !password) return false;
  const accountState = await readUserAccountAuthState(env, normalized);
  if (!accountState.ok) return false;
  const account = accountState.account;
  if (account && !account.disabled && account.password) return verifyPassword(password, account.password);
  const staticCredential = staticCredentialForUsername(env, normalized);
  return !!(staticCredential && staticCredential.password && timingSafeEqual(password, staticCredential.password));
}

function passwordResetEligibility(env, username, account, email) {
  const normalized = normalizeUsername(username);
  if (!normalized || !account || account.disabled || !account.password) {
    return { ok: false, reason: 'account_not_found' };
  }
  if (isAdminUsername(normalized, env) || account.role === 'teacher' || account.role === 'admin') {
    return { ok: false, reason: 'teacher_not_allowed' };
  }
  const accountEmail = normalizeEmail(account.email || '');
  if (!accountEmail || accountEmail !== email) return { ok: false, reason: 'email_mismatch' };
  return { ok: true, accountEmail };
}

async function updateAccountPassword(env, username, password, session) {
  const normalized = normalizeUsername(username);
  if (!env.FM_AUDIT || !normalized) return null;
  const existingState = await readUserAccountAuthState(env, normalized);
  if (!existingState.ok) return null;
  const existing = existingState.account;
  if (!existing || existing.disabled || !existing.password) return null;
  const nowIso = new Date().toISOString();
  const admin = isAdminUsername(normalized, env);
  const account = {
    ...existing,
    username: normalized,
    role: existing.role || (admin ? 'teacher' : 'student'),
    access: existing.access || (admin ? 'active' : 'locked'),
    purchased: typeof existing.purchased === 'boolean' ? existing.purchased : admin,
    entitlements: Array.isArray(existing.entitlements) ? existing.entitlements : [],
    disabled: false,
    password: await createPasswordRecord(password),
    passwordHistory: normalizedPasswordHistory(existing, nowIso),
    passwordChangedAt: nowIso,
    passwordSessionVersion: randomBase64Url(18),
    updatedAt: nowIso,
    updatedBy: normalizeUsername(session && session.username) || normalized,
    createdAt: existing.createdAt || nowIso
  };
  return await writeUserAccount(env, normalized, account) ? account : null;
}

async function rotateAccountSessionVersion(env, username, session) {
  const normalized = normalizeUsername(username);
  if (!env.FM_AUDIT || !normalized) return null;
  const existingState = await readUserAccountAuthState(env, normalized);
  if (!existingState.ok) return null;
  const existing = existingState.account;
  if (!existing || existing.disabled || !existing.password) return null;
  const nowIso = new Date().toISOString();
  const account = {
    ...existing,
    passwordSessionVersion: randomBase64Url(18),
    sessionsRevokedAt: nowIso,
    sessionsRevokedBy: normalizeUsername(session && session.username) || normalized,
    updatedAt: nowIso,
    updatedBy: normalizeUsername(session && session.username) || normalized
  };
  return await writeUserAccount(env, normalized, account) ? account : null;
}

async function userSiteAccessState(session, env) {
  if (!session || !session.username) return { ok: false, reason: 'missing_session' };
  if (isAdmin(session, env)) return { ok: true, reason: 'teacher' };
  const username = normalizeUsername(session.username);
  if (staticStudentCredentialForUsername(env, username)) return { ok: true, reason: 'qa_static_student' };
  const account = await readUserAccount(env, username);
  if (account && account.disabled) return { ok: false, reason: 'disabled' };
  const access = await studentAccessStatus(env, username);
  return {
    ok: !!access.ok,
    reason: access.reason || (access.ok ? 'active' : 'not_allowed'),
    policyVersion: access.policyVersion || STUDENT_ACCESS_POLICY_VERSION
  };
}

async function userHasSiteAccess(session, env) {
  if (!session || !session.username) return false;
  return (await userSiteAccessState(session, env)).ok;
}

async function accountHasLegacySiteAccess(session, env) {
  if (!session || !session.username) return false;
  if (isAdmin(session, env)) return true;
  const username = normalizeUsername(session.username);
  if (DEFAULT_ACTIVE_STUDENT_USERS.includes(username)) return true;
  const account = await readUserAccount(env, username);
  if (!account || account.disabled) return false;
  if (account.purchased === true || account.access === 'active') return true;
  return Array.isArray(account.entitlements) && account.entitlements.includes('site');
}

async function userCanViewPrivateQiVideo(session, env) {
  if (!session || !session.username) return false;
  if (isAdmin(session, env)) return true;
  const username = normalizeUsername(session.username);
  const account = await readUserAccount(env, username);
  if (account && account.disabled) return false;
  const access = await studentAccessStatus(env, username);
  return username === 'qi' && access.ok;
}

function isLocalRequest(request) {
  const host = new URL(request.url).hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

function shouldUseMailChannelsFallback(context) {
  const { env, request } = context;
  if (env.MAILCHANNELS_DISABLED === '1' || env.EMAIL_DEV_MODE === '1' || isLocalRequest(request)) return false;
  const url = new URL(request.url);
  return url.protocol === 'https:' && SAFE_NEXT_HOSTS.has(url.hostname);
}

async function sendVerificationEmail(context, email, code, username, options = {}) {
  const { env, request } = context;
  const from = env.EMAIL_FROM || env.MAIL_FROM || env.RESEND_FROM || 'no-reply@lghui.online';
  const purpose = options.purpose || 'register';
  const purposeText = purpose === 'password-reset' ? '重置密码' : '注册流体力学学习平台';
  const subject = purpose === 'password-reset'
    ? '流体力学学习平台密码重置验证码'
    : '流体力学学习平台注册验证码';
  const text = [
    `账号 ${username} 正在${purposeText}。`,
    `验证码：${code}`,
    '10 分钟内有效。'
  ].join('\n');
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#0f172a"><p>账号 <b>${escapeHtml(username)}</b> 正在${escapeHtml(purposeText)}。</p><p style="font-size:28px;letter-spacing:6px;font-weight:800">${escapeHtml(code)}</p><p>验证码 10 分钟内有效。</p></div>`;
  const failures = [];
  const rememberFailure = (failure) => {
    if (failure && !failure.ok) failures.push(failure);
  };
  const combinedFailure = (fallbackError = 'email_failed') => {
    if (!failures.length) return { ok: false, error: fallbackError };
    const first = failures[0] || {};
    const detail = failures
      .map((item) => {
        const pieces = [item.error || 'email_failed'];
        if (item.status) pieces.push(`HTTP ${item.status}`);
        if (item.detail) pieces.push(item.detail);
        return pieces.join(': ');
      })
      .join(' | ')
      .slice(0, 220);
    return {
      ok: false,
      error: first.error || fallbackError,
      status: first.status || 0,
      detail
    };
  };

  if (env.EMAIL && typeof env.EMAIL.send === 'function') {
    try {
      const result = await env.EMAIL.send({
        to: email,
        from: { email: from, name: env.EMAIL_FROM_NAME || '流体力学学习平台' },
        subject,
        text,
        html
      });
      return { ok: true, provider: 'cloudflare-email', messageId: result?.messageId || '' };
    } catch (error) {
      rememberFailure({
        ok: false,
        error: 'cloudflare_email_failed',
        status: error?.code || 0,
        detail: String(error?.message || error || '').slice(0, 180)
      });
    }
  }

  if (env.RESEND_API_KEY && from) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to: [email], subject, text, html })
    });
    if (response.ok) return { ok: true, provider: 'resend' };
    const detail = await safeResponseDetail(response);
    rememberFailure({ ok: false, error: 'resend_failed', status: response.status, detail });
  }

  if (env.POSTMARK_SERVER_TOKEN && from) {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ From: from, To: email, Subject: subject, TextBody: text, HtmlBody: html, MessageStream: env.POSTMARK_MESSAGE_STREAM || 'outbound' })
    });
    if (response.ok) return { ok: true, provider: 'postmark' };
    const detail = await safeResponseDetail(response);
    rememberFailure({ ok: false, error: 'postmark_failed', status: response.status, detail });
  }

  if (env.EMAIL_WEBHOOK_URL) {
    const headers = { 'Content-Type': 'application/json' };
    if (env.EMAIL_WEBHOOK_TOKEN) headers.Authorization = `Bearer ${env.EMAIL_WEBHOOK_TOKEN}`;
    const response = await fetch(env.EMAIL_WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ to: email, from, subject, text, html, code, username })
    });
    if (response.ok) return { ok: true, provider: 'webhook' };
    const detail = await safeResponseDetail(response);
    rememberFailure({ ok: false, error: 'webhook_failed', status: response.status, detail });
  }

  if ((env.MAILCHANNELS_DOMAIN || shouldUseMailChannelsFallback(context)) && from) {
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: from, name: env.EMAIL_FROM_NAME || 'Fluid Mechanics' },
        subject,
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html }
        ]
      })
    });
    if (response.ok) return { ok: true, provider: 'mailchannels' };
    const detail = await safeResponseDetail(response);
    rememberFailure({ ok: false, error: 'mailchannels_failed', status: response.status, detail });
  }

  if (env.EMAIL_DEV_MODE === '1' || isLocalRequest(request)) {
    return { ok: true, provider: 'dev', devCode: code };
  }

  if (failures.length) return combinedFailure();
  return { ok: false, error: 'email_not_configured' };
}

async function safeResponseDetail(response) {
  try {
    const text = await response.text();
    if (!text) return `HTTP ${response.status}`;
    try {
      const data = JSON.parse(text);
      return String(data.message || data.detail || data.error || text).slice(0, 220);
    } catch {
      return text.replace(/\s+/g, ' ').slice(0, 220);
    }
  } catch {
    return `HTTP ${response.status}`;
  }
}

function loginRateKey(request, username) {
  const ip = clientIp(request) || 'unknown-ip';
  const user = String(username || 'unknown-user').toLowerCase().replace(/[^a-z0-9_.@-]/g, '_').slice(0, 80);
  return `login-rate:${ip}:${user}`;
}

function loginIpRateKey(request) {
  const ip = clientIp(request) || 'unknown-ip';
  return `login-rate-ip:${ip}`;
}

async function readLoginRateState(env, key) {
  return readJsonKv(env.FM_AUDIT, key, { failures: [], lockedUntil: 0 });
}

async function refreshLoginRateState(env, key, state, lockSeconds) {
  const next = state && typeof state === 'object' ? state : { failures: [], lockedUntil: 0 };
  const now = Date.now();

  if (next.lockedUntil && now < next.lockedUntil) {
    return {
      ok: false,
      key,
      retryAfter: Math.ceil((next.lockedUntil - now) / 1000),
      state: next
    };
  }

  next.failures = Array.isArray(next.failures)
    ? next.failures.filter((time) => now - time < LOGIN_WINDOW_SECONDS * 1000)
    : [];
  next.lockedUntil = 0;
  await writeJsonKv(env.FM_AUDIT, key, next, lockSeconds + LOGIN_WINDOW_SECONDS);
  return { ok: true, key, retryAfter: 0, state: next };
}

async function checkLoginRate(env, request, username) {
  const key = loginRateKey(request, username);
  const ipKey = loginIpRateKey(request);
  const userState = await readLoginRateState(env, key);
  const ipState = await readLoginRateState(env, ipKey);
  const userRate = await refreshLoginRateState(env, key, userState, LOGIN_LOCK_SECONDS);
  const ipRate = await refreshLoginRateState(env, ipKey, ipState, LOGIN_IP_LOCK_SECONDS);

  if (!userRate.ok || !ipRate.ok) {
    const retryAfter = Math.max(userRate.retryAfter || 0, ipRate.retryAfter || 0);
    return {
      ok: false,
      key,
      ipKey,
      retryAfter,
      state: userRate.state,
      ipState: ipRate.state
    };
  }

  return {
    ok: true,
    key,
    ipKey,
    retryAfter: 0,
    state: userRate.state,
    ipState: ipRate.state
  };
}

async function recordLoginFailureKey(env, key, state, maxFailures, lockSeconds) {
  const now = Date.now();
  const next = state && typeof state === 'object' ? state : { failures: [], lockedUntil: 0 };
  next.failures = Array.isArray(next.failures)
    ? next.failures.filter((time) => now - time < LOGIN_WINDOW_SECONDS * 1000)
    : [];
  next.failures.push(now);
  if (next.failures.length >= maxFailures) {
    next.lockedUntil = now + lockSeconds * 1000;
    next.failures = [];
  }
  await writeJsonKv(env.FM_AUDIT, key, next, lockSeconds + LOGIN_WINDOW_SECONDS);
  return next;
}

async function recordLoginFailure(env, rate) {
  const userNext = await recordLoginFailureKey(env, rate.key, rate.state, LOGIN_MAX_FAILURES, LOGIN_LOCK_SECONDS);
  await recordLoginFailureKey(env, rate.ipKey, rate.ipState, LOGIN_IP_MAX_FAILURES, LOGIN_IP_LOCK_SECONDS);
  return userNext;
}

async function resetLoginRate(env, key, ipKey) {
  await writeJsonKv(env.FM_AUDIT, key, { failures: [], lockedUntil: 0 }, LOGIN_WINDOW_SECONDS);
  await writeJsonKv(env.FM_AUDIT, ipKey, { failures: [], lockedUntil: 0 }, LOGIN_WINDOW_SECONDS);
}

function renderLogin(next = '/', message = '') {
  const safe = safeNext(next);
  const escapedNext = escapeHtml(safe);
  const encodedNext = encodeURIComponent(safe);
  const targetHref = escapeHtml(publicTargetHrefForNext(safe));
  const escapedMessage = escapeHtml(message);
  const notice = escapedMessage ? `<div class="notice">${escapedMessage}</div>` : '';
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="theme-color" content="#f6f8fb">
  <title>流体力学学习平台</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif;background:#f6f8fb;color:#111827;--accent:#0f766e;--line:rgba(17,24,39,.11);--muted:#5f6f82;--panel:rgba(255,255,255,.82);--soft:rgba(15,118,110,.08);--shadow:0 30px 90px rgba(15,23,42,.14);--ease:cubic-bezier(.22,1,.36,1);--r239-orange:#f97316;--r239-blue:#2563eb}
    *{box-sizing:border-box}
    html{min-height:100%;text-rendering:optimizeLegibility;-webkit-text-size-adjust:100%}
    body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:max(24px,env(safe-area-inset-top)) max(18px,env(safe-area-inset-right)) max(24px,env(safe-area-inset-bottom)) max(18px,env(safe-area-inset-left));background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(240,245,251,.94)),linear-gradient(115deg,rgba(20,184,166,.12),transparent 48%,rgba(249,115,22,.10));-webkit-font-smoothing:antialiased;overflow-x:hidden}
    main{width:min(1040px,100%);display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,440px);gap:clamp(20px,4vw,42px);align-items:stretch}
    .hero,.panel{border:1px solid var(--line);border-radius:26px;background:var(--panel);box-shadow:var(--shadow);backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);overflow:hidden}
    .hero{padding:clamp(30px,5vw,54px);display:flex;flex-direction:column;justify-content:space-between;min-height:460px;background:linear-gradient(145deg,rgba(17,24,39,.94),rgba(15,23,42,.86)),linear-gradient(115deg,rgba(20,184,166,.38),transparent 52%,rgba(249,115,22,.28));color:#fff}
    .brand{display:flex;align-items:center;gap:12px;font-weight:800}
    .mark{width:48px;height:48px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#14b8a6,#f97316);box-shadow:inset 0 1px 0 rgba(255,255,255,.38),0 18px 38px rgba(20,184,166,.20);font-size:22px}
    h1{margin:34px 0 16px;font-size:64px;line-height:1.02;letter-spacing:0;color:inherit}
    p{margin:0;color:var(--muted);line-height:1.72;font-size:16px}
    .hero p{max-width:38em;color:#cbd5e1;font-size:18px}
    .upgrade-kicker{display:inline-flex;align-items:center;gap:8px;margin-top:30px;padding:8px 11px;border:1px solid rgba(94,234,212,.30);border-radius:999px;background:rgba(20,184,166,.13);color:#ccfbf1;font-size:13px;font-weight:900}
    .upgrade-kicker i{width:8px;height:8px;border-radius:999px;background:#22c55e;box-shadow:0 0 0 6px rgba(34,197,94,.13)}
    .upgrade-note{margin-top:22px;padding:18px;border:1px solid rgba(255,255,255,.15);border-radius:18px;background:linear-gradient(135deg,rgba(20,184,166,.16),rgba(249,115,22,.13));box-shadow:inset 0 1px 0 rgba(255,255,255,.12)}
    .upgrade-note b{display:block;margin-bottom:6px;font-size:18px}
    .upgrade-note span{display:block;color:#cbd5e1;line-height:1.65}
    .upgrade-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:16px}
    .upgrade-links a{min-height:44px;display:flex;align-items:center;justify-content:center;border-radius:13px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.14);color:#fff;text-decoration:none;font-size:13px;font-weight:900}
    .meta{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:34px}
    .meta div{padding:14px;border-radius:16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}
    .meta b{display:block;font-size:18px}
    .meta span{display:block;margin-top:3px;color:#aab6c8;font-size:12px}
    .panel{padding:clamp(26px,4vw,38px);display:flex;flex-direction:column}
    .panel h2{margin:0 0 8px;font-size:30px;letter-spacing:0}
    .sub{margin-bottom:26px}
    form{display:grid;gap:16px}
    label{display:block;margin:0 0 8px;color:#405066;font-size:13px;font-weight:750}
    input{width:100%;min-height:52px;border:1px solid var(--line);border-radius:14px;padding:0 15px;background:rgba(255,255,255,.72);color:#111827;font:500 16px/1.2 inherit;outline:none;transition:border-color 160ms var(--ease),box-shadow 160ms var(--ease),background 160ms var(--ease)}
    input:focus{border-color:rgba(15,118,110,.60);box-shadow:0 0 0 5px rgba(20,184,166,.12);background:#fff}
    button{position:relative;width:100%;min-height:52px;margin-top:4px;border:0;border-radius:14px;background:#111827;color:#fff;font:800 16px/1 inherit;cursor:pointer;box-shadow:0 14px 36px rgba(17,24,39,.18);transition:transform 160ms var(--ease),box-shadow 160ms var(--ease),opacity 160ms var(--ease);touch-action:manipulation}
    button:hover{transform:translateY(-1px);box-shadow:0 18px 44px rgba(17,24,39,.22)}
    button:active{transform:translateY(0) scale(.99)}
    button[disabled]{opacity:.72;cursor:progress}
    .cta-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:2px 0 6px}
    .cta{min-height:52px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;border:1px solid var(--line);font-weight:850;text-decoration:none;transition:transform 160ms var(--ease),box-shadow 160ms var(--ease),background 160ms var(--ease),border-color 160ms var(--ease);touch-action:manipulation}
    .cta:hover{transform:translateY(-1px)}
    .cta.primary{background:linear-gradient(135deg,#0f766e,#111827);color:#fff;border-color:#0f766e;box-shadow:0 14px 36px rgba(15,118,110,.18)}
    .cta.secondary{background:rgba(15,118,110,.08);color:var(--accent)}
	    .panel-upgrade{margin:0 0 16px;padding:14px 15px;border:1px solid rgba(15,118,110,.18);border-left:4px solid var(--r239-orange);border-radius:15px;background:linear-gradient(135deg,rgba(20,184,166,.09),rgba(249,115,22,.08));line-height:1.55}
	    .panel-upgrade strong{display:block;margin-bottom:4px;color:#0f172a}
	    .panel-upgrade span{display:block;color:#5f6f82;font-size:13px}
	    .notice{margin:0 0 16px;padding:13px 15px;border-radius:14px;background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;line-height:1.55}
	    .links{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
	    .links a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:0 15px;background:var(--soft);color:var(--accent);font-weight:800;text-decoration:none;line-height:1.25}
    .hint{margin-top:auto;padding-top:22px;color:#7b8797;font-size:13px;line-height:1.65}
    .fine{display:flex;align-items:center;gap:9px;margin-top:20px;color:#8b96a6;font-size:13px}
    .dot{width:8px;height:8px;border-radius:999px;background:#14b8a6;box-shadow:0 0 0 6px rgba(20,184,166,.12)}
    @media (max-width:820px){main{grid-template-columns:1fr}.hero{min-height:auto}.meta{grid-template-columns:1fr 1fr}.panel{min-height:0}.upgrade-links{grid-template-columns:1fr}}
    @media (max-width:520px){body{place-items:stretch}main{gap:14px}.hero,.panel{border-radius:20px}.hero{padding:26px}.meta{grid-template-columns:1fr}h1{font-size:40px}}
    @media (prefers-color-scheme:dark){:root{background:#070d16;color:#f8fafc;--line:rgba(255,255,255,.12);--muted:#aab6c8;--panel:rgba(15,23,42,.78);--soft:rgba(20,184,166,.13);--shadow:0 30px 90px rgba(0,0,0,.36)}body{background:linear-gradient(135deg,rgba(7,13,22,.98),rgba(16,24,39,.96)),linear-gradient(115deg,rgba(20,184,166,.14),transparent 48%,rgba(249,115,22,.12))}.panel h2{color:#f8fafc}input{background:rgba(15,23,42,.74);color:#f8fafc}input:focus{background:#0f172a}button{background:#fff;color:#111827}.hint{color:#9ca8b8}.panel-upgrade strong{color:#f8fafc}.panel-upgrade span{color:#cbd5e1}}
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
  </style>
</head>
<body>
  <main>
    <section class="hero" aria-label="平台简介">
      <div>
        <div class="brand"><span class="mark" aria-hidden="true">流</span><span>Fluid Mechanics</span></div>
        <div class="upgrade-kicker"><i aria-hidden="true"></i><span>当前入口修复与公式渲染加固 · ${EDGE_HOME_VERSION}</span></div>
        <h1>流体力学学习平台</h1>
        <p>题库、真题、知识点、视频和教师工具统一放在受保护的学习空间里。进题仍先看题目选路图；选出公式后立刻查适用条件、边界条件、单位方向和常见错因，再回真题训练重做一遍。</p>
        <div class="upgrade-note" aria-label="当前入口可见升级">
          <b>未登录页已切到当前入口：先清旧入口，再进入公式回查</b>
          <span>${EDGE_HOME_VERSION} · 本轮先处理旧 Service Worker、旧缓存和 edge_refresh 循环；学习路线继续按“适用条件 → 边界条件 → 单位方向 → 常见错因 → 真题重做”排顺序。</span>
          <div class="upgrade-links" aria-label="公式回查入口预览">
            <a href="/modules/knowledge-upgrade-2026.html">知识升级入口</a>
            <a href="/resources/fluid-181103-html/index.html" data-round356-home-181103-icon="legacy-login">181103 资料库</a>
            <a href="/modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList">181103 资料题库</a>
            <a href="/modules/real-exams-dynamic.html?edge_refresh=${EDGE_HOME_VERSION}">真题训练</a>
            <a href="/resources/fluid-original-animations.html">自制动画</a>
            <a href="/ultimate-beautiful-formulas.html">公式回查</a>
            <a href="/modules/knowledge-detail.html">适用条件</a>
            <a href="/modules/fluid-intensive-training.html">公式选择</a>
            <a href="/resources.html">单位方向</a>
            <a href="/practice.html">错题复盘</a>
          </div>
        </div>
      </div>
      <div class="meta" aria-hidden="true">
        <div><b>Edge</b><span>边缘门禁</span></div>
        <div><b>Fast</b><span>轻量首屏</span></div>
        <div><b>Private</b><span>资料保护</span></div>
      </div>
    </section>
    <section class="panel" aria-label="登录">
      <h2>安全登录</h2>
	      <p class="sub">已有账号直接登录；新账号用邮箱验证码注册；忘记密码可用登记邮箱重置。</p>
      <div class="panel-upgrade" aria-label="当前入口升级提示">
        <strong>${EDGE_HOME_VERSION} 已在线</strong>
        <span>本轮重点是修复旧入口循环：旧缓存先清理，旧 edge_refresh 自动升到当前版本；公式回查路线继续保留。</span>
      </div>
      ${notice}
      <div class="cta-row">
        <a class="cta primary" href="/_edge-register?next=${encodedNext}">注册账号</a>
        <a class="cta secondary" href="/_edge-reset?next=${encodedNext}">修复入口</a>
      </div>
      <form method="post" action="/_edge-login">
        <input type="hidden" name="next" value="${escapedNext}">
        <input type="hidden" name="browserSessionId" id="browserSessionId">
        <input type="hidden" name="deviceProfile" id="deviceProfile">
        <input type="hidden" name="deviceFingerprint" id="deviceFingerprint">
        <div>
          <label for="username">用户名</label>
          <input id="username" name="username" autocomplete="username" autofocus required>
        </div>
        <div>
          <label for="password">密码</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required>
        </div>
        <button id="submit" type="submit">进入系统</button>
      </form>
	      <div class="links">
		        <a id="targetLink" href="${targetHref}">当前入口</a>
		        <a href="/_edge-forgot-password?next=${encodedNext}">忘记密码</a>
		        <a href="/_edge-reset?next=${encodedNext}">修复后进入</a>
		        <a href="/_edge-status">检查当前入口</a>
	        <a href="/_edge-admin">教师监控</a>
	      </div>
	      <div class="fine"><span class="dot" aria-hidden="true"></span><span>登录成功后会自动回到刚才的页面。</span></div>
	      <div class="hint">未购买账号可注册，但进入后只显示锁定页；购买或开通后再访问课程内容。</div>
    </section>
  </main>
  <script>
    const form = document.querySelector('form');
    const button = document.getElementById('submit');
    const sidInput = document.getElementById('browserSessionId');
    const deviceInput = document.getElementById('deviceProfile');
    const fingerprintInput = document.getElementById('deviceFingerprint');
    async function clearOldEdgeStorage(){
      try{
        if('serviceWorker' in navigator){
          const registrations=await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(registration=>registration.unregister()));
        }
        if(window.caches&&caches.keys){
          const keys=await caches.keys();
          await Promise.all(keys.map(key=>caches.delete(key)));
        }
      }catch(_){}
    }
    function browserSessionId(){
      const key='fm_browser_session_id';
      try{let v=localStorage.getItem(key);if(!v){v=(crypto.randomUUID?crypto.randomUUID():(Date.now()+'-'+Math.random().toString(36).slice(2)));localStorage.setItem(key,v)}return v}catch(_){return Date.now()+'-'+Math.random().toString(36).slice(2)}
    }
    function deviceProfile(){return {userAgent:navigator.userAgent||'',platform:navigator.platform||'',language:navigator.language||'',timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'',touchPoints:navigator.maxTouchPoints||0,hardwareConcurrency:navigator.hardwareConcurrency||0,deviceMemory:navigator.deviceMemory||0,uaData:navigator.userAgentData?{mobile:!!navigator.userAgentData.mobile,platform:navigator.userAgentData.platform||''}:null,screen:screen?{width:screen.width||0,height:screen.height||0,availWidth:screen.availWidth||0,availHeight:screen.availHeight||0,colorDepth:screen.colorDepth||0,pixelRatio:devicePixelRatio||1}:{}}}
    async function deviceFingerprint(){
      try{
        if(!window.crypto||!window.crypto.subtle)return '';
        const key='fm_device_fp';
        const cached=localStorage.getItem(key);
        if(cached)return cached;
        const source=[navigator.userAgent||'',navigator.language||'',(screen&&screen.width?screen.width:0)+'x'+(screen&&screen.height?screen.height:0),new Date().getTimezoneOffset(),navigator.hardwareConcurrency||'',navigator.platform||''].join('|');
        const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source));
        let text='';new Uint8Array(digest).forEach(byte=>{text+=String.fromCharCode(byte)});const value=btoa(text);localStorage.setItem(key,value);return value;
      }catch(_){return ''}
    }
    async function fillAuditFields(){
      if (sidInput) sidInput.value = browserSessionId();
      if (deviceInput) deviceInput.value = JSON.stringify(deviceProfile());
      if (fingerprintInput && !fingerprintInput.value) fingerprintInput.value = await deviceFingerprint();
    }
    function syncNextHash(){
      const next = form.querySelector('input[name="next"]');
      if (next && location.hash && !next.value.includes('#')) {
        next.value += location.hash;
        next.setAttribute('value', next.value);
      }
    }
    syncNextHash();
    clearOldEdgeStorage().catch(() => {});
    fillAuditFields().catch(() => {});
    form.addEventListener('submit', async (event) => {
      syncNextHash();
      if ((sidInput && !sidInput.value) || (deviceInput && !deviceInput.value) || (fingerprintInput && !fingerprintInput.value)) {
        event.preventDefault();
        await fillAuditFields().catch(() => {});
        form.submit();
        return;
      }
      button.disabled = true;
      button.textContent = '正在进入...';
    });
  </script>
</body>
</html>`;
}

function renderEdgeSessionBridge(session, env, next = DEFAULT_ENTRY) {
  const safe = safeNext(next);
  const role = isAdmin(session, env) ? 'teacher' : 'student';
  const identity = {
    username: session.username,
    name: role === 'teacher' ? '刘光辉' : session.username,
    role,
    deviceLabel: session.deviceLabel || ''
  };
  const identityJson = JSON.stringify(identity).replace(/</g, '\\u003c');
  const nextJson = JSON.stringify(safe).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>正在同步登录 · 流体力学学习平台</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif;background:#f6f8fb;color:#111827}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(241,245,249,.95))}
    main{width:min(440px,100%);padding:30px;border:1px solid rgba(17,24,39,.1);border-radius:20px;background:rgba(255,255,255,.86);box-shadow:0 24px 70px rgba(15,23,42,.12)}
    .mark{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;margin-bottom:18px;color:white;font-size:22px;font-weight:850;background:linear-gradient(135deg,#14b8a6,#f97316)}
    h1{margin:0 0 8px;font-size:30px;line-height:1.12;letter-spacing:0}p{margin:0;color:#64748b;line-height:1.7}.fallback{margin-top:12px}.fallback a{color:#0f766e;font-weight:850}.bar{height:8px;margin-top:22px;border-radius:999px;background:linear-gradient(90deg,#14b8a6,#f97316);animation:pulse 1.2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:.42}50%{opacity:1}}@media(prefers-color-scheme:dark){:root{background:#070d16;color:#f8fafc}body{background:#070d16}main{background:rgba(15,23,42,.86);border-color:rgba(255,255,255,.12)}p{color:#aab6c8}}
  </style>
</head>
<body>
  <main>
    <div class="mark" aria-hidden="true">流</div>
    <h1>正在同步登录</h1>
    <p id="bridge-status">正在清理旧入口状态并进入学习页面。</p>
    <p class="fallback"><a id="bridge-link" href="${safe}">如果没有自动进入，点这里继续</a></p>
    <div class="bar" aria-hidden="true"></div>
  </main>
  <script>
    const identity=${identityJson};
    const target=${nextJson};
    async function clearOldEntryState(){
      try{
        if('serviceWorker' in navigator){
          const registrations=await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(registration=>registration.unregister()));
        }
        if(window.caches&&caches.keys){
          const keys=await caches.keys();
          await Promise.all(keys.map(key=>caches.delete(key)));
        }
      }catch(_){}
    }
    function timeout(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
    async function sha256Base64(text){
      if(!window.crypto||!window.crypto.subtle)throw new Error('crypto_unavailable');
      const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
      let encoded='';new Uint8Array(digest).forEach(byte=>{encoded+=String.fromCharCode(byte)});
      return btoa(encoded);
    }
    async function deviceFingerprint(){
      const key='fm_device_fp';
      try{
        const cached=localStorage.getItem(key);
        if(cached)return cached;
      }catch(_){}
      const source=[navigator.userAgent||'',navigator.language||'',(screen&&screen.width?screen.width:0)+'x'+(screen&&screen.height?screen.height:0),new Date().getTimezoneOffset(),navigator.hardwareConcurrency||'',navigator.platform||''].join('|');
      const value=await sha256Base64(source);
      try{localStorage.setItem(key,value)}catch(_){}
      return value;
    }
    async function writeLegacySession(){
      try{
        const now=Date.now();
        const user={username:String(identity.username||''),name:String(identity.name||identity.username||'用户'),role:identity.role==='teacher'?'teacher':'student'};
        if(identity.deviceLabel)user.deviceLabel=String(identity.deviceLabel);
        const expiresAt=now+8*60*60*1000;
        const session={version:2,issuedAt:now,expiresAt,lastActive:now,origin:location.origin,user};
        const fp=await deviceFingerprint();
        const payload={user,issuedAt:now,expiresAt,fp,lastActive:now};
        const legacySession={payload,sig:await sha256Base64(JSON.stringify(payload)+'::'+fp)};
        localStorage.setItem('fm_auth_session_v2',JSON.stringify(session));
        localStorage.setItem('fm_session_v2',JSON.stringify(legacySession));
        localStorage.setItem('fluidMechanicsUser',JSON.stringify(user));
        localStorage.setItem('currentUser',JSON.stringify(user));
        localStorage.setItem('currentUsername',user.username||user.name||'');
        try{sessionStorage.removeItem('fm_auth_redirect')}catch(_){}
        if(!localStorage.getItem('fm_auth_session_v2')||!localStorage.getItem('fm_session_v2')||!localStorage.getItem('currentUser')||!localStorage.getItem('currentUsername'))throw new Error('storage_verify_failed');
        return true;
      }catch(_){return false}
    }
    function enterTarget(){location.replace(target)}
    function showFallback(message){
      const status=document.getElementById('bridge-status');
      if(status)status.textContent=message;
      const link=document.getElementById('bridge-link');
      if(link){link.href=target;link.style.opacity='1';link.focus&&link.focus();}
    }
    setTimeout(()=>{const link=document.getElementById('bridge-link');if(link)link.style.opacity='1'},1600);
    (async()=>{await Promise.race([clearOldEntryState(),timeout(1200)]);const stored=await writeLegacySession();if(!stored){showFallback('浏览器阻止了本地登录态写入；边缘登录已成功，正在用服务器会话继续进入。');await timeout(2200);}enterTarget();})().catch(async()=>{showFallback('登录桥接遇到临时异常；请点下面入口继续，或稍后再试。');await timeout(2200);enterTarget()});
  </script>
</body>
</html>`;
}

function renderFastLogin(next = '/') {
  const safe = safeNext(next);
  const escapedNext = escapeHtml(safe);
  const encodedNext = encodeURIComponent(safe);
  const targetHref = escapeHtml(publicTargetHrefForNext(safe));
  const routeHint = [
    `<div class="mini-upgrade" id="loginRouteStatus" role="status" aria-live="polite" aria-atomic="true"><b>当前入口</b><span><a id="targetLink" href="${targetHref}">登录后回到当前入口</a></span></div>`,
    /(?:^|\/)question-bank(?:\.html)?(?:[?#]|$)/i.test(safe)
      ? '<div class="mini-upgrade"><b>题库练习</b><span>进入题库页前需要先登录；登录后会回到当前题库入口。</span></div>'
      : ''
  ].join('');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="theme-color" content="#f6f8fb"><title>流体力学学习平台</title><style>:root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif;background:#f6f8fb;color:#111827;--line:rgba(17,24,39,.11);--muted:#64748b;--accent:#0f766e}*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;text-rendering:optimizeLegibility}body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:max(22px,env(safe-area-inset-top)) max(18px,env(safe-area-inset-right)) max(22px,env(safe-area-inset-bottom)) max(18px,env(safe-area-inset-left));background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(241,245,249,.95)),linear-gradient(115deg,rgba(20,184,166,.12),transparent 48%,rgba(249,115,22,.1));-webkit-font-smoothing:antialiased}.card{width:min(460px,100%);padding:clamp(26px,6vw,40px);border:1px solid var(--line);border-radius:24px;background:rgba(255,255,255,.84);box-shadow:0 28px 84px rgba(15,23,42,.13);backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%)}.mark{width:52px;height:52px;border-radius:17px;display:grid;place-items:center;margin-bottom:22px;color:#fff;font-size:23px;font-weight:850;background:linear-gradient(135deg,#14b8a6,#f97316);box-shadow:inset 0 1px 0 rgba(255,255,255,.38),0 16px 36px rgba(20,184,166,.23)}h1{margin:0 0 8px;font-size:40px;line-height:1.04;letter-spacing:0}p{margin:0 0 24px;color:var(--muted);line-height:1.7}.mini-upgrade{margin:0 0 16px;padding:12px 13px;border:1px solid rgba(15,118,110,.18);border-left:4px solid #f97316;border-radius:14px;background:linear-gradient(135deg,rgba(20,184,166,.09),rgba(249,115,22,.08));line-height:1.55}.mini-upgrade b{display:block;color:#0f172a}.mini-upgrade span{display:block;color:#64748b;font-size:13px}.mini-upgrade a{min-height:44px;display:inline-flex;align-items:center;color:#0f766e;font-weight:850;text-decoration:none;line-height:1.25}.field{margin:0 0 14px}label{display:block;margin:0 0 7px;color:#405066;font-size:13px;font-weight:760}input{width:100%;min-height:52px;border:1px solid var(--line);border-radius:14px;padding:0 15px;background:rgba(255,255,255,.76);color:#111827;font:500 16px/1.2 inherit;outline:none;transition:border-color .16s ease,box-shadow .16s ease,background .16s ease}input:focus{border-color:rgba(15,118,110,.62);box-shadow:0 0 0 5px rgba(20,184,166,.12);background:#fff}button{width:100%;min-height:52px;margin-top:4px;border:0;border-radius:14px;background:#111827;color:#fff;font:800 16px/1 inherit;cursor:pointer;box-shadow:0 14px 36px rgba(17,24,39,.18);touch-action:manipulation}.cta-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:2px 0 8px}.cta{min-height:52px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;border:1px solid var(--line);font-weight:850;text-decoration:none;transition:transform .16s ease,box-shadow .16s ease,background .16s ease,border-color .16s ease;touch-action:manipulation}.cta:hover{transform:translateY(-1px)}.cta.primary{background:linear-gradient(135deg,#0f766e,#111827);color:#fff;border-color:#0f766e;box-shadow:0 14px 36px rgba(15,118,110,.18)}.cta.secondary{background:rgba(15,118,110,.08);color:var(--accent)}.links{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.links a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:0 14px;background:rgba(15,118,110,.09);color:#0f766e;font-weight:800;text-decoration:none;font-size:13px;line-height:1.25}.fine{display:flex;align-items:center;gap:9px;margin-top:20px;color:#8b96a6;font-size:13px}.dot{width:8px;height:8px;border-radius:999px;background:#14b8a6;box-shadow:0 0 0 6px rgba(20,184,166,.12)}@media(max-width:520px){h1{font-size:32px}.card{border-radius:22px}.cta-row{grid-template-columns:1fr}}@media(prefers-color-scheme:dark){:root{background:#070d16;color:#f8fafc;--line:rgba(255,255,255,.12);--muted:#aab6c8;--accent:#5eead4}body{background:linear-gradient(135deg,rgba(7,13,22,.98),rgba(16,24,39,.96)),linear-gradient(115deg,rgba(20,184,166,.14),transparent 48%,rgba(249,115,22,.12))}.card{background:rgba(15,23,42,.78)}input{background:rgba(15,23,42,.74);color:#f8fafc}input:focus{background:#0f172a}button{background:#fff;color:#111827}.cta.secondary{background:rgba(94,234,212,.12);color:#5eead4}.mini-upgrade b{color:#f8fafc}.mini-upgrade span{color:#cbd5e1}}</style></head><body><main class="card"><div class="mark" aria-hidden="true">流</div><h1>安全登录</h1><p>已有账号直接进入；新账号可用邮箱验证码注册，忘记密码可用登记邮箱重置。</p>${routeHint}<div class="mini-upgrade"><b>181103 资料入口</b><span><a data-round356-home-181103-icon="fast-login" href="/resources/fluid-181103-html/index.html">打开 38 份 HTML 资料</a> · <a href="/modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList">522 来源卡 / 381+0 答案状态</a></span></div><div class="mini-upgrade"><b>快速登录已切到当前安全入口</b><span>${EDGE_HOME_VERSION} · 已清理旧 Service Worker、旧缓存和旧 edge_refresh；学习内容继续保留公式适用条件、边界条件、单位方向和常见错因回查。</span></div><div class="cta-row"><a class="cta primary" href="/_edge-register?next=${encodedNext}">注册账号</a><a class="cta secondary" href="/_edge-reset?next=${encodedNext}">修复入口</a></div><form method="post" action="/_edge-login"><input type="hidden" name="next" value="${escapedNext}"><div class="field"><label for="username">用户名</label><input id="username" name="username" autocomplete="username" autofocus required></div><div class="field"><label for="password">密码</label><input id="password" name="password" type="password" autocomplete="current-password" required></div><button id="submit" type="submit">进入系统</button></form><div class="links"><a href="/_edge-forgot-password?next=${encodedNext}">忘记密码</a><a href="/modules/knowledge-upgrade-2026.html">知识升级入口</a><a data-round356-home-181103-icon="fast-login-link" href="/resources/fluid-181103-html/index.html">181103 全 HTML</a><a href="/modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList">181103 资料题库</a><a href="/modules/real-exams-dynamic.html?edge_refresh=${EDGE_HOME_VERSION}">真题训练</a><a href="/resources/fluid-original-animations.html">自制动画</a><a href="/ultimate-beautiful-formulas.html">公式回查</a><a href="/modules/knowledge-detail.html">变量/量纲</a><a href="/modules/fluid-intensive-training.html">推导与公式</a><a href="/resources.html">模型/原型换算</a><a href="/practice.html">错题复盘</a><a href="/_edge-login?next=${encodedNext}">完整入口</a><a href="/_edge-status">状态</a></div><div class="fine"><span class="dot" aria-hidden="true"></span><span>未开通账号会进入购买锁定页</span></div></main><script>const f=document.querySelector('form'),b=document.getElementById('submit'),n=f.querySelector('input[name=next]');function syncNextHash(){if(n&&location.hash&&!n.value.includes('#')){n.value+=location.hash;n.setAttribute('value',n.value)}}syncNextHash();f.addEventListener('submit',()=>{syncNextHash();b.disabled=true;b.textContent='正在进入...' });</script></body></html>`;
}

function renderRegister(next = DEFAULT_ENTRY) {
  const safe = safeNext(next);
  const escapedNext = escapeHtml(safe);
  const encodedNext = encodeURIComponent(safe);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>注册账号 · 流体力学学习平台</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif;background:#f6f8fb;color:#111827;--line:rgba(17,24,39,.11);--muted:#627084;--accent:#0f766e;--panel:rgba(255,255,255,.86)}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(241,245,249,.94)),linear-gradient(115deg,rgba(20,184,166,.12),transparent 48%,rgba(249,115,22,.1));-webkit-font-smoothing:antialiased}
    main{width:min(520px,100%);border:1px solid var(--line);border-radius:24px;background:var(--panel);box-shadow:0 30px 90px rgba(15,23,42,.14);padding:clamp(26px,5vw,40px);backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%)}
    .mark{width:52px;height:52px;border-radius:17px;display:grid;place-items:center;margin-bottom:20px;color:#fff;font-size:23px;font-weight:850;background:linear-gradient(135deg,#14b8a6,#f97316)}
    h1{margin:0 0 8px;font-size:36px;line-height:1.08;letter-spacing:0}p{margin:0 0 22px;color:var(--muted);line-height:1.7}
    form{display:grid;gap:14px}label{display:block;margin:0 0 7px;color:#405066;font-size:13px;font-weight:760}input{width:100%;min-height:50px;border:1px solid var(--line);border-radius:14px;padding:0 14px;background:rgba(255,255,255,.75);color:#111827;font:500 16px/1.2 inherit;outline:none}input:focus{border-color:rgba(15,118,110,.62);box-shadow:0 0 0 5px rgba(20,184,166,.12);background:#fff}
    .row{display:grid;grid-template-columns:1fr auto;gap:10px}.row button{min-width:124px}
    button,a.btn{min-height:50px;border:0;border-radius:14px;background:#111827;color:#fff;font:800 15px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;padding:0 14px}button.secondary,a.secondary{background:rgba(15,118,110,.1);color:var(--accent)}button[disabled]{opacity:.62;cursor:progress}
    .msg{min-height:22px;margin-top:12px;color:var(--muted);font-size:14px;line-height:1.55}.msg.err{color:#b91c1c}.msg.ok{color:#0f766e}.links{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
    .fine{margin-top:18px;color:#7b8797;font-size:13px;line-height:1.6}
    @media(max-width:520px){.row{grid-template-columns:1fr}h1{font-size:30px}}
    @media(prefers-color-scheme:dark){:root{background:#070d16;color:#f8fafc;--line:rgba(255,255,255,.12);--muted:#aab6c8;--panel:rgba(15,23,42,.82)}body{background:linear-gradient(135deg,rgba(7,13,22,.98),rgba(16,24,39,.96)),linear-gradient(115deg,rgba(20,184,166,.14),transparent 48%,rgba(249,115,22,.12))}input{background:rgba(15,23,42,.74);color:#f8fafc}input:focus{background:#0f172a}button,a.btn{background:#fff;color:#111827}button.secondary,a.secondary{background:rgba(20,184,166,.16);color:#5eead4}}
  </style>
</head>
<body>
<main>
  <div class="mark" aria-hidden="true">流</div>
  <h1>注册账号</h1>
  <p>输入邮箱获取 6 位验证码，再设置用户名和密码。未开通账号注册后会进入锁定页，开通后才可学习内容。</p>
  <form id="regForm" autocomplete="on">
    <input type="hidden" id="next" value="${escapedNext}">
    <div><label for="username">用户名</label><input id="username" name="username" autocomplete="username" minlength="2" maxlength="32" placeholder="可用中文、英文、数字、_.-" title="可用中文、英文、数字、下划线、点和短横线；空格会自动转为下划线" required></div>
    <div><label for="email">邮箱</label><input id="email" name="email" type="email" autocomplete="email" required></div>
    <div class="row"><div><label for="code">验证码</label><input id="code" name="code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" required></div><button type="button" class="secondary" id="sendCode">发送验证码</button></div>
    <div><label for="password">密码</label><input id="password" name="password" type="password" autocomplete="new-password" minlength="${PASSWORD_MIN_LENGTH}" required></div>
    <button id="submit" type="submit">创建账号</button>
  </form>
  <div class="msg" id="msg"></div>
  <div class="links"><a class="btn secondary" href="/_edge-login?next=${encodedNext}">返回登录</a><a class="btn secondary" href="/_edge-forgot-password?next=${encodedNext}">忘记密码</a><a class="btn secondary" href="/_edge-reset?next=${encodedNext}">修复入口</a></div>
  <div class="fine">qi 账号开通后会看到她的专属课堂视频；其他账号需联系网站所有人购买开通。</div>
</main>
<script>
const FM_CANONICAL_ORIGIN='https://lghui-fluid-learning.pages.dev';
const FM_REGISTER_HOST=location.hostname.toLowerCase();
if (location.protocol === 'https:' && (FM_REGISTER_HOST === 'lghui.top' || FM_REGISTER_HOST === 'www.lghui.top')) {
  location.replace(FM_CANONICAL_ORIGIN + location.pathname + location.search + location.hash);
}
const $=id=>document.getElementById(id),msg=$('msg'),send=$('sendCode'),submit=$('submit'),form=$('regForm');
const DEBUG_CODE_KEY='dev'+'Code';
function setMsg(text,kind){msg.textContent=text||'';msg.className='msg '+(kind||'')}
function visibleDebugCode(data){const host=location.hostname.toLowerCase();const local=host==='localhost'||host==='127.0.0.1'||host==='[::1]'||host.endsWith('.localhost');return local&&data&&data[DEBUG_CODE_KEY]?String(data[DEBUG_CODE_KEY]):''}
function browserSessionId(){const key='fm_browser_session_id';try{let v=localStorage.getItem(key);if(!v){v=(crypto.randomUUID?crypto.randomUUID():(Date.now()+'-'+Math.random().toString(36).slice(2)));localStorage.setItem(key,v)}return v}catch(_){return Date.now()+'-'+Math.random().toString(36).slice(2)}}
function deviceProfile(){return {userAgent:navigator.userAgent||'',platform:navigator.platform||'',language:navigator.language||'',languages:Array.isArray(navigator.languages)?navigator.languages.slice(0,5):[],timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'',touchPoints:navigator.maxTouchPoints||0,hardwareConcurrency:navigator.hardwareConcurrency||0,deviceMemory:navigator.deviceMemory||0,uaData:navigator.userAgentData?{mobile:!!navigator.userAgentData.mobile,platform:navigator.userAgentData.platform||''}:null,screen:screen?{width:screen.width||0,height:screen.height||0,availWidth:screen.availWidth||0,availHeight:screen.availHeight||0,colorDepth:screen.colorDepth||0,pixelRatio:devicePixelRatio||1}:{}}}
async function deviceFingerprint(){try{if(!window.crypto||!window.crypto.subtle)return '';const key='fm_device_fp';const cached=localStorage.getItem(key);if(cached)return cached;const source=[navigator.userAgent||'',navigator.language||'',(screen&&screen.width?screen.width:0)+'x'+(screen&&screen.height?screen.height:0),new Date().getTimezoneOffset(),navigator.hardwareConcurrency||'',navigator.platform||''].join('|');const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source));let text='';new Uint8Array(digest).forEach(byte=>{text+=String.fromCharCode(byte)});const value=btoa(text);localStorage.setItem(key,value);return value}catch(_){return ''}}
async function auditBody(body){return {...body,browserSessionId:browserSessionId(),viewport:innerWidth+'x'+innerHeight,deviceProfile:deviceProfile(),deviceFingerprint:await deviceFingerprint()}}
async function post(url,body){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(await auditBody(body)),credentials:'same-origin',cache:'no-store',signal:controller.signal});let data={},raw='';try{raw=await r.text();data=raw?JSON.parse(raw):{}}catch(_){}if(!r.ok||!data.ok){const fallback=r.status?'请求失败（HTTP '+r.status+'）。请点“修复入口”后重新进入。':'请求失败，请检查网络后重试。';throw Object.assign(new Error(data.message||data.error||fallback),{data,status:r.status,raw})}return data}finally{clearTimeout(timer)}}
send.addEventListener('click',async()=>{const username=$('username').value.trim(),email=$('email').value.trim();if(!username||!email){setMsg('先填写用户名和邮箱。','err');return}send.disabled=true;send.textContent='发送中...';setMsg('正在发送验证码，请稍等。','');try{const data=await post('/api/auth/send-code',{username,email});const debugCode=visibleDebugCode(data);setMsg(debugCode?'验证码已生成：'+debugCode:'验证码已发送，请查看邮箱。','ok');let n=60;send.textContent=n+'s';const t=setInterval(()=>{n-=1;send.textContent=n>0?n+'s':'发送验证码';if(n<=0){clearInterval(t);send.disabled=false}},1000)}catch(e){send.disabled=false;send.textContent='重新发送';setMsg(e.name==='AbortError'?'发送超时，请点“重新发送”；如果仍失败，请点“修复入口”后再试。':e.message,'err')}});
form.addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;submit.textContent='正在创建...';setMsg('正在提交注册，请稍等。','');try{const data=await post('/api/auth/register',{username:$('username').value.trim(),email:$('email').value.trim(),code:$('code').value.trim(),password:$('password').value,next:$('next').value});setMsg('账号已创建，正在进入。','ok');location.replace(data.next||'${escapedNext}')}catch(err){submit.disabled=false;submit.textContent='创建账号';setMsg(err.name==='AbortError'?'注册请求超时，请直接再点一次创建账号。':err.message,'err')}});
</script>
</body>
</html>`;
}

function renderForgotPassword(next = DEFAULT_ENTRY) {
  const safe = safeNext(next);
  const escapedNext = escapeHtml(safe);
  const encodedNext = encodeURIComponent(safe);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>重置密码 · 流体力学学习平台</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif;background:#f6f8fb;color:#111827;--line:rgba(17,24,39,.11);--muted:#627084;--accent:#0f766e;--panel:rgba(255,255,255,.86)}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(241,245,249,.94)),linear-gradient(115deg,rgba(20,184,166,.12),transparent 48%,rgba(249,115,22,.1));-webkit-font-smoothing:antialiased}
    main{width:min(540px,100%);border:1px solid var(--line);border-radius:24px;background:var(--panel);box-shadow:0 30px 90px rgba(15,23,42,.14);padding:clamp(26px,5vw,40px);backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%)}
    .mark{width:52px;height:52px;border-radius:17px;display:grid;place-items:center;margin-bottom:20px;color:#fff;font-size:23px;font-weight:850;background:linear-gradient(135deg,#14b8a6,#f97316)}
    h1{margin:0 0 8px;font-size:36px;line-height:1.08;letter-spacing:0}p{margin:0 0 22px;color:var(--muted);line-height:1.7}
    form{display:grid;gap:14px}label{display:block;margin:0 0 7px;color:#405066;font-size:13px;font-weight:760}input{width:100%;min-height:50px;border:1px solid var(--line);border-radius:14px;padding:0 14px;background:rgba(255,255,255,.75);color:#111827;font:500 16px/1.2 inherit;outline:none}input:focus{border-color:rgba(15,118,110,.62);box-shadow:0 0 0 5px rgba(20,184,166,.12);background:#fff}
    .row{display:grid;grid-template-columns:1fr auto;gap:10px}.row button{min-width:124px}
    button,a.btn{min-height:50px;border:0;border-radius:14px;background:#111827;color:#fff;font:800 15px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;padding:0 14px}button.secondary,a.secondary{background:rgba(15,118,110,.1);color:var(--accent)}button[disabled]{opacity:.62;cursor:progress}
    .msg{min-height:22px;margin-top:12px;color:var(--muted);font-size:14px;line-height:1.55}.msg.err{color:#b91c1c}.msg.ok{color:#0f766e}.links{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
    .fine{margin-top:18px;color:#7b8797;font-size:13px;line-height:1.6}
    @media(max-width:520px){.row{grid-template-columns:1fr}h1{font-size:30px}}
    @media(prefers-color-scheme:dark){:root{background:#070d16;color:#f8fafc;--line:rgba(255,255,255,.12);--muted:#aab6c8;--panel:rgba(15,23,42,.82)}body{background:linear-gradient(135deg,rgba(7,13,22,.98),rgba(16,24,39,.96)),linear-gradient(115deg,rgba(20,184,166,.14),transparent 48%,rgba(249,115,22,.12))}input{background:rgba(15,23,42,.74);color:#f8fafc}input:focus{background:#0f172a}button,a.btn{background:#fff;color:#111827}button.secondary,a.secondary{background:rgba(20,184,166,.16);color:#5eead4}}
  </style>
</head>
<body>
<main>
  <div class="mark" aria-hidden="true">流</div>
  <h1>重置密码</h1>
  <p>旧密码不能找回，只能用登记邮箱验证码设置新密码。验证通过后，旧密码和旧登录会话都会失效。</p>
  <form id="resetForm" autocomplete="on">
    <input type="hidden" id="next" value="${escapedNext}">
    <div><label for="username">用户名</label><input id="username" name="username" autocomplete="username" minlength="2" maxlength="32" placeholder="账号用户名" required></div>
    <div><label for="email">登记邮箱</label><input id="email" name="email" type="email" autocomplete="email" required></div>
    <div class="row"><div><label for="code">验证码</label><input id="code" name="code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" required></div><button type="button" class="secondary" id="sendCode">发送验证码</button></div>
    <div><label for="password">新密码</label><input id="password" name="password" type="password" autocomplete="new-password" minlength="${PASSWORD_MIN_LENGTH}" required></div>
    <div><label for="confirmPassword">确认新密码</label><input id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" minlength="${PASSWORD_MIN_LENGTH}" required></div>
    <button id="submit" type="submit">重置密码</button>
  </form>
  <div class="msg" id="msg"></div>
  <div class="links"><a class="btn secondary" href="/_edge-login?next=${encodedNext}">返回登录</a><a class="btn secondary" href="/_edge-register?next=${encodedNext}">注册账号</a><a class="btn secondary" href="/_edge-reset?next=${encodedNext}">修复入口</a></div>
  <div class="fine">如果邮箱已不可用，请让老师在教师监控里给该学生账号设置临时密码；设置密码不会自动开通学习权限。</div>
</main>
<script>
const FM_CANONICAL_ORIGIN='https://lghui-fluid-learning.pages.dev';
const FM_RESET_HOST=location.hostname.toLowerCase();
if (location.protocol === 'https:' && (FM_RESET_HOST === 'lghui.top' || FM_RESET_HOST === 'www.lghui.top')) {
  location.replace(FM_CANONICAL_ORIGIN + location.pathname + location.search + location.hash);
}
const $=id=>document.getElementById(id),msg=$('msg'),send=$('sendCode'),submit=$('submit'),form=$('resetForm');
const DEBUG_CODE_KEY='dev'+'Code';
function setMsg(text,kind){msg.textContent=text||'';msg.className='msg '+(kind||'')}
function visibleDebugCode(data){const host=location.hostname.toLowerCase();const local=host==='localhost'||host==='127.0.0.1'||host==='[::1]'||host.endsWith('.localhost');return local&&data&&data[DEBUG_CODE_KEY]?String(data[DEBUG_CODE_KEY]):''}
function browserSessionId(){const key='fm_browser_session_id';try{let v=localStorage.getItem(key);if(!v){v=(crypto.randomUUID?crypto.randomUUID():(Date.now()+'-'+Math.random().toString(36).slice(2)));localStorage.setItem(key,v)}return v}catch(_){return Date.now()+'-'+Math.random().toString(36).slice(2)}}
function deviceProfile(){return {userAgent:navigator.userAgent||'',platform:navigator.platform||'',language:navigator.language||'',languages:Array.isArray(navigator.languages)?navigator.languages.slice(0,5):[],timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'',touchPoints:navigator.maxTouchPoints||0,hardwareConcurrency:navigator.hardwareConcurrency||0,deviceMemory:navigator.deviceMemory||0,uaData:navigator.userAgentData?{mobile:!!navigator.userAgentData.mobile,platform:navigator.userAgentData.platform||''}:null,screen:screen?{width:screen.width||0,height:screen.height||0,availWidth:screen.availWidth||0,availHeight:screen.availHeight||0,colorDepth:screen.colorDepth||0,pixelRatio:devicePixelRatio||1}:{}}}
async function deviceFingerprint(){try{if(!window.crypto||!window.crypto.subtle)return '';const key='fm_device_fp';const cached=localStorage.getItem(key);if(cached)return cached;const source=[navigator.userAgent||'',navigator.language||'',(screen&&screen.width?screen.width:0)+'x'+(screen&&screen.height?screen.height:0),new Date().getTimezoneOffset(),navigator.hardwareConcurrency||'',navigator.platform||''].join('|');const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source));let text='';new Uint8Array(digest).forEach(byte=>{text+=String.fromCharCode(byte)});const value=btoa(text);localStorage.setItem(key,value);return value}catch(_){return ''}}
async function auditBody(body){return {...body,browserSessionId:browserSessionId(),viewport:innerWidth+'x'+innerHeight,deviceProfile:deviceProfile(),deviceFingerprint:await deviceFingerprint()}}
async function post(url,body){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(await auditBody(body)),credentials:'same-origin',cache:'no-store',signal:controller.signal});let data={},raw='';try{raw=await r.text();data=raw?JSON.parse(raw):{}}catch(_){}if(!r.ok||!data.ok){const fallback=r.status?'请求失败（HTTP '+r.status+'）。请点“修复入口”后重新进入。':'请求失败，请检查网络后重试。';throw Object.assign(new Error(data.message||data.error||fallback),{data,status:r.status,raw})}return data}finally{clearTimeout(timer)}}
send.addEventListener('click',async()=>{const username=$('username').value.trim(),email=$('email').value.trim();if(!username||!email){setMsg('先填写用户名和登记邮箱。','err');return}send.disabled=true;send.textContent='发送中...';setMsg('如果账号和邮箱匹配，验证码会发送到登记邮箱。','');try{const data=await post('/api/auth/password-reset/send-code',{username,email});const debugCode=visibleDebugCode(data);setMsg(debugCode?'验证码已生成：'+debugCode:'如果账号和邮箱匹配，验证码会发送到登记邮箱。','ok');let n=60;send.textContent=n+'s';const t=setInterval(()=>{n-=1;send.textContent=n>0?n+'s':'发送验证码';if(n<=0){clearInterval(t);send.disabled=false}},1000)}catch(e){send.disabled=false;send.textContent='重新发送';setMsg(e.name==='AbortError'?'发送超时，请点“重新发送”；如果仍失败，请点“修复入口”后再试。':e.message,'err')}});
form.addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;submit.textContent='正在重置...';setMsg('正在校验验证码并重置密码。','');try{const data=await post('/api/auth/password-reset/confirm',{username:$('username').value.trim(),email:$('email').value.trim(),code:$('code').value.trim(),newPassword:$('password').value,confirmPassword:$('confirmPassword').value,next:$('next').value});setMsg('密码已重置，请用新密码登录。','ok');setTimeout(()=>location.replace(data.next||'/_edge-login?next=${encodedNext}'),650)}catch(err){submit.disabled=false;submit.textContent='重置密码';setMsg(err.name==='AbortError'?'重置请求超时，请直接再点一次。':err.message,'err')}});
</script>
</body>
</html>`;
}

function renderLocked(session, env) {
  const username = escapeHtml(session && session.username ? session.username : '账号');
  const contact = escapeHtml(env.SITE_OWNER_CONTACT || env.OWNER_CONTACT || '联系网站所有人开通');
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>账号未开通 · 流体力学学习平台</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif;background:#f6f8fb;color:#111827;--line:rgba(17,24,39,.11);--muted:#64748b}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(241,245,249,.94)),linear-gradient(115deg,rgba(20,184,166,.12),transparent 48%,rgba(249,115,22,.1));-webkit-font-smoothing:antialiased}
    main{width:min(620px,100%);border:1px solid var(--line);border-radius:24px;background:rgba(255,255,255,.86);box-shadow:0 30px 90px rgba(15,23,42,.14);padding:clamp(28px,5vw,44px);backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%)}
    .lock{width:58px;height:58px;border-radius:18px;display:grid;place-items:center;margin-bottom:22px;color:#fff;background:linear-gradient(135deg,#0f766e,#f97316);font-size:28px;font-weight:900}
    h1{margin:0 0 10px;font-size:36px;line-height:1.1;letter-spacing:0}p{margin:0;color:var(--muted);line-height:1.8}.box{margin:22px 0;padding:16px;border:1px solid rgba(15,118,110,.18);border-radius:16px;background:rgba(15,118,110,.07)}.box b{color:#0f766e}
    .actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:0 15px;font-weight:850;text-decoration:none;background:#111827;color:#fff}a.soft{background:rgba(15,118,110,.1);color:#0f766e}
    @media(prefers-color-scheme:dark){:root{background:#070d16;color:#f8fafc;--line:rgba(255,255,255,.12);--muted:#aab6c8}body{background:linear-gradient(135deg,rgba(7,13,22,.98),rgba(16,24,39,.96)),linear-gradient(115deg,rgba(20,184,166,.14),transparent 48%,rgba(249,115,22,.12))}main{background:rgba(15,23,42,.82)}a{background:#fff;color:#111827}a.soft{background:rgba(20,184,166,.16);color:#5eead4}.box b{color:#5eead4}}
  </style>
</head>
<body>
<main>
  <div class="lock" aria-hidden="true">锁</div>
  <h1>账号已创建，内容暂未开通</h1>
  <p>当前登录账号：<b>${username}</b>。此账号可以完成注册和登录，但学习内容已锁定。</p>
  <div class="box"><p><b>开通方式：</b>${contact}</p><p>开通后再登录即可进入题库、知识点、教材整理和课程视频。</p></div>
  <div class="actions"><a href="/_edge-logout">退出登录</a><a class="soft" href="/_edge-health">检查账号状态</a></div>
</main>
</body>
</html>`;
}

function renderTeacherRequired(session) {
  const username = escapeHtml(session && session.username ? session.username : '当前账号');
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>没有教师端权限 · 流体力学学习平台</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif;background:#f6f8fb;color:#111827;--line:rgba(17,24,39,.11);--muted:#64748b;--accent:#0f766e}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(241,245,249,.94));-webkit-font-smoothing:antialiased}
    main{width:min(620px,100%);border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.9);box-shadow:0 26px 80px rgba(15,23,42,.13);padding:clamp(26px,5vw,42px)}
    h1{margin:0 0 10px;font-size:34px;line-height:1.12;letter-spacing:0}p{margin:0;color:var(--muted);line-height:1.8}.note{margin:18px 0;padding:14px;border:1px solid rgba(15,118,110,.18);border-radius:12px;background:rgba(15,118,110,.07);color:#334155}
    .actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:0 15px;font-weight:850;text-decoration:none;background:#111827;color:#fff}a.soft{background:rgba(15,118,110,.1);color:var(--accent)}
    @media(prefers-color-scheme:dark){:root{background:#070d16;color:#f8fafc;--line:rgba(255,255,255,.12);--muted:#aab6c8;--accent:#5eead4}body{background:#070d16}main{background:rgba(15,23,42,.86)}a{background:#fff;color:#111827}a.soft{background:rgba(20,184,166,.16);color:#5eead4}.note{color:#cbd5e1}}
  </style>
</head>
<body>
<main>
  <h1>当前账号没有教师端权限</h1>
  <p><b>${username}</b> 已登录，但只能访问学生端学习内容。</p>
  <div class="note">这不是登录失效，不需要反复跳登录页。学生端可继续进入知识点全集、六章真题练习和教材资料。</div>
  <div class="actions">
    <a href="/index-complete?full=1">回学生首页</a>
    <a class="soft" href="/modules/knowledge-detail">知识点全集</a>
    <a class="soft" href="/modules/practice-dynamic?type=real&chapter=1&mode=normal">真题练习</a>
  </div>
</main>
</body>
</html>`;
}

function renderFastHome(session, env) {
  const teacher = isAdmin(session, env);
  const name = escapeHtml(teacher ? '刘光辉' : session.username);
  const teacherLink = teacher ? '<a class="pill" href="/_edge-admin">教师监控</a>' : '';
  const accountRecordCard = teacher
    ? '<a class="upgrade-card" href="/teacher-panel.html"><small>教师端</small><b>专属课记录</b><em>账号权限、一对一专属课和教师监控逻辑保持原样。</em></a>'
    : '<a class="upgrade-card" href="/modules/progress-module.html"><small>学生端</small><b>学习记录</b><em>继续查看练习进度、错题复盘和六章真题训练。</em></a>';
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="theme-color" content="#f6f8fb">
  <title>流体力学学习平台</title>
  <link rel="prefetch" href="/question-banks/real-exams-index.json" as="fetch">
  <link rel="prefetch" href="/data/fluid-simulated-exam-packs.json" as="fetch">
  <link rel="stylesheet" href="/styles/edge-fast-home.css?v=${EDGE_RUNTIME_JS_VERSION}">
</head>
<body>
  <div class="wrap">
    <header class="top">
      <a class="brand" href="/index-complete?full=1"><span class="mark">流</span><span>流体力学学习平台</span></a>
      <nav class="nav"><span class="pill">已登录：${name}</span>${teacherLink}<a class="pill" href="/index-complete.html?full=1">完整主页</a><a class="pill dark" href="/_edge-logout">退出</a></nav>
    </header>
    <main>
      <section class="hero">
        <div class="lead">
          <div>
            <div class="upgrade-flag"><i aria-hidden="true"></i><b>当前入口升级与公式回查</b><span>${EDGE_HOME_VERSION}</span></div>
            <h1>选出公式，再查条件</h1>
            <p>极速首页先给公式回查顺序：写下刚选的公式，核适用条件是否满足，再把固壁、自由面、入口出口和初始条件代回去；算完查单位、方向和数量级，最后按常见错因重做同类真题。看不出流动图像时打开自制动画。</p>
            <div class="upgrade-actions">
              <a href="/resources/fluid-181103-html/index.html" data-round356-home-181103-icon="fast-home-primary"><b>181103 资料库</b><span>38 份资料全做成站内 HTML，直接看正文和图页</span></a>
              <a href="/modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList" data-round356-home-181103-icon="fast-home-bank"><b>181103 资料题库</b><span>522 来源卡 / 381 练习 / 381+0 答案 / 141 线索，不混历年真题</span></a>
              <a href="/modules/knowledge-upgrade-2026.html"><b>公式回查表</b><span>按适用条件、边界条件和单位方向复核</span></a>
              <a href="/modules/fluid-intensive-training.html"><b>适用条件</b><span>连续、伯努利、动量和量纲分析逐条核条件</span></a>
              <a href="/resources/fluid-original-animations.html"><b>自制动画</b><span>看不清边界和方向时先看动画，再回公式</span></a>
              <a href="/modules/real-exams-dynamic.html?edge_refresh=${EDGE_HOME_VERSION}"><b>真题训练</b><span>325 道原文原子题，68 个组题 section 已拆开</span></a>
              <a href="/modules/simulated-exams-dynamic.html"><b>模拟章节题</b><span>教材启发的仿真练习，与正式真题隔离</span></a>
              <a href="/modules/site-updates.html"><b>最近更新</b><span>查看本轮修复、公式渲染和学习资料入口变化</span></a>
            </div>
          </div>
          <div class="status"><span class="tag hot"><i class="dot"></i>当前入口升级</span><span class="tag">极速首页 · ${EDGE_HOME_VERSION}</span><span class="tag">适用条件</span><span class="tag">边界条件</span><span class="tag">公式选择</span><span class="tag">单位方向</span></div>
        </div>
        <aside class="panel" role="search" aria-label="快速入口搜索"><label class="sr-only" for="s">搜索首页入口</label><input id="s" class="search" autocomplete="off" placeholder="搜索入口" aria-controls="quick" aria-describedby="fastSearchStatus"><span id="fastSearchStatus" class="sr-only" aria-live="polite" aria-atomic="true">显示全部入口</span><div id="quick" class="quick" aria-label="快速入口">
          <a class="q featured" href="/resources/fluid-181103-html/index.html" data-round356-home-181103-icon="fast-home-search" data-k="${EDGE_HOME_VERSION} 181103 资料库 181103 全 HTML 38份资料 站内HTML 不下载原件 资料正文 图页 资料去哪了"><span class="ic">资</span><span><b>181103 资料库</b><span>38 份资料全做成 HTML，站内直接看</span></span><span class="arr">›</span></a>
          <a class="q featured" href="/modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList" data-k="${EDGE_HOME_VERSION} 181103 资料题库 522 来源卡 381 练习 381 可参考 0 待复核 141 线索 OCR 资料内题目 不混真题"><span class="ic">522</span><span><b>181103 资料题库</b><span>522 来源卡 / 381 练习 / 381+0 答案 / 141 线索</span></span><span class="arr">›</span></a>
          <a class="q featured" href="/modules/knowledge-upgrade-2026.html" data-k="round264-formula-condition-checklist-20260522 公式回查表 适用条件 边界条件 单位方向 常见错因 自制动画 连续方程 伯努利方程 动量方程 量纲分析 黏性近似"><span class="ic">路</span><span><b>公式回查表</b><span>先查适用条件，再代边界条件</span></span><span class="arr">›</span></a>
          <a class="q featured" href="/modules/fluid-intensive-training.html" data-k="round264-formula-condition-checklist-20260522 公式适用条件 连续方程 伯努利方程 动量方程 量纲分析 黏性近似 第一行方程 边界条件 单位方向"><span class="ic">式</span><span><b>适用条件</b><span>看条件够不够支持连续、伯努利、动量或量纲分析</span></span><span class="arr">›</span></a>
          <a class="q featured" href="/resources/fluid-original-animations.html" data-k="round264-formula-condition-checklist-20260522 动画 自制动画 适用条件 边界条件 单位方向 可视化 仿真 视频 公式 错因回查"><span class="ic">动</span><span><b>自制动画课</b><span>看不清边界和方向时，先看动画再回公式</span></span><span class="arr">›</span></a>
          <a class="q featured" href="/modules/real-exams-dynamic.html?edge_refresh=${EDGE_HOME_VERSION}" data-k="${EDGE_HOME_VERSION} 题库 真题训练 原文小问拆分 325题 68组题 217小问 已核验 练习 考研 2000 2024 错题复盘"><span class="ic">题</span><span><b>真题训练</b><span>325 道原文原子题，68 个组题 section 已拆开</span></span><span class="arr">›</span></a>
          <a class="q featured" href="/modules/simulated-exams-dynamic.html" data-k="模拟章节题 仿真题 mock sourceKind simulated notRealExam 教材 吴望一 王洪伟 条件 边界 单位 错因 隔离 真题不混用"><span class="ic">模</span><span><b>模拟章节题</b><span>按教材主题出仿真题，数据与正式真题分开</span></span><span class="arr">›</span></a>
          <a class="q" href="/modules/knowledge-detail.html" data-k="round264-formula-condition-checklist-20260522 知识点 适用条件 边界条件 单位方向 章节 教材 量纲分析 相似准则 公式 吴望一 王洪伟"><span class="ic">知</span><span><b>知识点全集</b><span>202 页已接章；共 202 页，1139 个课件小节，416 道真题练习；教材补充 221 张卡</span></span><span class="arr">›</span></a>
          <a class="q" href="/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html" data-k="吴望一 第二版 全册 教材 HTML 章节整理 场论 张量 伯努利 势流 波浪 黏性 气体动力学 公式 边界条件"><span class="ic">吴</span><span><b>吴望一第二版教材整理</b><span>617 页全册线索；直接打开教材整理稿，112 小节、40 推导、69 公式</span></span><span class="arr">›</span></a>
          <a class="q" href="/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html" data-k="王洪伟 我所理解的流体力学 教材 HTML 章节整理 生活现象 雨滴 胶管 水火箭 总压 公式 边界条件"><span class="ic">王</span><span><b>王洪伟教材整理</b><span>299 页全书线索；直接打开教材整理稿，120 小节、20 推导、51 公式</span></span><span class="arr">›</span></a>
          <a class="q" href="/practice.html" data-k="round264-formula-condition-checklist-20260522 做题 随机 错题 收藏 错题复盘 公式 边界条件 适用条件 单位方向"><span class="ic">练</span><span><b>做题练习</b><span>随机、章节、错题、收藏模式</span></span><span class="arr">›</span></a>
          <a class="q" href="/resources.html" data-k="round263-fluid-exam-route-map-20260522 视频 讲义 资源 自制动画 能量线 水头损失 伯努利方程 精修 读图核对 核心公式 MathJax 动画 可视化 仿真 湍流 伯努利 静水压 皮托管 文丘里管 毛细 源汇 兰金涡 马格努斯 激波 控制体动量 射流冲击 相似准则 模型试验 圆柱绕流 局部损失 临界流 剪切层 连续方程 质量守恒 欧拉方程 压强梯度 速度梯度 边界层分离 空化 蒸汽压 Moody 沿程损失 雷诺输运定理 Navier-Stokes 涡量拉伸 喷管阻塞 拉普拉斯压差 泵 管路 工作点 浮力 稳性 强迫涡 Couette Stokes 水击 量纲分析 自由涡 Kelvin 环量 边界层动量积分 湍流对数律 缓变流 面积-Mach Rossby 地转平衡 Ekman 螺旋 Ekman 输运 内波 浮力频率 斜压项 水力控制 雷诺应力 连续介质 尺度窗 Knudsen 物质导数 对流加速度 Cauchy 应力张量 镜像法 圆定理 Stokes 第一问题 非定常扩散 线性重力波 频散关系 重力-毛细波 旋转坐标系 科氏加速度 圆柱坐标 托里拆利公式 小孔出流 非定常 Bernoulli Rankine 半体 Taylor-Couette 欧拉法 拉格朗日法 迹线方程 速度势 流函数 固壁 无穿透 无滑移 管流 水跃 浅水波 边界层 卡门涡街 2000-2024 边界条件 错题 真题训练 单位检查"><span class="ic">课</span><span><b>视频与讲义</b><span>74 段精修自制动画课、底部核心公式、可视化精选、课件和真题资料</span></span><span class="arr">›</span></a>
        </div></aside>
	      </section>
	      <section class="upgrade-strip" aria-label="公式条件回查路线"><a class="upgrade-card primary" href="/resources/fluid-181103-html/index.html" data-round356-home-181103-icon="fast-home-strip"><small>181103</small><b>资料库</b><em>38 份资料全量 HTML 化，站内看正文、图页和资料题来源。</em></a><a class="upgrade-card" href="/modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList"><small>381+0</small><b>资料题库</b><em>381 练习、381 可参考、0 待复核和 141 线索，与历年真题和原卷答案边界分开。</em></a><a class="upgrade-card" href="/modules/knowledge-upgrade-2026.html"><small>条件表</small><b>公式回查表</b><em>适用条件、边界条件、单位方向和错因按顺序查。</em></a><a class="upgrade-card" href="/ultimate-beautiful-formulas.html"><small>公式回查</small><b>逐条核条件</b><em>连续、伯努利、动量、量纲和黏性近似先问能不能用。</em></a><a class="upgrade-card" href="/resources/fluid-original-animations.html"><small>动画</small><b>看清边界方向</b><em>卡在控制体、边界层或管路图时，先看自制动画。</em></a><a class="upgrade-card" href="/modules/site-updates.html"><small>更新</small><b>最近修复</b><em>公式渲染、入口和资料索引的公开更新记录。</em></a>${accountRecordCard}</section>
	      <section class="ns-fast" aria-label="Navier-Stokes 主线"><div class="ns-fast-in"><div><span class="tag">N-S 主线</span><h2>从 Navier-Stokes 方程进入章节</h2><p>场量与物性定义未知量，守恒律搭出主方程；理想流体、涡量、势流、黏性流动都是 N-S 在不同假设下的展开。</p></div><div class="ns-eq math"><div class="eq-main">$$\\begin{aligned}\\rho\\left(\\frac{\\partial \\mathbf{v}}{\\partial t}+\\mathbf{v}\\cdot\\nabla\\mathbf{v}\\right)&=-\\nabla p+\\mu\\nabla^2\\mathbf{v}+\\rho\\mathbf{f}\\\\\\nabla\\cdot\\mathbf{v}&=0\\end{aligned}$$</div><div class="ns-points"><span><b>惯性项</b>局部变化 + 对流加速度</span><span><b>压力项</b>压强梯度驱动或阻滞流动</span><span><b>黏性项</b>动量扩散连接管流与边界层</span><span><b>体力项</b>重力与旋转系力进入动量平衡</span><span><b>连续方程</b>不可压约束让速度场闭合</span></div></div></div><div class="ns-fast-route"><a href="/modules/knowledge-detail.html?chapter=1"><b>1 场量与物性</b>速度场、物质导数、ρ/μ</a><a href="/modules/knowledge-detail.html?chapter=3"><b>3 守恒律</b>连续方程与动量方程</a><a href="/modules/knowledge-detail.html?chapter=2"><b>2 去黏极限</b>Euler 与 Bernoulli</a><a href="/modules/knowledge-detail.html?chapter=5"><b>5 涡量视角</b>取旋度后的旋转结构</a><a href="/modules/knowledge-detail.html?chapter=6"><b>6 势流化简</b>无旋不可压与复势</a><a href="/modules/knowledge-detail.html?chapter=8"><b>8 黏性闭合</b>Re、管流、边界层、湍流</a></div></section>
	      <section class="ns-fast" aria-label="六章真题练习"><div class="ns-fast-in"><div><span class="tag">六章路径</span><h2>按章节进入完整真题池</h2><p>每个入口都进入本章全量 real 练习池，不带单题 q 参数，方便连续刷题和错因回查。</p></div><div class="ns-points"><span><b>练习模式</b>type=real</span><span><b>题量模式</b>mode=normal</span><span><b>入口口径</b>不混入模拟题</span><span><b>复盘顺序</b>公式、边界、单位、错因</span></div></div><div class="ns-fast-route"><a href="/modules/practice-dynamic.html?type=real&chapter=1&mode=normal"><b>第 1 章真题</b>流体物性与基础概念</a><a href="/modules/practice-dynamic.html?type=real&chapter=2&mode=normal"><b>第 2 章真题</b>理想流体与 Bernoulli</a><a href="/modules/practice-dynamic.html?type=real&chapter=3&mode=normal"><b>第 3 章真题</b>连续方程与动量方程</a><a href="/modules/practice-dynamic.html?type=real&chapter=5&mode=normal"><b>第 5 章真题</b>涡量、环量与旋转结构</a><a href="/modules/practice-dynamic.html?type=real&chapter=6&mode=normal"><b>第 6 章真题</b>势流、流函数与复势</a><a href="/modules/practice-dynamic.html?type=real&chapter=8&mode=normal"><b>第 8 章真题</b>黏性流动、管流与湍流</a></div></section>
      <section class="grid"><a class="card" href="/modules/knowledge-upgrade-2026.html"><b>知识升级版</b><span>按老师口吻整理知识点、公式、易错点和真题入口，先后顺序更清楚。</span></a><a class="card" href="/modules/physical-oceanography-home.html"><b>物理海洋</b><span>导论、描述性海洋学与高频问答。</span></a><a class="card" href="/modules/ai-assistant-dynamic.html"><b>问答助教</b><span>公式、概念和题目思路辅助。</span></a><a class="card" href="/modules/progress-module.html"><b>学习进度</b><span>任务、记录、复习节奏。</span></a><a class="card" href="/ultimate-beautiful-formulas.html"><b>公式精排</b><span>常用公式与展示。</span></a></section>
      <div class="fine"><span>Cloudflare 边缘门禁 · Cloudflare Pages 托管 · ${EDGE_HOME_VERSION}</span><span>完整主页保留全部学习看板。</span></div>
    </main>
  </div>
  <script src="/js/core/local-mathjax.js?v=${EDGE_RUNTIME_JS_VERSION}"></script><script>const fmIdle=window.requestIdleCallback||((fn,opts)=>setTimeout(fn,opts&&opts.timeout||320));fmIdle(()=>window.FMQueueMath?.(document.querySelector(".ns-fast"),520),{timeout:650});</script>
  <script type="speculationrules">{"prefetch":[{"urls":["/modules/knowledge-upgrade-2026.html","/modules/knowledge-detail.html","/modules/real-exams-dynamic.html","/modules/simulated-exams-dynamic.html","/modules/fluid-intensive-training.html","/resources.html","/resources/fluid-original-animations.html","/practice.html"],"eagerness":"moderate"}]}</script>
  <script>
    const s=document.getElementById('s'),items=[...document.querySelectorAll('.q')],seen=new Set,status=document.getElementById('fastSearchStatus');
    function safeWarm(a){try{const u=new URL(a.href,location.origin),p=u.pathname.toLowerCase();return u.origin===location.origin&&!p.startsWith('/_edge-')&&!p.startsWith('/api/')&&!p.includes('/admin')}catch(_){return false}}
    function warm(a){if(!a||!safeWarm(a)||seen.has(a.href))return;seen.add(a.href);const l=document.createElement('link');l.rel='prefetch';l.href=a.href;document.head.appendChild(l)}
    function setSearchStatus(q,count){if(status)status.textContent=q?'已筛选出 '+count+' 个入口':'显示全部 '+count+' 个入口'}
    s.addEventListener('input',()=>{const q=s.value.trim().toLowerCase();let count=0;items.forEach(a=>{const t=(a.textContent+' '+a.dataset.k).toLowerCase(),hide=!!q&&!t.includes(q);a.hidden=hide;if(!hide)count+=1});setSearchStatus(q,count)});
    setSearchStatus('',items.length);
    document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(a&&!a.href.includes('_edge-logout')&&!e.metaKey&&!e.ctrlKey)document.body.classList.add('leave')});
    ['pointerover','focusin','touchstart','pointerdown'].forEach(ev=>document.addEventListener(ev,e=>warm(e.target.closest('a[href^="/"]')),{passive:true}));
    (window.requestIdleCallback?fn=>requestIdleCallback(fn,{timeout:900}):fn=>setTimeout(fn,900))(()=>{items.slice(0,4).forEach(warm)});
  </script>
</body>
</html>`;
}

function renderReset(next = DEFAULT_ENTRY) {
  const target = `/_edge-login?next=${encodeURIComponent(safeNext(next))}`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>正在修复安全入口</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif;background:#f6f8fb;color:#111827}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(240,245,251,.94)),linear-gradient(115deg,rgba(20,184,166,.12),transparent 48%,rgba(249,115,22,.10));-webkit-font-smoothing:antialiased}
    main{width:min(560px,100%);background:rgba(255,255,255,.84);border:1px solid rgba(17,24,39,.11);border-radius:22px;padding:36px;box-shadow:0 28px 80px rgba(15,23,42,.14);backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%)}
    h1{margin:0 0 10px;font-size:30px;letter-spacing:0}p{line-height:1.75;color:#5f6f82}
    a{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border-radius:999px;background:#111827;color:#fff;text-decoration:none;font-weight:800}
    code{background:rgba(15,118,110,.10);border-radius:6px;padding:2px 6px}
    @media (prefers-color-scheme:dark){:root{background:#070d16;color:#f8fafc}body{background:linear-gradient(135deg,rgba(7,13,22,.98),rgba(16,24,39,.96)),linear-gradient(115deg,rgba(20,184,166,.14),transparent 48%,rgba(249,115,22,.12))}main{background:rgba(15,23,42,.78);border-color:rgba(255,255,255,.12)}p{color:#aab6c8}a{background:#fff;color:#111827}}
  </style>
</head>
<body>
  <main>
    <h1>正在清理旧缓存</h1>
    <p><b>当前入口修复与公式渲染加固中 · ${EDGE_HOME_VERSION}</b></p>
    <p>系统正在卸载旧 Service Worker 并清理浏览器缓存。完成后会自动进入安全登录页，旧入口会带到题干条件、边界条件、公式选择、真题训练、自制动画和单位检查这轮入口。</p>
    <p><a id="go" href="${target}">立即进入安全登录</a></p>
    <p><small>如果仍然无法打开，请换无痕窗口测试，或在浏览器里清除当前站点数据。</small></p>
  </main>
  <script>
  async function clearOldEntryState() {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
      if (window.caches && caches.keys) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    } catch (_) {}
  }
  (async () => {
    const timeout = new Promise((resolve) => setTimeout(resolve, 1200));
    await Promise.race([clearOldEntryState(), timeout]);
    setTimeout(() => { location.replace('${target}'); }, 900);
  })();
  </script>
</body>
</html>`;
}

function renderAdmin() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>边缘安全监控</title>
  <style>
    :root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f4f7fb;color:#12202f}
    body{margin:0;padding:24px}
    header{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-bottom:20px}
    h1{margin:0;font-size:28px}
    h2{margin:0 0 10px;font-size:18px}
    a,button{border:0;border-radius:7px;background:#0f766e;color:#fff;text-decoration:none;padding:10px 14px;font-weight:800;cursor:pointer}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:18px}
    .card{background:#fff;border:1px solid #dce6ef;border-radius:8px;padding:16px}
    .num{font-size:30px;font-weight:900;margin-top:6px}
    input,select,textarea{min-height:38px;border:1px solid #c9d7e3;border-radius:7px;padding:0 10px;background:#fff;font:inherit}
    textarea{padding:10px;resize:vertical;min-height:76px}
    table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #dce6ef;border-radius:8px;overflow:hidden}
    th,td{padding:10px;border-bottom:1px solid #e7eef5;text-align:left;font-size:13px;vertical-align:top}
    th{background:#eef5f8}
    .muted{color:#64748b}
    .bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
	    .panel{background:#fff;border:1px solid #dce6ef;border-radius:8px;padding:14px;margin-bottom:18px}
	    .chips{display:flex;gap:8px;flex-wrap:wrap}.chip{background:#e6f4f1;color:#0f766e;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:800}
		    .chip.goodchip{background:#dcfce7;color:#166534}.chip.badchip{background:#fee2e2;color:#991b1b}.chip.warnchip{background:#fff7ed;color:#9a3412}
	    .riskgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
	    .riskitem{display:block;width:100%;border:1px solid #dce6ef;border-radius:8px;padding:12px;background:#f8fafc;color:#12202f;text-align:left;cursor:pointer;font:inherit;font-weight:400}
	    .riskitem.hot{background:#fff1f2;border-color:#fecdd3}.riskitem.warn{background:#fff7ed;border-color:#fed7aa}
	    .riskitem:hover{border-color:#0f766e;box-shadow:0 8px 22px rgba(15,118,110,.12)}
	    .riskhead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}
	    .riskhead b{font-size:14px}.riskscore{font-weight:900;color:#b91c1c}
	    .riskmeta{font-size:12px;line-height:1.55;color:#475569;word-break:break-word}
	    .focusline{font-size:12px;color:#0f766e;font-weight:900;margin-top:7px}
      .devicepanel{display:grid;grid-template-columns:minmax(260px,340px) minmax(300px,1fr);gap:14px}
      .devicecard{background:#f8fafc;border:1px solid #dce6ef;border-radius:8px;padding:12px}
      .devicepick{display:flex;flex-wrap:wrap;gap:8px}
      .devicepick button{padding:8px 10px;border-radius:8px;background:#eef5f8;color:#12202f;border:1px solid #cfe0ea;text-align:left;line-height:1.4}
      .devicepick button.active{background:#0f766e;color:#fff;border-color:#0f766e}
      .devicepick button.warn{border-color:#dc2626;background:#fff1f2;color:#991b1b}
      .stack{display:flex;flex-direction:column;gap:10px}
	    .good{color:#0f766e;font-weight:900}.bad{color:#b91c1c;font-weight:900}.nowrap{white-space:nowrap}
    .small{font-size:12px;line-height:1.45}.wide{overflow:auto;margin-bottom:18px}
    .formgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:10px}
    .field{display:flex;flex-direction:column;gap:6px}.field label{font-size:12px;font-weight:900;color:#475569}
    .progress{height:10px;border-radius:999px;background:#e2e8f0;overflow:hidden;margin-top:10px}.progress span{display:block;height:100%;width:0;background:#0f766e;transition:width .2s ease}
    .statusline{margin-top:8px;color:#475569;font-size:13px}
    button.secondary{background:#334155}
    button.danger{background:#991b1b}
    .rowactions{display:flex;flex-wrap:wrap;gap:6px}
    .rowactions button{padding:7px 9px;border-radius:8px;font-size:12px;line-height:1}
    .pvaccess{display:grid;gap:6px;margin-top:8px}
    .pvaccess label{font-size:12px;color:var(--muted)}
    .pvaccess input{width:100%;min-width:160px;border:1px solid var(--line);border-radius:8px;padding:7px 8px;font:13px/1.2 inherit;background:rgba(255,255,255,.9);color:inherit}
    code{white-space:pre-wrap;word-break:break-word}
    @media (max-width:720px){body{padding:14px}header{align-items:flex-start;flex-direction:column}table{font-size:12px}th:nth-child(5),td:nth-child(5){display:none}}
  </style>
</head>
<body>
  <header>
    <div>
      <h1>边缘安全监控</h1>
      <div class="muted">集中记录网页登录、页面访问、题库资源访问、前端行为上报和异常；这些只用于最近审计诊断，累计答题和累计时长只认 /api/progress 服务端快照。</div>
    </div>
    <div class="bar">
      <button id="refresh">刷新</button>
      <button id="export">导出 JSON</button>
      <a href="/index-complete.html">进入平台</a>
      <a href="/_edge-logout">退出</a>
    </div>
  </header>
  <section class="grid">
    <div class="card">事件总数<div class="num" id="total">0</div></div>
    <div class="card">登录成功<div class="num" id="logins">0</div></div>
    <div class="card">访问页面<div class="num" id="views">0</div></div>
    <div class="card">被拦截<div class="num" id="blocked">0</div></div>
    <div class="card">可疑/锁定访问<div class="num" id="suspiciousTotal">0</div></div>
    <div class="card">最近答题事件<div class="num" id="answers">0</div></div>
    <div class="card">最近事件正确率<div class="num" id="accuracy">0%</div></div>
    <div class="card">学习进度主存储<div class="num" id="progressStoreMode">—</div></div>
    <div class="card">独立 IP<div class="num" id="uniqueIps">0</div></div>
    <div class="card">独立设备<div class="num" id="uniqueDevices">0</div></div>
    <div class="card">验证码请求<div class="num" id="codeRequests">0</div></div>
    <div class="card">验证码发送成功<div class="num" id="codeSent">0</div></div>
    <div class="card">注册成功<div class="num" id="registerSuccess">0</div></div>
    <div class="card">注册失败<div class="num" id="registerFailed">0</div></div>
    <div class="card">私有视频播放<div class="num" id="privateStreams">0</div></div>
    <div class="card">私有视频开始观看<div class="num" id="privateWatchStarts">0</div></div>
    <div class="card">私有视频看完<div class="num" id="privateWatchCompletes">0</div></div>
    <div class="card">私有视频异常<div class="num" id="privateWatchErrors">0</div></div>
    <div class="card">视频上传动作<div class="num" id="videoUploads">0</div></div>
    <div class="card">上传流量<div class="num" id="uploadBytes">0</div></div>
  </section>
		  <section class="panel">
		    <div class="bar">
		      <input id="search" placeholder="搜索路径 / 用户 / IP / 事件">
		      <select id="typeFilter"><option value="">全部类型</option></select>
      <input id="monitorSearch" placeholder="快速筛选账号 / IP / 设备 / 路径">
      <label class="small"><input id="riskOnly" type="checkbox"> 只看风险项</label>
      <button id="clearFilter">清除筛选</button>
      <button id="loadRaw" class="secondary">加载原始日志</button>
		      <span id="rawState" class="small muted">快速摘要模式</span>
		    </div>
		  </section>
		  <section class="panel" data-round402-server-health-panel="teacher-admin">
		    <h2>服务器生产状态</h2>
		    <div class="muted small">累计答题、累计正确数、场次和学习时长只认 noMutationRead 的服务端快照；登录、刷新、代码部署、本机 localStorage 和最近事件窗不能改累计值。</div>
		    <div class="grid" style="margin-top:12px">
		      <div class="card">当前版本<div class="num" id="serverHealthVersion">—</div></div>
		      <div class="card">累计进度存储<div class="num" id="serverHealthProgress">—</div></div>
		      <div class="card">私有视频存储<div class="num" id="serverHealthPrivateVideo">—</div></div>
		      <div class="card">公开 HTTP 入口<div class="num" id="serverHealthPublicEntry">—</div></div>
		    </div>
		    <div id="serverHealthClaims" class="chips" aria-label="服务器健康声明">正在读取服务器健康状态...</div>
		    <div id="serverHealthBlockers" class="statusline">等待 /_edge-server-health。</div>
		  </section>
		  <section class="panel">
		    <h2>风险总览</h2>
		    <div id="riskOverview" class="riskgrid"><div class="muted">加载中...</div></div>
		  </section>
    <section class="panel">
      <h2>设备绑定管理</h2>
      <div class="grid" style="margin-top:12px">
        <div class="card">已注册账号<div class="num" id="bindingRegistered">0</div></div>
        <div class="card">已绑定账号<div class="num" id="bindingBound">0</div></div>
        <div class="card">未绑定账号<div class="num" id="bindingUnbound">0</div></div>
        <div class="card">近期冲突账号<div class="num" id="bindingConflicts">0</div></div>
        <div class="card">已锁定账号<div class="num" id="bindingLocked">0</div></div>
      </div>
      <div class="devicepanel">
        <div class="stack">
          <div class="devicecard">
            <div class="formgrid" style="margin-top:0">
              <div class="field"><label>账号</label><select id="bindingUserSelect"></select></div>
              <div class="field"><label>设备 ID</label><input id="bindingDeviceId" placeholder="从右侧候选设备点选或手填"></div>
              <div class="field"><label>设备标签</label><input id="bindingDeviceLabel" placeholder="例如 tablet / iOS / Safari"></div>
              <div class="field"><label>备注</label><input id="bindingNote" placeholder="例如：qi 指定 iPad"></div>
            </div>
            <div class="bar" style="margin-top:12px">
              <button id="saveBinding">绑定到此设备</button>
              <button id="clearBinding" class="secondary">清除绑定并踢出</button>
            </div>
            <div id="bindingStatus" class="statusline">选择账号后可直接换绑；旧设备会在下一次校验时退出。</div>
          </div>
          <div id="bindingAccountCard" class="devicecard"><div class="muted">正在加载账号绑定信息...</div></div>
        </div>
        <div class="stack">
          <div class="devicecard">
            <div class="bar" style="justify-content:space-between">
              <strong>账号见过的设备</strong>
              <span class="small muted">点一下即可填到左侧</span>
            </div>
            <div id="bindingDeviceCandidates" class="devicepick" style="margin-top:12px"><span class="muted">暂无设备候选</span></div>
          </div>
        </div>
      </div>
    </section>
    <section class="panel">
      <h2>学生密码重置</h2>
      <div class="muted small">学生忘记密码时，老师可设置临时密码；旧密码不会显示，旧登录会话会失效，账号是否开通学习权限保持原状态。</div>
      <div class="formgrid">
        <div class="field"><label>学生账号</label><select id="passwordResetUserSelect"></select></div>
        <div class="field"><label>临时密码</label><input id="studentTempPassword" type="password" autocomplete="new-password" placeholder="至少 ${PASSWORD_MIN_LENGTH} 位"></div>
        <div class="field"><label>确认临时密码</label><input id="studentTempPasswordConfirm" type="password" autocomplete="new-password" placeholder="再输入一次"></div>
      </div>
      <div class="bar" style="margin-top:12px">
        <button id="resetStudentPassword">设置临时密码</button>
      </div>
      <div id="passwordResetStatus" class="statusline">选择学生账号后可重置；不会自动放行未开通账号。</div>
    </section>
	  <section class="panel">
	    <h2>教师私有视频上传</h2>
	    <div class="muted small">上传后自动按小分片写入后台，发布后仅教师和 1 个指定学生可见；多段一对一课请优先到 <a href="/teacher-panel.html">教师后台资源管理</a> 上传，会自动合并成同一节连续播放课程。</div>
    <div class="formgrid">
      <div class="field"><label>视频文件</label><input id="privateVideoFile" type="file" accept="video/*"></div>
      <div class="field"><label>标题</label><input id="privateVideoTitle" placeholder="例如：qi 课堂回放 02"></div>
	      <div class="field"><label>授权学生账号</label><input id="privateVideoUsers" placeholder="只填 1 个账号，例如 qi"></div>
      <div class="field"><label>说明</label><textarea id="privateVideoDesc" placeholder="这节课对应的内容"></textarea></div>
    </div>
    <div class="bar" style="margin-top:12px">
      <button id="uploadPrivateVideo">上传并发布</button>
      <button id="reloadPrivateVideos" class="secondary">刷新视频列表</button>
    </div>
    <div class="progress"><span id="privateVideoUploadBar"></span></div>
    <div id="privateVideoUploadStatus" class="statusline">等待选择视频。</div>
  </section>
		  <section class="wide">
		    <h2>私有视频列表</h2>
		    <div id="privateVideoActionStatus" class="statusline">可在这里发布整节课、改授权、下架或删除教师上传的专属课。</div>
		    <div id="privateVideoStorageSnapshot" class="statusline">正在检查 FM_AUDIT / FM_PRIVATE_MEDIA 写入状态...</div>
		    <div id="privateVideoActionReadiness" class="chips" aria-label="私有视频操作可用性"></div>
		    <datalist id="privateVideoUserOptions"></datalist>
	    <table>
	      <thead><tr><th>专属课</th><th>状态/分段</th><th>授权账号</th><th>存储</th><th>更新时间</th><th>管理</th></tr></thead>
	      <tbody id="privateVideoRows"><tr><td colspan="6">加载中...</td></tr></tbody>
	    </table>
	  </section>
	  <section class="wide">
	    <h2>私有视频观看进度</h2>
	    <table>
	      <thead><tr><th>视频</th><th>观看账号</th><th>观看进度</th><th>事件</th><th>最近活动</th></tr></thead>
	      <tbody id="privateVideoProgressRows"><tr><td colspan="5">暂无观看记录</td></tr></tbody>
	    </table>
	  </section>
	  <section class="grid">
    <div class="card">活跃用户<div id="users" class="chips"></div></div>
    <div class="card">高频页面<div id="paths" class="chips"></div></div>
    <div class="card">高频事件<div id="eventTypes" class="chips"></div></div>
    <div class="card">主要设备<div id="devices" class="chips"></div></div>
  </section>
  <section class="panel">
    <h2>知识点答题薄弱处</h2>
    <div id="knowledgeChips" class="chips"></div>
  </section>
	  <section class="wide">
	    <h2>账号 IP / 设备画像</h2>
	    <div class="muted small">此表用于安全和访问画像；页面访问、登录、资源请求、视频观看是最近审计诊断，不会并入学生累计答题数或累计学习时长。</div>
	    <table>
      <thead><tr><th>账号</th><th>IP/位置</th><th>设备/会话</th><th>访问与权限</th><th>学习与视频</th><th>最近活动</th></tr></thead>
      <tbody id="accountRows"><tr><td colspan="6">加载中...</td></tr></tbody>
    </table>
  </section>
  <section class="wide">
    <h2>陌生 / 异常访问</h2>
    <table>
      <thead><tr><th>时间</th><th>账号/尝试账号</th><th>事件</th><th>路径/结果</th><th>IP/位置</th><th>设备/会话</th></tr></thead>
      <tbody id="suspiciousRows"><tr><td colspan="6">加载中...</td></tr></tbody>
    </table>
  </section>
  <section class="wide">
    <h2>IP 反查与风险画像</h2>
    <table>
      <thead><tr><th>IP</th><th>账号/尝试账号</th><th>设备</th><th>异常</th><th>访问</th><th>最近活动</th></tr></thead>
      <tbody id="ipProfileRows"><tr><td colspan="6">加载中...</td></tr></tbody>
    </table>
  </section>
  <section class="wide">
    <h2>设备反查</h2>
    <table>
      <thead><tr><th>设备</th><th>账号/尝试账号</th><th>IP</th><th>事件/异常</th><th>最近活动</th></tr></thead>
      <tbody id="deviceProfileRows"><tr><td colspan="5">加载中...</td></tr></tbody>
    </table>
  </section>
	  <section class="wide">
	    <h2>学生学习进度</h2>
	    <div class="muted small">累计答题、正确率、场次和学习时长只来自服务端学习进度快照；audit-event-window、登录刷新、页面心跳和服务器升级不会推进累计值。</div>
	    <table>
      <thead><tr><th>账号</th><th>答题</th><th>薄弱知识点</th><th>私有视频</th><th>访问</th><th>最近活动</th></tr></thead>
      <tbody id="learningRows"><tr><td colspan="6">加载中...</td></tr></tbody>
    </table>
  </section>
  <section class="wide">
    <h2>用户详细监控</h2>
    <table>
      <thead><tr><th>用户</th><th>IP/位置</th><th>设备/会话</th><th>登录/访问</th><th>答题/正确率</th><th>知识点</th><th>最近活动</th></tr></thead>
      <tbody id="userRows"><tr><td colspan="7">加载中...</td></tr></tbody>
    </table>
  </section>
  <section class="wide">
    <h2>最近练习场次</h2>
    <table>
      <thead><tr><th>时间</th><th>用户/IP/设备</th><th>题库</th><th>完成情况</th><th>知识点表现</th><th>错题</th></tr></thead>
      <tbody id="sessionRows"><tr><td colspan="6">暂无记录</td></tr></tbody>
    </table>
  </section>
  <section class="wide">
    <h2>最近答题明细</h2>
    <table>
      <thead><tr><th>时间</th><th>用户/IP/设备</th><th>题库/知识点</th><th>题目</th><th>作答/标答</th><th>判定</th></tr></thead>
      <tbody id="answerRows"><tr><td colspan="6">暂无记录</td></tr></tbody>
    </table>
  </section>
  <section class="wide">
    <h2>最近注册 / 密码链路</h2>
    <table>
      <thead><tr><th>时间</th><th>用户</th><th>邮箱</th><th>类型</th><th>结果</th><th>设备/IP</th></tr></thead>
      <tbody id="registerRows"><tr><td colspan="6">暂无记录</td></tr></tbody>
    </table>
  </section>
  <section class="wide">
    <h2>私有视频行为</h2>
    <table>
      <thead><tr><th>时间</th><th>用户/IP/设备</th><th>视频</th><th>事件</th><th>状态/范围</th><th>存储/大小</th></tr></thead>
      <tbody id="privateVideoEventRows"><tr><td colspan="6">暂无记录</td></tr></tbody>
    </table>
  </section>
  <section class="wide">
    <h2>最近行为链路</h2>
    <table>
      <thead><tr><th>时间</th><th>用户</th><th>事件</th><th>路径/结果</th><th>IP/设备</th><th>会话</th></tr></thead>
      <tbody id="timelineRows"><tr><td colspan="6">暂无记录</td></tr></tbody>
    </table>
  </section>
  <h2>原始事件</h2>
  <table>
    <thead><tr><th>时间</th><th>类型</th><th>路径</th><th>用户</th><th>IP/地区</th><th>详情</th></tr></thead>
    <tbody id="rows"><tr><td colspan="6">加载中...</td></tr></tbody>
  </table>
  <script>
	    let latest = [];
	    let summary = {};
	    let filtered = [];
		    let privateVideos = [];
		    let privateCourses = [];
		    let privateVideoLimits = null;
		    let serverHealth = null;
	    let rawLoaded = false;
	    const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
	    const MONITOR_RISK_TYPES = new Set(['blocked_request','locked_request','login_failed','login_blocked','admin_denied','private_video_denied','private_video_watch_error','register_rejected','register_code_rejected','register_account_error','register_email_failed','password_reset_code_rejected','password_reset_rejected','password_reset_email_failed','student_password_admin_reset_rejected','device_bind_mismatch','concurrent_device_denied','restricted_account_denied','device_binding_missing','device_session_missing','device_identity_missing','device_session_revoked']);
    function count(type){return latest.filter(e => e.type === type).length}
    function summaryCount(type){
      const hit = (summary.topEventTypes || []).find(item => item.name === type);
      return hit ? hit.count : count(type);
    }
    function coreCount(name){return summary.coreEventCounts && Number.isFinite(Number(summary.coreEventCounts[name])) ? Number(summary.coreEventCounts[name]) : 0}
    function pct(v){return Number.isFinite(Number(v)) ? Math.round(Number(v)) + '%' : '0%'}
    function seconds(v){const n=Number(v)||0;return n>=60?Math.round(n/60)+' 分钟':Math.round(n)+' 秒'}
    function bytes(v){const n=Number(v)||0;if(n>=1073741824)return (n/1073741824).toFixed(2)+' GB';if(n>=1048576)return (n/1048576).toFixed(1)+' MB';if(n>=1024)return Math.round(n/1024)+' KB';return n+' B'}
    function bjTime(value){
      if(!value)return '';
      const d = new Date(value);
      if(Number.isNaN(d.getTime()))return String(value || '');
      const p = new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(d).reduce((acc,item)=>{acc[item.type]=item.value;return acc},{});
      return p.year+'-'+p.month+'-'+p.day+' '+p.hour+':'+p.minute+':'+p.second+' 北京时间';
	    }
	    function bjOrRaw(value){const text=String(value||'');return /\\d{4}-\\d{2}-\\d{2}T/.test(text) || /^\\d{10,}$/.test(text) ? bjTime(text) : text}
	    function ipSourceLabel(source, verified){
	      if(source === 'true-client-ip') return 'Cloudflare True-Client-IP';
	      if(source === 'cf-connecting-ip') return 'Cloudflare 真实访客 IP';
	      if(verified) return 'Cloudflare 真实访客 IP';
	      if(source === 'x-forwarded-for-unverified') return '转发头未验证，不作真实 IP';
	      if(source === 'legacy-unverified') return '历史记录未标来源，不作真实 IP';
	      return '未获取边缘真实 IP';
	    }
	    function ipDetail(row){
	      const source = row && (row.ipSource || (row.ipSources && row.ipSources[0]) || '');
	      const verified = !!(row && (row.ipVerified || source === 'cf-connecting-ip' || source === 'true-client-ip'));
	      const forwarded = row && (row.forwardedIp || (row.forwardedIps && row.forwardedIps[0]) || '');
	      const label = ipSourceLabel(source, verified);
	      return forwarded && !verified ? label + '；转发头 ' + forwarded : label;
	    }
	    function ipListHtml(row){
	      const ips = row && Array.isArray(row.ips) ? row.ips.filter(Boolean) : (row && row.ip ? [row.ip] : []);
	      const ipText = ips.length ? ips.join(' / ') : '未获取真实 IP';
	      return esc(ipText) + '<div class="muted">'+esc(ipDetail(row||{}))+'</div>';
	    }
	    function ipInline(row){
	      const ip = row && row.ip ? row.ip : '';
	      return ip || '未获取真实 IP';
	    }
	    function shortDeviceId(value){const text=String(value||'').trim();return text?((text.length<=18)?text:(text.slice(0,8)+'…'+text.slice(-6))):''}
    function deviceText(event){
      if (!event || !event.device) return 'unknown';
      const d = event.device;
      return [d.deviceClass, d.os, d.browser].filter(Boolean).join(' / ') || 'unknown';
    }
    function topBy(key, n=6){
      const map = new Map();
      latest.forEach(e => {
        const value = typeof key === 'function' ? key(e) : e[key];
        if (!value) return;
        map.set(value, (map.get(value)||0)+1);
      });
      return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0,n);
    }
    function drawChips(id, items){
      document.getElementById(id).innerHTML = items.map(([name,count]) => '<span class="chip">'+esc(name)+' · '+count+'</span>').join('') || '<span class="muted">暂无</span>';
    }
	    function drawAccuracyChips(id, items){
	      document.getElementById(id).innerHTML = (items||[]).map(item => {
	        const cls = item.answered >= 2 && item.accuracy < 60 ? ' badchip' : (item.answered >= 2 && item.accuracy < 80 ? ' warnchip' : '');
	        return '<span class="chip'+cls+'">'+esc(item.name)+' · '+esc(item.correct)+'/'+esc(item.answered)+' · '+pct(item.accuracy)+'</span>';
	      }).join('') || '<span class="muted">暂无答题知识点</span>';
	    }
	    function serverHealthChip(label, ok, detail){
	      return '<span class="chip '+(ok ? 'goodchip' : 'warnchip')+'" title="'+esc(detail||'')+'">'+esc(label)+'：'+(ok?'已满足':'未满足')+'</span>';
	    }
	    function renderServerHealth(){
	      const h = serverHealth && typeof serverHealth === 'object' ? serverHealth : null;
	      const version = document.getElementById('serverHealthVersion');
	      const progress = document.getElementById('serverHealthProgress');
	      const privateVideo = document.getElementById('serverHealthPrivateVideo');
	      const publicEntry = document.getElementById('serverHealthPublicEntry');
	      const claims = document.getElementById('serverHealthClaims');
	      const blockers = document.getElementById('serverHealthBlockers');
	      if(!version || !progress || !privateVideo || !publicEntry || !claims || !blockers)return;
	      if(!h){
	        version.textContent='读取中';
	        progress.textContent='读取中';
	        privateVideo.textContent='读取中';
	        publicEntry.textContent='读取中';
	        claims.innerHTML='<span class="muted">正在读取 /_edge-server-health。</span>';
	        blockers.textContent='等待服务器健康接口返回。';
	        return;
	      }
	      const lp = h.learningProgress || {};
	      const pv = h.privateVideo || {};
	      const pe = h.publicEntry || {};
	      const c = h.claims || {};
	      version.textContent = h.edgeHomeVersion || h.version || '—';
	      progress.textContent = lp.strictCumulativeServer ? 'D1/R2 strict' : (lp.storeMode === 'kv-single-write-fallback' ? 'KV 服务端累计' : (lp.storeMode || '未绑定'));
	      progress.title = lp.boundary || lp.serverUpgradeInvariant || '';
	      privateVideo.textContent = pv.storageReady ? 'FM_PRIVATE_MEDIA 就绪' : 'R2 未就绪';
	      privateVideo.title = pv.boundary || '';
	      publicEntry.textContent = c.httpEntryReady ? 'HTTP 301/308 已证' : '外部修复待验';
	      publicEntry.title = pe.lastKnownBlocker || pe.externalRepairReason || '';
	      claims.innerHTML = [
	        serverHealthChip('读不漂移', c.readNoDriftReady, h.serverUpgradeInvariant),
	        serverHealthChip('D1/R2 strict 写入', c.strictProgressWritesReady, lp.writeDurabilityGate && lp.writeDurabilityGate.blockedReason),
	        serverHealthChip('本机缓存不入累计', c.localStorageExcludedFromCumulative, lp.displayContract),
	        serverHealthChip('事件窗不入累计', c.auditEventWindowExcludedFromCumulative, lp.displayContract),
	        serverHealthChip('私有视频 R2', c.privateVideoStorageReady, pv.boundary),
	        serverHealthChip('HTTP 公开入口', c.httpEntryReady, pe.expectedHttpPermanentRedirect)
	      ].join('');
	      const list = Array.isArray(h.blockers) ? h.blockers : [];
	      blockers.innerHTML = list.length
	        ? '未完成生产项：' + list.map(item => '<code>'+esc(item.id || item.label || '')+'</code> '+esc(item.reason || '')).join('；')
	        : '<span class="good">服务器生产边界当前没有阻塞项。</span>';
	    }
    function knowledgeCells(items){
      return (items||[]).slice(0,4).map(item => {
        const cls = item.answered >= 2 && item.accuracy < 60 ? ' badchip' : (item.answered >= 2 && item.accuracy < 80 ? ' warnchip' : '');
        return '<span class="chip'+cls+'">'+esc(item.name)+' '+pct(item.accuracy)+' ('+esc(item.correct)+'/'+esc(item.answered)+')</span>';
      }).join('') || '<span class="muted">暂无</span>';
    }
	    function monitorNeedle(){const el=document.getElementById('monitorSearch');return el ? el.value.trim().toLowerCase() : ''}
	    function riskOnly(){const el=document.getElementById('riskOnly');return !!(el && el.checked)}
    function flattenText(value){
      if(value == null)return '';
      if(Array.isArray(value))return value.map(flattenText).join(' ');
      if(typeof value === 'object')return Object.values(value).map(flattenText).join(' ');
      return String(value);
    }
	    function riskValue(row){
	      const type = String(row && (row.type || row.eventType) || '');
	      const text = [row && row.result, row && row.reason, row && row.status, row && row.message].map(flattenText).join(' ');
	      const textRisk = /(fail|failed|reject|rejected|denied|error|blocked|locked|失败|拒绝|异常|错误|锁定|拦截)/i.test(text) ? 1 : 0;
	      const wrongAnswer = row && row.isCorrect === false ? 1 : 0;
	      return Number(row&&row.riskScore||0)+Number(row&&row.loginFailed||0)+Number(row&&row.lockedRequests||0)+Number(row&&row.blockedRequests||0)+Number(row&&row.adminDenied||0)+Number(row&&row.privateVideoDenied||0)+Number(row&&row.privateVideoWatchErrors||0)+Number(row&&row.suspiciousEvents||0)+(MONITOR_RISK_TYPES.has(type)?1:0)+textRisk+wrongAnswer;
	    }
	    function riskSearch(row){return String(row && (row.search || row.label || row.ip || row.device || row.user) || '').trim()}
	    function filterMonitorRows(rows, fields, riskFn){
	      const needle = monitorNeedle();
	      const onlyRisk = riskOnly();
	      return (rows||[]).filter(row => {
	        if(onlyRisk && !(riskFn ? riskFn(row) : riskValue(row)))return false;
	        if(!needle)return true;
	        return fields.map(field => flattenText(typeof field === 'function' ? field(row) : row[field])).join(' ').toLowerCase().includes(needle);
	      });
	    }
	    function drawRiskOverview(){
	      const rows = filterMonitorRows(summary.riskOverview || [], ['kind','label','detail','reasons','users','attemptedUsers','ips','devices','path','lastSeen'], row => Number(row.score||0)).slice(0, 12);
	      document.getElementById('riskOverview').innerHTML = rows.map((row) => {
	        const cls = Number(row.score||0) >= 8 ? ' hot' : (Number(row.score||0) >= 3 ? ' warn' : '');
	        const reasons = (row.reasons||[]).slice(0,4).join(' / ');
	        const detail = [row.detail, row.path, bjOrRaw(row.lastSeen)].filter(Boolean).join(' · ');
	        return '<button type="button" class="riskitem'+cls+'" data-risk-search="'+esc(riskSearch(row))+'"><div class="riskhead"><b>'+esc(row.kind||'风险')+'：'+esc(row.label||'')+'</b><span class="riskscore">风险 '+esc(row.score||0)+'</span></div><div class="riskmeta">'+esc(reasons||'待观察')+'</div><div class="riskmeta muted">'+esc(detail||'暂无细节')+'</div><div class="focusline">筛选：'+esc(riskSearch(row)||'相关记录')+'</div></button>';
	      }).join('') || '<div class="muted">当前摘要范围内暂无风险项。</div>';
	    }
	    function focusRiskSearch(term){
	      const q = String(term || '').trim();
	      if(!q)return;
	      document.getElementById('monitorSearch').value = q;
	      document.getElementById('riskOnly').checked = true;
	      redrawMonitorTables();
	    }
    function bindingAccounts(){
      return (summary.users || []).filter(row => row && row.user && row.identityKind !== '未登录访客' && row.identityKind !== '未登录尝试账号' && row.access !== 'unknown')
        .sort((a,b) => {
          if ((a.user || '') === 'qi' && (b.user || '') !== 'qi') return -1;
          if ((b.user || '') === 'qi' && (a.user || '') !== 'qi') return 1;
          return String(a.user||'').localeCompare(String(b.user||''), 'zh-CN');
        });
    }
    function findBindingAccount(username){
      const key = String(username || '').trim();
      return bindingAccounts().find(row => String(row.user || '') === key) || null;
    }
    function bindingDevicePool(row){
      if(!row)return [];
      const map = new Map();
      (row.seenDevices || []).forEach(device => {
        if(device && device.deviceId)map.set(device.deviceId, device);
      });
      if(row.deviceBinding && row.deviceBinding.deviceId && !map.has(row.deviceBinding.deviceId)){
        map.set(row.deviceBinding.deviceId, {
          deviceId: row.deviceBinding.deviceId,
          shortId: row.deviceBinding.shortDeviceId || shortDeviceId(row.deviceBinding.deviceId),
          label: row.deviceBinding.label || '',
          browser: row.deviceBinding.browser || '',
          os: row.deviceBinding.os || '',
          platform: row.deviceBinding.platform || '',
          deviceClass: row.deviceBinding.deviceClass || '',
          isIpad: !!row.deviceBinding.isIpad,
          ips: row.deviceBinding.lastIp ? [row.deviceBinding.lastIp] : [],
          ipSources: row.deviceBinding.lastIpSource ? [row.deviceBinding.lastIpSource] : [],
          forwardedIps: [],
          browserSessionIds: row.deviceBinding.lastBrowserSessionId ? [row.deviceBinding.lastBrowserSessionId] : [],
          eventCount: 0,
          lastSeenAt: Date.parse(row.deviceBinding.lastSeenAt || '') || 0,
          lastSeen: row.deviceBinding.lastSeenAt || ''
        });
      }
      return Array.from(map.values()).sort((a,b) => Number(b.lastSeenAt||0) - Number(a.lastSeenAt||0) || Number(b.eventCount||0) - Number(a.eventCount||0));
    }
    function setBindingDraftFromDevice(device){
      if(!device)return;
      document.getElementById('bindingDeviceId').value = device.deviceId || '';
      document.getElementById('bindingDeviceLabel').value = device.label || [device.deviceClass, device.os, device.browser].filter(Boolean).join(' / ');
      const noteEl = document.getElementById('bindingNote');
      if(noteEl && !noteEl.value.trim()){
        noteEl.value = device.isIpad ? 'iPad 指定绑定' : '教师指定绑定';
      }
    }
    function drawBindingPanel(){
      const overview = summary.bindingOverview || {};
      document.getElementById('bindingRegistered').textContent = overview.registeredAccounts || 0;
      document.getElementById('bindingBound').textContent = overview.boundAccounts || 0;
      document.getElementById('bindingUnbound').textContent = overview.unboundAccounts || 0;
      document.getElementById('bindingConflicts').textContent = overview.conflictAccounts || 0;
      document.getElementById('bindingLocked').textContent = overview.lockedAccounts || 0;
      const select = document.getElementById('bindingUserSelect');
      const status = document.getElementById('bindingStatus');
      const current = select.value || 'qi';
      const rows = bindingAccounts();
      select.innerHTML = rows.map(row => '<option value="'+esc(row.user||'')+'">'+esc(row.user||'')+' · '+esc(row.identityKind||'')+'</option>').join('') || '<option value="">暂无账号</option>';
      if(rows.some(row => String(row.user) === current)) select.value = current;
      else if(rows.length) select.value = rows[0].user;
      const row = findBindingAccount(select.value);
      const saveBtn = document.getElementById('saveBinding');
      const clearBtn = document.getElementById('clearBinding');
      if(!row){
        saveBtn.disabled = true;
        clearBtn.disabled = true;
        document.getElementById('bindingAccountCard').innerHTML = '<div class="muted">暂无可管理账号。</div>';
        document.getElementById('bindingDeviceCandidates').innerHTML = '<span class="muted">暂无设备候选</span>';
        status.dataset.mode = 'auto';
        status.textContent = '暂无已注册账号可供换绑。';
        return;
      }
      const policy = row.devicePolicy && row.devicePolicy.label ? row.devicePolicy.label : '未识别策略';
      const binding = row.deviceBinding;
      const bindingHtml = binding ? ('<div><b>当前绑定：</b>'+esc(binding.shortDeviceId || shortDeviceId(binding.deviceId||''))+' · '+esc(binding.label||'')+'</div>') : '<div class="bad"><b>当前绑定：</b>未绑定</div>';
      const conflictHtml = binding && binding.mismatchCount ? ('<div class="bad"><b>最近冲突：</b>'+esc(binding.mismatchCount)+' 次；'+esc(binding.lastMismatchShortId||'')+' '+esc(binding.lastMismatchLabel||'')+'</div>') : '<div class="good"><b>最近冲突：</b>0</div>';
      const lastHtml = bjOrRaw(row.lastSeen || row.lastLoginAt || row.createdAt) || '暂无';
      const bindingMeta = binding ? [binding.deviceClass, binding.os, binding.browser].filter(Boolean).join(' / ') : '';
      const bindingUpdate = binding ? [binding.updatedBy || '', binding.updatedAt || ''].filter(Boolean).join(' · ') : '';
	      document.getElementById('bindingAccountCard').innerHTML = '<div class="stack"><div><b>'+esc(row.user||'')+'</b><div class="small muted">'+esc([row.identityKind||'', policy, row.access || ''].filter(Boolean).join(' · '))+'</div></div>'+bindingHtml+(bindingMeta ? '<div><b>绑定设备画像：</b>'+esc(bindingMeta)+'</div>' : '')+(bindingUpdate ? '<div><b>最近改绑：</b>'+esc(bindingUpdate)+'</div>' : '')+conflictHtml+'<div><b>最近时间：</b>'+esc(lastHtml)+'</div><div><b>见过设备：</b>' + esc(bindingDevicePool(row).length) + ' 台</div><div><b>IP：</b>'+ipListHtml(row)+'</div></div>';
      const candidates = bindingDevicePool(row);
      document.getElementById('bindingDeviceCandidates').innerHTML = candidates.map(device => {
        const active = document.getElementById('bindingDeviceId').value === device.deviceId;
        const warn = row.user === 'qi' && !device.isIpad;
        const note = [device.shortId || shortDeviceId(device.deviceId||''), device.label || [device.deviceClass, device.os, device.browser].filter(Boolean).join(' / '), bjOrRaw(device.lastSeen || ''), (device.ips||[])[0] || '', warn ? '非 iPad' : ''].filter(Boolean).join(' · ');
        return '<button type="button" class="'+(active ? 'active ' : '')+(warn ? 'warn' : '')+'" data-bind-device="'+esc(device.deviceId||'')+'">'+esc(note)+'</button>';
      }).join('') || '<span class="muted">暂无设备候选</span>';
      if(!binding && candidates.length && !document.getElementById('bindingDeviceId').value){
        setBindingDraftFromDevice(candidates[0]);
      }
      if(row.devicePolicy && row.devicePolicy.exempt){
        saveBtn.disabled = true;
        clearBtn.disabled = true;
        status.dataset.mode = 'auto';
        status.textContent = '教师账号默认多端放行，不需要单设备绑定。';
      }else{
        saveBtn.disabled = false;
        clearBtn.disabled = false;
        if(status.dataset.mode !== 'result' && status.dataset.mode !== 'busy'){
          status.textContent = binding ? '可以直接换绑；如果改到另一台设备，旧设备会在下一次校验时退出。' : '该账号还未绑定设备，可从右侧候选点选或手动填写设备 ID。';
        }
      }
    }
    function drawPasswordResetPanel(){
      const select = document.getElementById('passwordResetUserSelect');
      if(!select)return;
      const current = select.value || document.getElementById('bindingUserSelect').value || '';
      const rows = bindingAccounts().filter(row => !(row.devicePolicy && row.devicePolicy.exempt));
      select.innerHTML = rows.map(row => '<option value="'+esc(row.user||'')+'">'+esc(row.user||'')+' · '+esc(row.identityKind||'')+' · '+esc(row.access||'')+'</option>').join('') || '<option value="">暂无学生账号</option>';
      if(rows.some(row => String(row.user) === current)) select.value = current;
      else if(rows.length) select.value = rows[0].user;
      const resetBtn = document.getElementById('resetStudentPassword');
      if(resetBtn)resetBtn.disabled = !rows.length;
      const status = document.getElementById('passwordResetStatus');
      if(status && status.dataset.mode !== 'result' && status.dataset.mode !== 'busy'){
        status.textContent = rows.length ? '选择学生账号后可重置；不会自动放行未开通账号。' : '暂无可重置的学生账号。';
      }
    }
    async function submitStudentPasswordReset(){
      const username = document.getElementById('passwordResetUserSelect').value;
      const password = document.getElementById('studentTempPassword').value;
      const confirmPassword = document.getElementById('studentTempPasswordConfirm').value;
      const status = document.getElementById('passwordResetStatus');
      if(!username){status.textContent='请先选择学生账号。';return;}
      if(password.length < ${PASSWORD_MIN_LENGTH}){status.textContent='临时密码至少 ${PASSWORD_MIN_LENGTH} 位。';return;}
      if(password !== confirmPassword){status.textContent='两次输入的临时密码不一致。';return;}
      status.dataset.mode = 'busy';
      status.textContent = '正在重置学生密码...';
      document.getElementById('resetStudentPassword').disabled = true;
      try{
        const res = await fetch('/api/admin/student-access', {
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({ action:'reset-password', username, newPassword:password, confirmPassword })
        });
        const data = await readJsonOrThrow(res);
        document.getElementById('studentTempPassword').value='';
        document.getElementById('studentTempPasswordConfirm').value='';
        status.dataset.mode = 'result';
        status.textContent = data.message || '学生密码已重置。';
        await load();
      }catch(error){
        status.dataset.mode = 'result';
        status.textContent = '重置失败：' + (error && error.message ? error.message : error);
      }finally{
        drawPasswordResetPanel();
      }
    }
    async function submitBinding(action){
      const username = document.getElementById('bindingUserSelect').value;
      const status = document.getElementById('bindingStatus');
      if(!username){
        status.textContent = '请先选择账号。';
        return;
      }
      const row = findBindingAccount(username);
      const payload = { action: action, username: username };
      if(action === 'bind'){
        payload.deviceId = document.getElementById('bindingDeviceId').value.trim();
        payload.deviceLabel = document.getElementById('bindingDeviceLabel').value.trim();
        payload.note = document.getElementById('bindingNote').value.trim();
        const match = bindingDevicePool(row).find(device => device.deviceId === payload.deviceId);
        if(match){
          payload.browser = match.browser || '';
          payload.os = match.os || '';
          payload.platform = match.platform || '';
          payload.deviceClass = match.deviceClass || '';
          payload.isIpad = !!match.isIpad;
	          payload.browserSessionId = (match.browserSessionIds || [])[0] || '';
	          payload.lastIp = (match.ips || [])[0] || '';
	          payload.lastIpSource = (match.ipSources || [])[0] || '';
	          payload.lastIpVerified = payload.lastIpSource === 'cf-connecting-ip' || payload.lastIpSource === 'true-client-ip';
	        }
        if(!payload.deviceId){
          status.textContent = '请先点选或填写设备 ID。';
          return;
        }
      }
      status.dataset.mode = 'busy';
      status.textContent = action === 'clear' ? '正在清除绑定...' : '正在更新绑定...';
      try{
        const res = await fetch('/api/admin/device-bindings', {
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(payload)
        });
        const data = await readJsonOrThrow(res);
        status.textContent = data.message || '绑定已更新。';
        if(action === 'clear'){
          document.getElementById('bindingDeviceId').value = '';
          document.getElementById('bindingDeviceLabel').value = '';
        }
        status.dataset.mode = 'result';
        await load();
        status.textContent = data.message || '绑定已更新。';
      }catch(error){
        status.dataset.mode = 'result';
        status.textContent = '绑定操作失败：' + (error && error.message ? error.message : error);
      }
    }
    function drawUserRows(){
      const rows = filterMonitorRows(summary.users || [], ['user','ips','locations','devices','deviceIds','browserSessionIds','lastPath','topEventTypes','knowledgeStats'], riskValue).slice(0, 50);
      document.getElementById('userRows').innerHTML = rows.map((user) => {
        const binding = user.deviceBinding || null;
        const bindingText = binding && binding.shortDeviceId ? ('绑定 '+binding.shortDeviceId+' · '+(binding.label||'')) : '未见绑定';
        const deviceIds = (user.deviceIds||[]).map(shortDeviceId).join(' / ');
        const meta = [user.identityKind, user.access || '', user.devicePolicy && user.devicePolicy.label ? user.devicePolicy.label : ''].filter(Boolean).join(' · ');
        const mismatch = binding && binding.mismatchCount ? ('<div class="bad">绑定冲突 '+esc(binding.mismatchCount)+' 次</div>') : '';
        const lastLine = user.lastPath || (user.lastLoginAt ? ('上次登录 '+user.lastLoginAt) : (user.createdAt ? ('创建于 '+user.createdAt) : ''));
	        return '<tr><td class="nowrap"><b>'+esc(user.user)+'</b><div class="small muted">'+esc(meta)+'</div><div class="small muted">'+esc((user.topEventTypes||[]).map(i=>i.name+':'+i.count).join(' / '))+'</div></td><td class="small">'+ipListHtml(user)+'<div class="muted">'+esc((user.locations||user.countries||[]).join(' / '))+'</div></td><td class="small">'+esc((user.devices||[]).join(' / '))+'<div class="muted">'+esc((user.browserSessionIds||[]).slice(0,2).join(' / '))+'</div><div class="muted">'+esc(deviceIds||bindingText)+'</div>'+mismatch+'</td><td class="small">登录成功 '+esc(user.loginSuccess||0)+' / 失败 '+esc(user.loginFailed||0)+'<br>页面 '+esc(user.pageViews||0)+' / 资源 '+esc(user.resourceRequests||0)+' / 锁定 '+esc(user.lockedRequests||0)+'<br>私有视频请求 '+esc(user.privateVideoStreams||0)+' / 拒绝 '+esc(user.privateVideoDenied||0)+' / 上传 '+esc(user.videoUploads||0)+'<br>观看开始 '+esc(user.privateVideoWatchStarts||0)+' / 完成 '+esc(user.privateVideoWatchCompletes||0)+' / 异常 '+esc(user.privateVideoWatchErrors||0)+'<br>最高进度 '+pct(user.privateVideoWatchMaxPercent||0)+' / 看到 '+seconds(user.privateVideoWatchSeconds||0)+'</td><td class="small"><b>'+esc(user.answers||0)+' 题，'+pct(user.accuracy||0)+'</b><br>对 '+esc(user.correct||0)+' / 错 '+esc(user.incorrect||0)+' / 场次 '+esc(user.sessions||0)+'<br>均时 '+seconds(user.averageQuestionTimeSeconds||0)+'</td><td class="small"><div class="chips">'+knowledgeCells(user.knowledgeStats)+'</div></td><td class="small">'+esc(bjOrRaw(user.lastSeen||user.lastLoginAt||user.createdAt||''))+'<br><span class="muted">'+esc(lastLine)+'</span></td></tr>';
      }).join('') || '<tr><td colspan="7">暂无用户记录</td></tr>';
    }
    function drawSessionRows(){
      const rows = filterMonitorRows(summary.recentSessions || [], ['user','ip','device','bankId','sessionName','byKnowledge','wrongQuestions'], row => Number(row.incorrect||0)).slice(0, 60);
      document.getElementById('sessionRows').innerHTML = rows.map((row) => {
        const knowledge = Object.entries(row.byKnowledge||{}).slice(0,4).map(([name,stat]) => '<span class="chip">'+esc(name)+' '+pct(stat.accuracy||0)+' ('+esc(stat.correct||0)+'/'+esc(stat.answered||0)+')</span>').join('');
        const wrong = (row.wrongQuestions||[]).slice(0,4).map(q => 'Q'+esc(q.questionNumber||'')+' '+esc(q.knowledge||q.category||q.questionTitle||'')).join('；');
	        return '<tr><td class="nowrap">'+esc(bjOrRaw(row.iso||''))+'</td><td class="small">'+esc([row.user,ipInline(row),row.device].filter(Boolean).join(' · '))+'<div class="muted">'+esc(ipDetail(row))+'</div></td><td class="small">'+esc([row.bankId,row.sessionName].filter(Boolean).join(' / '))+'</td><td class="small"><b>'+esc(row.answered||0)+'/'+esc(row.totalQuestions||0)+'，'+pct(row.accuracy||0)+'</b><br>对 '+esc(row.correct||0)+' / 错 '+esc(row.incorrect||0)+' / 用时 '+seconds(row.totalTime||0)+'</td><td class="small"><div class="chips">'+(knowledge || '<span class="muted">暂无</span>')+'</div></td><td class="small">'+esc(wrong || '无')+'</td></tr>';
      }).join('') || '<tr><td colspan="6">暂无练习场次</td></tr>';
    }
	    function drawAnswerRows(){
	      const rows = filterMonitorRows(summary.recentAnswers || [], ['user','ip','device','bankId','sessionName','questionType','knowledge','questionTitle','userAnswer','correctAnswer'], row => row.isCorrect ? 0 : 1).slice(0, 80);
	      document.getElementById('answerRows').innerHTML = rows.map((row) => '<tr><td class="nowrap">'+esc(bjOrRaw(row.iso||''))+'</td><td class="small">'+esc([row.user,ipInline(row),row.device].filter(Boolean).join(' · '))+'<div class="muted">'+esc(ipDetail(row))+'</div></td><td class="small">'+esc([row.bankId,row.sessionName].filter(Boolean).join(' / '))+'<div class="muted">'+esc([row.questionType,row.knowledge].filter(Boolean).join(' · '))+'</div></td><td class="small">'+esc((row.questionNumber ? 'Q'+row.questionNumber+' ' : '')+(row.questionTitle||''))+'</td><td class="small">作答：'+esc(row.userAnswer||'')+'<br><span class="muted">标答：'+esc(row.correctAnswer||'')+'</span></td><td>'+(row.isCorrect?'<span class="good">正确</span>':'<span class="bad">错误</span>')+'<div class="small muted">耗时 '+esc(row.questionTimeSeconds||0)+' 秒 / 当次正确率 '+esc(row.accuracySoFar||0)+'%；不作为累计真值</div></td></tr>').join('') || '<tr><td colspan="6">暂无答题记录</td></tr>';
    }
    function drawRegisterRows(){
      const rows = filterMonitorRows(summary.recentRegisterEvents || [], ['username','emailHash','eventType','result','reason','provider','device','ip'], row => /failed|rejected|error/i.test(row.eventType||'') || (row.reason || row.result) && row.result !== '成功').slice(0, 60);
      document.getElementById('registerRows').innerHTML = rows.map((row) => {
        const deviceShort = row.deviceId ? shortDeviceId(row.deviceId) : (row.deviceShortId || '');
	        return '<tr><td class="nowrap">'+esc(bjOrRaw(row.iso||''))+'</td><td class="small">'+esc(row.username||'')+'</td><td class="small">'+esc(row.emailHash||'')+'</td><td class="small">'+esc(row.eventType||'')+'</td><td class="small">'+esc(row.result||row.reason||row.provider||'')+'</td><td class="small">'+esc([row.device,ipInline(row)].filter(Boolean).join(' · '))+'<div class="muted">'+esc([deviceShort, ipDetail(row)].filter(Boolean).join('；'))+'</div></td></tr>';
      }).join('') || '<tr><td colspan="6">暂无注册或密码记录</td></tr>';
    }
	    function drawPrivateVideoRows(){
	      const rows = (privateCourses && privateCourses.length ? privateCourses : (privateVideos || []));
	      renderPrivateVideoLimits();
	      const candidates = privateVideoAssignableUsers();
	      const options = candidates.map(user => '<option value="'+esc(user)+'"></option>').join('');
	      const optionsEl = document.getElementById('privateVideoUserOptions');
	      if(optionsEl)optionsEl.innerHTML = options;
	      document.getElementById('privateVideoRows').innerHTML = rows.map((row) => {
	        const users = (row.assignedUsers || []).join(' / ') || '全部教师可见';
	        const id = row.courseId || row.id || '';
	        const title = row.courseTitle || row.title || id || '未命名专属课';
	        const isStatic = String(row.storage||'').includes('static') || id === '${PRIVATE_QI_VIDEO_ID}';
	        const state = row.status === 'published' ? '已发布' : (row.status === 'archived' ? '已下架' : (row.status === 'uploading' ? '未完整发布' : row.status || '未知'));
	        const segments = row.segmentCount ? ('分段 '+esc(row.uploadedSegments||0)+' / '+esc(row.segmentCount||0)+'，已发布 '+esc(row.publishedSegments||0)) : ('分片 '+esc(row.uploadedChunks||0)+' / '+esc(row.chunks||0));
	        const missing = (row.missingSegments||[]).length ? '<div class="bad">缺第 '+esc((row.missingSegments||[]).map(n=>Number(n)+1).join(' / '))+' 段</div>' : '';
	        const segmentIds = (row.segmentIds||[]).length ? '<div class="muted">片段：'+esc((row.segmentIds||[]).join(' / '))+'</div>' : '';
	        const currentUser = (row.assignedUsers || [])[0] || '';
	        const metadataBlocked = privateVideoMetadataWriteBlocked();
	        const publishBlocked = metadataBlocked || privateVideoActionBlocked('upload-publish');
	        const archiveBlocked = metadataBlocked || privateVideoActionBlocked('archive-course');
	        const publishDisabled = publishBlocked ? ' disabled' : '';
	        const archiveDisabled = archiveBlocked ? ' disabled' : '';
	        const deleteBlocked = privateVideoActionBlocked('delete-course');
	        const deleteState = privateVideoActionState('delete-course') || 'limited';
	        const deleteDisabled = deleteBlocked ? ' disabled' : '';
	        const deleteText = deleteState === 'limited' ? '受限删除' : '删除';
	        const publishReason = privateVideoActionReason('upload-publish');
	        const archiveReason = privateVideoActionReason('archive-course');
	        const accessReason = privateVideoActionReason('change-access');
	        const deleteReason = privateVideoActionReason('delete-course');
	        const productionBlockerNote = privateVideoLimits && privateVideoLimits.productionBlocker
	          ? '<div class="bad" data-pv-production-blocker>'+esc(privateVideoLimits.productionBlocker)+' '+esc(privateVideoLimits.productionAcceptance || '生产恢复还必须使用真实教师账号完成浏览器验收。')+'</div>'
	          : '';
	        const blockNote = (metadataBlocked || publishBlocked || archiveBlocked)
	          ? '<div class="bad">发布、真正改给其他学生和下架会按当前 action readiness 锁定；重复保存当前授权仍可确认，不触发写入。'+(deleteBlocked?'删除当前不可用：'+esc(deleteReason)+'。':'删除动态上传课可先尝试撤销元数据入口；失败会明确提示，不会假装成功；没有 FM_PRIVATE_MEDIA 时只返回 cleanupPending / blocker，不宣称完整存储清理。')+(privateVideoLimits && privateVideoLimits.productionBlocker ? '<br>'+esc(privateVideoLimits.productionBlocker) : '')+' 内置示范课不可永久删除。</div>'
	          : '';
	        const limitedDeleteNote = !deleteBlocked && deleteState === 'limited'
	          ? '<div class="muted" data-pv-delete-limited>删除为受限可尝试：按钮会先执行 dry-run 预检，再要求输入完整课程 ID；接口会返回 typed confirmation、storage cleanup plan 和 FM_PRIVATE_MEDIA blocker，失败会明确提示。</div>'
	          : '';
	        const visibleReasons = '<div class="muted" data-pv-row-action-reasons>授权：'+esc(privateVideoStateLabel(privateVideoActionState('change-access') || 'limited'))+'；发布：'+esc(privateVideoStateLabel(privateVideoActionState('upload-publish') || 'limited'))+'；下架：'+esc(privateVideoStateLabel(privateVideoActionState('archive-course') || 'limited'))+'；删除：'+esc(privateVideoStateLabel(deleteState))+'。</div>';
	        const accessControl = '<div class="pvaccess"><label for="pv-access-'+esc(id)+'">授权学生账号</label><input id="pv-access-'+esc(id)+'" data-pv-access-input="'+esc(id)+'" list="privateVideoUserOptions" value="'+esc(currentUser)+'" placeholder="输入或选择学生账号" title="'+esc(accessReason)+'"><button class="secondary" data-pv-access-course="'+esc(id)+'" title="'+esc(accessReason)+'">保存授权</button></div>';
	        const actions = isStatic
	          ? '<span class="muted">内置静态课，不可永久删除；只能看日志</span>'
	          : '<div class="rowactions">'
	            + (row.status !== 'published' ? '<button data-pv-publish-course="'+esc(id)+'" title="'+esc(publishReason)+'"'+publishDisabled+'>发布</button>' : '')
	            + (row.status === 'published' ? '<button class="secondary" data-pv-archive-course="'+esc(id)+'" title="'+esc(archiveReason)+'"'+archiveDisabled+'>下架</button>' : '')
	            + '<button class="danger" data-pv-delete-course="'+esc(id)+'" title="删除预检：'+esc(privateVideoStateLabel(deleteState))+'；'+esc(deleteReason)+'" data-pv-disabled-reason="'+esc(deleteReason)+'"'+deleteDisabled+'>'+esc(deleteText)+'</button>'
	            + '</div>'+visibleReasons+productionBlockerNote+blockNote+limitedDeleteNote+accessControl;
	        return '<tr><td><b>'+esc(title)+'</b><div class="small muted">'+esc(id)+'<br>'+esc(row.description||'')+'</div>'+segmentIds+'</td><td class="small">'+esc(state)+'<br>'+segments+'<br>大小 '+bytes(row.size||0)+missing+'</td><td class="small">'+esc(users)+'<div class="muted">'+esc((row.entitlements||[]).join(' / '))+'</div></td><td class="small">'+esc(row.storage||'')+'<br>已上传 '+bytes(row.uploadedBytes||0)+'</td><td class="small">'+esc(bjOrRaw(row.updatedAt||row.createdAt||''))+'<br><span class="muted">'+esc(bjOrRaw(row.publishedAt||''))+'</span></td><td class="small">'+actions+'</td></tr>';
	      }).join('') || '<tr><td colspan="6">暂无私有视频</td></tr>';
	    }
	    function drawPrivateVideoProgressRows(){
	      const rows = filterMonitorRows(summary.privateVideoProgress || [], ['video','title','users','ips','devices','lastUser','lastStatus','lastPath'], row => Number(row.errors||0) + Number(row.denied||0)).slice(0, 80);
	      document.getElementById('privateVideoProgressRows').innerHTML = rows.map((row) => {
	        const userText = (row.users||[]).join(' / ') || '暂无账号';
	        const last = [bjOrRaw(row.lastSeen), row.lastUser, row.lastStatus].filter(Boolean).join(' · ');
	        const progress = '最高 '+pct(row.maxPercent||0)+'，看到 '+seconds(row.maxSeconds||0);
	        const events = '打开 '+esc(row.opens||0)+' / 开始 '+esc(row.starts||0)+' / 完成 '+esc(row.completes||0)+' / 异常 '+esc(row.errors||0)+' / 拒绝 '+esc(row.denied||0);
	        const detail = (row.userProgress||[]).slice(0,4).map(item => '<span class="chip'+(item.errors?' badchip':'')+'">'+esc(item.user)+' '+pct(item.maxPercent||0)+' · '+seconds(item.maxSeconds||0)+'</span>').join('');
		        return '<tr><td class="small"><b>'+esc(row.title||row.video||'')+'</b><div class="muted">'+esc(row.video||'')+'</div></td><td class="small">'+esc(userText)+'<div class="chips">'+(detail || '<span class="muted">暂无分账号进度</span>')+'</div></td><td class="small"><b>'+esc(progress)+'</b><br>心跳 '+esc(row.heartbeats||0)+' / 进度事件 '+esc(row.progressEvents||0)+'</td><td class="small'+((row.errors||row.denied)?' bad':'')+'">'+esc(events)+'</td><td class="small">'+esc(last||'')+'<br><span class="muted">'+esc(row.lastPath||'')+'</span><div class="muted">'+ipListHtml(row)+' '+esc((row.devices||[]).join(' / '))+'</div></td></tr>';
	      }).join('') || '<tr><td colspan="5">暂无私有视频观看记录</td></tr>';
	    }
	    function drawAccountRows(){
	      const rows = filterMonitorRows(summary.accountProfiles || [], ['user','identityKind','attemptedUsers','ips','locations','devices','deviceIds','browserSessionIds','riskReasons','lastPath'], riskValue).slice(0, 80);
      document.getElementById('accountRows').innerHTML = rows.map((row) => {
        const identity = row.identityKind || '未识别';
        const attempted = (row.attemptedUsers||[]).length ? '<div class="muted">尝试：'+esc((row.attemptedUsers||[]).join(' / '))+'</div>' : '';
	        const risk = row.riskScore ? ' bad' : ' good';
	        const reasons = (row.riskReasons||[]).length ? '<div class="bad">风险 '+esc(row.riskScore||0)+'：'+esc((row.riskReasons||[]).join(' / '))+'</div>' : '<div class="good">风险 0</div>';
	        const policy = row.devicePolicy ? row.devicePolicy.label : '未识别策略';
	        const binding = row.deviceBinding ? ('绑定 '+shortDeviceId(row.deviceBinding.deviceId)+' · '+(row.deviceBinding.label||'')) : '未绑定';
	        const access = row.access ? ('权限 '+row.access) : '';
	        const deviceIds = (row.deviceIds||[]).map(shortDeviceId).join(' / ');
	        const mismatch = row.deviceBinding && row.deviceBinding.mismatchCount ? ('<div class="bad">最近异设备 '+esc(row.deviceBinding.mismatchCount)+' 次；'+esc(row.deviceBinding.lastMismatchShortId||'')+' '+esc(row.deviceBinding.lastMismatchLabel||'')+'</div>') : '';
	        const timeline = bjOrRaw(row.lastSeen || row.lastLoginAt || row.createdAt || '');
	        const timelineSub = row.lastPath || bjOrRaw(row.lastLoginAt || row.createdAt || '');
		        return '<tr><td class="small"><b>'+esc(row.user||'')+'</b><div class="'+risk+'">'+esc(identity)+'</div>'+attempted+'</td><td class="small">'+ipListHtml(row)+'<div class="muted">'+esc((row.locations||[]).join(' / '))+'</div></td><td class="small">'+esc((row.devices||[]).join(' / ')||'')+'<div class="muted">'+esc((row.browserSessionIds||[]).slice(0,3).join(' / '))+'</div><div class="muted">'+esc(deviceIds||binding)+'</div>'+mismatch+'</td><td class="small">'+reasons+'<div class="muted">'+esc([policy, binding, access].filter(Boolean).join('；'))+'</div>登录 '+esc(row.loginSuccess||0)+' / 失败 '+esc(row.loginFailed||0)+'<br>锁定 '+esc(row.lockedRequests||0)+' / 拦截 '+esc(row.blockedRequests||0)+' / 后台拒绝 '+esc(row.adminDenied||0)+'<br>私有视频拒绝 '+esc(row.privateVideoDenied||0)+'</td><td class="small">答题 '+esc(row.answers||0)+'，'+pct(row.accuracy||0)+'<br>场次 '+esc(row.sessions||0)+'<br>视频开始 '+esc(row.privateVideoWatchStarts||0)+' / 完成 '+esc(row.privateVideoWatchCompletes||0)+' / 异常 '+esc(row.privateVideoWatchErrors||0)+'<br>最高 '+pct(row.privateVideoWatchMaxPercent||0)+'，看到 '+seconds(row.privateVideoWatchSeconds||0)+'</td><td class="small">'+esc(timeline)+'<br><span class="muted">'+esc(timelineSub)+'</span></td></tr>';
      }).join('') || '<tr><td colspan="6">暂无账号画像</td></tr>';
    }
    function drawSuspiciousRows(){
      const rows = filterMonitorRows(summary.suspiciousAccess || [], ['user','attemptedUsers','type','path','result','ip','country','region','city','device','deviceId','browserSessionId'], () => 1).slice(0, 100);
      document.getElementById('suspiciousRows').innerHTML = rows.map((row) => {
        const deviceShort = row.deviceId ? shortDeviceId(row.deviceId) : (row.deviceShortId || '');
        const deviceLine = [deviceShort, row.device].filter(Boolean).join(' · ');
        const boundShort = row.boundDeviceShortId || (row.boundDeviceId ? shortDeviceId(row.boundDeviceId) : '');
        const attemptedShort = row.attemptedDeviceId ? shortDeviceId(row.attemptedDeviceId) : (row.attemptedDeviceShortId || '');
        const compare = boundShort ? ('<div class="muted">绑定 '+esc(boundShort)+' · 尝试 '+esc(attemptedShort)+'</div>') : '';
	        return '<tr><td class="nowrap">'+esc(bjOrRaw(row.iso||''))+'</td><td class="small">'+esc(row.user||row.attemptedUsers||'未登录')+'</td><td class="small bad">'+esc(row.type||'')+'</td><td class="small">'+esc(row.path||'')+'<div class="muted">'+esc(row.result||'')+'</div><div class="muted">'+esc(row.policyType||'')+'</div></td><td class="small">'+esc(ipInline(row))+'<div class="muted">'+esc([row.country,row.region,row.city].filter(Boolean).join(' / '))+'</div><div class="muted">'+esc(ipDetail(row))+'</div></td><td class="small">'+esc(deviceLine||row.device||'')+'<div class="muted">'+esc(row.browserSessionId||'')+'</div>'+compare+'</td></tr>';
      }).join('') || '<tr><td colspan="6">暂无异常访问</td></tr>';
    }
    function drawIpProfileRows(){
      const rows = filterMonitorRows(summary.ipProfiles || [], ['ip','users','attemptedUsers','devices','deviceIds','locations','browserSessionIds','lastPath'], riskValue).slice(0, 80);
      document.getElementById('ipProfileRows').innerHTML = rows.map((row) => {
        const riskClass = row.riskScore > 0 ? ' bad' : ' good';
        const users = (row.users||[]).join(' / ') || '未登录';
        const attempted = (row.attemptedUsers||[]).length ? '<div class="muted">尝试：'+esc((row.attemptedUsers||[]).join(' / '))+'</div>' : '';
	        return '<tr><td class="small"><b>'+esc(row.ip||'未获取真实 IP')+'</b><div class="muted">'+esc(ipDetail(row))+'</div><div class="muted">'+esc((row.locations||[]).join(' / '))+'</div></td><td class="small">'+esc(users)+attempted+'</td><td class="small">'+esc((row.devices||[]).join(' / '))+'<div class="muted">'+esc((row.browserSessionIds||[]).slice(0,3).join(' / '))+'</div><div class="muted">'+esc((row.deviceIds||[]).map(shortDeviceId).join(' / '))+'</div></td><td class="small'+riskClass+'">风险 '+esc(row.riskScore||0)+'<br>登录失败 '+esc(row.loginFailed||0)+' / 锁定 '+esc(row.lockedRequests||0)+' / 拦截 '+esc(row.blockedRequests||0)+'<br>后台拒绝 '+esc(row.adminDenied||0)+' / 视频拒绝 '+esc(row.privateVideoDenied||0)+'</td><td class="small">事件 '+esc(row.eventCount||0)+'<br>页面 '+esc(row.pageViews||0)+' / 答题 '+esc(row.answers||0)+'<br>视频开始 '+esc(row.privateVideoWatchStarts||0)+'</td><td class="small">'+esc(bjOrRaw(row.lastSeen||''))+'<br><span class="muted">'+esc(row.lastPath||'')+'</span></td></tr>';
      }).join('') || '<tr><td colspan="6">暂无 IP 画像</td></tr>';
    }
    function drawDeviceProfileRows(){
      const rows = filterMonitorRows(summary.deviceProfiles || [], ['device','users','attemptedUsers','ips','deviceIds','locations','lastPath'], riskValue).slice(0, 80);
      document.getElementById('deviceProfileRows').innerHTML = rows.map((row) => {
        const riskClass = row.riskScore > 0 ? ' bad' : ' good';
        const users = (row.users||[]).join(' / ') || '未登录';
        const attempted = (row.attemptedUsers||[]).length ? '<div class="muted">尝试：'+esc((row.attemptedUsers||[]).join(' / '))+'</div>' : '';
	        return '<tr><td class="small"><b>'+esc(row.device||'')+'</b><div class="muted">'+esc((row.deviceIds||[]).map(shortDeviceId).join(' / '))+'</div></td><td class="small">'+esc(users)+attempted+'</td><td class="small">'+ipListHtml(row)+'<div class="muted">'+esc((row.locations||[]).join(' / '))+'</div></td><td class="small'+riskClass+'">风险 '+esc(row.riskScore||0)+'<br>事件 '+esc(row.eventCount||0)+' / 异常 '+esc(row.suspiciousEvents||0)+'<br>登录失败 '+esc(row.loginFailed||0)+' / 锁定 '+esc(row.lockedRequests||0)+' / 拦截 '+esc(row.blockedRequests||0)+'</td><td class="small">'+esc(bjOrRaw(row.lastSeen||''))+'<br><span class="muted">'+esc(row.lastPath||'')+'</span></td></tr>';
      }).join('') || '<tr><td colspan="5">暂无设备画像</td></tr>';
    }
    function drawLearningRows(){
			      const rows = filterMonitorRows(summary.learningProgress || [], ['user','identityKind','knowledgeStats','lastPath'], row => Number(row.privateVideoWatchErrors||0) + (Number(row.answers||0) >= 3 && Number(row.accuracy||100) < 60 ? 1 : 0)).slice(0, 80);
			      document.getElementById('learningRows').innerHTML = rows.map((row) => {
			        const persisted = row.progressCumulativePersisted === true && row.progressNoMutationRead === true && row.progressCumulativeSourceOfTruth === 'server-progress-snapshot' && /^(server-d1-learning-progress|server-r2-learning-progress|server-kv-learning-progress)$/.test(String(row.progressSource||''));
			        const strictProgress = row.progressStrictCumulativeServer === true;
		        const durabilityStatus = row.progressWriteDurabilityStatus || '';
		        const boundaryLabel = strictProgress ? 'D1/R2 严格累计服务器' : (persisted ? 'Cloudflare KV 服务器累计；非 D1/R2 strict' : 'audit-event-window 非累计');
		        const boundaryDetail = row.progressCumulativeBoundaryMessage || (persisted ? '服务器 KV 快照可以作为累计时长/答题数来源，登录、刷新和代码部署不能从本机重算；缺 FM_PROGRESS_DB / FM_PROGRESS_R2 时仍不能写成 D1/R2 strict 主存储。' : '最近事件窗不能作为累计。');
		        const durabilityLine = strictProgress ? '严格门禁通过' : ('strictCumulativeServer=false；'+esc(durabilityStatus || 'missing-primary-d1-r2'));
		        const windowHint = [row.eventWindowAnswers ? ('最近窗口 '+row.eventWindowAnswers+' 题') : '', row.eventWindowSessions ? (row.eventWindowSessions+' 场') : '', row.eventWindowStudyTimeSeconds ? seconds(row.eventWindowStudyTimeSeconds) : ''].filter(Boolean).join(' / ');
		        const cumulative = persisted
		          ? '<b>'+esc(row.answers||0)+' 题，'+pct(row.accuracy||0)+'</b><br>对 '+esc(row.correct||0)+' / 错 '+esc(row.incorrect||0)+' / 场次 '+esc(row.sessions||0)+'<br>均时 '+seconds(row.averageQuestionTimeSeconds||0)
		          : '<b>累计未持久化</b><br><span class="muted">'+esc(windowHint || '最近事件窗不能作为累计')+'</span>';
		        const knowledge = persisted ? knowledgeCells(row.knowledgeStats) : (windowHint ? '<span class="muted">'+esc(windowHint)+'</span>' : '<span class="muted">等待服务端进度快照</span>');
		        return '<tr><td class="small"><b>'+esc(row.user||'')+'</b><div class="muted">'+esc(row.identityKind||'')+'</div><div class="muted">来源 '+esc(row.progressSource||'audit-event-window')+'</div><div class="muted" title="'+esc(boundaryDetail)+'">'+esc(boundaryLabel)+'</div><div class="muted">'+durabilityLine+'</div></td><td class="small">'+cumulative+'</td><td class="small"><div class="chips">'+knowledge+'</div></td><td class="small">开始 '+esc(row.privateVideoWatchStarts||0)+' / 完成 '+esc(row.privateVideoWatchCompletes||0)+' / 异常 '+esc(row.privateVideoWatchErrors||0)+'<br>最高进度 '+pct(row.privateVideoWatchMaxPercent||0)+'<br>看到 '+seconds(row.privateVideoWatchSeconds||0)+'</td><td class="small">页面 '+esc(row.pageViews||0)+'<br>资源 '+esc(row.resourceRequests||0)+'</td><td class="small">'+esc(bjOrRaw(row.lastSeen||''))+'<br><span class="muted">'+esc(row.lastPath||'')+'</span></td></tr>';
		      }).join('') || '<tr><td colspan="6">暂无学习进度</td></tr>';
		    }
    function drawPrivateVideoEventRows(){
      const rows = filterMonitorRows(summary.recentPrivateVideoEvents || [], ['user','ip','device','video','title','type','status','message','range','store'], row => /denied|error|failed/i.test(row.type||row.status||row.message||'')).slice(0, 100);
      document.getElementById('privateVideoEventRows').innerHTML = rows.map((row) => {
        const progress = row.percent ? ('进度 '+pct(row.percent)) : '';
        const watchTime = row.currentTimeSeconds ? ('看到 '+seconds(row.currentTimeSeconds)+' / '+seconds(row.durationSeconds||0)) : '';
	        return '<tr><td class="nowrap">'+esc(bjOrRaw(row.iso||''))+'</td><td class="small">'+esc([row.user,ipInline(row),row.device].filter(Boolean).join(' · '))+'<div class="muted">'+esc(ipDetail(row))+'</div></td><td class="small">'+esc(row.video||'')+'<div class="muted">'+esc(row.title||'')+'</div></td><td class="small">'+esc(row.type||'')+'</td><td class="small">'+esc([row.status,row.message,progress,watchTime].filter(Boolean).join('；'))+'<div class="muted">'+esc(row.range||'')+'</div></td><td class="small">'+esc([row.store,row.bytes ? bytes(row.bytes) : ''].filter(Boolean).join(' · '))+'</td></tr>';
      }).join('') || '<tr><td colspan="6">暂无私有视频行为</td></tr>';
    }
    function drawTimelineRows(){
      const rows = filterMonitorRows(summary.recentUserEvents || [], ['user','type','path','result','ip','country','device','deviceId','browserSessionId'], riskValue).slice(0, 120);
      document.getElementById('timelineRows').innerHTML = rows.map((row) => {
        const boundShort = row.boundDeviceShortId || (row.boundDeviceId ? shortDeviceId(row.boundDeviceId) : '');
        const attemptedShort = row.attemptedDeviceId ? shortDeviceId(row.attemptedDeviceId) : (row.attemptedDeviceShortId || '');
        const compare = boundShort ? ('<div class="muted">绑定 '+esc(boundShort)+' / 尝试 '+esc(attemptedShort)+'</div>') : '';
        const deviceShort = row.deviceId ? shortDeviceId(row.deviceId) : (row.deviceShortId || '');
	        return '<tr><td class="nowrap">'+esc(bjOrRaw(row.iso||''))+'</td><td class="small">'+esc(row.user||'')+'</td><td class="small">'+esc(row.type||'')+'</td><td class="small">'+esc(row.path||'')+'<div class="muted">'+esc(row.result||'')+'</div></td><td class="small">'+esc([ipInline(row),row.country,row.device].filter(Boolean).join(' · '))+'<div class="muted">'+esc([deviceShort, ipDetail(row)].filter(Boolean).join('；'))+'</div>'+compare+'</td><td class="small">'+esc(row.browserSessionId||'')+'</td></tr>';
      }).join('') || '<tr><td colspan="6">暂无行为记录</td></tr>';
    }
    function applyFilter(){
      const q = document.getElementById('search').value.trim().toLowerCase();
      const t = document.getElementById('typeFilter').value;
      filtered = latest.filter(e => {
	        const text = [e.type,e.path,e.user,e.ip,e.ipSource,e.forwardedIp,e.country,deviceText(e),JSON.stringify(e.data||{})].join(' ').toLowerCase();
        return (!t || e.type === t) && (!q || text.includes(q));
      });
      drawRows();
    }
	    function drawRows(){
	      if(!latest.length && !rawLoaded){
	        document.getElementById('rows').innerHTML = '<tr><td colspan="6">快速摘要已加载；需要逐条排查时再点“加载原始日志”。</td></tr>';
	        return;
	      }
		      document.getElementById('rows').innerHTML = filtered.map(e => '<tr><td>'+esc(bjOrRaw(e.iso))+'</td><td>'+esc(e.type)+'</td><td>'+esc(e.path)+'</td><td>'+esc(e.user||'')+'<div class="small muted">'+esc(deviceText(e))+'</div></td><td>'+esc(ipInline(e)+' '+(e.country||''))+'<div class="small muted">'+esc([(e.region||'')+' '+(e.city||''), ipDetail(e)].filter(Boolean).join('；'))+'</div></td><td><code>'+esc(JSON.stringify(e.data||{}).slice(0,360))+'</code></td></tr>').join('') || '<tr><td colspan="6">暂无记录</td></tr>';
	    }
	    function redrawMonitorTables(){
	      drawRiskOverview();
	      drawAccountRows();
	      drawSuspiciousRows();
	      drawIpProfileRows();
	      drawDeviceProfileRows();
	      drawLearningRows();
	      drawUserRows();
	      drawSessionRows();
	      drawAnswerRows();
	      drawRegisterRows();
	      drawPrivateVideoProgressRows();
	      drawPrivateVideoEventRows();
	      drawTimelineRows();
	    }
		    function draw(){
      document.getElementById('total').textContent = summary.totalEvents || latest.length;
      document.getElementById('logins').textContent = coreCount('loginSuccess') || summaryCount('login_success');
      document.getElementById('views').textContent = coreCount('pageViews') || (summaryCount('page_view') + summaryCount('edge_page_request') + summaryCount('edge_fast_home'));
      document.getElementById('blocked').textContent = coreCount('blocked') || (summaryCount('blocked_request') + summaryCount('login_failed'));
      document.getElementById('suspiciousTotal').textContent = summary.suspiciousStats ? summary.suspiciousStats.total : (count('blocked_request') + count('locked_request') + count('login_failed') + count('admin_denied'));
	      const answerStats = summary.answerStats && summary.answerStats.noMutationRead === true && summary.answerStats.cumulativeSourceOfTruth === 'server-progress-snapshot'
	        ? summary.answerStats
	        : { answered:0, accuracy:0 };
	      document.getElementById('answers').textContent = answerStats.answered;
	      document.getElementById('accuracy').textContent = pct(answerStats.accuracy);
      const progressStore = summary.learningProgressStore || {};
      const progressStoreMode = progressStore.fullProductionReady
        ? (progressStore.storeMode || 'D1/R2')
        : (progressStore.degradedKvFallback ? 'KV no-drift；非 D1/R2 strict' : (progressStore.storeMode || '未绑定'));
      const progressStoreEl = document.getElementById('progressStoreMode');
      if (progressStoreEl) {
        progressStoreEl.textContent = progressStoreMode;
        progressStoreEl.title = progressStore.boundary || progressStore.serverUpgradeInvariant || '学习进度累计必须来自服务端快照。';
        progressStoreEl.dataset.serverSnapshotStorageReady = progressStore.serverSnapshotStorageReady === true ? '1' : '0';
        progressStoreEl.dataset.serverSnapshotReady = progressStore.serverSnapshotReady === true ? '1' : '0';
        progressStoreEl.dataset.strictPrimaryStoreReady = progressStore.strictPrimaryStoreReady === true ? '1' : '0';
        progressStoreEl.dataset.progressStoreMode = progressStore.storeMode || '';
      }
      document.getElementById('uniqueIps').textContent = summary.uniqueIps || 0;
      document.getElementById('uniqueDevices').textContent = summary.uniqueDevices || 0;
      document.getElementById('codeRequests').textContent = summary.registrationStats ? summary.registrationStats.codeRequests : count('register_code_request');
      document.getElementById('codeSent').textContent = summary.registrationStats ? summary.registrationStats.codeSent : count('register_code_sent');
      document.getElementById('registerSuccess').textContent = summary.registrationStats ? summary.registrationStats.registerSuccess : (coreCount('registerSuccess') || summaryCount('register_success'));
      document.getElementById('registerFailed').textContent = summary.registrationStats ? summary.registrationStats.registerFailed : (coreCount('registerFailed') || summaryCount('register_rejected') + summaryCount('register_code_rejected') + summaryCount('register_email_failed'));
      document.getElementById('privateStreams').textContent = summary.privateVideoStats ? summary.privateVideoStats.streams : (coreCount('privateVideoStreams') || count('private_video_stream'));
      document.getElementById('privateWatchStarts').textContent = summary.privateVideoStats ? summary.privateVideoStats.watchStarts : (coreCount('privateVideoWatchStarts') || summaryCount('private_video_watch_start'));
      document.getElementById('privateWatchCompletes').textContent = summary.privateVideoStats ? summary.privateVideoStats.watchCompletes : (coreCount('privateVideoWatchCompletes') || summaryCount('private_video_watch_complete'));
      document.getElementById('privateWatchErrors').textContent = summary.privateVideoStats ? summary.privateVideoStats.watchErrors : (coreCount('privateVideoWatchErrors') || summaryCount('private_video_watch_error'));
      document.getElementById('videoUploads').textContent = summary.privateVideoStats ? (summary.privateVideoStats.uploadInits + summary.privateVideoStats.uploadChunks + summary.privateVideoStats.uploadPublishes) : 0;
      document.getElementById('uploadBytes').textContent = summary.privateVideoStats ? bytes(summary.privateVideoStats.uploadBytes || 0) : '0 B';
      drawChips('users', (summary.topUsers || []).length ? (summary.topUsers || []).map(item => [item.name, item.count]) : topBy(e => e.user || e.ip || 'anonymous'));
      drawChips('paths', (summary.topPaths || []).map(item => [item.name, item.count]));
      drawChips('eventTypes', (summary.topEventTypes || []).map(item => [item.name, item.count]));
	      drawChips('devices', ((summary.topDeviceIds && summary.topDeviceIds.length ? summary.topDeviceIds.map(item => [item.shortId || item.name, item.count]) : (summary.topDevices || []).map(item => [item.name, item.count]))));
	      drawAccuracyChips('knowledgeChips', summary.topKnowledge || []);
	      renderServerHealth();
	      drawBindingPanel();
      drawPasswordResetPanel();
	      redrawMonitorTables();
	      drawPrivateVideoRows();
      const typeSelect = document.getElementById('typeFilter');
      const current = typeSelect.value;
      const types = Array.from(new Set(latest.map(e => e.type))).sort();
      typeSelect.innerHTML = '<option value="">全部类型</option>' + types.map(type => '<option value="'+esc(type)+'">'+esc(type)+'</option>').join('');
      typeSelect.value = current;
      applyFilter();
    }
	    async function loadPrivateVideos(){
      try{
	        const res = await fetch('/api/admin/private-videos?includeArchived=1&refresh=1&writeProbe=1', { cache:'no-store', credentials:'same-origin' });
	        const data = await readJsonOrThrow(res);
	        privateVideoLimits = data.limits || null;
	        renderPrivateVideoLimits();
	        privateVideos = (data.staticVideos || []).concat(data.videos || []);
	        privateCourses = (data.staticCourses || []).concat(data.courses || []);
	        drawPrivateVideoRows();
	      }catch(error){
	        renderPrivateVideoLimits();
	        document.getElementById('privateVideoRows').innerHTML = '<tr><td colspan="6">私有视频列表加载失败：'+esc(error && error.message ? error.message : error)+'</td></tr>';
	      }
    }
    function privateCourseById(courseId){
      return (privateCourses || []).find(row => String(row.courseId || row.id || '') === String(courseId || '')) || null;
    }
    function privateVideoAssignableUsers(){
      const out = new Set();
      const add = user => { const value = String(user || '').trim(); if(value)out.add(value); };
      (summary.accountProfiles || []).forEach(row => {
        if(row && !(row.devicePolicy && row.devicePolicy.exempt))add(row.user);
      });
      (summary.users || []).forEach(row => {
        if(row && !(row.devicePolicy && row.devicePolicy.exempt))add(row.user);
      });
      (privateCourses || []).forEach(row => (row.assignedUsers || []).forEach(add));
      return Array.from(out).sort((a,b)=>a.localeCompare(b));
    }
    function privateVideoActionReadiness(actionId){
      const actions = privateVideoLimits && Array.isArray(privateVideoLimits.actionReadiness) ? privateVideoLimits.actionReadiness : [];
      return actions.find(item => item && item.id === actionId) || null;
    }
    function privateVideoActionBlocked(actionId){
      const action = privateVideoActionReadiness(actionId);
      return !!(action && action.state === 'blocked');
    }
	    function privateVideoActionBlockedMessage(actionId){
	      const action = privateVideoActionReadiness(actionId);
	      return action && action.detail ? action.detail : '这项专属课操作当前不可用，请刷新状态后再试。';
	    }
	    async function loadServerHealth(){
	      try{
	        const res = await fetch('/_edge-server-health', { cache:'no-store', credentials:'same-origin', headers:{ Accept:'application/json' } });
	        const data = await readJsonOrThrow(res);
	        serverHealth = data || null;
	      }catch(error){
	        serverHealth = {
	          edgeHomeVersion:'读取失败',
	          learningProgress:{ storeMode:'unknown', boundary:error && error.message ? error.message : String(error || '') },
	          privateVideo:{ storageReady:false, boundary:'服务器健康状态读取失败。' },
	          publicEntry:{ lastKnownBlocker:'服务器健康状态读取失败。' },
	          claims:{ readNoDriftReady:false, strictProgressWritesReady:false, localStorageExcludedFromCumulative:true, auditEventWindowExcludedFromCumulative:true, privateVideoStorageReady:false, httpEntryReady:false },
	          blockers:[{ id:'server-health-fetch-failed', reason:error && error.message ? error.message : String(error || '') }]
	        };
	      }
	      renderServerHealth();
	    }
	    function privateVideoActionState(actionId){
	      const action = privateVideoActionReadiness(actionId);
	      return action && action.state ? String(action.state) : '';
	    }
	    function privateVideoActionReason(actionId){
	      const action = privateVideoActionReadiness(actionId);
	      if(action && action.detail)return action.detail;
	      if(actionId === 'change-access')return '授权未变化可重复保存；真正改给其他学生需要元数据写入可用。';
	      if(actionId === 'delete-dry-run')return '删除预检只读取课程状态、typed confirmation 字段和清理计划，不删除数据。';
	      if(actionId === 'delete-course')return '删除前会先 dry-run 预检，再要求输入完整课程 ID；没有 FM_PRIVATE_MEDIA 时只证明学生端入口撤销，不宣称完整存储清理。';
	      return privateVideoMetadataWriteBlockedMessage();
	    }
	    function privateVideoStateLabel(state){
	      if(state === 'ready') return '可用';
	      if(state === 'blocked') return '不可用';
	      if(state === 'limited') return '受限可尝试';
	      return '待探测';
	    }
	    function renderPrivateVideoLimits(){
	      const snapshot = document.getElementById('privateVideoStorageSnapshot');
	      const readiness = document.getElementById('privateVideoActionReadiness');
	      const info = privateVideoLimits && typeof privateVideoLimits === 'object' ? privateVideoLimits : {};
	      const health = info.metadataWriteHealth && typeof info.metadataWriteHealth === 'object' ? info.metadataWriteHealth : {};
	      const state = health.state || (info.r2Available ? 'ready' : 'limited');
	      const r2 = info.r2Available ? 'FM_PRIVATE_MEDIA 可用' : 'FM_PRIVATE_MEDIA 未绑定';
	      const store = health.metadataStore || info.metadataStore || 'FM_AUDIT';
	      const reason = health.message || info.writeCaution || '还没有拿到写入健康探测结果。';
	      if(snapshot){
	        const blocker = info.productionBlocker ? ' '+info.productionBlocker : '';
	        const acceptance = info.productionAcceptance ? ' '+info.productionAcceptance : '';
	        snapshot.textContent = '私有视频存储：元数据写入 '+privateVideoStateLabel(state)+'；元数据位置 '+store+'；R2 fallback '+r2+'。'+reason+blocker+acceptance+' 删除走 metadata-first：可先撤销学生端入口；没有 FM_PRIVATE_MEDIA 时只返回 cleanupPending / blocker，不能写成完整存储清理。 如显示未绑定，请运行 node tools/check-cloudflare-pages-private-video-bindings.mjs --json 核对 Cloudflare Pages 生产绑定。';
	        snapshot.className = 'statusline ' + (state === 'blocked' ? 'bad' : (state === 'limited' ? 'warn' : 'good'));
	      }
	      if(readiness){
	        const actions = Array.isArray(info.actionReadiness) ? info.actionReadiness : [];
	        readiness.innerHTML = actions.map(action => {
	          const actionState = String(action && action.state || 'limited');
	          const cls = actionState === 'ready' ? 'goodchip' : (actionState === 'blocked' ? 'badchip' : '');
	          return '<span class="chip '+cls+'" title="'+esc(action && action.detail || '')+'">'+esc(action && action.label || action && action.id || '私有视频操作')+'：'+esc(privateVideoStateLabel(actionState))+'</span>';
	        }).join('') || '<span class="muted">专属课操作状态待刷新</span>';
	      }
	      syncPrivateVideoUploadButtonState();
	    }
	    function privateVideoMetadataWriteBlocked(){
	      return !!(privateVideoLimits && privateVideoLimits.metadataWriteHealth && privateVideoLimits.metadataWriteHealth.state === 'blocked');
	    }
	    function privateVideoMetadataWriteBlockedMessage(){
	      return privateVideoLimits && privateVideoLimits.metadataWriteHealth && privateVideoLimits.metadataWriteHealth.message
	        ? privateVideoLimits.metadataWriteHealth.message
	        : '课程元数据写入当前不可用；请稍后再试。';
	    }
	    function syncPrivateVideoUploadButtonState(){
	      const button = document.getElementById('uploadPrivateVideo');
	      if(!button)return;
	      const blocked = privateVideoMetadataWriteBlocked() || privateVideoActionBlocked('upload-publish');
	      button.disabled = blocked;
	      button.title = blocked ? privateVideoActionReason('upload-publish') : '';
	      button.setAttribute('aria-disabled', blocked ? 'true' : 'false');
	    }
	    function privateVideoControlElements(courseId){
      const id = String(courseId || '');
      return Array.from(document.querySelectorAll('[data-pv-publish-course],[data-pv-access-course],[data-pv-archive-course],[data-pv-delete-course],[data-pv-access-input]')).filter(el => (
        el.getAttribute('data-pv-publish-course') === id
        || el.getAttribute('data-pv-access-course') === id
        || el.getAttribute('data-pv-archive-course') === id
        || el.getAttribute('data-pv-delete-course') === id
        || el.getAttribute('data-pv-access-input') === id
      ));
    }
    function setPrivateVideoCourseBusy(courseId, busy){
      privateVideoControlElements(courseId).forEach(el => { el.disabled = !!busy; });
    }
    function privateVideoAccessPayload(courseId, required){
      const input = privateVideoControlElements(courseId).find(el => el.getAttribute('data-pv-access-input') === String(courseId || ''));
      const assignedUsers = input ? String(input.value || '').trim() : '';
      if(required && !assignedUsers){
        document.getElementById('privateVideoActionStatus').textContent = '授权账号不能为空。';
        return null;
      }
      return assignedUsers ? { assignedUsers } : {};
    }
    function privateVideoAccessChangeRequiresWrite(courseId, payload){
      const row = privateCourseById(courseId);
      const before = row && (row.assignedUsers || [])[0] ? String((row.assignedUsers || [])[0]).trim().toLowerCase() : '';
      const after = payload && payload.assignedUsers ? String(payload.assignedUsers).trim().toLowerCase() : '';
      return !!after && after !== before;
    }
    function privateVideoActionMessage(action, data){
      if(action === 'delete'){
        const outcome = data && data.deleteOutcome && typeof data.deleteOutcome === 'object' ? data.deleteOutcome : null;
        if(outcome && outcome.metadataRevoked){
          if(outcome.cleanupPending){
            const reason = outcome.fmPrivateMediaMissing
              ? 'cleanupPending=true：FM_PRIVATE_MEDIA 未绑定，R2 对象清理未验证，不能宣称完整存储删除。'
              : 'cleanupPending=true：后台存储清理仍有警告，已记录到教师监控。';
            return '专属课元数据已撤销，学生端入口已失效；'+reason;
          }
          return '专属课元数据已撤销，学生端入口已失效；cleanupPending=false，存储清理完成。';
        }
        if(outcome && !outcome.metadataRevoked){
          return '专属课元数据未撤销；没有删除学生端入口，也没有清理存储。请按提示修复后重试。';
        }
        if(data && data.storageCleanup && data.storageCleanup.blocker){
          return '专属课已撤销学生端入口；'+data.storageCleanup.blocker+' 后端已返回 cleanupPending，不能宣称完整存储删除。';
        }
        if(data && (data.warning || data.cleanupPending)){
          const errors = data.storage && Array.isArray(data.storage.errors) ? data.storage.errors.slice(0,3).join('；') : '';
          return '专属课已从课程表删除，学生端播放入口已失效；后台仍有存储清理警告'+(errors?'：'+errors:'。');
        }
        return '专属课已删除，学生端播放入口已失效。';
      }
      if(action === 'archive') return '专属课已下架，学生端不可见；可重新发布或删除。';
      if(action === 'access') return '授权已保存，旧学生端入口已失效。';
      if(action === 'publish') return '专属课已发布。';
      return '专属课操作已完成。';
    }
    async function submitPrivateVideoAction(courseId, action, options){
      const status = document.getElementById('privateVideoActionStatus');
      if(action === 'delete' && privateVideoActionBlocked('delete-course')){
        status.textContent = privateVideoActionBlockedMessage('delete-course');
        return null;
      }
      const requiresWrite = action !== 'access' || privateVideoAccessChangeRequiresWrite(courseId, options || {});
      if(action === 'publish' && privateVideoActionBlocked('upload-publish')){
        status.textContent = privateVideoActionBlockedMessage('upload-publish');
        return null;
      }
      if(action === 'archive' && privateVideoActionBlocked('archive-course')){
        status.textContent = privateVideoActionBlockedMessage('archive-course');
        return null;
      }
      if(action === 'access' && requiresWrite && privateVideoActionBlocked('change-access')){
        status.textContent = privateVideoActionBlockedMessage('change-access') + ' 当前只能重复保存原授权；真正改给其他学生需要恢复 FM_PRIVATE_MEDIA R2 和真实教师账号 QA。';
        return null;
      }
      if(action !== 'delete' && privateVideoMetadataWriteBlocked() && requiresWrite){
        status.textContent = privateVideoMetadataWriteBlockedMessage() + (action === 'access' ? ' 当前只能重复保存原授权；真正改给其他学生需要恢复元数据写入。' : '');
        return null;
      }
      const endpoint = '/api/admin/private-videos/course/'+encodeURIComponent(courseId)+'/'+action;
      status.textContent = '正在处理专属课 '+courseId+' ...';
      setPrivateVideoCourseBusy(courseId, true);
      try{
        const res = await fetch(endpoint, {
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(options || {})
        });
        const data = await readJsonOrThrow(res);
        status.textContent = data.message || privateVideoActionMessage(action, data);
        await loadPrivateVideos();
        await load();
        return data;
      }finally{
        setPrivateVideoCourseBusy(courseId, false);
      }
    }
    async function updatePrivateVideoCourseAccess(courseId){
      const payload = privateVideoAccessPayload(courseId, true);
      if(!payload)return;
      await submitPrivateVideoAction(courseId, 'access', payload);
    }
	    async function deletePrivateVideoCourse(courseId){
	      const row = privateCourseById(courseId);
	      const title = row ? (row.courseTitle || row.title || courseId) : courseId;
	      const users = row && (row.assignedUsers || []).length ? row.assignedUsers.join(' / ') : '未列出';
	      const state = row && row.status ? row.status : '未知';
	      const segments = row && row.segmentCount ? ((row.uploadedSegments||0)+' / '+row.segmentCount) : ((row && row.uploadedChunks||0)+' / '+(row && row.chunks||0));
	      const status = document.getElementById('privateVideoActionStatus');
	      status.textContent = '正在做删除预检，不会删除数据...';
	      let preflight = null;
	      try{
	        const checkRes = await fetch('/api/admin/private-videos/course/'+encodeURIComponent(courseId)+'/delete?dryRun=1&writeProbe=1', {
	          method:'GET',
	          credentials:'same-origin',
	          headers:{Accept:'application/json','Cache-Control':'no-cache'}
	        });
	        preflight = await readJsonOrThrow(checkRes);
	        if(!preflight.canDelete)throw new Error(preflight.message || preflight.error || 'delete_preflight_blocked');
	      }catch(error){
	        status.textContent = '删除预检未通过：' + (error && error.message ? error.message : error);
	        return;
	      }
	      const summary = preflight && preflight.course ? preflight.course : (row || {});
	      const missingChunks = Number(summary.missingChunks || row && row.missingChunks || 0) || 0;
	      const storage = summary.storage || row && row.storage || '未知';
	      const preflightState = preflight.deleteReadiness && preflight.deleteReadiness.state || 'ready';
	      const cleanupPlan = preflight.storageCleanupPlan || {};
	      const cleanupLine = cleanupPlan.blocker
	        ? ('\\n存储边界：'+cleanupPlan.blocker)
	        : '\\n存储边界：FM_PRIVATE_MEDIA 已可用，后端会尝试元数据、KV/R2 分片和索引清理。';
	      if(!confirm('永久删除专属课“'+title+'”？\\n课程 ID：'+courseId+'\\n状态：'+(summary.status || state)+'\\n分段：'+segments+'\\n授权：'+users+'\\n缺片：'+missingChunks+'\\n存储：'+storage+'\\n预检：'+privateVideoStateLabel(preflightState)+cleanupLine+'\\n下一步还需要输入课程 ID。删除会先撤销学生端播放权限，再清理后台分片和索引；没有 FM_PRIVATE_MEDIA 时不会宣称完整存储删除；此操作不可恢复。'))return;
	      const confirmedCourseId = String(prompt('永久删除专属课“'+title+'”前，请输入课程 ID 确认：\\n'+courseId+'\\n\\n只有完全一致才会继续删除。') || '').trim();
	      if(confirmedCourseId !== String(courseId || '').trim()){
	        status.textContent = '课程 ID 核对未通过，已取消删除，课程仍可播放。';
	        return;
	      }
	      await submitPrivateVideoAction(courseId, 'delete', {confirmCourseId:confirmedCourseId});
	    }
    async function readJsonOrThrow(res){
      let data = {};
      let raw = '';
      try{ raw = await res.text(); data = raw ? JSON.parse(raw) : {}; }catch(_){}
      const htmlHint = !data.ok && raw && /<!doctype html>|<html/i.test(raw) ? '登录状态可能已过期，请重新进入教师监控。' : '';
      if(!res.ok || !data.ok){
        throw new Error((data && (data.message || data.error)) || htmlHint || ('HTTP '+res.status));
      }
      return data;
    }
    function wait(ms){return new Promise(resolve => setTimeout(resolve, ms))}
    async function uploadChunkWithRetry(url, body, index, chunks, status){
      let lastError = null;
      for(let attempt=1; attempt<=3; attempt+=1){
        try{
          status.textContent='上传分片 '+(index+1)+' / '+chunks+'，第 '+attempt+' 次尝试...';
          const res = await fetch(url, {
            method:'PUT',
            credentials:'same-origin',
            headers:{'Content-Type':'application/octet-stream'},
            body:body
          });
          await readJsonOrThrow(res);
          return;
        }catch(error){
          lastError = error;
          if(attempt<3){
            status.textContent='分片 '+(index+1)+' 上传失败，正在重试 '+(attempt+1)+' / 3：'+(error && error.message ? error.message : error);
            await wait(650 * attempt);
          }
        }
      }
      throw new Error('分片 '+(index+1)+' / '+chunks+' 上传失败：'+(lastError && lastError.message ? lastError.message : lastError));
    }
    async function uploadPrivateVideo(){
      const file = document.getElementById('privateVideoFile').files[0];
      const titleInput = document.getElementById('privateVideoTitle');
      const usersInput = document.getElementById('privateVideoUsers');
      const descInput = document.getElementById('privateVideoDesc');
      const status = document.getElementById('privateVideoUploadStatus');
      const bar = document.getElementById('privateVideoUploadBar');
      if(privateVideoActionBlocked('upload-publish')){
        status.textContent = privateVideoActionBlockedMessage('upload-publish');
        return;
      }
      if(privateVideoMetadataWriteBlocked()){
        status.textContent = privateVideoMetadataWriteBlockedMessage() + ' 当前不能创建新上传任务；可先删除卡住的教师上传草稿，或恢复 FM_PRIVATE_MEDIA R2 后再上传。';
        return;
      }
      if(!file){status.textContent='请先选择视频文件。';return;}
      const title = titleInput.value.trim() || file.name.replace(/\.[^.]+$/,'');
      const assignedUsers = usersInput.value.trim();
	      if(!assignedUsers){status.textContent='请填写 1 个授权学生账号。';return;}
	      if(/[\\s,，;；、\\n\\r\\t]/.test(assignedUsers)){status.textContent='一对一专属视频一次只能填 1 个学生账号；多段课程请到 teacher-panel.html 上传。';return;}
      bar.style.width='0%';
      status.textContent='正在创建上传任务...';
      const initRes = await fetch('/api/admin/private-videos', {
        method:'POST',
        credentials:'same-origin',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          title:title,
          description:descInput.value.trim(),
          fileName:file.name,
          contentType:file.type || 'video/mp4',
          size:file.size,
          chunkSize:2097152,
          assignedUsers:assignedUsers
        })
      });
      const init = await readJsonOrThrow(initRes);
      const video = init.video;
      const chunkSize = (init.limits && init.limits.chunkSize) || 2097152;
      const chunks = (init.limits && init.limits.chunks) || Math.ceil(file.size / chunkSize);
      for(let index=0; index<chunks; index+=1){
        const start = index * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        await uploadChunkWithRetry('/api/admin/private-videos/'+encodeURIComponent(video.id)+'/chunks/'+index, file.slice(start, end), index, chunks, status);
        const progress = Math.round(((index + 1) / chunks) * 100);
        bar.style.width=progress+'%';
        status.textContent='上传分片 '+(index+1)+' / '+chunks+'，'+progress+'%';
      }
      status.textContent='分片上传完成，正在发布权限...';
      const publishCourseId = video.courseId || video.id;
      const publishRes = await fetch('/api/admin/private-videos/course/'+encodeURIComponent(publishCourseId)+'/publish', {
        method:'POST',
        credentials:'same-origin',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ assignedUsers:assignedUsers })
      });
      await readJsonOrThrow(publishRes);
      bar.style.width='100%';
      status.textContent='上传成功，已发布给：'+assignedUsers;
      document.getElementById('privateVideoFile').value='';
      titleInput.value='';
      descInput.value='';
      await loadPrivateVideos();
      await load();
    }
    async function load(){
      const rawState = document.getElementById('rawState');
      try{
        const res = await fetch('/api/admin/events?limit=240&view=summary', { cache: 'no-store', credentials:'same-origin' });
        const data = await readJsonOrThrow(res);
        summary = data.summary || {};
        if (!rawLoaded) latest = [];
	        rawState.textContent = rawLoaded ? '原始日志已加载' : '快速摘要模式';
	        draw();
	        loadServerHealth();
	      }catch(error){
        const message = error && error.message ? error.message : String(error || '未知错误');
        rawState.textContent = '快速摘要加载失败：' + message;
        const row = '<tr><td colspan="6">快速摘要加载失败：'+esc(message)+'</td></tr>';
        [['accountRows',6],['suspiciousRows',6],['ipProfileRows',6],['deviceProfileRows',5],['learningRows',6],['sessionRows',6],['answerRows',6],['registerRows',6],['privateVideoProgressRows',5],['privateVideoEventRows',6],['timelineRows',6],['rows',6]].forEach(([id,span]) => {
          const el = document.getElementById(id);
          if(el)el.innerHTML = row.replace('colspan="6"','colspan="'+span+'"');
        });
        const userRows = document.getElementById('userRows');
        if(userRows)userRows.innerHTML = '<tr><td colspan="7">快速摘要加载失败：'+esc(message)+'</td></tr>';
      }
    }
    async function loadRawEvents(){
      const rawState = document.getElementById('rawState');
      rawState.textContent = '加载原始日志中...';
      try{
        const res = await fetch('/api/admin/events?limit=220&view=raw', { cache: 'no-store', credentials:'same-origin' });
        const data = await res.json();
        latest = data.events || [];
        summary = data.summary || summary || {};
        rawLoaded = true;
        rawState.textContent = '原始日志已加载';
        draw();
      }catch(error){
        rawState.textContent = '原始日志加载失败：'+(error && error.message ? error.message : error);
      }
    }
    document.getElementById('refresh').addEventListener('click', load);
    document.getElementById('loadRaw').addEventListener('click', loadRawEvents);
    document.getElementById('reloadPrivateVideos').addEventListener('click', loadPrivateVideos);
    document.getElementById('privateVideoRows').addEventListener('click', (event) => {
      const publishButton = event.target.closest('[data-pv-publish-course]');
      const accessButton = event.target.closest('[data-pv-access-course]');
      const archiveButton = event.target.closest('[data-pv-archive-course]');
      const deleteButton = event.target.closest('[data-pv-delete-course]');
      const button = publishButton || accessButton || archiveButton || deleteButton;
      if(!button)return;
      const courseId = button.getAttribute('data-pv-publish-course')
        || button.getAttribute('data-pv-access-course')
        || button.getAttribute('data-pv-archive-course')
        || button.getAttribute('data-pv-delete-course');
      const status = document.getElementById('privateVideoActionStatus');
      const run = publishButton
        ? () => submitPrivateVideoAction(courseId, 'publish', privateVideoAccessPayload(courseId, false))
        : accessButton
          ? () => updatePrivateVideoCourseAccess(courseId)
          : archiveButton
            ? () => submitPrivateVideoAction(courseId, 'archive')
            : () => deletePrivateVideoCourse(courseId);
      run().catch(error => {
        const message = error && error.message ? error.message : error;
        status.textContent = '专属课操作失败：' + (String(message || '').includes('delete_meta_failed') ? '这次没有删掉专属课元数据，请稍后重试删除。' : message);
      });
    });
    document.getElementById('bindingUserSelect').addEventListener('change', () => {
      document.getElementById('bindingDeviceId').value = '';
      document.getElementById('bindingDeviceLabel').value = '';
      document.getElementById('bindingNote').value = '';
      document.getElementById('bindingStatus').dataset.mode = 'auto';
      drawBindingPanel();
      drawPasswordResetPanel();
    });
    document.getElementById('passwordResetUserSelect').addEventListener('change', () => {
      document.getElementById('passwordResetStatus').dataset.mode = 'auto';
      drawPasswordResetPanel();
    });
    document.getElementById('studentTempPassword').addEventListener('input', () => {
      document.getElementById('passwordResetStatus').dataset.mode = 'auto';
    });
    document.getElementById('studentTempPasswordConfirm').addEventListener('input', () => {
      document.getElementById('passwordResetStatus').dataset.mode = 'auto';
    });
    document.getElementById('bindingDeviceId').addEventListener('input', () => {
      document.getElementById('bindingStatus').dataset.mode = 'auto';
      drawBindingPanel();
    });
    document.getElementById('bindingDeviceLabel').addEventListener('input', () => {
      document.getElementById('bindingStatus').dataset.mode = 'auto';
    });
    document.getElementById('bindingNote').addEventListener('input', () => {
      document.getElementById('bindingStatus').dataset.mode = 'auto';
    });
    document.getElementById('bindingDeviceCandidates').addEventListener('click', (event) => {
      const button = event.target.closest('[data-bind-device]');
      if(!button)return;
      const row = findBindingAccount(document.getElementById('bindingUserSelect').value);
      const device = bindingDevicePool(row).find(item => item.deviceId === button.getAttribute('data-bind-device'));
      if(!device)return;
      setBindingDraftFromDevice(device);
      document.getElementById('bindingStatus').dataset.mode = 'result';
      document.getElementById('bindingStatus').textContent = '已填入候选设备，可直接保存绑定。';
      drawBindingPanel();
    });
    document.getElementById('saveBinding').addEventListener('click', () => { submitBinding('bind'); });
    document.getElementById('clearBinding').addEventListener('click', () => { submitBinding('clear'); });
    document.getElementById('resetStudentPassword').addEventListener('click', () => { submitStudentPasswordReset(); });
    document.getElementById('uploadPrivateVideo').addEventListener('click', () => {
      uploadPrivateVideo().catch(error => {
        document.getElementById('privateVideoUploadStatus').textContent = '上传失败：' + (error && error.message ? error.message : error);
      });
    });
	    document.getElementById('search').addEventListener('input', applyFilter);
	    document.getElementById('typeFilter').addEventListener('change', applyFilter);
	    document.getElementById('monitorSearch').addEventListener('input', redrawMonitorTables);
	    document.getElementById('riskOnly').addEventListener('change', redrawMonitorTables);
	    document.getElementById('riskOverview').addEventListener('click', (event) => {
	      const button = event.target.closest('[data-risk-search]');
	      if(button)focusRiskSearch(button.getAttribute('data-risk-search'));
	    });
	    document.getElementById('clearFilter').addEventListener('click', () => {
	      document.getElementById('search').value='';
	      document.getElementById('typeFilter').value='';
	      document.getElementById('monitorSearch').value='';
	      document.getElementById('riskOnly').checked=false;
	      applyFilter();
	      redrawMonitorTables();
	    });
    document.getElementById('export').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), summary, events: latest }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'edge-audit-events.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
	    loadPrivateVideos();
	    loadServerHealth();
	    load();
    setInterval(load, 30000);
  </script>
</body>
</html>`;
}

function monitorScript() {
  return `(() => {
  const startedAt = Date.now();
  let lastPath = location.pathname + location.search + location.hash;
  let maxScroll = 0;
  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register = () => Promise.resolve({
        scope: '/',
        update: () => Promise.resolve(),
        unregister: () => Promise.resolve(true)
      });
      navigator.serviceWorker.getRegistrations()
        .then(registrations => registrations.forEach(registration => registration.unregister()))
        .catch(() => {});
    } catch (_) {}
  }
  if (window.caches && caches.keys) {
    caches.keys().then(keys => keys.forEach(key => caches.delete(key))).catch(() => {});
  }
  const edgeBar = () => {
    if (document.getElementById('fm-edge-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'fm-edge-bar';
    bar.innerHTML = '<a href="/_edge-admin">监控</a><a href="/_edge-logout">退出</a>';
    bar.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:2147483000;display:flex;gap:6px;background:rgba(15,23,32,.78);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:6px;box-shadow:0 12px 30px rgba(0,0,0,.22)';
    bar.querySelectorAll('a').forEach(a => { a.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 14px;border-radius:8px;background:#0f766e;color:white;text-decoration:none;font:700 13px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:0'; });
    document.body.appendChild(bar);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', edgeBar, { once: true });
  else edgeBar();
  const post = (type, data) => {
    enrichPayload(data || {}).then((payload) => {
      const body = JSON.stringify({ type, data: payload });
      try {
        navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      } catch (_) {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
      }
    }).catch(() => {});
  };
  function browserSessionId(){
    const key='fm_browser_session_id';
    try{let v=localStorage.getItem(key);if(!v){v=(crypto.randomUUID?crypto.randomUUID():(Date.now()+'-'+Math.random().toString(36).slice(2)));localStorage.setItem(key,v)}return v}catch(_){return Date.now()+'-'+Math.random().toString(36).slice(2)}
  }
  function deviceProfile(){return {userAgent:navigator.userAgent||'',platform:navigator.platform||'',language:navigator.language||'',languages:Array.isArray(navigator.languages)?navigator.languages.slice(0,5):[],timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'',touchPoints:navigator.maxTouchPoints||0,hardwareConcurrency:navigator.hardwareConcurrency||0,deviceMemory:navigator.deviceMemory||0,uaData:navigator.userAgentData?{mobile:!!navigator.userAgentData.mobile,platform:navigator.userAgentData.platform||''}:null,screen:screen?{width:screen.width||0,height:screen.height||0,availWidth:screen.availWidth||0,availHeight:screen.availHeight||0,colorDepth:screen.colorDepth||0,pixelRatio:devicePixelRatio||1}:{}}}
  async function deviceFingerprint(){try{if(!window.crypto||!window.crypto.subtle)return '';const key='fm_device_fp';const cached=localStorage.getItem(key);if(cached)return cached;const source=[navigator.userAgent||'',navigator.language||'',(screen&&screen.width?screen.width:0)+'x'+(screen&&screen.height?screen.height:0),new Date().getTimezoneOffset(),navigator.hardwareConcurrency||'',navigator.platform||''].join('|');const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source));let text='';new Uint8Array(digest).forEach(byte=>{text+=String.fromCharCode(byte)});const value=btoa(text);localStorage.setItem(key,value);return value}catch(_){return ''}}
  const sessionId = browserSessionId();
  const profile = deviceProfile();
  const fingerprintPromise = deviceFingerprint().catch(() => '');
  async function enrichPayload(data){
    return {
      ...(data||{}),
      browserSessionId: sessionId,
      viewport: innerWidth + 'x' + innerHeight,
      deviceProfile: profile,
      deviceFingerprint: await fingerprintPromise
    };
  }
  post('page_view', { title: document.title, path: location.pathname + location.search, referrer: document.referrer || '' });
  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('a[href]');
    const button = event.target.closest && event.target.closest('button');
    if (link) post('link_click', { text: (link.textContent || '').trim().slice(0, 80), href: link.href });
    else if (button) post('button_click', { text: (button.textContent || '').trim().slice(0, 80), id: button.id || '' });
  }, { capture: true, passive: true });
  document.addEventListener('submit', (event) => {
    const form = event.target;
    post('form_submit', { id: form && form.id || '', action: form && form.action || '', method: form && form.method || 'get' });
  }, { capture: true });
  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!target || !target.matches || !target.matches('select,input[type="checkbox"],input[type="radio"]')) return;
    post('control_change', { tag: target.tagName, type: target.type || '', name: target.name || '', id: target.id || '', checked: Boolean(target.checked) });
  }, { capture: true });
  document.addEventListener('visibilitychange', () => post('visibility_change', { state: document.visibilityState, path: location.pathname }));
  window.addEventListener('scroll', () => {
    const height = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const pct = Math.min(100, Math.round((scrollY / height) * 100));
    if (pct >= maxScroll + 25) {
      maxScroll = pct;
      post('scroll_depth', { path: location.pathname, percent: pct });
    }
  }, { passive: true });
  const routeChanged = () => {
    const next = location.pathname + location.search + location.hash;
    if (next === lastPath) return;
    post('route_change', { from: lastPath, to: next });
    lastPath = next;
  };
  ['pushState', 'replaceState'].forEach((name) => {
    const native = history[name];
    history[name] = function patchedHistoryState(...args) {
      const result = native.apply(this, args);
      setTimeout(routeChanged, 0);
      return result;
    };
  });
  window.addEventListener('popstate', routeChanged);
  window.addEventListener('hashchange', routeChanged);
  window.addEventListener('error', (event) => post('client_error', { message: event.message, source: event.filename, line: event.lineno }));
  window.addEventListener('unhandledrejection', (event) => post('client_rejection', { reason: String(event.reason || '').slice(0, 200) }));
  if (window.fetch) {
    const nativeFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const requested = String(args[0] && args[0].url ? args[0].url : args[0] || '');
      const res = await nativeFetch(...args);
      try {
        const url = new URL(requested, location.href);
        const watched = url.origin === location.origin && !url.pathname.startsWith('/api/track');
        if (watched && (!res.ok || /question-banks|resources|data|modules/i.test(url.pathname))) {
          post('resource_fetch', { path: url.pathname, status: res.status, ok: res.ok });
        }
      } catch (_) {}
      return res;
    };
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (!nav) return;
      post('load_timing', {
        path: location.pathname,
        duration: Math.round(nav.duration || 0),
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
        transferSize: nav.transferSize || 0
      });
    }, 0);
  }, { once: true });
  setInterval(() => post('session_heartbeat', { path: location.pathname, seconds: Math.round((Date.now() - startedAt) / 1000) }), 300000);
  window.addEventListener('pagehide', () => post('page_leave', { path: location.pathname, seconds: Math.round((Date.now() - startedAt) / 1000) }));
})();`;
}

function sixDigitCode() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(bytes[0] % 1000000).padStart(6, '0');
}

async function readJsonRequest(request) {
  try {
    return await request.json();
  } catch (_) {
    return null;
  }
}

function padChunkIndex(index) {
  return String(index).padStart(4, '0');
}

function normalizePrivateVideoId(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 96);
}

function createPrivateVideoId(title) {
  const seed = String(title || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 28) || 'video';
  const suffix = randomBase64Url(5).toLowerCase().replace(/_/g, '-');
  return normalizePrivateVideoId(`pv-${Date.now().toString(36)}-${seed}-${suffix}`);
}

function createPrivateCourseId(title) {
  const seed = String(title || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 28) || 'course';
  const suffix = randomBase64Url(5).toLowerCase().replace(/_/g, '-');
  return normalizePrivateVideoId(`pc-${Date.now().toString(36)}-${seed}-${suffix}`);
}

function normalizeUserList(value) {
  const raw = Array.isArray(value)
    ? value
    : String(value || '').split(/[\s,，;；、\n\r\t]+/);
  const seen = new Set();
  const users = [];
  raw.forEach((item) => {
    const username = normalizeUsername(item);
    if (!username || seen.has(username)) return;
    seen.add(username);
    users.push(username);
  });
  return users.slice(0, 200);
}

function normalizeEntitlementList(value) {
  const raw = Array.isArray(value)
    ? value
    : String(value || '').split(/[\s,，;；、\n\r\t]+/);
  const seen = new Set();
  const items = [];
  raw.forEach((item) => {
    const text = String(item || '').trim().toLowerCase().replace(/[^a-z0-9:_-]/g, '').slice(0, 96);
    if (!text || seen.has(text)) return;
    seen.add(text);
    items.push(text);
  });
  return items.slice(0, 100);
}

function normalizePrivateAssignedUsers(value) {
  return normalizeUserList(value).filter((user) => user && user !== 'teacher' && user !== 'admin');
}

function normalizePrivateVideoContentType(value, fileName = '') {
  const raw = String(value || '').trim().toLowerCase().slice(0, 120);
  if (raw && raw.startsWith('video/')) return raw;
  const name = String(fileName || '').trim().toLowerCase();
  if ((!raw || raw === 'application/octet-stream') && /\.(mp4|m4v|mov|webm|mkv|ogv)$/i.test(name)) {
    if (/\.webm$/i.test(name)) return 'video/webm';
    if (/\.ogv$/i.test(name)) return 'video/ogg';
    if (/\.mkv$/i.test(name)) return 'video/x-matroska';
    if (/\.mov$/i.test(name)) return 'video/quicktime';
    return 'video/mp4';
  }
  return '';
}

function oneOnOneAssignedUserError(assignedUsers) {
  if (!Array.isArray(assignedUsers) || assignedUsers.length !== 1) {
    return '一对一专属课必须且只能指定 1 个学生账号。';
  }
  return '';
}

async function validatePrivateAssignedStudent(env, assignedUsers) {
  const assignedError = oneOnOneAssignedUserError(assignedUsers);
  if (assignedError) return { ok: false, status: 400, error: 'one_on_one_required', message: assignedError };
  const username = normalizeUsername(assignedUsers[0]);
  if (!username || isAdminUsername(username, env) || username === 'teacher' || username === 'admin') {
    return { ok: false, status: 400, error: 'invalid_assigned_student', message: '专属课只能授权给学生账号。' };
  }
  const accountState = await readUserAccountAuthState(env, username);
  if (!accountState.ok) {
    return { ok: false, status: 503, error: 'account_lookup_failed', message: '学生账号状态暂时无法确认，请稍后重试。' };
  }
  const account = accountState.account;
  if (!account) {
    return { ok: false, status: 404, error: 'assigned_student_not_found', message: `没有找到学生账号 @${username}，请先确认学生已注册或账号拼写正确。` };
  }
  if (account && account.disabled) {
    return { ok: false, status: 403, error: 'assigned_student_disabled', message: `学生账号 @${username} 已停用，不能接收一对一专属课。` };
  }
  if (account && isAdminUsername(account.username || username, env)) {
    return { ok: false, status: 400, error: 'invalid_assigned_student', message: '专属课不能授权给教师账号。' };
  }
  const access = await studentAccessStatus(env, username);
  if (!access.ok) {
    const message = access.reason === 'locked'
      ? `学生账号 @${username} 当前已被锁定，不能接收一对一专属课。`
      : `学生账号 @${username} 不在可访问名单中，请先在学生权限里开放该账号。`;
    return { ok: false, status: 403, error: access.reason === 'locked' ? 'assigned_student_locked' : 'assigned_student_not_allowed', message };
  }
  return { ok: true, username, assignedUsers: [username] };
}

function privateVideoMetaKey(id) {
  return `${PRIVATE_VIDEO_META_PREFIX}${id}:meta`;
}

function privateVideoUploadChunkKey(id, index) {
  return `${PRIVATE_VIDEO_CHUNK_PREFIX}${id}:${padChunkIndex(index)}`;
}

function privateVideoR2ChunkKey(id, index) {
  return `${PRIVATE_VIDEO_R2_PREFIX}/${id}/chunks/chunk-${padChunkIndex(index)}.bin`;
}

function normalizePrivateVideoWriteHealthError(error) {
  const raw = String(error && error.message ? error.message : error || '').trim();
  if (isKvPutDailyLimitError(error)) {
    return {
      state: 'blocked',
      error: 'kv_daily_limit_exceeded',
      message: 'FM_AUDIT KV 写入额度已受限；上传、发布、改授权和下架暂不可用。动态上传课删除会走独立撤销入口，若元数据删除也失败会明确返回。'
    };
  }
  return {
    state: 'blocked',
    error: 'meta_write_failed',
    message: raw ? `FM_AUDIT 元数据写入探测失败：${raw}` : 'FM_AUDIT 元数据写入探测失败；上传、发布、改授权和下架暂不可用。'
  };
}

function rememberPrivateVideoMetadataWriteHealth(result) {
  PRIVATE_VIDEO_METADATA_WRITE_HEALTH = {
    checkedAt: Date.now(),
    state: result && result.state || 'unknown',
    error: result && result.error || '',
    message: result && result.message || '',
    metadataStore: result && result.metadataStore || '',
    fallback: Boolean(result && result.fallback)
  };
  return PRIVATE_VIDEO_METADATA_WRITE_HEALTH;
}

function privateVideoMetaR2Key(id) {
  return `${PRIVATE_VIDEO_R2_PREFIX}/${normalizePrivateVideoId(id)}/meta.json`;
}

function privateVideoR2JsonAvailable(env, method = 'get') {
  return !!(env && env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA[method] === 'function');
}

function privateVideoDeleteReadiness(r2Available, metadataWriteHealth) {
  const r2MissingReason = r2Available ? '' : '生产 blocker：Cloudflare Pages 缺少 FM_PRIVATE_MEDIA R2 binding；删除只能按预检结果受限尝试，不能据此宣称生产私有视频管理恢复。';
  const healthState = metadataWriteHealth && metadataWriteHealth.state;
  if (!r2Available) {
    const reason = healthState === 'blocked' && metadataWriteHealth && metadataWriteHealth.message
      ? `${metadataWriteHealth.message} ${r2MissingReason}`
      : r2MissingReason;
    return {
      state: 'limited',
      detail: `${reason} 删除动态专属课仍可先尝试撤销元数据入口；如果 KV 删除也失败，接口会返回 delete_meta_failed，不会假装删除成功。上传、发布、改授权、下架和完整存储清理仍需恢复 FM_PRIVATE_MEDIA R2 binding，并用真实教师账号验收。`
    };
  }
  if (healthState === 'blocked') {
    return {
      state: 'limited',
      detail: 'FM_AUDIT 写入受限，但 R2 fallback 可用时可尝试先撤销元数据入口，再清理分片；失败会明确返回。'
    };
  }
  return {
    state: 'ready',
    detail: '只删除教师上传的动态专属课；内置示范课不可删除。动态课会先删元数据撤销学生端入口，再清理分片；索引回写失败只提示 cleanupPending。'
  };
}

function privateVideoDeleteConfirmation(courseId) {
  return {
    required: true,
    dryRunRequired: true,
    field: 'confirmCourseId',
    expectedCourseId: courseId,
    exactMatchRequired: true,
    message: '真正删除必须先通过 dry-run 预检，并在请求正文里提交与路径完全一致的 confirmCourseId。'
  };
}

function privateVideoStorageCleanupPlan(r2Available, course, deleteReadiness) {
  const segmentCount = Math.max(0, Number(course && course.segmentCount || 0) || 0);
  const chunkCount = Math.max(0, Number(course && course.chunks || 0) || 0);
  const missingR2Blocker = r2Available
    ? ''
    : 'FM_PRIVATE_MEDIA R2 未绑定；本次最多只能证明元数据撤销和 KV 分片清理已尝试，不能证明 R2 对象也被清掉。';
  return {
    mode: 'metadata-first',
    typedConfirmation: 'confirmCourseId',
    metadataRevoke: 'attempted-first',
    metadataRevokedAfterDelete: true,
    studentPlaybackRevocation: 'metadata-delete-removes-student-catalog-status-and-stream',
    kvCleanup: 'attempted-on-delete',
    r2Cleanup: r2Available ? 'attempted-on-delete' : 'blocked-unverified-missing-fm-private-media',
    storageCleanupCompleteClaimAllowed: !!r2Available,
    cleanupPendingIfFmPrivateMediaMissing: !r2Available,
    productionRecoveryStatus: r2Available ? 'requires-real-account-qa' : 'blocked-missing-fm-private-media',
    segmentCount,
    chunkCount,
    blocker: missingR2Blocker,
    detail: deleteReadiness && deleteReadiness.detail ? deleteReadiness.detail : ''
  };
}

function privateVideoStorageBlockers(r2Available, storage = null) {
  const blockers = [];
  if (!r2Available) blockers.push('missing_fm_private_media_r2_storage_cleanup_unverified');
  if (storage && Array.isArray(storage.errors) && storage.errors.length) blockers.push('delete_cleanup_pending');
  return blockers;
}

function privateVideoDeleteOutcome(stage, options = {}) {
  const r2Available = !!options.r2Available;
  const storage = options.storage && typeof options.storage === 'object' ? options.storage : null;
  const storageCleanupPlan = options.storageCleanupPlan && typeof options.storageCleanupPlan === 'object' ? options.storageCleanupPlan : {};
  const metadataRevoked = options.metadataRevoked === true;
  const cleanupPending = metadataRevoked && (Array.isArray(storage && storage.errors) && storage.errors.length > 0 || !r2Available);
  const wouldCleanupPending = !metadataRevoked && !r2Available;
  const limits = options.limits && typeof options.limits === 'object' ? options.limits : {};
  const blockers = privateVideoStorageBlockers(r2Available, storage);
  return {
    stage,
    metadataRevoked,
    studentPlaybackRevoked: metadataRevoked,
    cleanupPending,
    wouldCleanupPending,
    storageCleanupCompleteClaimAllowed: !!(r2Available && metadataRevoked && !cleanupPending),
    fmPrivateMediaAvailable: r2Available,
    fmPrivateMediaMissing: !r2Available,
    requiredBinding: 'FM_PRIVATE_MEDIA',
    productionRecoveryAllowed: false,
    productionRecoveryStatus: r2Available ? 'requires-real-account-qa' : 'blocked-missing-fm-private-media',
    requiresRealAccountQa: true,
    blockers,
    deleteReadinessState: options.deleteReadiness && options.deleteReadiness.state || '',
    storageCleanupMode: storageCleanupPlan.mode || 'metadata-first',
    blocker: blockers.join(','),
    productionBlocker: limits.productionBlocker || (!r2Available ? '生产 blocker：Cloudflare Pages 缺少 FM_PRIVATE_MEDIA R2 binding。' : ''),
    productionAcceptance: limits.productionAcceptance || '生产恢复还必须使用真实教师账号完成浏览器验收。'
  };
}

function privateVideoDeleteResultSummary(stage, options = {}) {
  const course = options.course && typeof options.course === 'object' ? options.course : {};
  const storage = options.storage && typeof options.storage === 'object' ? options.storage : {};
  const storageCleanupPlan = options.storageCleanupPlan && typeof options.storageCleanupPlan === 'object' ? options.storageCleanupPlan : {};
  const fallbackDeleteOutcome = () => ({
    deleteOutcome: privateVideoDeleteOutcome(stage, options)
  });
  const outcome = options.deleteOutcome && typeof options.deleteOutcome === 'object'
    ? options.deleteOutcome
    : fallbackDeleteOutcome().deleteOutcome;
  const blockers = Array.from(new Set([
    ...(Array.isArray(options.blockers) ? options.blockers : []),
    ...(Array.isArray(outcome.blockers) ? outcome.blockers : [])
  ].filter(Boolean)));
  const dryRun = options.dryRun === true;
  const destructiveRequestSent = options.destructiveRequestSent === true;
  const metadataRevoked = outcome.metadataRevoked === true;
  const cleanupPending = options.cleanupPending === true || outcome.cleanupPending === true;
  const wouldCleanupPending = outcome.wouldCleanupPending === true;
  let severity = 'info';
  let teacherMessage = '删除状态已返回；请按页面结果核对课程入口和存储清理边界。';
  let nextStep = '刷新专属课列表并核对学生端入口。';
  if (stage === 'dry-run-can-delete') {
    severity = 'warn';
    teacherMessage = '删除预检通过；尚未删除任何数据。';
    nextStep = '核对课程信息，再输入完整课程 ID 继续删除。';
  } else if (stage === 'dry-run-blocked' || stage === 'blocked-before-delete') {
    severity = 'error';
    teacherMessage = '删除预检被阻塞；未删除任何数据。';
    nextStep = '先修复页面列出的存储 blocker，再重新执行 dry-run。';
  } else if (stage === 'confirm-course-id-mismatch') {
    severity = 'error';
    teacherMessage = '课程 ID 核对失败；未发送真实删除。';
    nextStep = '重新从页面按钮进入删除流程，并输入完整课程 ID。';
  } else if (stage === 'metadata-revoke-failed') {
    severity = 'error';
    teacherMessage = '元数据撤销失败；页面不会假装删除成功。';
    nextStep = '刷新列表确认课程仍在，再按错误说明重试或先恢复存储写入。';
  } else if (stage === 'metadata-revoked-cleanup-pending') {
    severity = 'warn';
    teacherMessage = '学生端入口已撤销；存储清理仍待验证。';
    nextStep = '不要宣称完整存储删除；绑定 FM_PRIVATE_MEDIA 后重新做真实账号 QA。';
  } else if (stage === 'complete') {
    severity = 'ok';
    teacherMessage = '专属课已删除，学生端播放入口已失效。';
    nextStep = '刷新列表并用真实账号 QA 核对学生端不可见。';
  }
  if (!outcome.fmPrivateMediaAvailable && (cleanupPending || metadataRevoked)) {
    nextStep = 'FM_PRIVATE_MEDIA 未绑定时不能宣称完整存储清理；绑定 R2 后重新跑生产私有视频 gate。';
  }
  return {
    stage,
    severity,
    teacherMessage,
    nextStep,
    dryRun,
    destructiveRequestSent,
    confirmationRequired: true,
    confirmationField: 'confirmCourseId',
    expectedCourseId: course.courseId || course.id || options.expectedCourseId || '',
    exactCourseIdRequired: true,
    metadataRevoked,
    studentPlaybackRevoked: outcome.studentPlaybackRevoked === true,
    cleanupPending,
    wouldCleanupPending,
    storageCleanupCompleteClaimAllowed: outcome.storageCleanupCompleteClaimAllowed === true,
    productionRecoveryAllowed: false,
    productionRecoveryStatus: outcome.productionRecoveryStatus || '',
    requiredBinding: 'FM_PRIVATE_MEDIA',
    blockers,
    storageCleanupMode: storageCleanupPlan.mode || outcome.storageCleanupMode || 'metadata-first',
    kvChunksDeleted: Number(storage.kvChunks || 0),
    r2ChunksDeleted: Number(storage.r2Chunks || 0),
    metadataRowsDeleted: Number(storage.metas || 0),
    storageErrorCount: Array.isArray(storage.errors) ? storage.errors.length : 0,
    storageErrors: Array.isArray(storage.errors) ? storage.errors.slice(0, 10) : [],
    fullStorageCleanupClaimAllowedWithoutFmPrivateMedia: false
  };
}

function sanitizePrivateVideoStorageErrors(errors) {
  return (Array.isArray(errors) ? errors : []).map((error) => truncate(String(error || '')
    .replace(/private\/videos\/[^\s"']+/g, 'private/videos/<redacted>')
    .replace(/private-video-chunk:[^\s"']+/g, 'private-video-chunk:<redacted>')
    .replace(/private-video:[^\s"']+:meta/g, 'private-video:<redacted>:meta'), 180)).filter(Boolean).slice(0, 20);
}

function privateVideoStorageRepairGuide(r2Available, metadataWriteHealth) {
  const healthState = metadataWriteHealth && metadataWriteHealth.state;
  const blocked = healthState === 'blocked';
  if (r2Available && !blocked) {
	    return {
	      needed: false,
	      title: '私有视频存储已就绪',
	      summary: '生产环境已检测到可写 FM_PRIVATE_MEDIA R2 fallback；存储层就绪。生产恢复仍需真实教师/学生账号浏览器验收后再执行专属课上传、发布、改授权、下架和删除。'
	    };
  }
  const reason = metadataWriteHealth && metadataWriteHealth.message
    ? metadataWriteHealth.message
    : (r2Available
      ? '当前元数据写入状态需要重新探测。'
      : '当前生产环境没有可写 FM_PRIVATE_MEDIA R2 绑定。');
  return {
    needed: true,
    title: '需要修复 Cloudflare 私有视频存储',
    summary: `${reason} 处理前不要反复上传大视频；先完成 R2 绑定或等待 KV 写入额度恢复。生产恢复还必须使用真实教师账号完成浏览器验收。`,
    projectName: 'lghui-fluid-learning',
    requiredBinding: 'FM_PRIVATE_MEDIA',
    existingKvBinding: 'FM_AUDIT',
    expectedPrefix: `${PRIVATE_VIDEO_R2_PREFIX}/`,
    steps: [
      'Cloudflare Dashboard 打开 Pages 项目 lghui-fluid-learning。',
      '进入 Settings / Functions / R2 bucket bindings。',
      '添加生产环境 R2 binding，变量名必须是 FM_PRIVATE_MEDIA，指向私有媒体桶。',
      '保存后重新部署或等待 Pages Functions 环境刷新，再回到教师后台点“刷新专属课”。'
    ],
    verifyCommands: [
      'node tools/check-cloudflare-pages-private-video-bindings.mjs --json',
      'NODE_PATH=/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules /Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tools/check-private-video-management-browser.mjs --production --json'
    ]
  };
}

async function readJsonR2(bucket, key, fallback = null) {
  if (!bucket || typeof bucket.get !== 'function' || !key) return fallback;
  try {
    const object = await bucket.get(key);
    if (!object || typeof object.arrayBuffer !== 'function') return fallback;
    const text = new TextDecoder().decode(await object.arrayBuffer());
    if (!text) return fallback;
    return JSON.parse(text);
  } catch (_) {
    return fallback;
  }
}

async function writeJsonR2(bucket, key, value) {
  if (!bucket || typeof bucket.put !== 'function' || !key) return false;
  try {
    await bucket.put(key, JSON.stringify(value), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' }
    });
    return true;
  } catch (_) {
    return false;
  }
}

async function probePrivateVideoMetadataWriteHealth(env, options = {}) {
  const now = Date.now();
  if (!options.force && PRIVATE_VIDEO_METADATA_WRITE_HEALTH.checkedAt && now - PRIVATE_VIDEO_METADATA_WRITE_HEALTH.checkedAt < PRIVATE_VIDEO_WRITE_HEALTH_TTL_MS) {
    return PRIVATE_VIDEO_METADATA_WRITE_HEALTH;
  }
  const key = `${PRIVATE_VIDEO_META_PREFIX}write-health:${EDGE_HOME_VERSION}`;
  let kvError = null;
  if (env.FM_AUDIT && typeof env.FM_AUDIT.put === 'function') {
    try {
      await env.FM_AUDIT.put(key, JSON.stringify({ ok: true, at: new Date(now).toISOString(), version: EDGE_HOME_VERSION }), { expirationTtl: 10 * 60 });
      if (typeof env.FM_AUDIT.delete === 'function') await env.FM_AUDIT.delete(key);
      return rememberPrivateVideoMetadataWriteHealth({
        state: 'ready',
        metadataStore: 'FM_AUDIT',
        message: 'FM_AUDIT 元数据写入探测通过；上传、发布、改授权和下架可继续。'
      });
    } catch (error) {
      kvError = error;
    }
  }
  if (privateVideoR2JsonAvailable(env, 'put')) {
    const r2Key = `${PRIVATE_VIDEO_R2_PREFIX}/write-health/${EDGE_HOME_VERSION}.json`;
    const wroteR2 = await writeJsonR2(env.FM_PRIVATE_MEDIA, r2Key, { ok: true, at: new Date(now).toISOString(), version: EDGE_HOME_VERSION });
    if (wroteR2) {
      if (typeof env.FM_PRIVATE_MEDIA.delete === 'function') {
        try {
          await env.FM_PRIVATE_MEDIA.delete(r2Key);
        } catch (_) {
          // R2 write is the readiness signal; a failed temp delete must not block upload readiness.
        }
      }
      return rememberPrivateVideoMetadataWriteHealth({
        state: 'ready',
        metadataStore: 'FM_PRIVATE_MEDIA',
        fallback: true,
        message: kvError
          ? 'FM_AUDIT KV 元数据写入受限，但 R2 元数据 fallback 写入探测通过；上传、发布、改授权和下架可继续走 R2。'
          : 'R2 元数据 fallback 写入探测通过；上传、发布、改授权和下架可继续。'
      });
    }
  }
  if (!env.FM_AUDIT || typeof env.FM_AUDIT.put !== 'function') {
    return rememberPrivateVideoMetadataWriteHealth({
      state: 'blocked',
      error: 'storage_not_configured',
      metadataStore: privateVideoR2JsonAvailable(env, 'put') ? 'FM_PRIVATE_MEDIA' : '',
      message: 'FM_AUDIT 元数据存储未配置，且 R2 元数据 fallback 不可写；不能上传、发布、改授权或下架专属课。'
    });
  }
  try {
    throw kvError;
  } catch (error) {
    const health = normalizePrivateVideoWriteHealthError(error);
    if (!privateVideoR2JsonAvailable(env, 'put')) {
      health.message = `${health.message} 当前 Cloudflare Pages 生产环境没有可写 FM_PRIVATE_MEDIA R2 绑定，无法启用 R2 元数据 fallback。`;
      health.r2Binding = 'missing';
    }
    return rememberPrivateVideoMetadataWriteHealth(health);
  }
}

function isKvPutDailyLimitError(error) {
  const message = String(error && error.message ? error.message : error || '').toLowerCase();
  if (!message) return false;
  return message.includes('kv put limit exceeded for the day')
    || (message.includes('kv put') && message.includes('limit exceeded'))
    || (message.includes('kv') && message.includes('quota') && message.includes('exceed'));
}

function pickPrivateUploadChunkPlan(size, requestedChunkSize, r2Available) {
  const minimum = 256 * 1024;
  const safeSize = Math.max(1, Math.floor(Number(size || 0) || 0));
  const suggestedForKv = Math.max(
    PRIVATE_UPLOAD_KV_MIN_CHUNK_BYTES,
    Math.ceil(safeSize / Math.max(1, PRIVATE_UPLOAD_KV_TARGET_CHUNKS))
  );
  const suggested = r2Available ? PRIVATE_UPLOAD_DEFAULT_CHUNK_BYTES : suggestedForKv;
  const hasRequested = Number.isFinite(Number(requestedChunkSize)) && Number(requestedChunkSize) > 0;
  let chunkSize = hasRequested ? Number(requestedChunkSize) : suggested;
  chunkSize = Math.max(minimum, Math.min(PRIVATE_UPLOAD_MAX_CHUNK_BYTES, Math.floor(chunkSize)));
  let recommendedChunkSize = Math.max(minimum, Math.min(PRIVATE_UPLOAD_MAX_CHUNK_BYTES, Math.floor(suggested)));
  if (!r2Available && chunkSize < recommendedChunkSize) chunkSize = recommendedChunkSize;
  return { chunkSize, recommendedChunkSize };
}

function privateVideoAdminLimits(r2Available, extra = {}) {
  const mode = r2Available ? 'r2' : 'kv';
  const metadataWriteHealth = extra.metadataWriteHealth || null;
  const realTeacherQaReady = extra.realTeacherAccountQaPassed === true
    || extra.realTeacherBrowserQaPassed === true
    || extra.productionRealTeacherQaPassed === true;
  const productionActionsReady = !!(r2Available && realTeacherQaReady);
  const healthState = metadataWriteHealth && metadataWriteHealth.state;
  const metadataStore = metadataWriteHealth && metadataWriteHealth.metadataStore
    ? metadataWriteHealth.metadataStore
    : (r2Available ? 'FM_AUDIT + FM_PRIVATE_MEDIA fallback' : 'FM_AUDIT');
  const metadataWriteState = healthState === 'ready'
    ? 'ready'
    : (healthState === 'blocked' ? 'blocked' : (r2Available ? 'ready' : 'limited'));
  const metadataWriteReason = metadataWriteHealth && metadataWriteHealth.message
    ? metadataWriteHealth.message
    : (r2Available
      ? '私有视频文件写入 R2；课程元数据优先写入 FM_AUDIT，KV 受限时可回退写入 R2。'
      : '当前未检测到 R2 私有媒体桶，课程元数据写入仍可能受 KV 限制。');
  const productionBlocker = r2Available
    ? ''
    : '生产 blocker：Cloudflare Pages 缺少 FM_PRIVATE_MEDIA R2 binding；上传、发布、真正改授权、下架和存储清理不能声明生产恢复。';
  const productionAcceptance = '生产恢复还必须使用真实教师账号完成浏览器验收。';
  const storageDependentReason = [metadataWriteReason, productionBlocker, productionAcceptance].filter(Boolean).join(' ');
  const deleteReadiness = privateVideoDeleteReadiness(r2Available, metadataWriteHealth);
  const deleteActionState = deleteReadiness.state === 'ready' && !productionActionsReady ? 'limited' : deleteReadiness.state;
  const storageMutationState = r2Available
    ? (metadataWriteState === 'blocked' ? 'blocked' : (productionActionsReady ? metadataWriteState : 'limited'))
    : 'blocked';
  const productionClaimCaution = productionActionsReady
    ? ''
    : ' 这不是生产恢复证明；生产恢复仍需 FM_PRIVATE_MEDIA R2 production binding 和真实教师账号浏览器 QA 同时通过。';
  const storageRepair = privateVideoStorageRepairGuide(r2Available, metadataWriteHealth);
  return {
    version: EDGE_HOME_VERSION,
    defaultChunkSize: r2Available ? PRIVATE_UPLOAD_DEFAULT_CHUNK_BYTES : PRIVATE_UPLOAD_KV_MIN_CHUNK_BYTES,
    kvMinChunkSize: PRIVATE_UPLOAD_KV_MIN_CHUNK_BYTES,
    maxChunkSize: PRIVATE_UPLOAD_MAX_CHUNK_BYTES,
    maxChunks: PRIVATE_UPLOAD_MAX_CHUNKS,
    r2Available: !!r2Available,
    storageMode: mode,
    storageLabel: r2Available ? 'R2 专用私有媒体桶' : 'KV 兜底私有存储',
    r2BindingState: r2Available ? 'ready' : 'missing',
    productionActionsReady,
    realTeacherAccountQaPassed: realTeacherQaReady,
    safeMetadataRevokeAllowed: true,
    storageCleanupCompleteClaimAllowed: !!r2Available,
    metadataStore,
    metadataWriteHealth: metadataWriteHealth || {
      state: metadataWriteState,
      metadataStore,
      message: storageDependentReason || metadataWriteReason
    },
    writeCaution: r2Available
      ? '当前分片写入 R2；元数据优先写入 FM_AUDIT，KV 受限时回退到 R2 JSON。'
      : storageDependentReason,
    deleteMode: `meta-first cleanup (${deleteReadiness.state})`,
    storageRepair,
    productionBlocker: productionBlocker || '',
    productionAcceptance,
    actionReadiness: [
      { id: 'list', label: '查看专属课', state: 'ready', detail: '读取课程索引和静态专属课，不需要写入。' },
      { id: 'same-access-save', label: '重复保存当前授权', state: 'ready', detail: '授权未变化时直接返回成功，不触发元数据写入。' },
      { id: 'delete-dry-run', label: '删除 dry-run 预检', state: 'ready', detail: '只读取课程状态、确认字段和清理计划；不会删除数据。' },
      { id: 'delete-course', label: '删除上传课', state: deleteActionState, detail: `${deleteReadiness.detail} 删除请求必须携带 confirmCourseId；没有 FM_PRIVATE_MEDIA 时返回 cleanupPending / blocker，不能宣称完整存储删除。${productionClaimCaution}` },
      { id: 'upload-publish', label: '上传并发布', state: storageMutationState, detail: `${storageDependentReason} 缺 FM_PRIVATE_MEDIA 时前端按钮和 API 都保持不可执行。${productionClaimCaution}` },
      { id: 'change-access', label: '改给另一个学生', state: storageMutationState, detail: `${storageDependentReason} 重复保存当前授权仍走 same-access no-op；真正改给其他学生时前端按钮和 API 都保持不可执行。${productionClaimCaution}` },
      { id: 'archive-course', label: '下架课程', state: storageMutationState, detail: `${storageDependentReason} 缺 FM_PRIVATE_MEDIA 时前端下架按钮和 API 都保持不可执行。${productionClaimCaution}` }
    ],
    ...extra
  };
}

function privateVideoMutationBlockedResponse(actionId, limits, status = 503) {
  const info = limits || privateVideoAdminLimits(false, { metadataWriteHealth: PRIVATE_VIDEO_METADATA_WRITE_HEALTH });
  const action = Array.isArray(info.actionReadiness)
    ? info.actionReadiness.find((item) => item && item.id === actionId)
    : null;
  const label = action && action.label ? action.label : '专属课写入操作';
  const detail = action && action.detail
    ? action.detail
    : 'Cloudflare Pages 缺少 FM_PRIVATE_MEDIA R2 binding；这项存储型操作当前不可执行。';
  return jsonResponse({
    ok: false,
    error: 'private_video_storage_blocked',
    actionId,
    actionState: action && action.state || 'blocked',
    limits: info,
    productionBlocker: info.productionBlocker || '生产 blocker：Cloudflare Pages 缺少 FM_PRIVATE_MEDIA R2 binding。',
    productionAcceptance: info.productionAcceptance || '生产恢复还必须使用真实教师账号完成浏览器验收。',
    productionRecoveryAllowed: false,
    message: `${label}暂不可用：${detail}`
  }, { status });
}

function sameAssignedUsers(left, right) {
  const a = normalizePrivateAssignedUsers(left || []);
  const b = normalizePrivateAssignedUsers(right || []);
  return a.length === b.length && a.every((user, index) => user === b[index]);
}

function qiPrivateVideoItem() {
  return {
    id: PRIVATE_QI_VIDEO_ID,
    title: 'qi 的课堂回放 01',
    desc: '老师给 qi 上的课。仅 qi 和教师账号可见。',
    type: 'url',
    url: `/api/private-videos/${PRIVATE_QI_VIDEO_ID}/stream`,
    icon: '课',
    duration: 0,
    tags: ['私有课程', '课堂回放', 'qi'],
    priority: -20,
    createdAt: 1778488290000,
    private: true,
    owner: 'qi',
    segmentCount: 1,
    version: EDGE_HOME_VERSION
  };
}

function privateVideoSegmentFromMeta(meta) {
  return {
    id: meta.id,
    title: meta.segmentTitle || meta.title || '第 ' + (Number(meta.segmentIndex || 0) + 1) + ' 段',
    url: `/api/private-videos/${encodeURIComponent(meta.id)}/stream`,
    duration: Number(meta.duration || 0),
    version: meta.updatedAt || EDGE_HOME_VERSION,
    segmentIndex: Number(meta.segmentIndex || 0),
    segmentCount: Number(meta.segmentCount || 1),
    size: Number(meta.size || 0)
  };
}

function privateVideoItemFromGroup(metas) {
  const segments = (Array.isArray(metas) ? metas : [])
    .filter(Boolean)
    .sort((a, b) => {
      const ai = Number(a.segmentIndex || 0);
      const bi = Number(b.segmentIndex || 0);
      if (ai !== bi) return ai - bi;
      return String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
    });
  const first = segments[0] || {};
  const courseId = normalizePrivateVideoId(first.courseId || first.id);
  const segmentItems = segments.map(privateVideoSegmentFromMeta);
  const duration = segmentItems.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  return {
    id: courseId,
    title: first.courseTitle || first.title || '未命名私有课程',
    desc: first.description || first.desc || '教师上传的一对一私有课程。仅授权账号可见。',
    type: 'url',
    url: segmentItems[0] ? segmentItems[0].url : `/api/private-videos/${encodeURIComponent(first.id || '')}/stream`,
    icon: first.icon || '课',
    duration,
    tags: Array.isArray(first.tags) && first.tags.length ? first.tags : ['私有课程', '一对一回放'],
    priority: Number(first.priority || -18),
    createdAt: first.createdAtMs || Date.parse(first.createdAt || '') || Date.now(),
    private: true,
    owner: first.owner || first.createdBy || 'teacher',
    segmentCount: segmentItems.length,
    merged: segmentItems.length > 1,
    segments: segmentItems,
    version: first.updatedAt || EDGE_HOME_VERSION
  };
}

async function scanPrivateVideoMetaIds(env, seedIds = []) {
  const recovered = [];
  const recoveredSeen = new Set();
  (Array.isArray(seedIds) ? seedIds : []).forEach((id) => {
    const normalized = normalizePrivateVideoId(id);
    if (!normalized || recoveredSeen.has(normalized)) return;
    recoveredSeen.add(normalized);
    recovered.push(normalized);
  });
  if (env.FM_AUDIT && typeof env.FM_AUDIT.list === 'function') {
    let cursor = undefined;
    const prefix = PRIVATE_VIDEO_META_PREFIX;
    while (recovered.length < 500) {
      let page = null;
      try {
        page = await env.FM_AUDIT.list({
          prefix,
          cursor,
          limit: Math.min(KV_LIST_PAGE_LIMIT, 500 - recovered.length)
        });
      } catch (_) {
        break;
      }
      const keys = page && Array.isArray(page.keys) ? page.keys : [];
      keys.forEach((entry) => {
        const rawName = String(entry && entry.name ? entry.name : '');
        if (!rawName.startsWith(prefix) || !rawName.endsWith(':meta')) return;
        const id = normalizePrivateVideoId(rawName.slice(prefix.length, -5));
        if (!id || recoveredSeen.has(id)) return;
        recoveredSeen.add(id);
        recovered.push(id);
      });
      if (!page || page.list_complete || !page.cursor) break;
      cursor = page.cursor;
    }
  }
  if (env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.list === 'function') {
    let cursor = undefined;
    const prefix = `${PRIVATE_VIDEO_R2_PREFIX}/`;
    while (recovered.length < 500) {
      let page = null;
      try {
        page = await env.FM_PRIVATE_MEDIA.list({
          prefix,
          cursor,
          limit: Math.min(KV_LIST_PAGE_LIMIT, 500 - recovered.length)
        });
      } catch (_) {
        break;
      }
      const objects = Array.isArray(page && page.objects) ? page.objects : (Array.isArray(page && page.keys) ? page.keys : []);
      objects.forEach((entry) => {
        const rawName = String(entry && (entry.key || entry.name) ? (entry.key || entry.name) : '');
        if (!rawName.startsWith(prefix) || !rawName.endsWith('/meta.json')) return;
        const id = normalizePrivateVideoId(rawName.slice(prefix.length, -10));
        if (!id || recoveredSeen.has(id)) return;
        recoveredSeen.add(id);
        recovered.push(id);
      });
      if (!page || page.truncated !== true || !page.cursor) break;
      cursor = page.cursor;
    }
  }
  return recovered.slice(0, 500);
}

async function readPrivateVideoIndex(env) {
  const index = [
    ...(await readJsonKv(env.FM_AUDIT, PRIVATE_VIDEO_INDEX_KEY, [])),
    ...(await readJsonR2(env.FM_PRIVATE_MEDIA, PRIVATE_VIDEO_R2_INDEX_KEY, []))
  ];
  const seen = new Set();
  const normalized = (Array.isArray(index) ? index : []).map(normalizePrivateVideoId).filter((id) => {
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).slice(0, 500);
  if (normalized.length > 0) return normalized;
  const recovered = await scanPrivateVideoMetaIds(env);
  if (recovered.length > 0) await writePrivateVideoIndex(env, recovered);
  return recovered;
}

async function reconcilePrivateVideoIndex(env) {
  const indexed = await readPrivateVideoIndex(env);
  const reconciled = await scanPrivateVideoMetaIds(env, indexed);
  if (reconciled.length === indexed.length && reconciled.every((id, index) => id === indexed[index])) {
    return indexed;
  }
  await writePrivateVideoIndex(env, reconciled);
  return reconciled;
}

async function writePrivateVideoIndex(env, ids) {
  const unique = [];
  const seen = new Set();
  (Array.isArray(ids) ? ids : []).forEach((id) => {
    const normalized = normalizePrivateVideoId(id);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    unique.push(normalized);
  });
  let wrote = false;
  if (env.FM_AUDIT && typeof env.FM_AUDIT.put === 'function') {
    try {
      await env.FM_AUDIT.put(PRIVATE_VIDEO_INDEX_KEY, JSON.stringify(unique.slice(0, 500)));
      wrote = true;
    } catch (_) {
      wrote = false;
    }
  }
  if (!wrote && privateVideoR2JsonAvailable(env, 'put')) {
    wrote = await writeJsonR2(env.FM_PRIVATE_MEDIA, PRIVATE_VIDEO_R2_INDEX_KEY, unique.slice(0, 500));
  }
  return wrote;
}

function normalizeUploadedPrivateVideoMeta(meta) {
  if (!meta || typeof meta !== 'object') return null;
  const id = normalizePrivateVideoId(meta.id);
  const size = Number(meta.size || 0);
  const chunkSize = Number(meta.chunkSize || 0);
  const chunks = Number(meta.chunks || meta.chunkCount || 0);
  if (!id || !Number.isFinite(size) || size <= 0 || !Number.isFinite(chunkSize) || chunkSize <= 0 || !Number.isFinite(chunks) || chunks <= 0) return null;
  return {
    ...meta,
    id,
    title: truncate(meta.title || meta.fileName || '未命名私有课程', 120),
    description: truncate(meta.description || meta.desc || '', 500),
    fileName: truncate(meta.fileName || '', 180),
    contentType: normalizePrivateVideoContentType(meta.contentType || 'video/mp4', meta.fileName || '') || 'video/mp4',
    size,
    chunkSize,
    chunks,
    status: meta.status === 'published' ? 'published' : (meta.status === 'archived' ? 'archived' : 'uploading'),
    assignedUsers: normalizePrivateAssignedUsers(meta.assignedUsers || meta.targetUsers || []),
    entitlements: normalizeEntitlementList(meta.entitlements || []),
    courseId: normalizePrivateVideoId(meta.courseId || meta.course || meta.id),
    courseTitle: truncate(meta.courseTitle || meta.title || meta.fileName || '未命名私有课程', 120),
    segmentTitle: truncate(meta.segmentTitle || meta.partTitle || meta.title || '', 120),
    segmentIndex: Math.max(0, Math.floor(Number(meta.segmentIndex || meta.partIndex || 0) || 0)),
    segmentCount: Math.max(1, Math.floor(Number(meta.segmentCount || meta.partCount || meta.chapters || 1) || 1)),
    duration: Math.max(0, Math.floor(Number(meta.duration || 0) || 0)),
    uploadedChunks: Array.isArray(meta.uploadedChunks) ? meta.uploadedChunks.map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n < chunks) : [],
    chunkBytes: meta.chunkBytes && typeof meta.chunkBytes === 'object' ? meta.chunkBytes : {},
    chunkHashes: meta.chunkHashes && typeof meta.chunkHashes === 'object' ? meta.chunkHashes : {},
    chunkStores: meta.chunkStores && typeof meta.chunkStores === 'object' ? meta.chunkStores : {},
    storage: meta.storage === 'r2' ? 'r2' : 'kv',
    source: 'teacher-upload'
  };
}

async function readUploadedPrivateVideoMeta(env, id) {
  const normalized = normalizePrivateVideoId(id);
  if (!normalized) return null;
  const kvMeta = await readJsonKv(env.FM_AUDIT, privateVideoMetaKey(normalized), null);
  if (kvMeta) return normalizeUploadedPrivateVideoMeta({ ...kvMeta, metadataStore: kvMeta.metadataStore || 'kv' });
  const r2Meta = await readJsonR2(env.FM_PRIVATE_MEDIA, privateVideoMetaR2Key(normalized), null);
  return normalizeUploadedPrivateVideoMeta(r2Meta ? { ...r2Meta, metadataStore: 'r2' } : null);
}

async function writeUploadedPrivateVideoMeta(env, meta) {
  if (!meta || !meta.id) return false;
  let kvError = null;
  if (env.FM_AUDIT && typeof env.FM_AUDIT.put === 'function') {
    try {
      await env.FM_AUDIT.put(privateVideoMetaKey(meta.id), JSON.stringify({ ...meta, metadataStore: 'kv' }));
      rememberPrivateVideoMetadataWriteHealth({
        state: 'ready',
        metadataStore: 'FM_AUDIT',
        message: 'FM_AUDIT 元数据写入刚刚成功。'
      });
      return true;
    } catch (_) {
      kvError = _;
      rememberPrivateVideoMetadataWriteHealth(normalizePrivateVideoWriteHealthError(_));
    }
  }
  if (privateVideoR2JsonAvailable(env, 'put')) {
    const wroteR2 = await writeJsonR2(env.FM_PRIVATE_MEDIA, privateVideoMetaR2Key(meta.id), { ...meta, metadataStore: 'r2' });
    if (wroteR2) {
      rememberPrivateVideoMetadataWriteHealth({
        state: 'ready',
        metadataStore: 'FM_PRIVATE_MEDIA',
        fallback: true,
        message: kvError
          ? 'FM_AUDIT KV 元数据写入受限；已改用 R2 元数据 fallback 保存。'
          : 'R2 元数据 fallback 写入成功。'
      });
      return true;
    }
  }
  return false;
}

async function listUploadedPrivateVideoMetas(env, includeDrafts = false, includeArchived = false, options = {}) {
  const ids = options && options.reconcileIndex ? await reconcilePrivateVideoIndex(env) : await readPrivateVideoIndex(env);
  const metas = [];
  const staleIds = [];
  for (const id of ids) {
    const meta = await readUploadedPrivateVideoMeta(env, id);
    if (!meta) {
      staleIds.push(id);
      continue;
    }
    if (meta.status === 'archived' && !includeArchived) continue;
    if (!includeDrafts && meta.status !== 'published') continue;
    metas.push(meta);
  }
  if (staleIds.length) await removePrivateVideosFromIndex(env, staleIds);
  return metas.sort((a, b) => Date.parse(b.updatedAt || b.createdAt || '') - Date.parse(a.updatedAt || a.createdAt || ''));
}

async function addPrivateVideoToIndex(env, id) {
  const index = await readPrivateVideoIndex(env);
  if (!index.includes(id)) index.unshift(id);
  return writePrivateVideoIndex(env, index);
}

async function removePrivateVideosFromIndex(env, ids) {
  const deleteIds = new Set((Array.isArray(ids) ? ids : []).map(normalizePrivateVideoId).filter(Boolean));
  if (!deleteIds.size) return true;
  const index = await readPrivateVideoIndex(env);
  return writePrivateVideoIndex(env, index.filter((id) => !deleteIds.has(id)));
}

async function deleteUploadedPrivateVideoStorage(env, meta, options = {}) {
  const result = { kvChunks: 0, r2Chunks: 0, metas: 0, errors: [] };
  if (!meta || !meta.id) return result;
  const deleteMeta = async () => {
    if (result.metas > 0) return;
    let deleted = false;
    if (env.FM_AUDIT && typeof env.FM_AUDIT.delete === 'function') {
      try {
        await env.FM_AUDIT.delete(privateVideoMetaKey(meta.id));
        deleted = true;
      } catch (error) {
        result.errors.push(`meta:${meta.id}:${truncate(error && error.message ? error.message : error, 120)}`);
      }
    }
    if (env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.delete === 'function') {
      try {
        await env.FM_PRIVATE_MEDIA.delete(privateVideoMetaR2Key(meta.id));
        deleted = true;
      } catch (error) {
        result.errors.push(`meta-r2:${meta.id}:${truncate(error && error.message ? error.message : error, 120)}`);
      }
    }
    if (deleted) result.metas += 1;
  };
  if (options && options.metaFirst) await deleteMeta();
  const chunkCount = Math.max(0, Math.floor(Number(meta.chunks || 0) || 0));
  for (let index = 0; index < chunkCount; index += 1) {
    const kvKey = privateVideoUploadChunkKey(meta.id, index);
    if (env.FM_AUDIT && typeof env.FM_AUDIT.delete === 'function') {
      try {
        await env.FM_AUDIT.delete(kvKey);
        result.kvChunks += 1;
      } catch (error) {
        result.errors.push(`kv:${padChunkIndex(index)}:${truncate(error && error.message ? error.message : error, 120)}`);
      }
    }
    const r2Key = privateVideoR2ChunkKey(meta.id, index);
    if (env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.delete === 'function') {
      try {
        await env.FM_PRIVATE_MEDIA.delete(r2Key);
        result.r2Chunks += 1;
      } catch (error) {
        result.errors.push(`r2:${padChunkIndex(index)}:${truncate(error && error.message ? error.message : error, 120)}`);
      }
    } else if (uploadedChunkStore(meta, index) === 'r2') {
      result.errors.push(`r2:${padChunkIndex(index)}:delete_unavailable`);
    }
  }
  await deleteMeta();
  return result;
}

async function findPrivateCourseAssignmentConflict(env, courseId, assignedUser, exceptId = '') {
  const normalizedCourseId = normalizePrivateVideoId(courseId);
  const normalizedUser = normalizeUsername(assignedUser);
  const skipId = normalizePrivateVideoId(exceptId);
  if (!normalizedCourseId || !normalizedUser) return null;
  const metas = await listUploadedPrivateVideoMetas(env, true);
  for (const meta of metas) {
    if (!meta || meta.status === 'archived') continue;
    if (skipId && meta.id === skipId) continue;
    if (normalizePrivateVideoId(meta.courseId || meta.id) !== normalizedCourseId) continue;
    const users = normalizePrivateAssignedUsers(meta.assignedUsers || []);
    if (users.length === 1 && users[0] !== normalizedUser) return meta;
  }
  return null;
}

async function findPrivateCourseSegmentConflict(env, courseId, segmentIndex, exceptId = '') {
  const normalizedCourseId = normalizePrivateVideoId(courseId);
  const skipId = normalizePrivateVideoId(exceptId);
  const index = Math.max(0, Math.floor(Number(segmentIndex || 0) || 0));
  if (!normalizedCourseId) return null;
  const metas = await listUploadedPrivateVideoMetas(env, true);
  for (const meta of metas) {
    if (!meta || meta.status === 'archived') continue;
    if (skipId && meta.id === skipId) continue;
    if (normalizePrivateVideoId(meta.courseId || meta.id) !== normalizedCourseId) continue;
    if (Number(meta.segmentIndex || 0) === index) return meta;
  }
  return null;
}

async function findPrivateCourseShapeConflict(env, courseId, segmentCount, exceptId = '') {
  const normalizedCourseId = normalizePrivateVideoId(courseId);
  const skipId = normalizePrivateVideoId(exceptId);
  const count = Math.max(1, Math.floor(Number(segmentCount || 1) || 1));
  if (!normalizedCourseId) return null;
  const metas = await listUploadedPrivateVideoMetas(env, true);
  for (const meta of metas) {
    if (!meta || meta.status === 'archived') continue;
    if (skipId && meta.id === skipId) continue;
    if (normalizePrivateVideoId(meta.courseId || meta.id) !== normalizedCourseId) continue;
    if (Math.max(1, Math.floor(Number(meta.segmentCount || 1) || 1)) !== count) return meta;
  }
  return null;
}

function privateVideoUploadedChunkIndexes(meta) {
  return Array.from(new Set(Array.isArray(meta && meta.uploadedChunks)
    ? meta.uploadedChunks.map((index) => Math.floor(Number(index))).filter((index) => Number.isInteger(index) && index >= 0)
    : []
  )).sort((a, b) => a - b);
}

function privateVideoResumeConflict(meta, expected) {
  if (!meta) return '没有找到可续传的草稿。';
  if (String(meta.status || '').toLowerCase() !== 'uploading') return '这段视频已经发布或下架，不能作为续传草稿。';
  const existingUsers = normalizePrivateAssignedUsers(meta.assignedUsers || []);
  const expectedUsers = normalizePrivateAssignedUsers(expected.assignedUsers || []);
  if (existingUsers.join('\n') !== expectedUsers.join('\n')) return '草稿授权学生和当前选择不一致。';
  if (Number(meta.segmentCount || 1) !== Number(expected.segmentCount || 1)) return '草稿分段总数和当前选择不一致。';
  if (Number(meta.segmentIndex || 0) !== Number(expected.segmentIndex || 0)) return '草稿分段序号和当前选择不一致。';
  if (Number(meta.size || 0) !== Number(expected.size || 0)) return '草稿文件大小和当前选择不一致。';
  if (String(meta.fileName || '').trim() !== String(expected.fileName || '').trim()) return '草稿文件名和当前选择不一致。';
  const existingType = normalizePrivateVideoContentType(meta.contentType || 'video/mp4', meta.fileName || '');
  const expectedType = normalizePrivateVideoContentType(expected.contentType || 'video/mp4', expected.fileName || '');
  if (existingType !== expectedType) return '草稿视频格式和当前选择不一致。';
  return '';
}

function uploadedPrivateVideoMissingChunks(meta, limit = 10) {
  const uploaded = new Set(Array.isArray(meta && meta.uploadedChunks) ? meta.uploadedChunks.map(Number) : []);
  const missing = [];
  const chunks = Math.max(0, Math.floor(Number(meta && meta.chunks || 0) || 0));
  for (let index = 0; index < chunks; index += 1) {
    if (!uploaded.has(index)) missing.push(index);
    if (missing.length >= limit) break;
  }
  return missing;
}

function validatePrivateCourseSegmentsForPublish(courseMetas, assignedUsers) {
  const segments = (Array.isArray(courseMetas) ? courseMetas : [])
    .filter((meta) => meta && meta.status !== 'archived')
    .sort((a, b) => Number(a.segmentIndex || 0) - Number(b.segmentIndex || 0));
  if (!segments.length) {
    return { ok: false, status: 404, error: 'not_found', message: '没有找到这节专属课。' };
  }
  const expectedCount = Math.max(1, ...segments.map((meta) => Number(meta.segmentCount || 1) || 1), segments.length);
  const declaredCounts = new Set(segments.map((meta) => Math.max(1, Math.floor(Number(meta.segmentCount || 1) || 1))));
  if (declaredCounts.size > 1) {
    return {
      ok: false,
      status: 409,
      error: 'segment_count_conflict',
      message: '同一节课的所有分段总数必须一致。'
    };
  }
  const seenIndexes = new Set();
  const duplicateIndexes = [];
  for (const meta of segments) {
    const index = Math.max(0, Math.floor(Number(meta.segmentIndex || 0) || 0));
    if (seenIndexes.has(index)) duplicateIndexes.push(index);
    seenIndexes.add(index);
  }
  if (duplicateIndexes.length) {
    return {
      ok: false,
      status: 409,
      error: 'duplicate_segments',
      message: `同一节课里有重复分段：${duplicateIndexes.map((item) => item + 1).join(', ')}。`
    };
  }
  const missingSegments = [];
  for (let index = 0; index < expectedCount; index += 1) {
    if (!seenIndexes.has(index)) missingSegments.push(index);
  }
  if (missingSegments.length || segments.length !== expectedCount) {
    return {
      ok: false,
      status: 409,
      error: 'segments_missing',
      message: `还有视频段未上传：${missingSegments.map((item) => item + 1).join(', ') || '数量不完整'}。`,
      missingSegments
    };
  }
  const targetUsers = normalizePrivateAssignedUsers(assignedUsers && assignedUsers.length ? assignedUsers : segments.flatMap((meta) => meta.assignedUsers || []));
  const assignedError = oneOnOneAssignedUserError(targetUsers);
  if (assignedError) return { ok: false, status: 400, error: 'one_on_one_required', message: assignedError };
  for (const meta of segments) {
    const users = normalizePrivateAssignedUsers(meta.assignedUsers || []);
    if (users.length !== 1 || users[0] !== targetUsers[0]) {
      return {
        ok: false,
        status: 409,
        error: 'course_assignment_conflict',
        message: '同一节一对一专属课的所有分段必须指定同一个学生账号。'
      };
    }
    const missingChunks = uploadedPrivateVideoMissingChunks(meta);
    if (missingChunks.length) {
      return {
        ok: false,
        status: 409,
        error: 'chunks_missing',
        message: `第 ${Number(meta.segmentIndex || 0) + 1} 段还有分片未上传：${missingChunks.map((item) => padChunkIndex(item)).join(', ')}`,
        video: meta.id,
        missing: missingChunks
      };
    }
  }
  return { ok: true, segments, assignedUsers: targetUsers, expectedCount };
}

async function verifyUploadedPrivateVideoStorage(env, meta) {
  const missing = uploadedPrivateVideoMissingChunks(meta);
  if (missing.length) {
    return {
      ok: false,
      status: 409,
      error: 'chunks_missing',
      message: `第 ${Number(meta.segmentIndex || 0) + 1} 段还有分片未上传：${missing.map((item) => padChunkIndex(item)).join(', ')}`,
      video: meta.id,
      missing
    };
  }
  const chunks = Math.max(0, Math.floor(Number(meta.chunks || 0) || 0));
  const size = Math.max(0, Number(meta.size || 0) || 0);
  const chunkSize = Math.max(1, Number(meta.chunkSize || 0) || 1);
  for (let index = 0; index < chunks; index += 1) {
    const expectedSize = index === chunks - 1 ? size - chunkSize * (chunks - 1) : chunkSize;
    const key = padChunkIndex(index);
    const recordedSize = Number((meta.chunkBytes && (meta.chunkBytes[key] || meta.chunkBytes[String(index)])) || 0);
    if (recordedSize && expectedSize > 0 && recordedSize !== expectedSize) {
      return {
        ok: false,
        status: 409,
        error: 'chunk_size_mismatch',
        message: `第 ${Number(meta.segmentIndex || 0) + 1} 段的分片 ${key} 大小记录不一致。`,
        video: meta.id,
        chunk: index
      };
    }
    const store = uploadedChunkStore(meta, index);
    if (store === 'r2' && env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.head === 'function') {
      const object = await env.FM_PRIVATE_MEDIA.head(privateVideoR2ChunkKey(meta.id, index));
      if (object) {
        const objectSize = Number(object.size || 0);
        if (expectedSize > 0 && objectSize !== expectedSize) {
          return {
            ok: false,
            status: 409,
            error: 'chunk_size_mismatch',
            message: `第 ${Number(meta.segmentIndex || 0) + 1} 段的分片 ${key} 存储大小不一致。`,
            video: meta.id,
            chunk: index
          };
        }
        continue;
      }
    }
    if (!env.FM_AUDIT) {
      return { ok: false, status: 503, error: 'storage_not_configured', message: '私有视频分片存储暂时不可用。', video: meta.id, chunk: index };
    }
    const buffer = await getKvArrayBuffer(env.FM_AUDIT, privateVideoUploadChunkKey(meta.id, index));
    if (!buffer) {
      return {
        ok: false,
        status: 409,
        error: 'chunk_storage_missing',
        message: `第 ${Number(meta.segmentIndex || 0) + 1} 段的分片 ${key} 存储缺失，请重新上传这一节课。`,
        video: meta.id,
        chunk: index
      };
    }
    if (expectedSize > 0 && buffer.byteLength !== expectedSize) {
      return {
        ok: false,
        status: 409,
        error: 'chunk_size_mismatch',
        message: `第 ${Number(meta.segmentIndex || 0) + 1} 段的分片 ${key} 存储大小不一致。`,
        video: meta.id,
        chunk: index
      };
    }
  }
  return { ok: true };
}

function validatePublishedPrivateCourseGroup(courseMetas) {
  const validation = validatePrivateCourseSegmentsForPublish(courseMetas, []);
  if (!validation.ok) return false;
  return validation.segments.every((meta) => meta.status === 'published');
}

async function privateCourseIsPublishedComplete(env, meta) {
  const normalizedCourseId = normalizePrivateVideoId(meta && (meta.courseId || meta.id));
  if (!normalizedCourseId || !meta || meta.status !== 'published') return false;
  if (Number(meta.segmentCount || 1) <= 1) return uploadedPrivateVideoMissingChunks(meta, 1).length === 0;
  const metas = await listUploadedPrivateVideoMetas(env, true);
  const courseMetas = metas.filter((item) => normalizePrivateVideoId(item.courseId || item.id) === normalizedCourseId);
  return validatePublishedPrivateCourseGroup(courseMetas);
}

async function userCanViewPrivateVideo(session, env, videoOrId, options = {}) {
  if (!session || !session.username) return false;
  if (isAdmin(session, env)) return true;
  const username = normalizeUsername(session.username);
  const id = typeof videoOrId === 'string' ? normalizePrivateVideoId(videoOrId) : normalizePrivateVideoId(videoOrId && videoOrId.id);
  if (!id) return false;
  if (id === PRIVATE_QI_VIDEO_ID) return userCanViewPrivateQiVideo(session, env);
  const meta = typeof videoOrId === 'object' ? normalizeUploadedPrivateVideoMeta(videoOrId) : await readUploadedPrivateVideoMeta(env, id);
  if (!meta || meta.status !== 'published') return false;
  if (!options.assumePublishedComplete && !await privateCourseIsPublishedComplete(env, meta)) return false;
  const account = await readUserAccount(env, username);
  if (account && account.disabled) return false;
  const access = await studentAccessStatus(env, username);
  if (!access.ok) return false;
  return Array.isArray(meta.assignedUsers) && meta.assignedUsers.includes(username);
}

async function privateVideoItems(session, env) {
  if (!session) return [];
  const items = [];
  if (await userCanViewPrivateQiVideo(session, env)) items.push(qiPrivateVideoItem());
  const metas = await listUploadedPrivateVideoMetas(env, false);
  const groups = new Map();
  for (const meta of metas) {
    if (!await userCanViewPrivateVideo(session, env, meta)) continue;
    const groupId = normalizePrivateVideoId(meta.courseId || meta.id);
    if (!groups.has(groupId)) groups.set(groupId, []);
    groups.get(groupId).push(meta);
  }
  for (const groupMetas of groups.values()) {
    if (!validatePublishedPrivateCourseGroup(groupMetas)) continue;
    items.push(privateVideoItemFromGroup(groupMetas));
  }
  return items;
}

function mediaRangeHeaders(object, rangeHeader) {
  const size = Number(object && object.size || 0);
  const contentType = object && object.httpMetadata && object.httpMetadata.contentType
    ? object.httpMetadata.contentType
    : 'video/mp4';
  const headers = privateVideoResponseHeaders({ size, contentType }, 'r2', { size, contentType });
  if (!size) {
    return { headers, options: {}, status: 200 };
  }

  const requested = parseMediaRange(size, rangeHeader, PRIVATE_QI_VIDEO_STATIC_MAX_RESPONSE_BYTES);
  if (!requested) {
    headers.set('Content-Range', `bytes */${size}`);
    return { headers, options: {}, status: 416 };
  }
  const length = requested.end - requested.start + 1;
  headers.set('Content-Range', `bytes ${requested.start}-${requested.end}/${size}`);
  headers.set('Content-Length', String(length));
  return { headers, options: { range: { offset: requested.start, length } }, status: 206 };
}

function privateVideoChunkKey(index) {
  return `${PRIVATE_QI_VIDEO_KV_CHUNK_PREFIX}${String(index).padStart(4, '0')}`;
}

async function readPrivateVideoKvMeta(env) {
  const meta = await readJsonKv(env.FM_AUDIT, PRIVATE_QI_VIDEO_KV_META_KEY, null);
  if (!meta || !Number.isFinite(Number(meta.size)) || !Number.isFinite(Number(meta.chunkSize)) || !Number.isFinite(Number(meta.chunks))) return null;
  return {
    size: Number(meta.size),
    chunkSize: Number(meta.chunkSize),
    chunks: Number(meta.chunks),
    contentType: meta.contentType || 'video/mp4',
    updatedAt: meta.updatedAt || ''
  };
}

function parseMediaRange(size, rangeHeader, maxResponseBytes = PRIVATE_QI_VIDEO_STATIC_MAX_RESPONSE_BYTES) {
  if (!size || size <= 0) return null;
  if (!rangeHeader) return { start: 0, end: Math.min(Math.max(0, size - 1), maxResponseBytes - 1), status: 206, capped: true };
  if (!/^bytes=\d*-\d*$/i.test(rangeHeader) || !size) return null;
  let [startText, endText] = rangeHeader.replace(/bytes=/i, '').split('-');
  let start = startText ? Number(startText) : 0;
  let end = endText ? Number(endText) : size - 1;
  if (startText && endText && start > end) return null;
  if (!startText && endText) {
    const suffix = Math.max(0, Number(endText));
    start = Math.max(0, size - suffix);
    end = size - 1;
  }
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= size) return null;
  start = Math.max(0, Math.min(size - 1, start));
  end = Math.max(start, Math.min(size - 1, end));
  if (!endText) {
    end = Math.min(end, start + maxResponseBytes - 1);
  } else if (end - start + 1 > maxResponseBytes) {
    end = Math.min(size - 1, start + maxResponseBytes - 1);
  }
  return { start, end, status: 206 };
}

async function getKvArrayBuffer(namespace, key) {
  try {
    return await namespace.get(key, 'arrayBuffer');
  } catch (_) {
    return namespace.get(key, { type: 'arrayBuffer' });
  }
}

async function fetchAssetResponse(env, request, pathname) {
  if (!env || !env.ASSETS || typeof env.ASSETS.fetch !== 'function') return null;
  const url = new URL(request.url);
  url.pathname = pathname;
  url.search = '';
  const assetRequest = new Request(url.toString(), { method: 'GET' });
  try {
    const response = await env.ASSETS.fetch(assetRequest);
    if (!response || !response.ok) return null;
    const contentType = response.headers.get('Content-Type') || '';
    const normalized = normalizePathname(pathname).toLowerCase();
    if (contentType.includes('text/html') && !normalized.endsWith('.html')) return null;
    return response;
  } catch (_) {
    return null;
  }
}

function isGzipStaticAssetPath(pathname) {
  const normalized = normalizePathname(pathname).toLowerCase();
  return (
    (normalized.endsWith('.json') || normalized.endsWith('.js') || normalized.endsWith('.mjs')) &&
    GZIP_ASSET_PREFIXES.some((prefix) => normalized.startsWith(prefix))
  );
}

function requestAcceptsEncoding(request, encoding) {
  const wanted = String(encoding || '').trim().toLowerCase();
  if (!wanted) return false;
  const header = String(request.headers.get('Accept-Encoding') || '').toLowerCase();
  if (!header) return false;
  return header.split(',').some((entry) => {
    const [token, ...params] = entry.split(';').map((part) => part.trim());
    if (token !== wanted && token !== '*') return false;
    const qParam = params.find((param) => param.startsWith('q='));
    if (!qParam) return true;
    const q = Number(qParam.slice(2));
    return Number.isFinite(q) && q > 0;
  });
}

function appendVary(current, value) {
  const items = String(current || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const lower = new Set(items.map((item) => item.toLowerCase()));
  if (!lower.has(String(value).toLowerCase())) items.push(value);
  return items.join(', ') || value;
}

function gzipAssetContentType(pathname) {
  const normalized = normalizePathname(pathname).toLowerCase();
  if (normalized.endsWith('.json')) return 'application/json; charset=utf-8';
  if (normalized.endsWith('.mjs') || normalized.endsWith('.js')) return 'application/javascript; charset=utf-8';
  return 'application/octet-stream';
}

function isStrictStaticAssetPath(pathname) {
  const normalized = normalizePathname(pathname).toLowerCase();
  return /\.(?:js|mjs|css|json|map|png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|otf|eot|wasm|pdf|mp4|mov|m4v|webm)$/i.test(normalized);
}

function isPublicRuntimeAssetPath(pathname) {
  const normalized = normalizePathname(pathname).toLowerCase();
  if (!isStrictStaticAssetPath(normalized)) return false;
  if (isSensitiveLegacyPath(normalized) || isProtectedSourceDownload(normalized)) return false;
  return PUBLIC_RUNTIME_ASSET_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function isTeacherHtmlRoute(pathname) {
  const normalized = normalizePathname(pathname).toLowerCase().replace(/\/+$/, '') || '/';
  const canonical = canonicalRoutePath(normalized) || normalized;
  return normalized === '/_edge-admin' ||
    normalized === '/private-video' ||
    normalized === '/private-video.html' ||
    normalized === '/teacher-panel' ||
    normalized === '/teacher-panel.html' ||
    /^\/teacher-[^/]+(?:\.html)?$/.test(normalized) ||
    /^\/modules\/teacher-[^/]+(?:\.html)?$/.test(normalized) ||
    canonical === '/modules/teacher-panel' ||
    /^\/teacher-[^/]+\.html$/.test(canonical) ||
    /^\/modules\/teacher-[^/]+\.html$/.test(canonical);
}

function staticAssetNotFoundResponse(pathname) {
  return new Response('Static asset not found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Fluid-Asset-Fallback': 'html-rejected',
      'X-Fluid-Asset-Path': truncate(normalizePathname(pathname), 160)
    }
  });
}

async function publicRuntimeAssetResponse(context, assetPathOverride = '') {
  const { request } = context;
  const url = new URL(request.url);
  const assetPath = assetPathOverride || url.pathname;
  const normalizedAssetPath = normalizePathname(assetPath).toLowerCase();
  let response = await gzipStaticAssetResponse(context.env, request, assetPath);
  if (!response) response = await fetchAssetResponse(context.env, request, assetPath);
  if (!response) response = await context.next();

  const headers = new Headers(response.headers);
  const contentType = headers.get('Content-Type') || '';
  if (contentType.includes('text/html') && isStrictStaticAssetPath(normalizedAssetPath)) {
    return staticAssetNotFoundResponse(normalizedAssetPath);
  }
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Origin-Agent-Cluster', '?1');
  if (!headers.get('Content-Type') && normalizedAssetPath.endsWith('.js')) {
    headers.set('Content-Type', 'application/javascript; charset=utf-8');
  }
  if (!headers.get('Content-Type') && normalizedAssetPath.endsWith('.css')) {
    headers.set('Content-Type', 'text/css; charset=utf-8');
  }
  headers.set('Cache-Control', cacheControlForAsset(assetPath, headers.get('Content-Type') || ''));
  headers.delete('Pragma');
  headers.delete('Expires');
  if (request.method === 'HEAD') {
    headers.delete('Content-Length');
    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function gzipStaticAssetResponse(env, request, pathname) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  if (!isGzipStaticAssetPath(pathname)) return null;
  if (isSensitiveLegacyPath(pathname)) return null;
  const gzipPath = `${normalizePathname(pathname)}.gz`;
  const response = await fetchAssetResponse(env, request, gzipPath);
  if (!response) return null;
  const headers = new Headers(response.headers);
  headers.set('Content-Type', gzipAssetContentType(pathname));
  headers.delete('Content-Encoding');
  headers.delete('Content-Length');
  headers.set('Vary', appendVary(headers.get('Vary'), 'Accept-Encoding'));
  headers.set('X-Fluid-Asset-Sidecar', 'gzip');
  headers.set('X-Fluid-Asset-Encoding', 'gzip-static-decoded');
  if (request.method === 'HEAD') {
    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
  if (!response.body || typeof DecompressionStream !== 'function') return null;
  const decoded = response.body.pipeThrough(new DecompressionStream('gzip'));
  return new Response(decoded, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function privateVideoUnavailableResponse(request, error = 'media_missing') {
  const publicError = String(error || '') === 'media_missing' ? 'media_missing' : 'media_unavailable';
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Private-Video-Status': 'unavailable'
  };
  if (request && request.method === 'HEAD') {
    return new Response(null, { status: 404, headers });
  }
  return jsonResponse({
    ok: false,
    error: publicError,
    message: '视频文件暂时不可用，请稍后重试。'
  }, { status: 404, headers });
}

async function readPrivateVideoStaticManifest(env, request) {
  const response = await fetchAssetResponse(env, request, PRIVATE_QI_VIDEO_STATIC_MANIFEST_PATH);
  if (!response) return null;
  let manifest = null;
  try {
    manifest = await response.json();
  } catch (_) {
    return null;
  }
  if (!manifest || !Number.isFinite(Number(manifest.size)) || !Number.isFinite(Number(manifest.chunkSize)) || !Number.isFinite(Number(manifest.chunks))) return null;
  return {
    size: Number(manifest.size),
    chunkSize: Number(manifest.chunkSize),
    chunks: Number(manifest.chunks),
    contentType: manifest.contentType || 'video/mp4',
    updatedAt: manifest.updatedAt || '',
    source: manifest.source || 'static'
  };
}

async function getPrivateVideoStaticChunk(env, request, index) {
  const chunkPath = `${PRIVATE_QI_VIDEO_STATIC_CHUNK_PREFIX}${String(index).padStart(4, '0')}.bin`;
  const response = await fetchAssetResponse(env, request, chunkPath);
  if (!response) return null;
  return response.arrayBuffer();
}

async function safePrivateR2Head(env, key) {
  if (!env.FM_PRIVATE_MEDIA || typeof env.FM_PRIVATE_MEDIA.head !== 'function') return null;
  try {
    return await env.FM_PRIVATE_MEDIA.head(key);
  } catch (_) {
    return null;
  }
}

async function safePrivateR2Get(env, key, options) {
  if (!env.FM_PRIVATE_MEDIA || typeof env.FM_PRIVATE_MEDIA.get !== 'function') return null;
  try {
    return await env.FM_PRIVATE_MEDIA.get(key, options);
  } catch (_) {
    return null;
  }
}

function privateVideoContentType(value) {
  const raw = String(value || '').trim().toLowerCase().slice(0, 120);
  if (raw.startsWith('video/')) return raw;
  if (raw === 'application/octet-stream') return raw;
  return 'video/mp4';
}

function privateVideoResponseHeaders(meta, store, extra = {}) {
  const headers = new Headers({
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Content-Type': privateVideoContentType(extra.contentType || (meta && meta.contentType)),
    'Content-Disposition': 'inline',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Origin-Agent-Cluster': '?1',
    'Vary': 'Cookie, Range',
    'X-Private-Video-Store': store,
    'X-Private-Video-Size': String(Number((meta && meta.size) || 0) || 0),
    'X-Private-Video-Chunk-Size': String(Number((meta && meta.chunkSize) || 0) || 0),
    'X-Private-Video-Chunk-Count': String(Number((meta && meta.chunks) || 0) || 0),
    'X-Private-Video-Updated-At': (meta && meta.updatedAt) || ''
  });
  if (extra.size) headers.set('X-Private-Video-Size', String(Number(extra.size || 0) || 0));
  if (extra.chunkSize) headers.set('X-Private-Video-Chunk-Size', String(Number(extra.chunkSize || 0) || 0));
  if (extra.chunks) headers.set('X-Private-Video-Chunk-Count', String(Number(extra.chunks || 0) || 0));
  if (extra.updatedAt) headers.set('X-Private-Video-Updated-At', String(extra.updatedAt));
  return headers;
}

function privateVideoRangeChunkIndices(meta, start, end) {
  const firstChunkIndex = Math.floor(start / meta.chunkSize);
  const lastChunkIndex = Math.floor(end / meta.chunkSize);
  const indices = [];
  for (let index = firstChunkIndex; index <= lastChunkIndex && index < meta.chunks; index += 1) {
    if (index >= 0) indices.push(index);
  }
  return indices;
}

async function prefetchPrivateVideoRangeChunks(meta, start, end, readChunk) {
  const chunks = new Map();
  for (const index of privateVideoRangeChunkIndices(meta, start, end)) {
    const buffer = await readChunk(index);
    if (!buffer) return null;
    chunks.set(index, buffer);
  }
  return chunks;
}

function prefetchedPrivateVideoChunk(chunks, index) {
  return chunks && typeof chunks.get === 'function' && chunks.has(index) ? chunks.get(index) : null;
}

function privateVideoKvStream(env, meta, start, end, prefetchedChunks = null) {
  let offset = start;
  return new ReadableStream({
    async pull(controller) {
      if (offset > end) {
        controller.close();
        return;
      }
      const chunkIndex = Math.floor(offset / meta.chunkSize);
      if (chunkIndex < 0 || chunkIndex >= meta.chunks) {
        controller.error(new Error('video_chunk_out_of_range'));
        return;
      }
      const chunkStart = chunkIndex * meta.chunkSize;
      const prefetched = prefetchedPrivateVideoChunk(prefetchedChunks, chunkIndex);
      const chunkBuffer = prefetched || await getKvArrayBuffer(env.FM_AUDIT, privateVideoChunkKey(chunkIndex));
      if (!chunkBuffer) {
        controller.error(new Error('video_chunk_missing'));
        return;
      }
      const view = new Uint8Array(chunkBuffer);
      const sliceStart = Math.max(0, offset - chunkStart);
      const sliceEnd = Math.min(view.byteLength, end - chunkStart + 1);
      controller.enqueue(view.slice(sliceStart, sliceEnd));
      offset = chunkStart + sliceEnd;
    }
  });
}

async function privateVideoKvResponse(env, request) {
  const meta = await readPrivateVideoKvMeta(env);
  if (!meta) return null;
  const range = parseMediaRange(meta.size, request.headers.get('Range'), PRIVATE_QI_VIDEO_STATIC_MAX_RESPONSE_BYTES);
  const headers = privateVideoResponseHeaders(meta, 'kv', { contentType: meta.contentType });
  if (!range) {
    headers.set('Content-Range', `bytes */${meta.size}`);
    return new Response(null, { status: 416, headers });
  }
  const length = range.end - range.start + 1;
  headers.set('Content-Length', String(length));
  if (range.status === 206) headers.set('Content-Range', `bytes ${range.start}-${range.end}/${meta.size}`);
  const prefetchedChunks = await prefetchPrivateVideoRangeChunks(
    meta,
    range.start,
    range.end,
    (index) => getKvArrayBuffer(env.FM_AUDIT, privateVideoChunkKey(index))
  );
  if (!prefetchedChunks) return null;
  if (request.method === 'HEAD') return new Response(null, { status: range.status, headers });
  const body = privateVideoKvStream(env, meta, range.start, range.end, prefetchedChunks);
  return new Response(body, { status: range.status, headers });
}

async function privateVideoStaticResponse(env, request) {
  const meta = await readPrivateVideoStaticManifest(env, request);
  if (!meta) return null;
  const range = parseMediaRange(meta.size, request.headers.get('Range'), PRIVATE_QI_VIDEO_STATIC_MAX_RESPONSE_BYTES);
  const headers = privateVideoResponseHeaders(meta, 'static', { contentType: meta.contentType });
  if (!range) {
    headers.set('Content-Range', `bytes */${meta.size}`);
    return new Response(null, { status: 416, headers });
  }
  const length = range.end - range.start + 1;
  headers.set('Content-Length', String(length));
  if (range.status === 206) headers.set('Content-Range', `bytes ${range.start}-${range.end}/${meta.size}`);
  const prefetchedChunks = await prefetchPrivateVideoRangeChunks(
    meta,
    range.start,
    range.end,
    (index) => getPrivateVideoStaticChunk(env, request, index)
  );
  if (!prefetchedChunks) return null;
  if (request.method === 'HEAD') {
    return new Response(null, { status: range.status, headers });
  }
  let offset = range.start;
  const body = new ReadableStream({
    async pull(controller) {
      if (offset > range.end) {
        controller.close();
        return;
      }
      const chunkIndex = Math.floor(offset / meta.chunkSize);
      if (chunkIndex < 0 || chunkIndex >= meta.chunks) {
        controller.error(new Error('video_chunk_out_of_range'));
        return;
      }
      const chunkStart = chunkIndex * meta.chunkSize;
      const prefetched = prefetchedPrivateVideoChunk(prefetchedChunks, chunkIndex);
      const chunkBuffer = prefetched || await getPrivateVideoStaticChunk(env, request, chunkIndex);
      if (!chunkBuffer) {
        controller.error(new Error('video_chunk_missing'));
        return;
      }
      const view = new Uint8Array(chunkBuffer);
      const sliceStart = Math.max(0, offset - chunkStart);
      const sliceEnd = Math.min(view.byteLength, range.end - chunkStart + 1);
      controller.enqueue(view.slice(sliceStart, sliceEnd));
      offset = chunkStart + sliceEnd;
    }
  });
  return new Response(body, { status: range.status, headers });
}

function uploadedChunkStore(meta, index) {
  const key = padChunkIndex(index);
  const store = meta && meta.chunkStores && (meta.chunkStores[key] || meta.chunkStores[String(index)]);
  return store === 'r2' ? 'r2' : 'kv';
}

async function getUploadedPrivateVideoChunk(env, meta, index) {
  const store = uploadedChunkStore(meta, index);
  if (store === 'r2' && env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.get === 'function') {
    const object = await env.FM_PRIVATE_MEDIA.get(privateVideoR2ChunkKey(meta.id, index));
    if (object) return object.arrayBuffer();
  }
  return getKvArrayBuffer(env.FM_AUDIT, privateVideoUploadChunkKey(meta.id, index));
}

function privateVideoUploadedStream(env, meta, start, end, prefetchedChunks = null) {
  let offset = start;
  return new ReadableStream({
    async pull(controller) {
      if (offset > end) {
        controller.close();
        return;
      }
      const chunkIndex = Math.floor(offset / meta.chunkSize);
      if (chunkIndex < 0 || chunkIndex >= meta.chunks) {
        controller.error(new Error('uploaded_video_chunk_out_of_range'));
        return;
      }
      const chunkStart = chunkIndex * meta.chunkSize;
      const prefetched = prefetchedPrivateVideoChunk(prefetchedChunks, chunkIndex);
      const chunkBuffer = prefetched || await getUploadedPrivateVideoChunk(env, meta, chunkIndex);
      if (!chunkBuffer) {
        controller.error(new Error('uploaded_video_chunk_missing'));
        return;
      }
      const view = new Uint8Array(chunkBuffer);
      const sliceStart = Math.max(0, offset - chunkStart);
      const sliceEnd = Math.min(view.byteLength, end - chunkStart + 1);
      controller.enqueue(view.slice(sliceStart, sliceEnd));
      offset = chunkStart + sliceEnd;
    }
  });
}

async function privateVideoUploadedResponse(env, request, meta) {
  const range = parseMediaRange(meta.size, request.headers.get('Range'), PRIVATE_QI_VIDEO_STATIC_MAX_RESPONSE_BYTES);
  const headers = privateVideoResponseHeaders(meta, 'teacher-upload', { contentType: meta.contentType || 'video/mp4' });
  if (!range) {
    headers.set('Content-Range', `bytes */${meta.size}`);
    return new Response(null, { status: 416, headers });
  }
  const length = range.end - range.start + 1;
  headers.set('Content-Length', String(length));
  if (range.status === 206) headers.set('Content-Range', `bytes ${range.start}-${range.end}/${meta.size}`);
  const prefetchedChunks = await prefetchPrivateVideoRangeChunks(
    meta,
    range.start,
    range.end,
    (index) => getUploadedPrivateVideoChunk(env, meta, index)
  );
  if (!prefetchedChunks) {
    return privateVideoUnavailableResponse(request);
  }
  if (request.method === 'HEAD') {
    return new Response(null, { status: range.status, headers });
  }
  const body = privateVideoUploadedStream(env, meta, range.start, range.end, prefetchedChunks);
  return new Response(body, { status: range.status, headers });
}

async function putUploadedPrivateVideoChunk(env, id, index, buffer, contentType) {
  let r2Error = '';
  if (env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function') {
    try {
      await env.FM_PRIVATE_MEDIA.put(privateVideoR2ChunkKey(id, index), buffer, {
        httpMetadata: { contentType: contentType || 'application/octet-stream' }
      });
      return { store: 'r2', r2Error };
    } catch (error) {
      r2Error = truncate(error && error.message ? error.message : error, 180);
    }
  }
  if (!env.FM_AUDIT) throw new Error('video_storage_not_configured');
  const kvKey = privateVideoUploadChunkKey(id, index);
  try {
    await env.FM_AUDIT.put(kvKey, buffer);
  } catch (error) {
    if (isKvPutDailyLimitError(error)) {
      let existing = null;
      try {
        existing = await getKvArrayBuffer(env.FM_AUDIT, kvKey);
      } catch (_) {
        existing = null;
      }
      if (existing && existing.byteLength === buffer.byteLength) {
        return { store: 'kv', r2Error, reused: true, quotaRecovered: true };
      }
      const quotaError = new Error('kv_daily_limit_exceeded');
      quotaError.code = 'kv_daily_limit_exceeded';
      quotaError.status = 429;
      quotaError.publicMessage = 'KV 当日写入额度已满，当前分片还没写进去。请稍后重试，或联系我启用 R2 专用上传。';
      quotaError.retryAfterSeconds = 3600;
      quotaError.storage = 'kv';
      quotaError.r2Error = r2Error;
      quotaError.originalMessage = truncate(error && error.message ? error.message : error, 180);
      throw quotaError;
    }
    throw error;
  }
  return { store: 'kv', r2Error };
}

async function handlePrivateVideos(context, session) {
  const { request, env } = context;
  if (!session) return jsonResponse({ ok: false, error: 'authentication_required' }, { status: 401 });
  const devicePolicy = await enforceSessionDevicePolicy(context, session, 'private_video');
  if (!devicePolicy.ok) {
    return jsonResponse({ ok: false, error: devicePolicy.error, message: devicePolicy.message }, {
      status: 409,
      headers: { 'Set-Cookie': clearSessionHeader() }
    });
  }
  if (!await userHasSiteAccess(session, env)) {
    return jsonResponse({ ok: false, error: 'payment_required', message: '账号未开通，请联系网站所有人购买。' }, { status: 402 });
  }

  const url = new URL(request.url);
  if (url.pathname === '/api/private-videos') {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return jsonResponse({ ok: false, error: 'method_not_allowed', message: 'Use GET or HEAD for private video listings.' }, {
        status: 405,
        headers: { Allow: 'GET, HEAD' }
      });
    }
    const videos = await privateVideoItems(session, env);
    queueAudit(context, 'private_video_list', { count: videos.length, method: request.method }, session);
    if (request.method === 'HEAD') {
      return new Response(null, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Referrer-Policy': 'no-referrer',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Origin-Agent-Cluster': '?1',
          'Vary': 'Cookie'
        }
      });
    }
    return jsonResponse({ ok: true, videos });
  }

  const match = url.pathname.match(/^\/api\/private-videos\/([^/]+)\/(status|stream)$/);
  if (match) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return jsonResponse({ ok: false, error: 'method_not_allowed', message: 'Use GET or HEAD for private video status and stream endpoints.' }, {
        status: 405,
        headers: { Allow: 'GET, HEAD' }
      });
    }
    const videoId = normalizePrivateVideoId(decodeURIComponent(match[1]));
    const action = match[2];
    if (!videoId) return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });

    if (videoId === PRIVATE_QI_VIDEO_ID) {
      if (!await userCanViewPrivateQiVideo(session, env)) {
        queueAudit(context, 'private_video_denied', { video: videoId, view: action }, session);
        return jsonResponse({ ok: false, error: 'forbidden' }, { status: 403 });
      }
      if (action === 'status') {
        const r2Head = await safePrivateR2Head(env, PRIVATE_QI_VIDEO_KEY);
        const kvMeta = await readPrivateVideoKvMeta(env);
        const staticMeta = await readPrivateVideoStaticManifest(env, request);
        return jsonResponse({
          ok: true,
          video: PRIVATE_QI_VIDEO_ID,
          sources: {
            r2: !!r2Head,
            kv: !!kvMeta,
            static: !!staticMeta
          },
          details: {
            r2Size: r2Head ? Number(r2Head.size || 0) : 0,
            kvSize: kvMeta ? kvMeta.size : 0,
            staticSize: staticMeta ? staticMeta.size : 0,
            staticChunks: staticMeta ? staticMeta.chunks : 0,
            staticChunkSize: staticMeta ? staticMeta.chunkSize : 0
          }
        });
      }
      if (env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.get === 'function') {
        const head = await safePrivateR2Head(env, PRIVATE_QI_VIDEO_KEY);
        if (head) {
          const range = mediaRangeHeaders(head, request.headers.get('Range'));
          if (range.status === 416) {
            queueAudit(context, 'private_video_stream', { video: videoId, range: request.headers.get('Range') || '', store: 'r2', status: 416 }, session);
            return new Response(null, { status: 416, headers: range.headers });
          }
          const object = await safePrivateR2Get(env, PRIVATE_QI_VIDEO_KEY, range.options);
          const body = request.method === 'HEAD'
            ? null
            : (object && object.body ? object.body : (object && typeof object.arrayBuffer === 'function' ? await object.arrayBuffer() : null));
          if (object && (request.method === 'HEAD' || body)) {
            range.headers.set('Content-Disposition', 'inline');
            range.headers.set('X-Private-Video-Store', 'r2');
            range.headers.set('X-Private-Video-Size', String(Number(head.size || 0)));
            queueAudit(context, 'private_video_stream', { video: videoId, range: request.headers.get('Range') || '', store: 'r2', status: range.status }, session);
            return new Response(body, {
              status: range.status,
              headers: range.headers
            });
          }
        }
      }
      const kvResponse = await privateVideoKvResponse(env, request);
      if (kvResponse) {
        queueAudit(context, 'private_video_stream', { video: videoId, range: request.headers.get('Range') || '', store: 'kv' }, session);
        return kvResponse;
      }
      const staticResponse = await privateVideoStaticResponse(env, request);
      if (staticResponse) {
        queueAudit(context, 'private_video_stream', { video: videoId, range: request.headers.get('Range') || '', store: 'static' }, session);
        return staticResponse;
      }
      queueAudit(context, 'private_video_missing', { video: videoId, view: action }, session);
      return privateVideoUnavailableResponse(request);
    }

    const meta = await readUploadedPrivateVideoMeta(env, videoId);
    if (!meta || meta.status === 'archived') return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
    const coursePublishedComplete = isAdmin(session, env) ? true : await privateCourseIsPublishedComplete(env, meta);
    if (!isAdmin(session, env) && !coursePublishedComplete) {
      queueAudit(context, 'private_video_denied', { video: videoId, view: action, reason: 'course_not_published' }, session);
      return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
    }
    if (!await userCanViewPrivateVideo(session, env, meta, { assumePublishedComplete: coursePublishedComplete })) {
      queueAudit(context, 'private_video_denied', { video: videoId, view: action }, session);
      return jsonResponse({ ok: false, error: 'forbidden' }, { status: 403 });
    }
    if (action === 'status') {
      const chunkStores = meta.chunkStores || {};
      const uploadedChunkTotal = Array.isArray(meta.uploadedChunks) ? meta.uploadedChunks.length : 0;
      const uploadedChunks = Array.isArray(meta.uploadedChunks) ? meta.uploadedChunks.slice(0, 20) : [];
      return jsonResponse({
        ok: true,
        video: videoId,
        meta: {
          id: meta.id,
          title: meta.title,
          description: meta.description,
          contentType: meta.contentType,
          size: meta.size,
          chunkSize: meta.chunkSize,
          chunks: meta.chunks,
          status: meta.status,
          storage: meta.storage,
          uploadedBytes: Number(meta.uploadedBytes || 0),
          uploadedChunkCount: uploadedChunkTotal,
          uploadedChunks,
          courseId: meta.courseId || meta.id,
          courseTitle: meta.courseTitle || meta.title,
          segmentTitle: meta.segmentTitle || meta.title,
          segmentIndex: Number(meta.segmentIndex || 0),
          segmentCount: Number(meta.segmentCount || 1),
          assignedUsers: isAdmin(session, env) ? (meta.assignedUsers || []) : [],
          entitlements: isAdmin(session, env) ? (meta.entitlements || []) : [],
          updatedAt: meta.updatedAt || '',
          publishedAt: meta.publishedAt || '',
          createdAt: meta.createdAt || ''
        },
        sources: {
          r2: !!env.FM_PRIVATE_MEDIA,
          kv: !!env.FM_AUDIT
        },
        details: {
          chunkStores,
          uploadedChunksTotal: uploadedChunkTotal,
          storage: meta.storage
        }
      });
    }
    const response = await privateVideoUploadedResponse(env, request, meta);
    queueAudit(context, 'private_video_stream', {
      video: videoId,
      range: request.headers.get('Range') || '',
      store: 'uploaded',
      status: response.status
    }, session);
    return response;
  }

  return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
}

function adminVideoSummary(meta) {
  const uploadedCount = Array.isArray(meta.uploadedChunks) ? meta.uploadedChunks.length : 0;
  const uploadedBytes = Number(meta.uploadedBytes || 0);
  return {
    id: meta.id,
    title: meta.title,
    description: meta.description || '',
    fileName: meta.fileName || '',
    contentType: normalizePrivateVideoContentType(meta.contentType, meta.fileName) || 'video/mp4',
    size: meta.size,
    chunkSize: meta.chunkSize,
    chunks: meta.chunks,
    uploadedChunks: uploadedCount,
    uploadedBytes,
    progress: meta.chunks > 0 ? Math.round((uploadedCount / meta.chunks) * 100) : 0,
    status: meta.status,
    storage: meta.storage || 'kv',
    courseId: meta.courseId || meta.id,
    courseTitle: meta.courseTitle || meta.title || '',
    segmentTitle: meta.segmentTitle || meta.title || '',
    segmentIndex: Number(meta.segmentIndex || 0),
    segmentCount: Number(meta.segmentCount || 1),
    assignedUsers: meta.assignedUsers || [],
    entitlements: meta.entitlements || [],
    createdAt: meta.createdAt || '',
    updatedAt: meta.updatedAt || '',
    publishedAt: meta.publishedAt || '',
    createdBy: meta.createdBy || '',
    url: `/api/private-videos/${encodeURIComponent(meta.id)}/stream`
  };
}

function groupPrivateVideoMetasByCourse(metas) {
  const groups = new Map();
  for (const meta of Array.isArray(metas) ? metas : []) {
    if (!meta) continue;
    const courseId = normalizePrivateVideoId(meta.courseId || meta.id);
    if (!courseId) continue;
    if (!groups.has(courseId)) groups.set(courseId, []);
    groups.get(courseId).push(meta);
  }
  return groups;
}

function adminPrivateCourseSummary(metas) {
  const segments = (Array.isArray(metas) ? metas : [])
    .filter(Boolean)
    .sort((a, b) => Number(a.segmentIndex || 0) - Number(b.segmentIndex || 0));
  const first = segments[0] || {};
  const assigned = new Set();
  const storages = new Set();
  let size = 0;
  let uploadedBytes = 0;
  let chunks = 0;
  let uploadedChunks = 0;
  let publishedSegments = 0;
  let uploadedSegments = 0;
  const seenIndexes = new Set();
  const missingSegments = [];
  for (const meta of segments) {
    for (const user of normalizePrivateAssignedUsers(meta.assignedUsers || [])) assigned.add(user);
    if (meta.storage) storages.add(meta.storage);
    size += Number(meta.size || 0);
    uploadedBytes += Number(meta.uploadedBytes || 0);
    const metaChunks = Math.max(0, Math.floor(Number(meta.chunks || 0) || 0));
    chunks += metaChunks;
    uploadedChunks += Array.isArray(meta.uploadedChunks)
      ? new Set(meta.uploadedChunks.map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n < metaChunks)).size
      : 0;
    if (meta.status === 'published') publishedSegments += 1;
    if (Array.isArray(meta.uploadedChunks) && Number(meta.chunks || 0) > 0 && meta.uploadedChunks.length >= Number(meta.chunks || 0)) uploadedSegments += 1;
    const index = Math.max(0, Math.floor(Number(meta.segmentIndex || 0) || 0));
    seenIndexes.add(index);
  }
  const segmentCount = Math.max(Number(first.segmentCount || 0), segments.length, 1);
  for (let index = 0; index < segmentCount; index += 1) {
    if (!seenIndexes.has(index)) missingSegments.push(index);
  }
  const updatedAt = segments
    .map((meta) => meta.updatedAt || meta.publishedAt || meta.createdAt || '')
    .filter(Boolean)
    .sort()
    .pop() || '';
  const status = segments.length && segments.every((meta) => meta.status === 'published') && missingSegments.length === 0
    ? 'published'
    : (segments.some((meta) => meta.status === 'archived') ? 'archived' : 'uploading');
  return {
    courseId: normalizePrivateVideoId(first.courseId || first.id),
    courseTitle: first.courseTitle || first.title || '未命名专属课',
    description: first.description || '',
    assignedUsers: Array.from(assigned),
    status,
    segmentCount,
    uploadedSegments,
    publishedSegments,
    missingSegments,
    size,
    uploadedBytes,
    chunks,
    uploadedChunks,
    missingChunks: Math.max(0, chunks - uploadedChunks),
    chunkProgress: chunks > 0 ? Math.round((uploadedChunks / chunks) * 100) : 0,
    storage: Array.from(storages).join('/') || first.storage || '',
    segmentIds: segments.map((meta) => meta.id).filter(Boolean),
    createdAt: first.createdAt || '',
    updatedAt,
    publishedAt: first.publishedAt || '',
    createdBy: first.createdBy || first.owner || ''
  };
}

async function handleAdminStudentPasswordReset(context, session, username, body) {
  const { env } = context;
  if (!env.FM_AUDIT) {
    return jsonResponse({ ok: false, error: 'storage_not_configured', message: '账号存储未配置，暂时不能重置学生密码。' }, { status: 503 });
  }
  if (isAdminUsername(username, env)) {
    queueAudit(context, 'student_password_admin_reset_rejected', { reason: 'admin_exempt', username }, session);
    return jsonResponse({ ok: false, error: 'admin_exempt', message: '教师账号不能通过学生密码重置入口修改。' }, { status: 400 });
  }
  const nextPassword = String(body.newPassword || body.password || '');
  const confirmPassword = String(body.confirmPassword || body.confirm || nextPassword);
  if (nextPassword.length < PASSWORD_MIN_LENGTH) {
    queueAudit(context, 'student_password_admin_reset_rejected', { reason: 'weak_password', username }, session);
    return jsonResponse({ ok: false, error: 'weak_password', message: `临时密码至少 ${PASSWORD_MIN_LENGTH} 位。` }, { status: 400 });
  }
  if (nextPassword !== confirmPassword) {
    queueAudit(context, 'student_password_admin_reset_rejected', { reason: 'password_mismatch', username }, session);
    return jsonResponse({ ok: false, error: 'password_mismatch', message: '两次输入的临时密码不一致。' }, { status: 400 });
  }

  const accountState = await readUserAccountAuthState(env, username);
  if (!accountState.ok) {
    queueAudit(context, 'student_password_admin_reset_rejected', { reason: accountState.error || 'account_lookup_failed', username }, session);
    return jsonResponse({ ok: false, error: 'account_lookup_failed', message: '账号存储暂时不可用，请稍后再试。' }, { status: 503 });
  }
  if (accountState.account && accountState.account.disabled) {
    queueAudit(context, 'student_password_admin_reset_rejected', { reason: 'account_disabled', username }, session);
    return jsonResponse({ ok: false, error: 'account_disabled', message: '这个账号已停用，不能在这里重置密码。' }, { status: 403 });
  }
  if (!accountState.account) {
    queueAudit(context, 'student_password_admin_reset_rejected', { reason: 'student_not_found', username }, session);
    return jsonResponse({ ok: false, error: 'student_not_found', message: '没有找到这个学生账号，请先确认学生已注册或账号拼写正确。' }, { status: 404 });
  }
  const accountRole = String(accountState.account.role || 'student').toLowerCase();
  if (accountRole !== 'student' || isAdminUsername(accountState.account.username || username, env)) {
    queueAudit(context, 'student_password_admin_reset_rejected', { reason: 'not_student_account', username, role: accountRole }, session);
    return jsonResponse({ ok: false, error: 'not_student_account', message: '这里只能重置已注册学生账号的密码。' }, { status: 400 });
  }

  const passwordReuse = await validateNewAccountPassword(env, username, nextPassword, accountState.account);
  if (!passwordReuse.ok) {
    queueAudit(context, 'student_password_admin_reset_rejected', { reason: passwordReuse.error, username }, session);
    return jsonResponse(passwordReuse, { status: 400 });
  }
  const updatedAccount = await updateAccountPassword(env, username, nextPassword, session);
  if (!updatedAccount) {
    queueAudit(context, 'student_password_admin_reset_rejected', { reason: 'write_failed', username }, session);
    return jsonResponse({ ok: false, error: 'write_failed', message: '临时密码保存失败，请稍后再试。' }, { status: 500 });
  }
  queueAudit(context, 'student_password_admin_reset', {
    username,
    hadAccount: true,
    access: updatedAccount.access || '',
    sessionsRevoked: true
  }, session);
  return jsonResponse({
    ok: true,
    username,
    access: updatedAccount.access || 'locked',
    sessionsRevoked: true,
    message: '学生密码已重置；旧密码和旧登录会话已失效，学习权限状态不变。'
  });
}

async function handleStudentAccess(context, session) {
  const { request, env } = context;
  if (!isAdmin(session, env)) {
    queueAudit(context, 'admin_denied', { target: '/api/admin/student-access' }, session);
    return jsonResponse({ ok: false, error: 'admin_required' }, { status: 403 });
  }

  const policy = await readStudentAccessPolicy(env);
  if (request.method === 'GET' || request.method === 'HEAD') {
    return jsonResponse({
      ok: true,
      activeUsers: policy.activeUsers,
      lockedUsers: policy.lockedUsers,
      lockedDefaultUsers: policy.lockedUsers.filter((user) => DEFAULT_ACTIVE_STUDENT_USERS.includes(user)),
      registrationUsers: registrationUsers(env),
      defaults: DEFAULT_ACTIVE_STUDENT_USERS,
      policyVersion: policy.policyVersion,
      legacyDefaultLocksIgnored: policy.legacyDefaultLocksIgnored,
      updatedAt: policy.updatedAt,
      updatedBy: policy.updatedBy
    });
  }
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  const originError = crossOriginMutationError(request);
  if (originError) return jsonResponse({ ok: false, error: originError, message: '跨站请求已被拒绝，请从教师后台重新操作。' }, { status: 403 });

  const body = await readJsonRequest(request);
  if (!body) return jsonResponse({ ok: false, error: 'invalid_json' }, { status: 400 });
  const username = normalizeUsername(body.username);
  const action = String(body.action || '').trim().toLowerCase();
  if (!username) return jsonResponse({ ok: false, error: 'missing_username' }, { status: 400 });
  if (!['allow', 'lock', 'unlock', 'remove', 'reset-password'].includes(action)) {
    return jsonResponse({ ok: false, error: 'invalid_action' }, { status: 400 });
  }
  if (action === 'reset-password') return handleAdminStudentPasswordReset(context, session, username, body);

  const active = new Set(policy.activeUsers);
  const locked = new Set(policy.lockedUsers);
  if (action === 'allow' || action === 'unlock') active.add(username);
  if (action === 'lock' || action === 'remove') locked.add(username);
  if (action === 'allow' || action === 'unlock') locked.delete(username);
  if (action === 'remove') active.delete(username);

  const saved = await writeStudentAccessPolicy(env, {
    activeUsers: Array.from(active),
    lockedUsers: Array.from(locked)
  }, session);
  if (!saved) return jsonResponse({ ok: false, error: 'storage_not_configured', message: '学生权限存储未配置。' }, { status: 503 });

  const next = await readStudentAccessPolicy(env);
  queueAudit(context, 'student_access_updated', {
    action,
    username,
    activeUsers: next.activeUsers,
    lockedUsers: next.lockedUsers
  }, session);
  return jsonResponse({
    ok: true,
    activeUsers: next.activeUsers,
    lockedUsers: next.lockedUsers,
    lockedDefaultUsers: next.lockedUsers.filter((user) => DEFAULT_ACTIVE_STUDENT_USERS.includes(user)),
    registrationUsers: registrationUsers(env),
    policyVersion: next.policyVersion,
    legacyDefaultLocksIgnored: next.legacyDefaultLocksIgnored,
    updatedAt: next.updatedAt,
    updatedBy: next.updatedBy
  });
}

async function handleAdminPrivateVideos(context, session) {
  const { request, env } = context;
  if (!isAdmin(session, env)) {
    queueAudit(context, 'admin_denied', { target: new URL(request.url).pathname }, session);
    return jsonResponse({ ok: false, error: 'admin_required' }, { status: 403 });
  }
  if (!env.FM_AUDIT && !privateVideoR2JsonAvailable(env, 'get')) {
    return jsonResponse({ ok: false, error: 'storage_not_configured', message: '私有视频存储未配置。' }, { status: 503 });
  }
  const originError = crossOriginMutationError(request);
  if (originError) return jsonResponse({ ok: false, error: originError, message: '跨站请求已被拒绝，请从教师后台重新操作。' }, { status: 403 });

  const url = new URL(request.url);
  if (url.pathname === '/api/admin/private-videos') {
    if (request.method === 'GET' || request.method === 'HEAD') {
      const includeArchived = url.searchParams.get('includeArchived') === '1';
      const forceWriteProbe = url.searchParams.has('refresh') || url.searchParams.get('writeProbe') === 'force';
      const metadataWriteHealth = url.searchParams.has('writeProbe')
        ? await probePrivateVideoMetadataWriteHealth(env, { force: forceWriteProbe })
        : PRIVATE_VIDEO_METADATA_WRITE_HEALTH;
      const metas = await listUploadedPrivateVideoMetas(env, true, includeArchived, {
        reconcileIndex: url.searchParams.has('refresh')
      });
      const videos = metas.map(adminVideoSummary);
      const courses = Array.from(groupPrivateVideoMetasByCourse(metas).values()).map(adminPrivateCourseSummary)
        .sort((a, b) => Date.parse(b.updatedAt || b.createdAt || '') - Date.parse(a.updatedAt || a.createdAt || ''));
      const staticQiMeta = {
        id: PRIVATE_QI_VIDEO_ID,
        title: 'qi 的课堂回放 01',
        courseId: PRIVATE_QI_VIDEO_ID,
        courseTitle: 'qi 的课堂回放 01',
        segmentTitle: '完整回放',
        segmentIndex: 0,
        segmentCount: 1,
        description: '仓库静态私有分片。仅 qi 和教师账号可见。',
        fileName: 'meeting_01.mp4',
        contentType: 'video/mp4',
        size: 369098204,
        chunkSize: PRIVATE_VIDEO_FIRST_CHUNK_BYTES,
        chunks: 44,
        uploadedChunks: Array.from({ length: 44 }, (_, index) => index),
        uploadedBytes: 369098204,
        status: 'published',
        storage: 'static',
        assignedUsers: ['qi'],
        entitlements: [`private-video:${PRIVATE_QI_VIDEO_ID}`],
        createdAt: '2026-05-11T15:02:22.872Z',
        updatedAt: EDGE_HOME_VERSION,
        publishedAt: '2026-05-11T15:02:22.872Z',
        createdBy: 'teacher'
      };
      queueAudit(context, 'admin_private_video_list', { count: videos.length, courses: courses.length }, session);
      const r2Available = !!(env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function');
      return jsonResponse({
        ok: true,
        videos,
        courses,
        staticVideos: [adminVideoSummary(staticQiMeta)],
        staticCourses: [adminPrivateCourseSummary([staticQiMeta])],
        limits: privateVideoAdminLimits(r2Available, { metadataWriteHealth })
      });
    }
    if (request.method === 'POST') {
      const body = await readJsonRequest(request);
      if (!body) return jsonResponse({ ok: false, error: 'invalid_json', message: '请求格式不正确。' }, { status: 400 });
      const title = truncate(String(body.title || body.fileName || '私有课程视频').trim(), 120);
      const fileName = truncate(String(body.fileName || '').trim(), 180);
      const contentType = normalizePrivateVideoContentType(body.contentType || 'video/mp4', fileName);
      const size = Number(body.size || 0);
      if (!title) return jsonResponse({ ok: false, error: 'invalid_title', message: '请填写视频标题。' }, { status: 400 });
      if (!contentType) return jsonResponse({ ok: false, error: 'invalid_content_type', message: '专属课只允许上传视频文件。' }, { status: 400 });
      if (!Number.isFinite(size) || size <= 0) return jsonResponse({ ok: false, error: 'invalid_size', message: '视频大小不正确。' }, { status: 400 });
      const r2Available = !!(env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function');
      const uploadLimits = privateVideoAdminLimits(r2Available, { metadataWriteHealth: PRIVATE_VIDEO_METADATA_WRITE_HEALTH });
      if (!r2Available) return privateVideoMutationBlockedResponse('upload-publish', uploadLimits);
      const chunkPlan = pickPrivateUploadChunkPlan(size, body.chunkSize, r2Available);
      const chunkSize = chunkPlan.chunkSize;
      const chunks = Math.ceil(size / chunkSize);
      if (chunks <= 0 || chunks > PRIVATE_UPLOAD_MAX_CHUNKS) {
        return jsonResponse({ ok: false, error: 'too_many_chunks', message: '视频过大或分片过多，请换更小的文件或联系我改用 R2 专用上传。' }, { status: 413 });
      }
      let assignedUsers = normalizePrivateAssignedUsers(body.assignedUsers || body.targetUsers || body.targetUsernames || '');
      const assignedError = oneOnOneAssignedUserError(assignedUsers);
      if (assignedError) return jsonResponse({ ok: false, error: 'one_on_one_required', message: assignedError }, { status: 400 });
      const assignedValidation = await validatePrivateAssignedStudent(env, assignedUsers);
      if (!assignedValidation.ok) return jsonResponse({ ok: false, error: assignedValidation.error, message: assignedValidation.message }, { status: assignedValidation.status });
      assignedUsers = assignedValidation.assignedUsers;
      const courseTitle = truncate(String(body.courseTitle || title || '一对一专属课').trim(), 120);
      const courseId = normalizePrivateVideoId(body.courseId || body.course || '') || createPrivateCourseId(courseTitle);
      const courseConflict = await findPrivateCourseAssignmentConflict(env, courseId, assignedUsers[0]);
      if (courseConflict) {
        return jsonResponse({
          ok: false,
          error: 'course_assignment_conflict',
          message: '同一节一对一专属课的所有分段必须指定同一个学生账号。'
        }, { status: 409 });
      }
      const segmentCount = Math.max(1, Math.min(99, Math.floor(Number(body.segmentCount || body.partCount || 1) || 1)));
      const segmentIndex = Math.max(0, Math.floor(Number(body.segmentIndex || body.partIndex || 0) || 0));
      if (segmentIndex >= segmentCount) return jsonResponse({ ok: false, error: 'segment_out_of_range', message: '分段序号不能大于分段总数。' }, { status: 400 });
      const shapeConflict = await findPrivateCourseShapeConflict(env, courseId, segmentCount);
      if (shapeConflict) {
        return jsonResponse({
          ok: false,
          error: 'segment_count_conflict',
          message: '同一节课的所有分段总数必须一致，请删除草稿后重新上传。'
        }, { status: 409 });
      }
      const segmentConflict = await findPrivateCourseSegmentConflict(env, courseId, segmentIndex);
      if (segmentConflict) {
        if (body.resumeExisting || body.resumeExistingDraft) {
          const resumeError = privateVideoResumeConflict(segmentConflict, {
            assignedUsers,
            segmentCount,
            segmentIndex,
            size,
            chunkSize,
            chunks,
            contentType,
            fileName
          });
          if (!resumeError) {
            const uploadedChunkIndexes = privateVideoUploadedChunkIndexes(segmentConflict);
            queueAudit(context, 'private_video_upload_resume', {
              video: segmentConflict.id,
              title: segmentConflict.title || title,
              size: Number(segmentConflict.size || size),
              chunks: Number(segmentConflict.chunks || chunks),
              chunkSize: Number(segmentConflict.chunkSize || chunkSize),
              uploadedChunks: uploadedChunkIndexes.length,
              uploadedBytes: Number(segmentConflict.uploadedBytes || 0),
              courseId,
              courseTitle,
              segmentIndex,
              segmentCount,
              assignedUsers: segmentConflict.assignedUsers || assignedUsers,
              storage: segmentConflict.storage || 'kv'
            }, session);
            return jsonResponse({
              ok: true,
              resumed: true,
              video: adminVideoSummary(segmentConflict),
              uploadedChunkIndexes,
              limits: privateVideoAdminLimits(r2Available, {
                chunkSize: Number(segmentConflict.chunkSize || chunkSize),
                chunks: Number(segmentConflict.chunks || chunks),
                recommendedChunkSize: chunkPlan.recommendedChunkSize
              })
            });
          }
          return jsonResponse({
            ok: false,
            error: 'course_segment_resume_conflict',
            message: `这节课的第 ${segmentIndex + 1} 段已有草稿，但不能续传：${resumeError} 请重新选择原视频，或先删除草稿后再上传。`
          }, { status: 409 });
        }
        return jsonResponse({
          ok: false,
          error: 'course_segment_conflict',
          message: `这节课的第 ${segmentIndex + 1} 段已经存在；如果要继续同一个草稿，请刷新列表后使用同名课程和同一视频续传。`
        }, { status: 409 });
      }
      const segmentTitle = truncate(String(body.segmentTitle || title || `第 ${segmentIndex + 1} 段`).trim(), 120);
      const id = createPrivateVideoId(title);
      const now = new Date().toISOString();
      const meta = {
        id,
        title,
        courseId,
        courseTitle,
        segmentTitle,
        segmentIndex,
        segmentCount,
        description: truncate(String(body.description || '').trim(), 500),
        fileName,
        contentType,
        size,
        chunkSize,
        chunks,
        status: 'uploading',
        storage: r2Available ? 'r2' : 'kv',
        assignedUsers,
        entitlements: normalizeEntitlementList(body.entitlements || ''),
        duration: Math.max(0, Math.floor(Number(body.duration || 0) || 0)),
        tags: ['私有课程', '一对一回放'],
        icon: '课',
        uploadedChunks: [],
        uploadedBytes: 0,
        chunkBytes: {},
        chunkStores: {},
        createdBy: session.username,
        owner: session.username,
        createdAt: now,
        createdAtMs: Date.now(),
        updatedAt: now,
        source: 'teacher-upload'
      };
      const wrote = await writeUploadedPrivateVideoMeta(env, meta);
      if (!wrote) return jsonResponse({ ok: false, error: 'meta_write_failed', message: '视频元数据写入失败。' }, { status: 503 });
      const indexSaved = await addPrivateVideoToIndex(env, id);
      if (!indexSaved) {
        await deleteUploadedPrivateVideoStorage(env, { id, chunks: 0 });
        return jsonResponse({ ok: false, error: 'index_write_failed', message: '课程索引写入失败，请稍后重试。' }, { status: 503 });
      }
      queueAudit(context, 'private_video_upload_init', {
        video: id,
        title,
        size,
        chunks,
        chunkSize,
        courseId,
        courseTitle,
        segmentIndex,
        segmentCount,
        assignedUsers: meta.assignedUsers,
        storage: meta.storage
      }, session);
      return jsonResponse({
        ok: true,
        video: adminVideoSummary(meta),
        limits: privateVideoAdminLimits(r2Available, {
          chunkSize,
          chunks,
          recommendedChunkSize: chunkPlan.recommendedChunkSize
        })
      });
    }
    return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  }

  const coursePublishMatch = url.pathname.match(/^\/api\/admin\/private-videos\/course\/([^/]+)\/publish$/);
  if (coursePublishMatch) {
    if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    const courseId = normalizePrivateVideoId(decodeURIComponent(coursePublishMatch[1]));
    if (!courseId) return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
    const body = await readJsonRequest(request) || {};
    const r2Available = !!(env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function');
    const limits = privateVideoAdminLimits(r2Available, { metadataWriteHealth: PRIVATE_VIDEO_METADATA_WRITE_HEALTH });
    if (!r2Available) return privateVideoMutationBlockedResponse('upload-publish', limits);
    const metas = await listUploadedPrivateVideoMetas(env, true);
    const courseMetas = metas.filter((meta) => normalizePrivateVideoId(meta.courseId || meta.id) === courseId);
    const requestedUsers = normalizePrivateAssignedUsers(body.assignedUsers || body.targetUsers || body.targetUsernames || body.student || []);
    const validation = validatePrivateCourseSegmentsForPublish(courseMetas, requestedUsers);
    if (!validation.ok) return jsonResponse({ ok: false, error: validation.error, message: validation.message, missing: validation.missing, missingSegments: validation.missingSegments, video: validation.video }, { status: validation.status });
    const assignedValidation = await validatePrivateAssignedStudent(env, validation.assignedUsers);
    if (!assignedValidation.ok) return jsonResponse({ ok: false, error: assignedValidation.error, message: assignedValidation.message }, { status: assignedValidation.status });
    for (const meta of validation.segments) {
      const storageCheck = await verifyUploadedPrivateVideoStorage(env, meta);
      if (!storageCheck.ok) return jsonResponse({ ok: false, error: storageCheck.error, message: storageCheck.message, missing: storageCheck.missing, video: storageCheck.video, chunk: storageCheck.chunk }, { status: storageCheck.status });
    }
    const now = new Date().toISOString();
    const published = [];
    for (const meta of validation.segments) {
      meta.assignedUsers = assignedValidation.assignedUsers;
      if (body.entitlements) meta.entitlements = normalizeEntitlementList(body.entitlements || '');
      meta.status = 'published';
      meta.publishedAt = meta.publishedAt || now;
      meta.updatedAt = now;
      meta.publishedBy = session.username;
      const wrote = await writeUploadedPrivateVideoMeta(env, meta);
      if (!wrote) {
        return jsonResponse({ ok: false, error: 'publish_failed', message: '整节课发布状态写入失败；未完整发布前学生端仍不可见。' }, { status: 503 });
      }
      const indexSaved = await addPrivateVideoToIndex(env, meta.id);
      if (!indexSaved) return jsonResponse({ ok: false, error: 'index_write_failed', message: '整节课已发布，但索引刷新失败。请稍后点“刷新专属课”。' }, { status: 503 });
      published.push(meta);
    }
    const course = adminPrivateCourseSummary(published);
    queueAudit(context, 'private_video_course_publish', {
      courseId,
      courseTitle: course.courseTitle,
      segmentIds: course.segmentIds,
      assignedUsers: course.assignedUsers,
      segments: published.length,
      size: course.size,
      storage: course.storage
    }, session);
    return jsonResponse({ ok: true, course, videos: published.map(adminVideoSummary), limits, productionBlocker: limits.productionBlocker, productionAcceptance: limits.productionAcceptance });
  }

  const courseArchiveMatch = url.pathname.match(/^\/api\/admin\/private-videos\/course\/([^/]+)\/archive$/);
  if (courseArchiveMatch) {
    if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    const courseId = normalizePrivateVideoId(decodeURIComponent(courseArchiveMatch[1]));
    if (!courseId) return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
    const r2Available = !!(env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function');
    const limits = privateVideoAdminLimits(r2Available, { metadataWriteHealth: PRIVATE_VIDEO_METADATA_WRITE_HEALTH });
    if (!r2Available) return privateVideoMutationBlockedResponse('archive-course', limits);
    const metas = await listUploadedPrivateVideoMetas(env, true, true);
    const courseMetas = metas.filter((meta) => normalizePrivateVideoId(meta.courseId || meta.id) === courseId);
    if (!courseMetas.length) return jsonResponse({ ok: false, error: 'not_found', message: '没有找到这节专属课，静态内置课不能在这里下架。' }, { status: 404 });
    const now = new Date().toISOString();
    const archived = [];
    for (const meta of courseMetas) {
      meta.status = 'archived';
      meta.archivedAt = now;
      meta.archivedBy = session.username;
      meta.updatedAt = now;
      const wrote = await writeUploadedPrivateVideoMeta(env, meta);
      if (!wrote) return jsonResponse({ ok: false, error: 'archive_failed', message: '专属课下架状态写入失败，请重试。' }, { status: 503 });
      archived.push(meta);
    }
    const course = adminPrivateCourseSummary(archived);
    queueAudit(context, 'private_video_course_archive', {
      courseId,
      courseTitle: course.courseTitle,
      segmentIds: course.segmentIds,
      assignedUsers: course.assignedUsers,
      segments: archived.length
    }, session);
    return jsonResponse({ ok: true, course, limits, productionBlocker: limits.productionBlocker, productionAcceptance: limits.productionAcceptance });
  }

  const courseAccessMatch = url.pathname.match(/^\/api\/admin\/private-videos\/course\/([^/]+)\/access$/);
  if (courseAccessMatch) {
    if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    const courseId = normalizePrivateVideoId(decodeURIComponent(courseAccessMatch[1]));
    if (!courseId) return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
    const body = await readJsonRequest(request) || {};
    const r2Available = !!(env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function');
    const limits = privateVideoAdminLimits(r2Available, { metadataWriteHealth: PRIVATE_VIDEO_METADATA_WRITE_HEALTH });
    let assignedUsers = normalizePrivateAssignedUsers(body.assignedUsers || body.targetUsers || body.targetUsernames || body.student || '');
    const assignedError = oneOnOneAssignedUserError(assignedUsers);
    if (assignedError) return jsonResponse({ ok: false, error: 'one_on_one_required', message: assignedError }, { status: 400 });
    const assignedValidation = await validatePrivateAssignedStudent(env, assignedUsers);
    if (!assignedValidation.ok) return jsonResponse({ ok: false, error: assignedValidation.error, message: assignedValidation.message }, { status: assignedValidation.status });
    assignedUsers = assignedValidation.assignedUsers;
    const metas = await listUploadedPrivateVideoMetas(env, true);
    const courseMetas = metas.filter((meta) => normalizePrivateVideoId(meta.courseId || meta.id) === courseId);
    if (!courseMetas.length) return jsonResponse({ ok: false, error: 'not_found', message: '没有找到这节专属课，静态内置课不能在这里改授权。' }, { status: 404 });
    const previousAssignedUsers = Array.from(new Set(courseMetas.flatMap((meta) => normalizePrivateAssignedUsers(meta.assignedUsers || []))));
    if (sameAssignedUsers(previousAssignedUsers, assignedUsers)) {
      const course = adminPrivateCourseSummary(courseMetas);
      queueAudit(context, 'private_video_course_access_noop', {
        courseId,
        courseTitle: course.courseTitle,
        assignedUsers: course.assignedUsers,
        segmentIds: course.segmentIds,
        segments: courseMetas.length
      }, session);
      return jsonResponse({
        ok: true,
        noop: true,
        course,
        limits,
        productionBlocker: limits.productionBlocker,
        productionAcceptance: limits.productionAcceptance,
        message: '授权学生没有变化，已保持当前设置。'
      });
    }
    if (!r2Available) return privateVideoMutationBlockedResponse('change-access', limits);
    const now = new Date().toISOString();
    const updated = [];
    for (const meta of courseMetas) {
      meta.assignedUsers = assignedUsers;
      meta.entitlements = normalizeEntitlementList(body.entitlements || '');
      meta.accessUpdatedAt = now;
      meta.accessUpdatedBy = session.username;
      meta.updatedAt = now;
      const wrote = await writeUploadedPrivateVideoMeta(env, meta);
      if (!wrote) return jsonResponse({ ok: false, error: 'access_update_failed', message: '专属课授权写入失败，请重试。' }, { status: 503 });
      updated.push(meta);
    }
    const course = adminPrivateCourseSummary(updated);
    queueAudit(context, 'private_video_course_access_update', {
      courseId,
      courseTitle: course.courseTitle,
      previousAssignedUsers,
      assignedUsers: course.assignedUsers,
      segmentIds: course.segmentIds,
      segments: updated.length
    }, session);
    return jsonResponse({ ok: true, course, limits, productionBlocker: limits.productionBlocker, productionAcceptance: limits.productionAcceptance });
  }

  const courseDeleteMatch = url.pathname.match(/^\/api\/admin\/private-videos\/course\/([^/]+)(?:\/delete)?$/);
  if (courseDeleteMatch && (request.method === 'DELETE' || url.pathname.endsWith('/delete'))) {
    const dryRun = url.searchParams.get('dryRun') === '1' || url.searchParams.get('check') === '1';
    if (dryRun && !['GET', 'HEAD', 'POST'].includes(request.method)) return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    if (!dryRun && request.method !== 'DELETE' && request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    const courseId = normalizePrivateVideoId(decodeURIComponent(courseDeleteMatch[1]));
    if (!courseId) return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
    const metas = await listUploadedPrivateVideoMetas(env, true, true);
    const courseMetas = metas.filter((meta) => normalizePrivateVideoId(meta.courseId || meta.id) === courseId);
    if (!courseMetas.length) return jsonResponse({ ok: false, error: 'not_found', message: '没有找到这节专属课，静态内置课不能在这里删除。' }, { status: 404 });
    const beforeDelete = adminPrivateCourseSummary(courseMetas);
    const r2Available = !!(env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function');
    const metadataWriteHealth = url.searchParams.has('writeProbe')
      ? await probePrivateVideoMetadataWriteHealth(env, { force: true })
      : PRIVATE_VIDEO_METADATA_WRITE_HEALTH;
    const deleteReadiness = privateVideoDeleteReadiness(r2Available, metadataWriteHealth);
    const limits = privateVideoAdminLimits(r2Available, { metadataWriteHealth });
    const confirmation = privateVideoDeleteConfirmation(courseId);
    const storageCleanupPlan = privateVideoStorageCleanupPlan(r2Available, beforeDelete, deleteReadiness);
    if (dryRun) {
      const canDelete = deleteReadiness.state !== 'blocked';
      const deleteOutcome = privateVideoDeleteOutcome(canDelete ? 'dry-run-can-delete' : 'dry-run-blocked', {
        r2Available,
        metadataRevoked: false,
        storageCleanupPlan,
        deleteReadiness,
        limits
      });
      const deleteResult = privateVideoDeleteResultSummary(canDelete ? 'dry-run-can-delete' : 'dry-run-blocked', {
        r2Available,
        metadataRevoked: false,
        storageCleanupPlan,
        deleteReadiness,
        limits,
        deleteOutcome,
        dryRun: true,
        destructiveRequestSent: false,
        course: beforeDelete,
        blockers: privateVideoStorageBlockers(r2Available)
      });
      return jsonResponse({
        ok: true,
        dryRun: true,
        canDelete,
        deleteReadiness,
        limits,
        confirmation,
        typedConfirmation: confirmation,
        storageCleanupPlan,
        deleteOutcome,
        deleteResult,
        metadataRevoked: deleteOutcome.metadataRevoked,
        studentPlaybackRevoked: deleteOutcome.studentPlaybackRevoked,
        productionRecoveryStatus: deleteOutcome.productionRecoveryStatus,
        blockers: privateVideoStorageBlockers(r2Available),
        storageCleanupCompleteClaimAllowed: storageCleanupPlan.storageCleanupCompleteClaimAllowed,
        productionBlocker: limits.productionBlocker,
        productionAcceptance: limits.productionAcceptance,
        error: canDelete ? '' : 'delete_blocked_by_storage',
        course: beforeDelete,
        message: canDelete
          ? '删除预检通过；确认后可删除这节教师上传课。'
          : deleteReadiness.detail
      }, { status: canDelete ? 200 : 409 });
    }
	    if (deleteReadiness.state === 'blocked') {
      const deleteOutcome = privateVideoDeleteOutcome('blocked-before-delete', {
        r2Available,
        metadataRevoked: false,
        storageCleanupPlan,
        deleteReadiness,
        limits
      });
      const deleteResult = privateVideoDeleteResultSummary('blocked-before-delete', {
        r2Available,
        metadataRevoked: false,
        storageCleanupPlan,
        deleteReadiness,
        limits,
        deleteOutcome,
        destructiveRequestSent: false,
        course: beforeDelete,
        blockers: privateVideoStorageBlockers(r2Available)
      });
	      return jsonResponse({
	        ok: false,
	        error: 'delete_blocked_by_storage',
        course: beforeDelete,
        deleteReadiness,
        limits,
        confirmation,
        typedConfirmation: confirmation,
        storageCleanupPlan,
        deleteOutcome,
        deleteResult,
        metadataRevoked: deleteOutcome.metadataRevoked,
        studentPlaybackRevoked: deleteOutcome.studentPlaybackRevoked,
        productionRecoveryStatus: deleteOutcome.productionRecoveryStatus,
        blockers: privateVideoStorageBlockers(r2Available),
	        message: deleteReadiness.detail
	      }, { status: 503 });
	    }
	    const body = await readJsonRequest(request) || {};
	    const confirmedCourseId = normalizePrivateVideoId(body.confirmCourseId || body.confirmedCourseId || body.courseIdConfirmation || '');
	    if (confirmedCourseId !== courseId) {
        const deleteOutcome = privateVideoDeleteOutcome('confirm-course-id-mismatch', {
          r2Available,
          metadataRevoked: false,
          storageCleanupPlan,
          deleteReadiness,
          limits
        });
        const deleteResult = privateVideoDeleteResultSummary('confirm-course-id-mismatch', {
          r2Available,
          metadataRevoked: false,
          storageCleanupPlan,
          deleteReadiness,
          limits,
          deleteOutcome,
          destructiveRequestSent: false,
          course: beforeDelete,
          blockers: privateVideoStorageBlockers(r2Available)
        });
	      return jsonResponse({
	        ok: false,
	        error: 'confirm_course_id_mismatch',
	        course: beforeDelete,
	        deleteReadiness,
	        limits,
	        confirmation,
	        typedConfirmation: confirmation,
	        storageCleanupPlan,
          deleteOutcome,
          deleteResult,
	        message: '删除被拒绝：必须在请求正文中提交与路径完全一致的 confirmCourseId，防止绕过页面误删专属课。'
	      }, { status: 409 });
	    }
	    const storage = { kvChunks: 0, r2Chunks: 0, metas: 0, errors: [] };
    for (const meta of courseMetas) {
      const deleted = await deleteUploadedPrivateVideoStorage(env, meta, { metaFirst: true });
      storage.kvChunks += deleted.kvChunks;
      storage.r2Chunks += deleted.r2Chunks;
      storage.metas += deleted.metas;
      storage.errors.push(...deleted.errors);
    }
    const indexSaved = await removePrivateVideosFromIndex(env, courseMetas.map((meta) => meta.id));
    if (!indexSaved) storage.errors.push('index:update_failed');
    storage.errors = sanitizePrivateVideoStorageErrors(storage.errors);
    const r2CleanupUnverified = !r2Available;
    if (r2CleanupUnverified && !storage.errors.includes('r2:cleanup_unverified_missing_fm_private_media')) {
      storage.errors.push('r2:cleanup_unverified_missing_fm_private_media');
    }
    const metaDeleteIncomplete = storage.metas < courseMetas.length;
    queueAudit(context, 'private_video_course_delete', {
      courseId,
      courseTitle: beforeDelete.courseTitle,
      segmentIds: beforeDelete.segmentIds,
      assignedUsers: beforeDelete.assignedUsers,
      segments: courseMetas.length,
      kvChunks: storage.kvChunks,
      r2Chunks: storage.r2Chunks,
      metas: storage.metas,
      errors: storage.errors.slice(0, 10)
    }, session);
    if (metaDeleteIncomplete) {
      const deleteOutcome = privateVideoDeleteOutcome('metadata-revoke-failed', {
        r2Available,
        metadataRevoked: false,
        storage,
        storageCleanupPlan,
        deleteReadiness,
        limits
      });
      const deleteResult = privateVideoDeleteResultSummary('metadata-revoke-failed', {
        r2Available,
        metadataRevoked: false,
        storage,
        storageCleanupPlan,
        deleteReadiness,
        limits,
        deleteOutcome,
        cleanupPending: true,
        destructiveRequestSent: true,
        course: beforeDelete,
        blockers: privateVideoStorageBlockers(r2Available, storage)
      });
      return jsonResponse({
        ok: false,
        error: 'delete_meta_failed',
        course: beforeDelete,
        storage,
        deleteReadiness,
        limits,
        confirmation,
        typedConfirmation: confirmation,
        storageCleanup: {
          ...storageCleanupPlan,
          complete: false,
          metadataRevoked: false,
          blockers: privateVideoStorageBlockers(r2Available, storage)
        },
        deleteOutcome,
        deleteResult,
        metadataRevoked: deleteOutcome.metadataRevoked,
        studentPlaybackRevoked: deleteOutcome.studentPlaybackRevoked,
        productionRecoveryStatus: deleteOutcome.productionRecoveryStatus,
        cleanupPending: true,
        message: '专属课元数据没有完全删除，页面不会假装成功；请稍后重试删除，或等私有存储写入状态恢复。'
      }, { status: 503 });
    }
    const cleanupPending = storage.errors.length > 0 || r2CleanupUnverified;
    const cleanupWarning = r2CleanupUnverified
      ? 'storage_cleanup_unverified_missing_fm_private_media'
      : (cleanupPending ? 'delete_cleanup_pending' : '');
    const deleteOutcome = privateVideoDeleteOutcome(cleanupPending ? 'metadata-revoked-cleanup-pending' : 'complete', {
      r2Available,
      metadataRevoked: true,
      storage,
      storageCleanupPlan,
      deleteReadiness,
      limits
    });
    const deleteResult = privateVideoDeleteResultSummary(cleanupPending ? 'metadata-revoked-cleanup-pending' : 'complete', {
      r2Available,
      metadataRevoked: true,
      storage,
      storageCleanupPlan,
      deleteReadiness,
      limits,
      deleteOutcome,
      cleanupPending,
      destructiveRequestSent: true,
      course: beforeDelete,
      blockers: privateVideoStorageBlockers(r2Available, storage)
    });
    return jsonResponse({
      ok: true,
      course: { ...beforeDelete, status: 'deleted' },
      storage,
      deleteReadiness,
      limits,
      confirmation,
      typedConfirmation: confirmation,
      storageCleanup: {
        ...storageCleanupPlan,
        complete: !cleanupPending,
        metadataRevoked: true,
        kvChunksDeleted: storage.kvChunks,
        r2ChunksDeleted: storage.r2Chunks,
        blockers: privateVideoStorageBlockers(r2Available, storage)
      },
      deleteOutcome,
      deleteResult,
      metadataRevoked: deleteOutcome.metadataRevoked,
      studentPlaybackRevoked: deleteOutcome.studentPlaybackRevoked,
      productionRecoveryStatus: deleteOutcome.productionRecoveryStatus,
      blockers: privateVideoStorageBlockers(r2Available, storage),
      cleanupPending,
      warning: cleanupWarning,
      message: cleanupPending
        ? (r2CleanupUnverified
          ? '专属课已从课程表删除，学生端播放入口已失效；FM_PRIVATE_MEDIA R2 未绑定，R2 对象清理未验证，不能宣称完整存储删除。'
          : '专属课已从课程表删除，学生端播放入口已失效；后台存储清理仍有警告，已记录到教师监控。')
        : '专属课已删除，学生端播放入口已失效。'
    }, { status: cleanupPending ? 207 : 200 });
  }

  const chunkMatch = url.pathname.match(/^\/api\/admin\/private-videos\/([^/]+)\/chunks\/(\d+)$/);
  if (chunkMatch) {
    if (request.method !== 'PUT' && request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    const id = normalizePrivateVideoId(decodeURIComponent(chunkMatch[1]));
    const index = Number(chunkMatch[2]);
    const meta = await readUploadedPrivateVideoMeta(env, id);
    if (!meta || meta.status === 'archived') return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
    const r2Available = !!(env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function');
    const limits = privateVideoAdminLimits(r2Available, { metadataWriteHealth: PRIVATE_VIDEO_METADATA_WRITE_HEALTH });
    if (!r2Available) return privateVideoMutationBlockedResponse('upload-publish', limits);
    if (!Number.isInteger(index) || index < 0 || index >= meta.chunks) return jsonResponse({ ok: false, error: 'chunk_out_of_range' }, { status: 400 });
    const buffer = await request.arrayBuffer();
    if (!buffer || buffer.byteLength <= 0) return jsonResponse({ ok: false, error: 'empty_chunk', message: '分片为空。' }, { status: 400 });
    if (buffer.byteLength > PRIVATE_UPLOAD_MAX_CHUNK_BYTES) return jsonResponse({ ok: false, error: 'chunk_too_large', message: '单个分片太大。' }, { status: 413 });
    const expectedSize = index === meta.chunks - 1 ? meta.size - meta.chunkSize * (meta.chunks - 1) : meta.chunkSize;
    if (expectedSize > 0 && Math.abs(buffer.byteLength - expectedSize) > 0) {
      return jsonResponse({ ok: false, error: 'chunk_size_mismatch', message: `分片大小不匹配，应为 ${expectedSize} 字节。` }, { status: 400 });
    }
    const key = padChunkIndex(index);
    const uploadedSet = new Set(Array.isArray(meta.uploadedChunks) ? meta.uploadedChunks.map(Number) : []);
    const recordedSize = Number((meta.chunkBytes && (meta.chunkBytes[key] || meta.chunkBytes[String(index)])) || 0);
    const incomingHash = await sha256HexFromBuffer(buffer);
    const recordedHash = String((meta.chunkHashes && (meta.chunkHashes[key] || meta.chunkHashes[String(index)])) || '').toLowerCase();
    if (uploadedSet.has(index) && recordedSize > 0 && recordedSize === buffer.byteLength && recordedHash && incomingHash && recordedHash !== incomingHash) {
      return jsonResponse({
        ok: false,
        error: 'chunk_content_conflict',
        message: `第 ${Number(meta.segmentIndex || 0) + 1} 段分片 ${padChunkIndex(index)} 与已上传内容不一致，请重新选择原视频后重传该段。`
      }, { status: 409 });
    }
    if (uploadedSet.has(index) && recordedSize > 0 && recordedSize === buffer.byteLength && (!recordedHash || !incomingHash || recordedHash === incomingHash)) {
      const store = uploadedChunkStore(meta, index);
      queueAudit(context, 'private_video_upload_chunk_idempotent', {
        video: id,
        index,
        bytes: buffer.byteLength,
        store,
        hashMatched: !!(recordedHash && incomingHash && recordedHash === incomingHash)
      }, session);
      return jsonResponse({ ok: true, video: adminVideoSummary(meta), chunk: { index, bytes: buffer.byteLength, store, idempotent: true } });
    }
    let putResult;
    try {
      putResult = await putUploadedPrivateVideoChunk(env, id, index, buffer, meta.contentType);
    } catch (error) {
      const message = truncate(error && error.message ? error.message : error, 180);
      const errorCode = error && typeof error.code === 'string' ? error.code : 'chunk_write_failed';
      const publicMessage = error && typeof error.publicMessage === 'string' ? error.publicMessage : `分片写入失败：${message}`;
      const status = Number(error && error.status) || (errorCode === 'kv_daily_limit_exceeded' ? 429 : 503);
      const retryAfterSeconds = Math.max(0, Number(error && error.retryAfterSeconds) || (errorCode === 'kv_daily_limit_exceeded' ? 3600 : 0));
      queueAudit(context, 'private_video_upload_chunk_failed', { video: id, index, error: errorCode, message }, session);
      return jsonResponse(
        { ok: false, error: errorCode, message: publicMessage, retryAfterSeconds: retryAfterSeconds || undefined },
        { status, headers: retryAfterSeconds ? { 'Retry-After': String(retryAfterSeconds) } : {} }
      );
    }
    meta.chunkStores[key] = putResult.store;
    meta.chunkBytes[key] = buffer.byteLength;
    if (incomingHash) meta.chunkHashes[key] = incomingHash;
    meta.uploadedChunks = Array.from(new Set([...(meta.uploadedChunks || []), index])).sort((a, b) => a - b);
    meta.uploadedBytes = Object.values(meta.chunkBytes).reduce((sum, value) => sum + Number(value || 0), 0);
    meta.storage = putResult.store === 'kv' ? 'kv' : (meta.storage === 'kv' ? 'kv' : 'r2');
    meta.updatedAt = new Date().toISOString();
    const wrote = await writeUploadedPrivateVideoMeta(env, meta);
    if (!wrote) return jsonResponse({ ok: false, error: 'meta_update_failed', message: '分片已写入，但元数据更新失败，请重试该分片。' }, { status: 503 });
    queueAudit(context, 'private_video_upload_chunk', {
      video: id,
      index,
      bytes: buffer.byteLength,
      store: putResult.store,
      uploadedChunks: meta.uploadedChunks.length,
      chunks: meta.chunks,
      r2Fallback: putResult.r2Error || '',
      quotaRecovered: !!putResult.quotaRecovered
    }, session);
    return jsonResponse({ ok: true, video: adminVideoSummary(meta), chunk: { index, bytes: buffer.byteLength, store: putResult.store, idempotent: !!putResult.reused } });
  }

  const publishMatch = url.pathname.match(/^\/api\/admin\/private-videos\/([^/]+)\/publish$/);
  if (publishMatch) {
    if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    const id = normalizePrivateVideoId(decodeURIComponent(publishMatch[1]));
    const meta = await readUploadedPrivateVideoMeta(env, id);
    if (!meta || meta.status === 'archived') return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
    const body = await readJsonRequest(request) || {};
    const r2Available = !!(env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function');
    const limits = privateVideoAdminLimits(r2Available, { metadataWriteHealth: PRIVATE_VIDEO_METADATA_WRITE_HEALTH });
    if (!r2Available) return privateVideoMutationBlockedResponse('upload-publish', limits);
    const courseId = normalizePrivateVideoId(meta.courseId || meta.id);
    const metas = await listUploadedPrivateVideoMetas(env, true);
    const courseMetas = metas.filter((item) => normalizePrivateVideoId(item.courseId || item.id) === courseId);
    const requestedUsers = normalizePrivateAssignedUsers(body.assignedUsers || body.targetUsers || body.targetUsernames || meta.assignedUsers || []);
    const validation = validatePrivateCourseSegmentsForPublish(courseMetas, requestedUsers);
    if (!validation.ok) return jsonResponse({ ok: false, error: validation.error, message: validation.message, missing: validation.missing, missingSegments: validation.missingSegments, video: validation.video }, { status: validation.status });
    const assignedValidation = await validatePrivateAssignedStudent(env, validation.assignedUsers);
    if (!assignedValidation.ok) return jsonResponse({ ok: false, error: assignedValidation.error, message: assignedValidation.message }, { status: assignedValidation.status });
    const entitlements = normalizeEntitlementList(body.entitlements || meta.entitlements || []);
    for (const item of validation.segments) {
      const storageCheck = await verifyUploadedPrivateVideoStorage(env, item);
      if (!storageCheck.ok) return jsonResponse({ ok: false, error: storageCheck.error, message: storageCheck.message, missing: storageCheck.missing, video: storageCheck.video, chunk: storageCheck.chunk }, { status: storageCheck.status });
    }
    const now = new Date().toISOString();
    const published = [];
    for (const item of validation.segments) {
      item.assignedUsers = assignedValidation.assignedUsers;
      if (entitlements.length) item.entitlements = entitlements;
      item.status = 'published';
      item.publishedAt = item.publishedAt || now;
      item.updatedAt = now;
      item.publishedBy = session.username;
      const wrote = await writeUploadedPrivateVideoMeta(env, item);
      if (!wrote) return jsonResponse({ ok: false, error: 'publish_failed', message: '发布状态写入失败；未完整发布前学生端仍不可见。' }, { status: 503 });
      const indexSaved = await addPrivateVideoToIndex(env, item.id);
      if (!indexSaved) return jsonResponse({ ok: false, error: 'index_write_failed', message: '整节课已发布，但索引刷新失败。请稍后点“刷新专属课”。' }, { status: 503 });
      published.push(item);
    }
    const course = adminPrivateCourseSummary(published);
    queueAudit(context, 'private_video_upload_publish', {
      video: id,
      title: meta.title,
      assignedUsers: course.assignedUsers,
      entitlements,
      courseId,
      courseTitle: course.courseTitle,
      segmentIndex: Number(meta.segmentIndex || 0),
      segmentCount: Number(meta.segmentCount || 1),
      size: course.size,
      chunks: published.reduce((sum, item) => sum + Number(item.chunks || 0), 0),
      storage: course.storage,
      coursePublished: true
    }, session);
    return jsonResponse({ ok: true, video: adminVideoSummary(published.find((item) => item.id === id) || published[0]), course, videos: published.map(adminVideoSummary), limits, productionBlocker: limits.productionBlocker, productionAcceptance: limits.productionAcceptance });
  }

  const updateMatch = url.pathname.match(/^\/api\/admin\/private-videos\/([^/]+)\/access$/);
  if (updateMatch) {
    if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    const id = normalizePrivateVideoId(decodeURIComponent(updateMatch[1]));
    const meta = await readUploadedPrivateVideoMeta(env, id);
    if (!meta || meta.status === 'archived') return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
    const body = await readJsonRequest(request) || {};
    const r2Available = !!(env.FM_PRIVATE_MEDIA && typeof env.FM_PRIVATE_MEDIA.put === 'function');
    const limits = privateVideoAdminLimits(r2Available, { metadataWriteHealth: PRIVATE_VIDEO_METADATA_WRITE_HEALTH });
    let assignedUsers = normalizePrivateAssignedUsers(body.assignedUsers || body.targetUsers || body.targetUsernames || '');
    const assignedError = oneOnOneAssignedUserError(assignedUsers);
    if (assignedError) return jsonResponse({ ok: false, error: 'one_on_one_required', message: assignedError }, { status: 400 });
    const assignedValidation = await validatePrivateAssignedStudent(env, assignedUsers);
    if (!assignedValidation.ok) return jsonResponse({ ok: false, error: assignedValidation.error, message: assignedValidation.message }, { status: assignedValidation.status });
    assignedUsers = assignedValidation.assignedUsers;
    if (sameAssignedUsers(meta.assignedUsers || [], assignedUsers)) {
      queueAudit(context, 'private_video_access_noop', {
        video: id,
        assignedUsers: meta.assignedUsers || []
      }, session);
      return jsonResponse({
        ok: true,
        noop: true,
        video: adminVideoSummary(meta),
        limits,
        productionBlocker: limits.productionBlocker,
        productionAcceptance: limits.productionAcceptance,
        message: '授权学生没有变化，已保持当前设置。'
      });
    }
    if (!r2Available) return privateVideoMutationBlockedResponse('change-access', limits);
    const courseConflict = await findPrivateCourseAssignmentConflict(env, meta.courseId || meta.id, assignedUsers[0], id);
    if (courseConflict) {
      return jsonResponse({
        ok: false,
        error: 'course_assignment_conflict',
        message: '同一节一对一专属课的所有分段必须指定同一个学生账号。'
      }, { status: 409 });
    }
    meta.assignedUsers = assignedUsers;
    meta.entitlements = normalizeEntitlementList(body.entitlements || '');
    meta.updatedAt = new Date().toISOString();
    const wrote = await writeUploadedPrivateVideoMeta(env, meta);
    if (!wrote) return jsonResponse({ ok: false, error: 'access_update_failed', message: '权限更新失败。' }, { status: 503 });
    queueAudit(context, 'private_video_access_update', { video: id, assignedUsers: meta.assignedUsers, entitlements: meta.entitlements }, session);
    return jsonResponse({ ok: true, video: adminVideoSummary(meta), limits, productionBlocker: limits.productionBlocker, productionAcceptance: limits.productionAcceptance });
  }

  return jsonResponse({ ok: false, error: 'not_found' }, { status: 404 });
}

async function handleRegisterPage(context, session) {
  const { request } = context;
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get('next') || DEFAULT_ENTRY);
  if (request.method === 'HEAD') return htmlResponse('', { status: 200 });
  if (session) return edgeSessionBridgeResponse(session, context.env, next);
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
  return htmlResponse(renderRegister(next), {
    headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=300' }
  });
}

async function handleForgotPasswordPage(context, session) {
  const { request } = context;
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get('next') || DEFAULT_ENTRY);
  if (request.method === 'HEAD') return htmlResponse('', { status: 200 });
  if (session) return edgeSessionBridgeResponse(session, context.env, next);
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
  return htmlResponse(renderForgotPassword(next), {
    headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=300' }
  });
}

async function handleLockedPage(context, session) {
  const { request, env } = context;
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get('next') || DEFAULT_ENTRY);
  if (request.method === 'HEAD') return htmlResponse('', { status: 200 });
  if (!session) {
    return redirectResponse(new URL(`/_edge-login?next=${encodeURIComponent('/_edge-locked')}`, request.url).toString());
  }
  const devicePolicy = await enforceSessionDevicePolicy(context, session, 'locked_page');
  if (!devicePolicy.ok) {
    return redirectResponse(new URL(`/_edge-login?auth=device&next=${encodeURIComponent('/_edge-locked')}`, request.url).toString(), {
      'Set-Cookie': clearSessionHeader()
    });
  }
  if (await userHasSiteAccess(session, env)) {
    return edgeSessionBridgeResponse(session, env, next);
  }
  return htmlResponse(renderLocked(session, env), {
    status: 402,
    headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=300', 'Vary': 'Cookie' }
  });
}

function allowRegisterDevCode(context) {
  const { request, env } = context;
  return env.REGISTER_DEV_CODE === '1' || isLocalRequest(request);
}

async function handleSendRegisterCode(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  if (!env.FM_AUDIT) return jsonResponse({ ok: false, error: 'storage_not_configured', message: '注册存储未配置。' }, { status: 503 });
  const registerSecret = String(env.AUTH_COOKIE_SECRET || '');
  if (!registerSecret) {
    queueAudit(context, 'register_code_rejected', { reason: 'auth_secret_missing' });
    return jsonResponse({ ok: false, error: 'auth_secret_missing', message: '注册验证码安全配置缺失，请联系老师处理。' }, { status: 503 });
  }

  const body = await readJsonRequest(request);
  if (!body) return jsonResponse({ ok: false, error: 'invalid_json', message: '请求格式不正确。' }, { status: 400 });
  const username = normalizeUsername(body.username);
  const email = normalizeEmail(body.email);
  const auditMeta = extractClientAuditMeta(body);
  const emailHash = email ? await sha256Base64Url(email) : '';
  if (!username) {
    queueAudit(context, 'register_code_rejected', { reason: 'invalid_username', emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_username', message: '用户名格式不正确。' }, { status: 400 });
  }
  if (!email) {
    queueAudit(context, 'register_code_rejected', { reason: 'invalid_email', username, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_email', message: '邮箱格式不正确。' }, { status: 400 });
  }

  if (isAdminUsername(username, env)) {
    queueAudit(context, 'register_code_rejected', { reason: 'username_reserved', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'username_reserved', message: '这个用户名已被保留。' }, { status: 409 });
  }
  if (!registrationUsers(env).includes(username)) {
    const reserved = RESERVED_STUDENT_REGISTRATION_USERS.map(normalizeUsername).includes(username);
    queueAudit(context, 'register_code_rejected', { reason: reserved ? 'username_reserved' : 'registration_not_allowed', username, emailHash, ...auditMeta });
    return jsonResponse({
      ok: false,
      error: reserved ? 'username_reserved' : 'registration_not_allowed',
      message: reserved ? '这个账号由老师预配置，不开放自助注册。' : '这个账号还没有开放自助注册。'
    }, { status: 403 });
  }
  const accessBeforeRegister = await studentAccessStatus(env, username);
  if (!accessBeforeRegister.ok) {
    queueAudit(context, 'register_code_rejected', { reason: accessBeforeRegister.reason, username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'student_locked', message: '这个账号还没有开放学习权限。' }, { status: 403 });
  }
  if (await readUserAccount(env, username)) {
    queueAudit(context, 'register_code_rejected', { reason: 'username_exists', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'username_exists', message: '这个用户名已经注册。' }, { status: 409 });
  }
  const emailOwner = await readJsonKv(env.FM_AUDIT, `account-email:${email}`, null);
  if (emailOwner) {
    queueAudit(context, 'register_code_rejected', { reason: 'email_exists', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'email_exists', message: '这个邮箱已经注册。' }, { status: 409 });
  }

  const userRate = await consumeSimpleRate(env, registerUserRateKey(username, email), REGISTER_CODE_MAX_PER_WINDOW, REGISTER_CODE_WINDOW_SECONDS);
  const ipRate = await consumeSimpleRate(env, registerIpRateKey(request), REGISTER_CODE_IP_MAX_PER_WINDOW, REGISTER_CODE_WINDOW_SECONDS);
  if (!userRate.ok || !ipRate.ok) {
    const retryAfter = Math.max(userRate.retryAfter || 0, ipRate.retryAfter || 0);
    queueAudit(context, 'register_code_rejected', { reason: 'rate_limited', username, emailHash, retryAfter, ...auditMeta });
    return jsonResponse({ ok: false, error: 'rate_limited', message: `发送太频繁，请 ${Math.ceil(retryAfter / 60)} 分钟后再试。` }, {
      status: 429,
      headers: { 'Retry-After': String(retryAfter) }
    });
  }

  const code = sixDigitCode();
  queueAudit(context, 'register_code_request', { username, emailHash, ...auditMeta });
  const codeStored = await writeJsonKv(env.FM_AUDIT, registerCodeKey(username, email), {
    hash: await sha256Base64Url(`${username}:${email}:${code}:${env.AUTH_COOKIE_SECRET || ''}`),
    createdAt: Date.now(),
    attempts: 0,
    provider: 'pending'
  }, REGISTER_CODE_TTL_SECONDS);
  if (!codeStored) {
    queueAudit(context, 'register_code_rejected', { reason: 'storage_write_failed', username, emailHash, ...auditMeta });
    return jsonResponse({
      ok: false,
      error: 'register_storage_busy',
      message: '注册存储暂时繁忙，请稍后再发送验证码。'
    }, { status: 503 });
  }

  const sent = await sendVerificationEmail(context, email, code, username);
  if (!sent.ok) {
    try {
      await env.FM_AUDIT.delete(registerCodeKey(username, email));
    } catch (_) {}
    queueAudit(context, 'register_email_failed', { username, emailHash, error: sent.error, status: sent.status || 0, detail: sent.detail || '', ...auditMeta });
    const message = sent.error === 'email_not_configured'
      ? '验证码邮件服务还没有配置完成。'
      : `验证码邮件发送失败：${sent.detail || sent.error || '邮件服务异常'}`;
    return jsonResponse({ ok: false, error: sent.error || 'email_failed', message }, { status: 503 });
  }

  await writeJsonKv(env.FM_AUDIT, registerCodeKey(username, email), {
    hash: await sha256Base64Url(`${username}:${email}:${code}:${env.AUTH_COOKIE_SECRET || ''}`),
    createdAt: Date.now(),
    attempts: 0,
    provider: sent.provider
  }, REGISTER_CODE_TTL_SECONDS);
  queueAudit(context, 'register_code_sent', { username, emailHash, provider: sent.provider, ...auditMeta });
  return jsonResponse({
    ok: true,
    message: '验证码已发送。',
    expiresIn: REGISTER_CODE_TTL_SECONDS,
    devCode: allowRegisterDevCode(context) ? sent.devCode : undefined
  });
}

async function handleRegisterAccountUnsafe(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  if (!env.FM_AUDIT) return jsonResponse({ ok: false, error: 'storage_not_configured', message: '注册存储未配置。' }, { status: 503 });
  if (!env.AUTH_COOKIE_SECRET) return jsonResponse({ ok: false, error: 'auth_not_configured', message: '登录密钥未配置。' }, { status: 503 });

  const body = await readJsonRequest(request);
  if (!body) return jsonResponse({ ok: false, error: 'invalid_json', message: '请求格式不正确。' }, { status: 400 });
  const username = normalizeUsername(body.username);
  const email = normalizeEmail(body.email);
  const code = String(body.code || '').trim();
  const password = String(body.password || '');
  const target = safeNext(body.next || DEFAULT_ENTRY);
  const auditMeta = extractClientAuditMeta(body);
  const emailHash = email ? await sha256Base64Url(email) : '';

  if (!username) {
    queueAudit(context, 'register_rejected', { reason: 'invalid_username', emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_username', message: '用户名格式不正确。' }, { status: 400 });
  }
  if (!email) {
    queueAudit(context, 'register_rejected', { reason: 'invalid_email', username, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_email', message: '邮箱格式不正确。' }, { status: 400 });
  }
  if (!/^\d{6}$/.test(code)) {
    queueAudit(context, 'register_rejected', { reason: 'invalid_code', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_code', message: '验证码应为 6 位数字。' }, { status: 400 });
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    queueAudit(context, 'register_rejected', { reason: 'weak_password', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'weak_password', message: `密码至少 ${PASSWORD_MIN_LENGTH} 位。` }, { status: 400 });
  }

  if (isAdminUsername(username, env)) {
    queueAudit(context, 'register_rejected', { reason: 'username_reserved', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'username_reserved', message: '这个用户名已被保留。' }, { status: 409 });
  }
  if (!registrationUsers(env).includes(username)) {
    const reserved = RESERVED_STUDENT_REGISTRATION_USERS.map(normalizeUsername).includes(username);
    queueAudit(context, 'register_rejected', { reason: reserved ? 'username_reserved' : 'registration_not_allowed', username, emailHash, ...auditMeta });
    return jsonResponse({
      ok: false,
      error: reserved ? 'username_reserved' : 'registration_not_allowed',
      message: reserved ? '这个账号由老师预配置，不开放自助注册。' : '这个账号还没有开放自助注册。'
    }, { status: 403 });
  }
  const accessBeforeRegister = await studentAccessStatus(env, username);
  if (!accessBeforeRegister.ok) {
    queueAudit(context, 'register_rejected', { reason: accessBeforeRegister.reason, username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'student_locked', message: '这个账号还没有开放学习权限。' }, { status: 403 });
  }
  const existingAccount = await readUserAccount(env, username);
  if (existingAccount) {
    const sameEmail = normalizeEmail(existingAccount.email || '') === email;
    if (sameEmail && existingAccount.password && await verifyPassword(password, existingAccount.password)) {
      const sessionVersion = ensureAccountPasswordSessionVersion(existingAccount);
      if (sessionVersion) {
        existingAccount.lastLoginAt = new Date().toISOString();
        const savedSessionVersion = await writeUserAccount(env, username, existingAccount);
        if (!savedSessionVersion) {
          return jsonResponse({ ok: false, error: 'account_write_failed', message: '账号会话版本保存失败，请稍后再试。' }, { status: 503 });
        }
      }
      const deviceGate = await enforceDevicePolicyForLogin(context, username, auditMeta, 'register_idempotent');
      if (!deviceGate.ok) {
        return jsonResponse({ ok: false, error: deviceGate.error, message: deviceGate.message }, { status: 409 });
      }
      const cookie = await createSessionCookie(username, env, {
        deviceId: deviceGate.deviceIdentity.deviceId,
        deviceLabel: deviceGate.binding && deviceGate.binding.label ? deviceGate.binding.label : deviceGate.deviceIdentity.label,
        browserSessionId: deviceGate.deviceIdentity.browserSessionId,
        sessionNonce: deviceGate.binding && deviceGate.binding.sessionNonce ? deviceGate.binding.sessionNonce : '',
        passwordSessionVersion: sessionVersion
      });
      const access = await studentAccessStatus(env, username);
      const next = access.ok ? target : '/_edge-locked';
      queueAudit(context, 'register_idempotent_success', { username, emailHash, access: existingAccount.access || '', ...auditMeta }, { username });
      return jsonResponse({ ok: true, username, access: existingAccount.access || 'locked', next }, {
        headers: { 'Set-Cookie': setSessionHeader(cookie) }
      });
    }
    queueAudit(context, 'register_rejected', { reason: 'username_exists', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'username_exists', message: '这个用户名已经注册。' }, { status: 409 });
  }
  const emailOwner = await readJsonKv(env.FM_AUDIT, `account-email:${email}`, null);
  if (emailOwner && emailOwner.username && emailOwner.username !== username) {
    queueAudit(context, 'register_rejected', { reason: 'email_exists', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'email_exists', message: '这个邮箱已经注册。' }, { status: 409 });
  }

  const key = registerCodeKey(username, email);
  const stored = await readJsonKv(env.FM_AUDIT, key, null);
  const expectedHash = await sha256Base64Url(`${username}:${email}:${code}:${env.AUTH_COOKIE_SECRET || ''}`);
  if (!stored || !stored.hash || !timingSafeEqual(stored.hash, expectedHash)) {
    if (stored) {
      stored.attempts = Number(stored.attempts || 0) + 1;
      if (stored.attempts >= 6) {
        try {
          await env.FM_AUDIT.delete(key);
        } catch (_) {}
      }
      else await writeJsonKv(env.FM_AUDIT, key, stored, REGISTER_CODE_TTL_SECONDS);
    }
    queueAudit(context, 'register_rejected', { reason: 'code_mismatch', username, emailHash, attempts: stored ? Number(stored.attempts || 0) : 0, ...auditMeta });
    return jsonResponse({ ok: false, error: 'code_mismatch', message: '验证码不正确或已过期。' }, { status: 400 });
  }

  const isQi = username === 'qi';
  const access = await studentAccessStatus(env, username);
  const account = {
    username,
    email,
    name: username,
    role: 'student',
    access: access.ok ? 'active' : 'locked',
    purchased: access.ok,
    entitlements: access.ok ? ['site'].concat(isQi ? [`private-video:${PRIVATE_QI_VIDEO_ID}`] : []) : [],
    password: await createPasswordRecord(password),
    passwordSessionVersion: randomBase64Url(18),
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
  const accountWritten = await writeUserAccount(env, username, account);
  if (!accountWritten) throw new Error('account_write_failed');
  const deviceGate = await enforceDevicePolicyForLogin(context, username, auditMeta, 'register');
  if (!deviceGate.ok) {
    return jsonResponse({ ok: false, error: deviceGate.error, message: deviceGate.message }, { status: 409 });
  }
  try {
    await env.FM_AUDIT.delete(key);
  } catch (error) {
    queueAudit(context, 'register_code_cleanup_failed', { username, emailHash, error: truncate(error && error.message ? error.message : error, 160), ...auditMeta }, { username });
  }
  const cookie = await createSessionCookie(username, env, {
    deviceId: deviceGate.deviceIdentity.deviceId,
    deviceLabel: deviceGate.binding && deviceGate.binding.label ? deviceGate.binding.label : deviceGate.deviceIdentity.label,
    browserSessionId: deviceGate.deviceIdentity.browserSessionId,
    sessionNonce: deviceGate.binding && deviceGate.binding.sessionNonce ? deviceGate.binding.sessionNonce : '',
    passwordSessionVersion: accountPasswordSessionVersion(account)
  });
  const next = access.ok ? target : '/_edge-locked';
  queueAudit(context, 'register_success', { username, emailHash, access: account.access, ...auditMeta }, { username });
  return jsonResponse({ ok: true, username, access: account.access, next }, {
    headers: { 'Set-Cookie': setSessionHeader(cookie) }
  });
}

async function handleRegisterAccount(context) {
  try {
    return await handleRegisterAccountUnsafe(context);
  } catch (error) {
    const message = truncate(error && error.message ? error.message : error, 180);
    queueAudit(context, 'register_account_error', { error: message });
    return jsonResponse({
      ok: false,
      error: 'register_failed',
      message: `注册提交失败：${message || '服务端临时异常'}。请不要重新发送验证码，直接再点一次创建账号；如果还失败，把这条提示发给我。`
    }, { status: 500 });
  }
}

function passwordResetSentResponse(devCode) {
  return jsonResponse({
    ok: true,
    message: '如果账号和邮箱匹配，验证码会发送到登记邮箱。',
    expiresIn: PASSWORD_RESET_CODE_TTL_SECONDS,
    devCode: devCode || undefined
  });
}

function allowPasswordResetDevCode(context) {
  const { request, env } = context;
  return env.PASSWORD_RESET_DEV_CODE === '1' || isLocalRequest(request);
}

async function handleSendPasswordResetCode(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  if (!env.FM_AUDIT) return jsonResponse({ ok: false, error: 'storage_not_configured', message: '账号存储未配置，暂时不能重置密码。' }, { status: 503 });
  const resetSecret = String(env.AUTH_COOKIE_SECRET || '');
  if (!resetSecret) {
    queueAudit(context, 'password_reset_code_rejected', { reason: 'auth_secret_missing' });
    return jsonResponse({ ok: false, error: 'auth_secret_missing', message: '密码重置安全配置缺失，请联系老师处理。' }, { status: 503 });
  }

  const body = await readJsonRequest(request);
  if (!body) return jsonResponse({ ok: false, error: 'invalid_json', message: '请求格式不正确。' }, { status: 400 });
  const username = normalizeUsername(body.username);
  const email = normalizeEmail(body.email);
  const auditMeta = extractClientAuditMeta(body);
  const emailHash = email ? await sha256Base64Url(email) : '';

  if (!username) {
    queueAudit(context, 'password_reset_code_rejected', { reason: 'invalid_username', emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_username', message: '用户名格式不正确。' }, { status: 400 });
  }
  if (!email) {
    queueAudit(context, 'password_reset_code_rejected', { reason: 'invalid_email', username, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_email', message: '邮箱格式不正确。' }, { status: 400 });
  }

  const userRate = await consumeSimpleRate(env, passwordResetUserRateKey(username, email), PASSWORD_RESET_CODE_MAX_PER_WINDOW, PASSWORD_RESET_CODE_WINDOW_SECONDS);
  const ipRate = await consumeSimpleRate(env, passwordResetIpRateKey(request), PASSWORD_RESET_CODE_IP_MAX_PER_WINDOW, PASSWORD_RESET_CODE_WINDOW_SECONDS);
  if (!userRate.ok || !ipRate.ok) {
    const retryAfter = Math.max(userRate.retryAfter || 0, ipRate.retryAfter || 0);
    queueAudit(context, 'password_reset_code_rejected', { reason: 'rate_limited', username, emailHash, retryAfter, ...auditMeta });
    return jsonResponse({ ok: false, error: 'rate_limited', message: `发送太频繁，请 ${Math.ceil(retryAfter / 60)} 分钟后再试。` }, {
      status: 429,
      headers: { 'Retry-After': String(retryAfter) }
    });
  }

  const accountState = await readUserAccountAuthState(env, username);
  if (!accountState.ok) {
    queueAudit(context, 'password_reset_code_rejected', { reason: accountState.error || 'account_lookup_failed', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'account_lookup_failed', message: '账号存储暂时不可用，请稍后再试。' }, { status: 503 });
  }
  const eligibility = passwordResetEligibility(env, username, accountState.account, email);
  if (!eligibility.ok) {
    queueAudit(context, 'password_reset_code_rejected', { reason: eligibility.reason, username, emailHash, ...auditMeta });
    return passwordResetSentResponse();
  }

  const code = sixDigitCode();
  const key = passwordResetCodeKey(username, email);
  const hash = await sha256Base64Url(`password-reset:${username}:${email}:${code}:${resetSecret}`);
  queueAudit(context, 'password_reset_code_request', { username, emailHash, ...auditMeta });
  const codeStored = await writeJsonKv(env.FM_AUDIT, key, {
    hash,
    createdAt: Date.now(),
    attempts: 0,
    provider: 'pending'
  }, PASSWORD_RESET_CODE_TTL_SECONDS);
  if (!codeStored) {
    queueAudit(context, 'password_reset_code_rejected', { reason: 'storage_write_failed', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'reset_storage_busy', message: '验证码暂时无法保存，请 1 分钟后重试；如果还不行，让老师在教师后台给这个学生账号设置临时密码。' }, { status: 503 });
  }

  const sent = await sendVerificationEmail(context, email, code, username, { purpose: 'password-reset' });
  if (!sent.ok) {
    try {
      await env.FM_AUDIT.delete(key);
    } catch (_) {}
    queueAudit(context, 'password_reset_email_failed', { username, emailHash, error: sent.error, status: sent.status || 0, detail: sent.detail || '', ...auditMeta });
    const message = sent.error === 'email_not_configured'
      ? '验证码邮件服务还没有配置完成。'
      : `验证码邮件发送失败：${sent.detail || sent.error || '邮件服务异常'}`;
    return jsonResponse({ ok: false, error: sent.error || 'email_failed', message }, { status: 503 });
  }

  await writeJsonKv(env.FM_AUDIT, key, {
    hash,
    createdAt: Date.now(),
    attempts: 0,
    provider: sent.provider
  }, PASSWORD_RESET_CODE_TTL_SECONDS);
  queueAudit(context, 'password_reset_code_sent', { username, emailHash, provider: sent.provider, ...auditMeta });
  return passwordResetSentResponse(allowPasswordResetDevCode(context) ? sent.devCode : undefined);
}

async function handleConfirmPasswordReset(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  if (!env.FM_AUDIT) return jsonResponse({ ok: false, error: 'storage_not_configured', message: '账号存储未配置，暂时不能重置密码。' }, { status: 503 });
  const resetSecret = String(env.AUTH_COOKIE_SECRET || '');
  if (!resetSecret) {
    queueAudit(context, 'password_reset_rejected', { reason: 'auth_secret_missing' });
    return jsonResponse({ ok: false, error: 'auth_secret_missing', message: '密码重置安全配置缺失，请联系老师处理。' }, { status: 503 });
  }

  const body = await readJsonRequest(request);
  if (!body) return jsonResponse({ ok: false, error: 'invalid_json', message: '请求格式不正确。' }, { status: 400 });
  const username = normalizeUsername(body.username);
  const email = normalizeEmail(body.email);
  const code = String(body.code || '').trim();
  const nextPassword = String(body.newPassword || body.password || '');
  const confirmPassword = String(body.confirmPassword || body.confirm || nextPassword);
  const target = safeNext(body.next || DEFAULT_ENTRY);
  const auditMeta = extractClientAuditMeta(body);
  const emailHash = email ? await sha256Base64Url(email) : '';

  if (!username) {
    queueAudit(context, 'password_reset_rejected', { reason: 'invalid_username', emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_username', message: '用户名格式不正确。' }, { status: 400 });
  }
  if (!email) {
    queueAudit(context, 'password_reset_rejected', { reason: 'invalid_email', username, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_email', message: '邮箱格式不正确。' }, { status: 400 });
  }
  if (!/^\d{6}$/.test(code)) {
    queueAudit(context, 'password_reset_rejected', { reason: 'invalid_code', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'invalid_code', message: '验证码应为 6 位数字。' }, { status: 400 });
  }
  if (nextPassword.length < PASSWORD_MIN_LENGTH) {
    queueAudit(context, 'password_reset_rejected', { reason: 'weak_password', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'weak_password', message: `新密码至少 ${PASSWORD_MIN_LENGTH} 位。` }, { status: 400 });
  }
  if (nextPassword !== confirmPassword) {
    queueAudit(context, 'password_reset_rejected', { reason: 'password_mismatch', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'password_mismatch', message: '两次输入的新密码不一致。' }, { status: 400 });
  }

  const accountState = await readUserAccountAuthState(env, username);
  if (!accountState.ok) {
    queueAudit(context, 'password_reset_rejected', { reason: accountState.error || 'account_lookup_failed', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'account_lookup_failed', message: '账号存储暂时不可用，请稍后再试。' }, { status: 503 });
  }
  const eligibility = passwordResetEligibility(env, username, accountState.account, email);
  if (!eligibility.ok) {
    queueAudit(context, 'password_reset_rejected', { reason: eligibility.reason, username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'code_mismatch', message: '验证码不正确或已过期。' }, { status: 400 });
  }

  const key = passwordResetCodeKey(username, email);
  const stored = await readJsonKv(env.FM_AUDIT, key, null);
  const expectedHash = await sha256Base64Url(`password-reset:${username}:${email}:${code}:${resetSecret}`);
  if (!stored || !stored.hash || !timingSafeEqual(stored.hash, expectedHash)) {
    if (stored) {
      stored.attempts = Number(stored.attempts || 0) + 1;
      if (stored.attempts >= 6) {
        try {
          await env.FM_AUDIT.delete(key);
        } catch (_) {}
      } else {
        await writeJsonKv(env.FM_AUDIT, key, stored, PASSWORD_RESET_CODE_TTL_SECONDS);
      }
    }
    queueAudit(context, 'password_reset_rejected', { reason: 'code_mismatch', username, emailHash, attempts: stored ? Number(stored.attempts || 0) : 0, ...auditMeta });
    return jsonResponse({ ok: false, error: 'code_mismatch', message: '验证码不正确或已过期。' }, { status: 400 });
  }

  const passwordReuse = await validateNewAccountPassword(env, username, nextPassword, accountState.account);
  if (!passwordReuse.ok) {
    queueAudit(context, 'password_reset_rejected', { reason: passwordReuse.error, username, emailHash, ...auditMeta });
    return jsonResponse(passwordReuse, { status: 400 });
  }
  const updatedAccount = await updateAccountPassword(env, username, nextPassword, { username, source: 'password-reset' });
  if (!updatedAccount) {
    queueAudit(context, 'password_reset_rejected', { reason: 'write_failed', username, emailHash, ...auditMeta });
    return jsonResponse({ ok: false, error: 'write_failed', message: '密码保存失败，请稍后再试。' }, { status: 500 });
  }
  try {
    await env.FM_AUDIT.delete(key);
  } catch (_) {}
  queueAudit(context, 'password_reset_success', { username, emailHash, sessionsRevoked: true, ...auditMeta }, { username });
  return jsonResponse({
    ok: true,
    username,
    sessionsRevoked: true,
    next: `/_edge-login?next=${encodeURIComponent(target)}`,
    message: '密码已重置，请用新密码登录。'
  });
}

async function handleAuthMe(context, session) {
  if (!session) return jsonResponse({ ok: false, authenticated: false }, { status: 401 });
  const devicePolicy = await enforceSessionDevicePolicy(context, session, 'auth_me');
  if (!devicePolicy.ok) {
    return jsonResponse({ ok: false, authenticated: false, error: devicePolicy.error, message: devicePolicy.message }, {
      status: 409,
      headers: { 'Set-Cookie': clearSessionHeader() }
    });
  }
  const accessState = await userSiteAccessState(session, context.env);
  const access = accessState.ok;
  const canViewQiVideo = await userCanViewPrivateQiVideo(session, context.env);
  const privateVideos = access ? await privateVideoItems(session, context.env) : [];
  const normalizedSessionUser = normalizeUsername(session.username);
  const qaTeacherUsers = splitList(context.env.QA_TEACHER_USERS)
    .map(normalizeUsername)
    .filter(Boolean);
  const qaStudentUsers = splitList(context.env.QA_STUDENT_USERS)
    .map(normalizeUsername)
    .filter(Boolean);
  const qaKind = qaTeacherUsers.includes(normalizedSessionUser)
    ? 'qa-teacher'
    : (qaStudentUsers.includes(normalizedSessionUser) ? 'qa-student' : '');
  return jsonResponse({
    ok: true,
    authenticated: true,
    user: {
      username: session.username,
      role: isAdmin(session, context.env) ? 'teacher' : 'student',
      qaAccount: Boolean(qaKind),
      qaKind,
      access: access ? 'active' : 'locked',
      accessReason: accessState.reason || (access ? 'active' : 'not_allowed'),
      canViewQiVideo,
      canViewPrivateVideos: canViewQiVideo || privateVideos.length > 0,
      privateVideoIds: privateVideos.map((video) => video.id),
      devicePolicy: devicePolicy.policy || null,
      boundDeviceId: devicePolicy.binding ? devicePolicy.binding.deviceId : (session.deviceId || ''),
      boundDeviceShortId: devicePolicy.binding ? devicePolicy.binding.shortDeviceId : shortDeviceId(session.deviceId || ''),
      boundDeviceLabel: devicePolicy.binding ? devicePolicy.binding.label : (session.deviceLabel || ''),
      sessionDeviceId: session.deviceId || '',
      sessionDeviceShortId: shortDeviceId(session.deviceId || '')
    }
  });
}

async function handleLogin(context, session) {
  const { request, env } = context;
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get('next') || '/');

  if (request.method === 'HEAD') {
    if (session) return redirectResponse(new URL(next, request.url).toString());
    return loginPageResponse(next, '', { status: 200, omitBody: true });
  }

  if (request.method === 'GET') {
    if (session) return edgeSessionBridgeResponse(session, env, next);
    return loginPageResponse(next);
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {
        Allow: 'GET, HEAD, POST',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        'X-Fluid-Login-Response': 'method-not-allowed'
      }
    });
  }

  const form = new URLSearchParams(await request.text());
  const username = String(form.get('username') || '').trim();
  const password = String(form.get('password') || '');
  const target = safeNext(form.get('next') || next);
  const browserSessionId = String(form.get('browserSessionId') || '').trim().slice(0, 120);
  const deviceFingerprint = normalizeDeviceId(form.get('deviceFingerprint'));
  let deviceProfile = null;
  const deviceProfileRaw = String(form.get('deviceProfile') || '').trim();
  if (deviceProfileRaw) {
    try {
      deviceProfile = JSON.parse(deviceProfileRaw);
    } catch (_) {
      deviceProfile = null;
    }
  }
  const rate = await checkLoginRate(env, request, username);

  if (!rate.ok) {
    queueAudit(context, 'login_blocked', {
      username: truncate(username, 80),
      retryAfter: rate.retryAfter,
      browserSessionId,
      deviceProfile,
      deviceFingerprint
    });
    return loginPageResponse(target, `登录尝试过多，请 ${Math.ceil(rate.retryAfter / 60)} 分钟后再试。`, {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfter) }
    });
  }

  const normalized = normalizeUsername(username);
  let account = null;
  let ok = false;
  let loginUsername = username;
  let passwordSessionVersion = '';
  let staticEnvFallback = false;

  const staticCredential = staticCredentialForUsername(env, normalized);
  const staticAccountState = normalized && staticCredential
    ? await readUserAccountAuthState(env, normalized)
    : { ok: true, account: null };
  const isStaticEnvUsername = !!(normalized && staticCredential);
  const staticStoredAccount = staticAccountState.ok ? staticAccountState.account : null;
  if (isStaticEnvUsername && staticStoredAccount && staticStoredAccount.disabled) {
    queueAudit(context, 'login_failed', {
      username: truncate(username, 80),
      reason: 'account_disabled',
      browserSessionId,
      deviceProfile,
      deviceFingerprint
    });
    return loginPageResponse(target, '这个账号已停用，请联系网站所有人。', { status: 403 });
  }
  const storedPasswordOverridesStatic = isStaticEnvUsername &&
    !!(staticStoredAccount && !staticStoredAccount.disabled && staticStoredAccount.password);
  if (normalized) {
    account = staticStoredAccount && staticStoredAccount.password
      ? await verifyStoredAccountRecordPassword(env, normalized, staticStoredAccount, password)
      : staticAccountState.ok
        ? await verifyStoredAccountPassword(env, normalized, password)
        : false;
    if (account) {
      ok = true;
      loginUsername = normalized;
      passwordSessionVersion = accountPasswordSessionVersion(account);
    }
  }
  if (!ok && !storedPasswordOverridesStatic && staticCredential && staticCredential.password &&
    timingSafeEqual(password, staticCredential.password)) {
    ok = true;
    loginUsername = normalized || username;
    staticEnvFallback = true;
    passwordSessionVersion = await staticAccountSessionVersion(env, loginUsername);
  }

  if (!ok) {
    const nextRate = await recordLoginFailure(env, rate);
    queueAudit(context, 'login_failed', { username: truncate(username, 80), browserSessionId, deviceProfile, deviceFingerprint });
    const remaining = nextRate.lockedUntil ? 0 : Math.max(0, LOGIN_MAX_FAILURES - nextRate.failures.length);
    return loginPageResponse(target, remaining ? `用户名或密码不正确。剩余 ${remaining} 次尝试。` : '登录尝试过多，请稍后再试。', { status: 401 });
  }

  const deviceGate = await enforceDevicePolicyForLogin(context, loginUsername, {
    browserSessionId,
    deviceProfile,
    deviceFingerprint
  }, 'login');
  if (!deviceGate.ok) {
    return loginPageResponse(target, deviceGate.message, { status: 409 });
  }
  await resetLoginRate(env, rate.key, rate.ipKey);
  const cookie = await createSessionCookie(loginUsername, env, {
    deviceId: deviceGate.deviceIdentity.deviceId,
    deviceLabel: deviceGate.binding && deviceGate.binding.label ? deviceGate.binding.label : deviceGate.deviceIdentity.label,
    browserSessionId: deviceGate.deviceIdentity.browserSessionId,
    sessionNonce: deviceGate.binding && deviceGate.binding.sessionNonce ? deviceGate.binding.sessionNonce : '',
    passwordSessionVersion
  });
  queueAudit(context, 'login_success', { target, browserSessionId, deviceProfile, deviceFingerprint, staticEnvFallback }, { username: loginUsername });
  return edgeSessionBridgeResponse({
    username: loginUsername,
    deviceId: deviceGate.deviceIdentity.deviceId,
    deviceLabel: deviceGate.binding && deviceGate.binding.label ? deviceGate.binding.label : deviceGate.deviceIdentity.label,
    browserSessionId: deviceGate.deviceIdentity.browserSessionId,
    sessionNonce: deviceGate.binding && deviceGate.binding.sessionNonce ? deviceGate.binding.sessionNonce : ''
  }, env, target, {
    headers: { 'Set-Cookie': setSessionHeader(cookie) }
  });
}

async function handleChangePassword(context, session) {
  const { request, env } = context;
  if (!session || !session.username) {
    return jsonResponse({ ok: false, error: 'authentication_required', message: '请先登录后再修改密码。' }, { status: 401 });
  }
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  }

  const deviceGate = await enforceSessionDevicePolicy(context, session, 'password_change');
  if (!deviceGate.ok) {
    return jsonResponse({ ok: false, error: deviceGate.error, message: deviceGate.message }, {
      status: 409,
      headers: { 'Set-Cookie': clearSessionHeader() }
    });
  }
  if (!env.FM_AUDIT) {
    return jsonResponse({ ok: false, error: 'storage_not_configured', message: '账号存储未配置，暂时不能在线改密码。' }, { status: 503 });
  }

  const body = await readJsonRequest(request);
  if (!body) return jsonResponse({ ok: false, error: 'invalid_json', message: '请求格式不正确。' }, { status: 400 });
  const currentPassword = String(body.currentPassword || body.oldPassword || '');
  const nextPassword = String(body.newPassword || body.password || '');
  const confirmPassword = String(body.confirmPassword || body.confirm || nextPassword);
  if (!currentPassword) {
    return jsonResponse({ ok: false, error: 'current_password_required', message: '请先输入当前密码。' }, { status: 400 });
  }
  if (nextPassword.length < PASSWORD_MIN_LENGTH) {
    return jsonResponse({ ok: false, error: 'weak_password', message: `新密码至少 ${PASSWORD_MIN_LENGTH} 位。` }, { status: 400 });
  }
  if (nextPassword !== confirmPassword) {
    return jsonResponse({ ok: false, error: 'password_mismatch', message: '两次输入的新密码不一致。' }, { status: 400 });
  }
  if (nextPassword === currentPassword) {
    return jsonResponse({ ok: false, error: 'password_unchanged', message: '新密码不能和当前密码完全一样。' }, { status: 400 });
  }

  const username = normalizeUsername(session.username);
  const accountState = await readUserAccountAuthState(env, username);
  if (!accountState.ok) {
    queueAudit(context, 'password_change_rejected', { reason: 'account_lookup_failed' }, session);
    return jsonResponse({ ok: false, error: 'account_lookup_failed', message: '账号存储暂时不可用，旧密码不会被恢复，请稍后再试。' }, { status: 503 });
  }
  const account = accountState.account;
  const verified = !!(account && !account.disabled && account.password && await verifyPassword(currentPassword, account.password));
  if (!verified) {
    queueAudit(context, 'password_change_rejected', { reason: 'bad_current_password' }, session);
    return jsonResponse({ ok: false, error: 'bad_current_password', message: '当前密码不正确。' }, { status: 403 });
  }
  const passwordReuse = await validateNewAccountPassword(env, username, nextPassword, account);
  if (!passwordReuse.ok) {
    queueAudit(context, 'password_change_rejected', { reason: passwordReuse.error }, session);
    return jsonResponse(passwordReuse, { status: 400 });
  }
  const updatedAccount = await updateAccountPassword(env, username, nextPassword, session);
  if (!updatedAccount) {
    queueAudit(context, 'password_change_rejected', { reason: 'write_failed' }, session);
    return jsonResponse({ ok: false, error: 'write_failed', message: '密码保存失败，请稍后再试。' }, { status: 500 });
  }
  const sessionDeviceIdentity = deviceGate.deviceIdentity || {};
  const sessionBinding = deviceGate.binding || {};
  const cookie = await createSessionCookie(username, env, {
    deviceId: session.deviceId || sessionDeviceIdentity.deviceId || '',
    deviceLabel: session.deviceLabel || sessionBinding.label || sessionDeviceIdentity.label || '',
    browserSessionId: session.browserSessionId || sessionDeviceIdentity.browserSessionId || '',
    sessionNonce: session.sessionNonce || sessionBinding.sessionNonce || '',
    passwordSessionVersion: accountPasswordSessionVersion(updatedAccount)
  });
  queueAudit(context, 'password_changed', { username, sessionsRevoked: true }, session);
  return jsonResponse({
    ok: true,
    username,
    sessionsRevoked: true,
    message: '密码已更新，旧密码和旧登录会话已失效。'
  }, {
    headers: { 'Set-Cookie': setSessionHeader(cookie) }
  });
}

async function handleRevokeSessions(context, session) {
  const { request, env } = context;
  if (!session || !session.username) {
    return jsonResponse({ ok: false, error: 'authentication_required', message: '请先登录后再撤销会话。' }, { status: 401 });
  }
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  }
  const deviceGate = await enforceSessionDevicePolicy(context, session, 'session_revoke');
  if (!deviceGate.ok) {
    return jsonResponse({ ok: false, error: deviceGate.error, message: deviceGate.message }, {
      status: 409,
      headers: { 'Set-Cookie': clearSessionHeader() }
    });
  }
  if (!env.FM_AUDIT) {
    return jsonResponse({ ok: false, error: 'storage_not_configured', message: '账号存储未配置，暂时不能撤销会话。' }, { status: 503 });
  }

  const body = await readJsonRequest(request);
  if (!body) return jsonResponse({ ok: false, error: 'invalid_json', message: '请求格式不正确。' }, { status: 400 });
  const currentPassword = String(body.currentPassword || body.password || '');
  if (!currentPassword) {
    return jsonResponse({ ok: false, error: 'current_password_required', message: '请先输入当前密码。' }, { status: 400 });
  }

  const username = normalizeUsername(session.username);
  const accountState = await readUserAccountAuthState(env, username);
  if (!accountState.ok) {
    queueAudit(context, 'session_revoke_rejected', { reason: 'account_lookup_failed' }, session);
    return jsonResponse({ ok: false, error: 'account_lookup_failed', message: '账号存储暂时不可用，旧会话不会被恢复，请稍后再试。' }, { status: 503 });
  }
  const account = accountState.account;
  const verified = !!(account && !account.disabled && account.password && await verifyPassword(currentPassword, account.password));
  if (!verified) {
    queueAudit(context, 'session_revoke_rejected', { reason: 'bad_current_password' }, session);
    return jsonResponse({ ok: false, error: 'bad_current_password', message: '当前密码不正确。' }, { status: 403 });
  }
  const updatedAccount = await rotateAccountSessionVersion(env, username, session);
  if (!updatedAccount) {
    queueAudit(context, 'session_revoke_rejected', { reason: 'write_failed' }, session);
    return jsonResponse({ ok: false, error: 'write_failed', message: '会话撤销失败，请稍后再试。' }, { status: 500 });
  }
  const cookie = await createSessionCookie(username, env, {
    deviceId: session.deviceId || '',
    deviceLabel: session.deviceLabel || '',
    browserSessionId: session.browserSessionId || '',
    sessionNonce: session.sessionNonce || '',
    passwordSessionVersion: accountPasswordSessionVersion(updatedAccount)
  });
  queueAudit(context, 'sessions_revoked', { username }, session);
  return jsonResponse({
    ok: true,
    username,
    sessionsRevoked: true,
    message: '其它旧登录会话已撤销，当前浏览器已换新会话。'
  }, {
    headers: { 'Set-Cookie': setSessionHeader(cookie) }
  });
}

async function handleFastLogin(context, session) {
  const { request } = context;
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get('next') || '/');

  if (request.method === 'HEAD') {
    if (session) return redirectResponse(new URL(next, request.url).toString());
    return fastLoginPageResponse(next, '', { status: 200, omitBody: true });
  }

  if (request.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {
        Allow: 'GET, HEAD',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        'X-Fluid-Login-Response': 'fast-method-not-allowed'
      }
    });
  }

  if (session) return edgeSessionBridgeResponse(session, context.env, next);
  return fastLoginPageResponse(next);
}

async function handleTrack(context, session) {
  const { request, env } = context;
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });

  let body = {};
  try {
    body = await request.json();
  } catch (_) {
    body = {};
  }

  const type = String(body.type || 'client_event').replace(/[^a-z0-9_-]/gi, '').slice(0, 48) || 'client_event';
  const progressResult = LEARNING_PROGRESS_EVENT_TYPES.has(type)
    ? await mergeLearningProgressEvent(context, session, type, body.data || {})
    : null;
  const progressResultStoreMode = progressResult
    ? (progressResult.storeMode || learningProgressStoreModeFromStore(progressResult.store || '', context.env))
    : learningProgressStoreMode(context.env);
  const progressWriteDurabilityGate = learningProgressWriteDurabilityGate(progressResultStoreMode, {
    writeSignals: learningProgressWriteSignalsFromResults(progressResult ? [progressResult] : [])
  });
  const progressPersistenceContract = progressResult
    ? learningProgressPersistenceContract(progressResultStoreMode, {
      hasServerProgressSnapshot: Boolean(progressResult.progress && hasLearningProgressActivity(progressResult.progress))
    }, {
      writeSignals: learningProgressWriteSignalsFromResults([progressResult])
    })
    : null;
  if ((!progressResult || (progressResult.ok && !progressResult.duplicate)) && shouldQueueLearningProgressAudit(progressResult)) {
    queueAudit(context, type, body.data || {}, session);
  }
  return jsonResponse({
    ok: true,
    progressSynced: progressResult ? (progressResult.ok === true && progressResult.ignored !== true) : false,
    duplicateProgressEvent: progressResult ? Boolean(progressResult.duplicate) : false,
    ignoredProgressEvent: progressResult ? Boolean(progressResult.ignored) : false,
    progressStore: progressResult ? (progressResult.store || progressResult.storeMode || '') : '',
    progressWriteError: progressResult ? (progressResult.error || '') : '',
    progressWriteWarnings: progressResult ? (progressResult.writeWarnings || []) : [],
    progressWriteBlocked: progressResult ? progressWriteDurabilityGate.serverCumulativeWritesAccepted !== true : false,
    fullProductionCumulativeBlocked: progressResult ? progressWriteDurabilityGate.strictCumulativeServer !== true : false,
    progressStrictCumulativeServer: progressResult ? progressWriteDurabilityGate.strictCumulativeServer : false,
    progressWriteDurabilityGate: progressResult ? progressWriteDurabilityGate : null,
    progressPersistenceLayer: progressPersistenceContract ? progressPersistenceContract.layer : '',
    progressPersistenceContract,
    readOnlyNoDrift: progressPersistenceContract ? progressPersistenceContract.readOnlyNoDrift : false,
    durablePrimaryWrite: progressPersistenceContract ? progressPersistenceContract.durablePrimaryWrite : false,
    fallbackSnapshot: progressPersistenceContract ? progressPersistenceContract.fallbackSnapshot : false,
    noMutationRead: false,
    cumulativeSourceOfTruth: 'progress-write-confirmation',
    writeRequiresSnapshotRead: true,
    progress: progressResult && progressResult.progress ? {
      user: progressResult.progress.user,
      totals: learningProgressTotals(progressResult.progress),
      updatedAt: progressResult.progress.updatedAt
    } : undefined
  });
}

async function handleLearningProgress(context, session) {
  const { request, env } = context;
  const username = learningProgressUsername(session);
  const storeMode = learningProgressStoreMode(env);
  if (!session || !username) return jsonResponse({ ok: false, error: 'login_required', message: '请先登录。' }, { status: 401 });
  if (storeMode === 'unavailable') return jsonResponse({ ok: false, error: 'storage_unavailable', message: '学习进度存储未绑定。' }, { status: 503 });

  if (request.method === 'GET' || request.method === 'HEAD') {
    const progressEntry = await readLearningProgressWithSource(env, username);
    const progress = progressEntry.progress;
    const cumulativeInvariant = learningProgressReadInvariant(progressEntry);
    const snapshotState = learningProgressSnapshotState(progressEntry);
    const storeHealth = learningProgressStoreHealth(env);
    const writeDurabilityGate = learningProgressWriteDurabilityGate(progressEntry.storeMode);
    const progressPersistenceContract = learningProgressPersistenceContract(progressEntry.storeMode, snapshotState);
    return jsonResponse({
      ok: true,
      user: username,
      noMutationRead: true,
      cumulativeSourceOfTruth: 'server-progress-snapshot',
      source: progressEntry.source,
      storeMode: progressEntry.storeMode,
      configuredStoreMode: progressEntry.configuredStoreMode || storeMode,
      configuredSource: progressEntry.configuredSource || learningProgressSource(env),
      snapshotSelection: progressEntry.snapshotSelection || '',
      snapshotCandidates: progressEntry.snapshotCandidates || [],
      durablePrimary: progressEntry.storeMode === 'd1' || progressEntry.storeMode === 'r2-progress',
      fullProductionReady: progressEntry.storeMode === 'd1' || progressEntry.storeMode === 'r2-progress',
      degradedKvFallback: progressEntry.storeMode === 'kv-single-write-fallback',
      productionReady: progressEntry.storeMode === 'd1' || progressEntry.storeMode === 'r2-progress',
      serverSnapshotStorageReady: snapshotState.serverSnapshotStorageReady,
      serverSnapshotReady: snapshotState.serverSnapshotReady,
      strictPrimaryStoreReady: progressEntry.storeMode === 'd1' || progressEntry.storeMode === 'r2-progress',
      primaryStoreRequired: true,
      productionBlockers: learningProgressProductionBlockers(writeDurabilityGate),
      progressPersistenceLayer: progressPersistenceContract.layer,
      progressPersistenceContract,
      readOnlyNoDrift: progressPersistenceContract.readOnlyNoDrift,
      durablePrimaryWrite: progressPersistenceContract.durablePrimaryWrite,
      fallbackSnapshot: progressPersistenceContract.fallbackSnapshot,
      ...snapshotState,
      storageBoundary: storeHealth.boundary,
      serverUpgradeInvariant: storeHealth.serverUpgradeInvariant,
      storeHealth,
      cumulativeInvariant,
      cumulativeStableKey: cumulativeInvariant.stableKey,
      stableCumulativeFields: cumulativeInvariant.stableFields,
      volatileDiagnosticFieldsExcludedFromCumulative: cumulativeInvariant.volatileDiagnosticFieldsExcludedFromCumulative,
      strictCumulativeServer: writeDurabilityGate.strictCumulativeServer,
      writeDurabilityGate,
      progress,
      stats: learningProgressTotals(progress)
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'method_not_allowed' }, {
      status: 405,
      headers: { Allow: 'GET, HEAD, POST' }
    });
  }

  let body = {};
  try {
    body = await request.json();
  } catch (_) {
    body = {};
  }

  const rawEvents = Array.isArray(body.events) ? body.events : [body];
  const events = rawEvents.slice(0, LEARNING_PROGRESS_MAX_BATCH_EVENTS);
  const results = [];
  let progress = await readLearningProgress(env, username);

  for (const item of events) {
    const eventType = String(item && (item.type || item.eventType || body.type || body.eventType || '')).replace(/[^a-z0-9_-]/gi, '').slice(0, 48);
    const data = item && item.data && typeof item.data === 'object'
      ? item.data
      : { ...(item || {}) };
    const result = await mergeLearningProgressEvent(context, session, eventType, data);
    results.push({
      ok: result.ok === true,
      duplicate: Boolean(result.duplicate),
      ignored: Boolean(result.ignored),
      noMutationWrite: Boolean(result.noMutationWrite),
      eventId: result.eventId || '',
      store: result.store || '',
      storeMode: result.storeMode || learningProgressStoreMode(env),
      configuredStoreMode: result.configuredStoreMode || learningProgressStoreMode(env),
      source: result.source || learningProgressSourceFromStore(result.store || result.storeMode || storeMode, env),
      markerStore: result.markerStore || '',
      markerWarning: result.markerWarning || '',
      error: result.error || '',
      writeAttempts: result.writeAttempts || [],
      writeWarnings: result.writeWarnings || []
    });
    if (result.progress) progress = result.progress;
    if (result.ok && !result.duplicate && !result.ignored && LEARNING_PROGRESS_EVENT_TYPES.has(eventType) && shouldQueueLearningProgressAudit(result)) {
      queueAudit(context, eventType, data, session);
    }
  }
  const ok = results.some((result) => result.ok);
  const writeFailed = results.some((result) => /write|quota|storage/.test(result.error || ''));
  const status = ok || !writeFailed ? 200 : 503;
  const lastConfirmed = [...results].reverse().find((result) => result.ok && !result.duplicate && result.source);
  const responseSource = lastConfirmed ? lastConfirmed.source : (results[0] && results[0].source) || learningProgressSource(env);
  const responseStoreMode = lastConfirmed
    ? (lastConfirmed.storeMode || learningProgressStoreModeFromSource(lastConfirmed.source, storeMode))
    : ((results[0] && results[0].storeMode) || learningProgressStoreModeFromSource(responseSource, storeMode));
  const storeHealth = learningProgressStoreHealth(env);
  const writeDurabilityGate = learningProgressWriteDurabilityGate(responseStoreMode, {
    writeSignals: learningProgressWriteSignalsFromResults(results)
  });
  const responseBlockers = learningProgressProductionBlockers(writeDurabilityGate);
  const snapshotState = learningProgressSnapshotState({ progress, source: responseSource, storeMode: responseStoreMode, snapshotSelection: lastConfirmed ? 'post-write-confirmed' : ((results[0] && results[0].ignored) ? 'no-mutation-previous-snapshot' : '') });
  const progressPersistenceContract = learningProgressPersistenceContract(responseStoreMode, snapshotState, {
    writeSignals: learningProgressWriteSignalsFromResults(results)
  });

  return jsonResponse({
    ok,
    user: username,
      source: responseSource,
      storeMode: responseStoreMode,
      configuredStoreMode: storeMode,
      configuredSource: learningProgressSource(env),
      snapshotSelection: lastConfirmed ? 'post-write-confirmed' : ((results[0] && results[0].ignored) ? 'no-mutation-previous-snapshot' : ''),
      noMutationRead: false,
    cumulativeSourceOfTruth: 'progress-write-confirmation',
    writeRequiresSnapshotRead: true,
    durablePrimary: writeDurabilityGate.durablePrimary,
    fullProductionReady: writeDurabilityGate.fullProductionReady,
    degradedKvFallback: responseStoreMode === 'kv-single-write-fallback',
    productionReady: writeDurabilityGate.productionReady,
    serverSnapshotStorageReady: snapshotState.serverSnapshotStorageReady,
    serverSnapshotReady: snapshotState.serverSnapshotReady,
    strictPrimaryStoreReady: writeDurabilityGate.strictCumulativeServer === true,
    primaryStoreRequired: true,
    productionBlockers: responseBlockers,
    progressPersistenceLayer: progressPersistenceContract.layer,
    progressPersistenceContract,
    readOnlyNoDrift: progressPersistenceContract.readOnlyNoDrift,
    durablePrimaryWrite: progressPersistenceContract.durablePrimaryWrite,
    fallbackSnapshot: progressPersistenceContract.fallbackSnapshot,
    ...snapshotState,
    storageBoundary: storeHealth.boundary,
    serverUpgradeInvariant: storeHealth.serverUpgradeInvariant,
    storeHealth,
    strictCumulativeServer: writeDurabilityGate.strictCumulativeServer,
    writeDurabilityGate,
    progressWriteError: (results.find((result) => result.error)?.error) || '',
    progressWriteWarnings: results.reduce((warnings, result) => warnings.concat(result.writeWarnings || []), []),
    writeQuotaExceeded: writeDurabilityGate.writeQuotaExceeded === true,
    dedupeContract: {
      eventIdRequiredForMutation: true,
      duplicateMarkerStores: ['d1', 'r2-progress', 'kv-single-write-fallback', 'recentEventIds-snapshot'],
      recentEventIdWindow: LEARNING_PROGRESS_RECENT_EVENT_LIMIT,
      kvFallbackMarkerMode: 'recentEventIds-snapshot'
    },
    progressWriteBlocked: writeDurabilityGate.serverCumulativeWritesAccepted !== true,
    fullProductionCumulativeBlocked: writeDurabilityGate.strictCumulativeServer !== true,
    applied: results.filter((result) => result.ok && !result.duplicate && !result.ignored).length,
    duplicates: results.filter((result) => result.duplicate).length,
    ignored: results.filter((result) => result.ignored).length,
    results,
    progress,
    stats: learningProgressTotals(progress)
  }, { status });
}

async function handleLearningStats(context, session) {
  const { request, env } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return jsonResponse({ ok: false, error: 'method_not_allowed' }, {
      status: 405,
      headers: { Allow: 'GET, HEAD' }
    });
  }
  const username = learningProgressUsername(session);
  if (!session || !username) return jsonResponse({ ok: false, error: 'login_required', message: '请先登录。' }, { status: 401 });
  if (learningProgressStoreMode(env) === 'unavailable') return jsonResponse({ ok: false, error: 'storage_unavailable', message: '学习进度存储未绑定。' }, { status: 503 });
  const progressEntry = await readLearningProgressWithSource(env, username);
  const progress = progressEntry.progress;
  const cumulativeInvariant = learningProgressReadInvariant(progressEntry);
  const snapshotState = learningProgressSnapshotState(progressEntry);
  const storeHealth = learningProgressStoreHealth(env);
  const writeDurabilityGate = learningProgressWriteDurabilityGate(progressEntry.storeMode);
  const progressPersistenceContract = learningProgressPersistenceContract(progressEntry.storeMode, snapshotState);
  return jsonResponse({
    ok: true,
    user: username,
    noMutationRead: true,
    cumulativeSourceOfTruth: 'server-progress-snapshot',
    source: progressEntry.source,
    storeMode: progressEntry.storeMode,
    configuredStoreMode: progressEntry.configuredStoreMode || learningProgressStoreMode(env),
    configuredSource: progressEntry.configuredSource || learningProgressSource(env),
    snapshotSelection: progressEntry.snapshotSelection || '',
    snapshotCandidates: progressEntry.snapshotCandidates || [],
    durablePrimary: progressEntry.storeMode === 'd1' || progressEntry.storeMode === 'r2-progress',
    fullProductionReady: progressEntry.storeMode === 'd1' || progressEntry.storeMode === 'r2-progress',
    degradedKvFallback: progressEntry.storeMode === 'kv-single-write-fallback',
    productionReady: progressEntry.storeMode === 'd1' || progressEntry.storeMode === 'r2-progress',
    serverSnapshotStorageReady: snapshotState.serverSnapshotStorageReady,
    serverSnapshotReady: snapshotState.serverSnapshotReady,
    strictPrimaryStoreReady: progressEntry.storeMode === 'd1' || progressEntry.storeMode === 'r2-progress',
    primaryStoreRequired: true,
    productionBlockers: learningProgressProductionBlockers(writeDurabilityGate),
    progressPersistenceLayer: progressPersistenceContract.layer,
    progressPersistenceContract,
    readOnlyNoDrift: progressPersistenceContract.readOnlyNoDrift,
    durablePrimaryWrite: progressPersistenceContract.durablePrimaryWrite,
    fallbackSnapshot: progressPersistenceContract.fallbackSnapshot,
    ...snapshotState,
    storageBoundary: storeHealth.boundary,
    serverUpgradeInvariant: storeHealth.serverUpgradeInvariant,
    storeHealth,
    cumulativeInvariant,
    cumulativeStableKey: cumulativeInvariant.stableKey,
    stableCumulativeFields: cumulativeInvariant.stableFields,
    volatileDiagnosticFieldsExcludedFromCumulative: cumulativeInvariant.volatileDiagnosticFieldsExcludedFromCumulative,
    strictCumulativeServer: writeDurabilityGate.strictCumulativeServer,
    writeDurabilityGate,
    stats: learningProgressTotals(progress),
    progress
  });
}

function aiApiKey(env) {
  return env.SILICONFLOW_API_KEY || env.AI_API_KEY || env.SILICONFLOW_KEY || AI_FALLBACK_KEY;
}

function aiModelForMode(mode) {
  if (mode === 'fast') return AI_FAST_MODEL;
  if (mode === 'quality') return AI_QUALITY_MODEL;
  return AI_DEFAULT_MODEL;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function sanitizeAiText(value, maxLength = 3000) {
  return String(value || '').replace(/\u0000/g, '').trim().slice(0, maxLength);
}

async function consumeAiRate(context, session) {
  const { env, request } = context;
  if (!env.FM_AUDIT) return { ok: true };

  const ip = clientIp(request) || 'unknown-ip';
  const user = session && session.username ? session.username : 'unknown-user';
  const key = `ai-rate:${ip}:${String(user).toLowerCase().replace(/[^a-z0-9_.@-]/g, '_').slice(0, 80)}`;
  const current = await readJsonKv(env.FM_AUDIT, key, { hits: [] });
  const nowMs = Date.now();
  const hits = Array.isArray(current.hits)
    ? current.hits.filter((time) => nowMs - time < AI_RATE_WINDOW_SECONDS * 1000)
    : [];

  if (hits.length >= AI_RATE_MAX_REQUESTS) {
    return {
      ok: false,
      retryAfter: Math.ceil((AI_RATE_WINDOW_SECONDS * 1000 - (nowMs - hits[0])) / 1000)
    };
  }

  hits.push(nowMs);
  await writeJsonKv(env.FM_AUDIT, key, { hits }, AI_RATE_WINDOW_SECONDS * 2);
  return { ok: true };
}

async function handleAiProxy(context, session) {
  const { request, env } = context;
  if (!session) return jsonResponse({ ok: false, error: 'authentication_required' }, { status: 401 });
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });

  const rate = await consumeAiRate(context, session);
  if (!rate.ok) {
    return jsonResponse({ ok: false, error: 'rate_limited', retryAfter: rate.retryAfter }, {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfter || AI_RATE_WINDOW_SECONDS) }
    });
  }

  let body = {};
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const message = sanitizeAiText(body.message, 4000);
  if (!message) return jsonResponse({ ok: false, error: 'empty_message' }, { status: 400 });

  const history = Array.isArray(body.messages)
    ? body.messages.slice(-10).map((entry) => ({
      role: entry && entry.role === 'assistant' ? 'assistant' : 'user',
      content: sanitizeAiText(entry && entry.content, 2400)
    })).filter((entry) => entry.content)
    : [{ role: 'user', content: message }];

  if (!history.length || history[history.length - 1].role !== 'user') {
    history.push({ role: 'user', content: message });
  }

  const mode = ['fast', 'balanced', 'quality'].includes(body.mode) ? body.mode : 'balanced';
  const model = aiModelForMode(mode);
  const maxTokens = clampNumber(body.maxTokens, 256, 2400, mode === 'fast' ? 900 : 1500);
  const temperature = clampNumber(body.temperature, 0.1, 1, 0.55);
  const apiKey = aiApiKey(env);

  if (!apiKey) {
    return jsonResponse({ ok: false, error: 'ai_not_configured' }, { status: 503 });
  }

  const systemPrompt = [
    '你是流体力学学习平台的中文助教。',
    '回答要准确、分步骤、适合考研复习。',
    '遇到公式时用简洁的 LaTeX 或 Unicode 公式表达，并解释每个物理量。',
    '不要编造平台没有的个人数据；需要练习时建议学生去题库或真题模块。'
  ].join('\n');

  queueAudit(context, 'ai_request', { mode, model, chars: message.length }, session);

  let upstream;
  try {
    upstream = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        max_tokens: maxTokens,
        temperature,
        stream: false
      }),
      signal: AbortSignal.timeout(mode === 'quality' ? 120000 : 60000)
    });
  } catch (error) {
    queueAudit(context, 'ai_error', { reason: 'network', message: truncate(error.message, 160) }, session);
    return jsonResponse({ ok: false, error: 'upstream_unavailable' }, { status: 502 });
  }

  if (!upstream.ok) {
    queueAudit(context, 'ai_error', { reason: 'http', status: upstream.status }, session);
    return jsonResponse({ ok: false, error: 'upstream_error', status: upstream.status }, { status: 502 });
  }

  let data = {};
  try {
    data = await upstream.json();
  } catch (_) {
    return jsonResponse({ ok: false, error: 'invalid_upstream_response' }, { status: 502 });
  }

  const content = sanitizeAiText(data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content, 12000);
  if (!content) return jsonResponse({ ok: false, error: 'empty_upstream_response' }, { status: 502 });

  return jsonResponse({
    ok: true,
    content,
    model,
    usage: data.usage || null
  });
}

function deviceLabel(event) {
  const device = event && event.device ? event.device : {};
  return [device.deviceClass, device.os, device.browser].filter(Boolean).join(' / ') || 'unknown device';
}

function addMapCount(map, key, increment = 1) {
  const name = String(key || '').trim();
  if (!name) return;
  map.set(name, (map.get(name) || 0) + increment);
}

function addAccuracyStat(map, key, isCorrect) {
  const name = String(key || '').trim();
  if (!name) return;
  const stat = map.get(name) || { answered: 0, correct: 0 };
  stat.answered += 1;
  if (isCorrect) stat.correct += 1;
  stat.accuracy = stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0;
  map.set(name, stat);
}

function sortedTop(map, limit = 10) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function sortedAccuracy(map, limit = 8) {
  return Array.from(map.entries())
    .map(([name, stat]) => ({
      name,
      answered: stat.answered || 0,
      correct: stat.correct || 0,
      accuracy: stat.answered > 0 ? Math.round(((stat.correct || 0) / stat.answered) * 100) : 0
    }))
    .sort((a, b) => b.answered - a.answered || a.accuracy - b.accuracy || a.name.localeCompare(b.name))
    .slice(0, limit);
}

function accountStateFromAccount(username, env, account, binding, accessPolicy = null) {
  const normalized = normalizeUsername(username);
  const policy = singleDevicePolicy(normalized, env);
  const policyLocked = Boolean(accessPolicy && Array.isArray(accessPolicy.lockedUsers) && accessPolicy.lockedUsers.includes(normalized));
  const policyActive = Boolean(accessPolicy && Array.isArray(accessPolicy.activeUsers) && accessPolicy.activeUsers.includes(normalized));
  const effectiveAccess = policy.exempt
    ? 'teacher'
    : (policyLocked
      ? 'locked'
      : (policyActive ? 'active' : (account ? 'locked' : 'unknown')));
  return {
    username: normalized,
    policy,
    access: effectiveAccess,
    purchased: effectiveAccess === 'active' || effectiveAccess === 'teacher',
    entitlements: account && Array.isArray(account.entitlements) ? account.entitlements.slice(0, 32) : [],
    disabled: Boolean(account && account.disabled),
    createdAt: truncate(account && account.createdAt ? account.createdAt : '', 40),
    lastLoginAt: truncate(account && account.lastLoginAt ? account.lastLoginAt : '', 40),
    deviceBinding: binding || null
  };
}

function knownUsernamesFromEvents(events) {
  const users = new Set();
  (events || []).forEach((event) => {
    const eventUser = normalizeUsername(event && event.user);
    const attemptedUser = normalizeUsername(event && event.data && event.data.username);
    if (eventUser) users.add(eventUser);
    if (attemptedUser) users.add(attemptedUser);
  });
  return Array.from(users).slice(0, 200);
}

async function readAccountStatesForUsers(env, usernames) {
  const state = new Map();
  const list = Array.isArray(usernames) ? usernames.map((name) => normalizeUsername(name)).filter(Boolean) : [];
  const accessPolicy = await readStudentAccessPolicy(env);
  const entries = await Promise.all(list.map(async (username) => {
    const [account, binding] = await Promise.all([
      readUserAccount(env, username),
      readDeviceBinding(env, username)
    ]);
    return [username, accountStateFromAccount(username, env, account, binding, accessPolicy)];
  }));
  entries.forEach(([username, accountState]) => {
    state.set(username, accountState);
  });
  return state;
}

async function listKnownAccountUsernames(env, limit = ACCOUNT_SUMMARY_LIMIT) {
  const usernames = new Set(configuredAdminUsers(env));
  if (!env.FM_AUDIT) return Array.from(usernames).slice(0, limit);

  async function readPrefix(prefix) {
    let cursor = undefined;
    while (usernames.size < limit) {
      let page = null;
      try {
        page = await env.FM_AUDIT.list({
          prefix,
          cursor,
          limit: Math.min(KV_LIST_PAGE_LIMIT, Math.max(1, limit - usernames.size))
        });
      } catch (_) {
        break;
      }
      const keys = page && Array.isArray(page.keys) ? page.keys : [];
      keys.forEach((entry) => {
        const rawName = entry && entry.name ? String(entry.name) : '';
        const username = normalizeUsername(rawName.slice(prefix.length));
        if (username) usernames.add(username);
      });
      if (!page || page.list_complete || !page.cursor) break;
      cursor = page.cursor;
    }
  }

  await readPrefix('account:');
  await readPrefix('device-binding:');
  await readPrefix(LEARNING_PROGRESS_KEY_PREFIX);
  const db = learningProgressD1(env);
  if (db && usernames.size < limit) {
    try {
      await ensureLearningProgressD1(env);
      const rows = await db.prepare('SELECT username FROM learning_progress ORDER BY updated_at DESC LIMIT ?')
        .bind(Math.max(1, limit - usernames.size))
        .all();
      const results = rows && Array.isArray(rows.results) ? rows.results : [];
      results.forEach((row) => {
        const username = normalizeUsername(row && row.username);
        if (username) usernames.add(username);
      });
    } catch (_) {}
  }
  const r2 = learningProgressR2(env);
  if (r2 && typeof r2.list === 'function' && usernames.size < limit) {
    let cursor = undefined;
    while (usernames.size < limit) {
      let page = null;
      try {
        page = await r2.list({
          prefix: `${LEARNING_PROGRESS_R2_PREFIX}/users/`,
          cursor,
          limit: Math.min(KV_LIST_PAGE_LIMIT, Math.max(1, limit - usernames.size))
        });
      } catch (_) {
        break;
      }
      const objects = page && Array.isArray(page.objects) ? page.objects : [];
      objects.forEach((entry) => {
        const key = String(entry && entry.key || '');
        const name = key.replace(`${LEARNING_PROGRESS_R2_PREFIX}/users/`, '').replace(/\.json$/, '');
        const username = normalizeUsername(name);
        if (username) usernames.add(username);
      });
      if (!page || page.truncated !== true || !page.cursor) break;
      cursor = page.cursor;
    }
  }
  return Array.from(usernames).slice(0, limit);
}

function inferManualBindingIsIpad(input = {}) {
  const fields = [
    input.deviceLabel,
    input.browser,
    input.os,
    input.platform,
    input.deviceClass,
    input.note
  ].map((value) => String(value || '').toLowerCase());
  return fields.some((value) => /ipad|ipados/.test(value)) || (String(input.deviceClass || '').toLowerCase() === 'tablet');
}

function learningProgressSummaryEntry(entry, fallbackSource = 'server-learning-progress-unavailable') {
  if (entry && typeof entry === 'object' && entry.progress) {
    return {
      progress: entry.progress,
      source: entry.source || fallbackSource,
      storeMode: entry.storeMode || learningProgressStoreModeFromSource(entry.source || fallbackSource, ''),
      configuredStoreMode: entry.configuredStoreMode || '',
      configuredSource: entry.configuredSource || '',
      snapshotSelection: entry.snapshotSelection || '',
      snapshotCandidates: Array.isArray(entry.snapshotCandidates) ? entry.snapshotCandidates : []
    };
  }
  return {
    progress: entry || null,
    source: fallbackSource,
    storeMode: learningProgressStoreModeFromSource(fallbackSource, ''),
    configuredStoreMode: '',
    configuredSource: '',
    snapshotSelection: '',
    snapshotCandidates: []
  };
}

function buildAdminSummary(events, accountStates = new Map(), learningProgressByUser = new Map(), learningProgressSummarySource = 'server-learning-progress-unavailable', learningProgressSummaryStoreMode = 'unavailable') {
  const users = new Map();
  const ips = new Map();
  const ipProfiles = new Map();
  const devices = new Map();
  const deviceIds = new Map();
  const deviceProfiles = new Map();
  const paths = new Map();
	  const eventTypes = new Map();
	  const knowledgeStats = new Map();
	  const typeStats = new Map();
	  const privateVideoViews = new Map();
	  const privateVideoProgress = new Map();
	  const recentAnswers = [];
  const recentSessions = [];
  const recentRegisterEvents = [];
  const recentUserEvents = [];
  const recentPrivateVideoEvents = [];
  const suspiciousAccess = [];
  let suspiciousCount = 0;
  const coreEventCounts = {
    loginSuccess: 0,
    pageViews: 0,
    blocked: 0,
    registerSuccess: 0,
    registerFailed: 0,
    privateVideoStreams: 0,
    privateVideoWatchStarts: 0,
    privateVideoWatchCompletes: 0,
    privateVideoWatchErrors: 0
  };
  const registrationStats = {
    codeRequests: 0,
    codeSent: 0,
    emailFailed: 0,
    registerSuccess: 0,
    registerFailed: 0
  };
  const privateVideoStats = {
    lists: 0,
    streams: 0,
    denied: 0,
    watchOpens: 0,
    watchSources: 0,
    watchStarts: 0,
    watchProgress: 0,
    watchHeartbeats: 0,
    watchCompletes: 0,
    watchErrors: 0,
    watchCloses: 0,
    watchMaxPercent: 0,
    uploadInits: 0,
    uploadChunks: 0,
    uploadPublishes: 0,
    accessUpdates: 0,
    uploadBytes: 0
  };
  let answerCount = 0;
  let correctCount = 0;

  function profileBucket(map, key, base) {
    const name = String(key || '').trim();
    if (!name) return null;
    if (!map.has(name)) {
      map.set(name, Object.assign({
        eventCount: 0,
        loginFailed: 0,
        lockedRequests: 0,
        blockedRequests: 0,
        adminDenied: 0,
        privateVideoDenied: 0,
        suspiciousEvents: 0,
        pageViews: 0,
        answers: 0,
        privateVideoWatchStarts: 0,
	        users: new Set(),
	        attemptedUsers: new Set(),
	        ips: new Set(),
	        ipSources: new Set(),
	        forwardedIps: new Set(),
	        devices: new Set(),
        deviceIds: new Set(),
        locations: new Set(),
        browserSessionIds: new Set(),
        lastPath: '',
        lastSeenAt: 0,
        lastSeen: ''
      }, base));
    }
    return map.get(name);
  }

		  function userBucket(event) {
    const data = event && event.data && typeof event.data === 'object' ? event.data : {};
    const auditIp = auditIpInfoFromEvent(event);
    const authenticatedUser = normalizeUsername(event && event.user);
    const attemptedUser = normalizeUsername(data && data.username);
    const displayUser = authenticatedUser || attemptedUser || event.browserSessionId || auditIp.ip || auditIp.forwardedIp || auditIp.unverifiedIp || 'anonymous';
    const key = authenticatedUser
      ? `auth:${authenticatedUser}`
      : (attemptedUser ? `attempt:${attemptedUser}` : (event.browserSessionId || auditIp.ip || auditIp.forwardedIp || auditIp.unverifiedIp || 'anonymous'));
    if (!users.has(key)) {
      users.set(key, {
        key,
        user: displayUser,
        lookupUser: authenticatedUser || attemptedUser || '',
        eventCount: 0,
        answers: 0,
        correct: 0,
        incorrect: 0,
        skipped: 0,
        accuracy: 0,
        loginSuccess: 0,
        loginFailed: 0,
        registerSuccess: 0,
        lockedRequests: 0,
        blockedRequests: 0,
        adminDenied: 0,
        pageViews: 0,
        resourceRequests: 0,
        privateVideoStreams: 0,
        privateVideoDenied: 0,
        privateVideoWatchOpens: 0,
        privateVideoWatchStarts: 0,
        privateVideoWatchProgress: 0,
        privateVideoWatchHeartbeats: 0,
        privateVideoWatchCompletes: 0,
        privateVideoWatchErrors: 0,
        privateVideoWatchCloses: 0,
        privateVideoWatchMaxPercent: 0,
        privateVideoWatchSeconds: 0,
        videoUploads: 0,
        videoUploadBytes: 0,
        aiRequests: 0,
        clicks: 0,
        totalQuestionTimeSeconds: 0,
        averageQuestionTimeSeconds: 0,
	        sessions: 0,
	        ips: new Set(),
	        ipSources: new Set(),
	        forwardedIps: new Set(),
	        devices: new Set(),
        deviceIds: new Set(),
        seenDevices: new Map(),
        countries: new Set(),
        locations: new Set(),
        browserSessionIds: new Set(),
        attemptedUsers: new Set(),
        eventTypes: new Map(),
        knowledgeStats: new Map(),
        questionTypeStats: new Map(),
        authenticated: false,
        recentAnswers: [],
        recentEvents: [],
        recentSessions: [],
        lastPath: '',
        lastSeenAt: 0,
        lastSeen: ''
      });
    }
    const bucket = users.get(key);
    if (!bucket.user && displayUser) bucket.user = displayUser;
    if (!bucket.lookupUser && (authenticatedUser || attemptedUser)) {
      bucket.lookupUser = authenticatedUser || attemptedUser;
    }
	    return bucket;
	  }

	  function privateVideoProgressBucket(data) {
	    const video = String(data.video || data.id || data.videoId || '').trim();
	    if (!video) return null;
	    if (!privateVideoProgress.has(video)) {
	      privateVideoProgress.set(video, {
	        video,
	        title: '',
	        eventCount: 0,
	        streams: 0,
	        denied: 0,
	        opens: 0,
	        sourceReady: 0,
	        starts: 0,
	        progressEvents: 0,
	        heartbeats: 0,
	        completes: 0,
	        errors: 0,
	        closes: 0,
	        maxPercent: 0,
	        maxSeconds: 0,
	        users: new Set(),
	        ips: new Set(),
	        devices: new Set(),
	        userProgress: new Map(),
	        lastSeenAt: 0,
	        lastSeen: '',
	        lastUser: '',
	        lastStatus: '',
	        lastPath: ''
	      });
	    }
	    return privateVideoProgress.get(video);
	  }

	  function privateVideoUserProgress(bucket, userName) {
	    const user = String(userName || 'anonymous');
	    if (!bucket.userProgress.has(user)) {
	      bucket.userProgress.set(user, {
	        user,
	        starts: 0,
	        completes: 0,
	        errors: 0,
	        denied: 0,
	        maxPercent: 0,
	        maxSeconds: 0,
	        lastSeenAt: 0,
	        lastSeen: ''
	      });
	    }
	    return bucket.userProgress.get(user);
	  }

		  events.forEach((event) => {
	  const user = userBucket(event);
	  const data = event.data || {};
	  const auditIp = auditIpInfoFromEvent(event);
	  const label = deviceLabel(event);
    const deviceId = normalizeDeviceId(event && event.device && event.device.deviceId);
    const attemptedUsername = normalizeUsername(data && data.username);
    const boundDeviceId = normalizeDeviceId(data.boundDeviceId);
    const boundDeviceShortId = shortDeviceId(boundDeviceId);
    const attemptedDeviceId = normalizeDeviceId(data.attemptedDeviceId || data.deviceFingerprint || deviceId);
    const attemptedDeviceShortId = shortDeviceId(attemptedDeviceId);
    const boundDeviceLabel = truncate(data.boundLabel || data.boundDeviceLabel || '', 120);
    const attemptedDeviceLabel = truncate(data.attemptedLabel || '', 120);
    const isSuspiciousType = [
      'blocked_request',
      'locked_request',
      'login_failed',
      'login_blocked',
      'admin_denied',
      'private_video_denied',
      'private_video_watch_error',
      'register_rejected',
      'register_code_rejected',
      'register_account_error',
      'register_email_failed',
      'password_reset_code_rejected',
      'password_reset_rejected',
      'password_reset_email_failed',
      'student_password_admin_reset_rejected',
      'device_bind_mismatch',
      'concurrent_device_denied',
      'restricted_account_denied',
      'device_binding_missing',
      'device_session_missing',
      'device_identity_missing',
      'device_session_revoked'
    ].includes(event.type);
	    const ipProfile = profileBucket(ipProfiles, auditIp.ip, { ip: auditIp.ip, ipVerified: auditIp.verified });
	    const deviceProfile = profileBucket(deviceProfiles, label, { device: label });
	    [ipProfile, deviceProfile].forEach((profile) => {
	      if (!profile) return;
	      profile.eventCount += 1;
	      if (event.user) profile.users.add(event.user);
	      if (attemptedUsername) profile.attemptedUsers.add(attemptedUsername);
	      if (auditIp.ip) profile.ips.add(auditIp.ip);
	      if (auditIp.source) profile.ipSources.add(auditIp.source);
	      if (auditIp.forwardedIp) profile.forwardedIps.add(auditIp.forwardedIp);
	      if (auditIp.unverifiedIp) profile.forwardedIps.add(auditIp.unverifiedIp);
	      if (auditIp.verified) profile.ipVerified = true;
	      if (label) profile.devices.add(label);
      if (deviceId) profile.deviceIds.add(deviceId);
      if (event.country || event.region || event.city) profile.locations.add([event.country, event.region, event.city].filter(Boolean).join(' / '));
      if (event.browserSessionId) profile.browserSessionIds.add(event.browserSessionId);
      if (event.path) profile.lastPath = event.path;
      if (event.at > profile.lastSeenAt) {
        profile.lastSeenAt = event.at;
        profile.lastSeen = event.iso || '';
      }
      if (event.type === 'login_failed' || event.type === 'login_blocked') profile.loginFailed += 1;
      if (event.type === 'locked_request') profile.lockedRequests += 1;
      if (event.type === 'blocked_request' || event.type === 'login_blocked') profile.blockedRequests += 1;
      if (event.type === 'admin_denied') profile.adminDenied += 1;
      if (event.type === 'private_video_denied') profile.privateVideoDenied += 1;
      if (event.type === 'page_view' || event.type === 'edge_page_request' || event.type === 'edge_fast_home') profile.pageViews += 1;
      if (event.type === 'practice_answer_submit') profile.answers += 1;
      if (event.type === 'private_video_watch_start') profile.privateVideoWatchStarts += 1;
      if (isSuspiciousType) profile.suspiciousEvents += 1;
    });
    user.eventCount += 1;
    addMapCount(eventTypes, event.type);
    addMapCount(user.eventTypes, event.type);
	    if (auditIp.ip) {
	      user.ips.add(auditIp.ip);
	      ips.set(auditIp.ip, (ips.get(auditIp.ip) || 0) + 1);
	    }
	    if (auditIp.source) user.ipSources.add(auditIp.source);
	    if (auditIp.forwardedIp) user.forwardedIps.add(auditIp.forwardedIp);
	    if (auditIp.unverifiedIp) user.forwardedIps.add(auditIp.unverifiedIp);
    if (event.country) user.countries.add(event.country);
    if (event.country || event.region || event.city) user.locations.add([event.country, event.region, event.city].filter(Boolean).join(' / '));
    if (event.browserSessionId) user.browserSessionIds.add(event.browserSessionId);
    if (deviceId) {
      user.deviceIds.add(deviceId);
      deviceIds.set(deviceId, (deviceIds.get(deviceId) || 0) + 1);
      const seen = user.seenDevices.get(deviceId) || {
        deviceId,
        shortId: shortDeviceId(deviceId),
        label: label || '',
        browser: event && event.device && event.device.browser ? event.device.browser : '',
        os: event && event.device && event.device.os ? event.device.os : '',
        platform: event && event.device && event.device.platform ? event.device.platform : '',
        deviceClass: event && event.device && event.device.deviceClass ? event.device.deviceClass : '',
	        isIpad: Boolean(event && event.device && event.device.isIpad),
	        ips: new Set(),
	        ipSources: new Set(),
	        forwardedIps: new Set(),
	        browserSessionIds: new Set(),
        eventCount: 0,
        lastSeenAt: 0,
        lastSeen: ''
      };
      seen.label = seen.label || label || '';
      seen.browser = seen.browser || (event && event.device && event.device.browser ? event.device.browser : '');
      seen.os = seen.os || (event && event.device && event.device.os ? event.device.os : '');
      seen.platform = seen.platform || (event && event.device && event.device.platform ? event.device.platform : '');
      seen.deviceClass = seen.deviceClass || (event && event.device && event.device.deviceClass ? event.device.deviceClass : '');
      seen.isIpad = seen.isIpad || Boolean(event && event.device && event.device.isIpad);
	      if (auditIp.ip) seen.ips.add(auditIp.ip);
	      if (auditIp.source) seen.ipSources.add(auditIp.source);
	      if (auditIp.forwardedIp) seen.forwardedIps.add(auditIp.forwardedIp);
	      if (auditIp.unverifiedIp) seen.forwardedIps.add(auditIp.unverifiedIp);
      if (event.browserSessionId) seen.browserSessionIds.add(event.browserSessionId);
      seen.eventCount += 1;
      if (event.at > seen.lastSeenAt) {
        seen.lastSeenAt = event.at;
        seen.lastSeen = event.iso || '';
      }
      user.seenDevices.set(deviceId, seen);
    }
    if (event.user) user.authenticated = true;
    if (attemptedUsername) user.attemptedUsers.add(attemptedUsername);
    if (label) {
      user.devices.add(label);
      devices.set(label, (devices.get(label) || 0) + 1);
    }
    if (event.path) {
      paths.set(event.path, (paths.get(event.path) || 0) + 1);
      user.lastPath = event.path;
    }
    if (event.at > user.lastSeenAt) {
      user.lastSeenAt = event.at;
      user.lastSeen = event.iso || '';
    }
    if (user.recentEvents.length < 10) {
      user.recentEvents.push({
        iso: event.iso || '',
	        type: event.type || '',
	        path: event.path || '',
	        result: data.result || data.reason || data.error || data.status || '',
	        ip: auditIp.ip,
	        ipSource: auditIp.source,
	        ipVerified: auditIp.verified,
	        forwardedIp: auditIp.forwardedIp || auditIp.unverifiedIp,
        device: label,
        deviceId: deviceId,
        deviceShortId: shortDeviceId(deviceId)
      });
    }
    if (recentUserEvents.length < 160) {
      recentUserEvents.push({
        iso: event.iso || '',
        type: event.type || '',
	      user: user.user || event.user || attemptedUsername || event.browserSessionId || auditIp.ip || 'anonymous',
	      path: event.path || data.path || data.target || '',
	      result: data.result || data.reason || data.error || data.status || '',
	      ip: auditIp.ip,
	      ipSource: auditIp.source,
	      ipVerified: auditIp.verified,
	      forwardedIp: auditIp.forwardedIp || auditIp.unverifiedIp,
        country: event.country || '',
        device: label,
        browserSessionId: event.browserSessionId || '',
        deviceId: deviceId,
        deviceShortId: shortDeviceId(deviceId),
        boundDeviceId,
        boundDeviceShortId,
        boundDeviceLabel,
        attemptedDeviceId,
        attemptedDeviceShortId,
        attemptedDeviceLabel
      });
    }
    if (isSuspiciousType) {
      suspiciousCount += 1;
      if (suspiciousAccess.length < 120) {
        suspiciousAccess.push({
          iso: event.iso || '',
          type: event.type || '',
          user: event.user || data.username || '',
          attemptedUsers: data.username || '',
          path: event.path || data.path || data.target || '',
          result: data.reason || data.error || data.message || data.status || '',
	          ip: auditIp.ip,
	          ipSource: auditIp.source,
	          ipVerified: auditIp.verified,
	          forwardedIp: auditIp.forwardedIp || auditIp.unverifiedIp,
          country: event.country || '',
          region: event.region || '',
          city: event.city || '',
          device: label,
          browserSessionId: event.browserSessionId || '',
          userAgent: event.userAgent || '',
          deviceId: deviceId,
          deviceShortId: shortDeviceId(deviceId),
          boundDeviceId,
          boundDeviceShortId,
          boundDeviceLabel,
          attemptedDeviceId,
          attemptedDeviceShortId,
          attemptedDeviceLabel,
          policyType: data.policyType || ''
        });
      }
    }

    if (event.type === 'login_success') user.loginSuccess += 1;
    if (event.type === 'login_failed' || event.type === 'login_blocked') user.loginFailed += 1;
    if (event.type === 'register_success' || event.type === 'register_idempotent_success') user.registerSuccess += 1;
    if (event.type === 'locked_request') user.lockedRequests += 1;
    if (event.type === 'blocked_request' || event.type === 'login_blocked') user.blockedRequests += 1;
    if (event.type === 'admin_denied') user.adminDenied += 1;
    if (event.type === 'page_view' || event.type === 'edge_page_request' || event.type === 'edge_fast_home') user.pageViews += 1;
    if (event.type === 'resource_request' || event.type === 'resource_fetch') user.resourceRequests += 1;
    if (event.type === 'private_video_list') privateVideoStats.lists += 1;
	    if (/^(private_video_watch_|private_video_stream|private_video_denied)/.test(event.type)) {
	      const bucket = privateVideoProgressBucket(data);
	      if (bucket) {
		        const viewer = event.user || event.browserSessionId || auditIp.ip || 'anonymous';
	        const viewerProgress = privateVideoUserProgress(bucket, viewer);
	        const watchPercent = Math.max(0, Math.min(100, Number(data.percent || data.maxPercent || 0)));
	        const watchSeconds = Number(data.currentTimeSeconds || 0);
	        bucket.eventCount += 1;
	        bucket.title = data.title || bucket.title || '';
	        bucket.users.add(viewer);
		        if (auditIp.ip) bucket.ips.add(auditIp.ip);
	        if (label) bucket.devices.add(label);
	        if (watchPercent > bucket.maxPercent) bucket.maxPercent = watchPercent;
	        if (watchPercent > viewerProgress.maxPercent) viewerProgress.maxPercent = watchPercent;
	        if (watchSeconds > bucket.maxSeconds) bucket.maxSeconds = watchSeconds;
	        if (watchSeconds > viewerProgress.maxSeconds) viewerProgress.maxSeconds = watchSeconds;
	        if (event.at > bucket.lastSeenAt) {
	          bucket.lastSeenAt = event.at;
	          bucket.lastSeen = event.iso || '';
	          bucket.lastUser = viewer;
	          bucket.lastStatus = data.status || data.reason || data.error || event.type || '';
	          bucket.lastPath = event.path || '';
	        }
	        if (event.at > viewerProgress.lastSeenAt) {
	          viewerProgress.lastSeenAt = event.at;
	          viewerProgress.lastSeen = event.iso || '';
	        }
	        if (event.type === 'private_video_stream') bucket.streams += 1;
	        if (event.type === 'private_video_denied') {
	          bucket.denied += 1;
	          viewerProgress.denied += 1;
	        }
	        if (event.type === 'private_video_watch_open') bucket.opens += 1;
	        if (event.type === 'private_video_watch_source_ready') bucket.sourceReady += 1;
	        if (event.type === 'private_video_watch_start') {
	          bucket.starts += 1;
	          viewerProgress.starts += 1;
	        }
	        if (event.type === 'private_video_watch_progress') bucket.progressEvents += 1;
	        if (event.type === 'private_video_watch_heartbeat') bucket.heartbeats += 1;
	        if (event.type === 'private_video_watch_complete') {
	          bucket.completes += 1;
	          viewerProgress.completes += 1;
	        }
	        if (event.type === 'private_video_watch_error') {
	          bucket.errors += 1;
	          viewerProgress.errors += 1;
	        }
	        if (event.type === 'private_video_watch_close') bucket.closes += 1;
	      }
	    }
	    if (event.type === 'private_video_stream') {
	      user.privateVideoStreams += 1;
      privateVideoStats.streams += 1;
      addMapCount(privateVideoViews, data.video || 'unknown');
    }
    if (event.type === 'private_video_denied') {
      user.privateVideoDenied += 1;
      privateVideoStats.denied += 1;
    }
    if (event.type === 'private_video_watch_open') {
      user.privateVideoWatchOpens += 1;
      privateVideoStats.watchOpens += 1;
    }
    if (event.type === 'private_video_watch_source_ready') {
      privateVideoStats.watchSources += 1;
    }
    if (event.type === 'private_video_watch_start') {
      user.privateVideoWatchStarts += 1;
      privateVideoStats.watchStarts += 1;
    }
    if (event.type === 'private_video_watch_progress') {
      user.privateVideoWatchProgress += 1;
      privateVideoStats.watchProgress += 1;
    }
    if (event.type === 'private_video_watch_heartbeat') {
      user.privateVideoWatchHeartbeats += 1;
      privateVideoStats.watchHeartbeats += 1;
    }
    if (event.type === 'private_video_watch_complete') {
      user.privateVideoWatchCompletes += 1;
      privateVideoStats.watchCompletes += 1;
    }
    if (event.type === 'private_video_watch_error') {
      user.privateVideoWatchErrors += 1;
      privateVideoStats.watchErrors += 1;
    }
    if (event.type === 'private_video_watch_close') {
      user.privateVideoWatchCloses += 1;
      privateVideoStats.watchCloses += 1;
    }
    if (event.type === 'login_success') coreEventCounts.loginSuccess += 1;
    if (event.type === 'page_view' || event.type === 'edge_page_request' || event.type === 'edge_fast_home') coreEventCounts.pageViews += 1;
    if (event.type === 'blocked_request' || event.type === 'login_blocked' || event.type === 'locked_request' || event.type === 'admin_denied') coreEventCounts.blocked += 1;
    if (event.type === 'register_success' || event.type === 'register_idempotent_success') coreEventCounts.registerSuccess += 1;
    if (event.type === 'register_rejected' || event.type === 'register_code_rejected' || event.type === 'register_email_failed' || event.type === 'register_account_error') coreEventCounts.registerFailed += 1;
    if (event.type === 'private_video_stream') coreEventCounts.privateVideoStreams += 1;
    if (event.type === 'private_video_watch_start') coreEventCounts.privateVideoWatchStarts += 1;
    if (event.type === 'private_video_watch_complete') coreEventCounts.privateVideoWatchCompletes += 1;
    if (event.type === 'private_video_watch_error') coreEventCounts.privateVideoWatchErrors += 1;
    if (/^private_video_watch_/.test(event.type)) {
      const watchPercent = Math.max(0, Math.min(100, Number(data.percent || data.maxPercent || 0)));
      const watchSeconds = Number(data.currentTimeSeconds || 0);
      if (watchPercent > user.privateVideoWatchMaxPercent) user.privateVideoWatchMaxPercent = watchPercent;
      if (watchPercent > privateVideoStats.watchMaxPercent) privateVideoStats.watchMaxPercent = watchPercent;
      if (watchSeconds > user.privateVideoWatchSeconds) user.privateVideoWatchSeconds = watchSeconds;
    }
    if (event.type === 'private_video_upload_init' || event.type === 'private_video_upload_resume') {
      user.videoUploads += 1;
      privateVideoStats.uploadInits += 1;
    }
    if (event.type === 'private_video_upload_chunk') {
      user.videoUploads += 1;
      user.videoUploadBytes += Number(data.bytes || 0);
      privateVideoStats.uploadChunks += 1;
      privateVideoStats.uploadBytes += Number(data.bytes || 0);
    }
    if (event.type === 'private_video_upload_publish') privateVideoStats.uploadPublishes += 1;
    if (event.type === 'private_video_access_update') privateVideoStats.accessUpdates += 1;
    if (/^private_video_/.test(event.type) && recentPrivateVideoEvents.length < 120) {
      recentPrivateVideoEvents.push({
        iso: event.iso || '',
        type: event.type || '',
	        user: event.user || event.browserSessionId || auditIp.ip || 'anonymous',
        video: data.video || '',
        title: data.title || '',
        range: data.range || '',
        status: data.status || data.reason || data.error || '',
        message: data.message || '',
        percent: data.percent || data.maxPercent || '',
        currentTimeSeconds: data.currentTimeSeconds || '',
        durationSeconds: data.durationSeconds || '',
        bytes: data.bytes || 0,
        store: data.store || data.storage || '',
        assignedUsers: Array.isArray(data.assignedUsers) ? data.assignedUsers.join(', ') : '',
	        ip: auditIp.ip,
	        ipSource: auditIp.source,
	        ipVerified: auditIp.verified,
	        forwardedIp: auditIp.forwardedIp || auditIp.unverifiedIp,
        country: event.country || '',
        device: label
      });
    }
    if (event.type === 'ai_request') user.aiRequests += 1;
    if (event.type === 'link_click' || event.type === 'button_click' || event.type === 'control_change') user.clicks += 1;

    if (/^(register_|password_reset_|student_password_admin_reset)/.test(event.type)) {
      if (event.type === 'register_code_request') registrationStats.codeRequests += 1;
      if (event.type === 'register_code_sent') registrationStats.codeSent += 1;
      if (event.type === 'register_email_failed') registrationStats.emailFailed += 1;
      if (event.type === 'register_success' || event.type === 'register_idempotent_success') registrationStats.registerSuccess += 1;
      if (event.type === 'register_rejected' || event.type === 'register_code_rejected' || event.type === 'register_account_error') registrationStats.registerFailed += 1;
      if (recentRegisterEvents.length < 100) {
        recentRegisterEvents.push({
          iso: event.iso,
          eventType: event.type,
          username: data.username || event.user || '',
          emailHash: data.emailHash || '',
          provider: data.provider || '',
          reason: data.reason || data.error || '',
          result: event.type === 'register_success' || event.type === 'register_idempotent_success' || event.type === 'register_code_sent' || event.type === 'password_reset_code_sent' || event.type === 'password_reset_success' || event.type === 'student_password_admin_reset'
            ? '成功'
            : (data.reason || data.error || data.detail || ''),
	          ip: auditIp.ip,
	          ipSource: auditIp.source,
	          ipVerified: auditIp.verified,
	          forwardedIp: auditIp.forwardedIp || auditIp.unverifiedIp,
          country: event.country || '',
          device: label,
          browserSessionId: event.browserSessionId || '',
          deviceId,
          deviceShortId: shortDeviceId(deviceId)
        });
      }
    }

    if (event.type === 'practice_answer_submit') {
      const isCorrect = Boolean(data.isCorrect);
      const timeSeconds = learningQuestionTimeSeconds(data);
      const knowledgeName = data.knowledge || data.category || '未标注知识点';
      const typeName = data.questionType || '未知题型';
      answerCount += 1;
      user.answers += 1;
      user.totalQuestionTimeSeconds += Number.isFinite(timeSeconds) ? timeSeconds : 0;
      addAccuracyStat(user.knowledgeStats, knowledgeName, isCorrect);
      addAccuracyStat(user.questionTypeStats, typeName, isCorrect);
      addAccuracyStat(knowledgeStats, knowledgeName, isCorrect);
      addAccuracyStat(typeStats, typeName, isCorrect);
      if (isCorrect) {
        correctCount += 1;
        user.correct += 1;
      } else {
        user.incorrect += 1;
      }
      const answerRow = {
        iso: event.iso,
        user: event.user || event.browserSessionId || 'anonymous',
	        ip: auditIp.ip,
	        ipSource: auditIp.source,
	        ipVerified: auditIp.verified,
	        forwardedIp: auditIp.forwardedIp || auditIp.unverifiedIp,
        country: event.country || '',
        device: label,
        bankId: data.bankId || '',
        sessionName: data.sessionName || '',
        practiceSessionId: data.practiceSessionId || '',
        questionNumber: data.questionNumber || '',
        totalQuestions: data.totalQuestions || '',
        questionTitle: data.questionTitle || '',
        questionType: typeName,
        knowledge: knowledgeName,
        userAnswer: data.userAnswer || '',
        correctAnswer: data.correctAnswer || '',
        isCorrect,
        accuracySoFar: data.accuracySoFar || 0,
        questionTimeSeconds: timeSeconds || 0
      };
      if (user.recentAnswers.length < 12) user.recentAnswers.push(answerRow);
      if (recentAnswers.length < 120) {
        recentAnswers.push(answerRow);
      }
    }

    if (event.type === 'practice_complete') {
      user.sessions += 1;
      const sessionRow = {
        iso: event.iso,
        user: event.user || event.browserSessionId || 'anonymous',
	        ip: auditIp.ip,
	        ipSource: auditIp.source,
	        ipVerified: auditIp.verified,
	        forwardedIp: auditIp.forwardedIp || auditIp.unverifiedIp,
        device: label,
        bankId: data.bankId || '',
        sessionName: data.sessionName || '',
        totalQuestions: data.totalQuestions || 0,
        answered: data.answered || 0,
        correct: data.correct || 0,
        incorrect: data.incorrect || 0,
        accuracy: data.accuracy || 0,
        totalTime: data.totalTime || 0,
        averageTime: data.averageTime || 0,
        byKnowledge: data.byKnowledge || {},
        wrongQuestions: Array.isArray(data.wrongQuestions) ? data.wrongQuestions.slice(0, 8) : []
      };
      if (user.recentSessions.length < 8) user.recentSessions.push(sessionRow);
      if (recentSessions.length < 60) {
        recentSessions.push(sessionRow);
      }
    }
  });

  const activeUserRows = Array.from(users.values()).map((user) => {
    const normalizedUser = user.lookupUser || normalizeUsername(user.user);
    const state = normalizedUser ? accountStates.get(normalizedUser) : null;
    const persistentProgressEntry = learningProgressSummaryEntry(
      normalizedUser ? learningProgressByUser.get(normalizedUser) : null,
      learningProgressSummarySource
    );
    const persistentProgress = persistentProgressEntry.progress;
    const persistentTotals = persistentProgress && hasLearningProgressActivity(persistentProgress)
      ? learningProgressTotals(persistentProgress)
      : null;
    const progressInvariant = persistentTotals ? learningProgressReadInvariant(persistentProgressEntry) : null;
    const progressSource = persistentTotals ? persistentProgressEntry.source : 'audit-event-window';
    const progressBoundary = learningProgressBoundaryFromSource(progressSource, learningProgressSummaryStoreMode);
    const progressSelectedStoreMode = persistentProgressEntry.storeMode || learningProgressStoreModeFromSource(progressSource, learningProgressSummaryStoreMode);
    const progressDurabilityGate = learningProgressWriteDurabilityGate(progressSelectedStoreMode);
    const progressSnapshotState = learningProgressSnapshotState({
      progress: persistentTotals ? persistentProgress : createEmptyLearningProgress(normalizedUser || user.user || 'unknown'),
      source: persistentTotals ? persistentProgressEntry.source : learningProgressSourceFromStore(progressSelectedStoreMode, {}),
      storeMode: progressSelectedStoreMode,
      snapshotSelection: persistentProgressEntry.snapshotSelection || (persistentTotals ? '' : 'no-server-progress-snapshot')
    });
    const progressPersistenceContract = learningProgressPersistenceContract(progressSelectedStoreMode, progressSnapshotState);
    const usePersistentAnswers = Boolean(persistentTotals);
    const stableAnswers = usePersistentAnswers ? persistentTotals.answered : 0;
    const stableCorrect = usePersistentAnswers ? persistentTotals.correct : 0;
    const stableIncorrect = usePersistentAnswers ? persistentTotals.incorrect : 0;
    const stableSkipped = persistentTotals ? persistentTotals.skipped : 0;
    const stableSessions = persistentTotals ? persistentTotals.sessions : 0;
    const stableStudyTimeSeconds = persistentTotals ? persistentTotals.studyTimeSeconds : 0;
	    const stableAverageQuestionTime = stableAnswers > 0 ? Math.round(stableStudyTimeSeconds / stableAnswers) : 0;

		  return {
    user: user.user,
    lookupUser: normalizedUser || '',
    eventCount: user.eventCount,
    answers: stableAnswers,
    correct: stableCorrect,
    incorrect: stableIncorrect,
    skipped: stableSkipped,
    studyTimeSeconds: stableStudyTimeSeconds,
    eventWindowAnswers: user.answers,
    eventWindowCorrect: user.correct,
    eventWindowIncorrect: user.incorrect,
    eventWindowSkipped: user.skipped,
    eventWindowSessions: user.sessions,
    eventWindowStudyTimeSeconds: user.totalQuestionTimeSeconds,
    eventWindowAccuracy: user.answers > 0 ? Math.round((user.correct / user.answers) * 100) : 0,
	    progressSource,
	    progressCumulativePersisted: Boolean(persistentTotals),
	    progressServerSnapshotPersisted: Boolean(persistentTotals),
	    progressPrimaryStorePersisted: Boolean(persistentTotals && progressDurabilityGate.strictCumulativeServer),
	    progressFallbackSnapshotPersisted: Boolean(persistentTotals && progressPersistenceContract.fallbackSnapshot),
	    progressConfiguredStoreMode: persistentProgressEntry.configuredStoreMode || learningProgressSummaryStoreMode,
	    progressSelectedStoreMode,
			    progressSnapshotSelection: persistentProgressEntry.snapshotSelection || '',
			    progressSnapshotCandidates: persistentProgressEntry.snapshotCandidates || [],
			    progressPersistenceLayer: progressPersistenceContract.layer,
			    progressPersistenceContract,
			    progressReadOnlyNoDrift: Boolean(persistentTotals && progressPersistenceContract.readOnlyNoDrift),
			    progressDurablePrimaryWrite: Boolean(persistentTotals && progressPersistenceContract.durablePrimaryWrite),
			    progressFallbackSnapshot: Boolean(persistentTotals && progressPersistenceContract.fallbackSnapshot),
			    progressEmptySnapshotCanOverwriteServerTruth: false,
			    progressStaleSnapshotCanOverwriteServerTruth: false,
			    progressLocalCacheCanOverwriteServerTruth: false,
			    progressCumulativeStableKey: progressInvariant ? progressInvariant.stableKey : '',
		    progressStableCumulativeFields: progressInvariant ? progressInvariant.stableFields : LEARNING_PROGRESS_STABLE_FIELDS,
		    progressVolatileDiagnosticFieldsExcludedFromCumulative: LEARNING_PROGRESS_VOLATILE_DIAGNOSTIC_FIELDS,
		    progressCumulativeSourceOfTruth: persistentTotals ? 'server-progress-snapshot' : 'audit-event-window-diagnostic-only',
		    progressNoMutationRead: Boolean(persistentTotals),
	    progressCumulativeFullProductionReady: Boolean(persistentTotals && progressDurabilityGate.strictCumulativeServer),
	    progressStrictCumulativeServer: Boolean(persistentTotals && progressDurabilityGate.strictCumulativeServer),
	    progressWriteDurabilityStatus: progressDurabilityGate.status,
    progressWriteDurabilityGate: progressDurabilityGate,
    progressCumulativeBoundary: progressBoundary.status,
    progressCumulativeBoundaryMessage: progressBoundary.message,
    accuracy: stableAnswers > 0 ? Math.round((stableCorrect / stableAnswers) * 100) : 0,
    sessions: stableSessions,
    loginSuccess: user.loginSuccess,
    loginFailed: user.loginFailed,
    registerSuccess: user.registerSuccess,
    lockedRequests: user.lockedRequests,
    blockedRequests: user.blockedRequests,
    adminDenied: user.adminDenied,
    pageViews: user.pageViews,
    resourceRequests: user.resourceRequests,
    privateVideoStreams: user.privateVideoStreams,
    privateVideoDenied: user.privateVideoDenied,
    privateVideoWatchOpens: user.privateVideoWatchOpens,
    privateVideoWatchStarts: user.privateVideoWatchStarts,
    privateVideoWatchProgress: user.privateVideoWatchProgress,
    privateVideoWatchHeartbeats: user.privateVideoWatchHeartbeats,
    privateVideoWatchCompletes: user.privateVideoWatchCompletes,
    privateVideoWatchErrors: user.privateVideoWatchErrors,
    privateVideoWatchCloses: user.privateVideoWatchCloses,
    privateVideoWatchMaxPercent: user.privateVideoWatchMaxPercent,
    privateVideoWatchSeconds: user.privateVideoWatchSeconds,
    videoUploads: user.videoUploads,
    videoUploadBytes: user.videoUploadBytes,
    aiRequests: user.aiRequests,
    clicks: user.clicks,
    averageQuestionTimeSeconds: stableAverageQuestionTime,
	    ips: Array.from(user.ips).slice(0, 10),
	    ipSources: Array.from(user.ipSources).slice(0, 8),
	    forwardedIps: Array.from(user.forwardedIps).slice(0, 8),
	    countries: Array.from(user.countries).slice(0, 8),
    locations: Array.from(user.locations).slice(0, 8),
    devices: Array.from(user.devices).slice(0, 10),
    deviceIds: Array.from(user.deviceIds).slice(0, 10),
    browserSessionIds: Array.from(user.browserSessionIds).slice(0, 8),
    attemptedUsers: Array.from(user.attemptedUsers).slice(0, 8),
    seenDevices: Array.from(user.seenDevices.values())
      .map((device) => ({
        deviceId: device.deviceId,
        shortId: device.shortId,
        label: device.label,
        browser: device.browser,
        os: device.os,
        platform: device.platform,
        deviceClass: device.deviceClass,
        isIpad: Boolean(device.isIpad),
	        ips: Array.from(device.ips).slice(0, 6),
	        ipSources: Array.from(device.ipSources).slice(0, 6),
	        forwardedIps: Array.from(device.forwardedIps).slice(0, 6),
        browserSessionIds: Array.from(device.browserSessionIds).slice(0, 4),
        eventCount: device.eventCount,
        lastSeenAt: device.lastSeenAt,
        lastSeen: device.lastSeen
      }))
      .sort((a, b) => b.lastSeenAt - a.lastSeenAt || b.eventCount - a.eventCount)
      .slice(0, 12),
    identityKind: user.authenticated ? '已登录账号' : (user.attemptedUsers.size ? '未登录尝试账号' : '未登录访客'),
    access: state ? state.access : 'unknown',
    entitlements: state ? state.entitlements : [],
    disabled: state ? state.disabled : false,
    devicePolicy: state ? state.policy : null,
    deviceBinding: state ? state.deviceBinding : null,
    createdAt: state ? state.createdAt : '',
    lastLoginAt: state ? state.lastLoginAt : '',
    topEventTypes: sortedTop(user.eventTypes, 8),
    knowledgeStats: persistentTotals ? learningProgressAccuracyRows(persistentProgress.byKnowledge, 8) : [],
    eventWindowKnowledgeStats: sortedAccuracy(user.knowledgeStats, 8),
    questionTypeStats: persistentTotals ? learningProgressAccuracyRows(persistentProgress.byType, 6) : [],
    eventWindowQuestionTypeStats: sortedAccuracy(user.questionTypeStats, 6),
    recentAnswers: persistentTotals && Array.isArray(persistentProgress.recentAnswers) && persistentProgress.recentAnswers.length
      ? persistentProgress.recentAnswers.slice(0, 12)
      : [],
    eventWindowRecentAnswers: user.recentAnswers,
    recentEvents: user.recentEvents,
    recentSessions: persistentTotals && Array.isArray(persistentProgress.recentSessions) && persistentProgress.recentSessions.length
      ? persistentProgress.recentSessions.slice(0, 8)
      : [],
    eventWindowRecentSessions: user.recentSessions,
    lastPath: user.lastPath,
    lastSeenAt: user.lastSeenAt,
    lastSeen: user.lastSeen
  };
  }).sort((a, b) => b.lastSeenAt - a.lastSeenAt);

  const accountRowsByUser = new Map();
  activeUserRows.forEach((user) => {
    const key = user.lookupUser || normalizeUsername(user.user);
    accountRowsByUser.set(key || `guest:${user.user}`, user);
  });
  accountStates.forEach((state, username) => {
    if (accountRowsByUser.has(username)) return;
    const binding = state.deviceBinding || null;
    const persistentProgressEntry = learningProgressSummaryEntry(learningProgressByUser.get(username), learningProgressSummarySource);
    const persistentProgress = persistentProgressEntry.progress;
    const persistentTotals = persistentProgress && hasLearningProgressActivity(persistentProgress)
      ? learningProgressTotals(persistentProgress)
      : null;
    const progressInvariant = persistentTotals ? learningProgressReadInvariant(persistentProgressEntry) : null;
    const progressSource = persistentTotals ? persistentProgressEntry.source : 'account-row';
    const progressBoundary = learningProgressBoundaryFromSource(progressSource, learningProgressSummaryStoreMode);
    const progressSelectedStoreMode = persistentProgressEntry.storeMode || learningProgressStoreModeFromSource(progressSource, learningProgressSummaryStoreMode);
    const progressDurabilityGate = learningProgressWriteDurabilityGate(progressSelectedStoreMode);
    const progressSnapshotState = learningProgressSnapshotState({
      progress: persistentTotals ? persistentProgress : createEmptyLearningProgress(username),
      source: persistentTotals ? persistentProgressEntry.source : learningProgressSourceFromStore(progressSelectedStoreMode, {}),
      storeMode: progressSelectedStoreMode,
      snapshotSelection: persistentProgressEntry.snapshotSelection || (persistentTotals ? '' : 'no-server-progress-snapshot')
    });
    const progressPersistenceContract = learningProgressPersistenceContract(progressSelectedStoreMode, progressSnapshotState);
    const lastSeen = binding && binding.lastSeenAt
      ? binding.lastSeenAt
      : (persistentTotals && (persistentTotals.lastAnsweredAt || persistentTotals.lastSessionAt)
        ? (persistentTotals.lastAnsweredAt || persistentTotals.lastSessionAt)
        : (state.lastLoginAt || state.createdAt || ''));
    const lastSeenAt = Date.parse(lastSeen || '') || 0;
    accountRowsByUser.set(username, {
      user: username,
      lookupUser: username,
      eventCount: 0,
      answers: persistentTotals ? persistentTotals.answered : 0,
      correct: persistentTotals ? persistentTotals.correct : 0,
      incorrect: persistentTotals ? persistentTotals.incorrect : 0,
      skipped: persistentTotals ? persistentTotals.skipped : 0,
      studyTimeSeconds: persistentTotals ? persistentTotals.studyTimeSeconds : 0,
	      progressSource,
	      progressCumulativePersisted: Boolean(persistentTotals),
	      progressServerSnapshotPersisted: Boolean(persistentTotals),
	      progressPrimaryStorePersisted: Boolean(persistentTotals && progressDurabilityGate.strictCumulativeServer),
	      progressFallbackSnapshotPersisted: Boolean(persistentTotals && progressPersistenceContract.fallbackSnapshot),
	      progressConfiguredStoreMode: persistentProgressEntry.configuredStoreMode || learningProgressSummaryStoreMode,
	      progressSelectedStoreMode,
			      progressSnapshotSelection: persistentProgressEntry.snapshotSelection || '',
			      progressSnapshotCandidates: persistentProgressEntry.snapshotCandidates || [],
			      progressPersistenceLayer: progressPersistenceContract.layer,
			      progressPersistenceContract,
			      progressReadOnlyNoDrift: Boolean(persistentTotals && progressPersistenceContract.readOnlyNoDrift),
			      progressDurablePrimaryWrite: Boolean(persistentTotals && progressPersistenceContract.durablePrimaryWrite),
			      progressFallbackSnapshot: Boolean(persistentTotals && progressPersistenceContract.fallbackSnapshot),
			      progressEmptySnapshotCanOverwriteServerTruth: false,
			      progressStaleSnapshotCanOverwriteServerTruth: false,
			      progressLocalCacheCanOverwriteServerTruth: false,
			      progressCumulativeStableKey: progressInvariant ? progressInvariant.stableKey : '',
		      progressStableCumulativeFields: progressInvariant ? progressInvariant.stableFields : LEARNING_PROGRESS_STABLE_FIELDS,
		      progressVolatileDiagnosticFieldsExcludedFromCumulative: LEARNING_PROGRESS_VOLATILE_DIAGNOSTIC_FIELDS,
		      progressCumulativeSourceOfTruth: persistentTotals ? 'server-progress-snapshot' : 'account-row-diagnostic-only',
	      progressNoMutationRead: Boolean(persistentTotals),
	      progressCumulativeFullProductionReady: Boolean(persistentTotals && progressDurabilityGate.strictCumulativeServer),
	      progressStrictCumulativeServer: Boolean(persistentTotals && progressDurabilityGate.strictCumulativeServer),
	      progressWriteDurabilityStatus: progressDurabilityGate.status,
      progressWriteDurabilityGate: progressDurabilityGate,
      progressCumulativeBoundary: progressBoundary.status,
      progressCumulativeBoundaryMessage: progressBoundary.message,
      eventWindowAnswers: 0,
      eventWindowCorrect: 0,
      eventWindowIncorrect: 0,
      eventWindowSessions: 0,
      eventWindowStudyTimeSeconds: 0,
      eventWindowAccuracy: 0,
      accuracy: persistentTotals ? persistentTotals.accuracy : 0,
      sessions: persistentTotals ? persistentTotals.sessions : 0,
      loginSuccess: 0,
      loginFailed: 0,
      registerSuccess: 0,
      lockedRequests: 0,
      blockedRequests: 0,
      adminDenied: 0,
      pageViews: 0,
      resourceRequests: 0,
      privateVideoStreams: 0,
      privateVideoDenied: 0,
      privateVideoWatchOpens: 0,
      privateVideoWatchStarts: 0,
      privateVideoWatchProgress: 0,
      privateVideoWatchHeartbeats: 0,
      privateVideoWatchCompletes: 0,
      privateVideoWatchErrors: 0,
      privateVideoWatchCloses: 0,
      privateVideoWatchMaxPercent: 0,
      privateVideoWatchSeconds: 0,
      videoUploads: 0,
	      videoUploadBytes: 0,
	      aiRequests: 0,
	      clicks: 0,
		      averageQuestionTimeSeconds: persistentTotals ? persistentTotals.averageQuestionTimeSeconds : 0,
	      ips: binding && binding.lastIp ? [binding.lastIp] : [],
	      ipSources: binding && binding.lastIpSource ? [binding.lastIpSource] : [],
	      forwardedIps: [],
	      countries: [],
      locations: [],
      devices: binding && binding.label ? [binding.label] : [],
      deviceIds: binding && binding.deviceId ? [binding.deviceId] : [],
      browserSessionIds: binding && binding.lastBrowserSessionId ? [binding.lastBrowserSessionId] : [],
      seenDevices: binding && binding.deviceId ? [{
        deviceId: binding.deviceId,
        shortId: binding.shortDeviceId,
        label: binding.label || '',
        browser: binding.browser || '',
        os: binding.os || '',
        platform: binding.platform || '',
        deviceClass: binding.deviceClass || '',
	        isIpad: Boolean(binding.isIpad),
	        ips: binding.lastIp ? [binding.lastIp] : [],
	        ipSources: binding.lastIpSource ? [binding.lastIpSource] : [],
	        forwardedIps: [],
        browserSessionIds: binding.lastBrowserSessionId ? [binding.lastBrowserSessionId] : [],
        eventCount: 0,
        lastSeenAt,
        lastSeen
      }] : [],
      attemptedUsers: [],
      identityKind: state.policy && state.policy.exempt ? '教师账号' : '已注册账号',
      access: state.access,
      entitlements: state.entitlements || [],
      disabled: Boolean(state.disabled),
      devicePolicy: state.policy || null,
      deviceBinding: binding,
      createdAt: state.createdAt || '',
      lastLoginAt: state.lastLoginAt || '',
      topEventTypes: [],
      knowledgeStats: persistentProgress ? learningProgressAccuracyRows(persistentProgress.byKnowledge, 8) : [],
      questionTypeStats: persistentProgress ? learningProgressAccuracyRows(persistentProgress.byType, 6) : [],
      recentAnswers: persistentProgress && Array.isArray(persistentProgress.recentAnswers) ? persistentProgress.recentAnswers.slice(0, 12) : [],
      recentEvents: [],
      recentSessions: persistentProgress && Array.isArray(persistentProgress.recentSessions) ? persistentProgress.recentSessions.slice(0, 8) : [],
      lastPath: '',
      lastSeenAt,
      lastSeen
    });
  });
  function accountPinRank(row) {
    const kind = String(row && row.identityKind || '');
    if (kind === '教师账号' || kind === '已登录账号') return 0;
    if (kind === '已注册账号') return 1;
    if (kind === '未登录尝试账号') return 2;
    return 3;
  }

  const accountUserRows = Array.from(accountRowsByUser.values())
    .sort((a, b) => accountPinRank(a) - accountPinRank(b) || b.lastSeenAt - a.lastSeenAt || b.eventCount - a.eventCount || a.user.localeCompare(b.user));

	  const accountProfiles = accountUserRows.map((user) => {
	    const riskReasons = [];
	    if (user.loginFailed) riskReasons.push(`登录失败 ${user.loginFailed}`);
	    if (user.lockedRequests) riskReasons.push(`锁定访问 ${user.lockedRequests}`);
	    if (user.blockedRequests) riskReasons.push(`拦截 ${user.blockedRequests}`);
	    if (user.adminDenied) riskReasons.push(`后台拒绝 ${user.adminDenied}`);
	    if (user.privateVideoDenied) riskReasons.push(`视频拒绝 ${user.privateVideoDenied}`);
	    if (user.privateVideoWatchErrors) riskReasons.push(`视频异常 ${user.privateVideoWatchErrors}`);
	    if (user.answers >= 3 && user.accuracy < 60) riskReasons.push(`答题正确率低 ${user.accuracy}%`);
	    if ((user.deviceIds || []).length > 1) riskReasons.push(`设备 ID ${user.deviceIds.length} 个`);
	    if (user.disabled) riskReasons.push('账号已禁用');
	    if (user.deviceBinding && user.deviceBinding.mismatchCount) riskReasons.push(`绑定冲突 ${user.deviceBinding.mismatchCount}`);
	    if (user.deviceBinding && user.deviceBinding.deviceId && (user.deviceIds || []).length && !(user.deviceIds || []).includes(user.deviceBinding.deviceId)) {
	      riskReasons.push('当前记录未回到绑定设备');
	    }
	    if (user.identityKind !== '已登录账号' && (user.lockedRequests || user.blockedRequests || user.loginFailed)) riskReasons.push(user.identityKind);
	    const riskScore =
	      user.loginFailed * 2 +
	      user.lockedRequests * 3 +
	      user.blockedRequests +
	      user.adminDenied * 4 +
	      user.privateVideoDenied * 3 +
	      user.privateVideoWatchErrors * 4 +
	      (user.disabled ? 4 : 0) +
	      Math.min(8, Number(user.deviceBinding && user.deviceBinding.mismatchCount ? user.deviceBinding.mismatchCount : 0) * 2) +
	      Math.max(0, (user.deviceIds || []).length - 1) * 4 +
	      (user.answers >= 3 && user.accuracy < 60 ? Math.max(1, Math.ceil((60 - user.accuracy) / 10)) : 0) +
	      (user.identityKind !== '已登录账号' && riskReasons.length ? 2 : 0);
	    return {
	      user: user.user,
	      identityKind: user.identityKind,
		      attemptedUsers: user.attemptedUsers,
		      ips: user.ips,
		      ipSources: user.ipSources,
		      forwardedIps: user.forwardedIps,
		      locations: user.locations,
	      devices: user.devices,
	      deviceIds: user.deviceIds,
	      browserSessionIds: user.browserSessionIds,
	      seenDevices: user.seenDevices,
	      access: user.access,
	      entitlements: user.entitlements,
	      devicePolicy: user.devicePolicy,
	      deviceBinding: user.deviceBinding,
	      eventCount: user.eventCount,
	      loginSuccess: user.loginSuccess,
	      loginFailed: user.loginFailed,
	      registerSuccess: user.registerSuccess,
	      lockedRequests: user.lockedRequests,
	      blockedRequests: user.blockedRequests,
	      adminDenied: user.adminDenied,
	      privateVideoDenied: user.privateVideoDenied,
	      answers: user.answers,
	      accuracy: user.accuracy,
	      sessions: user.sessions,
	      privateVideoWatchStarts: user.privateVideoWatchStarts,
	      privateVideoWatchCompletes: user.privateVideoWatchCompletes,
	      privateVideoWatchErrors: user.privateVideoWatchErrors,
	      privateVideoWatchMaxPercent: user.privateVideoWatchMaxPercent,
	      privateVideoWatchSeconds: user.privateVideoWatchSeconds,
	      riskScore,
	      riskReasons,
	      disabled: user.disabled,
	      createdAt: user.createdAt,
	      lastLoginAt: user.lastLoginAt,
	      lastSeenAt: user.lastSeenAt,
	      lastSeen: user.lastSeen,
	      lastPath: user.lastPath
	    };
	  }).sort((a, b) => accountPinRank(a) - accountPinRank(b) || b.lastSeenAt - a.lastSeenAt || b.riskScore - a.riskScore).slice(0, 80);

  const learningProgress = accountUserRows
    .filter((user) => user.progressCumulativePersisted === true || user.eventWindowAnswers || user.eventWindowSessions || user.eventWindowStudyTimeSeconds)
    .map((user) => ({
      user: user.user,
      identityKind: user.identityKind,
      answers: user.answers,
      correct: user.correct,
      incorrect: user.incorrect,
      skipped: user.skipped || 0,
      accuracy: user.accuracy,
      sessions: user.sessions,
      studyTimeSeconds: user.studyTimeSeconds || 0,
      eventWindowAnswers: user.eventWindowAnswers || 0,
      eventWindowCorrect: user.eventWindowCorrect || 0,
      eventWindowIncorrect: user.eventWindowIncorrect || 0,
      eventWindowSkipped: user.eventWindowSkipped || 0,
      eventWindowSessions: user.eventWindowSessions || 0,
      eventWindowStudyTimeSeconds: user.eventWindowStudyTimeSeconds || 0,
	      eventWindowAccuracy: user.eventWindowAccuracy || 0,
	      progressSource: user.progressSource || 'audit-event-window',
	      progressCumulativePersisted: user.progressCumulativePersisted === true,
	      progressServerSnapshotPersisted: user.progressServerSnapshotPersisted === true,
	      progressPrimaryStorePersisted: user.progressPrimaryStorePersisted === true,
	      progressFallbackSnapshotPersisted: user.progressFallbackSnapshotPersisted === true,
	      progressConfiguredStoreMode: user.progressConfiguredStoreMode || '',
	      progressSelectedStoreMode: user.progressSelectedStoreMode || '',
      progressSnapshotSelection: user.progressSnapshotSelection || '',
      progressSnapshotCandidates: user.progressSnapshotCandidates || [],
      progressPersistenceLayer: user.progressPersistenceLayer || '',
      progressPersistenceContract: user.progressPersistenceContract || null,
      progressReadOnlyNoDrift: user.progressReadOnlyNoDrift === true,
      progressDurablePrimaryWrite: user.progressDurablePrimaryWrite === true,
      progressFallbackSnapshot: user.progressFallbackSnapshot === true,
      progressEmptySnapshotCanOverwriteServerTruth: false,
      progressStaleSnapshotCanOverwriteServerTruth: false,
      progressLocalCacheCanOverwriteServerTruth: false,
      progressCumulativeStableKey: user.progressCumulativeStableKey || '',
	      progressStableCumulativeFields: Array.isArray(user.progressStableCumulativeFields)
	        ? user.progressStableCumulativeFields
	        : LEARNING_PROGRESS_STABLE_FIELDS,
	      progressVolatileDiagnosticFieldsExcludedFromCumulative: Array.isArray(user.progressVolatileDiagnosticFieldsExcludedFromCumulative)
	        ? user.progressVolatileDiagnosticFieldsExcludedFromCumulative
	        : LEARNING_PROGRESS_VOLATILE_DIAGNOSTIC_FIELDS,
	      progressCumulativeSourceOfTruth: user.progressCumulativeSourceOfTruth || (user.progressCumulativePersisted === true ? 'server-progress-snapshot' : 'audit-event-window-diagnostic-only'),
	      progressNoMutationRead: user.progressNoMutationRead === true,
	      progressCumulativeFullProductionReady: user.progressCumulativeFullProductionReady === true,
	      progressStrictCumulativeServer: user.progressStrictCumulativeServer === true,
	      progressWriteDurabilityStatus: user.progressWriteDurabilityStatus || '',
	      progressWriteDurabilityGate: user.progressWriteDurabilityGate || null,
	      progressCumulativeBoundary: user.progressCumulativeBoundary || 'not-cumulative-truth',
	      progressCumulativeBoundaryMessage: user.progressCumulativeBoundaryMessage || '',
      averageQuestionTimeSeconds: user.averageQuestionTimeSeconds,
      knowledgeStats: user.knowledgeStats,
      questionTypeStats: user.questionTypeStats,
      recentAnswers: user.recentAnswers || [],
      recentSessions: user.recentSessions || [],
      privateVideoWatchStarts: user.privateVideoWatchStarts,
      privateVideoWatchCompletes: user.privateVideoWatchCompletes,
      privateVideoWatchErrors: user.privateVideoWatchErrors,
      privateVideoWatchMaxPercent: user.privateVideoWatchMaxPercent,
      privateVideoWatchSeconds: user.privateVideoWatchSeconds,
      pageViews: user.pageViews,
      resourceRequests: user.resourceRequests,
      lastSeen: user.lastSeen,
      lastPath: user.lastPath
    }))
    .slice(0, 80);

	  function profilePinRank(row) {
	    if (row && row.users && row.users.length) return 0;
	    if (row && row.attemptedUsers && row.attemptedUsers.length) return 1;
	    return 2;
	  }

	  function profileRows(map, type) {
    return Array.from(map.values()).map((profile) => {
      const users = Array.from(profile.users).slice(0, 12);
      const attemptedUsers = Array.from(profile.attemptedUsers).slice(0, 12);
      const riskScore =
        profile.suspiciousEvents +
        profile.loginFailed * 2 +
        profile.lockedRequests * 3 +
        profile.blockedRequests +
        profile.adminDenied * 4 +
        profile.privateVideoDenied * 3 +
        Math.max(0, profile.deviceIds.size - 1) * 3 +
        Math.max(0, users.length + attemptedUsers.length - 1) * 2;
      return {
        type,
	        ip: profile.ip || '',
	        ipVerified: Boolean(profile.ipVerified),
	        device: profile.device || '',
        eventCount: profile.eventCount,
        users,
        attemptedUsers,
	        ips: Array.from(profile.ips).slice(0, 10),
	        ipSources: Array.from(profile.ipSources || []).slice(0, 8),
	        forwardedIps: Array.from(profile.forwardedIps || []).slice(0, 8),
        devices: Array.from(profile.devices).slice(0, 10),
        deviceIds: Array.from(profile.deviceIds).slice(0, 10),
        locations: Array.from(profile.locations).slice(0, 8),
        browserSessionIds: Array.from(profile.browserSessionIds).slice(0, 8),
        loginFailed: profile.loginFailed,
        lockedRequests: profile.lockedRequests,
        blockedRequests: profile.blockedRequests,
        adminDenied: profile.adminDenied,
        privateVideoDenied: profile.privateVideoDenied,
        suspiciousEvents: profile.suspiciousEvents,
        pageViews: profile.pageViews,
        answers: profile.answers,
        privateVideoWatchStarts: profile.privateVideoWatchStarts,
        riskScore,
        lastPath: profile.lastPath,
        lastSeenAt: profile.lastSeenAt,
        lastSeen: profile.lastSeen
      };
	    }).sort((a, b) => profilePinRank(a) - profilePinRank(b) || b.lastSeenAt - a.lastSeenAt || b.riskScore - a.riskScore).slice(0, 80);
	  }

	  const ipProfileRows = profileRows(ipProfiles, 'ip');
	  const deviceProfileRows = profileRows(deviceProfiles, 'device');

	  function riskOverviewFromProfiles() {
	    const overview = [];
	    accountProfiles.forEach((row) => {
	      if (!row.riskScore) return;
	      overview.push({
	        kind: '账号',
	        label: row.user,
	        search: row.user,
	        score: row.riskScore,
	        reasons: row.riskReasons || [],
	        detail: [
            row.identityKind,
            row.access ? `权限 ${row.access}` : '',
            (row.ips || []).join(' / '),
            (row.devices || []).join(' / '),
            row.deviceBinding && row.deviceBinding.shortDeviceId ? `绑定 ${row.deviceBinding.shortDeviceId}` : '',
            row.deviceBinding && row.deviceBinding.mismatchCount ? `冲突 ${row.deviceBinding.mismatchCount}` : '',
            (row.deviceIds || []).length ? `设备ID ${(row.deviceIds || []).map(shortDeviceId).join(' / ')}` : ''
          ].filter(Boolean).join('；'),
	        path: row.lastPath || '',
	        lastSeen: row.lastSeen || ''
	      });
	    });
	    ipProfileRows.forEach((row) => {
	      if (!row.riskScore) return;
	      const reasons = [];
	      if (row.loginFailed) reasons.push(`登录失败 ${row.loginFailed}`);
	      if (row.lockedRequests) reasons.push(`锁定 ${row.lockedRequests}`);
	      if (row.blockedRequests) reasons.push(`拦截 ${row.blockedRequests}`);
	      if (row.adminDenied) reasons.push(`后台拒绝 ${row.adminDenied}`);
	      if (row.privateVideoDenied) reasons.push(`视频拒绝 ${row.privateVideoDenied}`);
	      if ((row.deviceIds || []).length > 1) reasons.push('同一 IP 多设备ID');
	      if ((row.users || []).length + (row.attemptedUsers || []).length > 1) reasons.push('同一 IP 多账号/尝试账号');
	      overview.push({
	        kind: 'IP',
	        label: row.ip,
	        search: row.ip,
	        score: row.riskScore,
	        reasons,
	        detail: [`账号 ${((row.users||[]).join(' / ') || '未登录')}`, `设备 ${(row.devices||[]).join(' / ') || 'unknown'}`].join('；'),
	        path: row.lastPath || '',
	        lastSeen: row.lastSeen || ''
	      });
	    });
	    deviceProfileRows.forEach((row) => {
	      if (!row.riskScore) return;
	      const reasons = [];
	      if (row.suspiciousEvents) reasons.push(`异常事件 ${row.suspiciousEvents}`);
	      if (row.loginFailed) reasons.push(`登录失败 ${row.loginFailed}`);
	      if (row.lockedRequests) reasons.push(`锁定 ${row.lockedRequests}`);
	      if (row.blockedRequests) reasons.push(`拦截 ${row.blockedRequests}`);
	      if ((row.deviceIds || []).length > 1) reasons.push('同一设备标签多设备ID');
	      if ((row.users || []).length + (row.attemptedUsers || []).length > 1) reasons.push('同一设备多账号/尝试账号');
	      overview.push({
	        kind: '设备',
	        label: row.device,
	        search: row.device,
	        score: row.riskScore,
	        reasons,
	        detail: [`账号 ${((row.users||[]).join(' / ') || '未登录')}`, `IP ${(row.ips||[]).join(' / ') || 'unknown'}`].join('；'),
	        path: row.lastPath || '',
	        lastSeen: row.lastSeen || ''
	      });
	    });
	    suspiciousAccess.slice(0, 24).forEach((row) => {
	      overview.push({
	        kind: '最新异常',
	        label: row.user || row.attemptedUsers || row.ip || '未登录',
	        search: row.user || row.attemptedUsers || row.ip || row.device || '',
	        score: 1,
	        reasons: [row.type || '异常访问', row.result || ''],
	        detail: [row.ip, row.device].filter(Boolean).join('；'),
	        path: row.path || '',
	        lastSeen: row.iso || ''
	      });
	    });
	    return overview
	      .sort((a, b) => Number(b.score||0) - Number(a.score||0) || String(b.lastSeen||'').localeCompare(String(a.lastSeen||'')))
	      .slice(0, 30);
	  }

	  const privateVideoProgressRows = Array.from(privateVideoProgress.values()).map((row) => ({
	    video: row.video,
	    title: row.title,
	    eventCount: row.eventCount,
	    streams: row.streams,
	    denied: row.denied,
	    opens: row.opens,
	    sourceReady: row.sourceReady,
	    starts: row.starts,
	    progressEvents: row.progressEvents,
	    heartbeats: row.heartbeats,
	    completes: row.completes,
	    errors: row.errors,
	    closes: row.closes,
	    maxPercent: row.maxPercent,
	    maxSeconds: row.maxSeconds,
	    users: Array.from(row.users).slice(0, 12),
	    ips: Array.from(row.ips).slice(0, 8),
	    devices: Array.from(row.devices).slice(0, 8),
	    userProgress: Array.from(row.userProgress.values())
	      .sort((a, b) => b.maxPercent - a.maxPercent || b.maxSeconds - a.maxSeconds || b.lastSeenAt - a.lastSeenAt)
	      .slice(0, 12),
	    lastSeenAt: row.lastSeenAt,
	    lastSeen: row.lastSeen,
	    lastUser: row.lastUser,
	    lastStatus: row.lastStatus,
	    lastPath: row.lastPath
	  })).sort((a, b) => b.lastSeenAt - a.lastSeenAt || b.errors - a.errors).slice(0, 80);

	  const bindingOverview = {
	    registeredAccounts: accountUserRows.filter((row) => row.identityKind !== '未登录访客').length,
	    boundAccounts: accountUserRows.filter((row) => row.deviceBinding && row.deviceBinding.deviceId).length,
	    unboundAccounts: accountUserRows.filter((row) => row.identityKind !== '教师账号' && row.identityKind !== '未登录访客' && !(row.deviceBinding && row.deviceBinding.deviceId)).length,
	    conflictAccounts: accountUserRows.filter((row) => row.deviceBinding && Number(row.deviceBinding.mismatchCount || 0) > 0).length,
	    lockedAccounts: accountUserRows.filter((row) => row.access === 'locked').length
	  };
	  const progressSourceCounts = new Map();
	  accountUserRows.forEach((row) => {
	    const source = String(row.progressSource || '').trim() || 'unknown';
	    progressSourceCounts.set(source, (progressSourceCounts.get(source) || 0) + 1);
	  });
		  const progressStoreMode = String(learningProgressSummaryStoreMode || '').trim() || 'unavailable';
		  const progressStoreSource = String(learningProgressSummarySource || '').trim() || learningProgressSourceFromStore(progressStoreMode, {});
		  const progressStoreBoundary = learningProgressStoreBoundary(progressStoreMode);
		  const progressWriteDurabilityGate = learningProgressWriteDurabilityGate(progressStoreMode);
		  const emptyCumulativeTotals = () => ({
		    answered: 0,
		    correct: 0,
		    incorrect: 0,
		    skipped: 0,
		    sessions: 0,
		    studyTimeSeconds: 0,
		    averageQuestionTimeSeconds: 0,
		    accuracy: 0
		  });
			  const serverSnapshotCumulativeTotals = learningProgress.reduce((totals, row) => {
			    if (row.progressCumulativePersisted !== true || row.progressNoMutationRead !== true || row.progressCumulativeSourceOfTruth !== 'server-progress-snapshot') return totals;
			    totals.answered += Number(row.answers || 0);
		    totals.correct += Number(row.correct || 0);
		    totals.incorrect += Number(row.incorrect || 0);
		    totals.skipped += Number(row.skipped || 0);
		    totals.sessions += Number(row.sessions || 0);
			    totals.studyTimeSeconds += Number(row.studyTimeSeconds || 0);
			    return totals;
			  }, emptyCumulativeTotals());
				  const serverSnapshotRowCount = learningProgress.filter((row) => (
				    row.progressCumulativePersisted === true
				      && row.progressNoMutationRead === true
				      && row.progressCumulativeSourceOfTruth === 'server-progress-snapshot'
				  )).length;
			  const durablePrimaryRowCount = learningProgress.filter((row) => row.progressDurablePrimaryWrite === true).length;
			  const fallbackSnapshotRowCount = learningProgress.filter((row) => row.progressFallbackSnapshot === true).length;
			  serverSnapshotCumulativeTotals.averageQuestionTimeSeconds = serverSnapshotCumulativeTotals.answered > 0
			    ? Math.round(serverSnapshotCumulativeTotals.studyTimeSeconds / serverSnapshotCumulativeTotals.answered)
			    : 0;
		  serverSnapshotCumulativeTotals.accuracy = serverSnapshotCumulativeTotals.answered > 0
		    ? Math.round((serverSnapshotCumulativeTotals.correct / serverSnapshotCumulativeTotals.answered) * 100)
		    : 0;
		  const auditEventWindowAnswerStats = learningProgress.reduce((totals, row) => {
		    totals.answered += Number(row.eventWindowAnswers || 0);
		    totals.correct += Number(row.eventWindowCorrect || 0);
		    totals.incorrect += Number(row.eventWindowIncorrect || 0);
		    totals.skipped += Number(row.eventWindowSkipped || 0);
		    totals.sessions += Number(row.eventWindowSessions || 0);
		    totals.studyTimeSeconds += Number(row.eventWindowStudyTimeSeconds || 0);
		    return totals;
		  }, emptyCumulativeTotals());
		  auditEventWindowAnswerStats.averageQuestionTimeSeconds = auditEventWindowAnswerStats.answered > 0
		    ? Math.round(auditEventWindowAnswerStats.studyTimeSeconds / auditEventWindowAnswerStats.answered)
		    : 0;
			  auditEventWindowAnswerStats.accuracy = auditEventWindowAnswerStats.answered > 0
			    ? Math.round((auditEventWindowAnswerStats.correct / auditEventWindowAnswerStats.answered) * 100)
			    : 0;
			  const progressStoreSnapshotState = {
			    hasServerProgressSnapshot: serverSnapshotRowCount > 0,
			    emptyServerProgressSnapshot: serverSnapshotRowCount === 0
			  };
			  const progressStorePersistenceContract = learningProgressPersistenceContract(progressStoreMode, progressStoreSnapshotState);
				  const progressMonitoringTruth = {
				    noMutationRead: true,
				    cumulativeSourceOfTruth: 'server-progress-snapshot',
				    serverSnapshotRowCount,
				    durablePrimaryRowCount,
				    fallbackSnapshotRowCount,
				    progressPersistenceLayer: progressStorePersistenceContract.layer,
				    progressPersistenceContract: progressStorePersistenceContract,
				    readOnlyNoDrift: progressStorePersistenceContract.readOnlyNoDrift,
				    durablePrimaryWrite: progressStorePersistenceContract.durablePrimaryWrite,
				    fallbackSnapshot: progressStorePersistenceContract.fallbackSnapshot,
				    serverSnapshotReady: serverSnapshotRowCount > 0,
				    emptyServerProgressSnapshot: serverSnapshotRowCount === 0,
				    emptySnapshotDoesNotCreateCumulative: serverSnapshotRowCount === 0,
				    emptySnapshotDoesNotProvePersistence: serverSnapshotRowCount === 0,
				    emptySnapshotCanOverwriteServerTruth: false,
				    staleSnapshotCanOverwriteServerTruth: false,
				    localCacheCanOverwriteServerTruth: false,
				    serverSnapshotCumulativeTotals,
			    auditEventWindowExcludedFromCumulative: true,
		    auditEventWindowAnswerStats,
		    serverUpgradeInvariant: progressStoreBoundary.serverUpgradeInvariant
		  };

		  return {
    totalEvents: events.length,
    uniqueUsers: activeUserRows.length,
    uniqueIps: ips.size,
    uniqueDevices: deviceIds.size || devices.size,
	    answerStats: {
	      ...serverSnapshotCumulativeTotals,
	      noMutationRead: true,
	      cumulativeSourceOfTruth: 'server-progress-snapshot',
	      auditEventWindowExcludedFromCumulative: true
	    },
	    auditEventWindowAnswerStats,
	    progressMonitoringTruth,
    users: accountUserRows.slice(0, 120),
	    accountProfiles,
	    ipProfiles: ipProfileRows,
	    deviceProfiles: deviceProfileRows,
	    learningProgress,
	    riskOverview: riskOverviewFromProfiles(),
	    suspiciousAccess,
    suspiciousStats: {
      total: suspiciousCount,
      visible: suspiciousAccess.length
    },
    coreEventCounts,
    recentAnswers,
    recentSessions,
	    recentRegisterEvents,
	    recentPrivateVideoEvents,
	    privateVideoProgress: privateVideoProgressRows,
	    recentUserEvents,
    registrationStats,
	    privateVideoStats,
	    bindingOverview,
		    learningProgressStore: {
			      source: progressStoreSource,
			      storeMode: progressStoreMode,
				      noMutationRead: true,
					      cumulativeSourceOfTruth: 'server-progress-snapshot',
					      progressPersistenceLayer: progressStorePersistenceContract.layer,
					      progressPersistenceContract: progressStorePersistenceContract,
					      readOnlyNoDrift: progressStorePersistenceContract.readOnlyNoDrift,
					      durablePrimaryWrite: progressStorePersistenceContract.durablePrimaryWrite,
					      fallbackSnapshot: progressStorePersistenceContract.fallbackSnapshot,
					      serverSnapshotStorageReady: progressStoreMode !== 'unavailable',
					      serverSnapshotReady: serverSnapshotRowCount > 0,
					      snapshotPersisted: serverSnapshotRowCount > 0,
				      emptyServerProgressSnapshot: serverSnapshotRowCount === 0,
				      progressSnapshotStatus: serverSnapshotRowCount > 0 ? 'server-progress-snapshot-present' : 'empty-server-progress-snapshot',
					      emptySnapshotDoesNotCreateCumulative: serverSnapshotRowCount === 0,
					      emptySnapshotDoesNotProvePersistence: serverSnapshotRowCount === 0,
					      emptySnapshotCanOverwriteServerTruth: false,
					      staleSnapshotCanOverwriteServerTruth: false,
					      localCacheCanOverwriteServerTruth: false,
					      strictPrimaryStoreReady: progressWriteDurabilityGate.strictCumulativeServer === true,
				      primaryStoreRequired: true,
				      productionBlockers: learningProgressProductionBlockers(progressWriteDurabilityGate),
			      durablePrimary: progressWriteDurabilityGate.durablePrimary,
			      fullProductionReady: progressWriteDurabilityGate.fullProductionReady,
			      productionReady: progressWriteDurabilityGate.productionReady,
			      degradedKvFallback: progressStoreMode === 'kv-single-write-fallback',
			      strictCumulativeServer: progressWriteDurabilityGate.strictCumulativeServer,
			      writeDurabilityGate: progressWriteDurabilityGate,
			      missingPrimaryBindings: progressWriteDurabilityGate.missingPrimaryBindings,
			      missingAllPrimaryBindings: progressWriteDurabilityGate.missingAllPrimaryBindings,
			      strictBlocksWhenPrimaryMissing: progressWriteDurabilityGate.missingAllPrimaryBindings === true,
				      status: progressStoreBoundary.status,
				      boundary: progressStoreBoundary.message,
				      acceptance: progressStoreBoundary.acceptance,
				      serverUpgradeInvariant: progressStoreBoundary.serverUpgradeInvariant,
				      stableCumulativeFields: LEARNING_PROGRESS_STABLE_FIELDS,
				      volatileDiagnosticFieldsExcludedFromCumulative: LEARNING_PROGRESS_VOLATILE_DIAGNOSTIC_FIELDS,
				      serverSnapshotCumulativeTotals,
				      auditEventWindowExcludedFromCumulative: true,
				      auditEventWindowAnswerStats,
				      progressSourceCounts: Array.from(progressSourceCounts.entries()).map(([name, count]) => ({ name, count }))
				    },
	    topUsers: accountUserRows.filter((user) => user.identityKind !== '未登录访客').slice(0, 16).map((user) => ({ name: user.user, count: user.eventCount })),
    topEventTypes: sortedTop(eventTypes, 16),
    topPrivateVideos: sortedTop(privateVideoViews, 12),
    topKnowledge: sortedAccuracy(knowledgeStats, 16),
    topQuestionTypes: sortedAccuracy(typeStats, 10),
    topIps: ipProfileRows.slice(0, 10).map((row) => ({ name: row.ip, count: row.eventCount })),
    topDevices: sortedTop(devices),
    topDeviceIds: sortedTop(deviceIds, 16).map((item) => ({ ...item, shortId: shortDeviceId(item.name) })),
    topPaths: sortedTop(paths)
  };
}

async function handleEvents(context, session) {
  const { request, env } = context;
  if (!isAdmin(session, env)) {
    queueAudit(context, 'admin_denied', {}, session);
    return jsonResponse({ ok: false, error: 'admin_required' }, { status: 403 });
  }

  const url = new URL(request.url);
  const view = String(url.searchParams.get('view') || 'full').toLowerCase();
  const includeEvents = view !== 'summary';
  const limit = Math.max(1, Math.min(800, Number(url.searchParams.get('limit') || (includeEvents ? 300 : 180))));

  if (!env.FM_AUDIT) return jsonResponse({ ok: true, events: [] });

  let index = [];
  try {
    index = JSON.parse((await env.FM_AUDIT.get(INDEX_KEY)) || '[]');
    if (!Array.isArray(index)) index = [];
  } catch (_) {
    index = [];
  }

  const ids = index.slice(0, limit);
  const records = await Promise.all(ids.map((id) => env.FM_AUDIT.get(`event:${id}`)));
  const events = [];
  for (const raw of records) {
    if (!raw) continue;
    try {
      events.push(JSON.parse(raw));
    } catch (_) {}
  }

  const allKnownUsers = Array.from(new Set([
    ...knownUsernamesFromEvents(events),
    ...(await listKnownAccountUsernames(env, ACCOUNT_SUMMARY_LIMIT))
  ]));
  const [accountStates, learningProgressEntries] = await Promise.all([
    readAccountStatesForUsers(env, allKnownUsers),
    Promise.all(allKnownUsers.map(async (username) => [username, await readLearningProgressWithSource(env, username)]))
  ]);
  const learningProgressByUser = new Map();
  learningProgressEntries.forEach(([username, entry]) => {
    if (hasLearningProgressActivity(entry && entry.progress)) learningProgressByUser.set(username, entry);
  });
  return jsonResponse({
    ok: true,
    events: includeEvents ? events : [],
    summary: buildAdminSummary(events, accountStates, learningProgressByUser, learningProgressSource(env), learningProgressStoreMode(env)),
    view
  });
}

async function handleAdminDeviceBindings(context, session) {
  const { request, env } = context;
  if (!isAdmin(session, env)) {
    queueAudit(context, 'admin_denied', { target: new URL(request.url).pathname }, session);
    return jsonResponse({ ok: false, error: 'admin_required' }, { status: 403 });
  }
  if (!env.FM_AUDIT) {
    return jsonResponse({ ok: false, error: 'storage_not_configured', message: '设备绑定存储未配置。' }, { status: 503 });
  }
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  }

  const body = await readJsonRequest(request);
  if (!body) {
    return jsonResponse({ ok: false, error: 'invalid_json', message: '请求格式不正确。' }, { status: 400 });
  }

  const username = normalizeUsername(body.username);
  const action = String(body.action || 'bind').trim().toLowerCase();
  if (!username) {
    return jsonResponse({ ok: false, error: 'invalid_username', message: '账号名不正确。' }, { status: 400 });
  }
  if (isAdminUsername(username, env)) {
    return jsonResponse({ ok: false, error: 'admin_exempt', message: '教师账号默认不受单设备绑定限制。' }, { status: 400 });
  }

  const policy = singleDevicePolicy(username, env);
  const bindingKey = deviceBindingKey(username);
  const existing = await readDeviceBinding(env, username);
  const accountState = (await readAccountStatesForUsers(env, [username])).get(username);
  if (!accountState || accountState.access === 'unknown') {
    return jsonResponse({ ok: false, error: 'account_not_found', message: '只能给已注册账号绑定设备。' }, { status: 404 });
  }

  if (action === 'clear') {
    try {
      if (bindingKey) await env.FM_AUDIT.delete(bindingKey);
    } catch (_) {
      return jsonResponse({ ok: false, error: 'binding_clear_failed', message: '设备绑定清除失败，请再试一次。' }, { status: 500 });
    }
    queueAudit(context, 'device_binding_admin_clear', {
      username,
      previousDeviceId: existing && existing.deviceId ? existing.deviceId : '',
      previousDeviceShortId: existing && existing.shortDeviceId ? existing.shortDeviceId : '',
      previousLabel: existing && existing.label ? existing.label : ''
    }, session);
    return jsonResponse({ ok: true, username, action: 'clear', binding: null, message: '绑定已清除，旧设备下次校验会被退出。' });
  }

  const deviceId = normalizeDeviceId(body.deviceId);
  if (!deviceId) {
    return jsonResponse({ ok: false, error: 'invalid_device_id', message: '请先选择或填写有效设备 ID。' }, { status: 400 });
  }

  const nowIso = new Date().toISOString();
  const deviceLabel = truncate(String(body.deviceLabel || body.label || '').trim(), 120);
  const browser = truncate(String(body.browser || '').trim(), 60);
  const os = truncate(String(body.os || '').trim(), 60);
  const platform = truncate(String(body.platform || '').trim(), 80);
  const deviceClass = truncate(String(body.deviceClass || '').trim(), 32);
  const isIpad = Boolean(body.isIpad) || inferManualBindingIsIpad({ deviceLabel, browser, os, platform, deviceClass, note: body.note });
  const bodyIp = normalizeIpAddress(body.lastIp || body.firstIp || '');
  const bodyIpSource = truncate(String(body.lastIpSource || body.firstIpSource || '').trim(), 40);
  const bodyIpVerified = Boolean(body.lastIpVerified || body.firstIpVerified || bodyIpSource === 'cf-connecting-ip' || bodyIpSource === 'true-client-ip');
  if (policy.requireIpad && !isIpad) {
    return jsonResponse({ ok: false, error: 'ipad_required', message: 'qi 只能绑定 iPad 设备，请从 iPad 记录里选。' }, { status: 409 });
  }
  const sameDevice = Boolean(existing && existing.deviceId && existing.deviceId === deviceId);
  const keepCurrentSession = Boolean(sameDevice && existing && existing.sessionNonce);

  const nextBinding = {
    username,
    policyType: policy.type,
    deviceId,
    label: deviceLabel || (existing && existing.label ? existing.label : ''),
    browser: browser || (existing && existing.deviceId === deviceId ? existing.browser : ''),
    os: os || (existing && existing.deviceId === deviceId ? existing.os : ''),
    platform: platform || (existing && existing.deviceId === deviceId ? existing.platform : ''),
    deviceClass: deviceClass || (existing && existing.deviceId === deviceId ? existing.deviceClass : ''),
    isIpad,
    boundAt: nowIso,
    createdAt: existing && existing.createdAt ? existing.createdAt : nowIso,
    lastSeenAt: existing && existing.deviceId === deviceId && existing.lastSeenAt ? existing.lastSeenAt : nowIso,
    lastVerifiedAt: existing && existing.deviceId === deviceId && existing.lastVerifiedAt ? existing.lastVerifiedAt : nowIso,
    firstIp: existing && existing.deviceId === deviceId ? existing.firstIp : (bodyIp || truncate(String(existing && existing.firstIp || ''), 80)),
    firstIpSource: existing && existing.deviceId === deviceId ? existing.firstIpSource : (bodyIpSource || truncate(String(existing && existing.firstIpSource || ''), 40)),
    firstIpVerified: existing && existing.deviceId === deviceId ? existing.firstIpVerified : bodyIpVerified,
    lastIp: existing && existing.deviceId === deviceId ? existing.lastIp : (bodyIp || truncate(String(existing && existing.lastIp || ''), 80)),
    lastIpSource: existing && existing.deviceId === deviceId ? existing.lastIpSource : (bodyIpSource || truncate(String(existing && existing.lastIpSource || ''), 40)),
    lastIpVerified: existing && existing.deviceId === deviceId ? existing.lastIpVerified : bodyIpVerified,
    firstBrowserSessionId: existing && existing.deviceId === deviceId ? existing.firstBrowserSessionId : truncate(String(body.browserSessionId || existing && existing.firstBrowserSessionId || ''), 120),
    lastBrowserSessionId: truncate(String(body.browserSessionId || existing && existing.lastBrowserSessionId || ''), 120),
    sessionNonce: keepCurrentSession ? existing.sessionNonce : randomBase64Url(12),
    lastUserAgent: existing && existing.deviceId === deviceId ? existing.lastUserAgent : truncate(String(body.userAgent || existing && existing.lastUserAgent || ''), 240),
    mismatchCount: existing && existing.deviceId === deviceId ? Number(existing.mismatchCount || 0) : 0,
    lastMismatchAt: existing && existing.deviceId === deviceId ? existing.lastMismatchAt : '',
    lastMismatchIp: existing && existing.deviceId === deviceId ? existing.lastMismatchIp : '',
    lastMismatchIpSource: existing && existing.deviceId === deviceId ? existing.lastMismatchIpSource : '',
    lastMismatchIpVerified: existing && existing.deviceId === deviceId ? existing.lastMismatchIpVerified : false,
    lastMismatchDeviceId: existing && existing.deviceId === deviceId ? existing.lastMismatchDeviceId : '',
    lastMismatchLabel: existing && existing.deviceId === deviceId ? existing.lastMismatchLabel : '',
    lastMismatchBrowserSessionId: existing && existing.deviceId === deviceId ? existing.lastMismatchBrowserSessionId : '',
    lastSource: 'admin_manual_bind',
    updatedAt: nowIso,
    updatedBy: session && session.username ? session.username : 'teacher',
    note: truncate(String(body.note || (policy.requireIpad ? 'teacher manual bind qi ipad' : 'teacher manual single-device bind')).trim(), 160)
  };

  const wrote = await writeDeviceBinding(env, username, nextBinding);
  if (!wrote) {
    return jsonResponse({ ok: false, error: 'binding_write_failed', message: '设备绑定写入失败，请再试一次。' }, { status: 500 });
  }

  queueAudit(context, 'device_binding_admin_update', {
    username,
    policyType: policy.type,
    boundDeviceId: nextBinding.deviceId,
    boundDeviceShortId: shortDeviceId(nextBinding.deviceId),
    boundLabel: nextBinding.label,
    previousDeviceId: existing && existing.deviceId ? existing.deviceId : '',
    previousDeviceShortId: existing && existing.shortDeviceId ? existing.shortDeviceId : '',
    previousLabel: existing && existing.label ? existing.label : '',
    isIpad: nextBinding.isIpad,
    note: nextBinding.note
  }, session);

  return jsonResponse({
    ok: true,
    username,
    action: 'bind',
    binding: normalizeStoredDeviceBinding(nextBinding),
    message: keepCurrentSession ? '绑定备注已更新；当前绑定设备保持有效。' : '绑定已更新；需要重新校验的旧会话会在下一次校验时退出。'
  });
}

async function protect(context, session) {
  const { request } = context;
  const url = new URL(request.url);
  const preAuthCanonicalPath = (request.method === 'GET' || request.method === 'HEAD')
    ? canonicalRedirectPath(url.pathname)
    : null;
  if ((request.method === 'GET' || request.method === 'HEAD') && wantsHtml(request) && url.searchParams.has('edge_refresh') && url.searchParams.get('edge_refresh') !== EDGE_HOME_VERSION) {
    const freshUrl = new URL(request.url);
    if (preAuthCanonicalPath) freshUrl.pathname = preAuthCanonicalPath;
    if (freshUrl.searchParams.has('edge_refresh') && freshUrl.searchParams.get('edge_refresh') !== EDGE_HOME_VERSION) {
      freshUrl.searchParams.set('edge_refresh', EDGE_HOME_VERSION);
    }
    return redirectResponse(`${freshUrl.pathname}${freshUrl.search}${freshUrl.hash}`);
  }
  const target = safeNext(url.pathname === '/' ? DEFAULT_ENTRY : `${url.pathname}${url.search}`);

  if (!session) {
    queueAudit(context, 'blocked_request', { target });
    if (isProtectedDataJsonPath(url.pathname)) {
      return jsonResponse({ ok: false, error: 'authentication_required' }, { status: 401 });
    }
    if (wantsHtml(request)) {
      return fastLoginPageResponse(target);
    }
    return jsonResponse({ ok: false, error: 'authentication_required' }, { status: 401 });
  }

  const devicePolicy = await enforceSessionDevicePolicy(context, session, 'protected_request');
  if (!devicePolicy.ok) {
    if (wantsHtml(request)) {
      return loginPageResponse(target, devicePolicy.message, {
        status: 409,
        headers: { 'Set-Cookie': clearSessionHeader() }
      });
    }
    return jsonResponse({ ok: false, error: devicePolicy.error, message: devicePolicy.message }, {
      status: 409,
      headers: { 'Set-Cookie': clearSessionHeader() }
    });
  }

  const hasSiteAccess = await userHasSiteAccess(session, context.env);
  if (!hasSiteAccess) {
    queueAudit(context, 'locked_request', { target }, session);
    if (isProtectedDataJsonPath(url.pathname)) {
      return jsonResponse({ ok: false, error: 'payment_required', message: '账号未开通，请联系网站所有人购买。' }, { status: 402 });
    }
    if (wantsHtml(request)) {
      return htmlResponse(renderLocked(session, context.env), {
        status: 402,
        headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=300', 'Vary': 'Cookie' }
      });
    }
    return jsonResponse({ ok: false, error: 'payment_required', message: '账号未开通，请联系网站所有人购买。' }, { status: 402 });
  }

  if ((request.method === 'GET' || request.method === 'HEAD') && isProtectedSourceDownload(url.pathname)) {
    queueAudit(context, 'source_download_allowed', protectedSourceAuditData(request, url, target), session);
  }

  if ((request.method === 'GET' || request.method === 'HEAD') && wantsHtml(request) && isTeacherHtmlRoute(url.pathname) && !isAdmin(session, context.env)) {
    queueAudit(context, 'teacher_html_denied', { target }, session);
    if (request.method === 'HEAD') {
      return htmlResponse('', {
        status: 403,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0', 'Vary': 'Cookie' }
      });
    }
    return htmlResponse(renderTeacherRequired(session), {
      status: 403,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Vary': 'Cookie',
        'X-Fluid-Auth-Result': 'teacher-required'
      }
    });
  }

  if ((request.method === 'GET' || request.method === 'HEAD') && wantsHtml(request) && isEntryPath(url.pathname) && url.searchParams.get('full') !== '1') {
    queueAudit(context, 'edge_fast_home_entry', { target }, session);
    if (request.method === 'HEAD') {
      return htmlResponse('', {
        headers: {
          'Cache-Control': 'private, max-age=120, stale-while-revalidate=300',
          'Vary': 'Cookie'
        }
      });
    }
    return fastHomeResponse(session, context.env);
  }

  if (isEntryPath(url.pathname) && url.searchParams.get('full') !== '1') {
    queueAudit(context, 'edge_fast_home', { target }, session);
    return redirectResponse(fullEntryTarget(url));
  }

  if (url.searchParams.get('lite') === '1' && url.searchParams.get('full') !== '1') {
    queueAudit(context, 'edge_fast_home_lite', { target }, session);
    if (request.method === 'HEAD') {
      return htmlResponse('', {
        headers: {
          'Cache-Control': 'private, max-age=120, stale-while-revalidate=300',
          'Vary': 'Cookie'
        }
      });
    }
    if (request.method === 'GET') return fastHomeResponse(session, context.env);
  }

  if (url.pathname === '/_edge-monitor.js') {
    return new Response(monitorScript(), {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'private, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }

  if (url.pathname === '/api/ai') return handleAiProxy(context, session);
  if (url.pathname === '/api/track') return handleTrack(context, session);
  if (url.pathname === '/api/progress') return handleLearningProgress(context, session);
  if (url.pathname === '/api/stats') return handleLearningStats(context, session);
  if (url.pathname === '/api/admin/events') return handleEvents(context, session);
  if (url.pathname === '/api/admin/student-access') return handleStudentAccess(context, session);
  if (url.pathname === '/api/admin/device-bindings') return handleAdminDeviceBindings(context, session);
  if (url.pathname === '/api/admin/private-videos' || url.pathname.startsWith('/api/admin/private-videos/')) {
    return handleAdminPrivateVideos(context, session);
  }
  if (url.pathname === '/_edge-admin') {
    if (!isAdmin(session, context.env)) {
      queueAudit(context, 'admin_denied', { target }, session);
      return htmlResponse(renderLogin(DEFAULT_ENTRY, '当前账号没有教师监控权限。'), { status: 403 });
    }
    return htmlResponse(renderAdmin());
  }
  if (url.pathname === '/_edge-server-health') {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return jsonResponse({ ok: false, error: 'method_not_allowed' }, {
        status: 405,
        headers: { Allow: 'GET, HEAD' }
      });
    }
    return jsonResponse(buildServerHealthSnapshot(context.env, session));
  }
  if (url.pathname === '/_edge-health') {
    const serverHealth = buildServerHealthSnapshot(context.env, session);
    return jsonResponse({
      ok: true,
      protected: true,
      user: session.username,
      time: new Date().toISOString(),
      edgeHomeVersion: EDGE_HOME_VERSION,
      serverHealth: serverHealth
    });
  }

  if (shouldAuditResource(url.pathname) && request.method === 'GET') {
    queueAudit(context, 'resource_request', { target }, session);
  }

  if (wantsHtml(request) && request.method === 'GET') {
    queueAudit(context, 'edge_page_request', { target }, session);
  }

  const aliasPath = request.method === 'GET' || request.method === 'HEAD'
    ? routeAliasPath(url.pathname)
    : null;
  let response;
  if ((request.method === 'GET' || request.method === 'HEAD') && wantsHtml(request)) {
    const canonicalPath = canonicalRedirectPath(url.pathname);
	    if (canonicalPath) {
	      const canonicalUrl = new URL(request.url);
	      const originalPath = normalizePathname(url.pathname).toLowerCase().replace(/\/+$/, '') || '/';
	      canonicalUrl.pathname = canonicalPath;
	      if (canonicalPath === '/teacher-panel' && /^\/modules\/teacher-panel(?:\.html)?$/.test(originalPath)) {
	        if (!canonicalUrl.searchParams.has('view')) canonicalUrl.searchParams.set('view', 'resources');
	        if (!canonicalUrl.hash) canonicalUrl.hash = '#private-videos';
	      }
	      if (canonicalUrl.searchParams.has('edge_refresh') && canonicalUrl.searchParams.get('edge_refresh') !== EDGE_HOME_VERSION) {
	        canonicalUrl.searchParams.set('edge_refresh', EDGE_HOME_VERSION);
	      }
      const canonicalTarget = `${canonicalUrl.pathname}${canonicalUrl.search}${canonicalUrl.hash}`;
      const currentTarget = `${url.pathname}${url.search}${url.hash}`;
      if (canonicalTarget !== currentTarget) {
        return redirectResponse(canonicalTarget);
      }
    }
  }
  if (aliasPath && context.env.ASSETS && typeof context.env.ASSETS.fetch === 'function') {
    response = await fetchAssetResponse(context.env, request, aliasPath);
    if (!response) {
      const aliasUrl = new URL(request.url);
      aliasUrl.pathname = aliasPath;
      aliasUrl.search = '';
      response = await context.env.ASSETS.fetch(new Request(aliasUrl.toString(), request));
    }
  } else {
    response = await gzipStaticAssetResponse(context.env, request, url.pathname) || await context.next();
  }
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('Permissions-Policy', 'accelerometer=(), camera=(), display-capture=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), serial=(), usb=(), xr-spatial-tracking=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Origin-Agent-Cluster', '?1');

  const contentType = headers.get('Content-Type') || '';
  const normalizedAssetPath = normalizePathname(url.pathname).toLowerCase();
  if (contentType.includes('text/html') && isStrictStaticAssetPath(normalizedAssetPath)) {
    return staticAssetNotFoundResponse(normalizedAssetPath);
  }
  const extensionlessHtmlRoute = wantsHtml(request) &&
    /^(?:\/modules\/|\/resources(?:\/|$))/.test(normalizedAssetPath) &&
    !/\/[^/]+\.[^/]+$/.test(normalizedAssetPath);
  const htmlLikeResponse = contentType.includes('text/html') ||
    extensionlessHtmlRoute ||
    (wantsHtml(request) && String(aliasPath || url.pathname).toLowerCase().endsWith('.html'));
  if (htmlLikeResponse && !contentType) {
    headers.set('Content-Type', 'text/html; charset=utf-8');
  }
  if (htmlLikeResponse && normalizedAssetPath.startsWith('/resources/fluid-textbooks/authored/')) {
    headers.set('X-Frame-Options', 'SAMEORIGIN');
  }
  const cacheControl = htmlLikeResponse
    ? 'no-store, no-cache, must-revalidate, max-age=0'
    : cacheControlForAsset(url.pathname, contentType);
  headers.set('Cache-Control', cacheControl);
  if (htmlLikeResponse) {
    headers.set('Vary', 'Cookie');
  }
  if (cacheControl.includes('no-store')) {
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('Vary', 'Cookie');
  } else {
    headers.delete('Pragma');
    headers.delete('Expires');
  }
  if (htmlLikeResponse) {
    const html = await response.text();
    const identity = edgeIdentityScript(session, context.env);
    const experience = edgeExperienceAssets();
    const withIdentity = html.includes('<head>')
      ? html.replace('<head>', `<head>${identity}${experience}`)
      : `${identity}${experience}${html}`;
    const injected = withIdentity.includes('</head>')
      ? withIdentity.replace('</head>', '<script defer src="/_edge-monitor.js"></script></head>')
      : `${withIdentity}<script defer src="/_edge-monitor.js"></script>`;
    headers.delete('Content-Length');
    return new Response(injected, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const session = await readSession(request, context.env);

  if (isSensitiveLegacyPath(url.pathname)) {
    queueAudit(context, 'sensitive_path_blocked', {
      target: `${url.pathname}${url.search}`
    }, session);
    return notFoundResponse(request);
  }

  if (isBlocked181103RawBinaryPath(url.pathname)) {
    queueAudit(context, 'round371_181103_raw_binary_blocked', {
      target: `${url.pathname}${url.search}`
    }, session);
    return notFoundResponse(request);
  }

  if (url.pathname === '/_edge-status') {
    return jsonResponse({
      ok: true,
      protected: true,
      entrance: DEFAULT_ENTRY,
      edgeHomeVersion: EDGE_HOME_VERSION,
      serverHealthEndpoint: '/_edge-server-health',
      cumulativeProgressTruth: 'protected GET /api/stats noMutationRead=true server-progress-snapshot',
      publicEntryHealth: publicEntryHealthSnapshot(),
      time: new Date().toISOString()
    });
  }

  if ((request.method === 'GET' || request.method === 'HEAD') && url.pathname === '/favicon.ico') {
    return faviconResponse(request);
  }
  if ((request.method === 'GET' || request.method === 'HEAD') && (url.pathname === '/sw.js' || url.pathname === '/sw-simple.js')) {
    return serviceWorkerKillSwitchResponse(request);
  }
  if (request.method === 'GET' || request.method === 'HEAD') {
    const runtimeAssetAlias = publicRuntimeAssetAliasPath(url.pathname);
    if (runtimeAssetAlias) return publicRuntimeAssetResponse(context, runtimeAssetAlias);
    if (isPublicRuntimeAssetPath(url.pathname)) return publicRuntimeAssetResponse(context);
    if (isPublic181103ViewAssetPath(url.pathname)) {
      return publicRuntimeAssetResponse(context, public181103AssetPathOverride(url.pathname));
    }
  }

  if (url.pathname === '/_edge-reset') {
    if (request.method === 'HEAD') {
      return htmlResponse('', {
        headers: {
          'Set-Cookie': clearSessionHeader(),
          'Clear-Site-Data': '"cache", "storage"'
        }
      });
    }
    if (request.method !== 'GET') {
      return new Response('Method not allowed', {
        status: 405,
        headers: {
          Allow: 'GET, HEAD',
          'Cache-Control': 'no-store',
          'Clear-Site-Data': '"cache", "storage"'
        }
      });
    }
    const next = safeNext(url.searchParams.get('next') || DEFAULT_ENTRY);
    queueAudit(context, 'edge_reset', { next }, session);
    return htmlResponse(renderReset(next), {
      headers: {
        'Set-Cookie': clearSessionHeader(),
        'Clear-Site-Data': '"cache", "storage"'
      }
    });
  }

  if (url.pathname === '/_edge-fast-login') return handleFastLogin(context, session);
  if (url.pathname === '/_edge-login') return handleLogin(context, session);
  if (url.pathname === '/_edge-register') return handleRegisterPage(context, session);
  if (url.pathname === '/_edge-forgot-password') return handleForgotPasswordPage(context, session);
  if (url.pathname === '/_edge-locked') return handleLockedPage(context, session);
  if (url.pathname === '/api/auth/send-code') return handleSendRegisterCode(context);
  if (url.pathname === '/api/auth/password-reset/send-code') return handleSendPasswordResetCode(context);
  if (url.pathname === '/api/auth/password-reset/confirm') return handleConfirmPasswordReset(context);
  if (url.pathname === '/api/auth/register') return handleRegisterAccount(context);
  if (url.pathname === '/api/auth/me') return handleAuthMe(context, session);
  if (url.pathname === '/api/auth/change-password') return handleChangePassword(context, session);
  if (url.pathname === '/api/auth/revoke-sessions') return handleRevokeSessions(context, session);
  if (url.pathname === '/api/private-videos' || url.pathname.startsWith('/api/private-videos/')) {
    return handlePrivateVideos(context, session);
  }

  if (url.pathname === '/_edge-logout') {
    queueAudit(context, 'logout', {}, session);
    return redirectResponse(new URL('/_edge-login', request.url).toString(), {
      'Set-Cookie': clearSessionHeader(),
      'Clear-Site-Data': '"cache", "storage"'
    });
  }

  return protect(context, session);
}
