// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = import.meta.require;

// node_modules/flexsearch/dist/flexsearch.bundle.module.min.mjs
function H(a, c, b) {
  const e = typeof b, d = typeof a;
  if (e !== "undefined") {
    if (d !== "undefined") {
      if (b) {
        if (d === "function" && e === d)
          return function(k) {
            return a(b(k));
          };
        c = a.constructor;
        if (c === b.constructor) {
          if (c === Array)
            return b.concat(a);
          if (c === Map) {
            var f = new Map(b);
            for (var g of a)
              f.set(g[0], g[1]);
            return f;
          }
          if (c === Set) {
            g = new Set(b);
            for (f of a.values())
              g.add(f);
            return g;
          }
        }
      }
      return a;
    }
    return b;
  }
  return d === "undefined" ? c : a;
}
function aa(a, c) {
  return typeof a === "undefined" ? c : a;
}
function I() {
  return Object.create(null);
}
function M(a) {
  return typeof a === "string";
}
function ba(a) {
  return typeof a === "object";
}
function ca(a, c) {
  if (M(c))
    a = a[c];
  else
    for (let b = 0;a && b < c.length; b++)
      a = a[c[b]];
  return a;
}
function ka(a = {}) {
  if (!this || this.constructor !== ka)
    return new ka(...arguments);
  if (arguments.length)
    for (a = 0;a < arguments.length; a++)
      this.assign(arguments[a]);
  else
    this.assign(a);
}
function Q(a) {
  a.F = null;
  a.B.clear();
  a.D.clear();
}
function la(a, c, b) {
  b || (c || typeof a !== "object" ? typeof c === "object" && (b = c, c = 0) : b = a);
  b && (a = b.query || a, c = b.limit || c);
  let e = "" + (c || 0);
  b && (e += (b.offset || 0) + !!b.context + !!b.suggest + (b.resolve !== false) + (b.resolution || this.resolution) + (b.boost || 0));
  a = ("" + a).toLowerCase();
  this.cache || (this.cache = new ma);
  let d = this.cache.get(a + e);
  if (!d) {
    const f = b && b.cache;
    f && (b.cache = false);
    d = this.search(a, c, b);
    f && (b.cache = f);
    this.cache.set(a + e, d);
  }
  return d;
}
function ma(a) {
  this.limit = a && a !== true ? a : 1000;
  this.cache = new Map;
  this.h = "";
}
function wa(a, c, b, e) {
  let d = [];
  for (let f = 0, g;f < a.index.length; f++)
    if (g = a.index[f], c >= g.length)
      c -= g.length;
    else {
      c = g[e ? "splice" : "slice"](c, b);
      const k = c.length;
      if (k && (d = d.length ? d.concat(c) : c, b -= k, e && (a.length -= k), !b))
        break;
      c = 0;
    }
  return d;
}
function xa(a) {
  if (!this || this.constructor !== xa)
    return new xa(a);
  this.index = a ? [a] : [];
  this.length = a ? a.length : 0;
  const c = this;
  return new Proxy([], { get(b, e) {
    if (e === "length")
      return c.length;
    if (e === "push")
      return function(d) {
        c.index[c.index.length - 1].push(d);
        c.length++;
      };
    if (e === "pop")
      return function() {
        if (c.length)
          return c.length--, c.index[c.index.length - 1].pop();
      };
    if (e === "indexOf")
      return function(d) {
        let f = 0;
        for (let g = 0, k, h;g < c.index.length; g++) {
          k = c.index[g];
          h = k.indexOf(d);
          if (h >= 0)
            return f + h;
          f += k.length;
        }
        return -1;
      };
    if (e === "includes")
      return function(d) {
        for (let f = 0;f < c.index.length; f++)
          if (c.index[f].includes(d))
            return true;
        return false;
      };
    if (e === "slice")
      return function(d, f) {
        return wa(c, d || 0, f || c.length, false);
      };
    if (e === "splice")
      return function(d, f) {
        return wa(c, d || 0, f || c.length, true);
      };
    if (e === "constructor")
      return Array;
    if (typeof e !== "symbol")
      return (b = c.index[e / 2 ** 31 | 0]) && b[e];
  }, set(b, e, d) {
    b = e / 2 ** 31 | 0;
    (c.index[b] || (c.index[b] = []))[e] = d;
    c.length++;
    return true;
  } });
}
function R(a = 8) {
  if (!this || this.constructor !== R)
    return new R(a);
  this.index = I();
  this.h = [];
  this.size = 0;
  a > 32 ? (this.B = Aa, this.A = BigInt(a)) : (this.B = Ba, this.A = a);
}
function S(a = 8) {
  if (!this || this.constructor !== S)
    return new S(a);
  this.index = I();
  this.h = [];
  this.size = 0;
  a > 32 ? (this.B = Aa, this.A = BigInt(a)) : (this.B = Ba, this.A = a);
}
function Ba(a) {
  let c = 2 ** this.A - 1;
  if (typeof a == "number")
    return a & c;
  let b = 0, e = this.A + 1;
  for (let d = 0;d < a.length; d++)
    b = (b * e ^ a.charCodeAt(d)) & c;
  return this.A === 32 ? b + 2 ** 31 : b;
}
function Aa(a) {
  let c = BigInt(2) ** this.A - BigInt(1);
  var b = typeof a;
  if (b === "bigint")
    return a & c;
  if (b === "number")
    return BigInt(a) & c;
  b = BigInt(0);
  let e = this.A + BigInt(1);
  for (let d = 0;d < a.length; d++)
    b = (b * e ^ BigInt(a.charCodeAt(d))) & c;
  return b;
}
async function Ea(a) {
  a = a.data;
  var c = a.task;
  const b = a.id;
  let e = a.args;
  switch (c) {
    case "init":
      Da = a.options || {};
      (c = a.factory) ? (Function("return " + c)()(self), Ca = new self.FlexSearch.Index(Da), delete self.FlexSearch) : Ca = new T(Da);
      postMessage({ id: b });
      break;
    default:
      let d;
      c === "export" && (e[1] ? (e[0] = Da.export, e[2] = 0, e[3] = 1) : e = null);
      c === "import" ? e[0] && (a = await Da.import.call(Ca, e[0]), Ca.import(e[0], a)) : ((d = e && Ca[c].apply(Ca, e)) && d.then && (d = await d), d && d.await && (d = await d.await), c === "search" && d.result && (d = d.result));
      postMessage(c === "search" ? { id: b, msg: d } : { id: b });
  }
}
function Fa(a) {
  Ga.call(a, "add");
  Ga.call(a, "append");
  Ga.call(a, "search");
  Ga.call(a, "update");
  Ga.call(a, "remove");
  Ga.call(a, "searchCache");
}
function Ka() {
  Ha = Ja = 0;
}
function Ga(a) {
  this[a + "Async"] = function() {
    const c = arguments;
    var b = c[c.length - 1];
    let e;
    typeof b === "function" && (e = b, delete c[c.length - 1]);
    Ha ? Ja || (Ja = Date.now() - Ia >= this.priority * this.priority * 3) : (Ha = setTimeout(Ka, 0), Ia = Date.now());
    if (Ja) {
      const f = this;
      return new Promise((g) => {
        setTimeout(function() {
          g(f[a + "Async"].apply(f, c));
        }, 0);
      });
    }
    const d = this[a].apply(this, c);
    b = d.then ? d : new Promise((f) => f(d));
    e && b.then(e);
    return b;
  };
}
function La(a = {}, c) {
  function b(k) {
    function h(l) {
      l = l.data || l;
      const m = l.id, p = m && f.h[m];
      p && (p(l.msg), delete f.h[m]);
    }
    this.worker = k;
    this.h = I();
    if (this.worker) {
      d ? this.worker.on("message", h) : this.worker.onmessage = h;
      if (a.config)
        return new Promise(function(l) {
          V > 1e9 && (V = 0);
          f.h[++V] = function() {
            l(f);
          };
          f.worker.postMessage({ id: V, task: "init", factory: e, options: a });
        });
      this.priority = a.priority || 4;
      this.encoder = c || null;
      this.worker.postMessage({ task: "init", factory: e, options: a });
      return this;
    }
  }
  if (!this || this.constructor !== La)
    return new La(a);
  let e = typeof self !== "undefined" ? self._factory : typeof window !== "undefined" ? window._factory : null;
  e && (e = e.toString());
  const d = typeof window === "undefined", f = this, g = Ma(e, d, a.worker);
  return g.then ? g.then(function(k) {
    return b.call(f, k);
  }) : b.call(this, g);
}
function W(a) {
  La.prototype[a] = function() {
    const c = this, b = [].slice.call(arguments);
    var e = b[b.length - 1];
    let d;
    typeof e === "function" && (d = e, b.pop());
    e = new Promise(function(f) {
      a === "export" && typeof b[0] === "function" && (b[0] = null);
      V > 1e9 && (V = 0);
      c.h[++V] = f;
      c.worker.postMessage({ task: a, id: V, args: b });
    });
    return d ? (e.then(d), this) : e;
  };
}
function Ma(a, c, b) {
  return c ? typeof module_flexsearch_bundle_module_min !== "undefined" ? new (__require("worker_threads"))["Worker"](__dirname + "/worker/node.js") : import("worker_threads").then(function(worker) {
    return new worker["Worker"](import.meta.dirname + "/node/node.mjs");
  }) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + Ea.toString()], { type: "text/javascript" }))) : new window.Worker(typeof b === "string" ? b : import.meta.url.replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", "module/worker/worker.js").replace("flexsearch.bundle.module.min.mjs", "module/worker/worker.js"), { type: "module" });
}
function Ra(a, c, b, e, d, f) {
  a = a[d];
  if (e === b.length - 1)
    c[d] = f || a;
  else if (a)
    if (a.constructor === Array)
      for (c = c[d] = Array(a.length), d = 0;d < a.length; d++)
        Ra(a, c, b, e, d);
    else
      c = c[d] || (c[d] = I()), d = b[++e], Ra(a, c, b, e, d);
}
function Qa(a, c, b, e, d, f, g, k) {
  if (a = a[g])
    if (e === c.length - 1) {
      if (a.constructor === Array) {
        if (b[e]) {
          for (c = 0;c < a.length; c++)
            d.add(f, a[c], true, true);
          return;
        }
        a = a.join(" ");
      }
      d.add(f, a, k, true);
    } else if (a.constructor === Array)
      for (g = 0;g < a.length; g++)
        Qa(a, c, b, e, d, f, g, k);
    else
      g = c[++e], Qa(a, c, b, e, d, f, g, k);
}
function Sa(a, c, b, e) {
  if (!a.length)
    return a;
  if (a.length === 1)
    return a = a[0], a = b || a.length > c ? a.slice(b, b + c) : a, e ? Ta.call(this, a) : a;
  let d = [];
  for (let f = 0, g, k;f < a.length; f++)
    if ((g = a[f]) && (k = g.length)) {
      if (b) {
        if (b >= k) {
          b -= k;
          continue;
        }
        g = g.slice(b, b + c);
        k = g.length;
        b = 0;
      }
      k > c && (g = g.slice(0, c), k = c);
      if (!d.length && k >= c)
        return e ? Ta.call(this, g) : g;
      d.push(g);
      c -= k;
      if (!c)
        break;
    }
  d = d.length > 1 ? [].concat.apply([], d) : d[0];
  return e ? Ta.call(this, d) : d;
}
function Ua(a, c, b, e) {
  var d = e[0];
  if (d[0] && d[0].query)
    return a[c].apply(a, d);
  if (!(c !== "and" && c !== "not" || a.result.length || a.await || d.suggest))
    return e.length > 1 && (d = e[e.length - 1]), (e = d.resolve) ? a.await || a.result : a;
  let f = [], g = 0, k = 0, h, l, m, p, u;
  for (c = 0;c < e.length; c++)
    if (d = e[c]) {
      var r = undefined;
      if (d.constructor === X)
        r = d.await || d.result;
      else if (d.then || d.constructor === Array)
        r = d;
      else {
        g = d.limit || 0;
        k = d.offset || 0;
        m = d.suggest;
        l = d.resolve;
        h = ((p = d.highlight || a.highlight) || d.enrich) && l;
        r = d.queue;
        let t = d.async || r, n = d.index, q = d.query;
        n ? a.index || (a.index = n) : n = a.index;
        if (q || d.tag) {
          const x = d.field || d.pluck;
          x && (!q || a.query && !p || (a.query = q, a.field = x, a.highlight = p), n = n.index.get(x));
          if (r && (u || a.await)) {
            u = 1;
            let v;
            const A = a.C.length, D = new Promise(function(F) {
              v = F;
            });
            (function(F, E) {
              D.h = function() {
                E.index = null;
                E.resolve = false;
                let B = t ? F.searchAsync(E) : F.search(E);
                if (B.then)
                  return B.then(function(z) {
                    a.C[A] = z = z.result || z;
                    v(z);
                    return z;
                  });
                B = B.result || B;
                v(B);
                return B;
              };
            })(n, Object.assign({}, d));
            a.C.push(D);
            f[c] = D;
            continue;
          } else
            d.resolve = false, d.index = null, r = t ? n.searchAsync(d) : n.search(d), d.resolve = l, d.index = n;
        } else if (d.and)
          r = Va(d, "and", n);
        else if (d.or)
          r = Va(d, "or", n);
        else if (d.not)
          r = Va(d, "not", n);
        else if (d.xor)
          r = Va(d, "xor", n);
        else
          continue;
      }
      r.await ? (u = 1, r = r.await) : r.then ? (u = 1, r = r.then(function(t) {
        return t.result || t;
      })) : r = r.result || r;
      f[c] = r;
    }
  u && !a.await && (a.await = new Promise(function(t) {
    a.return = t;
  }));
  if (u) {
    const t = Promise.all(f).then(function(n) {
      for (let q = 0;q < a.C.length; q++)
        if (a.C[q] === t) {
          a.C[q] = function() {
            return b.call(a, n, g, k, h, l, m, p);
          };
          break;
        }
      Wa(a);
    });
    a.C.push(t);
  } else if (a.await)
    a.C.push(function() {
      return b.call(a, f, g, k, h, l, m, p);
    });
  else
    return b.call(a, f, g, k, h, l, m, p);
  return l ? a.await || a.result : a;
}
function Va(a, c, b) {
  a = a[c];
  const e = a[0] || a;
  e.index || (e.index = b);
  b = new X(e);
  a.length > 1 && (b = b[c].apply(b, a.slice(1)));
  return b;
}
function Xa(a, c, b, e, d, f, g) {
  a.length && (this.result.length && a.push(this.result), a.length < 2 ? this.result = a[0] : (this.result = Ya(a, c, b, false, this.h), b = 0));
  d && (this.await = null);
  return d ? this.resolve(c, b, e, g) : this;
}
function Za(a, c, b, e, d, f, g) {
  if (!f && !this.result.length)
    return d ? this.result : this;
  let k;
  if (a.length)
    if (this.result.length && a.unshift(this.result), a.length < 2)
      this.result = a[0];
    else {
      let h = 0;
      for (let l = 0, m, p;l < a.length; l++)
        if ((m = a[l]) && (p = m.length))
          h < p && (h = p);
        else if (!f) {
          h = 0;
          break;
        }
      h ? (this.result = $a(a, h, c, b, f, this.h, d), k = true) : this.result = [];
    }
  else
    f || (this.result = a);
  d && (this.await = null);
  return d ? this.resolve(c, b, e, g, k) : this;
}
function ab(a, c, b, e, d, f, g) {
  if (a.length)
    if (this.result.length && a.unshift(this.result), a.length < 2)
      this.result = a[0];
    else {
      a: {
        f = b;
        var k = this.h;
        const h = [], l = I();
        let m = 0;
        for (let p = 0, u;p < a.length; p++)
          if (u = a[p]) {
            m < u.length && (m = u.length);
            for (let r = 0, t;r < u.length; r++)
              if (t = u[r])
                for (let n = 0, q;n < t.length; n++)
                  q = t[n], l[q] = l[q] ? 2 : 1;
          }
        for (let p = 0, u, r = 0;p < m; p++)
          for (let t = 0, n;t < a.length; t++)
            if (n = a[t]) {
              if (u = n[p]) {
                for (let q = 0, x;q < u.length; q++)
                  if (x = u[q], l[x] === 1)
                    if (f)
                      f--;
                    else if (d) {
                      if (h.push(x), h.length === c) {
                        a = h;
                        break a;
                      }
                    } else {
                      const v = p + (t ? k : 0);
                      h[v] || (h[v] = []);
                      h[v].push(x);
                      if (++r === c) {
                        a = h;
                        break a;
                      }
                    }
              }
            }
        a = h;
      }
      this.result = a;
      k = true;
    }
  else
    f || (this.result = a);
  d && (this.await = null);
  return d ? this.resolve(c, b, e, g, k) : this;
}
function bb(a, c, b, e, d, f, g) {
  if (!f && !this.result.length)
    return d ? this.result : this;
  if (a.length && this.result.length) {
    a: {
      f = b;
      var k = [];
      a = new Set(a.flat().flat());
      for (let h = 0, l, m = 0;h < this.result.length; h++)
        if (l = this.result[h]) {
          for (let p = 0, u;p < l.length; p++)
            if (u = l[p], !a.has(u)) {
              if (f)
                f--;
              else if (d) {
                if (k.push(u), k.length === c) {
                  a = k;
                  break a;
                }
              } else if (k[h] || (k[h] = []), k[h].push(u), ++m === c) {
                a = k;
                break a;
              }
            }
        }
      a = k;
    }
    this.result = a;
    k = true;
  }
  d && (this.await = null);
  return d ? this.resolve(c, b, e, g, k) : this;
}
function cb(a, c, b, e, d) {
  let f, g, k;
  typeof d === "string" ? (f = d, d = "") : f = d.template;
  g = f.indexOf("$1");
  k = f.substring(g + 2);
  g = f.substring(0, g);
  let h = d && d.boundary, l = !d || d.clip !== false, m = d && d.merge && k && g && new RegExp(k + " " + g, "g");
  d = d && d.ellipsis;
  var p = 0;
  if (typeof d === "object") {
    var u = d.template;
    p = u.length - 2;
    d = d.pattern;
  }
  typeof d !== "string" && (d = d === false ? "" : "...");
  p && (d = u.replace("$1", d));
  u = d.length - p;
  let r, t;
  typeof h === "object" && (r = h.before, r === 0 && (r = -1), t = h.after, t === 0 && (t = -1), h = h.total || 900000);
  p = new Map;
  for (let Oa = 0, da, db, pa;Oa < c.length; Oa++) {
    let qa;
    if (e)
      qa = c, pa = e;
    else {
      var n = c[Oa];
      pa = n.field;
      if (!pa)
        continue;
      qa = n.result;
    }
    db = b.get(pa);
    da = db.encoder;
    n = p.get(da);
    typeof n !== "string" && (n = da.encode(a), p.set(da, n));
    for (let ya = 0;ya < qa.length; ya++) {
      var q = qa[ya].doc;
      if (!q)
        continue;
      q = ca(q, pa);
      if (!q)
        continue;
      var x = q.trim().split(/\s+/);
      if (!x.length)
        continue;
      q = "";
      var v = [];
      let za = [];
      var A = -1, D = -1, F = 0;
      for (var E = 0;E < x.length; E++) {
        var B = x[E], z = da.encode(B);
        z = z.length > 1 ? z.join(" ") : z[0];
        let y;
        if (z && B) {
          var C = B.length, J = (da.split ? B.replace(da.split, "") : B).length - z.length, G = "", N = 0;
          for (var O = 0;O < n.length; O++) {
            var P = n[O];
            if (P) {
              var L = P.length;
              L += J < 0 ? 0 : J;
              N && L <= N || (P = z.indexOf(P), P > -1 && (G = (P ? B.substring(0, P) : "") + g + B.substring(P, P + L) + k + (P + L < C ? B.substring(P + L) : ""), N = L, y = true));
            }
          }
          G && (h && (A < 0 && (A = q.length + (q ? 1 : 0)), D = q.length + (q ? 1 : 0) + G.length, F += C, za.push(v.length), v.push({ match: G })), q += (q ? " " : "") + G);
        }
        if (!y)
          B = x[E], q += (q ? " " : "") + B, h && v.push({ text: B });
        else if (h && F >= h)
          break;
      }
      F = za.length * (f.length - 2);
      if (r || t || h && q.length - F > h)
        if (F = h + F - u * 2, E = D - A, r > 0 && (E += r), t > 0 && (E += t), E <= F)
          x = r ? A - (r > 0 ? r : 0) : A - ((F - E) / 2 | 0), v = t ? D + (t > 0 ? t : 0) : x + F, l || (x > 0 && q.charAt(x) !== " " && q.charAt(x - 1) !== " " && (x = q.indexOf(" ", x), x < 0 && (x = 0)), v < q.length && q.charAt(v - 1) !== " " && q.charAt(v) !== " " && (v = q.lastIndexOf(" ", v), v < D ? v = D : ++v)), q = (x ? d : "") + q.substring(x, v) + (v < q.length ? d : "");
        else {
          D = [];
          A = {};
          F = {};
          E = {};
          B = {};
          z = {};
          G = J = C = 0;
          for (O = N = 1;; ) {
            var U = undefined;
            for (let y = 0, K;y < za.length; y++) {
              K = za[y];
              if (G)
                if (J !== G) {
                  if (E[y + 1])
                    continue;
                  K += G;
                  if (A[K]) {
                    C -= u;
                    F[y + 1] = 1;
                    E[y + 1] = 1;
                    continue;
                  }
                  if (K >= v.length - 1) {
                    if (K >= v.length) {
                      E[y + 1] = 1;
                      K >= x.length && (F[y + 1] = 1);
                      continue;
                    }
                    C -= u;
                  }
                  q = v[K].text;
                  if (L = t && z[y])
                    if (L > 0) {
                      if (q.length > L)
                        if (E[y + 1] = 1, l)
                          q = q.substring(0, L);
                        else
                          continue;
                      (L -= q.length) || (L = -1);
                      z[y] = L;
                    } else {
                      E[y + 1] = 1;
                      continue;
                    }
                  if (C + q.length + 1 <= h)
                    q = " " + q, D[y] += q;
                  else if (l)
                    U = h - C - 1, U > 0 && (q = " " + q.substring(0, U), D[y] += q), E[y + 1] = 1;
                  else {
                    E[y + 1] = 1;
                    continue;
                  }
                } else {
                  if (E[y])
                    continue;
                  K -= J;
                  if (A[K]) {
                    C -= u;
                    E[y] = 1;
                    F[y] = 1;
                    continue;
                  }
                  if (K <= 0) {
                    if (K < 0) {
                      E[y] = 1;
                      F[y] = 1;
                      continue;
                    }
                    C -= u;
                  }
                  q = v[K].text;
                  if (L = r && B[y])
                    if (L > 0) {
                      if (q.length > L)
                        if (E[y] = 1, l)
                          q = q.substring(q.length - L);
                        else
                          continue;
                      (L -= q.length) || (L = -1);
                      B[y] = L;
                    } else {
                      E[y] = 1;
                      continue;
                    }
                  if (C + q.length + 1 <= h)
                    q += " ", D[y] = q + D[y];
                  else if (l)
                    U = q.length + 1 - (h - C), U >= 0 && U < q.length && (q = q.substring(U) + " ", D[y] = q + D[y]), E[y] = 1;
                  else {
                    E[y] = 1;
                    continue;
                  }
                }
              else {
                q = v[K].match;
                r && (B[y] = r);
                t && (z[y] = t);
                y && C++;
                let Pa;
                K ? !y && u && (C += u) : (F[y] = 1, E[y] = 1);
                K >= x.length - 1 ? Pa = 1 : K < v.length - 1 && v[K + 1].match ? Pa = 1 : u && (C += u);
                C -= f.length - 2;
                if (!y || C + q.length <= h)
                  D[y] = q;
                else {
                  U = N = O = F[y] = 0;
                  break;
                }
                Pa && (F[y + 1] = 1, E[y + 1] = 1);
              }
              C += q.length;
              U = A[K] = 1;
            }
            if (U)
              J === G ? G++ : J++;
            else {
              J === G ? N = 0 : O = 0;
              if (!N && !O)
                break;
              N ? (J++, G = J) : G++;
            }
          }
          q = "";
          for (let y = 0, K;y < D.length; y++)
            K = (F[y] ? y ? " " : "" : (y && !d ? " " : "") + d) + D[y], q += K;
          d && !F[D.length] && (q += d);
        }
      m && (q = q.replace(m, " "));
      qa[ya].highlight = q;
    }
    if (e)
      break;
  }
  return c;
}
function X(a, c) {
  if (!this || this.constructor !== X)
    return new X(a, c);
  let b = 0, e, d, f, g, k, h;
  if (a && a.index) {
    const l = a;
    c = l.index;
    b = l.boost || 0;
    if (d = l.query) {
      f = l.field || l.pluck;
      g = l.highlight;
      const m = l.resolve;
      a = l.async || l.queue;
      l.resolve = false;
      l.index = null;
      a = a ? c.searchAsync(l) : c.search(l);
      l.resolve = m;
      l.index = c;
      a = a.result || a;
    } else
      a = [];
  }
  if (a && a.then) {
    const l = this;
    a = a.then(function(m) {
      l.C[0] = l.result = m.result || m;
      Wa(l);
    });
    e = [a];
    a = [];
    k = new Promise(function(m) {
      h = m;
    });
  }
  this.index = c || null;
  this.result = a || [];
  this.h = b;
  this.C = e || [];
  this.await = k || null;
  this.return = h || null;
  this.highlight = g || null;
  this.query = d || "";
  this.field = f || "";
}
function Wa(a, c) {
  let b = a.result;
  var e = a.await;
  a.await = null;
  for (let d = 0, f;d < a.C.length; d++)
    if (f = a.C[d]) {
      if (typeof f === "function")
        b = f(), a.C[d] = b = b.result || b, d--;
      else if (f.h)
        b = f.h(), a.C[d] = b = b.result || b, d--;
      else if (f.then)
        return a.await = e;
    }
  e = a.return;
  a.C = [];
  a.return = null;
  c || e(b);
  return b;
}
function $a(a, c, b, e, d, f, g) {
  const k = a.length;
  let h = [], l, m;
  l = I();
  for (let p = 0, u, r, t, n;p < c; p++)
    for (let q = 0;q < k; q++)
      if (t = a[q], p < t.length && (u = t[p]))
        for (let x = 0;x < u.length; x++) {
          r = u[x];
          (m = l[r]) ? l[r]++ : (m = 0, l[r] = 1);
          n = h[m] || (h[m] = []);
          if (!g) {
            let v = p + (q || !d ? 0 : f || 0);
            n = n[v] || (n[v] = []);
          }
          n.push(r);
          if (g && b && m === k - 1 && n.length - e === b)
            return e ? n.slice(e) : n;
        }
  if (a = h.length)
    if (d)
      h = h.length > 1 ? Ya(h, b, e, g, f) : (h = h[0]) && b && h.length > b || e ? h.slice(e, b + e) : h;
    else {
      if (a < k)
        return [];
      h = h[a - 1];
      if (b || e)
        if (g) {
          if (h.length > b || e)
            h = h.slice(e, b + e);
        } else {
          d = [];
          for (let p = 0, u;p < h.length; p++)
            if (u = h[p])
              if (e && u.length > e)
                e -= u.length;
              else {
                if (b && u.length > b || e)
                  u = u.slice(e, b + e), b -= u.length, e && (e -= u.length);
                d.push(u);
                if (!b)
                  break;
              }
          h = d;
        }
    }
  return h;
}
function Ya(a, c, b, e, d) {
  const f = [], g = I();
  let k;
  var h = a.length;
  let l;
  if (e)
    for (d = h - 1;d >= 0; d--) {
      if (l = (e = a[d]) && e.length) {
        for (h = 0;h < l; h++)
          if (k = e[h], !g[k]) {
            if (g[k] = 1, b)
              b--;
            else if (f.push(k), f.length === c)
              return f;
          }
      }
    }
  else
    for (let m = h - 1, p, u = 0;m >= 0; m--) {
      p = a[m];
      for (let r = 0;r < p.length; r++)
        if (l = (e = p[r]) && e.length) {
          for (let t = 0;t < l; t++)
            if (k = e[t], !g[k])
              if (g[k] = 1, b)
                b--;
              else {
                let n = (r + (m < h - 1 ? d || 0 : 0)) / (m + 1) | 0;
                (f[n] || (f[n] = [])).push(k);
                if (++u === c)
                  return f;
              }
        }
    }
  return f;
}
function eb(a, c, b, e, d) {
  const f = I(), g = [];
  for (let k = 0, h;k < c.length; k++) {
    h = c[k];
    for (let l = 0;l < h.length; l++)
      f[h[l]] = 1;
  }
  if (d)
    for (let k = 0, h;k < a.length; k++) {
      if (h = a[k], f[h]) {
        if (e)
          e--;
        else if (g.push(h), f[h] = 0, b && --b === 0)
          break;
      }
    }
  else
    for (let k = 0, h, l;k < a.result.length; k++)
      for (h = a.result[k], c = 0;c < h.length; c++)
        l = h[c], f[l] && ((g[k] || (g[k] = [])).push(l), f[l] = 0);
  return g;
}
function gb(a) {
  const c = [], b = I(), e = I();
  for (let d = 0, f, g, k, h, l, m, p;d < a.length; d++) {
    f = a[d];
    g = f.field;
    k = f.result;
    for (let u = 0;u < k.length; u++)
      if (l = k[u], typeof l !== "object" ? l = { id: h = l } : h = l.id, (m = b[h]) ? m.push(g) : (l.field = b[h] = [g], c.push(l)), p = l.highlight)
        m = e[h], m || (e[h] = m = {}, l.highlight = m), m[g] = p;
  }
  return c;
}
function fb(a, c, b, e, d) {
  a = this.tag.get(a);
  if (!a)
    return [];
  a = a.get(c);
  if (!a)
    return [];
  c = a.length - e;
  if (c > 0) {
    if (b && c > b || e)
      a = a.slice(e, e + b);
    d && (a = Ta.call(this, a));
  }
  return a;
}
function Ta(a) {
  if (!this || !this.store)
    return a;
  if (this.db)
    return this.index.get(this.field[0]).db.enrich(a);
  const c = Array(a.length);
  for (let b = 0, e;b < a.length; b++)
    e = a[b], c[b] = { id: e, doc: this.store.get(e) };
  return c;
}
function Na(a) {
  if (!this || this.constructor !== Na)
    return new Na(a);
  const c = a.document || a.doc || a;
  let b, e;
  this.B = [];
  this.field = [];
  this.D = [];
  this.key = (b = c.key || c.id) && hb(b, this.D) || "id";
  (e = a.keystore || 0) && (this.keystore = e);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? e ? new S(e) : new Set : e ? new R(e) : new Map;
  this.h = (b = c.store || null) && b && b !== true && [];
  this.store = b ? e ? new R(e) : new Map : null;
  this.cache = (b = a.cache || null) && new ma(b);
  a.cache = false;
  this.worker = a.worker || false;
  this.priority = a.priority || 4;
  this.index = ib.call(this, a, c);
  this.tag = null;
  if (b = c.tag) {
    if (typeof b === "string" && (b = [b]), b.length) {
      this.tag = new Map;
      this.A = [];
      this.F = [];
      for (let d = 0, f, g;d < b.length; d++) {
        f = b[d];
        g = f.field || f;
        if (!g)
          throw Error("The tag field from the document descriptor is undefined.");
        f.custom ? this.A[d] = f.custom : (this.A[d] = hb(g, this.D), f.filter && (typeof this.A[d] === "string" && (this.A[d] = new String(this.A[d])), this.A[d].G = f.filter));
        this.F[d] = g;
        this.tag.set(g, new Map);
      }
    }
  }
  if (this.worker) {
    this.fastupdate = false;
    a = [];
    for (const d of this.index.values())
      d.then && a.push(d);
    if (a.length) {
      const d = this;
      return Promise.all(a).then(function(f) {
        let g = 0;
        for (const k of d.index.entries()) {
          const h = k[0];
          let l = k[1];
          l.then && (l = f[g], d.index.set(h, l), g++);
        }
        return d;
      });
    }
  } else
    a.db && (this.fastupdate = false, this.mount(a.db));
}
function ib(a, c) {
  const b = new Map;
  let e = c.index || c.field || c;
  M(e) && (e = [e]);
  for (let f = 0, g, k;f < e.length; f++) {
    g = e[f];
    M(g) || (k = g, g = g.field);
    k = ba(k) ? Object.assign({}, a, k) : a;
    if (this.worker) {
      var d = undefined;
      d = (d = k.encoder) && d.encode ? d : new ka(typeof d === "string" ? va[d] : d || {});
      d = new La(k, d);
      b.set(g, d);
    }
    this.worker || b.set(g, new T(k, this.reg));
    k.custom ? this.B[f] = k.custom : (this.B[f] = hb(g, this.D), k.filter && (typeof this.B[f] === "string" && (this.B[f] = new String(this.B[f])), this.B[f].G = k.filter));
    this.field[f] = g;
  }
  if (this.h) {
    a = c.store;
    M(a) && (a = [a]);
    for (let f = 0, g, k;f < a.length; f++)
      g = a[f], k = g.field || g, g.custom ? (this.h[f] = g.custom, g.custom.O = k) : (this.h[f] = hb(k, this.D), g.filter && (typeof this.h[f] === "string" && (this.h[f] = new String(this.h[f])), this.h[f].G = g.filter));
  }
  return b;
}
function hb(a, c) {
  const b = a.split(":");
  let e = 0;
  for (let d = 0;d < b.length; d++)
    a = b[d], a[a.length - 1] === "]" && (a = a.substring(0, a.length - 2)) && (c[e] = true), a && (b[e++] = a);
  e < b.length && (b.length = e);
  return e > 1 ? b : b[0];
}
function lb(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 5000 | 0);
  for (const d of a.entries())
    e.push(d), e.length === c && (b.push(e), e = []);
  e.length && b.push(e);
  return b;
}
function mb(a, c) {
  c || (c = new Map);
  for (let b = 0, e;b < a.length; b++)
    e = a[b], c.set(e[0], e[1]);
  return c;
}
function nb(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 1000 | 0);
  for (const d of a.entries())
    e.push([d[0], lb(d[1])[0] || []]), e.length === c && (b.push(e), e = []);
  e.length && b.push(e);
  return b;
}
function ob(a, c) {
  c || (c = new Map);
  for (let b = 0, e, d;b < a.length; b++)
    e = a[b], d = c.get(e[0]), c.set(e[0], mb(e[1], d));
  return c;
}
function pb(a) {
  let c = [], b = [];
  for (const e of a.keys())
    b.push(e), b.length === 250000 && (c.push(b), b = []);
  b.length && c.push(b);
  return c;
}
function qb(a, c) {
  c || (c = new Set);
  for (let b = 0;b < a.length; b++)
    c.add(a[b]);
  return c;
}
function rb(a, c, b, e, d, f, g = 0) {
  const k = e && e.constructor === Array;
  var h = k ? e.shift() : e;
  if (!h)
    return this.export(a, c, d, f + 1);
  if ((h = a((c ? c + "." : "") + (g + 1) + "." + b, JSON.stringify(h))) && h.then) {
    const l = this;
    return h.then(function() {
      return rb.call(l, a, c, b, k ? e : null, d, f, g + 1);
    });
  }
  return rb.call(this, a, c, b, k ? e : null, d, f, g + 1);
}
function jb(a, c, b = 0, e = 0) {
  if (b < this.field.length) {
    const g = this.field[b];
    if ((c = this.index.get(g).export(a, g, b, e = 1)) && c.then) {
      const k = this;
      return c.then(function() {
        return k.export(a, g, b + 1);
      });
    }
    return this.export(a, g, b + 1);
  }
  let d, f;
  switch (e) {
    case 0:
      d = "reg";
      f = pb(this.reg);
      c = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && nb(this.tag, this.reg.size);
      c = null;
      break;
    case 2:
      d = "doc";
      f = this.store && lb(this.store);
      c = null;
      break;
    default:
      return;
  }
  return rb.call(this, a, c, d, f || null, b, e);
}
function kb(a, c) {
  var b = a.split(".");
  b[b.length - 1] === "json" && b.pop();
  const e = b.length > 2 ? b[0] : "";
  b = b.length > 2 ? b[2] : b[1];
  if (this.worker && e)
    return this.index.get(e).import(a);
  if (c) {
    typeof c === "string" && (c = JSON.parse(c));
    if (e)
      return this.index.get(e).import(b, c);
    switch (b) {
      case "reg":
        this.fastupdate = false;
        this.reg = qb(c, this.reg);
        for (let d = 0, f;d < this.field.length; d++)
          f = this.index.get(this.field[d]), f.fastupdate = false, f.reg = this.reg;
        if (this.worker) {
          c = [];
          for (const d of this.index.values())
            c.push(d.import(a));
          return Promise.all(c);
        }
        break;
      case "tag":
        this.tag = ob(c, this.tag);
        break;
      case "doc":
        this.store = mb(c, this.store);
    }
  }
}
function sb(a, c) {
  let b = "";
  for (const e of a.entries()) {
    a = e[0];
    const d = e[1];
    let f = "";
    for (let g = 0, k;g < d.length; g++) {
      k = d[g] || [""];
      let h = "";
      for (let l = 0;l < k.length; l++)
        h += (h ? "," : "") + (c === "string" ? '"' + k[l] + '"' : k[l]);
      h = "[" + h + "]";
      f += (f ? "," : "") + h;
    }
    f = '["' + a + '",[' + f + "]]";
    b += (b ? "," : "") + f;
  }
  return b;
}
function tb(a, c) {
  let b = 0;
  var e = typeof c === "undefined";
  if (a.constructor === Array)
    for (let d = 0, f, g, k;d < a.length; d++) {
      if ((f = a[d]) && f.length) {
        if (e)
          return 1;
        g = f.indexOf(c);
        if (g >= 0) {
          if (f.length > 1)
            return f.splice(g, 1), 1;
          delete a[d];
          if (b)
            return 1;
          k = 1;
        } else {
          if (k)
            return 1;
          b++;
        }
      }
    }
  else
    for (let d of a.entries())
      e = d[0], tb(d[1], c) ? b++ : a.delete(e);
  return b;
}
function Y(a, c, b, e, d, f, g) {
  let k, h;
  if (!(k = c[b]) || g && !k[g]) {
    g ? (c = k || (c[b] = I()), c[g] = 1, h = a.ctx, (k = h.get(g)) ? h = k : h.set(g, h = a.keystore ? new R(a.keystore) : new Map)) : (h = a.map, c[b] = 1);
    (k = h.get(b)) ? h = k : h.set(b, h = k = []);
    if (f) {
      for (let l = 0, m;l < k.length; l++)
        if ((m = k[l]) && m.includes(d)) {
          if (l <= e)
            return;
          m.splice(m.indexOf(d), 1);
          a.fastupdate && (c = a.reg.get(d)) && c.splice(c.indexOf(m), 1);
          break;
        }
    }
    h = h[e] || (h[e] = []);
    h.push(d);
    if (h.length === 2147483647) {
      c = new xa(h);
      if (a.fastupdate)
        for (let l of a.reg.values())
          l.includes(h) && (l[l.indexOf(h)] = c);
      k[e] = h = c;
    }
    a.fastupdate && ((e = a.reg.get(d)) ? e.push(h) : a.reg.set(d, [h]));
  }
}
function wb(a, c, b, e, d) {
  return b && a > 1 ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
function Ab(a, c, b, e, d, f, g) {
  let k = a.length, h = a;
  if (k > 1)
    h = $a(a, c, b, e, d, f, g);
  else if (k === 1)
    return g ? Sa.call(null, a[0], b, e) : new X(a[0], this);
  return g ? h : new X(h, this);
}
function xb(a, c, b, e, d, f, g) {
  a = yb(this, a, c, b, e, d, f, g);
  return this.db ? a.then(function(k) {
    return d ? k || [] : new X(k, this);
  }) : a && a.length ? d ? Sa.call(this, a, b, e) : new X(a, this) : d ? [] : new X([], this);
}
function zb(a, c, b, e) {
  let d = [];
  if (a && a.length) {
    if (a.length <= e) {
      c.push(a);
      return;
    }
    for (let f = 0, g;f < e; f++)
      if (g = a[f])
        d[f] = g;
    if (d.length) {
      c.push(d);
      return;
    }
  }
  if (!b)
    return d;
}
function yb(a, c, b, e, d, f, g, k) {
  let h;
  b && (h = a.bidirectional && c > b) && (h = b, b = c, c = h);
  if (a.db)
    return a.db.get(c, b, e, d, f, g, k);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
function T(a, c) {
  if (!this || this.constructor !== T)
    return new T(a);
  if (a) {
    var b = M(a) ? a : a.preset;
    b && (a = Object.assign({}, vb[b], a));
  } else
    a = {};
  b = a.context;
  const e = b === true ? { depth: 1 } : b || {}, d = M(a.encoder) ? va[a.encoder] : a.encode || a.encoder || {};
  this.encoder = d.encode ? d : typeof d === "object" ? new ka(d) : { encode: d };
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && b !== "default" && b !== "exact" && b || "strict";
  this.depth = b === "strict" && e.depth || 0;
  this.bidirectional = e.bidirectional !== false;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  (b = a.keystore || 0) && (this.keystore = b);
  this.map = b ? new R(b) : new Map;
  this.ctx = b ? new R(b) : new Map;
  this.reg = c || (this.fastupdate ? b ? new R(b) : new Map : b ? new S(b) : new Set);
  this.N = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || false;
  this.cache = (b = a.cache || null) && new ma(b);
  this.resolve = a.resolve !== false;
  if (b = a.db)
    this.db = this.mount(b);
  this.M = a.commit !== false;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
function ub(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a);
  }, 1));
}
function Eb(a, c = {}) {
  if (!this || this.constructor !== Eb)
    return new Eb(a, c);
  typeof a === "object" && (c = a, a = a.name);
  a || console.info("Default storage space was used, because a name was not passed.");
  this.id = "flexsearch" + (a ? ":" + a.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "");
  this.field = c.field ? c.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "";
  this.type = c.type;
  this.fastupdate = this.support_tag_search = false;
  this.db = null;
  this.h = {};
}
function Fb(a, c, b) {
  const e = a.value;
  let d, f = 0;
  for (let g = 0, k;g < e.length; g++) {
    if (k = b ? e : e[g]) {
      for (let h = 0, l, m;h < c.length; h++)
        if (m = c[h], l = k.indexOf(m), l >= 0)
          if (d = 1, k.length > 1)
            k.splice(l, 1);
          else {
            e[g] = [];
            break;
          }
      f += k.length;
    }
    if (b)
      break;
  }
  f ? d && a.update(e) : a.delete();
  a.continue();
}
function Z(a, c) {
  return new Promise((b, e) => {
    a.onsuccess = a.oncomplete = function() {
      c && c(this.result);
      c = null;
      b(this.result);
    };
    a.onerror = a.onblocked = e;
    a = null;
  });
}
var __dirname = "/Users/griever/Developer/markdown-search/node_modules/flexsearch/dist", w, ea, fa, ha, ia, ja, na, oa, ra, sa, ta, ua, va, Ca, Da, Ha, Ia, Ja, V = 0, vb, Bb, Cb, Db, Document;
var init_flexsearch_bundle_module_min = __esm(() => {
  ea = /[^\p{L}\p{N}]+/u;
  fa = /(\d{3})/g;
  ha = /(\D)(\d{3})/g;
  ia = /(\d{3})(\D)/g;
  ja = /[\u0300-\u036f]/g;
  w = ka.prototype;
  w.assign = function(a) {
    this.normalize = H(a.normalize, true, this.normalize);
    let c = a.include, b = c || a.exclude || a.split, e;
    if (b || b === "") {
      if (typeof b === "object" && b.constructor !== RegExp) {
        let d = "";
        e = !c;
        c || (d += "\\p{Z}");
        b.letter && (d += "\\p{L}");
        b.number && (d += "\\p{N}", e = !!c);
        b.symbol && (d += "\\p{S}");
        b.punctuation && (d += "\\p{P}");
        b.control && (d += "\\p{C}");
        if (b = b.char)
          d += typeof b === "object" ? b.join("") : b;
        try {
          this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
        } catch (f) {
          this.split = /\s+/;
        }
      } else
        this.split = b, e = b === false || "a1a".split(b).length < 2;
      this.numeric = H(a.numeric, e);
    } else {
      try {
        this.split = H(this.split, ea);
      } catch (d) {
        this.split = /\s+/;
      }
      this.numeric = H(a.numeric, H(this.numeric, true));
    }
    this.prepare = H(a.prepare, null, this.prepare);
    this.finalize = H(a.finalize, null, this.finalize);
    b = a.filter;
    this.filter = typeof b === "function" ? b : H(b && new Set(b), null, this.filter);
    this.dedupe = H(a.dedupe, true, this.dedupe);
    this.matcher = H((b = a.matcher) && new Map(b), null, this.matcher);
    this.mapper = H((b = a.mapper) && new Map(b), null, this.mapper);
    this.stemmer = H((b = a.stemmer) && new Map(b), null, this.stemmer);
    this.replacer = H(a.replacer, null, this.replacer);
    this.minlength = H(a.minlength, 1, this.minlength);
    this.maxlength = H(a.maxlength, 1024, this.maxlength);
    this.rtl = H(a.rtl, false, this.rtl);
    if (this.cache = b = H(a.cache, true, this.cache))
      this.F = null, this.L = typeof b === "number" ? b : 200000, this.B = new Map, this.D = new Map, this.I = this.H = 128;
    this.h = "";
    this.J = null;
    this.A = "";
    this.K = null;
    if (this.matcher)
      for (const d of this.matcher.keys())
        this.h += (this.h ? "|" : "") + d;
    if (this.stemmer)
      for (const d of this.stemmer.keys())
        this.A += (this.A ? "|" : "") + d;
    return this;
  };
  w.addStemmer = function(a, c) {
    this.stemmer || (this.stemmer = new Map);
    this.stemmer.set(a, c);
    this.A += (this.A ? "|" : "") + a;
    this.K = null;
    this.cache && Q(this);
    return this;
  };
  w.addFilter = function(a) {
    typeof a === "function" ? this.filter = a : (this.filter || (this.filter = new Set), this.filter.add(a));
    this.cache && Q(this);
    return this;
  };
  w.addMapper = function(a, c) {
    if (typeof a === "object")
      return this.addReplacer(a, c);
    if (a.length > 1)
      return this.addMatcher(a, c);
    this.mapper || (this.mapper = new Map);
    this.mapper.set(a, c);
    this.cache && Q(this);
    return this;
  };
  w.addMatcher = function(a, c) {
    if (typeof a === "object")
      return this.addReplacer(a, c);
    if (a.length < 2 && (this.dedupe || this.mapper))
      return this.addMapper(a, c);
    this.matcher || (this.matcher = new Map);
    this.matcher.set(a, c);
    this.h += (this.h ? "|" : "") + a;
    this.J = null;
    this.cache && Q(this);
    return this;
  };
  w.addReplacer = function(a, c) {
    if (typeof a === "string")
      return this.addMatcher(a, c);
    this.replacer || (this.replacer = []);
    this.replacer.push(a, c);
    this.cache && Q(this);
    return this;
  };
  w.encode = function(a, c) {
    if (this.cache && a.length <= this.H)
      if (this.F) {
        if (this.B.has(a))
          return this.B.get(a);
      } else
        this.F = setTimeout(Q, 50, this);
    this.normalize && (typeof this.normalize === "function" ? a = this.normalize(a) : a = ja ? a.normalize("NFKD").replace(ja, "").toLowerCase() : a.toLowerCase());
    this.prepare && (a = this.prepare(a));
    this.numeric && a.length > 3 && (a = a.replace(ha, "$1 $2").replace(ia, "$1 $2").replace(fa, "$1 "));
    const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
    let e = [], d = I(), f, g, k = this.split || this.split === "" ? a.split(this.split) : [a];
    for (let l = 0, m, p;l < k.length; l++)
      if ((m = p = k[l]) && !(m.length < this.minlength || m.length > this.maxlength)) {
        if (c) {
          if (d[m])
            continue;
          d[m] = 1;
        } else {
          if (f === m)
            continue;
          f = m;
        }
        if (b)
          e.push(m);
        else if (!this.filter || (typeof this.filter === "function" ? this.filter(m) : !this.filter.has(m))) {
          if (this.cache && m.length <= this.I)
            if (this.F) {
              var h = this.D.get(m);
              if (h || h === "") {
                h && e.push(h);
                continue;
              }
            } else
              this.F = setTimeout(Q, 50, this);
          if (this.stemmer) {
            this.K || (this.K = new RegExp("(?!^)(" + this.A + ")$"));
            let u;
            for (;u !== m && m.length > 2; )
              u = m, m = m.replace(this.K, (r) => this.stemmer.get(r));
          }
          if (m && (this.mapper || this.dedupe && m.length > 1)) {
            h = "";
            for (let u = 0, r = "", t, n;u < m.length; u++)
              t = m.charAt(u), t === r && this.dedupe || ((n = this.mapper && this.mapper.get(t)) || n === "" ? n === r && this.dedupe || !(r = n) || (h += n) : h += r = t);
            m = h;
          }
          this.matcher && m.length > 1 && (this.J || (this.J = new RegExp("(" + this.h + ")", "g")), m = m.replace(this.J, (u) => this.matcher.get(u)));
          if (m && this.replacer)
            for (h = 0;m && h < this.replacer.length; h += 2)
              m = m.replace(this.replacer[h], this.replacer[h + 1]);
          this.cache && p.length <= this.I && (this.D.set(p, m), this.D.size > this.L && (this.D.clear(), this.I = this.I / 1.1 | 0));
          if (m) {
            if (m !== p)
              if (c) {
                if (d[m])
                  continue;
                d[m] = 1;
              } else {
                if (g === m)
                  continue;
                g = m;
              }
            e.push(m);
          }
        }
      }
    this.finalize && (e = this.finalize(e) || e);
    this.cache && a.length <= this.H && (this.B.set(a, e), this.B.size > this.L && (this.B.clear(), this.H = this.H / 1.1 | 0));
    return e;
  };
  ma.prototype.set = function(a, c) {
    this.cache.set(this.h = a, c);
    this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
  };
  ma.prototype.get = function(a) {
    const c = this.cache.get(a);
    c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
    return c;
  };
  ma.prototype.remove = function(a) {
    for (const c of this.cache) {
      const b = c[0];
      c[1].includes(a) && this.cache.delete(b);
    }
  };
  ma.prototype.clear = function() {
    this.cache.clear();
    this.h = "";
  };
  na = { normalize: false, numeric: false, dedupe: false };
  oa = {};
  ra = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
  sa = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]);
  ta = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
  ua = { a: "", e: "", i: "", o: "", u: "", y: "", b: 1, f: 1, p: 1, v: 1, c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2, "\xDF": 2, d: 3, t: 3, l: 4, m: 5, n: 5, r: 6 };
  va = { Exact: na, Default: oa, Normalize: oa, LatinBalance: { mapper: ra }, LatinAdvanced: { mapper: ra, matcher: sa, replacer: ta }, LatinExtra: { mapper: ra, replacer: ta.concat([/(?!^)[aeo]/g, ""]), matcher: sa }, LatinSoundex: { dedupe: false, include: { letter: true }, finalize: function(a) {
    for (let b = 0;b < a.length; b++) {
      var c = a[b];
      let e = c.charAt(0), d = ua[e];
      for (let f = 1, g;f < c.length && (g = c.charAt(f), g === "h" || g === "w" || !(g = ua[g]) || g === d || (e += g, d = g, e.length !== 4)); f++)
        ;
      a[b] = e;
    }
  } }, CJK: { split: "" }, LatinExact: na, LatinDefault: oa, LatinSimple: oa };
  xa.prototype.clear = function() {
    this.index.length = 0;
  };
  xa.prototype.push = function() {};
  R.prototype.get = function(a) {
    const c = this.index[this.B(a)];
    return c && c.get(a);
  };
  R.prototype.set = function(a, c) {
    var b = this.B(a);
    let e = this.index[b];
    e ? (b = e.size, e.set(a, c), (b -= e.size) && this.size++) : (this.index[b] = e = new Map([[a, c]]), this.h.push(e), this.size++);
  };
  S.prototype.add = function(a) {
    var c = this.B(a);
    let b = this.index[c];
    b ? (c = b.size, b.add(a), (c -= b.size) && this.size++) : (this.index[c] = b = new Set([a]), this.h.push(b), this.size++);
  };
  w = R.prototype;
  w.has = S.prototype.has = function(a) {
    const c = this.index[this.B(a)];
    return c && c.has(a);
  };
  w.delete = S.prototype.delete = function(a) {
    const c = this.index[this.B(a)];
    c && c.delete(a) && this.size--;
  };
  w.clear = S.prototype.clear = function() {
    this.index = I();
    this.h = [];
    this.size = 0;
  };
  w.values = S.prototype.values = function* () {
    for (let a = 0;a < this.h.length; a++)
      for (let c of this.h[a].values())
        yield c;
  };
  w.keys = S.prototype.keys = function* () {
    for (let a = 0;a < this.h.length; a++)
      for (let c of this.h[a].keys())
        yield c;
  };
  w.entries = S.prototype.entries = function* () {
    for (let a = 0;a < this.h.length; a++)
      for (let c of this.h[a].entries())
        yield c;
  };
  W("add");
  W("append");
  W("search");
  W("update");
  W("remove");
  W("clear");
  W("export");
  W("import");
  La.prototype.searchCache = la;
  Fa(La.prototype);
  Na.prototype.add = function(a, c, b) {
    ba(a) && (c = a, a = ca(c, this.key));
    if (c && (a || a === 0)) {
      if (!b && this.reg.has(a))
        return this.update(a, c);
      for (let k = 0, h;k < this.field.length; k++) {
        h = this.B[k];
        var e = this.index.get(this.field[k]);
        if (typeof h === "function") {
          var d = h(c);
          d && e.add(a, d, b, true);
        } else if (d = h.G, !d || d(c))
          h.constructor === String ? h = ["" + h] : M(h) && (h = [h]), Qa(c, h, this.D, 0, e, a, h[0], b);
      }
      if (this.tag)
        for (e = 0;e < this.A.length; e++) {
          var f = this.A[e];
          d = this.tag.get(this.F[e]);
          let k = I();
          if (typeof f === "function") {
            if (f = f(c), !f)
              continue;
          } else {
            var g = f.G;
            if (g && !g(c))
              continue;
            f.constructor === String && (f = "" + f);
            f = ca(c, f);
          }
          if (d && f) {
            M(f) && (f = [f]);
            for (let h = 0, l, m;h < f.length; h++)
              if (l = f[h], !k[l] && (k[l] = 1, (g = d.get(l)) ? m = g : d.set(l, m = []), !b || !m.includes(a))) {
                if (m.length === 2147483647) {
                  g = new xa(m);
                  if (this.fastupdate)
                    for (let p of this.reg.values())
                      p.includes(m) && (p[p.indexOf(m)] = g);
                  d.set(l, m = g);
                }
                m.push(a);
                this.fastupdate && ((g = this.reg.get(a)) ? g.push(m) : this.reg.set(a, [m]));
              }
          }
        }
      if (this.store && (!b || !this.store.has(a))) {
        let k;
        if (this.h) {
          k = I();
          for (let h = 0, l;h < this.h.length; h++) {
            l = this.h[h];
            if ((b = l.G) && !b(c))
              continue;
            let m;
            if (typeof l === "function") {
              m = l(c);
              if (!m)
                continue;
              l = [l.O];
            } else if (M(l) || l.constructor === String) {
              k[l] = c[l];
              continue;
            }
            Ra(c, k, l, 0, l[0], m);
          }
        }
        this.store.set(a, k || c);
      }
      this.worker && (this.fastupdate || this.reg.add(a));
    }
    return this;
  };
  X.prototype.or = function() {
    return Ua(this, "or", Xa, arguments);
  };
  X.prototype.and = function() {
    return Ua(this, "and", Za, arguments);
  };
  X.prototype.xor = function() {
    return Ua(this, "xor", ab, arguments);
  };
  X.prototype.not = function() {
    return Ua(this, "not", bb, arguments);
  };
  w = X.prototype;
  w.limit = function(a) {
    if (this.await) {
      const c = this;
      this.C.push(function() {
        return c.limit(a).result;
      });
    } else if (this.result.length) {
      const c = [];
      for (let b = 0, e;b < this.result.length; b++)
        if (e = this.result[b])
          if (e.length <= a) {
            if (c[b] = e, a -= e.length, !a)
              break;
          } else {
            c[b] = e.slice(0, a);
            break;
          }
      this.result = c;
    }
    return this;
  };
  w.offset = function(a) {
    if (this.await) {
      const c = this;
      this.C.push(function() {
        return c.offset(a).result;
      });
    } else if (this.result.length) {
      const c = [];
      for (let b = 0, e;b < this.result.length; b++)
        if (e = this.result[b])
          e.length <= a ? a -= e.length : (c[b] = e.slice(a), a = 0);
      this.result = c;
    }
    return this;
  };
  w.boost = function(a) {
    if (this.await) {
      const c = this;
      this.C.push(function() {
        return c.boost(a).result;
      });
    } else
      this.h += a;
    return this;
  };
  w.resolve = function(a, c, b, e, d) {
    let f = this.await ? Wa(this, true) : this.result;
    if (f.then) {
      const g = this;
      return f.then(function() {
        return g.resolve(a, c, b, e, d);
      });
    }
    f.length && (typeof a === "object" ? (e = a.highlight || this.highlight, b = !!e || a.enrich, c = a.offset, a = a.limit) : (e = e || this.highlight, b = !!e || b), f = d ? b ? Ta.call(this.index, f) : f : Sa.call(this.index, f, a || 100, c, b));
    return this.finalize(f, e);
  };
  w.finalize = function(a, c) {
    if (a.then) {
      const e = this;
      return a.then(function(d) {
        return e.finalize(d, c);
      });
    }
    c && a.length && this.query && (a = cb(this.query, a, this.index.index, this.field, c));
    const b = this.return;
    this.highlight = this.index = this.result = this.C = this.await = this.return = null;
    this.query = this.field = "";
    b && b(a);
    return a;
  };
  I();
  Na.prototype.search = function(a, c, b, e) {
    b || (!c && ba(a) ? (b = a, a = "") : ba(c) && (b = c, c = 0));
    let d = [];
    var f = [];
    let g;
    let k, h, l, m, p;
    let u = 0, r = true, t;
    if (b) {
      b.constructor === Array && (b = { index: b });
      a = b.query || a;
      g = b.pluck;
      k = b.merge;
      l = b.boost;
      p = g || b.field || (p = b.index) && (p.index ? null : p);
      var n = this.tag && b.tag;
      h = b.suggest;
      r = b.resolve !== false;
      m = b.cache;
      t = r && this.store && b.highlight;
      var q = !!t || r && this.store && b.enrich;
      c = b.limit || c;
      var x = b.offset || 0;
      c || (c = r ? 100 : 0);
      if (n && (!this.db || !e)) {
        n.constructor !== Array && (n = [n]);
        var v = [];
        for (let B = 0, z;B < n.length; B++)
          if (z = n[B], z.field && z.tag) {
            var A = z.tag;
            if (A.constructor === Array)
              for (var D = 0;D < A.length; D++)
                v.push(z.field, A[D]);
            else
              v.push(z.field, A);
          } else {
            A = Object.keys(z);
            for (let C = 0, J, G;C < A.length; C++)
              if (J = A[C], G = z[J], G.constructor === Array)
                for (D = 0;D < G.length; D++)
                  v.push(J, G[D]);
              else
                v.push(J, G);
          }
        n = v;
        if (!a) {
          f = [];
          if (v.length)
            for (n = 0;n < v.length; n += 2) {
              if (this.db) {
                e = this.index.get(v[n]);
                if (!e)
                  continue;
                f.push(e = e.db.tag(v[n + 1], c, x, q));
              } else
                e = fb.call(this, v[n], v[n + 1], c, x, q);
              d.push(r ? { field: v[n], tag: v[n + 1], result: e } : [e]);
            }
          if (f.length) {
            const B = this;
            return Promise.all(f).then(function(z) {
              for (let C = 0;C < z.length; C++)
                r ? d[C].result = z[C] : d[C] = z[C];
              return r ? d : new X(d.length > 1 ? $a(d, 1, 0, 0, h, l) : d[0], B);
            });
          }
          return r ? d : new X(d.length > 1 ? $a(d, 1, 0, 0, h, l) : d[0], this);
        }
      }
      r || g || !(p = p || this.field) || (M(p) ? g = p : (p.constructor === Array && p.length === 1 && (p = p[0]), g = p.field || p.index));
      p && p.constructor !== Array && (p = [p]);
    }
    p || (p = this.field);
    let F;
    v = (this.worker || this.db) && !e && [];
    for (let B = 0, z, C, J;B < p.length; B++) {
      C = p[B];
      if (this.db && this.tag && !this.B[B])
        continue;
      let G;
      M(C) || (G = C, C = G.field, a = G.query || a, c = aa(G.limit, c), x = aa(G.offset, x), h = aa(G.suggest, h), t = r && this.store && aa(G.highlight, t), q = !!t || r && this.store && aa(G.enrich, q), m = aa(G.cache, m));
      if (e)
        z = e[B];
      else {
        A = G || b || {};
        D = A.enrich;
        var E = this.index.get(C);
        n && (this.db && (A.tag = n, A.field = p, F = E.db.support_tag_search), !F && D && (A.enrich = false), F || (A.limit = 0, A.offset = 0));
        z = m ? E.searchCache(a, n && !F ? 0 : c, A) : E.search(a, n && !F ? 0 : c, A);
        n && !F && (A.limit = c, A.offset = x);
        D && (A.enrich = D);
        if (v) {
          v[B] = z;
          continue;
        }
      }
      J = (z = z.result || z) && z.length;
      if (n && J) {
        A = [];
        D = 0;
        if (this.db && e) {
          if (!F)
            for (E = p.length;E < e.length; E++) {
              let N = e[E];
              if (N && N.length)
                D++, A.push(N);
              else if (!h)
                return r ? d : new X(d, this);
            }
        } else
          for (let N = 0, O, P;N < n.length; N += 2) {
            O = this.tag.get(n[N]);
            if (!O)
              if (h)
                continue;
              else
                return r ? d : new X(d, this);
            if (P = (O = O && O.get(n[N + 1])) && O.length)
              D++, A.push(O);
            else if (!h)
              return r ? d : new X(d, this);
          }
        if (D) {
          z = eb(z, A, c, x, r);
          J = z.length;
          if (!J && !h)
            return r ? z : new X(z, this);
          D--;
        }
      }
      if (J)
        f[u] = C, d.push(z), u++;
      else if (p.length === 1)
        return r ? d : new X(d, this);
    }
    if (v) {
      if (this.db && n && n.length && !F)
        for (q = 0;q < n.length; q += 2) {
          f = this.index.get(n[q]);
          if (!f)
            if (h)
              continue;
            else
              return r ? d : new X(d, this);
          v.push(f.db.tag(n[q + 1], c, x, false));
        }
      const B = this;
      return Promise.all(v).then(function(z) {
        b && (b.resolve = r);
        z.length && (z = B.search(a, c, b, z));
        return z;
      });
    }
    if (!u)
      return r ? d : new X(d, this);
    if (g && (!q || !this.store))
      return d = d[0], r ? d : new X(d, this);
    v = [];
    for (x = 0;x < f.length; x++) {
      n = d[x];
      q && n.length && typeof n[0].doc === "undefined" && (this.db ? v.push(n = this.index.get(this.field[0]).db.enrich(n)) : n = Ta.call(this, n));
      if (g)
        return r ? t ? cb(a, n, this.index, g, t) : n : new X(n, this);
      d[x] = { field: f[x], result: n };
    }
    if (q && this.db && v.length) {
      const B = this;
      return Promise.all(v).then(function(z) {
        for (let C = 0;C < z.length; C++)
          d[C].result = z[C];
        t && (d = cb(a, d, B.index, g, t));
        return k ? gb(d) : d;
      });
    }
    t && (d = cb(a, d, this.index, g, t));
    return k ? gb(d) : d;
  };
  w = Na.prototype;
  w.mount = function(a) {
    let c = this.field;
    if (this.tag)
      for (let f = 0, g;f < this.F.length; f++) {
        g = this.F[f];
        var b = undefined;
        this.index.set(g, b = new T({}, this.reg));
        c === this.field && (c = c.slice(0));
        c.push(g);
        b.tag = this.tag.get(g);
      }
    b = [];
    const e = { db: a.db, type: a.type, fastupdate: a.fastupdate };
    for (let f = 0, g, k;f < c.length; f++) {
      e.field = k = c[f];
      g = this.index.get(k);
      const h = new a.constructor(a.id, e);
      h.id = a.id;
      b[f] = h.mount(g);
      g.document = true;
      f ? g.bypass = true : g.store = this.store;
    }
    const d = this;
    return this.db = Promise.all(b).then(function() {
      d.db = true;
    });
  };
  w.commit = async function() {
    const a = [];
    for (const c of this.index.values())
      a.push(c.commit());
    await Promise.all(a);
    this.reg.clear();
  };
  w.destroy = function() {
    const a = [];
    for (const c of this.index.values())
      a.push(c.destroy());
    return Promise.all(a);
  };
  w.append = function(a, c) {
    return this.add(a, c, true);
  };
  w.update = function(a, c) {
    return this.remove(a).add(a, c);
  };
  w.remove = function(a) {
    ba(a) && (a = ca(a, this.key));
    for (var c of this.index.values())
      c.remove(a, true);
    if (this.reg.has(a)) {
      if (this.tag && !this.fastupdate)
        for (let b of this.tag.values())
          for (let e of b) {
            c = e[0];
            const d = e[1], f = d.indexOf(a);
            f > -1 && (d.length > 1 ? d.splice(f, 1) : b.delete(c));
          }
      this.store && this.store.delete(a);
      this.reg.delete(a);
    }
    this.cache && this.cache.remove(a);
    return this;
  };
  w.clear = function() {
    const a = [];
    for (const c of this.index.values()) {
      const b = c.clear();
      b.then && a.push(b);
    }
    if (this.tag)
      for (const c of this.tag.values())
        c.clear();
    this.store && this.store.clear();
    this.cache && this.cache.clear();
    return a.length ? Promise.all(a) : this;
  };
  w.contain = function(a) {
    return this.db ? this.index.get(this.field[0]).db.has(a) : this.reg.has(a);
  };
  w.cleanup = function() {
    for (const a of this.index.values())
      a.cleanup();
    return this;
  };
  w.get = function(a) {
    return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(c) {
      return c[0] && c[0].doc || null;
    }) : this.store.get(a) || null;
  };
  w.set = function(a, c) {
    typeof a === "object" && (c = a, a = ca(c, this.key));
    this.store.set(a, c);
    return this;
  };
  w.searchCache = la;
  w.export = jb;
  w.import = kb;
  Fa(Na.prototype);
  T.prototype.remove = function(a, c) {
    const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
    if (b) {
      if (this.fastupdate)
        for (let e = 0, d, f;e < b.length; e++) {
          if ((d = b[e]) && (f = d.length))
            if (d[f - 1] === a)
              d.pop();
            else {
              const g = d.indexOf(a);
              g >= 0 && d.splice(g, 1);
            }
        }
      else
        tb(this.map, a), this.depth && tb(this.ctx, a);
      c || this.reg.delete(a);
    }
    this.db && (this.commit_task.push({ del: a }), this.M && ub(this));
    this.cache && this.cache.remove(a);
    return this;
  };
  vb = { memory: { resolution: 1 }, performance: { resolution: 3, fastupdate: true, context: { depth: 1, resolution: 1 } }, match: { tokenize: "forward" }, score: { resolution: 9, context: { depth: 2, resolution: 3 } } };
  T.prototype.add = function(a, c, b, e) {
    if (c && (a || a === 0)) {
      if (!e && !b && this.reg.has(a))
        return this.update(a, c);
      e = this.depth;
      c = this.encoder.encode(c, !e);
      const l = c.length;
      if (l) {
        const m = I(), p = I(), u = this.resolution;
        for (let r = 0;r < l; r++) {
          let t = c[this.rtl ? l - 1 - r : r];
          var d = t.length;
          if (d && (e || !p[t])) {
            var f = this.score ? this.score(c, t, r, null, 0) : wb(u, l, r), g = "";
            switch (this.tokenize) {
              case "tolerant":
                Y(this, p, t, f, a, b);
                if (d > 2) {
                  for (let n = 1, q, x, v, A;n < d - 1; n++)
                    q = t.charAt(n), x = t.charAt(n + 1), v = t.substring(0, n) + x, A = t.substring(n + 2), g = v + q + A, Y(this, p, g, f, a, b), g = v + A, Y(this, p, g, f, a, b);
                  Y(this, p, t.substring(0, t.length - 1), f, a, b);
                }
                break;
              case "full":
                if (d > 2) {
                  for (let n = 0, q;n < d; n++)
                    for (f = d;f > n; f--) {
                      g = t.substring(n, f);
                      q = this.rtl ? d - 1 - n : n;
                      var k = this.score ? this.score(c, t, r, g, q) : wb(u, l, r, d, q);
                      Y(this, p, g, k, a, b);
                    }
                  break;
                }
              case "bidirectional":
              case "reverse":
                if (d > 1) {
                  for (k = d - 1;k > 0; k--) {
                    g = t[this.rtl ? d - 1 - k : k] + g;
                    var h = this.score ? this.score(c, t, r, g, k) : wb(u, l, r, d, k);
                    Y(this, p, g, h, a, b);
                  }
                  g = "";
                }
              case "forward":
                if (d > 1) {
                  for (k = 0;k < d; k++)
                    g += t[this.rtl ? d - 1 - k : k], Y(this, p, g, f, a, b);
                  break;
                }
              default:
                if (Y(this, p, t, f, a, b), e && l > 1 && r < l - 1)
                  for (d = this.N, g = t, f = Math.min(e + 1, this.rtl ? r + 1 : l - r), k = 1;k < f; k++) {
                    t = c[this.rtl ? l - 1 - r - k : r + k];
                    h = this.bidirectional && t > g;
                    const n = this.score ? this.score(c, g, r, t, k - 1) : wb(d + (l / 2 > d ? 0 : 1), l, r, f - 1, k - 1);
                    Y(this, m, h ? g : t, n, a, b, h ? t : g);
                  }
            }
          }
        }
        this.fastupdate || this.reg.add(a);
      }
    }
    this.db && (this.commit_task.push(b ? { ins: a } : { del: a }), this.M && ub(this));
    return this;
  };
  T.prototype.search = function(a, c, b) {
    b || (c || typeof a !== "object" ? typeof c === "object" && (b = c, c = 0) : (b = a, a = ""));
    if (b && b.cache)
      return b.cache = false, a = this.searchCache(a, c, b), b.cache = true, a;
    let e = [], d, f, g, k = 0, h, l, m, p, u;
    b && (a = b.query || a, c = b.limit || c, k = b.offset || 0, f = b.context, g = b.suggest, u = (h = b.resolve) && b.enrich, m = b.boost, p = b.resolution, l = this.db && b.tag);
    typeof h === "undefined" && (h = this.resolve);
    f = this.depth && f !== false;
    let r = this.encoder.encode(a, !f);
    d = r.length;
    c = c || (h ? 100 : 0);
    if (d === 1)
      return xb.call(this, r[0], "", c, k, h, u, l);
    if (d === 2 && f && !g)
      return xb.call(this, r[1], r[0], c, k, h, u, l);
    let t = I(), n = 0, q;
    f && (q = r[0], n = 1);
    p || p === 0 || (p = q ? this.N : this.resolution);
    if (this.db) {
      if (this.db.search && (b = this.db.search(this, r, c, k, g, h, u, l), b !== false))
        return b;
      const x = this;
      return async function() {
        for (let v, A;n < d; n++) {
          if ((A = r[n]) && !t[A]) {
            t[A] = 1;
            v = await yb(x, A, q, 0, 0, false, false);
            if (v = zb(v, e, g, p)) {
              e = v;
              break;
            }
            q && (g && v && e.length || (q = A));
          }
          g && q && n === d - 1 && !e.length && (p = x.resolution, q = "", n = -1, t = I());
        }
        return Ab(e, p, c, k, g, m, h);
      }();
    }
    for (let x, v;n < d; n++) {
      if ((v = r[n]) && !t[v]) {
        t[v] = 1;
        x = yb(this, v, q, 0, 0, false, false);
        if (x = zb(x, e, g, p)) {
          e = x;
          break;
        }
        q && (g && x && e.length || (q = v));
      }
      g && q && n === d - 1 && !e.length && (p = this.resolution, q = "", n = -1, t = I());
    }
    return Ab(e, p, c, k, g, m, h);
  };
  w = T.prototype;
  w.mount = function(a) {
    this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
    return a.mount(this);
  };
  w.commit = function() {
    this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
    return this.db.commit(this);
  };
  w.destroy = function() {
    this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
    return this.db.destroy();
  };
  w.clear = function() {
    this.map.clear();
    this.ctx.clear();
    this.reg.clear();
    this.cache && this.cache.clear();
    return this.db ? (this.commit_timer && clearTimeout(this.commit_timer), this.commit_timer = null, this.commit_task = [], this.db.clear()) : this;
  };
  w.append = function(a, c) {
    return this.add(a, c, true);
  };
  w.contain = function(a) {
    return this.db ? this.db.has(a) : this.reg.has(a);
  };
  w.update = function(a, c) {
    const b = this, e = this.remove(a);
    return e && e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
  };
  w.cleanup = function() {
    if (!this.fastupdate)
      return this;
    tb(this.map);
    this.depth && tb(this.ctx);
    return this;
  };
  w.searchCache = la;
  w.export = function(a, c, b = 0, e = 0) {
    let d, f;
    switch (e) {
      case 0:
        d = "reg";
        f = pb(this.reg);
        break;
      case 1:
        d = "cfg";
        f = null;
        break;
      case 2:
        d = "map";
        f = lb(this.map, this.reg.size);
        break;
      case 3:
        d = "ctx";
        f = nb(this.ctx, this.reg.size);
        break;
      default:
        return;
    }
    return rb.call(this, a, c, d, f, b, e);
  };
  w.import = function(a, c) {
    if (c)
      switch (typeof c === "string" && (c = JSON.parse(c)), a = a.split("."), a[a.length - 1] === "json" && a.pop(), a.length === 3 && a.shift(), a = a.length > 1 ? a[1] : a[0], a) {
        case "reg":
          this.fastupdate = false;
          this.reg = qb(c, this.reg);
          break;
        case "map":
          this.map = mb(c, this.map);
          break;
        case "ctx":
          this.ctx = ob(c, this.ctx);
      }
  };
  w.serialize = function(a = true) {
    let c = "", b = "", e = "";
    if (this.reg.size) {
      let f;
      for (var d of this.reg.keys())
        f || (f = typeof d), c += (c ? "," : "") + (f === "string" ? '"' + d + '"' : d);
      c = "index.reg=new Set([" + c + "]);";
      b = sb(this.map, f);
      b = "index.map=new Map([" + b + "]);";
      for (const g of this.ctx.entries()) {
        d = g[0];
        let k = sb(g[1], f);
        k = "new Map([" + k + "])";
        k = '["' + d + '",' + k + "]";
        e += (e ? "," : "") + k;
      }
      e = "index.ctx=new Map([" + e + "]);";
    }
    return a ? "function inject(index){" + c + b + e + "}" : c + b + e;
  };
  Fa(T.prototype);
  Bb = typeof window !== "undefined" && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB);
  Cb = ["map", "ctx", "tag", "reg", "cfg"];
  Db = I();
  w = Eb.prototype;
  w.mount = function(a) {
    if (a.index)
      return a.mount(this);
    a.db = this;
    return this.open();
  };
  w.open = function() {
    if (this.db)
      return this.db;
    let a = this;
    navigator.storage && navigator.storage.persist && navigator.storage.persist();
    Db[a.id] || (Db[a.id] = []);
    Db[a.id].push(a.field);
    const c = Bb.open(a.id, 1);
    c.onupgradeneeded = function() {
      const b = a.db = this.result;
      for (let e = 0, d;e < Cb.length; e++) {
        d = Cb[e];
        for (let f = 0, g;f < Db[a.id].length; f++)
          g = Db[a.id][f], b.objectStoreNames.contains(d + (d !== "reg" ? g ? ":" + g : "" : "")) || b.createObjectStore(d + (d !== "reg" ? g ? ":" + g : "" : ""));
      }
    };
    return a.db = Z(c, function(b) {
      a.db = b;
      a.db.onversionchange = function() {
        a.close();
      };
    });
  };
  w.close = function() {
    this.db && this.db.close();
    this.db = null;
  };
  w.destroy = function() {
    const a = Bb.deleteDatabase(this.id);
    return Z(a);
  };
  w.clear = function() {
    const a = [];
    for (let b = 0, e;b < Cb.length; b++) {
      e = Cb[b];
      for (let d = 0, f;d < Db[this.id].length; d++)
        f = Db[this.id][d], a.push(e + (e !== "reg" ? f ? ":" + f : "" : ""));
    }
    const c = this.db.transaction(a, "readwrite");
    for (let b = 0;b < a.length; b++)
      c.objectStore(a[b]).clear();
    return Z(c);
  };
  w.get = function(a, c, b = 0, e = 0, d = true, f = false) {
    a = this.db.transaction((c ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((c ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(c ? c + ":" + a : a);
    const g = this;
    return Z(a).then(function(k) {
      let h = [];
      if (!k || !k.length)
        return h;
      if (d) {
        if (!b && !e && k.length === 1)
          return k[0];
        for (let l = 0, m;l < k.length; l++)
          if ((m = k[l]) && m.length) {
            if (e >= m.length) {
              e -= m.length;
              continue;
            }
            const p = b ? e + Math.min(m.length - e, b) : m.length;
            for (let u = e;u < p; u++)
              h.push(m[u]);
            e = 0;
            if (h.length === b)
              break;
          }
        return f ? g.enrich(h) : h;
      }
      return k;
    });
  };
  w.tag = function(a, c = 0, b = 0, e = false) {
    a = this.db.transaction("tag" + (this.field ? ":" + this.field : ""), "readonly").objectStore("tag" + (this.field ? ":" + this.field : "")).get(a);
    const d = this;
    return Z(a).then(function(f) {
      if (!f || !f.length || b >= f.length)
        return [];
      if (!c && !b)
        return f;
      f = f.slice(b, b + c);
      return e ? d.enrich(f) : f;
    });
  };
  w.enrich = function(a) {
    typeof a !== "object" && (a = [a]);
    const c = this.db.transaction("reg", "readonly").objectStore("reg"), b = [];
    for (let e = 0;e < a.length; e++)
      b[e] = Z(c.get(a[e]));
    return Promise.all(b).then(function(e) {
      for (let d = 0;d < e.length; d++)
        e[d] = { id: a[d], doc: e[d] ? JSON.parse(e[d]) : null };
      return e;
    });
  };
  w.has = function(a) {
    a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
    return Z(a).then(function(c) {
      return !!c;
    });
  };
  w.search = null;
  w.info = function() {};
  w.transaction = function(a, c, b) {
    a += a !== "reg" ? this.field ? ":" + this.field : "" : "";
    let e = this.h[a + ":" + c];
    if (e)
      return b.call(this, e);
    let d = this.db.transaction(a, c);
    this.h[a + ":" + c] = e = d.objectStore(a);
    const f = b.call(this, e);
    this.h[a + ":" + c] = null;
    return Z(d).finally(function() {
      return f;
    });
  };
  w.commit = async function(a) {
    let c = a.commit_task, b = [];
    a.commit_task = [];
    for (let e = 0, d;e < c.length; e++)
      d = c[e], d.del && b.push(d.del);
    b.length && await this.remove(b);
    a.reg.size && (await this.transaction("map", "readwrite", function(e) {
      for (const d of a.map) {
        const f = d[0], g = d[1];
        g.length && (e.get(f).onsuccess = function() {
          let k = this.result;
          var h;
          if (k && k.length) {
            const l = Math.max(k.length, g.length);
            for (let m = 0, p, u;m < l; m++)
              if ((u = g[m]) && u.length) {
                if ((p = k[m]) && p.length)
                  for (h = 0;h < u.length; h++)
                    p.push(u[h]);
                else
                  k[m] = u;
                h = 1;
              }
          } else
            k = g, h = 1;
          h && e.put(k, f);
        });
      }
    }), await this.transaction("ctx", "readwrite", function(e) {
      for (const d of a.ctx) {
        const f = d[0], g = d[1];
        for (const k of g) {
          const h = k[0], l = k[1];
          l.length && (e.get(f + ":" + h).onsuccess = function() {
            let m = this.result;
            var p;
            if (m && m.length) {
              const u = Math.max(m.length, l.length);
              for (let r = 0, t, n;r < u; r++)
                if ((n = l[r]) && n.length) {
                  if ((t = m[r]) && t.length)
                    for (p = 0;p < n.length; p++)
                      t.push(n[p]);
                  else
                    m[r] = n;
                  p = 1;
                }
            } else
              m = l, p = 1;
            p && e.put(m, f + ":" + h);
          });
        }
      }
    }), a.store ? await this.transaction("reg", "readwrite", function(e) {
      for (const d of a.store) {
        const f = d[0], g = d[1];
        e.put(typeof g === "object" ? JSON.stringify(g) : 1, f);
      }
    }) : a.bypass || await this.transaction("reg", "readwrite", function(e) {
      for (const d of a.reg.keys())
        e.put(1, d);
    }), a.tag && await this.transaction("tag", "readwrite", function(e) {
      for (const d of a.tag) {
        const f = d[0], g = d[1];
        g.length && (e.get(f).onsuccess = function() {
          let k = this.result;
          k = k && k.length ? k.concat(g) : g;
          e.put(k, f);
        });
      }
    }), a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear());
  };
  w.remove = function(a) {
    typeof a !== "object" && (a = [a]);
    return Promise.all([this.transaction("map", "readwrite", function(c) {
      c.openCursor().onsuccess = function() {
        const b = this.result;
        b && Fb(b, a);
      };
    }), this.transaction("ctx", "readwrite", function(c) {
      c.openCursor().onsuccess = function() {
        const b = this.result;
        b && Fb(b, a);
      };
    }), this.transaction("tag", "readwrite", function(c) {
      c.openCursor().onsuccess = function() {
        const b = this.result;
        b && Fb(b, a, true);
      };
    }), this.transaction("reg", "readwrite", function(c) {
      for (let b = 0;b < a.length; b++)
        c.delete(a[b]);
    })]);
  };
  Document = Na;
});

// src/adapters/implementations/FlexSearchAdapter.ts
class FlexSearchAdapter {
  index;
  documents = new Map;
  options;
  indexCleared = false;
  sessionId = Math.random().toString(36).substring(7);
  constructor(options) {
    this.options = {
      preset: "performance",
      tokenize: "forward",
      resolution: 9,
      context: true,
      optimize: true,
      ...options
    };
  }
  async initialize(options) {
    const mergedOptions = { ...this.options, ...options };
    this.index = new Document({
      document: {
        id: "id",
        index: [
          {
            field: "content",
            tokenize: mergedOptions.tokenize,
            resolution: mergedOptions.resolution,
            context: mergedOptions.context
          },
          {
            field: "title",
            tokenize: "forward"
          },
          {
            field: "fileName",
            tokenize: "strict"
          }
        ],
        store: ["id", "type", "fileUri", "fileName", "filePath", "slideIndex"]
      }
    });
  }
  async addDocuments(documents) {
    const timestamp = new Date().toISOString();
    const logPrefix = `[FlexSearchAdapter:${this.sessionId}:${timestamp}]`;
    debugLog(`${logPrefix} ===== addDocuments() called with ${documents.length} documents =====`);
    debugLog(`${logPrefix} Current indexCleared status: ${this.indexCleared}`);
    if (!this.index) {
      throw new Error("Search engine not initialized");
    }
    if (!this.indexCleared) {
      debugLog(`${logPrefix} \uD83D\uDD25 CLEARING INDEX - First batch detected! indexCleared=${this.indexCleared}`);
      await this.clear();
      this.indexCleared = true;
      debugLog(`${logPrefix} \u2705 Index cleared, indexCleared now set to: ${this.indexCleared}`);
    } else {
      debugLog(`${logPrefix} \u2795 Adding to existing index (subsequent batch), indexCleared=${this.indexCleared}`);
    }
    debugLog(`${logPrefix} About to process ${documents.length} documents...`);
    for (const doc of documents) {
      debugLog(`[FlexSearchAdapter] Processing document: ${doc.id} - ${doc.title || doc.fileName}`);
      this.documents.set(doc.id, doc);
      debugLog(`[FlexSearchAdapter] Stored in documents Map with ID: "${doc.id}"`);
      const indexDoc = {
        id: doc.id,
        content: doc.content,
        title: doc.title || "",
        type: doc.type,
        fileUri: doc.fileUri,
        fileName: doc.fileName,
        filePath: doc.filePath,
        sectionIndex: doc.sectionIndex ?? 0
      };
      this.index.add(indexDoc);
    }
    debugLog(`[FlexSearchAdapter] Successfully added ${documents.length} documents to index`);
    debugLog(`[FlexSearchAdapter] Documents map size: ${this.documents.size}`);
    debugLog(`[FlexSearchAdapter] First 5 document IDs in Map:`, Array.from(this.documents.keys()).slice(0, 5));
  }
  async removeDocuments(ids) {
    if (!this.index) {
      throw new Error("Search engine not initialized");
    }
    for (const id of ids) {
      this.documents.delete(id);
      this.index.remove(id);
    }
  }
  async search(query, options) {
    debugLog("[FlexSearchAdapter] Starting search with query:", query, "options:", options);
    if (!this.index) {
      console.error("[FlexSearchAdapter] Search engine not initialized");
      throw new Error("Search engine not initialized");
    }
    if (!query || query.trim().length === 0) {
      debugLog("[FlexSearchAdapter] Empty query, returning empty results");
      return [];
    }
    debugLog("[FlexSearchAdapter] Total documents in memory:", this.documents.size);
    debugLog("[FlexSearchAdapter] Document IDs:", Array.from(this.documents.keys()).slice(0, 5));
    const searchOptions = {
      limit: options?.limit || 50,
      threshold: options?.fuzzyThreshold !== undefined ? options.fuzzyThreshold : 0.5,
      where: undefined
    };
    if (options?.types && options.types.length > 0) {
      searchOptions.where = {
        type: options.types
      };
    }
    debugLog("[FlexSearchAdapter] Search options:", searchOptions);
    const fields = options?.fields || ["content", "title", "fileName"];
    const results = new Map;
    debugLog("[FlexSearchAdapter] Searching fields:", fields);
    for (const field of fields) {
      debugLog(`[FlexSearchAdapter] Searching field: ${field}`);
      const fieldResults = this.index.search(query, {
        ...searchOptions,
        index: field,
        suggest: true
      });
      debugLog(`[FlexSearchAdapter] Field "${field}" returned:`, fieldResults);
      debugLog(`[FlexSearchAdapter] Field "${field}" results type:`, typeof fieldResults);
      if (Array.isArray(fieldResults) && fieldResults.length > 0) {
        debugLog(`[FlexSearchAdapter] First result structure:`, JSON.stringify(fieldResults[0]));
      }
      if (Array.isArray(fieldResults)) {
        debugLog(`[FlexSearchAdapter] Processing ${fieldResults.length} results from field "${field}"`);
        for (const result of fieldResults) {
          let resultId = "";
          let resultScore = 1;
          debugLog(`[FlexSearchAdapter] Processing result:`, result, "type:", typeof result);
          if (typeof result === "object" && result !== null) {
            if ("id" in result) {
              resultId = String(result.id);
              if ("score" in result && typeof result.score === "number") {
                resultScore = result.score;
              }
            } else if ("result" in result && Array.isArray(result.result)) {
              if (result.result.length > 0) {
                resultId = String(result.result[0]);
              }
            } else {
              debugLog(`[FlexSearchAdapter] Unknown result object structure:`, JSON.stringify(result));
            }
            debugLog(`[FlexSearchAdapter] Document result ID: "${resultId}", score: ${resultScore}`);
          } else if (typeof result === "string") {
            resultId = result;
            debugLog(`[FlexSearchAdapter] Simple string result: "${resultId}"`);
          } else if (typeof result === "number") {
            resultId = String(result);
            debugLog(`[FlexSearchAdapter] Numeric result converted: "${resultId}"`);
          }
          if (resultId) {
            debugLog(`[FlexSearchAdapter] Checking if document ID "${resultId}" exists in documents Map...`);
            debugLog(`[FlexSearchAdapter] Documents Map has ID "${resultId}":`, this.documents.has(resultId));
            const existingResult = results.get(resultId);
            if (existingResult) {
              existingResult.score = Math.max(existingResult.score, resultScore);
              existingResult.matches.push({ field, result });
              debugLog(`[FlexSearchAdapter] Updated existing result for "${resultId}", new score: ${existingResult.score}`);
            } else {
              results.set(resultId, {
                score: resultScore,
                matches: [{ field, result }]
              });
              debugLog(`[FlexSearchAdapter] Added new result for "${resultId}", score: ${resultScore}`);
            }
          }
        }
      }
    }
    const searchResults = [];
    debugLog(`[FlexSearchAdapter] Converting ${results.size} matched document IDs to SearchResults`);
    for (const [id, resultData] of results.entries()) {
      const { score, matches } = resultData;
      const doc = this.documents.get(id);
      if (!doc) {
        console.warn(`[FlexSearchAdapter] Document ${id} not found in documents map!`);
        continue;
      }
      debugLog(`[FlexSearchAdapter] Processing document ${id}: ${doc.title || doc.fileName}`);
      const matchInfos = [];
      for (const { field } of matches) {
        const fieldContent = field === "content" ? doc.content : field === "title" ? doc.title || "" : doc.fileName;
        const matchInfo = this.createMatchInfo(query, fieldContent, field);
        if (matchInfo) {
          matchInfos.push(matchInfo);
        }
      }
      searchResults.push({
        ...doc,
        score,
        matches: matchInfos,
        highlights: this.createHighlights(doc.content, query)
      });
    }
    debugLog(`[FlexSearchAdapter] Final search results count: ${searchResults.length}`);
    debugLog(`[FlexSearchAdapter] Sample results:`, searchResults.slice(0, 2).map((r) => ({ id: r.id, title: r.title, score: r.score })));
    searchResults.sort((a, b) => b.score - a.score);
    if (options?.limit) {
      return searchResults.slice(0, options.limit);
    }
    return searchResults;
  }
  async exportIndex() {
    if (!this.index) {
      throw new Error("Search engine not initialized");
    }
    debugLog("Exporting index...");
    return new Promise((resolve, reject) => {
      const exportedData = [];
      try {
        this.index.export((key, data) => {
          exportedData.push({ key, data });
        });
        debugLog("Index exported...");
        resolve({
          index: exportedData,
          documents: Array.from(this.documents.entries())
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  async importIndex(data) {
    if (!this.index) {
      await this.initialize();
    }
    if (this.isValidImportData(data)) {
      if (data.index && Array.isArray(data.index)) {
        for (const item of data.index) {
          if (item.key && item.data !== undefined) {
            this.index.import(String(item.key), item.data);
          }
        }
      }
      if (data.documents) {
        this.documents.clear();
        for (const [id, doc] of data.documents) {
          this.documents.set(id, doc);
        }
      }
    }
  }
  async clear() {
    if (!this.index) {
      return;
    }
    const ids = Array.from(this.documents.keys());
    for (const id of ids) {
      this.index.remove(id);
    }
    this.documents.clear();
  }
  startNewIndexingSession() {
    const timestamp = new Date().toISOString();
    this.sessionId = Math.random().toString(36).substring(7);
    const logPrefix = `[FlexSearchAdapter:${this.sessionId}:${timestamp}]`;
    debugLog(`${logPrefix} \uD83D\uDE80 STARTING NEW INDEXING SESSION`);
    debugLog(`${logPrefix} Previous indexCleared status: ${this.indexCleared}`);
    this.indexCleared = false;
    debugLog(`${logPrefix} Reset indexCleared to: ${this.indexCleared}`);
  }
  createMatchInfo(query, content, field) {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);
    if (index === -1) {
      const words = lowerQuery.split(/\s+/);
      for (const word of words) {
        const wordIndex = lowerContent.indexOf(word);
        if (wordIndex !== -1) {
          return this.createMatchContext(content, word, wordIndex, field);
        }
      }
      return null;
    }
    return this.createMatchContext(content, query, index, field);
  }
  createMatchContext(content, matchedText, index, field) {
    const contextLength = 50;
    const beforeStart = Math.max(0, index - contextLength);
    const afterEnd = Math.min(content.length, index + matchedText.length + contextLength);
    return {
      field,
      matchedText,
      context: {
        before: content.substring(beforeStart, index),
        after: content.substring(index + matchedText.length, afterEnd)
      },
      position: {
        start: index,
        end: index + matchedText.length
      }
    };
  }
  createHighlights(content, query) {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);
    if (index === -1) {
      return content.substring(0, 150) + (content.length > 150 ? "..." : "");
    }
    const snippetStart = Math.max(0, index - 50);
    const snippetEnd = Math.min(content.length, index + query.length + 50);
    let snippet = content.substring(snippetStart, snippetEnd);
    if (snippetStart > 0)
      snippet = "..." + snippet;
    if (snippetEnd < content.length)
      snippet = snippet + "...";
    return snippet;
  }
  isValidImportData(data) {
    return typeof data === "object" && data !== null && (!("index" in data) || Array.isArray(data.index)) && (!("documents" in data) || Array.isArray(data.documents));
  }
}
var DEBUG_FLEXSEARCH = false, debugLog = (...args) => {
  if (DEBUG_FLEXSEARCH) {
    console.log(...args);
  }
};
var init_FlexSearchAdapter = __esm(() => {
  init_flexsearch_bundle_module_min();
});

// src/SearchEngineFactory.ts
var exports_SearchEngineFactory = {};
__export(exports_SearchEngineFactory, {
  SearchEngineFactory: () => SearchEngineFactory
});

class SearchEngineFactory {
  static create(type, options) {
    switch (type) {
      case "flexsearch":
        return new FlexSearchAdapter(options);
      case "fuse":
        throw new Error("Fuse.js adapter not yet implemented");
      case "lunr":
        throw new Error("Lunr.js adapter not yet implemented");
      case "minisearch":
        throw new Error("MiniSearch adapter not yet implemented");
      case "orama":
        throw new Error("Orama adapter not yet implemented");
      default:
        throw new Error(`Unknown search engine type: ${type}`);
    }
  }
  static getDefault() {
    return "flexsearch";
  }
  static isAvailable(type) {
    try {
      return type === "flexsearch";
    } catch {
      return false;
    }
  }
  static getAvailable() {
    const allTypes = ["flexsearch", "fuse", "lunr", "minisearch", "orama"];
    return allTypes.filter((type) => this.isAvailable(type));
  }
  static createInMemoryEngine(options) {
    return new FlexSearchAdapter({
      ...options,
      storage: undefined
    });
  }
}
var init_SearchEngineFactory = __esm(() => {
  init_FlexSearchAdapter();
});

// node_modules/@a24z/markdown-utils/dist/index.mjs
function hashMarkdownString(str) {
  let hash = 0;
  for (let i = 0;i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
function parseMarkdownChunks(markdownContent, idPrefix, customParsers) {
  try {
    if (typeof markdownContent !== "string") {
      throw new Error("Invalid markdown content provided");
    }
    if (!markdownContent || markdownContent.trim() === "") {
      return [];
    }
    const chunks = [];
    const mermaidRegex = /^```mermaid\n([\s\S]*?)\n^```$/gm;
    let lastIndex = 0;
    let match;
    let partCounter = 0;
    while ((match = mermaidRegex.exec(markdownContent)) !== null) {
      partCounter++;
      if (match.index > lastIndex) {
        const mdContent = markdownContent.substring(lastIndex, match.index);
        if (mdContent.trim()) {
          chunks.push({
            type: CHUNK_TYPES.MARKDOWN,
            content: mdContent,
            id: `${idPrefix}-md-${partCounter}-${hashMarkdownString(mdContent)}`
          });
        }
      }
      partCounter++;
      const mermaidContent = match[1].trim();
      chunks.push({
        type: CHUNK_TYPES.MERMAID,
        content: mermaidContent,
        id: `${idPrefix}-mermaid-${partCounter}-${hashMarkdownString(mermaidContent)}`
      });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < markdownContent.length) {
      partCounter++;
      const remainingMdContent = markdownContent.substring(lastIndex);
      if (remainingMdContent.trim()) {
        chunks.push({
          type: CHUNK_TYPES.MARKDOWN,
          content: remainingMdContent,
          id: `${idPrefix}-md-${partCounter}-${hashMarkdownString(remainingMdContent)}`
        });
      }
    }
    if (chunks.length === 0 && markdownContent.trim()) {
      chunks.push({
        type: CHUNK_TYPES.MARKDOWN,
        content: markdownContent,
        id: `${idPrefix}-md-only-${hashMarkdownString(markdownContent)}`
      });
    }
    if (customParsers && customParsers.length > 0) {
      let processedChunks = chunks;
      for (const parser of customParsers) {
        const newChunks = [];
        for (const chunk of processedChunks) {
          if (chunk.type === CHUNK_TYPES.MARKDOWN) {
            const parsed = parser(chunk.content, chunk.id);
            if (parsed.length > 0) {
              newChunks.push(...parsed);
            } else {
              newChunks.push(chunk);
            }
          } else {
            newChunks.push(chunk);
          }
        }
        processedChunks = newChunks;
      }
      return processedChunks;
    }
    return chunks;
  } catch (error) {
    console.error("Error in parseMarkdownChunks:", error);
    return markdownContent ? [
      {
        type: CHUNK_TYPES.MARKDOWN,
        content: markdownContent,
        id: `${idPrefix}-md-error-fallback-${hashMarkdownString(markdownContent)}`
      }
    ] : [];
  }
}
function hashMarkdownString2(str) {
  let hash = 0;
  for (let i = 0;i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
function extractSlideTitle(content) {
  const lines = content.split(`
`).filter((line) => line.trim());
  for (const line of lines) {
    const headingMatch = line.match(/^#+\s+(.+)$/);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
  }
  if (lines.length > 0) {
    const firstLine = lines[0];
    return firstLine.length > 50 ? firstLine.substring(0, 47) + "..." : firstLine;
  }
  return "Untitled Slide";
}
function parseMarkdownIntoPresentation(markdownContent, repositoryInfo, customParsers) {
  const hasMultipleHeaders = detectMultipleHeaders(markdownContent);
  if (!hasMultipleHeaders) {
    const id = `slide-0-${hashMarkdownString2(markdownContent)}`;
    const chunks = parseMarkdownChunks(markdownContent, id, customParsers);
    return {
      slides: [
        {
          id,
          title: extractSlideTitle(markdownContent),
          location: {
            startLine: 0,
            endLine: markdownContent.split(`
`).length - 1,
            content: markdownContent
          },
          chunks
        }
      ],
      originalContent: markdownContent,
      repositoryInfo
    };
  }
  const lines = markdownContent.split(`
`);
  const slides = [];
  let currentSlideLines = [];
  let currentSlideStartLine = 0;
  let inCodeBlock = false;
  let codeBlockDelimiter = "";
  for (let i = 0;i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("```") || line.trim().startsWith("~~~")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockDelimiter = line.trim().substring(0, 3);
      } else if (line.trim().startsWith(codeBlockDelimiter)) {
        inCodeBlock = false;
        codeBlockDelimiter = "";
      }
    }
    const isDelimiter = !inCodeBlock && line.trim().startsWith("#") && !line.trim().startsWith("###");
    if (isDelimiter && currentSlideLines.length > 0) {
      const slideContent = currentSlideLines.join(`
`);
      const slideId = `slide-${slides.length}-${hashMarkdownString2(slideContent)}`;
      const chunks = parseMarkdownChunks(slideContent, slideId, customParsers);
      slides.push({
        id: slideId,
        title: extractSlideTitle(slideContent),
        location: {
          startLine: currentSlideStartLine,
          endLine: i - 1,
          content: slideContent
        },
        chunks
      });
      currentSlideLines = [line];
      currentSlideStartLine = i;
    } else {
      currentSlideLines.push(line);
    }
  }
  if (currentSlideLines.length > 0) {
    const slideContent = currentSlideLines.join(`
`);
    const slideId = `slide-${slides.length}-${hashMarkdownString2(slideContent)}`;
    const chunks = parseMarkdownChunks(slideContent, slideId, customParsers);
    slides.push({
      id: slideId,
      title: extractSlideTitle(slideContent),
      location: {
        startLine: currentSlideStartLine,
        endLine: lines.length - 1,
        content: slideContent
      },
      chunks
    });
  }
  return {
    slides,
    originalContent: markdownContent,
    repositoryInfo
  };
}
function detectMultipleHeaders(markdownContent) {
  const lines = markdownContent.split(`
`);
  let h1Count = 0;
  let h2Count = 0;
  let inCodeBlock = false;
  let codeBlockDelimiter = "";
  for (const line of lines) {
    if (line.trim().startsWith("```") || line.trim().startsWith("~~~")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockDelimiter = line.trim().substring(0, 3);
      } else if (line.trim().startsWith(codeBlockDelimiter)) {
        inCodeBlock = false;
        codeBlockDelimiter = "";
      }
    }
    if (!inCodeBlock) {
      if (line.trim().startsWith("#") && !line.trim().startsWith("###")) {
        if (!line.trim().startsWith("##")) {
          h1Count++;
        } else {
          h2Count++;
        }
      }
    }
  }
  const totalHeaders = h1Count + h2Count;
  return totalHeaders > 1;
}
var CHUNK_TYPES, MarkdownSourceType;
var init_dist = __esm(() => {
  CHUNK_TYPES = {
    MARKDOWN: "markdown_chunk",
    MERMAID: "mermaid_chunk",
    SLIDE: "slide_chunk",
    CODE: "code_chunk"
  };
  ((MarkdownSourceType2) => {
    MarkdownSourceType2["WORKSPACE_FILE"] = "workspace_file";
    MarkdownSourceType2["REMOTE_FILE"] = "remote_file";
    MarkdownSourceType2["GITHUB_FILE"] = "github_file";
    MarkdownSourceType2["DRAFT"] = "draft";
    MarkdownSourceType2["GITHUB_ISSUE"] = "github_issue";
    MarkdownSourceType2["GITHUB_PULL_REQUEST"] = "github_pull_request";
    MarkdownSourceType2["GITHUB_GIST"] = "github_gist";
  })(MarkdownSourceType ||= {});
});

// src/DocumentIndexer.ts
class DocumentIndexer {
  createSearchDocuments(document, fileInfo, options) {
    const documents = [];
    const mainDoc = {
      id: `${fileInfo.uri || fileInfo.path}#document`,
      type: "document",
      fileUri: fileInfo.uri || fileInfo.path,
      fileName: fileInfo.name,
      filePath: fileInfo.path,
      content: document.content,
      title: document.title || fileInfo.name,
      location: {
        startLine: 0,
        endLine: document.content.split(`
`).length
      },
      metadata: this.analyzeDocumentContent(document),
      contentHash: this.generateContentHash(document.content),
      indexedAt: new Date().toISOString()
    };
    documents.push(mainDoc);
    document.sections?.forEach((section, sectionIndex) => {
      const sectionDoc = {
        id: `${fileInfo.uri || fileInfo.path}#section-${sectionIndex}`,
        type: "section",
        parentId: mainDoc.id,
        fileUri: fileInfo.uri || fileInfo.path,
        fileName: fileInfo.name,
        filePath: fileInfo.path,
        content: section.content,
        title: section.title || `Section ${sectionIndex + 1}`,
        location: {
          startLine: section.startLine || 0,
          endLine: section.endLine || 0
        },
        sectionIndex,
        sectionNumber: sectionIndex + 1,
        sectionLevel: section.level,
        totalSectionsInFile: document.sections?.length || 0,
        previousSectionTitle: sectionIndex > 0 ? document.sections?.[sectionIndex - 1]?.title : undefined,
        nextSectionTitle: sectionIndex < (document.sections?.length || 0) - 1 ? document.sections?.[sectionIndex + 1]?.title : undefined,
        metadata: this.analyzeSectionContent(section),
        contentHash: this.generateContentHash(section.content),
        indexedAt: new Date().toISOString()
      };
      documents.push(sectionDoc);
      if (options?.indexChunks && section.blocks) {
        section.blocks.forEach((block, blockIndex) => {
          const blockDoc = this.createBlockDocument(block, blockIndex, sectionDoc, fileInfo);
          if (blockDoc) {
            documents.push(blockDoc);
          }
        });
      }
    });
    return documents;
  }
  async parseAndIndex(content, fileInfo, options) {
    const presentation = parseMarkdownIntoPresentation(content);
    const document = {
      content,
      title: fileInfo.name.replace(/\.md$/i, ""),
      sections: presentation.slides.map((slide) => ({
        content: slide.location.content,
        title: slide.title,
        level: 1,
        startLine: slide.location.startLine,
        endLine: slide.location.endLine,
        blocks: slide.chunks
      }))
    };
    return this.createSearchDocuments(document, fileInfo, options);
  }
  analyzeDocumentContent(document) {
    const content = document.content;
    const metadata = {
      hasCode: false,
      hasMermaid: false,
      hasTables: false,
      hasImages: false,
      hasLinks: false,
      codeLanguages: []
    };
    const codeBlockRegex = /```(\w+)?/g;
    let codeMatch;
    while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
      metadata.hasCode = true;
      if (codeMatch[1] && !metadata.codeLanguages.includes(codeMatch[1])) {
        metadata.codeLanguages.push(codeMatch[1]);
      }
    }
    if (/```mermaid/i.test(content)) {
      metadata.hasMermaid = true;
    }
    if (/\|.+\|/.test(content) && /\|[-:]+\|/.test(content)) {
      metadata.hasTables = true;
    }
    if (/!\[.*?\]\(.*?\)/.test(content)) {
      metadata.hasImages = true;
    }
    if (/(?<!!)\[.*?\]\(.*?\)/.test(content)) {
      metadata.hasLinks = true;
    }
    return metadata;
  }
  analyzeSectionContent(section) {
    return this.analyzeDocumentContent({ content: section.content });
  }
  createBlockDocument(block, blockIndex, parentSectionDoc, fileInfo) {
    let blockType;
    let content;
    let language;
    let diagramType;
    switch (block.type) {
      case CHUNK_TYPES.MERMAID:
      case "mermaid_chunk":
        blockType = "mermaid";
        content = block.code || block.content || "";
        diagramType = "mermaid";
        break;
      case CHUNK_TYPES.CODE:
      case "code_chunk":
        blockType = "code";
        content = block.content || block.code || "";
        language = block.language;
        break;
      case CHUNK_TYPES.MARKDOWN:
      case "markdown_chunk":
        blockType = "paragraph";
        content = block.content || "";
        break;
      default:
        if (block.type === "heading") {
          blockType = "heading";
          content = block.content || "";
        } else if (block.type === "list") {
          blockType = "list";
          content = block.content || "";
        } else if (block.type === "table") {
          blockType = "table";
          content = block.content || "";
        } else {
          return null;
        }
    }
    if (!content || !content.trim()) {
      return null;
    }
    const blockDoc = {
      id: `${parentSectionDoc.id}#block-${blockIndex}`,
      type: blockType,
      parentId: parentSectionDoc.id,
      fileUri: fileInfo.uri || fileInfo.path,
      fileName: fileInfo.name,
      filePath: fileInfo.path,
      content,
      title: this.generateBlockTitle(blockType, content),
      location: {
        startLine: block.startLine || parentSectionDoc.location?.startLine || 0,
        endLine: block.endLine || parentSectionDoc.location?.endLine || 0
      },
      sectionIndex: parentSectionDoc.sectionIndex,
      language,
      diagramType,
      metadata: {
        parentSectionTitle: parentSectionDoc.title || "",
        parentSectionId: parentSectionDoc.id || "",
        blockIndex
      },
      boost: this.getBlockBoost(blockType),
      tags: this.generateBlockTags(blockType, language)
    };
    return blockDoc;
  }
  generateBlockTitle(blockType, content) {
    const maxLength = 50;
    const firstLine = content.split(`
`)[0].trim();
    switch (blockType) {
      case "code":
        return `Code: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + "..." : firstLine}`;
      case "mermaid":
        return `Diagram: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + "..." : firstLine}`;
      case "heading":
        return `Heading: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + "..." : firstLine}`;
      case "table":
        return `Table: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + "..." : firstLine}`;
      case "list":
        return `List: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + "..." : firstLine}`;
      case "paragraph":
      default:
        return firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + "..." : firstLine;
    }
  }
  getBlockBoost(blockType) {
    switch (blockType) {
      case "heading":
        return 1.5;
      case "code":
        return 1.2;
      case "mermaid":
        return 1.1;
      case "table":
        return 1.1;
      default:
        return 1;
    }
  }
  generateBlockTags(blockType, language) {
    const tags = [blockType];
    if (language) {
      tags.push(language);
    }
    return tags;
  }
  generateContentHash(content) {
    let hash = 0;
    for (let i = 0;i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}
var init_DocumentIndexer = __esm(() => {
  init_dist();
});

// src/SearchEngine.ts
var exports_SearchEngine = {};
__export(exports_SearchEngine, {
  SearchEngine: () => SearchEngine
});

class SearchEngine {
  indexer;
  searchEngine;
  storage;
  fileSystem;
  indexKey;
  constructor(config, indexKey = "search-index") {
    this.storage = config.storage;
    this.fileSystem = config.fileSystem;
    this.searchEngine = config.searchEngine || SearchEngineFactory.create("flexsearch");
    this.indexer = new DocumentIndexer;
    this.indexKey = indexKey;
  }
  async initialize() {
    try {
      await this.searchEngine.initialize();
      const savedIndex = await this.storage.loadIndex(this.indexKey);
      if (savedIndex) {
        await this.searchEngine.importIndex(savedIndex);
      }
    } catch (error) {
      console.error("Failed to initialize search engine:", error);
    }
  }
  async indexFiles(options) {
    console.log("Indexing files...");
    const startTime = Date.now();
    console.log("Start time:", startTime);
    const errors = [];
    console.log("Errors:", errors);
    let filesIndexed = 0;
    console.log("Files indexed:", filesIndexed);
    let sectionsIndexed = 0;
    console.log("Sections indexed:", sectionsIndexed);
    let documentsIndexed = 0;
    console.log("Documents indexed:", documentsIndexed);
    try {
      console.log("Phase 1: Discovering files");
      if (options?.onProgress) {
        options.onProgress({
          phase: "discovering",
          filesProcessed: 0,
          totalFiles: 0,
          documentsIndexed: 0,
          percentage: 0
        });
      }
      const files = await this.fileSystem.findMarkdownFiles(options?.fileOptions);
      const totalFiles = files.length;
      console.log("Total files:", totalFiles);
      if (options?.onProgress) {
        options.onProgress({
          phase: "discovering",
          filesProcessed: 0,
          totalFiles,
          documentsIndexed: 0,
          percentage: 5,
          foundFiles: {
            list: files.slice(0, Math.min(10, files.length)).map((f) => f.path),
            total: totalFiles,
            hasMore: totalFiles > 10
          }
        });
      }
      console.log("[SearchEngine] \uD83C\uDFAF About to start new indexing session...");
      if (this.searchEngine.startNewIndexingSession) {
        this.searchEngine.startNewIndexingSession();
        console.log("[SearchEngine] \u2705 Successfully called startNewIndexingSession()");
      } else {
        console.log("[SearchEngine] \u26A0\uFE0F  WARNING: startNewIndexingSession method not available on search engine");
      }
      const batchSize = options?.batchSize || 10;
      const allDocuments = [];
      console.log("All documents:", allDocuments);
      for (let i = 0;i < files.length; i += batchSize) {
        const batch = files.slice(i, Math.min(i + batchSize, files.length));
        console.log("Batch:", batch);
        const batchDocuments = [];
        console.log("Batch documents:", batchDocuments);
        for (const file of batch) {
          try {
            if (options?.onProgress) {
              options.onProgress({
                phase: "parsing",
                currentFile: file.name,
                filesProcessed: filesIndexed,
                totalFiles,
                documentsIndexed,
                percentage: 10 + Math.round(filesIndexed / totalFiles * 35)
              });
            }
            console.log("Reading file content...");
            const content = await this.fileSystem.readFile(file.path);
            console.log("File content:", content);
            const documents = await this.indexer.parseAndIndex(content, file, options);
            console.log("Documents:", documents);
            const sectionCount = documents.filter((doc) => doc.type === "section").length;
            sectionsIndexed += sectionCount;
            documentsIndexed += documents.length;
            console.log("Documents indexed:", documentsIndexed);
            batchDocuments.push(...documents);
            filesIndexed++;
            console.log("Files indexed:", filesIndexed);
          } catch (error) {
            errors.push({
              file: file.path,
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            });
          }
        }
        console.log("Batch documents:", batchDocuments);
        if (batchDocuments.length > 0) {
          if (options?.onProgress) {
            options.onProgress({
              phase: "indexing",
              filesProcessed: filesIndexed,
              totalFiles,
              documentsIndexed,
              percentage: 45 + Math.round(filesIndexed / totalFiles * 35)
            });
          }
          console.log("Adding documents to search engine...");
          console.log(`[SearchEngine] About to add ${batchDocuments.length} documents to search engine (batch)`);
          console.log(`[SearchEngine] Total documents so far: ${allDocuments.length + batchDocuments.length}`);
          await this.searchEngine.addDocuments(batchDocuments);
          console.log("Documents added to search engine...");
          allDocuments.push(...batchDocuments);
          console.log("All documents:", allDocuments);
        }
      }
      console.log("All documents:", allDocuments);
      if (options?.onProgress) {
        options.onProgress({
          phase: "persisting",
          filesProcessed: filesIndexed,
          totalFiles,
          documentsIndexed,
          percentage: 85
        });
      }
      console.log("Exporting Index ...");
      const indexData = await this.searchEngine.exportIndex();
      const stats = {
        totalFiles: filesIndexed,
        totalSections: sectionsIndexed,
        totalDocuments: documentsIndexed,
        indexedAt: new Date().toISOString()
      };
      console.log("Saving index...");
      await this.storage.saveIndex(this.indexKey, {
        data: indexData,
        metadata: {
          version: "1.0.0",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats
        }
      });
      console.log("Index saved...");
      if (options?.onProgress) {
        options.onProgress({
          phase: "persisting",
          filesProcessed: filesIndexed,
          totalFiles,
          documentsIndexed,
          percentage: 100
        });
      }
      console.log("Index saved...");
      return {
        filesIndexed,
        sectionsIndexed,
        documentsIndexed,
        errors: errors.length > 0 ? errors : undefined,
        duration: Date.now() - startTime
      };
    } catch (error) {
      throw new Error(`Indexing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async search(query, options) {
    console.log("[SearchEngine] Search called with query:", query, "options:", options);
    if (!query || query.trim().length === 0) {
      console.log("[SearchEngine] Empty query, returning empty array");
      return [];
    }
    console.log("[SearchEngine] Delegating to search engine adapter...");
    const results = await this.searchEngine.search(query.trim(), options);
    console.log("[SearchEngine] Search engine returned:", results.length, "results");
    console.log("[SearchEngine] Sample results:", results.slice(0, 2).map((r) => ({ id: r.id, title: r.title, type: r.type })));
    return results;
  }
  async getStats() {
    const metadata = await this.storage.getIndexMetadata(this.indexKey);
    return metadata?.stats || null;
  }
  async hasIndex() {
    return await this.storage.hasIndex(this.indexKey);
  }
  async clearIndex() {
    await this.searchEngine.clear();
    await this.storage.deleteIndex(this.indexKey);
  }
  async updateFiles(filePaths, options) {
    const startTime = Date.now();
    const errors = [];
    let filesIndexed = 0;
    let sectionsIndexed = 0;
    let documentsIndexed = 0;
    try {
      for (const filePath of filePaths) {
        try {
          const fileInfo = await this.fileSystem.getFileInfo(filePath);
          const fileUri = fileInfo.uri || fileInfo.path;
          const oldDocsToRemove = [];
          const allResults = await this.searchEngine.search("*", { limit: 1e4 });
          allResults.forEach((result) => {
            if (result.fileUri === fileUri || result.filePath === filePath) {
              oldDocsToRemove.push(result.id);
            }
          });
          if (oldDocsToRemove.length > 0) {
            await this.searchEngine.removeDocuments(oldDocsToRemove);
          }
          const content = await this.fileSystem.readFile(filePath);
          const documents = await this.indexer.parseAndIndex(content, fileInfo, options);
          if (documents.length > 0) {
            await this.searchEngine.addDocuments(documents);
            const sectionCount = documents.filter((doc) => doc.type === "section").length;
            sectionsIndexed += sectionCount;
            documentsIndexed += documents.length;
          }
          filesIndexed++;
        } catch (error) {
          errors.push({
            file: filePath,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          });
        }
      }
      const indexData = await this.searchEngine.exportIndex();
      const existingMetadata = await this.storage.getIndexMetadata(this.indexKey);
      await this.storage.saveIndex(this.indexKey, {
        data: indexData,
        metadata: {
          version: existingMetadata?.version || "1.0.0",
          createdAt: existingMetadata?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: {
            ...existingMetadata?.stats,
            indexedAt: new Date().toISOString()
          }
        }
      });
      return {
        filesIndexed,
        sectionsIndexed,
        documentsIndexed,
        errors: errors.length > 0 ? errors : undefined,
        duration: Date.now() - startTime
      };
    } catch (error) {
      throw new Error(`Update failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async indexDocuments(documents, options) {
    const startTime = Date.now();
    const errors = [];
    try {
      if (options?.clearBefore) {
        await this.clearIndex();
      }
      if (this.searchEngine.startNewIndexingSession) {
        this.searchEngine.startNewIndexingSession();
      }
      if (options?.onProgress) {
        options.onProgress({
          phase: "indexing",
          filesProcessed: 0,
          totalFiles: documents.length,
          documentsIndexed: 0,
          percentage: 50
        });
      }
      await this.searchEngine.addDocuments(documents);
      await this.saveIndex();
      if (options?.onProgress) {
        options.onProgress({
          phase: "complete",
          filesProcessed: documents.length,
          totalFiles: documents.length,
          documentsIndexed: documents.length,
          percentage: 100
        });
      }
      return {
        filesIndexed: 0,
        sectionsIndexed: documents.filter((d) => d.type === "section").length,
        documentsIndexed: documents.length,
        errors: errors.length > 0 ? errors : undefined,
        duration: Date.now() - startTime
      };
    } catch (error) {
      throw new Error(`Document indexing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async saveIndex() {
    try {
      const indexData = await this.searchEngine.exportIndex();
      await this.storage.saveIndex(this.indexKey, {
        data: indexData,
        metadata: {
          version: "1.0.0",
          updatedAt: new Date().toISOString(),
          stats: await this.getStats()
        }
      });
    } catch (error) {
      throw new Error(`Failed to save index: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  getSearchAdapter() {
    return this.searchEngine;
  }
  getStorageAdapter() {
    return this.storage;
  }
}
var init_SearchEngine = __esm(() => {
  init_SearchEngineFactory();
  init_DocumentIndexer();
});

// src/adapters/constants.ts
function mergeExclusions(userExclusions) {
  const userExcludes = userExclusions || [];
  return [...DEFAULT_FILE_EXCLUSIONS, ...userExcludes];
}
function createExclusionPattern(userExclusions) {
  const allExcludes = mergeExclusions(userExclusions);
  return allExcludes.length === 1 ? allExcludes[0] : `{${allExcludes.join(",")}}`;
}
function getDefaultIncludePatterns() {
  return ["**/*.{md,markdown}"];
}
function createIncludePattern(userIncludes) {
  const includePatterns = userIncludes || getDefaultIncludePatterns();
  return includePatterns.length === 1 ? includePatterns[0] : `{${includePatterns.join(",")}}`;
}
var DEFAULT_FILE_EXCLUSIONS;
var init_constants = __esm(() => {
  DEFAULT_FILE_EXCLUSIONS = [
    "**/node_modules/**",
    "**/vendor/**",
    "**/venv/**",
    "**/env/**",
    "**/.env/**",
    "**/dist/**",
    "**/build/**",
    "**/out/**",
    "**/target/**",
    "**/public/build/**",
    "**/public/dist/**",
    "**/.next/**",
    "**/.nuxt/**",
    "**/.cache/**",
    "**/coverage/**",
    "**/tmp/**",
    "**/temp/**",
    "**/.git/**",
    "**/.vscode/**",
    "**/.idea/**",
    "**/__pycache__/**",
    "**/.pytest_cache/**",
    "**/logs/**",
    "**/*.log",
    "**/package-lock.json",
    "**/yarn.lock",
    "**/pnpm-lock.yaml"
  ];
});

// src/adapters/implementations/NodeFileSystemAdapter.ts
var {Glob } = globalThis.Bun;
import { join, relative, basename } from "path";
import { stat } from "fs/promises";

class NodeFileSystemAdapter {
  rootPath;
  constructor(rootPath = process.cwd()) {
    this.rootPath = rootPath;
  }
  async findMarkdownFiles(options) {
    const { include = ["**/*.md"], exclude = [] } = options || {};
    const exclusions = mergeExclusions(exclude);
    const files = [];
    for (const pattern of include) {
      const glob = new Glob(pattern);
      for await (const file of glob.scan({
        cwd: this.rootPath,
        onlyFiles: true
      })) {
        const shouldExclude = exclusions.some((excludePattern) => {
          if (excludePattern.includes("*")) {
            const regex = new RegExp(excludePattern.replace(/\./g, "\\.").replace(/\*/g, ".*").replace(/\?/g, "."));
            return regex.test(file);
          }
          return file.includes(excludePattern);
        });
        if (!shouldExclude) {
          const fullPath = join(this.rootPath, file);
          const stats = await stat(fullPath);
          files.push({
            path: fullPath,
            name: basename(file),
            size: stats.size,
            modifiedAt: stats.mtime,
            uri: `file://${fullPath}`
          });
        }
      }
    }
    return files;
  }
  async readFile(path) {
    if (typeof Bun !== "undefined" && Bun.file) {
      const file = Bun.file(path);
      return await file.text();
    }
    const { readFile } = await import("fs/promises");
    return await readFile(path, "utf-8");
  }
  getRelativePath(path) {
    return relative(this.rootPath, path);
  }
  async getFileInfo(path) {
    const stats = await stat(path);
    return {
      path,
      name: basename(path),
      size: stats.size,
      modifiedAt: stats.mtime,
      uri: `file://${path}`
    };
  }
}
var init_NodeFileSystemAdapter = __esm(() => {
  init_constants();
});

// src/adapters/implementations/NodeStorageAdapter.ts
import { join as join2 } from "path";
import { mkdir } from "fs/promises";

class NodeStorageAdapter {
  storagePath;
  constructor(storagePath = ".search-index") {
    this.storagePath = storagePath;
    this.ensureStorageDirectory();
  }
  async ensureStorageDirectory() {
    try {
      await mkdir(this.storagePath, { recursive: true });
    } catch (error) {}
  }
  getIndexPath(key) {
    return join2(this.storagePath, `${key}.json`);
  }
  async saveIndex(key, data) {
    await this.ensureStorageDirectory();
    const filePath = this.getIndexPath(key);
    if (typeof Bun !== "undefined" && Bun.write) {
      await Bun.write(filePath, JSON.stringify(data, null, 2));
    } else {
      const { writeFile } = await import("fs/promises");
      await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    }
  }
  async loadIndex(key) {
    try {
      const filePath = this.getIndexPath(key);
      if (typeof Bun !== "undefined" && Bun.file) {
        const file = Bun.file(filePath);
        if (await file.exists()) {
          const content = await file.text();
          return JSON.parse(content);
        }
        return null;
      }
      const { readFile } = await import("fs/promises");
      try {
        const content = await readFile(filePath, "utf-8");
        return JSON.parse(content);
      } catch (error) {
        if (error.code === "ENOENT") {
          return null;
        }
        throw error;
      }
    } catch (error) {
      console.error("Failed to load index:", error);
      return null;
    }
  }
  async deleteIndex(key) {
    try {
      const filePath = this.getIndexPath(key);
      const { unlink } = await import("fs/promises");
      await unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
  async hasIndex(key) {
    try {
      const filePath = this.getIndexPath(key);
      if (typeof Bun !== "undefined" && Bun.file) {
        const file = Bun.file(filePath);
        return await file.exists();
      }
      const { access } = await import("fs/promises");
      try {
        await access(filePath);
        return true;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  }
  async getIndexMetadata(key) {
    const data = await this.loadIndex(key);
    if (!data || typeof data !== "object") {
      return null;
    }
    const indexData = data;
    if (indexData.metadata) {
      return indexData.metadata;
    }
    if (indexData.version || indexData.createdAt || indexData.stats) {
      return {
        version: indexData.version || "1.0.0",
        createdAt: indexData.createdAt || new Date().toISOString(),
        updatedAt: indexData.updatedAt || new Date().toISOString(),
        stats: indexData.stats || {
          totalFiles: 0,
          totalDocuments: 0,
          indexedAt: new Date().toISOString()
        }
      };
    }
    return null;
  }
}
var init_NodeStorageAdapter = () => {};

// src/adapters/implementations/vscode/VSCodeStorageAdapter.ts
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

class VSCodeStorageAdapter {
  context;
  storagePrefix;
  saveTimeout;
  storagePath = null;
  constructor(context, storagePrefix = "search_") {
    this.context = context;
    this.storagePrefix = storagePrefix;
    this.initializeStoragePath();
  }
  async initializeStoragePath() {
    const storageUri = this.context.storageUri || this.context.globalStorageUri;
    if (storageUri && storageUri.fsPath) {
      this.storagePath = path.join(storageUri.fsPath, "search-index");
      try {
        if (!await exists2(this.storagePath)) {
          await mkdir3(this.storagePath, { recursive: true });
        }
      } catch (error) {
        console.error("[VSCodeStorageAdapter] Failed to create storage directory:", error);
        this.storagePath = null;
      }
    }
  }
  getStorageKey(key) {
    return `${this.storagePrefix}${key}`;
  }
  getIndexFilePath(key) {
    if (!this.storagePath)
      return null;
    return path.join(this.storagePath, `${key}.json`);
  }
  async saveIndex(key, data) {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    return new Promise((resolve, reject) => {
      this.saveTimeout = setTimeout(async () => {
        try {
          const filePath = this.getIndexFilePath(key);
          if (!filePath || !this.storagePath) {
            throw new Error("Storage path not available - cannot save index");
          }
          if (!await exists2(this.storagePath)) {
            await mkdir3(this.storagePath, { recursive: true });
          }
          const jsonData = JSON.stringify(data);
          await writeFile2(filePath, jsonData, "utf8");
          const metadata = {
            storedInFile: true,
            filePath,
            size: jsonData.length,
            timestamp: new Date().toISOString()
          };
          if (data && data.metadata) {
            metadata.indexMetadata = data.metadata;
          }
          const storageKey = this.getStorageKey(key);
          await this.context.workspaceState.update(storageKey, metadata);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }
  async loadIndex(key) {
    try {
      const storageKey = this.getStorageKey(key);
      const metadata = this.context.workspaceState.get(storageKey);
      if (!metadata) {
        return null;
      }
      if (!metadata.storedInFile || !metadata.filePath) {
        await this.context.workspaceState.update(storageKey, undefined);
        return null;
      }
      const filePath = metadata.filePath;
      if (await exists2(filePath)) {
        const fileContent = await readFile2(filePath, "utf8");
        return JSON.parse(fileContent);
      } else {
        await this.context.workspaceState.update(storageKey, undefined);
        return null;
      }
    } catch (error) {
      console.error("[VSCodeStorageAdapter] Failed to load index:", error);
      return null;
    }
  }
  async deleteIndex(key) {
    const storageKey = this.getStorageKey(key);
    const metadata = this.context.workspaceState.get(storageKey);
    if (metadata && metadata.storedInFile && metadata.filePath) {
      const filePath = metadata.filePath;
      try {
        if (await exists2(filePath)) {
          await unlink2(filePath);
        }
      } catch (error) {
        console.error("[VSCodeStorageAdapter] Failed to delete index file:", error);
      }
    }
    await this.context.workspaceState.update(storageKey, undefined);
  }
  async hasIndex(key) {
    const storageKey = this.getStorageKey(key);
    const metadata = this.context.workspaceState.get(storageKey);
    if (!metadata) {
      return false;
    }
    if (metadata.storedInFile && metadata.filePath) {
      return await exists2(metadata.filePath);
    }
    return false;
  }
  async getIndexMetadata(key) {
    const storageKey = this.getStorageKey(key);
    const metadata = this.context.workspaceState.get(storageKey);
    if (metadata && metadata.indexMetadata) {
      return metadata.indexMetadata;
    }
    const data = await this.loadIndex(key);
    if (data && data.metadata) {
      return data.metadata;
    }
    return null;
  }
  async getAllKeys() {
    const allKeys = this.context.workspaceState.keys();
    return allKeys.filter((key) => key.startsWith(this.storagePrefix)).map((key) => key.substring(this.storagePrefix.length));
  }
  async clearAll() {
    const searchKeys = await this.getAllKeys();
    for (const key of searchKeys) {
      await this.deleteIndex(key);
    }
  }
  dispose() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = undefined;
    }
  }
}
var writeFile2, readFile2, unlink2, exists2, mkdir3;
var init_VSCodeStorageAdapter = __esm(() => {
  writeFile2 = promisify(fs.writeFile);
  readFile2 = promisify(fs.readFile);
  unlink2 = promisify(fs.unlink);
  exists2 = promisify(fs.exists);
  mkdir3 = promisify(fs.mkdir);
});

// src/adapters/implementations/vscode/VSCodeFileSystemAdapter.ts
class VSCodeFileSystemAdapter {
  vscode;
  constructor(vscode) {
    this.vscode = vscode;
  }
  async findMarkdownFiles(options) {
    const includePattern = createIncludePattern(options?.include);
    const excludePattern = createExclusionPattern(options?.exclude);
    const files = await this.vscode.workspace.findFiles(includePattern, excludePattern, options?.maxDepth ? undefined : 1e4);
    const fileInfos = [];
    for (const uri of files) {
      try {
        const stat2 = await this.vscode.workspace.fs.stat(uri);
        const path2 = uri.fsPath || uri.path;
        const name = path2.split(/[/\\]/).pop() || "";
        fileInfos.push({
          path: path2,
          name,
          size: stat2.size,
          modifiedAt: new Date(stat2.mtime),
          uri: uri.toString()
        });
      } catch (error) {
        console.warn(`Failed to stat file ${uri.toString()}:`, error);
      }
    }
    return fileInfos;
  }
  async readFile(path2) {
    try {
      const uri = path2.startsWith("file://") ? this.vscode.Uri.parse(path2) : this.vscode.Uri.file(path2);
      const document = await this.vscode.workspace.openTextDocument(uri);
      return document.getText();
    } catch (error) {
      throw new Error(`Failed to read file ${path2}: ${error}`);
    }
  }
  watchFiles(pattern, callback) {
    const watcher = this.vscode.workspace.createFileSystemWatcher(pattern);
    const disposables = [];
    disposables.push(watcher.onDidCreate((uri) => {
      callback({
        type: "created",
        path: uri.fsPath || uri.path
      });
    }));
    disposables.push(watcher.onDidChange((uri) => {
      callback({
        type: "changed",
        path: uri.fsPath || uri.path
      });
    }));
    disposables.push(watcher.onDidDelete((uri) => {
      callback({
        type: "deleted",
        path: uri.fsPath || uri.path
      });
    }));
    return {
      dispose: () => {
        watcher.dispose();
        disposables.forEach((d) => d.dispose());
      }
    };
  }
  getRelativePath(path2) {
    return this.vscode.workspace.asRelativePath(path2);
  }
  async getFileInfo(path2) {
    try {
      const uri = path2.startsWith("file://") ? this.vscode.Uri.parse(path2) : this.vscode.Uri.file(path2);
      const stat2 = await this.vscode.workspace.fs.stat(uri);
      const name = path2.split(/[/\\]/).pop() || "";
      return {
        path: path2,
        name,
        size: stat2.size,
        modifiedAt: new Date(stat2.mtime),
        uri: uri.toString()
      };
    } catch (error) {
      throw new Error(`Failed to get file info for ${path2}: ${error}`);
    }
  }
  async exists(path2) {
    try {
      await this.getFileInfo(path2);
      return true;
    } catch {
      return false;
    }
  }
  getWorkspaceRoots() {
    if (!this.vscode.workspace.workspaceFolders) {
      return [];
    }
    return this.vscode.workspace.workspaceFolders.map((folder) => folder.uri.fsPath || folder.uri.path);
  }
}
var init_VSCodeFileSystemAdapter = __esm(() => {
  init_constants();
});

// src/adapters/implementations/vscode/index.ts
var init_vscode = __esm(() => {
  init_VSCodeStorageAdapter();
  init_VSCodeFileSystemAdapter();
});

// src/adapters/implementations/index.ts
var exports_implementations = {};
__export(exports_implementations, {
  VSCodeStorageAdapter: () => VSCodeStorageAdapter,
  VSCodeFileSystemAdapter: () => VSCodeFileSystemAdapter,
  NodeStorageAdapter: () => NodeStorageAdapter,
  NodeFileSystemAdapter: () => NodeFileSystemAdapter,
  FlexSearchAdapter: () => FlexSearchAdapter
});
var init_implementations = __esm(() => {
  init_FlexSearchAdapter();
  init_NodeFileSystemAdapter();
  init_NodeStorageAdapter();
  init_vscode();
});

// src/index.ts
init_SearchEngine();
init_DocumentIndexer();
init_SearchEngineFactory();

// src/adapters/index.ts
init_constants();

// src/index.ts
init_implementations();

// src/utils/searchHighlighting.ts
function highlightSearchMatches(content, matches) {
  if (!matches.length)
    return content;
  const sortedMatches = [...matches].sort((a, b) => b.position.start - a.position.start);
  const nonOverlappingMatches = removeOverlappingMatches(sortedMatches);
  let highlightedContent = content;
  nonOverlappingMatches.forEach((match) => {
    const before = highlightedContent.substring(0, match.position.start);
    const after = highlightedContent.substring(match.position.end);
    const highlighted = `<mark class="search-highlight search-term-${sanitizeClassName(match.searchTerm)}">${match.matchedText}</mark>`;
    highlightedContent = before + highlighted + after;
  });
  return highlightedContent;
}
function removeOverlappingMatches(matches) {
  const nonOverlapping = [];
  const usedRanges = [];
  for (const match of matches) {
    const overlaps = usedRanges.some((range) => match.position.start >= range.start && match.position.start < range.end || match.position.end > range.start && match.position.end <= range.end || match.position.start <= range.start && match.position.end >= range.end);
    if (!overlaps) {
      nonOverlapping.push(match);
      usedRanges.push({
        start: match.position.start,
        end: match.position.end
      });
    }
  }
  return nonOverlapping;
}
function sanitizeClassName(term) {
  return term.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/^-+|-+$/g, "").substring(0, 20);
}
function generateMatchPreview(content, match, contextLength = 50) {
  const start = Math.max(0, match.position.start - contextLength);
  const end = Math.min(content.length, match.position.end + contextLength);
  let before = content.substring(start, match.position.start);
  let after = content.substring(match.position.end, end);
  before = before.replace(/^\s+/, "");
  after = after.replace(/\s+$/, "");
  if (start > 0)
    before = "..." + before;
  if (end < content.length)
    after = after + "...";
  return {
    before,
    match: match.matchedText,
    after,
    line: match.position.line
  };
}
function extractPlainText(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, "[code]").replace(/`[^`]+`/g, "[code]").replace(/!\[.*?\]\(.*?\)/g, "[image]").replace(/\[([^\]]+)\]\(.*?\)/g, "$1").replace(/[*_~#>`]/g, "").replace(/\s+/g, " ").trim();
}
function highlightCodeMatches(code, _language, matches) {
  let highlightedCode = code;
  const sortedMatches = [...matches].sort((a, b) => b.position.start - a.position.start);
  sortedMatches.forEach((match) => {
    const before = highlightedCode.substring(0, match.position.start);
    const after = highlightedCode.substring(match.position.end);
    const highlighted = `<span class="search-match-in-code">${match.matchedText}</span>`;
    highlightedCode = before + highlighted + after;
  });
  return highlightedCode;
}
function getSearchHighlightStyles(isDarkTheme) {
  const colors = isDarkTheme ? {
    highlightBg: "#594300",
    highlightBorder: "rgba(255, 235, 59, 0.5)",
    focusBorder: "#007ACC",
    term1: "#594300",
    term2: "#003d6b",
    term3: "#2e5033",
    term4: "#5a2e00"
  } : {
    highlightBg: "#ffeb3b",
    highlightBorder: "rgba(255, 235, 59, 0.5)",
    focusBorder: "#0066B8",
    term1: "#ffeb3b",
    term2: "#64b5f6",
    term3: "#81c784",
    term4: "#ff8a65"
  };
  return `
    .search-highlight {
      background-color: ${colors.highlightBg};
      color: inherit;
      padding: 0 2px;
      border-radius: 2px;
      font-weight: 600;
      box-shadow: 0 0 0 1px ${colors.highlightBorder};
    }
    
    .search-match-in-code {
      background-color: ${colors.highlightBorder};
      box-shadow: 0 0 0 1px ${colors.highlightBg};
      border-radius: 2px;
    }
    
    .search-result.highlighted {
      box-shadow: 0 0 0 2px ${colors.focusBorder};
    }
    
    /* Different colors for different search terms */
    .search-term-1 { background-color: ${colors.term1}; }
    .search-term-2 { background-color: ${colors.term2}; }
    .search-term-3 { background-color: ${colors.term3}; }
    .search-term-4 { background-color: ${colors.term4}; }
  `;
}
// src/index.ts
function createSearchEngine(options) {
  const {
    rootPath = process.cwd(),
    storagePath = ".search-index",
    indexKey = "search-index"
  } = options || {};
  const { NodeFileSystemAdapter: NodeFileSystemAdapter2, NodeStorageAdapter: NodeStorageAdapter2 } = (init_implementations(), __toCommonJS(exports_implementations));
  const { SearchEngine: SearchEngine2 } = (init_SearchEngine(), __toCommonJS(exports_SearchEngine));
  const { SearchEngineFactory: SearchEngineFactory2 } = (init_SearchEngineFactory(), __toCommonJS(exports_SearchEngineFactory));
  return new SearchEngine2({
    fileSystem: new NodeFileSystemAdapter2(rootPath),
    storage: new NodeStorageAdapter2(storagePath),
    searchEngine: SearchEngineFactory2.create("flexsearch")
  }, indexKey);
}
var VERSION = "1.0.0";
export {
  mergeExclusions,
  highlightSearchMatches,
  highlightCodeMatches,
  getSearchHighlightStyles,
  generateMatchPreview,
  extractPlainText,
  createSearchEngine,
  VSCodeStorageAdapter,
  VSCodeFileSystemAdapter,
  VERSION,
  SearchEngineFactory,
  SearchEngine,
  NodeStorageAdapter,
  NodeFileSystemAdapter,
  FlexSearchAdapter,
  DocumentIndexer,
  DEFAULT_FILE_EXCLUSIONS
};
