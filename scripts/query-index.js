import ffetch from './ffetch.js';

/*
 * query-index — shared, memoized loader for a published query-index.
 *
 * The homepage renders several index-driven blocks (Latest Stories + four
 * category rails). Without sharing, each block calls `ffetch(index).all()`
 * independently → N identical network fetches of the same JSON, each parsed on
 * the main thread. This module fetches (and fully materializes) each index URL
 * at most once and hands every caller the SAME promise, collapsing N fetches to 1.
 *
 * Returned rows are a shared, read-only array — callers filter/sort/slice into
 * their own arrays and must not mutate the entries in place.
 */

const cache = new Map();

/**
 * Load a query-index once and reuse it for all callers.
 * @param {string} url index URL (e.g. '/en/query-index.json')
 * @returns {Promise<object[]>} the index rows
 */
export default function loadQueryIndex(url) {
  if (!cache.has(url)) {
    cache.set(url, ffetch(url).all().catch((e) => {
      // On failure, drop the cache entry so a later attempt can retry.
      cache.delete(url);
      throw e;
    }));
  }
  return cache.get(url);
}
