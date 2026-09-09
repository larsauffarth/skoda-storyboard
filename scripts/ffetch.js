/*
 * ffetch — lazy, streaming fetch for AEM query-index (and other sheet) JSON.
 * Vendored from the AEM Edge Delivery reference implementation
 * (https://github.com/adobe/helix-website/blob/main/scripts/ffetch.js).
 *
 * Fetches an index in chunks and yields entries lazily so callers can `for await`
 * or collect via `.all()` / `.slice()` without loading the whole sheet eagerly.
 */

/* eslint-disable */
async function* request(url, context) {
  const { chunkSize, sheet } = context;
  for (let offset = 0, total = Infinity; offset < total; offset += chunkSize) {
    const params = new URLSearchParams(`offset=${offset}&limit=${chunkSize}`);
    if (sheet) params.append('sheet', sheet);
    const resp = await fetch(`${url}?${params.toString()}`);
    if (resp.ok) {
      const json = await resp.json();
      total = json.total;
      context.total = total;
      for (const entry of json.data) yield entry;
    } else {
      return;
    }
  }
}

// Helper: turn a generator into an async iterable with chainable operators.
function ffetch(url) {
  let chunkSize = 255;
  const context = { chunkSize };
  let generator = request(url, context);

  const withOperation = (fn) => {
    const inner = generator;
    async function* newGen() {
      for await (const entry of inner) {
        const value = fn(entry);
        if (value !== undefined) yield value;
      }
    }
    generator = newGen();
    return chainable;
  };

  const chainable = {
    sheet(name) { context.sheet = name; generator = request(url, context); return chainable; },
    chunks(n) { context.chunkSize = n; chunkSize = n; generator = request(url, context); return chainable; },
    map(fn) { return withOperation((e) => fn(e)); },
    filter(fn) { return withOperation((e) => (fn(e) ? e : undefined)); },
    async all() {
      const result = [];
      for await (const entry of generator) result.push(entry);
      return result;
    },
    async slice(from, to) {
      const result = [];
      let i = 0;
      for await (const entry of generator) {
        if (i >= to) break;
        if (i >= from) result.push(entry);
        i += 1;
      }
      return result;
    },
    [Symbol.asyncIterator]() { return generator; },
  };

  return chainable;
}

export default ffetch;
