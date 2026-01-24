// Small, dependency-free JWT helpers (base64url-safe)

const base64UrlToBase64 = (value) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddingNeeded = base64.length % 4;
  if (!paddingNeeded) return base64;
  return base64 + '='.repeat(4 - paddingNeeded);
};

export const decodeJwtPayload = (jwtToken) => {
  if (!jwtToken) return null;
  const parts = jwtToken.split('.');
  if (parts.length !== 3) return null;
  try {
    const json = atob(base64UrlToBase64(parts[1]));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const isJwtExpired = (jwtToken) => {
  const payload = decodeJwtPayload(jwtToken);
  if (!payload || typeof payload.exp !== 'number') return true;
  return Date.now() >= payload.exp * 1000;
};
