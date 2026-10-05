import NodeCache from "node-cache";

const defaultTtl = Number(process.env.CACHE_TTL_SECONDS) || 600;
const store = new NodeCache({ stdTTL: defaultTtl, checkperiod: 60 });

export function getCache(cachKey) {
  const hit = store.get(cachKey);
  return hit;
}

export function setCache(cachKey, value, ttl) {
  const life = ttl || defaultTtl;
  store.set(cachKey, value, life);
  return value;
}

export function makeKey(base, params) {
  const keys = Object.keys(params || {}).sort();
  let out = base + "|";
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const v = params[k];
    if (v === undefined || v === null || v === "") {
      continue;
    }
    out += k + "=" + encodeURIComponent(String(v)) + "&";
  }
  const finalKey = out;
  return finalKey;
}

export function clearAll() {
  store.flushAll();
}
