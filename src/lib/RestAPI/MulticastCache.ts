import RestAPI from '@/lib/RestAPI/RestAPI';

const inflight = new Map();
const keyCache = new WeakMap();

const requestToKey = (req: RestAPI) => {
  let key = keyCache.get(req);
  if (!key) {
    const { method, body } = req.opts;
    const parts: (typeof body)[] = [method, req.resourceUrl];
    if (body) {
      parts.push(body);
    }
    key = parts.join('|||');
    keyCache.set(req, key);
  }
  return key;
};

/**
 * Returns any inflight request with the same key as the supplied request.
 * May be the same request itself!
 * @param {Request} req The request to match.
 * @return {Request} A request with the same method, body, and resourceUrl.
 */
export function match(req: RestAPI) {
  return inflight.get(requestToKey(req));
}

/**
 * Store a request for potential future multicast.
 * Adds a callback to delete the request when it has settled.
 * @param {Request} req The request to store.
 */
export function store(req: RestAPI) {
  inflight.set(requestToKey(req), req);
}

/**
 * Remove a request from cache if it exists there.
 * @param {Request} req
 */
export function remove(req: RestAPI) {
  if (match(req) === req) {
    inflight.delete(requestToKey(req));
  }
}
