var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
}) : x2)(function(x2) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@neondatabase/serverless/index.mjs
function Ge(r) {
  let e = 1779033703, t = 3144134277, n = 1013904242, i = 2773480762, s = 1359893119, o = 2600822924, u = 528734635, c = 1541459225, h = 0, l = 0, d = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ], b = a(
    (A, w) => A >>> w | A << 32 - w,
    "rrot"
  ), C = new Uint32Array(64), B = new Uint8Array(64), W = a(() => {
    for (let R = 0, G = 0; R < 16; R++, G += 4) C[R] = B[G] << 24 | B[G + 1] << 16 | B[G + 2] << 8 | B[G + 3];
    for (let R = 16; R < 64; R++) {
      let G = b(C[R - 15], 7) ^ b(C[R - 15], 18) ^ C[R - 15] >>> 3, he = b(C[R - 2], 17) ^ b(C[R - 2], 19) ^ C[R - 2] >>> 10;
      C[R] = C[R - 16] + G + C[R - 7] + he | 0;
    }
    let A = e, w = t, P = n, V = i, k = s, j = o, ce = u, ee = c;
    for (let R = 0; R < 64; R++) {
      let G = b(
        k,
        6
      ) ^ b(k, 11) ^ b(k, 25), he = k & j ^ ~k & ce, ye = ee + G + he + d[R] + C[R] | 0, xe = b(A, 2) ^ b(A, 13) ^ b(A, 22), me = A & w ^ A & P ^ w & P, se = xe + me | 0;
      ee = ce, ce = j, j = k, k = V + ye | 0, V = P, P = w, w = A, A = ye + se | 0;
    }
    e = e + A | 0, t = t + w | 0, n = n + P | 0, i = i + V | 0, s = s + k | 0, o = o + j | 0, u = u + ce | 0, c = c + ee | 0, l = 0;
  }, "process"), X = a((A) => {
    typeof A == "string" && (A = new TextEncoder().encode(A));
    for (let w = 0; w < A.length; w++) B[l++] = A[w], l === 64 && W();
    h += A.length;
  }, "add"), de = a(() => {
    if (B[l++] = 128, l == 64 && W(), l + 8 > 64) {
      for (; l < 64; ) B[l++] = 0;
      W();
    }
    for (; l < 58; ) B[l++] = 0;
    let A = h * 8;
    B[l++] = A / 1099511627776 & 255, B[l++] = A / 4294967296 & 255, B[l++] = A >>> 24, B[l++] = A >>> 16 & 255, B[l++] = A >>> 8 & 255, B[l++] = A & 255, W();
    let w = new Uint8Array(32);
    return w[0] = e >>> 24, w[1] = e >>> 16 & 255, w[2] = e >>> 8 & 255, w[3] = e & 255, w[4] = t >>> 24, w[5] = t >>> 16 & 255, w[6] = t >>> 8 & 255, w[7] = t & 255, w[8] = n >>> 24, w[9] = n >>> 16 & 255, w[10] = n >>> 8 & 255, w[11] = n & 255, w[12] = i >>> 24, w[13] = i >>> 16 & 255, w[14] = i >>> 8 & 255, w[15] = i & 255, w[16] = s >>> 24, w[17] = s >>> 16 & 255, w[18] = s >>> 8 & 255, w[19] = s & 255, w[20] = o >>> 24, w[21] = o >>> 16 & 255, w[22] = o >>> 8 & 255, w[23] = o & 255, w[24] = u >>> 24, w[25] = u >>> 16 & 255, w[26] = u >>> 8 & 255, w[27] = u & 255, w[28] = c >>> 24, w[29] = c >>> 16 & 255, w[30] = c >>> 8 & 255, w[31] = c & 255, w;
  }, "digest");
  return r === void 0 ? { add: X, digest: de } : (X(r), de());
}
function Vo(r) {
  return g.getRandomValues(y.alloc(r));
}
function Ko(r) {
  if (r === "sha256") return { update: a(
    function(e) {
      return { digest: a(function() {
        return y.from(Ge(e));
      }, "digest") };
    },
    "update"
  ) };
  if (r === "md5") return { update: a(function(e) {
    return { digest: a(function() {
      return typeof e == "string" ? $e.hashStr(e) : $e.hashByteArray(e);
    }, "digest") };
  }, "update") };
  throw new Error(
    `Hash type '${r}' not supported`
  );
}
function zo(r, e) {
  if (r !== "sha256") throw new Error(
    `Only sha256 is supported (requested: '${r}')`
  );
  return { update: a(function(t) {
    return {
      digest: a(function() {
        typeof e == "string" && (e = new TextEncoder().encode(e)), typeof t == "string" && (t = new TextEncoder().encode(t));
        let n = e.length;
        if (n > 64) e = Ge(e);
        else if (n < 64) {
          let c = new Uint8Array(64);
          c.set(e), e = c;
        }
        let i = new Uint8Array(64), s = new Uint8Array(
          64
        );
        for (let c = 0; c < 64; c++) i[c] = 54 ^ e[c], s[c] = 92 ^ e[c];
        let o = new Uint8Array(t.length + 64);
        o.set(i, 0), o.set(t, 64);
        let u = new Uint8Array(96);
        return u.set(s, 0), u.set(
          Ge(o),
          64
        ), y.from(Ge(u));
      }, "digest")
    };
  }, "update") };
}
function ou(...r) {
  return r.join("/");
}
function au(r, e) {
  e(new Error("No filesystem"));
}
function fr(r, e = false) {
  let { protocol: t } = new URL(r), n = "http:" + r.substring(t.length), {
    username: i,
    password: s,
    host: o,
    hostname: u,
    port: c,
    pathname: h,
    search: l,
    searchParams: d,
    hash: b
  } = new URL(n);
  s = decodeURIComponent(s), i = decodeURIComponent(
    i
  ), h = decodeURIComponent(h);
  let C = i + ":" + s, B = e ? Object.fromEntries(d.entries()) : l;
  return {
    href: r,
    protocol: t,
    auth: C,
    username: i,
    password: s,
    host: o,
    hostname: u,
    port: c,
    pathname: h,
    search: l,
    query: B,
    hash: b
  };
}
function Fu(r) {
  return 0;
}
function lc({ socket: r, servername: e }) {
  return r.startTls(e), r;
}
function Ys(r, {
  arrayMode: e,
  fullResults: t,
  fetchOptions: n,
  isolationLevel: i,
  readOnly: s,
  deferrable: o,
  queryCallback: u,
  resultCallback: c
} = {}) {
  if (!r) throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");
  let h;
  try {
    h = fr(r);
  } catch {
    throw new Error("Database connection string provided to `neon()` is not a valid URL. Connection string: " + String(r));
  }
  let {
    protocol: l,
    username: d,
    password: b,
    hostname: C,
    port: B,
    pathname: W
  } = h;
  if (l !== "postgres:" && l !== "postgresql:" || !d || !b || !C || !W) throw new Error("Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value");
  function X(A, ...w) {
    let P, V;
    if (typeof A == "string") P = A, V = w[1], w = w[0] ?? [];
    else {
      P = "";
      for (let j = 0; j < A.length; j++)
        P += A[j], j < w.length && (P += "$" + (j + 1));
    }
    w = w.map((j) => (0, Ks.prepareValue)(j));
    let k = {
      query: P,
      params: w
    };
    return u && u(k), Qc(de, k, V);
  }
  a(X, "resolve"), X.transaction = async (A, w) => {
    if (typeof A == "function" && (A = A(X)), !Array.isArray(A)) throw new Error($s);
    A.forEach((k) => {
      if (k[Symbol.toStringTag] !== "NeonQueryPromise") throw new Error($s);
    });
    let P = A.map((k) => k.parameterizedQuery), V = A.map((k) => k.opts ?? {});
    return de(P, V, w);
  };
  async function de(A, w, P) {
    let {
      fetchEndpoint: V,
      fetchFunction: k
    } = _e, j = typeof V == "function" ? V(C, B) : V, ce = Array.isArray(A) ? { queries: A } : A, ee = n ?? {}, R = e ?? false, G = t ?? false, he = i, ye = s, xe = o;
    P !== void 0 && (P.fetchOptions !== void 0 && (ee = { ...ee, ...P.fetchOptions }), P.arrayMode !== void 0 && (R = P.arrayMode), P.fullResults !== void 0 && (G = P.fullResults), P.isolationLevel !== void 0 && (he = P.isolationLevel), P.readOnly !== void 0 && (ye = P.readOnly), P.deferrable !== void 0 && (xe = P.deferrable)), w !== void 0 && !Array.isArray(w) && w.fetchOptions !== void 0 && (ee = { ...ee, ...w.fetchOptions });
    let me = { "Neon-Connection-String": r, "Neon-Raw-Text-Output": "true", "Neon-Array-Mode": "true" };
    Array.isArray(A) && (he !== void 0 && (me["Neon-Batch-Isolation-Level"] = he), ye !== void 0 && (me["Neon-Batch-Read-Only"] = String(ye)), xe !== void 0 && (me["Neon-Batch-Deferrable"] = String(
      xe
    )));
    let se;
    try {
      se = await (k ?? fetch)(j, {
        method: "POST",
        body: JSON.stringify(ce),
        headers: me,
        ...ee
      });
    } catch (oe) {
      let U = new Ae(`Error connecting to database: ${oe.message}`);
      throw U.sourceError = oe, U;
    }
    if (se.ok) {
      let oe = await se.json();
      if (Array.isArray(A)) {
        let U = oe.results;
        if (!Array.isArray(U)) throw new Ae("Neon internal error: unexpected result format");
        return U.map((K, le) => {
          let It = w[le] ?? {}, Xs = It.arrayMode ?? R, eo = It.fullResults ?? G;
          return Vs(K, {
            arrayMode: Xs,
            fullResults: eo,
            parameterizedQuery: A[le],
            resultCallback: c,
            types: It.types
          });
        });
      } else {
        let U = w ?? {}, K = U.arrayMode ?? R, le = U.fullResults ?? G;
        return Vs(
          oe,
          { arrayMode: K, fullResults: le, parameterizedQuery: A, resultCallback: c, types: U.types }
        );
      }
    } else {
      let { status: oe } = se;
      if (oe === 400) {
        let U = await se.json(), K = new Ae(U.message);
        for (let le of qc)
          K[le] = U[le] ?? void 0;
        throw K;
      } else {
        let U = await se.text();
        throw new Ae(`Server error (HTTP status ${oe}): ${U}`);
      }
    }
  }
  return a(de, "execute"), X;
}
function Qc(r, e, t) {
  return { [Symbol.toStringTag]: "NeonQueryPromise", parameterizedQuery: e, opts: t, then: a(
    (n, i) => r(e, t).then(n, i),
    "then"
  ), catch: a((n) => r(e, t).catch(n), "catch"), finally: a((n) => r(
    e,
    t
  ).finally(n), "finally") };
}
function Vs(r, {
  arrayMode: e,
  fullResults: t,
  parameterizedQuery: n,
  resultCallback: i,
  types: s
}) {
  let o = new zs.default(
    s
  ), u = r.fields.map((l) => l.name), c = r.fields.map((l) => o.getTypeParser(l.dataTypeID)), h = e === true ? r.rows.map((l) => l.map((d, b) => d === null ? null : c[b](d))) : r.rows.map((l) => Object.fromEntries(
    l.map((d, b) => [u[b], d === null ? null : c[b](d)])
  ));
  return i && i(n, r, h, { arrayMode: e, fullResults: t }), t ? (r.viaNeonFetch = true, r.rowAsArray = e, r.rows = h, r._parsers = c, r._types = o, r) : h;
}
function Wc(r, e) {
  if (e) return {
    callback: e,
    result: void 0
  };
  let t, n, i = a(function(o, u) {
    o ? t(o) : n(u);
  }, "cb"), s = new r(function(o, u) {
    n = o, t = u;
  });
  return { callback: i, result: s };
}
var to, Ce, ro, no, io, so, oo, a, z, I, ie, An, Te, N, _, In, Pn, $n, S, x, v, g, y, m, p, we, je, $o, He, ni, O, $e, ii, qt, Qt, jt, Ht, ci, li, di, mi, Ei, Ai, Bi, Ri, Je, Xe, et, qi, tr, rr, nr, ir, sr, uu, or, Qi, ur, ar, Wi, $i, zi, Zi, mt, Xi, Tu, es, ts, pr, ns, gt, cs, ps, ys, ds, Mu, E, _e, wt, Yr, ms, ws, bs, vs, an, Es, _s, hn, Bs, Ms, Ds, Cc, ks, Us, qs, Hs, bn, Ct, Tt, Ks, zs, xn, Ae, $s, qc, Js, Qe, En, vn, _n, Zs, export_ClientBase, export_Connection, export_DatabaseError, export_Query, export_defaults, export_types;
var init_serverless = __esm({
  "node_modules/@neondatabase/serverless/index.mjs"() {
    to = Object.create;
    Ce = Object.defineProperty;
    ro = Object.getOwnPropertyDescriptor;
    no = Object.getOwnPropertyNames;
    io = Object.getPrototypeOf;
    so = Object.prototype.hasOwnProperty;
    oo = (r, e, t) => e in r ? Ce(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t;
    a = (r, e) => Ce(r, "name", { value: e, configurable: true });
    z = (r, e) => () => (r && (e = r(r = 0)), e);
    I = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
    ie = (r, e) => {
      for (var t in e)
        Ce(r, t, { get: e[t], enumerable: true });
    };
    An = (r, e, t, n) => {
      if (e && typeof e == "object" || typeof e == "function") for (let i of no(e)) !so.call(r, i) && i !== t && Ce(r, i, { get: () => e[i], enumerable: !(n = ro(e, i)) || n.enumerable });
      return r;
    };
    Te = (r, e, t) => (t = r != null ? to(io(r)) : {}, An(e || !r || !r.__esModule ? Ce(t, "default", {
      value: r,
      enumerable: true
    }) : t, r));
    N = (r) => An(Ce({}, "__esModule", { value: true }), r);
    _ = (r, e, t) => oo(r, typeof e != "symbol" ? e + "" : e, t);
    In = I((nt) => {
      "use strict";
      p();
      nt.byteLength = uo;
      nt.toByteArray = ho;
      nt.fromByteArray = po;
      var ae = [], te = [], ao = typeof Uint8Array < "u" ? Uint8Array : Array, Pt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (ve = 0, Cn = Pt.length; ve < Cn; ++ve)
        ae[ve] = Pt[ve], te[Pt.charCodeAt(ve)] = ve;
      var ve, Cn;
      te[45] = 62;
      te[95] = 63;
      function Tn(r) {
        var e = r.length;
        if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
        var t = r.indexOf("=");
        t === -1 && (t = e);
        var n = t === e ? 0 : 4 - t % 4;
        return [t, n];
      }
      a(
        Tn,
        "getLens"
      );
      function uo(r) {
        var e = Tn(r), t = e[0], n = e[1];
        return (t + n) * 3 / 4 - n;
      }
      a(uo, "byteLength");
      function co(r, e, t) {
        return (e + t) * 3 / 4 - t;
      }
      a(co, "_byteLength");
      function ho(r) {
        var e, t = Tn(r), n = t[0], i = t[1], s = new ao(co(r, n, i)), o = 0, u = i > 0 ? n - 4 : n, c;
        for (c = 0; c < u; c += 4) e = te[r.charCodeAt(c)] << 18 | te[r.charCodeAt(c + 1)] << 12 | te[r.charCodeAt(c + 2)] << 6 | te[r.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
        return i === 2 && (e = te[r.charCodeAt(c)] << 2 | te[r.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = te[r.charCodeAt(
          c
        )] << 10 | te[r.charCodeAt(c + 1)] << 4 | te[r.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
      }
      a(ho, "toByteArray");
      function lo(r) {
        return ae[r >> 18 & 63] + ae[r >> 12 & 63] + ae[r >> 6 & 63] + ae[r & 63];
      }
      a(lo, "tripletToBase64");
      function fo(r, e, t) {
        for (var n, i = [], s = e; s < t; s += 3) n = (r[s] << 16 & 16711680) + (r[s + 1] << 8 & 65280) + (r[s + 2] & 255), i.push(lo(n));
        return i.join(
          ""
        );
      }
      a(fo, "encodeChunk");
      function po(r) {
        for (var e, t = r.length, n = t % 3, i = [], s = 16383, o = 0, u = t - n; o < u; o += s) i.push(fo(r, o, o + s > u ? u : o + s));
        return n === 1 ? (e = r[t - 1], i.push(ae[e >> 2] + ae[e << 4 & 63] + "==")) : n === 2 && (e = (r[t - 2] << 8) + r[t - 1], i.push(ae[e >> 10] + ae[e >> 4 & 63] + ae[e << 2 & 63] + "=")), i.join("");
      }
      a(po, "fromByteArray");
    });
    Pn = I((Bt) => {
      p();
      Bt.read = function(r, e, t, n, i) {
        var s, o, u = i * 8 - n - 1, c = (1 << u) - 1, h = c >> 1, l = -7, d = t ? i - 1 : 0, b = t ? -1 : 1, C = r[e + d];
        for (d += b, s = C & (1 << -l) - 1, C >>= -l, l += u; l > 0; s = s * 256 + r[e + d], d += b, l -= 8) ;
        for (o = s & (1 << -l) - 1, s >>= -l, l += n; l > 0; o = o * 256 + r[e + d], d += b, l -= 8) ;
        if (s === 0) s = 1 - h;
        else {
          if (s === c) return o ? NaN : (C ? -1 : 1) * (1 / 0);
          o = o + Math.pow(2, n), s = s - h;
        }
        return (C ? -1 : 1) * o * Math.pow(2, s - n);
      };
      Bt.write = function(r, e, t, n, i, s) {
        var o, u, c, h = s * 8 - i - 1, l = (1 << h) - 1, d = l >> 1, b = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, C = n ? 0 : s - 1, B = n ? 1 : -1, W = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
        for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, o = l) : (o = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), o + d >= 1 ? e += b / c : e += b * Math.pow(2, 1 - d), e * c >= 2 && (o++, c /= 2), o + d >= l ? (u = 0, o = l) : o + d >= 1 ? (u = (e * c - 1) * Math.pow(
          2,
          i
        ), o = o + d) : (u = e * Math.pow(2, d - 1) * Math.pow(2, i), o = 0)); i >= 8; r[t + C] = u & 255, C += B, u /= 256, i -= 8) ;
        for (o = o << i | u, h += i; h > 0; r[t + C] = o & 255, C += B, o /= 256, h -= 8) ;
        r[t + C - B] |= W * 128;
      };
    });
    $n = I((Le) => {
      "use strict";
      p();
      var Lt = In(), Pe = Pn(), Bn = typeof Symbol == "function" && typeof Symbol.for == "function" ? /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom") : null;
      Le.Buffer = f;
      Le.SlowBuffer = So;
      Le.INSPECT_MAX_BYTES = 50;
      var it = 2147483647;
      Le.kMaxLength = it;
      f.TYPED_ARRAY_SUPPORT = yo();
      !f.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
      function yo() {
        try {
          let r = new Uint8Array(1), e = { foo: a(function() {
            return 42;
          }, "foo") };
          return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(
            r,
            e
          ), r.foo() === 42;
        } catch {
          return false;
        }
      }
      a(yo, "typedArraySupport");
      Object.defineProperty(
        f.prototype,
        "parent",
        { enumerable: true, get: a(function() {
          if (f.isBuffer(this)) return this.buffer;
        }, "get") }
      );
      Object.defineProperty(f.prototype, "offset", { enumerable: true, get: a(
        function() {
          if (f.isBuffer(this)) return this.byteOffset;
        },
        "get"
      ) });
      function fe(r) {
        if (r > it) throw new RangeError('The value "' + r + '" is invalid for option "size"');
        let e = new Uint8Array(
          r
        );
        return Object.setPrototypeOf(e, f.prototype), e;
      }
      a(fe, "createBuffer");
      function f(r, e, t) {
        if (typeof r == "number") {
          if (typeof e == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
          return Dt(r);
        }
        return Mn(
          r,
          e,
          t
        );
      }
      a(f, "Buffer");
      f.poolSize = 8192;
      function Mn(r, e, t) {
        if (typeof r == "string") return go(
          r,
          e
        );
        if (ArrayBuffer.isView(r)) return wo(r);
        if (r == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
        if (ue(r, ArrayBuffer) || r && ue(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (ue(r, SharedArrayBuffer) || r && ue(r.buffer, SharedArrayBuffer)))
          return Ft(r, e, t);
        if (typeof r == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
        let n = r.valueOf && r.valueOf();
        if (n != null && n !== r) return f.from(n, e, t);
        let i = bo(r);
        if (i) return i;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function") return f.from(r[Symbol.toPrimitive]("string"), e, t);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
      }
      a(Mn, "from");
      f.from = function(r, e, t) {
        return Mn(r, e, t);
      };
      Object.setPrototypeOf(f.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(
        f,
        Uint8Array
      );
      function Dn(r) {
        if (typeof r != "number") throw new TypeError('"size" argument must be of type number');
        if (r < 0) throw new RangeError('The value "' + r + '" is invalid for option "size"');
      }
      a(Dn, "assertSize");
      function mo(r, e, t) {
        return Dn(r), r <= 0 ? fe(r) : e !== void 0 ? typeof t == "string" ? fe(r).fill(e, t) : fe(r).fill(e) : fe(r);
      }
      a(
        mo,
        "alloc"
      );
      f.alloc = function(r, e, t) {
        return mo(r, e, t);
      };
      function Dt(r) {
        return Dn(r), fe(
          r < 0 ? 0 : kt(r) | 0
        );
      }
      a(Dt, "allocUnsafe");
      f.allocUnsafe = function(r) {
        return Dt(r);
      };
      f.allocUnsafeSlow = function(r) {
        return Dt(r);
      };
      function go(r, e) {
        if ((typeof e != "string" || e === "") && (e = "utf8"), !f.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
        let t = kn(r, e) | 0, n = fe(t), i = n.write(r, e);
        return i !== t && (n = n.slice(0, i)), n;
      }
      a(go, "fromString");
      function Rt(r) {
        let e = r.length < 0 ? 0 : kt(r.length) | 0, t = fe(e);
        for (let n = 0; n < e; n += 1) t[n] = r[n] & 255;
        return t;
      }
      a(Rt, "fromArrayLike");
      function wo(r) {
        if (ue(r, Uint8Array)) {
          let e = new Uint8Array(r);
          return Ft(e.buffer, e.byteOffset, e.byteLength);
        }
        return Rt(r);
      }
      a(wo, "fromArrayView");
      function Ft(r, e, t) {
        if (e < 0 || r.byteLength < e) throw new RangeError('"offset" is outside of buffer bounds');
        if (r.byteLength < e + (t || 0)) throw new RangeError('"length" is outside of buffer bounds');
        let n;
        return e === void 0 && t === void 0 ? n = new Uint8Array(
          r
        ) : t === void 0 ? n = new Uint8Array(r, e) : n = new Uint8Array(r, e, t), Object.setPrototypeOf(
          n,
          f.prototype
        ), n;
      }
      a(Ft, "fromArrayBuffer");
      function bo(r) {
        if (f.isBuffer(r)) {
          let e = kt(
            r.length
          ) | 0, t = fe(e);
          return t.length === 0 || r.copy(t, 0, 0, e), t;
        }
        if (r.length !== void 0)
          return typeof r.length != "number" || Ot(r.length) ? fe(0) : Rt(r);
        if (r.type === "Buffer" && Array.isArray(r.data)) return Rt(r.data);
      }
      a(bo, "fromObject");
      function kt(r) {
        if (r >= it) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + it.toString(16) + " bytes");
        return r | 0;
      }
      a(kt, "checked");
      function So(r) {
        return +r != r && (r = 0), f.alloc(+r);
      }
      a(So, "SlowBuffer");
      f.isBuffer = a(function(e) {
        return e != null && e._isBuffer === true && e !== f.prototype;
      }, "isBuffer");
      f.compare = a(function(e, t) {
        if (ue(e, Uint8Array) && (e = f.from(e, e.offset, e.byteLength)), ue(t, Uint8Array) && (t = f.from(t, t.offset, t.byteLength)), !f.isBuffer(e) || !f.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (e === t) return 0;
        let n = e.length, i = t.length;
        for (let s = 0, o = Math.min(n, i); s < o; ++s) if (e[s] !== t[s]) {
          n = e[s], i = t[s];
          break;
        }
        return n < i ? -1 : i < n ? 1 : 0;
      }, "compare");
      f.isEncoding = a(function(e) {
        switch (String(e).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      }, "isEncoding");
      f.concat = a(function(e, t) {
        if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (e.length === 0) return f.alloc(0);
        let n;
        if (t === void 0) for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
        let i = f.allocUnsafe(t), s = 0;
        for (n = 0; n < e.length; ++n) {
          let o = e[n];
          if (ue(o, Uint8Array)) s + o.length > i.length ? (f.isBuffer(
            o
          ) || (o = f.from(o)), o.copy(i, s)) : Uint8Array.prototype.set.call(i, o, s);
          else if (f.isBuffer(
            o
          )) o.copy(i, s);
          else throw new TypeError('"list" argument must be an Array of Buffers');
          s += o.length;
        }
        return i;
      }, "concat");
      function kn(r, e) {
        if (f.isBuffer(r)) return r.length;
        if (ArrayBuffer.isView(r) || ue(r, ArrayBuffer)) return r.byteLength;
        if (typeof r != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r);
        let t = r.length, n = arguments.length > 2 && arguments[2] === true;
        if (!n && t === 0) return 0;
        let i = false;
        for (; ; ) switch (e) {
          case "ascii":
          case "latin1":
          case "binary":
            return t;
          case "utf8":
          case "utf-8":
            return Mt(r).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return t * 2;
          case "hex":
            return t >>> 1;
          case "base64":
            return Gn(r).length;
          default:
            if (i) return n ? -1 : Mt(r).length;
            e = ("" + e).toLowerCase(), i = true;
        }
      }
      a(kn, "byteLength");
      f.byteLength = kn;
      function xo(r, e, t) {
        let n = false;
        if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, e >>>= 0, t <= e)) return "";
        for (r || (r = "utf8"); ; ) switch (r) {
          case "hex":
            return Lo(
              this,
              e,
              t
            );
          case "utf8":
          case "utf-8":
            return On(this, e, t);
          case "ascii":
            return Po(
              this,
              e,
              t
            );
          case "latin1":
          case "binary":
            return Bo(this, e, t);
          case "base64":
            return To(
              this,
              e,
              t
            );
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Ro(this, e, t);
          default:
            if (n) throw new TypeError("Unknown encoding: " + r);
            r = (r + "").toLowerCase(), n = true;
        }
      }
      a(
        xo,
        "slowToString"
      );
      f.prototype._isBuffer = true;
      function Ee(r, e, t) {
        let n = r[e];
        r[e] = r[t], r[t] = n;
      }
      a(Ee, "swap");
      f.prototype.swap16 = a(function() {
        let e = this.length;
        if (e % 2 !== 0)
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let t = 0; t < e; t += 2) Ee(this, t, t + 1);
        return this;
      }, "swap16");
      f.prototype.swap32 = a(function() {
        let e = this.length;
        if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let t = 0; t < e; t += 4) Ee(this, t, t + 3), Ee(this, t + 1, t + 2);
        return this;
      }, "swap32");
      f.prototype.swap64 = a(function() {
        let e = this.length;
        if (e % 8 !== 0) throw new RangeError(
          "Buffer size must be a multiple of 64-bits"
        );
        for (let t = 0; t < e; t += 8) Ee(this, t, t + 7), Ee(this, t + 1, t + 6), Ee(this, t + 2, t + 5), Ee(this, t + 3, t + 4);
        return this;
      }, "swap64");
      f.prototype.toString = a(function() {
        let e = this.length;
        return e === 0 ? "" : arguments.length === 0 ? On(
          this,
          0,
          e
        ) : xo.apply(this, arguments);
      }, "toString");
      f.prototype.toLocaleString = f.prototype.toString;
      f.prototype.equals = a(function(e) {
        if (!f.isBuffer(e)) throw new TypeError(
          "Argument must be a Buffer"
        );
        return this === e ? true : f.compare(this, e) === 0;
      }, "equals");
      f.prototype.inspect = a(function() {
        let e = "", t = Le.INSPECT_MAX_BYTES;
        return e = this.toString(
          "hex",
          0,
          t
        ).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
      }, "inspect");
      Bn && (f.prototype[Bn] = f.prototype.inspect);
      f.prototype.compare = a(function(e, t, n, i, s) {
        if (ue(e, Uint8Array) && (e = f.from(e, e.offset, e.byteLength)), !f.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
        if (t === void 0 && (t = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), s === void 0 && (s = this.length), t < 0 || n > e.length || i < 0 || s > this.length) throw new RangeError("out of range index");
        if (i >= s && t >= n) return 0;
        if (i >= s) return -1;
        if (t >= n) return 1;
        if (t >>>= 0, n >>>= 0, i >>>= 0, s >>>= 0, this === e) return 0;
        let o = s - i, u = n - t, c = Math.min(o, u), h = this.slice(i, s), l = e.slice(t, n);
        for (let d = 0; d < c; ++d)
          if (h[d] !== l[d]) {
            o = h[d], u = l[d];
            break;
          }
        return o < u ? -1 : u < o ? 1 : 0;
      }, "compare");
      function Un(r, e, t, n, i) {
        if (r.length === 0) return -1;
        if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, Ot(t) && (t = i ? 0 : r.length - 1), t < 0 && (t = r.length + t), t >= r.length) {
          if (i) return -1;
          t = r.length - 1;
        } else if (t < 0) if (i) t = 0;
        else return -1;
        if (typeof e == "string" && (e = f.from(e, n)), f.isBuffer(e)) return e.length === 0 ? -1 : Ln(r, e, t, n, i);
        if (typeof e == "number") return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(r, e, t) : Uint8Array.prototype.lastIndexOf.call(r, e, t) : Ln(
          r,
          [e],
          t,
          n,
          i
        );
        throw new TypeError("val must be string, number or Buffer");
      }
      a(Un, "bidirectionalIndexOf");
      function Ln(r, e, t, n, i) {
        let s = 1, o = r.length, u = e.length;
        if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
          if (r.length < 2 || e.length < 2) return -1;
          s = 2, o /= 2, u /= 2, t /= 2;
        }
        function c(l, d) {
          return s === 1 ? l[d] : l.readUInt16BE(d * s);
        }
        a(c, "read");
        let h;
        if (i) {
          let l = -1;
          for (h = t; h < o; h++) if (c(r, h) === c(e, l === -1 ? 0 : h - l)) {
            if (l === -1 && (l = h), h - l + 1 === u) return l * s;
          } else l !== -1 && (h -= h - l), l = -1;
        } else for (t + u > o && (t = o - u), h = t; h >= 0; h--) {
          let l = true;
          for (let d = 0; d < u; d++)
            if (c(r, h + d) !== c(e, d)) {
              l = false;
              break;
            }
          if (l) return h;
        }
        return -1;
      }
      a(Ln, "arrayIndexOf");
      f.prototype.includes = a(function(e, t, n) {
        return this.indexOf(e, t, n) !== -1;
      }, "includes");
      f.prototype.indexOf = a(function(e, t, n) {
        return Un(this, e, t, n, true);
      }, "indexOf");
      f.prototype.lastIndexOf = a(function(e, t, n) {
        return Un(this, e, t, n, false);
      }, "lastIndexOf");
      function vo(r, e, t, n) {
        t = Number(t) || 0;
        let i = r.length - t;
        n ? (n = Number(n), n > i && (n = i)) : n = i;
        let s = e.length;
        n > s / 2 && (n = s / 2);
        let o;
        for (o = 0; o < n; ++o) {
          let u = parseInt(e.substr(o * 2, 2), 16);
          if (Ot(u))
            return o;
          r[t + o] = u;
        }
        return o;
      }
      a(vo, "hexWrite");
      function Eo(r, e, t, n) {
        return st(Mt(
          e,
          r.length - t
        ), r, t, n);
      }
      a(Eo, "utf8Write");
      function _o(r, e, t, n) {
        return st(ko(e), r, t, n);
      }
      a(_o, "asciiWrite");
      function Ao(r, e, t, n) {
        return st(Gn(e), r, t, n);
      }
      a(Ao, "base64Write");
      function Co(r, e, t, n) {
        return st(Uo(e, r.length - t), r, t, n);
      }
      a(Co, "ucs2Write");
      f.prototype.write = a(function(e, t, n, i) {
        if (t === void 0) i = "utf8", n = this.length, t = 0;
        else if (n === void 0 && typeof t == "string") i = t, n = this.length, t = 0;
        else if (isFinite(t)) t = t >>> 0, isFinite(n) ? (n = n >>> 0, i === void 0 && (i = "utf8")) : (i = n, n = void 0);
        else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        let s = this.length - t;
        if ((n === void 0 || n > s) && (n = s), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError(
          "Attempt to write outside buffer bounds"
        );
        i || (i = "utf8");
        let o = false;
        for (; ; ) switch (i) {
          case "hex":
            return vo(this, e, t, n);
          case "utf8":
          case "utf-8":
            return Eo(this, e, t, n);
          case "ascii":
          case "latin1":
          case "binary":
            return _o(this, e, t, n);
          case "base64":
            return Ao(
              this,
              e,
              t,
              n
            );
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Co(this, e, t, n);
          default:
            if (o) throw new TypeError("Unknown encoding: " + i);
            i = ("" + i).toLowerCase(), o = true;
        }
      }, "write");
      f.prototype.toJSON = a(function() {
        return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
      }, "toJSON");
      function To(r, e, t) {
        return e === 0 && t === r.length ? Lt.fromByteArray(r) : Lt.fromByteArray(r.slice(e, t));
      }
      a(To, "base64Slice");
      function On(r, e, t) {
        t = Math.min(r.length, t);
        let n = [], i = e;
        for (; i < t; ) {
          let s = r[i], o = null, u = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
          if (i + u <= t) {
            let c, h, l, d;
            switch (u) {
              case 1:
                s < 128 && (o = s);
                break;
              case 2:
                c = r[i + 1], (c & 192) === 128 && (d = (s & 31) << 6 | c & 63, d > 127 && (o = d));
                break;
              case 3:
                c = r[i + 1], h = r[i + 2], (c & 192) === 128 && (h & 192) === 128 && (d = (s & 15) << 12 | (c & 63) << 6 | h & 63, d > 2047 && (d < 55296 || d > 57343) && (o = d));
                break;
              case 4:
                c = r[i + 1], h = r[i + 2], l = r[i + 3], (c & 192) === 128 && (h & 192) === 128 && (l & 192) === 128 && (d = (s & 15) << 18 | (c & 63) << 12 | (h & 63) << 6 | l & 63, d > 65535 && d < 1114112 && (o = d));
            }
          }
          o === null ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n.push(o), i += u;
        }
        return Io(n);
      }
      a(On, "utf8Slice");
      var Rn = 4096;
      function Io(r) {
        let e = r.length;
        if (e <= Rn) return String.fromCharCode.apply(String, r);
        let t = "", n = 0;
        for (; n < e; ) t += String.fromCharCode.apply(String, r.slice(n, n += Rn));
        return t;
      }
      a(Io, "decodeCodePointsArray");
      function Po(r, e, t) {
        let n = "";
        t = Math.min(r.length, t);
        for (let i = e; i < t; ++i) n += String.fromCharCode(r[i] & 127);
        return n;
      }
      a(Po, "asciiSlice");
      function Bo(r, e, t) {
        let n = "";
        t = Math.min(r.length, t);
        for (let i = e; i < t; ++i) n += String.fromCharCode(r[i]);
        return n;
      }
      a(Bo, "latin1Slice");
      function Lo(r, e, t) {
        let n = r.length;
        (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
        let i = "";
        for (let s = e; s < t; ++s) i += Oo[r[s]];
        return i;
      }
      a(Lo, "hexSlice");
      function Ro(r, e, t) {
        let n = r.slice(e, t), i = "";
        for (let s = 0; s < n.length - 1; s += 2) i += String.fromCharCode(n[s] + n[s + 1] * 256);
        return i;
      }
      a(Ro, "utf16leSlice");
      f.prototype.slice = a(function(e, t) {
        let n = this.length;
        e = ~~e, t = t === void 0 ? n : ~~t, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < e && (t = e);
        let i = this.subarray(
          e,
          t
        );
        return Object.setPrototypeOf(i, f.prototype), i;
      }, "slice");
      function q(r, e, t) {
        if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
        if (r + e > t) throw new RangeError(
          "Trying to access beyond buffer length"
        );
      }
      a(q, "checkOffset");
      f.prototype.readUintLE = f.prototype.readUIntLE = a(function(e, t, n) {
        e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
        let i = this[e], s = 1, o = 0;
        for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
        return i;
      }, "readUIntLE");
      f.prototype.readUintBE = f.prototype.readUIntBE = a(function(e, t, n) {
        e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
        let i = this[e + --t], s = 1;
        for (; t > 0 && (s *= 256); ) i += this[e + --t] * s;
        return i;
      }, "readUIntBE");
      f.prototype.readUint8 = f.prototype.readUInt8 = a(function(e, t) {
        return e = e >>> 0, t || q(e, 1, this.length), this[e];
      }, "readUInt8");
      f.prototype.readUint16LE = f.prototype.readUInt16LE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 2, this.length), this[e] | this[e + 1] << 8;
      }, "readUInt16LE");
      f.prototype.readUint16BE = f.prototype.readUInt16BE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 2, this.length), this[e] << 8 | this[e + 1];
      }, "readUInt16BE");
      f.prototype.readUint32LE = f.prototype.readUInt32LE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
      }, "readUInt32LE");
      f.prototype.readUint32BE = f.prototype.readUInt32BE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
      }, "readUInt32BE");
      f.prototype.readBigUInt64LE = ge(a(function(e) {
        e = e >>> 0, Be(e, "offset");
        let t = this[e], n = this[e + 7];
        (t === void 0 || n === void 0) && We(e, this.length - 8);
        let i = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, s = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
        return BigInt(i) + (BigInt(s) << BigInt(32));
      }, "readBigUInt64LE"));
      f.prototype.readBigUInt64BE = ge(a(function(e) {
        e = e >>> 0, Be(e, "offset");
        let t = this[e], n = this[e + 7];
        (t === void 0 || n === void 0) && We(e, this.length - 8);
        let i = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], s = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
        return (BigInt(
          i
        ) << BigInt(32)) + BigInt(s);
      }, "readBigUInt64BE"));
      f.prototype.readIntLE = a(function(e, t, n) {
        e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
        let i = this[e], s = 1, o = 0;
        for (; ++o < t && (s *= 256); )
          i += this[e + o] * s;
        return s *= 128, i >= s && (i -= Math.pow(2, 8 * t)), i;
      }, "readIntLE");
      f.prototype.readIntBE = a(function(e, t, n) {
        e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
        let i = t, s = 1, o = this[e + --i];
        for (; i > 0 && (s *= 256); ) o += this[e + --i] * s;
        return s *= 128, o >= s && (o -= Math.pow(2, 8 * t)), o;
      }, "readIntBE");
      f.prototype.readInt8 = a(function(e, t) {
        return e = e >>> 0, t || q(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
      }, "readInt8");
      f.prototype.readInt16LE = a(function(e, t) {
        e = e >>> 0, t || q(e, 2, this.length);
        let n = this[e] | this[e + 1] << 8;
        return n & 32768 ? n | 4294901760 : n;
      }, "readInt16LE");
      f.prototype.readInt16BE = a(
        function(e, t) {
          e = e >>> 0, t || q(e, 2, this.length);
          let n = this[e + 1] | this[e] << 8;
          return n & 32768 ? n | 4294901760 : n;
        },
        "readInt16BE"
      );
      f.prototype.readInt32LE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
      }, "readInt32LE");
      f.prototype.readInt32BE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
      }, "readInt32BE");
      f.prototype.readBigInt64LE = ge(a(function(e) {
        e = e >>> 0, Be(e, "offset");
        let t = this[e], n = this[e + 7];
        (t === void 0 || n === void 0) && We(
          e,
          this.length - 8
        );
        let i = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
        return (BigInt(
          i
        ) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
      }, "readBigInt64LE"));
      f.prototype.readBigInt64BE = ge(a(function(e) {
        e = e >>> 0, Be(e, "offset");
        let t = this[e], n = this[e + 7];
        (t === void 0 || n === void 0) && We(e, this.length - 8);
        let i = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
        return (BigInt(i) << BigInt(32)) + BigInt(
          this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n
        );
      }, "readBigInt64BE"));
      f.prototype.readFloatLE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), Pe.read(
          this,
          e,
          true,
          23,
          4
        );
      }, "readFloatLE");
      f.prototype.readFloatBE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), Pe.read(this, e, false, 23, 4);
      }, "readFloatBE");
      f.prototype.readDoubleLE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 8, this.length), Pe.read(this, e, true, 52, 8);
      }, "readDoubleLE");
      f.prototype.readDoubleBE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 8, this.length), Pe.read(this, e, false, 52, 8);
      }, "readDoubleBE");
      function Y(r, e, t, n, i, s) {
        if (!f.isBuffer(
          r
        )) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (e > i || e < s) throw new RangeError('"value" argument is out of bounds');
        if (t + n > r.length) throw new RangeError(
          "Index out of range"
        );
      }
      a(Y, "checkInt");
      f.prototype.writeUintLE = f.prototype.writeUIntLE = a(function(e, t, n, i) {
        if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
          let u = Math.pow(2, 8 * n) - 1;
          Y(
            this,
            e,
            t,
            n,
            u,
            0
          );
        }
        let s = 1, o = 0;
        for (this[t] = e & 255; ++o < n && (s *= 256); ) this[t + o] = e / s & 255;
        return t + n;
      }, "writeUIntLE");
      f.prototype.writeUintBE = f.prototype.writeUIntBE = a(function(e, t, n, i) {
        if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
          let u = Math.pow(2, 8 * n) - 1;
          Y(this, e, t, n, u, 0);
        }
        let s = n - 1, o = 1;
        for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) this[t + s] = e / o & 255;
        return t + n;
      }, "writeUIntBE");
      f.prototype.writeUint8 = f.prototype.writeUInt8 = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
      }, "writeUInt8");
      f.prototype.writeUint16LE = f.prototype.writeUInt16LE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(
          this,
          e,
          t,
          2,
          65535,
          0
        ), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
      }, "writeUInt16LE");
      f.prototype.writeUint16BE = f.prototype.writeUInt16BE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(
          this,
          e,
          t,
          2,
          65535,
          0
        ), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
      }, "writeUInt16BE");
      f.prototype.writeUint32LE = f.prototype.writeUInt32LE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(
          this,
          e,
          t,
          4,
          4294967295,
          0
        ), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
      }, "writeUInt32LE");
      f.prototype.writeUint32BE = f.prototype.writeUInt32BE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
      }, "writeUInt32BE");
      function Nn(r, e, t, n, i) {
        Hn(
          e,
          n,
          i,
          r,
          t,
          7
        );
        let s = Number(e & BigInt(4294967295));
        r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s;
        let o = Number(e >> BigInt(32) & BigInt(4294967295));
        return r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, t;
      }
      a(Nn, "wrtBigUInt64LE");
      function qn(r, e, t, n, i) {
        Hn(e, n, i, r, t, 7);
        let s = Number(e & BigInt(4294967295));
        r[t + 7] = s, s = s >> 8, r[t + 6] = s, s = s >> 8, r[t + 5] = s, s = s >> 8, r[t + 4] = s;
        let o = Number(e >> BigInt(32) & BigInt(4294967295));
        return r[t + 3] = o, o = o >> 8, r[t + 2] = o, o = o >> 8, r[t + 1] = o, o = o >> 8, r[t] = o, t + 8;
      }
      a(qn, "wrtBigUInt64BE");
      f.prototype.writeBigUInt64LE = ge(a(function(e, t = 0) {
        return Nn(this, e, t, BigInt(0), BigInt(
          "0xffffffffffffffff"
        ));
      }, "writeBigUInt64LE"));
      f.prototype.writeBigUInt64BE = ge(a(function(e, t = 0) {
        return qn(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
      }, "writeBigUInt64BE"));
      f.prototype.writeIntLE = a(function(e, t, n, i) {
        if (e = +e, t = t >>> 0, !i) {
          let c = Math.pow(
            2,
            8 * n - 1
          );
          Y(this, e, t, n, c - 1, -c);
        }
        let s = 0, o = 1, u = 0;
        for (this[t] = e & 255; ++s < n && (o *= 256); ) e < 0 && u === 0 && this[t + s - 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
        return t + n;
      }, "writeIntLE");
      f.prototype.writeIntBE = a(function(e, t, n, i) {
        if (e = +e, t = t >>> 0, !i) {
          let c = Math.pow(
            2,
            8 * n - 1
          );
          Y(this, e, t, n, c - 1, -c);
        }
        let s = n - 1, o = 1, u = 0;
        for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) e < 0 && u === 0 && this[t + s + 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
        return t + n;
      }, "writeIntBE");
      f.prototype.writeInt8 = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(
          this,
          e,
          t,
          1,
          127,
          -128
        ), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
      }, "writeInt8");
      f.prototype.writeInt16LE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
      }, "writeInt16LE");
      f.prototype.writeInt16BE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
      }, "writeInt16BE");
      f.prototype.writeInt32LE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 4, 2147483647, -2147483648), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
      }, "writeInt32LE");
      f.prototype.writeInt32BE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
      }, "writeInt32BE");
      f.prototype.writeBigInt64LE = ge(a(function(e, t = 0) {
        return Nn(this, e, t, -BigInt(
          "0x8000000000000000"
        ), BigInt("0x7fffffffffffffff"));
      }, "writeBigInt64LE"));
      f.prototype.writeBigInt64BE = ge(a(function(e, t = 0) {
        return qn(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }, "writeBigInt64BE"));
      function Qn(r, e, t, n, i, s) {
        if (t + n > r.length) throw new RangeError("Index out of range");
        if (t < 0) throw new RangeError(
          "Index out of range"
        );
      }
      a(Qn, "checkIEEE754");
      function Wn(r, e, t, n, i) {
        return e = +e, t = t >>> 0, i || Qn(r, e, t, 4, 34028234663852886e22, -34028234663852886e22), Pe.write(
          r,
          e,
          t,
          n,
          23,
          4
        ), t + 4;
      }
      a(Wn, "writeFloat");
      f.prototype.writeFloatLE = a(function(e, t, n) {
        return Wn(
          this,
          e,
          t,
          true,
          n
        );
      }, "writeFloatLE");
      f.prototype.writeFloatBE = a(function(e, t, n) {
        return Wn(
          this,
          e,
          t,
          false,
          n
        );
      }, "writeFloatBE");
      function jn(r, e, t, n, i) {
        return e = +e, t = t >>> 0, i || Qn(
          r,
          e,
          t,
          8,
          17976931348623157e292,
          -17976931348623157e292
        ), Pe.write(r, e, t, n, 52, 8), t + 8;
      }
      a(jn, "writeDouble");
      f.prototype.writeDoubleLE = a(function(e, t, n) {
        return jn(
          this,
          e,
          t,
          true,
          n
        );
      }, "writeDoubleLE");
      f.prototype.writeDoubleBE = a(function(e, t, n) {
        return jn(
          this,
          e,
          t,
          false,
          n
        );
      }, "writeDoubleBE");
      f.prototype.copy = a(function(e, t, n, i) {
        if (!f.isBuffer(
          e
        )) throw new TypeError("argument should be a Buffer");
        if (n || (n = 0), !i && i !== 0 && (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < n && (i = n), i === n || e.length === 0 || this.length === 0) return 0;
        if (t < 0) throw new RangeError("targetStart out of bounds");
        if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
        if (i < 0) throw new RangeError(
          "sourceEnd out of bounds"
        );
        i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
        let s = i - n;
        return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, i) : Uint8Array.prototype.set.call(e, this.subarray(n, i), t), s;
      }, "copy");
      f.prototype.fill = a(function(e, t, n, i) {
        if (typeof e == "string") {
          if (typeof t == "string" ? (i = t, t = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), i !== void 0 && typeof i != "string") throw new TypeError("encoding must be a string");
          if (typeof i == "string" && !f.isEncoding(i)) throw new TypeError("Unknown encoding: " + i);
          if (e.length === 1) {
            let o = e.charCodeAt(0);
            (i === "utf8" && o < 128 || i === "latin1") && (e = o);
          }
        } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
        if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
        if (n <= t) return this;
        t = t >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
        let s;
        if (typeof e == "number") for (s = t; s < n; ++s)
          this[s] = e;
        else {
          let o = f.isBuffer(e) ? e : f.from(e, i), u = o.length;
          if (u === 0) throw new TypeError(
            'The value "' + e + '" is invalid for argument "value"'
          );
          for (s = 0; s < n - t; ++s) this[s + t] = o[s % u];
        }
        return this;
      }, "fill");
      var Ie = {};
      function Ut(r, e, t) {
        var n;
        Ie[r] = (n = class extends t {
          constructor() {
            super(), Object.defineProperty(this, "message", {
              value: e.apply(this, arguments),
              writable: true,
              configurable: true
            }), this.name = `${this.name} [${r}]`, this.stack, delete this.name;
          }
          get code() {
            return r;
          }
          set code(s) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value: s,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${r}]: ${this.message}`;
          }
        }, a(n, "NodeError"), n);
      }
      a(Ut, "E");
      Ut("ERR_BUFFER_OUT_OF_BOUNDS", function(r) {
        return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      }, RangeError);
      Ut("ERR_INVALID_ARG_TYPE", function(r, e) {
        return `The "${r}" argument must be of type number. Received type ${typeof e}`;
      }, TypeError);
      Ut("ERR_OUT_OF_RANGE", function(r, e, t) {
        let n = `The value of "${r}" is out of range.`, i = t;
        return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? i = Fn(String(t)) : typeof t == "bigint" && (i = String(t), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (i = Fn(i)), i += "n"), n += ` It must be ${e}. Received ${i}`, n;
      }, RangeError);
      function Fn(r) {
        let e = "", t = r.length, n = r[0] === "-" ? 1 : 0;
        for (; t >= n + 4; t -= 3) e = `_${r.slice(t - 3, t)}${e}`;
        return `${r.slice(
          0,
          t
        )}${e}`;
      }
      a(Fn, "addNumericalSeparator");
      function Fo(r, e, t) {
        Be(e, "offset"), (r[e] === void 0 || r[e + t] === void 0) && We(e, r.length - (t + 1));
      }
      a(Fo, "checkBounds");
      function Hn(r, e, t, n, i, s) {
        if (r > t || r < e) {
          let o = typeof e == "bigint" ? "n" : "", u;
          throw s > 3 ? e === 0 || e === BigInt(0) ? u = `>= 0${o} and < 2${o} ** ${(s + 1) * 8}${o}` : u = `>= -(2${o} ** ${(s + 1) * 8 - 1}${o}) and < 2 ** ${(s + 1) * 8 - 1}${o}` : u = `>= ${e}${o} and <= ${t}${o}`, new Ie.ERR_OUT_OF_RANGE(
            "value",
            u,
            r
          );
        }
        Fo(n, i, s);
      }
      a(Hn, "checkIntBI");
      function Be(r, e) {
        if (typeof r != "number")
          throw new Ie.ERR_INVALID_ARG_TYPE(e, "number", r);
      }
      a(Be, "validateNumber");
      function We(r, e, t) {
        throw Math.floor(r) !== r ? (Be(r, t), new Ie.ERR_OUT_OF_RANGE(
          t || "offset",
          "an integer",
          r
        )) : e < 0 ? new Ie.ERR_BUFFER_OUT_OF_BOUNDS() : new Ie.ERR_OUT_OF_RANGE(t || "offset", `>= ${t ? 1 : 0} and <= ${e}`, r);
      }
      a(We, "boundsError");
      var Mo = /[^+/0-9A-Za-z-_]/g;
      function Do(r) {
        if (r = r.split("=")[0], r = r.trim().replace(Mo, ""), r.length < 2) return "";
        for (; r.length % 4 !== 0; ) r = r + "=";
        return r;
      }
      a(Do, "base64clean");
      function Mt(r, e) {
        e = e || 1 / 0;
        let t, n = r.length, i = null, s = [];
        for (let o = 0; o < n; ++o) {
          if (t = r.charCodeAt(o), t > 55295 && t < 57344) {
            if (!i) {
              if (t > 56319) {
                (e -= 3) > -1 && s.push(239, 191, 189);
                continue;
              } else if (o + 1 === n) {
                (e -= 3) > -1 && s.push(239, 191, 189);
                continue;
              }
              i = t;
              continue;
            }
            if (t < 56320) {
              (e -= 3) > -1 && s.push(
                239,
                191,
                189
              ), i = t;
              continue;
            }
            t = (i - 55296 << 10 | t - 56320) + 65536;
          } else i && (e -= 3) > -1 && s.push(
            239,
            191,
            189
          );
          if (i = null, t < 128) {
            if ((e -= 1) < 0) break;
            s.push(t);
          } else if (t < 2048) {
            if ((e -= 2) < 0) break;
            s.push(t >> 6 | 192, t & 63 | 128);
          } else if (t < 65536) {
            if ((e -= 3) < 0) break;
            s.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
          } else if (t < 1114112) {
            if ((e -= 4) < 0) break;
            s.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
          } else throw new Error("Invalid code point");
        }
        return s;
      }
      a(
        Mt,
        "utf8ToBytes"
      );
      function ko(r) {
        let e = [];
        for (let t = 0; t < r.length; ++t) e.push(r.charCodeAt(
          t
        ) & 255);
        return e;
      }
      a(ko, "asciiToBytes");
      function Uo(r, e) {
        let t, n, i, s = [];
        for (let o = 0; o < r.length && !((e -= 2) < 0); ++o) t = r.charCodeAt(o), n = t >> 8, i = t % 256, s.push(i), s.push(n);
        return s;
      }
      a(Uo, "utf16leToBytes");
      function Gn(r) {
        return Lt.toByteArray(Do(r));
      }
      a(Gn, "base64ToBytes");
      function st(r, e, t, n) {
        let i;
        for (i = 0; i < n && !(i + t >= e.length || i >= r.length); ++i)
          e[i + t] = r[i];
        return i;
      }
      a(st, "blitBuffer");
      function ue(r, e) {
        return r instanceof e || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === e.name;
      }
      a(ue, "isInstance");
      function Ot(r) {
        return r !== r;
      }
      a(Ot, "numberIsNaN");
      var Oo = (function() {
        let r = "0123456789abcdef", e = new Array(256);
        for (let t = 0; t < 16; ++t) {
          let n = t * 16;
          for (let i = 0; i < 16; ++i) e[n + i] = r[t] + r[i];
        }
        return e;
      })();
      function ge(r) {
        return typeof BigInt > "u" ? No : r;
      }
      a(ge, "defineBigIntMethod");
      function No() {
        throw new Error("BigInt not supported");
      }
      a(No, "BufferBigIntNotDefined");
    });
    p = z(() => {
      "use strict";
      S = globalThis, x = globalThis.setImmediate ?? ((r) => setTimeout(
        r,
        0
      )), v = globalThis.clearImmediate ?? ((r) => clearTimeout(r)), g = globalThis.crypto ?? {};
      g.subtle ?? (g.subtle = {});
      y = typeof globalThis.Buffer == "function" && typeof globalThis.Buffer.allocUnsafe == "function" ? globalThis.Buffer : $n().Buffer, m = globalThis.process ?? {};
      m.env ?? (m.env = {});
      try {
        m.nextTick(() => {
        });
      } catch {
        let e = Promise.resolve();
        m.nextTick = e.then.bind(e);
      }
    });
    we = I((Xc, Nt) => {
      "use strict";
      p();
      var Re = typeof Reflect == "object" ? Reflect : null, Vn = Re && typeof Re.apply == "function" ? Re.apply : a(function(e, t, n) {
        return Function.prototype.apply.call(e, t, n);
      }, "ReflectApply"), ot;
      Re && typeof Re.ownKeys == "function" ? ot = Re.ownKeys : Object.getOwnPropertySymbols ? ot = a(function(e) {
        return Object.getOwnPropertyNames(
          e
        ).concat(Object.getOwnPropertySymbols(e));
      }, "ReflectOwnKeys") : ot = a(function(e) {
        return Object.getOwnPropertyNames(e);
      }, "ReflectOwnKeys");
      function qo(r) {
        console && console.warn && console.warn(r);
      }
      a(qo, "ProcessEmitWarning");
      var zn = Number.isNaN || a(function(e) {
        return e !== e;
      }, "NumberIsNaN");
      function L() {
        L.init.call(this);
      }
      a(L, "EventEmitter");
      Nt.exports = L;
      Nt.exports.once = Ho;
      L.EventEmitter = L;
      L.prototype._events = void 0;
      L.prototype._eventsCount = 0;
      L.prototype._maxListeners = void 0;
      var Kn = 10;
      function at(r) {
        if (typeof r != "function") throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof r);
      }
      a(at, "checkListener");
      Object.defineProperty(L, "defaultMaxListeners", { enumerable: true, get: a(function() {
        return Kn;
      }, "get"), set: a(function(r) {
        if (typeof r != "number" || r < 0 || zn(r)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + r + ".");
        Kn = r;
      }, "set") });
      L.init = function() {
        (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
      };
      L.prototype.setMaxListeners = a(
        function(e) {
          if (typeof e != "number" || e < 0 || zn(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
          return this._maxListeners = e, this;
        },
        "setMaxListeners"
      );
      function Yn(r) {
        return r._maxListeners === void 0 ? L.defaultMaxListeners : r._maxListeners;
      }
      a(Yn, "_getMaxListeners");
      L.prototype.getMaxListeners = a(function() {
        return Yn(this);
      }, "getMaxListeners");
      L.prototype.emit = a(function(e) {
        for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
        var i = e === "error", s = this._events;
        if (s !== void 0) i = i && s.error === void 0;
        else if (!i) return false;
        if (i) {
          var o;
          if (t.length > 0 && (o = t[0]), o instanceof Error) throw o;
          var u = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
          throw u.context = o, u;
        }
        var c = s[e];
        if (c === void 0) return false;
        if (typeof c == "function") Vn(c, this, t);
        else for (var h = c.length, l = ti(c, h), n = 0; n < h; ++n) Vn(
          l[n],
          this,
          t
        );
        return true;
      }, "emit");
      function Zn(r, e, t, n) {
        var i, s, o;
        if (at(t), s = r._events, s === void 0 ? (s = r._events = /* @__PURE__ */ Object.create(null), r._eventsCount = 0) : (s.newListener !== void 0 && (r.emit(
          "newListener",
          e,
          t.listener ? t.listener : t
        ), s = r._events), o = s[e]), o === void 0) o = s[e] = t, ++r._eventsCount;
        else if (typeof o == "function" ? o = s[e] = n ? [t, o] : [o, t] : n ? o.unshift(
          t
        ) : o.push(t), i = Yn(r), i > 0 && o.length > i && !o.warned) {
          o.warned = true;
          var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          u.name = "MaxListenersExceededWarning", u.emitter = r, u.type = e, u.count = o.length, qo(u);
        }
        return r;
      }
      a(Zn, "_addListener");
      L.prototype.addListener = a(function(e, t) {
        return Zn(this, e, t, false);
      }, "addListener");
      L.prototype.on = L.prototype.addListener;
      L.prototype.prependListener = a(function(e, t) {
        return Zn(this, e, t, true);
      }, "prependListener");
      function Qo() {
        if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
      }
      a(
        Qo,
        "onceWrapper"
      );
      function Jn(r, e, t) {
        var n = {
          fired: false,
          wrapFn: void 0,
          target: r,
          type: e,
          listener: t
        }, i = Qo.bind(n);
        return i.listener = t, n.wrapFn = i, i;
      }
      a(Jn, "_onceWrap");
      L.prototype.once = a(function(e, t) {
        return at(t), this.on(e, Jn(this, e, t)), this;
      }, "once");
      L.prototype.prependOnceListener = a(function(e, t) {
        return at(t), this.prependListener(e, Jn(
          this,
          e,
          t
        )), this;
      }, "prependOnceListener");
      L.prototype.removeListener = a(
        function(e, t) {
          var n, i, s, o, u;
          if (at(t), i = this._events, i === void 0) return this;
          if (n = i[e], n === void 0) return this;
          if (n === t || n.listener === t) --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, n.listener || t));
          else if (typeof n != "function") {
            for (s = -1, o = n.length - 1; o >= 0; o--) if (n[o] === t || n[o].listener === t) {
              u = n[o].listener, s = o;
              break;
            }
            if (s < 0) return this;
            s === 0 ? n.shift() : Wo(n, s), n.length === 1 && (i[e] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", e, u || t);
          }
          return this;
        },
        "removeListener"
      );
      L.prototype.off = L.prototype.removeListener;
      L.prototype.removeAllListeners = a(function(e) {
        var t, n, i;
        if (n = this._events, n === void 0) return this;
        if (n.removeListener === void 0) return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
        if (arguments.length === 0) {
          var s = Object.keys(n), o;
          for (i = 0; i < s.length; ++i) o = s[i], o !== "removeListener" && this.removeAllListeners(o);
          return this.removeAllListeners(
            "removeListener"
          ), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
        }
        if (t = n[e], typeof t == "function") this.removeListener(e, t);
        else if (t !== void 0) for (i = t.length - 1; i >= 0; i--) this.removeListener(e, t[i]);
        return this;
      }, "removeAllListeners");
      function Xn(r, e, t) {
        var n = r._events;
        if (n === void 0) return [];
        var i = n[e];
        return i === void 0 ? [] : typeof i == "function" ? t ? [i.listener || i] : [i] : t ? jo(i) : ti(i, i.length);
      }
      a(Xn, "_listeners");
      L.prototype.listeners = a(function(e) {
        return Xn(this, e, true);
      }, "listeners");
      L.prototype.rawListeners = a(function(e) {
        return Xn(this, e, false);
      }, "rawListeners");
      L.listenerCount = function(r, e) {
        return typeof r.listenerCount == "function" ? r.listenerCount(e) : ei.call(r, e);
      };
      L.prototype.listenerCount = ei;
      function ei(r) {
        var e = this._events;
        if (e !== void 0) {
          var t = e[r];
          if (typeof t == "function") return 1;
          if (t !== void 0) return t.length;
        }
        return 0;
      }
      a(ei, "listenerCount");
      L.prototype.eventNames = a(function() {
        return this._eventsCount > 0 ? ot(this._events) : [];
      }, "eventNames");
      function ti(r, e) {
        for (var t = new Array(e), n = 0; n < e; ++n) t[n] = r[n];
        return t;
      }
      a(ti, "arrayClone");
      function Wo(r, e) {
        for (; e + 1 < r.length; e++) r[e] = r[e + 1];
        r.pop();
      }
      a(Wo, "spliceOne");
      function jo(r) {
        for (var e = new Array(r.length), t = 0; t < e.length; ++t)
          e[t] = r[t].listener || r[t];
        return e;
      }
      a(jo, "unwrapListeners");
      function Ho(r, e) {
        return new Promise(
          function(t, n) {
            function i(o) {
              r.removeListener(e, s), n(o);
            }
            a(i, "errorListener");
            function s() {
              typeof r.removeListener == "function" && r.removeListener("error", i), t([].slice.call(
                arguments
              ));
            }
            a(s, "resolver"), ri(r, e, s, { once: true }), e !== "error" && Go(r, i, { once: true });
          }
        );
      }
      a(Ho, "once");
      function Go(r, e, t) {
        typeof r.on == "function" && ri(r, "error", e, t);
      }
      a(
        Go,
        "addErrorHandlerIfEventEmitter"
      );
      function ri(r, e, t, n) {
        if (typeof r.on == "function")
          n.once ? r.once(e, t) : r.on(e, t);
        else if (typeof r.addEventListener == "function") r.addEventListener(
          e,
          a(function i(s) {
            n.once && r.removeEventListener(e, i), t(s);
          }, "wrapListener")
        );
        else
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof r);
      }
      a(ri, "eventTargetAgnosticAddListener");
    });
    je = {};
    ie(je, { default: () => $o });
    He = z(() => {
      "use strict";
      p();
      $o = {};
    });
    ni = z(
      () => {
        "use strict";
        p();
        a(Ge, "sha256");
      }
    );
    ii = z(() => {
      "use strict";
      p();
      O = class O2 {
        constructor() {
          _(
            this,
            "_dataLength",
            0
          );
          _(this, "_bufferLength", 0);
          _(this, "_state", new Int32Array(4));
          _(
            this,
            "_buffer",
            new ArrayBuffer(68)
          );
          _(this, "_buffer8");
          _(this, "_buffer32");
          this._buffer8 = new Uint8Array(
            this._buffer,
            0,
            68
          ), this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
        }
        static hashByteArray(e, t = false) {
          return this.onePassHasher.start().appendByteArray(e).end(t);
        }
        static hashStr(e, t = false) {
          return this.onePassHasher.start().appendStr(e).end(t);
        }
        static hashAsciiStr(e, t = false) {
          return this.onePassHasher.start().appendAsciiStr(e).end(t);
        }
        static _hex(e) {
          let t = O2.hexChars, n = O2.hexOut, i, s, o, u;
          for (u = 0; u < 4; u += 1) for (s = u * 8, i = e[u], o = 0; o < 8; o += 2) n[s + 1 + o] = t.charAt(i & 15), i >>>= 4, n[s + 0 + o] = t.charAt(i & 15), i >>>= 4;
          return n.join("");
        }
        static _md5cycle(e, t) {
          let n = e[0], i = e[1], s = e[2], o = e[3];
          n += (i & s | ~i & o) + t[0] - 680876936 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[1] - 389564586 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[2] + 606105819 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[3] - 1044525330 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[4] - 176418897 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[5] + 1200080426 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[6] - 1473231341 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[7] - 45705983 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[8] + 1770035416 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[9] - 1958414417 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[10] - 42063 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[11] - 1990404162 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[12] + 1804603682 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[13] - 40341101 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[14] - 1502002290 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[15] + 1236535329 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & o | s & ~o) + t[1] - 165796510 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[6] - 1069501632 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[11] + 643717713 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[0] - 373897302 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[5] - 701558691 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[10] + 38016083 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[15] - 660478335 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[4] - 405537848 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[9] + 568446438 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[14] - 1019803690 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[3] - 187363961 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[8] + 1163531501 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[13] - 1444681467 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[2] - 51403784 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[7] + 1735328473 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[12] - 1926607734 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i ^ s ^ o) + t[5] - 378558 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[8] - 2022574463 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[11] + 1839030562 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[14] - 35309556 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[1] - 1530992060 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[4] + 1272893353 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[7] - 155497632 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[10] - 1094730640 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[13] + 681279174 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[0] - 358537222 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[3] - 722521979 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[6] + 76029189 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[9] - 640364487 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[12] - 421815835 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[15] + 530742520 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[2] - 995338651 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (s ^ (i | ~o)) + t[0] - 198630844 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[7] + 1126891415 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[14] - 1416354905 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[5] - 57434055 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[12] + 1700485571 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[3] - 1894986606 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[10] - 1051523 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[1] - 2054922799 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[8] + 1873313359 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[15] - 30611744 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[6] - 1560198380 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[13] + 1309151649 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[4] - 145523070 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[11] - 1120210379 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[2] + 718787259 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[9] - 343485551 | 0, i = (i << 21 | i >>> 11) + s | 0, e[0] = n + e[0] | 0, e[1] = i + e[1] | 0, e[2] = s + e[2] | 0, e[3] = o + e[3] | 0;
        }
        start() {
          return this._dataLength = 0, this._bufferLength = 0, this._state.set(O2.stateIdentity), this;
        }
        appendStr(e) {
          let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o;
          for (o = 0; o < e.length; o += 1) {
            if (s = e.charCodeAt(o), s < 128) t[i++] = s;
            else if (s < 2048) t[i++] = (s >>> 6) + 192, t[i++] = s & 63 | 128;
            else if (s < 55296 || s > 56319) t[i++] = (s >>> 12) + 224, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
            else {
              if (s = (s - 55296) * 1024 + (e.charCodeAt(++o) - 56320) + 65536, s > 1114111) throw new Error("Unicode standard supports code points up to U+10FFFF");
              t[i++] = (s >>> 18) + 240, t[i++] = s >>> 12 & 63 | 128, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
            }
            i >= 64 && (this._dataLength += 64, O2._md5cycle(this._state, n), i -= 64, n[0] = n[16]);
          }
          return this._bufferLength = i, this;
        }
        appendAsciiStr(e) {
          let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
          for (; ; ) {
            for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e.charCodeAt(o++);
            if (i < 64) break;
            this._dataLength += 64, O2._md5cycle(
              this._state,
              n
            ), i = 0;
          }
          return this._bufferLength = i, this;
        }
        appendByteArray(e) {
          let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
          for (; ; ) {
            for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e[o++];
            if (i < 64) break;
            this._dataLength += 64, O2._md5cycle(
              this._state,
              n
            ), i = 0;
          }
          return this._bufferLength = i, this;
        }
        getState() {
          let e = this._state;
          return { buffer: String.fromCharCode.apply(null, Array.from(this._buffer8)), buflen: this._bufferLength, length: this._dataLength, state: [e[0], e[1], e[2], e[3]] };
        }
        setState(e) {
          let t = e.buffer, n = e.state, i = this._state, s;
          for (this._dataLength = e.length, this._bufferLength = e.buflen, i[0] = n[0], i[1] = n[1], i[2] = n[2], i[3] = n[3], s = 0; s < t.length; s += 1) this._buffer8[s] = t.charCodeAt(s);
        }
        end(e = false) {
          let t = this._bufferLength, n = this._buffer8, i = this._buffer32, s = (t >> 2) + 1;
          this._dataLength += t;
          let o = this._dataLength * 8;
          if (n[t] = 128, n[t + 1] = n[t + 2] = n[t + 3] = 0, i.set(O2.buffer32Identity.subarray(s), s), t > 55 && (O2._md5cycle(this._state, i), i.set(O2.buffer32Identity)), o <= 4294967295)
            i[14] = o;
          else {
            let u = o.toString(16).match(/(.*?)(.{0,8})$/);
            if (u === null) return;
            let c = parseInt(
              u[2],
              16
            ), h = parseInt(u[1], 16) || 0;
            i[14] = c, i[15] = h;
          }
          return O2._md5cycle(this._state, i), e ? this._state : O2._hex(this._state);
        }
      };
      a(O, "Md5"), _(O, "stateIdentity", new Int32Array(
        [1732584193, -271733879, -1732584194, 271733878]
      )), _(O, "buffer32Identity", new Int32Array(
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      )), _(O, "hexChars", "0123456789abcdef"), _(O, "hexOut", []), _(O, "onePassHasher", new O());
      $e = O;
    });
    qt = {};
    ie(qt, { createHash: () => Ko, createHmac: () => zo, randomBytes: () => Vo });
    Qt = z(() => {
      "use strict";
      p();
      ni();
      ii();
      a(Vo, "randomBytes");
      a(Ko, "createHash");
      a(zo, "createHmac");
    });
    jt = I((si) => {
      "use strict";
      p();
      si.parse = function(r, e) {
        return new Wt(r, e).parse();
      };
      var ut = class ut2 {
        constructor(e, t) {
          this.source = e, this.transform = t || Yo, this.position = 0, this.entries = [], this.recorded = [], this.dimension = 0;
        }
        isEof() {
          return this.position >= this.source.length;
        }
        nextCharacter() {
          var e = this.source[this.position++];
          return e === "\\" ? { value: this.source[this.position++], escaped: true } : { value: e, escaped: false };
        }
        record(e) {
          this.recorded.push(e);
        }
        newEntry(e) {
          var t;
          (this.recorded.length > 0 || e) && (t = this.recorded.join(""), t === "NULL" && !e && (t = null), t !== null && (t = this.transform(t)), this.entries.push(
            t
          ), this.recorded = []);
        }
        consumeDimensions() {
          if (this.source[0] === "[") for (; !this.isEof(); ) {
            var e = this.nextCharacter();
            if (e.value === "=") break;
          }
        }
        parse(e) {
          var t, n, i;
          for (this.consumeDimensions(); !this.isEof(); ) if (t = this.nextCharacter(), t.value === "{" && !i) this.dimension++, this.dimension > 1 && (n = new ut2(this.source.substr(this.position - 1), this.transform), this.entries.push(
            n.parse(true)
          ), this.position += n.position - 2);
          else if (t.value === "}" && !i) {
            if (this.dimension--, !this.dimension && (this.newEntry(), e)) return this.entries;
          } else t.value === '"' && !t.escaped ? (i && this.newEntry(true), i = !i) : t.value === "," && !i ? this.newEntry() : this.record(
            t.value
          );
          if (this.dimension !== 0) throw new Error("array dimension not balanced");
          return this.entries;
        }
      };
      a(ut, "ArrayParser");
      var Wt = ut;
      function Yo(r) {
        return r;
      }
      a(Yo, "identity");
    });
    Ht = I((mh, oi) => {
      p();
      var Zo = jt();
      oi.exports = { create: a(function(r, e) {
        return { parse: a(
          function() {
            return Zo.parse(r, e);
          },
          "parse"
        ) };
      }, "create") };
    });
    ci = I((bh, ui) => {
      "use strict";
      p();
      var Jo = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/, Xo = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/, ea = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/, ta = /^-?infinity$/;
      ui.exports = a(function(e) {
        if (ta.test(e)) return Number(e.replace("i", "I"));
        var t = Jo.exec(e);
        if (!t) return ra(e) || null;
        var n = !!t[8], i = parseInt(t[1], 10);
        n && (i = ai(i));
        var s = parseInt(
          t[2],
          10
        ) - 1, o = t[3], u = parseInt(t[4], 10), c = parseInt(t[5], 10), h = parseInt(t[6], 10), l = t[7];
        l = l ? 1e3 * parseFloat(l) : 0;
        var d, b = na(e);
        return b != null ? (d = new Date(Date.UTC(
          i,
          s,
          o,
          u,
          c,
          h,
          l
        )), Gt(i) && d.setUTCFullYear(i), b !== 0 && d.setTime(d.getTime() - b)) : (d = new Date(
          i,
          s,
          o,
          u,
          c,
          h,
          l
        ), Gt(i) && d.setFullYear(i)), d;
      }, "parseDate");
      function ra(r) {
        var e = Xo.exec(r);
        if (e) {
          var t = parseInt(e[1], 10), n = !!e[4];
          n && (t = ai(t));
          var i = parseInt(
            e[2],
            10
          ) - 1, s = e[3], o = new Date(t, i, s);
          return Gt(t) && o.setFullYear(t), o;
        }
      }
      a(ra, "getDate");
      function na(r) {
        if (r.endsWith("+00")) return 0;
        var e = ea.exec(r.split(" ")[1]);
        if (e) {
          var t = e[1];
          if (t === "Z") return 0;
          var n = t === "-" ? -1 : 1, i = parseInt(e[2], 10) * 3600 + parseInt(
            e[3] || 0,
            10
          ) * 60 + parseInt(e[4] || 0, 10);
          return i * n * 1e3;
        }
      }
      a(na, "timeZoneOffset");
      function ai(r) {
        return -(r - 1);
      }
      a(ai, "bcYearToNegativeYear");
      function Gt(r) {
        return r >= 0 && r < 100;
      }
      a(
        Gt,
        "is0To99"
      );
    });
    li = I((vh, hi) => {
      p();
      hi.exports = sa;
      var ia = Object.prototype.hasOwnProperty;
      function sa(r) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var n in t) ia.call(
            t,
            n
          ) && (r[n] = t[n]);
        }
        return r;
      }
      a(sa, "extend");
    });
    di = I((Ah, pi) => {
      "use strict";
      p();
      var oa = li();
      pi.exports = Fe;
      function Fe(r) {
        if (!(this instanceof Fe)) return new Fe(r);
        oa(this, wa(r));
      }
      a(Fe, "PostgresInterval");
      var aa = ["seconds", "minutes", "hours", "days", "months", "years"];
      Fe.prototype.toPostgres = function() {
        var r = aa.filter(this.hasOwnProperty, this);
        return this.milliseconds && r.indexOf("seconds") < 0 && r.push("seconds"), r.length === 0 ? "0" : r.map(function(e) {
          var t = this[e] || 0;
          return e === "seconds" && this.milliseconds && (t = (t + this.milliseconds / 1e3).toFixed(6).replace(
            /\.?0+$/,
            ""
          )), t + " " + e;
        }, this).join(" ");
      };
      var ua = { years: "Y", months: "M", days: "D", hours: "H", minutes: "M", seconds: "S" }, ca = ["years", "months", "days"], ha = ["hours", "minutes", "seconds"];
      Fe.prototype.toISOString = Fe.prototype.toISO = function() {
        var r = ca.map(t, this).join(""), e = ha.map(t, this).join("");
        return "P" + r + "T" + e;
        function t(n) {
          var i = this[n] || 0;
          return n === "seconds" && this.milliseconds && (i = (i + this.milliseconds / 1e3).toFixed(6).replace(
            /0+$/,
            ""
          )), i + ua[n];
        }
      };
      var $t = "([+-]?\\d+)", la = $t + "\\s+years?", fa = $t + "\\s+mons?", pa = $t + "\\s+days?", da = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?", ya = new RegExp([
        la,
        fa,
        pa,
        da
      ].map(function(r) {
        return "(" + r + ")?";
      }).join("\\s*")), fi = {
        years: 2,
        months: 4,
        days: 6,
        hours: 9,
        minutes: 10,
        seconds: 11,
        milliseconds: 12
      }, ma = ["hours", "minutes", "seconds", "milliseconds"];
      function ga(r) {
        var e = r + "000000".slice(r.length);
        return parseInt(
          e,
          10
        ) / 1e3;
      }
      a(ga, "parseMilliseconds");
      function wa(r) {
        if (!r) return {};
        var e = ya.exec(
          r
        ), t = e[8] === "-";
        return Object.keys(fi).reduce(function(n, i) {
          var s = fi[i], o = e[s];
          return !o || (o = i === "milliseconds" ? ga(o) : parseInt(o, 10), !o) || (t && ~ma.indexOf(i) && (o *= -1), n[i] = o), n;
        }, {});
      }
      a(wa, "parse");
    });
    mi = I((Ih, yi) => {
      "use strict";
      p();
      yi.exports = a(function(e) {
        if (/^\\x/.test(e)) return new y(
          e.substr(2),
          "hex"
        );
        for (var t = "", n = 0; n < e.length; ) if (e[n] !== "\\") t += e[n], ++n;
        else if (/[0-7]{3}/.test(e.substr(n + 1, 3))) t += String.fromCharCode(parseInt(e.substr(n + 1, 3), 8)), n += 4;
        else {
          for (var i = 1; n + i < e.length && e[n + i] === "\\"; ) i++;
          for (var s = 0; s < Math.floor(i / 2); ++s) t += "\\";
          n += Math.floor(i / 2) * 2;
        }
        return new y(t, "binary");
      }, "parseBytea");
    });
    Ei = I((Lh, vi) => {
      p();
      var Ve = jt(), Ke = Ht(), ct = ci(), wi = di(), bi = mi();
      function ht(r) {
        return a(function(t) {
          return t === null ? t : r(t);
        }, "nullAllowed");
      }
      a(ht, "allowNull");
      function Si(r) {
        return r === null ? r : r === "TRUE" || r === "t" || r === "true" || r === "y" || r === "yes" || r === "on" || r === "1";
      }
      a(Si, "parseBool");
      function ba(r) {
        return r ? Ve.parse(r, Si) : null;
      }
      a(ba, "parseBoolArray");
      function Sa(r) {
        return parseInt(r, 10);
      }
      a(Sa, "parseBaseTenInt");
      function Vt(r) {
        return r ? Ve.parse(r, ht(Sa)) : null;
      }
      a(Vt, "parseIntegerArray");
      function xa(r) {
        return r ? Ve.parse(r, ht(function(e) {
          return xi(e).trim();
        })) : null;
      }
      a(xa, "parseBigIntegerArray");
      var va = a(function(r) {
        if (!r) return null;
        var e = Ke.create(r, function(t) {
          return t !== null && (t = Zt(t)), t;
        });
        return e.parse();
      }, "parsePointArray"), Kt = a(function(r) {
        if (!r)
          return null;
        var e = Ke.create(r, function(t) {
          return t !== null && (t = parseFloat(t)), t;
        });
        return e.parse();
      }, "parseFloatArray"), re = a(function(r) {
        if (!r) return null;
        var e = Ke.create(r);
        return e.parse();
      }, "parseStringArray"), zt = a(function(r) {
        if (!r) return null;
        var e = Ke.create(r, function(t) {
          return t !== null && (t = ct(t)), t;
        });
        return e.parse();
      }, "parseDateArray"), Ea = a(function(r) {
        if (!r) return null;
        var e = Ke.create(r, function(t) {
          return t !== null && (t = wi(t)), t;
        });
        return e.parse();
      }, "parseIntervalArray"), _a = a(function(r) {
        return r ? Ve.parse(r, ht(bi)) : null;
      }, "parseByteAArray"), Yt = a(function(r) {
        return parseInt(
          r,
          10
        );
      }, "parseInteger"), xi = a(function(r) {
        var e = String(r);
        return /^\d+$/.test(e) ? e : r;
      }, "parseBigInteger"), gi = a(
        function(r) {
          return r ? Ve.parse(r, ht(JSON.parse)) : null;
        },
        "parseJsonArray"
      ), Zt = a(function(r) {
        return r[0] !== "(" ? null : (r = r.substring(1, r.length - 1).split(","), { x: parseFloat(r[0]), y: parseFloat(r[1]) });
      }, "parsePoint"), Aa = a(function(r) {
        if (r[0] !== "<" && r[1] !== "(") return null;
        for (var e = "(", t = "", n = false, i = 2; i < r.length - 1; i++) {
          if (n || (e += r[i]), r[i] === ")") {
            n = true;
            continue;
          } else if (!n) continue;
          r[i] !== "," && (t += r[i]);
        }
        var s = Zt(e);
        return s.radius = parseFloat(t), s;
      }, "parseCircle"), Ca = a(function(r) {
        r(
          20,
          xi
        ), r(21, Yt), r(23, Yt), r(26, Yt), r(700, parseFloat), r(701, parseFloat), r(16, Si), r(
          1082,
          ct
        ), r(1114, ct), r(1184, ct), r(600, Zt), r(651, re), r(718, Aa), r(1e3, ba), r(1001, _a), r(
          1005,
          Vt
        ), r(1007, Vt), r(1028, Vt), r(1016, xa), r(1017, va), r(1021, Kt), r(1022, Kt), r(1231, Kt), r(1014, re), r(1015, re), r(1008, re), r(1009, re), r(1040, re), r(1041, re), r(1115, zt), r(
          1182,
          zt
        ), r(1185, zt), r(1186, wi), r(1187, Ea), r(17, bi), r(114, JSON.parse.bind(JSON)), r(
          3802,
          JSON.parse.bind(JSON)
        ), r(199, gi), r(3807, gi), r(3907, re), r(2951, re), r(791, re), r(
          1183,
          re
        ), r(1270, re);
      }, "init");
      vi.exports = { init: Ca };
    });
    Ai = I((Mh, _i) => {
      "use strict";
      p();
      var Z = 1e6;
      function Ta(r) {
        var e = r.readInt32BE(
          0
        ), t = r.readUInt32BE(4), n = "";
        e < 0 && (e = ~e + (t === 0), t = ~t + 1 >>> 0, n = "-");
        var i = "", s, o, u, c, h, l;
        {
          if (s = e % Z, e = e / Z >>> 0, o = 4294967296 * s + t, t = o / Z >>> 0, u = "" + (o - Z * t), t === 0 && e === 0) return n + u + i;
          for (c = "", h = 6 - u.length, l = 0; l < h; l++) c += "0";
          i = c + u + i;
        }
        {
          if (s = e % Z, e = e / Z >>> 0, o = 4294967296 * s + t, t = o / Z >>> 0, u = "" + (o - Z * t), t === 0 && e === 0) return n + u + i;
          for (c = "", h = 6 - u.length, l = 0; l < h; l++) c += "0";
          i = c + u + i;
        }
        {
          if (s = e % Z, e = e / Z >>> 0, o = 4294967296 * s + t, t = o / Z >>> 0, u = "" + (o - Z * t), t === 0 && e === 0) return n + u + i;
          for (c = "", h = 6 - u.length, l = 0; l < h; l++) c += "0";
          i = c + u + i;
        }
        return s = e % Z, o = 4294967296 * s + t, u = "" + o % Z, n + u + i;
      }
      a(Ta, "readInt8");
      _i.exports = Ta;
    });
    Bi = I((Uh, Pi) => {
      p();
      var Ia = Ai(), F = a(function(r, e, t, n, i) {
        t = t || 0, n = n || false, i = i || function(C, B, W) {
          return C * Math.pow(2, W) + B;
        };
        var s = t >> 3, o = a(function(C) {
          return n ? ~C & 255 : C;
        }, "inv"), u = 255, c = 8 - t % 8;
        e < c && (u = 255 << 8 - e & 255, c = e), t && (u = u >> t % 8);
        var h = 0;
        t % 8 + e >= 8 && (h = i(0, o(r[s]) & u, c));
        for (var l = e + t >> 3, d = s + 1; d < l; d++) h = i(h, o(r[d]), 8);
        var b = (e + t) % 8;
        return b > 0 && (h = i(h, o(r[l]) >> 8 - b, b)), h;
      }, "parseBits"), Ii = a(function(r, e, t) {
        var n = Math.pow(2, t - 1) - 1, i = F(r, 1), s = F(r, t, 1);
        if (s === 0) return 0;
        var o = 1, u = a(function(h, l, d) {
          h === 0 && (h = 1);
          for (var b = 1; b <= d; b++) o /= 2, (l & 1 << d - b) > 0 && (h += o);
          return h;
        }, "parsePrecisionBits"), c = F(r, e, t + 1, false, u);
        return s == Math.pow(2, t + 1) - 1 ? c === 0 ? i === 0 ? 1 / 0 : -1 / 0 : NaN : (i === 0 ? 1 : -1) * Math.pow(2, s - n) * c;
      }, "parseFloatFromBits"), Pa = a(function(r) {
        return F(r, 1) == 1 ? -1 * (F(r, 15, 1, true) + 1) : F(r, 15, 1);
      }, "parseInt16"), Ci = a(function(r) {
        return F(r, 1) == 1 ? -1 * (F(
          r,
          31,
          1,
          true
        ) + 1) : F(r, 31, 1);
      }, "parseInt32"), Ba = a(function(r) {
        return Ii(r, 23, 8);
      }, "parseFloat32"), La = a(function(r) {
        return Ii(r, 52, 11);
      }, "parseFloat64"), Ra = a(function(r) {
        var e = F(r, 16, 32);
        if (e == 49152) return NaN;
        for (var t = Math.pow(1e4, F(r, 16, 16)), n = 0, i = [], s = F(r, 16), o = 0; o < s; o++) n += F(r, 16, 64 + 16 * o) * t, t /= 1e4;
        var u = Math.pow(10, F(r, 16, 48));
        return (e === 0 ? 1 : -1) * Math.round(n * u) / u;
      }, "parseNumeric"), Ti = a(function(r, e) {
        var t = F(
          e,
          1
        ), n = F(e, 63, 1), i = new Date((t === 0 ? 1 : -1) * n / 1e3 + 9466848e5);
        return r || i.setTime(i.getTime() + i.getTimezoneOffset() * 6e4), i.usec = n % 1e3, i.getMicroSeconds = function() {
          return this.usec;
        }, i.setMicroSeconds = function(s) {
          this.usec = s;
        }, i.getUTCMicroSeconds = function() {
          return this.usec;
        }, i;
      }, "parseDate"), ze = a(function(r) {
        for (var e = F(r, 32), t = F(r, 32, 32), n = F(r, 32, 64), i = 96, s = [], o = 0; o < e; o++) s[o] = F(r, 32, i), i += 32, i += 32;
        var u = a(function(h) {
          var l = F(r, 32, i);
          if (i += 32, l == 4294967295) return null;
          var d;
          if (h == 23 || h == 20) return d = F(r, l * 8, i), i += l * 8, d;
          if (h == 25) return d = r.toString(this.encoding, i >> 3, (i += l << 3) >> 3), d;
          console.log("ERROR: ElementType not implemented: " + h);
        }, "parseElement"), c = a(function(h, l) {
          var d = [], b;
          if (h.length > 1) {
            var C = h.shift();
            for (b = 0; b < C; b++) d[b] = c(h, l);
            h.unshift(
              C
            );
          } else for (b = 0; b < h[0]; b++) d[b] = u(l);
          return d;
        }, "parse");
        return c(s, n);
      }, "parseArray"), Fa = a(function(r) {
        return r.toString("utf8");
      }, "parseText"), Ma = a(function(r) {
        return r === null ? null : F(r, 8) > 0;
      }, "parseBool"), Da = a(function(r) {
        r(20, Ia), r(21, Pa), r(23, Ci), r(
          26,
          Ci
        ), r(1700, Ra), r(700, Ba), r(701, La), r(16, Ma), r(1114, Ti.bind(null, false)), r(1184, Ti.bind(
          null,
          true
        )), r(1e3, ze), r(1007, ze), r(1016, ze), r(1008, ze), r(1009, ze), r(25, Fa);
      }, "init");
      Pi.exports = { init: Da };
    });
    Ri = I((qh, Li) => {
      p();
      Li.exports = {
        BOOL: 16,
        BYTEA: 17,
        CHAR: 18,
        INT8: 20,
        INT2: 21,
        INT4: 23,
        REGPROC: 24,
        TEXT: 25,
        OID: 26,
        TID: 27,
        XID: 28,
        CID: 29,
        JSON: 114,
        XML: 142,
        PG_NODE_TREE: 194,
        SMGR: 210,
        PATH: 602,
        POLYGON: 604,
        CIDR: 650,
        FLOAT4: 700,
        FLOAT8: 701,
        ABSTIME: 702,
        RELTIME: 703,
        TINTERVAL: 704,
        CIRCLE: 718,
        MACADDR8: 774,
        MONEY: 790,
        MACADDR: 829,
        INET: 869,
        ACLITEM: 1033,
        BPCHAR: 1042,
        VARCHAR: 1043,
        DATE: 1082,
        TIME: 1083,
        TIMESTAMP: 1114,
        TIMESTAMPTZ: 1184,
        INTERVAL: 1186,
        TIMETZ: 1266,
        BIT: 1560,
        VARBIT: 1562,
        NUMERIC: 1700,
        REFCURSOR: 1790,
        REGPROCEDURE: 2202,
        REGOPER: 2203,
        REGOPERATOR: 2204,
        REGCLASS: 2205,
        REGTYPE: 2206,
        UUID: 2950,
        TXID_SNAPSHOT: 2970,
        PG_LSN: 3220,
        PG_NDISTINCT: 3361,
        PG_DEPENDENCIES: 3402,
        TSVECTOR: 3614,
        TSQUERY: 3615,
        GTSVECTOR: 3642,
        REGCONFIG: 3734,
        REGDICTIONARY: 3769,
        JSONB: 3802,
        REGNAMESPACE: 4089,
        REGROLE: 4096
      };
    });
    Je = I((Ze) => {
      p();
      var ka = Ei(), Ua = Bi(), Oa = Ht(), Na = Ri();
      Ze.getTypeParser = qa;
      Ze.setTypeParser = Qa;
      Ze.arrayParser = Oa;
      Ze.builtins = Na;
      var Ye = { text: {}, binary: {} };
      function Fi(r) {
        return String(
          r
        );
      }
      a(Fi, "noParse");
      function qa(r, e) {
        return e = e || "text", Ye[e] && Ye[e][r] || Fi;
      }
      a(
        qa,
        "getTypeParser"
      );
      function Qa(r, e, t) {
        typeof e == "function" && (t = e, e = "text"), Ye[e][r] = t;
      }
      a(Qa, "setTypeParser");
      ka.init(function(r, e) {
        Ye.text[r] = e;
      });
      Ua.init(function(r, e) {
        Ye.binary[r] = e;
      });
    });
    Xe = I((Gh, Jt) => {
      "use strict";
      p();
      Jt.exports = {
        host: "localhost",
        user: m.platform === "win32" ? m.env.USERNAME : m.env.USER,
        database: void 0,
        password: null,
        connectionString: void 0,
        port: 5432,
        rows: 0,
        binary: false,
        max: 10,
        idleTimeoutMillis: 3e4,
        client_encoding: "",
        ssl: false,
        application_name: void 0,
        fallback_application_name: void 0,
        options: void 0,
        parseInputDatesAsUTC: false,
        statement_timeout: false,
        lock_timeout: false,
        idle_in_transaction_session_timeout: false,
        query_timeout: false,
        connect_timeout: 0,
        keepalives: 1,
        keepalives_idle: 0
      };
      var Me = Je(), Wa = Me.getTypeParser(
        20,
        "text"
      ), ja = Me.getTypeParser(1016, "text");
      Jt.exports.__defineSetter__("parseInt8", function(r) {
        Me.setTypeParser(20, "text", r ? Me.getTypeParser(23, "text") : Wa), Me.setTypeParser(1016, "text", r ? Me.getTypeParser(1007, "text") : ja);
      });
    });
    et = I((Vh, Di) => {
      "use strict";
      p();
      var Ha = (Qt(), N(qt)), Ga = Xe();
      function $a(r) {
        var e = r.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        return '"' + e + '"';
      }
      a($a, "escapeElement");
      function Mi(r) {
        for (var e = "{", t = 0; t < r.length; t++) t > 0 && (e = e + ","), r[t] === null || typeof r[t] > "u" ? e = e + "NULL" : Array.isArray(r[t]) ? e = e + Mi(r[t]) : r[t] instanceof y ? e += "\\\\x" + r[t].toString("hex") : e += $a(lt(r[t]));
        return e = e + "}", e;
      }
      a(Mi, "arrayString");
      var lt = a(function(r, e) {
        if (r == null) return null;
        if (r instanceof y) return r;
        if (ArrayBuffer.isView(r)) {
          var t = y.from(r.buffer, r.byteOffset, r.byteLength);
          return t.length === r.byteLength ? t : t.slice(
            r.byteOffset,
            r.byteOffset + r.byteLength
          );
        }
        return r instanceof Date ? Ga.parseInputDatesAsUTC ? za(r) : Ka(r) : Array.isArray(r) ? Mi(r) : typeof r == "object" ? Va(r, e) : r.toString();
      }, "prepareValue");
      function Va(r, e) {
        if (r && typeof r.toPostgres == "function") {
          if (e = e || [], e.indexOf(r) !== -1) throw new Error('circular reference detected while preparing "' + r + '" for query');
          return e.push(r), lt(r.toPostgres(lt), e);
        }
        return JSON.stringify(r);
      }
      a(Va, "prepareObject");
      function H(r, e) {
        for (r = "" + r; r.length < e; ) r = "0" + r;
        return r;
      }
      a(
        H,
        "pad"
      );
      function Ka(r) {
        var e = -r.getTimezoneOffset(), t = r.getFullYear(), n = t < 1;
        n && (t = Math.abs(t) + 1);
        var i = H(t, 4) + "-" + H(r.getMonth() + 1, 2) + "-" + H(r.getDate(), 2) + "T" + H(r.getHours(), 2) + ":" + H(r.getMinutes(), 2) + ":" + H(r.getSeconds(), 2) + "." + H(
          r.getMilliseconds(),
          3
        );
        return e < 0 ? (i += "-", e *= -1) : i += "+", i += H(Math.floor(e / 60), 2) + ":" + H(e % 60, 2), n && (i += " BC"), i;
      }
      a(Ka, "dateToString");
      function za(r) {
        var e = r.getUTCFullYear(), t = e < 1;
        t && (e = Math.abs(e) + 1);
        var n = H(e, 4) + "-" + H(r.getUTCMonth() + 1, 2) + "-" + H(r.getUTCDate(), 2) + "T" + H(r.getUTCHours(), 2) + ":" + H(r.getUTCMinutes(), 2) + ":" + H(r.getUTCSeconds(), 2) + "." + H(r.getUTCMilliseconds(), 3);
        return n += "+00:00", t && (n += " BC"), n;
      }
      a(za, "dateToStringUTC");
      function Ya(r, e, t) {
        return r = typeof r == "string" ? { text: r } : r, e && (typeof e == "function" ? r.callback = e : r.values = e), t && (r.callback = t), r;
      }
      a(Ya, "normalizeQueryConfig");
      var Xt = a(function(r) {
        return Ha.createHash("md5").update(r, "utf-8").digest("hex");
      }, "md5"), Za = a(function(r, e, t) {
        var n = Xt(e + r), i = Xt(y.concat([y.from(n), t]));
        return "md5" + i;
      }, "postgresMd5PasswordHash");
      Di.exports = { prepareValue: a(function(e) {
        return lt(
          e
        );
      }, "prepareValueWrapper"), normalizeQueryConfig: Ya, postgresMd5PasswordHash: Za, md5: Xt };
    });
    qi = I((Yh, Ni) => {
      "use strict";
      p();
      var er = (Qt(), N(qt));
      function Ja(r) {
        if (r.indexOf(
          "SCRAM-SHA-256"
        ) === -1) throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");
        let e = er.randomBytes(18).toString("base64");
        return { mechanism: "SCRAM-SHA-256", clientNonce: e, response: "n,,n=*,r=" + e, message: "SASLInitialResponse" };
      }
      a(Ja, "startSession");
      function Xa(r, e, t) {
        if (r.message !== "SASLInitialResponse") throw new Error(
          "SASL: Last message was not SASLInitialResponse"
        );
        if (typeof e != "string") throw new Error(
          "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"
        );
        if (typeof t != "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
        let n = ru(t);
        if (n.nonce.startsWith(r.clientNonce)) {
          if (n.nonce.length === r.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
        } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
        var i = y.from(n.salt, "base64"), s = su(
          e,
          i,
          n.iteration
        ), o = De(s, "Client Key"), u = iu(o), c = "n=*,r=" + r.clientNonce, h = "r=" + n.nonce + ",s=" + n.salt + ",i=" + n.iteration, l = "c=biws,r=" + n.nonce, d = c + "," + h + "," + l, b = De(u, d), C = Oi(
          o,
          b
        ), B = C.toString("base64"), W = De(s, "Server Key"), X = De(W, d);
        r.message = "SASLResponse", r.serverSignature = X.toString("base64"), r.response = l + ",p=" + B;
      }
      a(Xa, "continueSession");
      function eu(r, e) {
        if (r.message !== "SASLResponse") throw new Error("SASL: Last message was not SASLResponse");
        if (typeof e != "string") throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
        let { serverSignature: t } = nu(
          e
        );
        if (t !== r.serverSignature) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
      }
      a(eu, "finalizeSession");
      function tu(r) {
        if (typeof r != "string") throw new TypeError("SASL: text must be a string");
        return r.split("").map(
          (e, t) => r.charCodeAt(t)
        ).every((e) => e >= 33 && e <= 43 || e >= 45 && e <= 126);
      }
      a(tu, "isPrintableChars");
      function ki(r) {
        return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(r);
      }
      a(ki, "isBase64");
      function Ui(r) {
        if (typeof r != "string") throw new TypeError(
          "SASL: attribute pairs text must be a string"
        );
        return new Map(r.split(",").map((e) => {
          if (!/^.=/.test(e)) throw new Error("SASL: Invalid attribute pair entry");
          let t = e[0], n = e.substring(2);
          return [t, n];
        }));
      }
      a(Ui, "parseAttributePairs");
      function ru(r) {
        let e = Ui(
          r
        ), t = e.get("r");
        if (t) {
          if (!tu(t)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
        } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
        let n = e.get("s");
        if (n) {
          if (!ki(n)) throw new Error(
            "SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64"
          );
        } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
        let i = e.get("i");
        if (i) {
          if (!/^[1-9][0-9]*$/.test(i)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
        } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
        let s = parseInt(i, 10);
        return { nonce: t, salt: n, iteration: s };
      }
      a(ru, "parseServerFirstMessage");
      function nu(r) {
        let t = Ui(r).get("v");
        if (t) {
          if (!ki(t)) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
        } else throw new Error(
          "SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing"
        );
        return { serverSignature: t };
      }
      a(nu, "parseServerFinalMessage");
      function Oi(r, e) {
        if (!y.isBuffer(r)) throw new TypeError(
          "first argument must be a Buffer"
        );
        if (!y.isBuffer(e)) throw new TypeError("second argument must be a Buffer");
        if (r.length !== e.length) throw new Error("Buffer lengths must match");
        if (r.length === 0) throw new Error("Buffers cannot be empty");
        return y.from(r.map((t, n) => r[n] ^ e[n]));
      }
      a(Oi, "xorBuffers");
      function iu(r) {
        return er.createHash(
          "sha256"
        ).update(r).digest();
      }
      a(iu, "sha256");
      function De(r, e) {
        return er.createHmac(
          "sha256",
          r
        ).update(e).digest();
      }
      a(De, "hmacSha256");
      function su(r, e, t) {
        for (var n = De(
          r,
          y.concat([e, y.from([0, 0, 0, 1])])
        ), i = n, s = 0; s < t - 1; s++) n = De(r, n), i = Oi(i, n);
        return i;
      }
      a(su, "Hi");
      Ni.exports = { startSession: Ja, continueSession: Xa, finalizeSession: eu };
    });
    tr = {};
    ie(tr, { join: () => ou });
    rr = z(() => {
      "use strict";
      p();
      a(ou, "join");
    });
    nr = {};
    ie(nr, { stat: () => au });
    ir = z(
      () => {
        "use strict";
        p();
        a(au, "stat");
      }
    );
    sr = {};
    ie(sr, { default: () => uu });
    or = z(() => {
      "use strict";
      p();
      uu = {};
    });
    Qi = {};
    ie(Qi, { StringDecoder: () => ar });
    Wi = z(() => {
      "use strict";
      p();
      ur = class ur {
        constructor(e) {
          _(this, "td");
          this.td = new TextDecoder(e);
        }
        write(e) {
          return this.td.decode(e, { stream: true });
        }
        end(e) {
          return this.td.decode(e);
        }
      };
      a(ur, "StringDecoder");
      ar = ur;
    });
    $i = I((ol, Gi) => {
      "use strict";
      p();
      var { Transform: cu } = (or(), N(sr)), { StringDecoder: hu } = (Wi(), N(Qi)), be = /* @__PURE__ */ Symbol("last"), ft = /* @__PURE__ */ Symbol("decoder");
      function lu(r, e, t) {
        let n;
        if (this.overflow) {
          if (n = this[ft].write(r).split(this.matcher), n.length === 1) return t();
          n.shift(), this.overflow = false;
        } else this[be] += this[ft].write(r), n = this[be].split(this.matcher);
        this[be] = n.pop();
        for (let i = 0; i < n.length; i++) try {
          Hi(this, this.mapper(n[i]));
        } catch (s) {
          return t(
            s
          );
        }
        if (this.overflow = this[be].length > this.maxLength, this.overflow && !this.skipOverflow) {
          t(new Error("maximum buffer reached"));
          return;
        }
        t();
      }
      a(lu, "transform");
      function fu(r) {
        if (this[be] += this[ft].end(), this[be]) try {
          Hi(this, this.mapper(this[be]));
        } catch (e) {
          return r(e);
        }
        r();
      }
      a(fu, "flush");
      function Hi(r, e) {
        e !== void 0 && r.push(e);
      }
      a(Hi, "push");
      function ji(r) {
        return r;
      }
      a(ji, "noop");
      function pu(r, e, t) {
        switch (r = r || /\r?\n/, e = e || ji, t = t || {}, arguments.length) {
          case 1:
            typeof r == "function" ? (e = r, r = /\r?\n/) : typeof r == "object" && !(r instanceof RegExp) && !r[Symbol.split] && (t = r, r = /\r?\n/);
            break;
          case 2:
            typeof r == "function" ? (t = e, e = r, r = /\r?\n/) : typeof e == "object" && (t = e, e = ji);
        }
        t = Object.assign({}, t), t.autoDestroy = true, t.transform = lu, t.flush = fu, t.readableObjectMode = true;
        let n = new cu(t);
        return n[be] = "", n[ft] = new hu("utf8"), n.matcher = r, n.mapper = e, n.maxLength = t.maxLength, n.skipOverflow = t.skipOverflow || false, n.overflow = false, n._destroy = function(i, s) {
          this._writableState.errorEmitted = false, s(i);
        }, n;
      }
      a(pu, "split");
      Gi.exports = pu;
    });
    zi = I((cl, pe) => {
      "use strict";
      p();
      var Vi = (rr(), N(tr)), du = (or(), N(sr)).Stream, yu = $i(), Ki = (He(), N(je)), mu = 5432, pt = m.platform === "win32", tt = m.stderr, gu = 56, wu = 7, bu = 61440, Su = 32768;
      function xu(r) {
        return (r & bu) == Su;
      }
      a(xu, "isRegFile");
      var ke = [
        "host",
        "port",
        "database",
        "user",
        "password"
      ], cr = ke.length, vu = ke[cr - 1];
      function hr() {
        var r = tt instanceof du && tt.writable === true;
        if (r) {
          var e = Array.prototype.slice.call(arguments).concat(`
`);
          tt.write(Ki.format.apply(Ki, e));
        }
      }
      a(hr, "warn");
      Object.defineProperty(
        pe.exports,
        "isWin",
        { get: a(function() {
          return pt;
        }, "get"), set: a(function(r) {
          pt = r;
        }, "set") }
      );
      pe.exports.warnTo = function(r) {
        var e = tt;
        return tt = r, e;
      };
      pe.exports.getFileName = function(r) {
        var e = r || m.env, t = e.PGPASSFILE || (pt ? Vi.join(e.APPDATA || "./", "postgresql", "pgpass.conf") : Vi.join(e.HOME || "./", ".pgpass"));
        return t;
      };
      pe.exports.usePgPass = function(r, e) {
        return Object.prototype.hasOwnProperty.call(m.env, "PGPASSWORD") ? false : pt ? true : (e = e || "<unkn>", xu(r.mode) ? r.mode & (gu | wu) ? (hr('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', e), false) : true : (hr('WARNING: password file "%s" is not a plain file', e), false));
      };
      var Eu = pe.exports.match = function(r, e) {
        return ke.slice(0, -1).reduce(function(t, n, i) {
          return i == 1 && Number(r[n] || mu) === Number(
            e[n]
          ) ? t && true : t && (e[n] === "*" || e[n] === r[n]);
        }, true);
      };
      pe.exports.getPassword = function(r, e, t) {
        var n, i = e.pipe(yu());
        function s(c) {
          var h = _u(c);
          h && Au(h) && Eu(r, h) && (n = h[vu], i.end());
        }
        a(s, "onLine");
        var o = a(function() {
          e.destroy(), t(n);
        }, "onEnd"), u = a(function(c) {
          e.destroy(), hr("WARNING: error on reading file: %s", c), t(void 0);
        }, "onErr");
        e.on("error", u), i.on("data", s).on("end", o).on("error", u);
      };
      var _u = pe.exports.parseLine = function(r) {
        if (r.length < 11 || r.match(/^\s+#/)) return null;
        for (var e = "", t = "", n = 0, i = 0, s = 0, o = {}, u = false, c = a(function(l, d, b) {
          var C = r.substring(d, b);
          Object.hasOwnProperty.call(
            m.env,
            "PGPASS_NO_DEESCAPE"
          ) || (C = C.replace(/\\([:\\])/g, "$1")), o[ke[l]] = C;
        }, "addToObj"), h = 0; h < r.length - 1; h += 1) {
          if (e = r.charAt(h + 1), t = r.charAt(h), u = n == cr - 1, u) {
            c(n, i);
            break;
          }
          h >= 0 && e == ":" && t !== "\\" && (c(n, i, h + 1), i = h + 2, n += 1);
        }
        return o = Object.keys(o).length === cr ? o : null, o;
      }, Au = pe.exports.isValidEntry = function(r) {
        for (var e = { 0: function(o) {
          return o.length > 0;
        }, 1: function(o) {
          return o === "*" ? true : (o = Number(o), isFinite(o) && o > 0 && o < 9007199254740992 && Math.floor(o) === o);
        }, 2: function(o) {
          return o.length > 0;
        }, 3: function(o) {
          return o.length > 0;
        }, 4: function(o) {
          return o.length > 0;
        } }, t = 0; t < ke.length; t += 1) {
          var n = e[t], i = r[ke[t]] || "", s = n(i);
          if (!s) return false;
        }
        return true;
      };
    });
    Zi = I((pl, lr) => {
      "use strict";
      p();
      var fl = (rr(), N(tr)), Yi = (ir(), N(nr)), dt = zi();
      lr.exports = function(r, e) {
        var t = dt.getFileName();
        Yi.stat(t, function(n, i) {
          if (n || !dt.usePgPass(i, t)) return e(void 0);
          var s = Yi.createReadStream(t);
          dt.getPassword(
            r,
            s,
            e
          );
        });
      };
      lr.exports.warnTo = dt.warnTo;
    });
    mt = I((yl, Ji) => {
      "use strict";
      p();
      var Cu = Je();
      function yt(r) {
        this._types = r || Cu, this.text = {}, this.binary = {};
      }
      a(yt, "TypeOverrides");
      yt.prototype.getOverrides = function(r) {
        switch (r) {
          case "text":
            return this.text;
          case "binary":
            return this.binary;
          default:
            return {};
        }
      };
      yt.prototype.setTypeParser = function(r, e, t) {
        typeof e == "function" && (t = e, e = "text"), this.getOverrides(e)[r] = t;
      };
      yt.prototype.getTypeParser = function(r, e) {
        return e = e || "text", this.getOverrides(e)[r] || this._types.getTypeParser(r, e);
      };
      Ji.exports = yt;
    });
    Xi = {};
    ie(Xi, { default: () => Tu });
    es = z(() => {
      "use strict";
      p();
      Tu = {};
    });
    ts = {};
    ie(ts, { parse: () => fr });
    pr = z(() => {
      "use strict";
      p();
      a(fr, "parse");
    });
    ns = I((xl, rs) => {
      "use strict";
      p();
      var Iu = (pr(), N(ts)), dr = (ir(), N(nr));
      function yr(r) {
        if (r.charAt(0) === "/") {
          var t = r.split(" ");
          return { host: t[0], database: t[1] };
        }
        var e = Iu.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(r) ? encodeURI(r).replace(
          /\%25(\d\d)/g,
          "%$1"
        ) : r, true), t = e.query;
        for (var n in t) Array.isArray(t[n]) && (t[n] = t[n][t[n].length - 1]);
        var i = (e.auth || ":").split(":");
        if (t.user = i[0], t.password = i.splice(1).join(":"), t.port = e.port, e.protocol == "socket:") return t.host = decodeURI(e.pathname), t.database = e.query.db, t.client_encoding = e.query.encoding, t;
        t.host || (t.host = e.hostname);
        var s = e.pathname;
        if (!t.host && s && /^%2f/i.test(s)) {
          var o = s.split("/");
          t.host = decodeURIComponent(
            o[0]
          ), s = o.splice(1).join("/");
        }
        switch (s && s.charAt(0) === "/" && (s = s.slice(1) || null), t.database = s && decodeURI(s), (t.ssl === "true" || t.ssl === "1") && (t.ssl = true), t.ssl === "0" && (t.ssl = false), (t.sslcert || t.sslkey || t.sslrootcert || t.sslmode) && (t.ssl = {}), t.sslcert && (t.ssl.cert = dr.readFileSync(t.sslcert).toString()), t.sslkey && (t.ssl.key = dr.readFileSync(
          t.sslkey
        ).toString()), t.sslrootcert && (t.ssl.ca = dr.readFileSync(t.sslrootcert).toString()), t.sslmode) {
          case "disable": {
            t.ssl = false;
            break;
          }
          case "prefer":
          case "require":
          case "verify-ca":
          case "verify-full":
            break;
          case "no-verify": {
            t.ssl.rejectUnauthorized = false;
            break;
          }
        }
        return t;
      }
      a(yr, "parse");
      rs.exports = yr;
      yr.parse = yr;
    });
    gt = I((_l, os) => {
      "use strict";
      p();
      var Pu = (es(), N(Xi)), ss = Xe(), is = ns().parse, $ = a(
        function(r, e, t) {
          return t === void 0 ? t = m.env["PG" + r.toUpperCase()] : t === false || (t = m.env[t]), e[r] || t || ss[r];
        },
        "val"
      ), Bu = a(function() {
        switch (m.env.PGSSLMODE) {
          case "disable":
            return false;
          case "prefer":
          case "require":
          case "verify-ca":
          case "verify-full":
            return true;
          case "no-verify":
            return { rejectUnauthorized: false };
        }
        return ss.ssl;
      }, "readSSLConfigFromEnvironment"), Ue = a(
        function(r) {
          return "'" + ("" + r).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
        },
        "quoteParamValue"
      ), ne = a(function(r, e, t) {
        var n = e[t];
        n != null && r.push(t + "=" + Ue(n));
      }, "add"), gr = class gr {
        constructor(e) {
          e = typeof e == "string" ? is(e) : e || {}, e.connectionString && (e = Object.assign({}, e, is(e.connectionString))), this.user = $("user", e), this.database = $("database", e), this.database === void 0 && (this.database = this.user), this.port = parseInt(
            $("port", e),
            10
          ), this.host = $("host", e), Object.defineProperty(this, "password", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: $("password", e)
          }), this.binary = $("binary", e), this.options = $("options", e), this.ssl = typeof e.ssl > "u" ? Bu() : e.ssl, typeof this.ssl == "string" && this.ssl === "true" && (this.ssl = true), this.ssl === "no-verify" && (this.ssl = { rejectUnauthorized: false }), this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this.client_encoding = $("client_encoding", e), this.replication = $("replication", e), this.isDomainSocket = !(this.host || "").indexOf("/"), this.application_name = $("application_name", e, "PGAPPNAME"), this.fallback_application_name = $("fallback_application_name", e, false), this.statement_timeout = $("statement_timeout", e, false), this.lock_timeout = $(
            "lock_timeout",
            e,
            false
          ), this.idle_in_transaction_session_timeout = $("idle_in_transaction_session_timeout", e, false), this.query_timeout = $("query_timeout", e, false), e.connectionTimeoutMillis === void 0 ? this.connect_timeout = m.env.PGCONNECT_TIMEOUT || 0 : this.connect_timeout = Math.floor(e.connectionTimeoutMillis / 1e3), e.keepAlive === false ? this.keepalives = 0 : e.keepAlive === true && (this.keepalives = 1), typeof e.keepAliveInitialDelayMillis == "number" && (this.keepalives_idle = Math.floor(e.keepAliveInitialDelayMillis / 1e3));
        }
        getLibpqConnectionString(e) {
          var t = [];
          ne(t, this, "user"), ne(t, this, "password"), ne(t, this, "port"), ne(t, this, "application_name"), ne(t, this, "fallback_application_name"), ne(t, this, "connect_timeout"), ne(
            t,
            this,
            "options"
          );
          var n = typeof this.ssl == "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
          if (ne(t, n, "sslmode"), ne(t, n, "sslca"), ne(t, n, "sslkey"), ne(t, n, "sslcert"), ne(t, n, "sslrootcert"), this.database && t.push("dbname=" + Ue(this.database)), this.replication && t.push("replication=" + Ue(this.replication)), this.host && t.push("host=" + Ue(this.host)), this.isDomainSocket) return e(null, t.join(" "));
          this.client_encoding && t.push("client_encoding=" + Ue(this.client_encoding)), Pu.lookup(this.host, function(i, s) {
            return i ? e(i, null) : (t.push("hostaddr=" + Ue(s)), e(null, t.join(" ")));
          });
        }
      };
      a(gr, "ConnectionParameters");
      var mr = gr;
      os.exports = mr;
    });
    cs = I((Tl, us) => {
      "use strict";
      p();
      var Lu = Je(), as = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/, br = class br {
        constructor(e, t) {
          this.command = null, this.rowCount = null, this.oid = null, this.rows = [], this.fields = [], this._parsers = void 0, this._types = t, this.RowCtor = null, this.rowAsArray = e === "array", this.rowAsArray && (this.parseRow = this._parseRowAsArray);
        }
        addCommandComplete(e) {
          var t;
          e.text ? t = as.exec(e.text) : t = as.exec(e.command), t && (this.command = t[1], t[3] ? (this.oid = parseInt(t[2], 10), this.rowCount = parseInt(t[3], 10)) : t[2] && (this.rowCount = parseInt(
            t[2],
            10
          )));
        }
        _parseRowAsArray(e) {
          for (var t = new Array(e.length), n = 0, i = e.length; n < i; n++) {
            var s = e[n];
            s !== null ? t[n] = this._parsers[n](s) : t[n] = null;
          }
          return t;
        }
        parseRow(e) {
          for (var t = {}, n = 0, i = e.length; n < i; n++) {
            var s = e[n], o = this.fields[n].name;
            s !== null ? t[o] = this._parsers[n](
              s
            ) : t[o] = null;
          }
          return t;
        }
        addRow(e) {
          this.rows.push(e);
        }
        addFields(e) {
          this.fields = e, this.fields.length && (this._parsers = new Array(e.length));
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            this._types ? this._parsers[t] = this._types.getTypeParser(n.dataTypeID, n.format || "text") : this._parsers[t] = Lu.getTypeParser(n.dataTypeID, n.format || "text");
          }
        }
      };
      a(br, "Result");
      var wr = br;
      us.exports = wr;
    });
    ps = I((Bl, fs) => {
      "use strict";
      p();
      var { EventEmitter: Ru } = we(), hs = cs(), ls = et(), xr = class xr extends Ru {
        constructor(e, t, n) {
          super(), e = ls.normalizeQueryConfig(e, t, n), this.text = e.text, this.values = e.values, this.rows = e.rows, this.types = e.types, this.name = e.name, this.binary = e.binary, this.portal = e.portal || "", this.callback = e.callback, this._rowMode = e.rowMode, m.domain && e.callback && (this.callback = m.domain.bind(e.callback)), this._result = new hs(this._rowMode, this.types), this._results = this._result, this.isPreparedStatement = false, this._canceledDueToError = false, this._promise = null;
        }
        requiresPreparation() {
          return this.name || this.rows ? true : !this.text || !this.values ? false : this.values.length > 0;
        }
        _checkForMultirow() {
          this._result.command && (Array.isArray(this._results) || (this._results = [this._result]), this._result = new hs(
            this._rowMode,
            this.types
          ), this._results.push(this._result));
        }
        handleRowDescription(e) {
          this._checkForMultirow(), this._result.addFields(e.fields), this._accumulateRows = this.callback || !this.listeners("row").length;
        }
        handleDataRow(e) {
          let t;
          if (!this._canceledDueToError) {
            try {
              t = this._result.parseRow(e.fields);
            } catch (n) {
              this._canceledDueToError = n;
              return;
            }
            this.emit("row", t, this._result), this._accumulateRows && this._result.addRow(t);
          }
        }
        handleCommandComplete(e, t) {
          this._checkForMultirow(), this._result.addCommandComplete(e), this.rows && t.sync();
        }
        handleEmptyQuery(e) {
          this.rows && e.sync();
        }
        handleError(e, t) {
          if (this._canceledDueToError && (e = this._canceledDueToError, this._canceledDueToError = false), this.callback) return this.callback(e);
          this.emit("error", e);
        }
        handleReadyForQuery(e) {
          if (this._canceledDueToError) return this.handleError(
            this._canceledDueToError,
            e
          );
          if (this.callback) try {
            this.callback(null, this._results);
          } catch (t) {
            m.nextTick(() => {
              throw t;
            });
          }
          this.emit("end", this._results);
        }
        submit(e) {
          if (typeof this.text != "string" && typeof this.name != "string") return new Error("A query must have either text or a name. Supplying neither is unsupported.");
          let t = e.parsedStatements[this.name];
          return this.text && t && this.text !== t ? new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`) : this.values && !Array.isArray(this.values) ? new Error("Query values must be an array") : (this.requiresPreparation() ? this.prepare(e) : e.query(this.text), null);
        }
        hasBeenParsed(e) {
          return this.name && e.parsedStatements[this.name];
        }
        handlePortalSuspended(e) {
          this._getRows(e, this.rows);
        }
        _getRows(e, t) {
          e.execute(
            { portal: this.portal, rows: t }
          ), t ? e.flush() : e.sync();
        }
        prepare(e) {
          this.isPreparedStatement = true, this.hasBeenParsed(e) || e.parse({ text: this.text, name: this.name, types: this.types });
          try {
            e.bind({ portal: this.portal, statement: this.name, values: this.values, binary: this.binary, valueMapper: ls.prepareValue });
          } catch (t) {
            this.handleError(t, e);
            return;
          }
          e.describe(
            { type: "P", name: this.portal || "" }
          ), this._getRows(e, this.rows);
        }
        handleCopyInResponse(e) {
          e.sendCopyFail("No source stream defined");
        }
        handleCopyData(e, t) {
        }
      };
      a(xr, "Query");
      var Sr = xr;
      fs.exports = Sr;
    });
    ys = {};
    ie(ys, { Socket: () => _e, isIP: () => Fu });
    wt = z(() => {
      "use strict";
      p();
      ds = Te(we(), 1);
      a(Fu, "isIP");
      Mu = a((r) => r.replace(
        /^[^.]+\./,
        "api."
      ), "transformHost"), E = class E2 extends ds.EventEmitter {
        constructor() {
          super(...arguments);
          _(this, "opts", {});
          _(this, "connecting", false);
          _(this, "pending", true);
          _(
            this,
            "writable",
            true
          );
          _(this, "encrypted", false);
          _(this, "authorized", false);
          _(this, "destroyed", false);
          _(
            this,
            "ws",
            null
          );
          _(this, "writeBuffer");
          _(this, "tlsState", 0);
          _(this, "tlsRead");
          _(this, "tlsWrite");
        }
        static get poolQueryViaFetch() {
          return E2.opts.poolQueryViaFetch ?? E2.defaults.poolQueryViaFetch;
        }
        static set poolQueryViaFetch(t) {
          E2.opts.poolQueryViaFetch = t;
        }
        static get fetchEndpoint() {
          return E2.opts.fetchEndpoint ?? E2.defaults.fetchEndpoint;
        }
        static set fetchEndpoint(t) {
          E2.opts.fetchEndpoint = t;
        }
        static get fetchConnectionCache() {
          return true;
        }
        static set fetchConnectionCache(t) {
          console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)");
        }
        static get fetchFunction() {
          return E2.opts.fetchFunction ?? E2.defaults.fetchFunction;
        }
        static set fetchFunction(t) {
          E2.opts.fetchFunction = t;
        }
        static get webSocketConstructor() {
          return E2.opts.webSocketConstructor ?? E2.defaults.webSocketConstructor;
        }
        static set webSocketConstructor(t) {
          E2.opts.webSocketConstructor = t;
        }
        get webSocketConstructor() {
          return this.opts.webSocketConstructor ?? E2.webSocketConstructor;
        }
        set webSocketConstructor(t) {
          this.opts.webSocketConstructor = t;
        }
        static get wsProxy() {
          return E2.opts.wsProxy ?? E2.defaults.wsProxy;
        }
        static set wsProxy(t) {
          E2.opts.wsProxy = t;
        }
        get wsProxy() {
          return this.opts.wsProxy ?? E2.wsProxy;
        }
        set wsProxy(t) {
          this.opts.wsProxy = t;
        }
        static get coalesceWrites() {
          return E2.opts.coalesceWrites ?? E2.defaults.coalesceWrites;
        }
        static set coalesceWrites(t) {
          E2.opts.coalesceWrites = t;
        }
        get coalesceWrites() {
          return this.opts.coalesceWrites ?? E2.coalesceWrites;
        }
        set coalesceWrites(t) {
          this.opts.coalesceWrites = t;
        }
        static get useSecureWebSocket() {
          return E2.opts.useSecureWebSocket ?? E2.defaults.useSecureWebSocket;
        }
        static set useSecureWebSocket(t) {
          E2.opts.useSecureWebSocket = t;
        }
        get useSecureWebSocket() {
          return this.opts.useSecureWebSocket ?? E2.useSecureWebSocket;
        }
        set useSecureWebSocket(t) {
          this.opts.useSecureWebSocket = t;
        }
        static get forceDisablePgSSL() {
          return E2.opts.forceDisablePgSSL ?? E2.defaults.forceDisablePgSSL;
        }
        static set forceDisablePgSSL(t) {
          E2.opts.forceDisablePgSSL = t;
        }
        get forceDisablePgSSL() {
          return this.opts.forceDisablePgSSL ?? E2.forceDisablePgSSL;
        }
        set forceDisablePgSSL(t) {
          this.opts.forceDisablePgSSL = t;
        }
        static get disableSNI() {
          return E2.opts.disableSNI ?? E2.defaults.disableSNI;
        }
        static set disableSNI(t) {
          E2.opts.disableSNI = t;
        }
        get disableSNI() {
          return this.opts.disableSNI ?? E2.disableSNI;
        }
        set disableSNI(t) {
          this.opts.disableSNI = t;
        }
        static get pipelineConnect() {
          return E2.opts.pipelineConnect ?? E2.defaults.pipelineConnect;
        }
        static set pipelineConnect(t) {
          E2.opts.pipelineConnect = t;
        }
        get pipelineConnect() {
          return this.opts.pipelineConnect ?? E2.pipelineConnect;
        }
        set pipelineConnect(t) {
          this.opts.pipelineConnect = t;
        }
        static get subtls() {
          return E2.opts.subtls ?? E2.defaults.subtls;
        }
        static set subtls(t) {
          E2.opts.subtls = t;
        }
        get subtls() {
          return this.opts.subtls ?? E2.subtls;
        }
        set subtls(t) {
          this.opts.subtls = t;
        }
        static get pipelineTLS() {
          return E2.opts.pipelineTLS ?? E2.defaults.pipelineTLS;
        }
        static set pipelineTLS(t) {
          E2.opts.pipelineTLS = t;
        }
        get pipelineTLS() {
          return this.opts.pipelineTLS ?? E2.pipelineTLS;
        }
        set pipelineTLS(t) {
          this.opts.pipelineTLS = t;
        }
        static get rootCerts() {
          return E2.opts.rootCerts ?? E2.defaults.rootCerts;
        }
        static set rootCerts(t) {
          E2.opts.rootCerts = t;
        }
        get rootCerts() {
          return this.opts.rootCerts ?? E2.rootCerts;
        }
        set rootCerts(t) {
          this.opts.rootCerts = t;
        }
        wsProxyAddrForHost(t, n) {
          let i = this.wsProxy;
          if (i === void 0) throw new Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");
          return typeof i == "function" ? i(t, n) : `${i}?address=${t}:${n}`;
        }
        setNoDelay() {
          return this;
        }
        setKeepAlive() {
          return this;
        }
        ref() {
          return this;
        }
        unref() {
          return this;
        }
        connect(t, n, i) {
          this.connecting = true, i && this.once("connect", i);
          let s = a(() => {
            this.connecting = false, this.pending = false, this.emit("connect"), this.emit("ready");
          }, "handleWebSocketOpen"), o = a((c, h = false) => {
            c.binaryType = "arraybuffer", c.addEventListener("error", (l) => {
              this.emit("error", l), this.emit("close");
            }), c.addEventListener("message", (l) => {
              if (this.tlsState === 0) {
                let d = y.from(l.data);
                this.emit(
                  "data",
                  d
                );
              }
            }), c.addEventListener("close", () => {
              this.emit("close");
            }), h ? s() : c.addEventListener(
              "open",
              s
            );
          }, "configureWebSocket"), u;
          try {
            u = this.wsProxyAddrForHost(n, typeof t == "string" ? parseInt(t, 10) : t);
          } catch (c) {
            this.emit("error", c), this.emit("close");
            return;
          }
          try {
            let h = (this.useSecureWebSocket ? "wss:" : "ws:") + "//" + u;
            if (this.webSocketConstructor !== void 0) this.ws = new this.webSocketConstructor(h), o(this.ws);
            else try {
              this.ws = new WebSocket(
                h
              ), o(this.ws);
            } catch {
              this.ws = new __unstable_WebSocket(h), o(this.ws);
            }
          } catch (c) {
            let l = (this.useSecureWebSocket ? "https:" : "http:") + "//" + u;
            fetch(l, { headers: { Upgrade: "websocket" } }).then((d) => {
              if (this.ws = d.webSocket, this.ws == null) throw c;
              this.ws.accept(), o(
                this.ws,
                true
              );
            }).catch((d) => {
              this.emit("error", new Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${d.message}`)), this.emit("close");
            });
          }
        }
        async startTls(t) {
          if (this.subtls === void 0) throw new Error("For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information.");
          this.tlsState = 1;
          let n = this.subtls.TrustedCert.fromPEM(this.rootCerts), i = new this.subtls.WebSocketReadQueue(this.ws), s = i.read.bind(
            i
          ), o = this.rawWrite.bind(this), [u, c] = await this.subtls.startTls(t, n, s, o, { useSNI: !this.disableSNI, expectPreData: this.pipelineTLS ? new Uint8Array([83]) : void 0 });
          this.tlsRead = u, this.tlsWrite = c, this.tlsState = 2, this.encrypted = true, this.authorized = true, this.emit(
            "secureConnection",
            this
          ), this.tlsReadLoop();
        }
        async tlsReadLoop() {
          for (; ; ) {
            let t = await this.tlsRead();
            if (t === void 0) break;
            {
              let n = y.from(t);
              this.emit("data", n);
            }
          }
        }
        rawWrite(t) {
          if (!this.coalesceWrites) {
            this.ws.send(t);
            return;
          }
          if (this.writeBuffer === void 0) this.writeBuffer = t, setTimeout(
            () => {
              this.ws.send(this.writeBuffer), this.writeBuffer = void 0;
            },
            0
          );
          else {
            let n = new Uint8Array(this.writeBuffer.length + t.length);
            n.set(this.writeBuffer), n.set(t, this.writeBuffer.length), this.writeBuffer = n;
          }
        }
        write(t, n = "utf8", i = (s) => {
        }) {
          return t.length === 0 ? (i(), true) : (typeof t == "string" && (t = y.from(t, n)), this.tlsState === 0 ? (this.rawWrite(t), i()) : this.tlsState === 1 ? this.once("secureConnection", () => {
            this.write(
              t,
              n,
              i
            );
          }) : (this.tlsWrite(t), i()), true);
        }
        end(t = y.alloc(0), n = "utf8", i = () => {
        }) {
          return this.write(t, n, () => {
            this.ws.close(), i();
          }), this;
        }
        destroy() {
          return this.destroyed = true, this.end();
        }
      };
      a(E, "Socket"), _(E, "defaults", {
        poolQueryViaFetch: false,
        fetchEndpoint: a((t) => "https://" + Mu(t) + "/sql", "fetchEndpoint"),
        fetchConnectionCache: true,
        fetchFunction: void 0,
        webSocketConstructor: void 0,
        wsProxy: a((t) => t + "/v2", "wsProxy"),
        useSecureWebSocket: true,
        forceDisablePgSSL: true,
        coalesceWrites: true,
        pipelineConnect: "password",
        subtls: void 0,
        rootCerts: "",
        pipelineTLS: false,
        disableSNI: false
      }), _(E, "opts", {});
      _e = E;
    });
    Yr = I((T) => {
      "use strict";
      p();
      Object.defineProperty(T, "__esModule", { value: true });
      T.NoticeMessage = T.DataRowMessage = T.CommandCompleteMessage = T.ReadyForQueryMessage = T.NotificationResponseMessage = T.BackendKeyDataMessage = T.AuthenticationMD5Password = T.ParameterStatusMessage = T.ParameterDescriptionMessage = T.RowDescriptionMessage = T.Field = T.CopyResponse = T.CopyDataMessage = T.DatabaseError = T.copyDone = T.emptyQuery = T.replicationStart = T.portalSuspended = T.noData = T.closeComplete = T.bindComplete = T.parseComplete = void 0;
      T.parseComplete = { name: "parseComplete", length: 5 };
      T.bindComplete = { name: "bindComplete", length: 5 };
      T.closeComplete = { name: "closeComplete", length: 5 };
      T.noData = { name: "noData", length: 5 };
      T.portalSuspended = { name: "portalSuspended", length: 5 };
      T.replicationStart = { name: "replicationStart", length: 4 };
      T.emptyQuery = { name: "emptyQuery", length: 4 };
      T.copyDone = { name: "copyDone", length: 4 };
      var kr = class kr extends Error {
        constructor(e, t, n) {
          super(
            e
          ), this.length = t, this.name = n;
        }
      };
      a(kr, "DatabaseError");
      var vr = kr;
      T.DatabaseError = vr;
      var Ur = class Ur {
        constructor(e, t) {
          this.length = e, this.chunk = t, this.name = "copyData";
        }
      };
      a(Ur, "CopyDataMessage");
      var Er = Ur;
      T.CopyDataMessage = Er;
      var Or = class Or {
        constructor(e, t, n, i) {
          this.length = e, this.name = t, this.binary = n, this.columnTypes = new Array(i);
        }
      };
      a(Or, "CopyResponse");
      var _r = Or;
      T.CopyResponse = _r;
      var Nr = class Nr {
        constructor(e, t, n, i, s, o, u) {
          this.name = e, this.tableID = t, this.columnID = n, this.dataTypeID = i, this.dataTypeSize = s, this.dataTypeModifier = o, this.format = u;
        }
      };
      a(Nr, "Field");
      var Ar = Nr;
      T.Field = Ar;
      var qr = class qr {
        constructor(e, t) {
          this.length = e, this.fieldCount = t, this.name = "rowDescription", this.fields = new Array(
            this.fieldCount
          );
        }
      };
      a(qr, "RowDescriptionMessage");
      var Cr = qr;
      T.RowDescriptionMessage = Cr;
      var Qr = class Qr {
        constructor(e, t) {
          this.length = e, this.parameterCount = t, this.name = "parameterDescription", this.dataTypeIDs = new Array(this.parameterCount);
        }
      };
      a(Qr, "ParameterDescriptionMessage");
      var Tr = Qr;
      T.ParameterDescriptionMessage = Tr;
      var Wr = class Wr {
        constructor(e, t, n) {
          this.length = e, this.parameterName = t, this.parameterValue = n, this.name = "parameterStatus";
        }
      };
      a(Wr, "ParameterStatusMessage");
      var Ir = Wr;
      T.ParameterStatusMessage = Ir;
      var jr = class jr {
        constructor(e, t) {
          this.length = e, this.salt = t, this.name = "authenticationMD5Password";
        }
      };
      a(jr, "AuthenticationMD5Password");
      var Pr = jr;
      T.AuthenticationMD5Password = Pr;
      var Hr = class Hr {
        constructor(e, t, n) {
          this.length = e, this.processID = t, this.secretKey = n, this.name = "backendKeyData";
        }
      };
      a(
        Hr,
        "BackendKeyDataMessage"
      );
      var Br = Hr;
      T.BackendKeyDataMessage = Br;
      var Gr = class Gr {
        constructor(e, t, n, i) {
          this.length = e, this.processId = t, this.channel = n, this.payload = i, this.name = "notification";
        }
      };
      a(Gr, "NotificationResponseMessage");
      var Lr = Gr;
      T.NotificationResponseMessage = Lr;
      var $r = class $r {
        constructor(e, t) {
          this.length = e, this.status = t, this.name = "readyForQuery";
        }
      };
      a($r, "ReadyForQueryMessage");
      var Rr = $r;
      T.ReadyForQueryMessage = Rr;
      var Vr = class Vr {
        constructor(e, t) {
          this.length = e, this.text = t, this.name = "commandComplete";
        }
      };
      a(Vr, "CommandCompleteMessage");
      var Fr = Vr;
      T.CommandCompleteMessage = Fr;
      var Kr = class Kr {
        constructor(e, t) {
          this.length = e, this.fields = t, this.name = "dataRow", this.fieldCount = t.length;
        }
      };
      a(Kr, "DataRowMessage");
      var Mr = Kr;
      T.DataRowMessage = Mr;
      var zr = class zr {
        constructor(e, t) {
          this.length = e, this.message = t, this.name = "notice";
        }
      };
      a(zr, "NoticeMessage");
      var Dr = zr;
      T.NoticeMessage = Dr;
    });
    ms = I((bt) => {
      "use strict";
      p();
      Object.defineProperty(bt, "__esModule", { value: true });
      bt.Writer = void 0;
      var Jr = class Jr {
        constructor(e = 256) {
          this.size = e, this.offset = 5, this.headerPosition = 0, this.buffer = y.allocUnsafe(e);
        }
        ensure(e) {
          var t = this.buffer.length - this.offset;
          if (t < e) {
            var n = this.buffer, i = n.length + (n.length >> 1) + e;
            this.buffer = y.allocUnsafe(
              i
            ), n.copy(this.buffer);
          }
        }
        addInt32(e) {
          return this.ensure(4), this.buffer[this.offset++] = e >>> 24 & 255, this.buffer[this.offset++] = e >>> 16 & 255, this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
        }
        addInt16(e) {
          return this.ensure(2), this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
        }
        addCString(e) {
          if (!e) this.ensure(1);
          else {
            var t = y.byteLength(e);
            this.ensure(t + 1), this.buffer.write(
              e,
              this.offset,
              "utf-8"
            ), this.offset += t;
          }
          return this.buffer[this.offset++] = 0, this;
        }
        addString(e = "") {
          var t = y.byteLength(e);
          return this.ensure(t), this.buffer.write(e, this.offset), this.offset += t, this;
        }
        add(e) {
          return this.ensure(e.length), e.copy(this.buffer, this.offset), this.offset += e.length, this;
        }
        join(e) {
          if (e) {
            this.buffer[this.headerPosition] = e;
            let t = this.offset - (this.headerPosition + 1);
            this.buffer.writeInt32BE(t, this.headerPosition + 1);
          }
          return this.buffer.slice(e ? 0 : 5, this.offset);
        }
        flush(e) {
          var t = this.join(e);
          return this.offset = 5, this.headerPosition = 0, this.buffer = y.allocUnsafe(this.size), t;
        }
      };
      a(Jr, "Writer");
      var Zr = Jr;
      bt.Writer = Zr;
    });
    ws = I((xt) => {
      "use strict";
      p();
      Object.defineProperty(xt, "__esModule", { value: true });
      xt.serialize = void 0;
      var Xr = ms(), M = new Xr.Writer(), Du = a((r) => {
        M.addInt16(3).addInt16(
          0
        );
        for (let n of Object.keys(r)) M.addCString(n).addCString(r[n]);
        M.addCString("client_encoding").addCString("UTF8");
        var e = M.addCString("").flush(), t = e.length + 4;
        return new Xr.Writer().addInt32(t).add(e).flush();
      }, "startup"), ku = a(() => {
        let r = y.allocUnsafe(8);
        return r.writeInt32BE(8, 0), r.writeInt32BE(80877103, 4), r;
      }, "requestSsl"), Uu = a((r) => M.addCString(r).flush(112), "password"), Ou = a(function(r, e) {
        return M.addCString(r).addInt32(
          y.byteLength(e)
        ).addString(e), M.flush(112);
      }, "sendSASLInitialResponseMessage"), Nu = a(
        function(r) {
          return M.addString(r).flush(112);
        },
        "sendSCRAMClientFinalMessage"
      ), qu = a(
        (r) => M.addCString(r).flush(81),
        "query"
      ), gs = [], Qu = a((r) => {
        let e = r.name || "";
        e.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", e, e.length), console.error("This can cause conflicts and silent errors executing queries"));
        let t = r.types || gs;
        for (var n = t.length, i = M.addCString(e).addCString(r.text).addInt16(n), s = 0; s < n; s++) i.addInt32(t[s]);
        return M.flush(80);
      }, "parse"), Oe = new Xr.Writer(), Wu = a(function(r, e) {
        for (let t = 0; t < r.length; t++) {
          let n = e ? e(r[t], t) : r[t];
          n == null ? (M.addInt16(0), Oe.addInt32(-1)) : n instanceof y ? (M.addInt16(1), Oe.addInt32(n.length), Oe.add(n)) : (M.addInt16(0), Oe.addInt32(y.byteLength(
            n
          )), Oe.addString(n));
        }
      }, "writeValues"), ju = a((r = {}) => {
        let e = r.portal || "", t = r.statement || "", n = r.binary || false, i = r.values || gs, s = i.length;
        return M.addCString(e).addCString(t), M.addInt16(s), Wu(i, r.valueMapper), M.addInt16(s), M.add(Oe.flush()), M.addInt16(n ? 1 : 0), M.flush(66);
      }, "bind"), Hu = y.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]), Gu = a((r) => {
        if (!r || !r.portal && !r.rows) return Hu;
        let e = r.portal || "", t = r.rows || 0, n = y.byteLength(e), i = 4 + n + 1 + 4, s = y.allocUnsafe(1 + i);
        return s[0] = 69, s.writeInt32BE(i, 1), s.write(e, 5, "utf-8"), s[n + 5] = 0, s.writeUInt32BE(t, s.length - 4), s;
      }, "execute"), $u = a((r, e) => {
        let t = y.allocUnsafe(16);
        return t.writeInt32BE(16, 0), t.writeInt16BE(1234, 4), t.writeInt16BE(5678, 6), t.writeInt32BE(
          r,
          8
        ), t.writeInt32BE(e, 12), t;
      }, "cancel"), en = a(
        (r, e) => {
          let n = 4 + y.byteLength(e) + 1, i = y.allocUnsafe(1 + n);
          return i[0] = r, i.writeInt32BE(n, 1), i.write(e, 5, "utf-8"), i[n] = 0, i;
        },
        "cstringMessage"
      ), Vu = M.addCString("P").flush(68), Ku = M.addCString("S").flush(68), zu = a((r) => r.name ? en(68, `${r.type}${r.name || ""}`) : r.type === "P" ? Vu : Ku, "describe"), Yu = a(
        (r) => {
          let e = `${r.type}${r.name || ""}`;
          return en(67, e);
        },
        "close"
      ), Zu = a((r) => M.add(r).flush(
        100
      ), "copyData"), Ju = a((r) => en(102, r), "copyFail"), St = a((r) => y.from([r, 0, 0, 0, 4]), "codeOnlyBuffer"), Xu = St(72), ec = St(83), tc = St(88), rc = St(99), nc = {
        startup: Du,
        password: Uu,
        requestSsl: ku,
        sendSASLInitialResponseMessage: Ou,
        sendSCRAMClientFinalMessage: Nu,
        query: qu,
        parse: Qu,
        bind: ju,
        execute: Gu,
        describe: zu,
        close: Yu,
        flush: a(() => Xu, "flush"),
        sync: a(
          () => ec,
          "sync"
        ),
        end: a(() => tc, "end"),
        copyData: Zu,
        copyDone: a(() => rc, "copyDone"),
        copyFail: Ju,
        cancel: $u
      };
      xt.serialize = nc;
    });
    bs = I((vt) => {
      "use strict";
      p();
      Object.defineProperty(vt, "__esModule", { value: true });
      vt.BufferReader = void 0;
      var ic = y.allocUnsafe(0), rn = class rn {
        constructor(e = 0) {
          this.offset = e, this.buffer = ic, this.encoding = "utf-8";
        }
        setBuffer(e, t) {
          this.offset = e, this.buffer = t;
        }
        int16() {
          let e = this.buffer.readInt16BE(this.offset);
          return this.offset += 2, e;
        }
        byte() {
          let e = this.buffer[this.offset];
          return this.offset++, e;
        }
        int32() {
          let e = this.buffer.readInt32BE(this.offset);
          return this.offset += 4, e;
        }
        string(e) {
          let t = this.buffer.toString(this.encoding, this.offset, this.offset + e);
          return this.offset += e, t;
        }
        cstring() {
          let e = this.offset, t = e;
          for (; this.buffer[t++] !== 0; ) ;
          return this.offset = t, this.buffer.toString(this.encoding, e, t - 1);
        }
        bytes(e) {
          let t = this.buffer.slice(this.offset, this.offset + e);
          return this.offset += e, t;
        }
      };
      a(rn, "BufferReader");
      var tn = rn;
      vt.BufferReader = tn;
    });
    vs = I((Et) => {
      "use strict";
      p();
      Object.defineProperty(Et, "__esModule", { value: true });
      Et.Parser = void 0;
      var D = Yr(), sc = bs(), nn = 1, oc = 4, Ss = nn + oc, xs = y.allocUnsafe(0), on = class on {
        constructor(e) {
          if (this.buffer = xs, this.bufferLength = 0, this.bufferOffset = 0, this.reader = new sc.BufferReader(), e?.mode === "binary") throw new Error("Binary mode not supported yet");
          this.mode = e?.mode || "text";
        }
        parse(e, t) {
          this.mergeBuffer(e);
          let n = this.bufferOffset + this.bufferLength, i = this.bufferOffset;
          for (; i + Ss <= n; ) {
            let s = this.buffer[i], o = this.buffer.readUInt32BE(
              i + nn
            ), u = nn + o;
            if (u + i <= n) {
              let c = this.handlePacket(i + Ss, s, o, this.buffer);
              t(c), i += u;
            } else
              break;
          }
          i === n ? (this.buffer = xs, this.bufferLength = 0, this.bufferOffset = 0) : (this.bufferLength = n - i, this.bufferOffset = i);
        }
        mergeBuffer(e) {
          if (this.bufferLength > 0) {
            let t = this.bufferLength + e.byteLength;
            if (t + this.bufferOffset > this.buffer.byteLength) {
              let i;
              if (t <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) i = this.buffer;
              else {
                let s = this.buffer.byteLength * 2;
                for (; t >= s; ) s *= 2;
                i = y.allocUnsafe(s);
              }
              this.buffer.copy(
                i,
                0,
                this.bufferOffset,
                this.bufferOffset + this.bufferLength
              ), this.buffer = i, this.bufferOffset = 0;
            }
            e.copy(this.buffer, this.bufferOffset + this.bufferLength), this.bufferLength = t;
          } else this.buffer = e, this.bufferOffset = 0, this.bufferLength = e.byteLength;
        }
        handlePacket(e, t, n, i) {
          switch (t) {
            case 50:
              return D.bindComplete;
            case 49:
              return D.parseComplete;
            case 51:
              return D.closeComplete;
            case 110:
              return D.noData;
            case 115:
              return D.portalSuspended;
            case 99:
              return D.copyDone;
            case 87:
              return D.replicationStart;
            case 73:
              return D.emptyQuery;
            case 68:
              return this.parseDataRowMessage(
                e,
                n,
                i
              );
            case 67:
              return this.parseCommandCompleteMessage(e, n, i);
            case 90:
              return this.parseReadyForQueryMessage(e, n, i);
            case 65:
              return this.parseNotificationMessage(
                e,
                n,
                i
              );
            case 82:
              return this.parseAuthenticationResponse(e, n, i);
            case 83:
              return this.parseParameterStatusMessage(e, n, i);
            case 75:
              return this.parseBackendKeyData(e, n, i);
            case 69:
              return this.parseErrorMessage(e, n, i, "error");
            case 78:
              return this.parseErrorMessage(
                e,
                n,
                i,
                "notice"
              );
            case 84:
              return this.parseRowDescriptionMessage(e, n, i);
            case 116:
              return this.parseParameterDescriptionMessage(e, n, i);
            case 71:
              return this.parseCopyInMessage(
                e,
                n,
                i
              );
            case 72:
              return this.parseCopyOutMessage(e, n, i);
            case 100:
              return this.parseCopyData(
                e,
                n,
                i
              );
            default:
              return new D.DatabaseError("received invalid response: " + t.toString(
                16
              ), n, "error");
          }
        }
        parseReadyForQueryMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.string(1);
          return new D.ReadyForQueryMessage(t, i);
        }
        parseCommandCompleteMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.cstring();
          return new D.CommandCompleteMessage(
            t,
            i
          );
        }
        parseCopyData(e, t, n) {
          let i = n.slice(e, e + (t - 4));
          return new D.CopyDataMessage(
            t,
            i
          );
        }
        parseCopyInMessage(e, t, n) {
          return this.parseCopyMessage(e, t, n, "copyInResponse");
        }
        parseCopyOutMessage(e, t, n) {
          return this.parseCopyMessage(e, t, n, "copyOutResponse");
        }
        parseCopyMessage(e, t, n, i) {
          this.reader.setBuffer(e, n);
          let s = this.reader.byte() !== 0, o = this.reader.int16(), u = new D.CopyResponse(t, i, s, o);
          for (let c = 0; c < o; c++) u.columnTypes[c] = this.reader.int16();
          return u;
        }
        parseNotificationMessage(e, t, n) {
          this.reader.setBuffer(
            e,
            n
          );
          let i = this.reader.int32(), s = this.reader.cstring(), o = this.reader.cstring();
          return new D.NotificationResponseMessage(t, i, s, o);
        }
        parseRowDescriptionMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.int16(), s = new D.RowDescriptionMessage(t, i);
          for (let o = 0; o < i; o++) s.fields[o] = this.parseField();
          return s;
        }
        parseField() {
          let e = this.reader.cstring(), t = this.reader.int32(), n = this.reader.int16(), i = this.reader.int32(), s = this.reader.int16(), o = this.reader.int32(), u = this.reader.int16() === 0 ? "text" : "binary";
          return new D.Field(e, t, n, i, s, o, u);
        }
        parseParameterDescriptionMessage(e, t, n) {
          this.reader.setBuffer(
            e,
            n
          );
          let i = this.reader.int16(), s = new D.ParameterDescriptionMessage(t, i);
          for (let o = 0; o < i; o++) s.dataTypeIDs[o] = this.reader.int32();
          return s;
        }
        parseDataRowMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.int16(), s = new Array(i);
          for (let o = 0; o < i; o++) {
            let u = this.reader.int32();
            s[o] = u === -1 ? null : this.reader.string(u);
          }
          return new D.DataRowMessage(
            t,
            s
          );
        }
        parseParameterStatusMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.cstring(), s = this.reader.cstring();
          return new D.ParameterStatusMessage(t, i, s);
        }
        parseBackendKeyData(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.int32(), s = this.reader.int32();
          return new D.BackendKeyDataMessage(t, i, s);
        }
        parseAuthenticationResponse(e, t, n) {
          this.reader.setBuffer(
            e,
            n
          );
          let i = this.reader.int32(), s = { name: "authenticationOk", length: t };
          switch (i) {
            case 0:
              break;
            case 3:
              s.length === 8 && (s.name = "authenticationCleartextPassword");
              break;
            case 5:
              if (s.length === 12) {
                s.name = "authenticationMD5Password";
                let u = this.reader.bytes(4);
                return new D.AuthenticationMD5Password(t, u);
              }
              break;
            case 10:
              s.name = "authenticationSASL", s.mechanisms = [];
              let o;
              do
                o = this.reader.cstring(), o && s.mechanisms.push(o);
              while (o);
              break;
            case 11:
              s.name = "authenticationSASLContinue", s.data = this.reader.string(t - 8);
              break;
            case 12:
              s.name = "authenticationSASLFinal", s.data = this.reader.string(t - 8);
              break;
            default:
              throw new Error("Unknown authenticationOk message type " + i);
          }
          return s;
        }
        parseErrorMessage(e, t, n, i) {
          this.reader.setBuffer(e, n);
          let s = {}, o = this.reader.string(1);
          for (; o !== "\0"; ) s[o] = this.reader.cstring(), o = this.reader.string(1);
          let u = s.M, c = i === "notice" ? new D.NoticeMessage(
            t,
            u
          ) : new D.DatabaseError(u, t, i);
          return c.severity = s.S, c.code = s.C, c.detail = s.D, c.hint = s.H, c.position = s.P, c.internalPosition = s.p, c.internalQuery = s.q, c.where = s.W, c.schema = s.s, c.table = s.t, c.column = s.c, c.dataType = s.d, c.constraint = s.n, c.file = s.F, c.line = s.L, c.routine = s.R, c;
        }
      };
      a(on, "Parser");
      var sn = on;
      Et.Parser = sn;
    });
    an = I((Se) => {
      "use strict";
      p();
      Object.defineProperty(Se, "__esModule", { value: true });
      Se.DatabaseError = Se.serialize = Se.parse = void 0;
      var ac = Yr();
      Object.defineProperty(
        Se,
        "DatabaseError",
        { enumerable: true, get: a(function() {
          return ac.DatabaseError;
        }, "get") }
      );
      var uc = ws();
      Object.defineProperty(Se, "serialize", { enumerable: true, get: a(function() {
        return uc.serialize;
      }, "get") });
      var cc = vs();
      function hc(r, e) {
        let t = new cc.Parser();
        return r.on("data", (n) => t.parse(n, e)), new Promise((n) => r.on("end", () => n()));
      }
      a(hc, "parse");
      Se.parse = hc;
    });
    Es = {};
    ie(Es, { connect: () => lc });
    _s = z(() => {
      "use strict";
      p();
      a(lc, "connect");
    });
    hn = I((tf, Ts) => {
      "use strict";
      p();
      var As = (wt(), N(ys)), fc = we().EventEmitter, {
        parse: pc,
        serialize: Q
      } = an(), Cs = Q.flush(), dc = Q.sync(), yc = Q.end(), cn = class cn extends fc {
        constructor(e) {
          super(), e = e || {}, this.stream = e.stream || new As.Socket(), this._keepAlive = e.keepAlive, this._keepAliveInitialDelayMillis = e.keepAliveInitialDelayMillis, this.lastBuffer = false, this.parsedStatements = {}, this.ssl = e.ssl || false, this._ending = false, this._emitMessage = false;
          var t = this;
          this.on("newListener", function(n) {
            n === "message" && (t._emitMessage = true);
          });
        }
        connect(e, t) {
          var n = this;
          this._connecting = true, this.stream.setNoDelay(true), this.stream.connect(
            e,
            t
          ), this.stream.once("connect", function() {
            n._keepAlive && n.stream.setKeepAlive(
              true,
              n._keepAliveInitialDelayMillis
            ), n.emit("connect");
          });
          let i = a(function(s) {
            n._ending && (s.code === "ECONNRESET" || s.code === "EPIPE") || n.emit("error", s);
          }, "reportStreamError");
          if (this.stream.on("error", i), this.stream.on("close", function() {
            n.emit("end");
          }), !this.ssl) return this.attachListeners(this.stream);
          this.stream.once("data", function(s) {
            var o = s.toString("utf8");
            switch (o) {
              case "S":
                break;
              case "N":
                return n.stream.end(), n.emit("error", new Error("The server does not support SSL connections"));
              default:
                return n.stream.end(), n.emit("error", new Error("There was an error establishing an SSL connection"));
            }
            var u = (_s(), N(Es));
            let c = { socket: n.stream };
            n.ssl !== true && (Object.assign(
              c,
              n.ssl
            ), "key" in n.ssl && (c.key = n.ssl.key)), As.isIP(t) === 0 && (c.servername = t);
            try {
              n.stream = u.connect(c);
            } catch (h) {
              return n.emit("error", h);
            }
            n.attachListeners(n.stream), n.stream.on("error", i), n.emit("sslconnect");
          });
        }
        attachListeners(e) {
          e.on("end", () => {
            this.emit("end");
          }), pc(e, (t) => {
            var n = t.name === "error" ? "errorMessage" : t.name;
            this._emitMessage && this.emit("message", t), this.emit(n, t);
          });
        }
        requestSsl() {
          this.stream.write(Q.requestSsl());
        }
        startup(e) {
          this.stream.write(Q.startup(e));
        }
        cancel(e, t) {
          this._send(Q.cancel(e, t));
        }
        password(e) {
          this._send(Q.password(e));
        }
        sendSASLInitialResponseMessage(e, t) {
          this._send(Q.sendSASLInitialResponseMessage(
            e,
            t
          ));
        }
        sendSCRAMClientFinalMessage(e) {
          this._send(Q.sendSCRAMClientFinalMessage(e));
        }
        _send(e) {
          return this.stream.writable ? this.stream.write(e) : false;
        }
        query(e) {
          this._send(Q.query(
            e
          ));
        }
        parse(e) {
          this._send(Q.parse(e));
        }
        bind(e) {
          this._send(Q.bind(e));
        }
        execute(e) {
          this._send(Q.execute(e));
        }
        flush() {
          this.stream.writable && this.stream.write(Cs);
        }
        sync() {
          this._ending = true, this._send(Cs), this._send(dc);
        }
        ref() {
          this.stream.ref();
        }
        unref() {
          this.stream.unref();
        }
        end() {
          if (this._ending = true, !this._connecting || !this.stream.writable) {
            this.stream.end();
            return;
          }
          return this.stream.write(yc, () => {
            this.stream.end();
          });
        }
        close(e) {
          this._send(Q.close(e));
        }
        describe(e) {
          this._send(Q.describe(e));
        }
        sendCopyFromChunk(e) {
          this._send(Q.copyData(e));
        }
        endCopyFrom() {
          this._send(Q.copyDone());
        }
        sendCopyFail(e) {
          this._send(Q.copyFail(e));
        }
      };
      a(cn, "Connection");
      var un = cn;
      Ts.exports = un;
    });
    Bs = I((of, Ps) => {
      "use strict";
      p();
      var mc = we().EventEmitter, sf = (He(), N(je)), gc = et(), ln = qi(), wc = Zi(), bc = mt(), Sc = gt(), Is = ps(), xc = Xe(), vc = hn(), fn = class fn extends mc {
        constructor(e) {
          super(), this.connectionParameters = new Sc(e), this.user = this.connectionParameters.user, this.database = this.connectionParameters.database, this.port = this.connectionParameters.port, this.host = this.connectionParameters.host, Object.defineProperty(this, "password", { configurable: true, enumerable: false, writable: true, value: this.connectionParameters.password }), this.replication = this.connectionParameters.replication;
          var t = e || {};
          this._Promise = t.Promise || S.Promise, this._types = new bc(t.types), this._ending = false, this._connecting = false, this._connected = false, this._connectionError = false, this._queryable = true, this.connection = t.connection || new vc({ stream: t.stream, ssl: this.connectionParameters.ssl, keepAlive: t.keepAlive || false, keepAliveInitialDelayMillis: t.keepAliveInitialDelayMillis || 0, encoding: this.connectionParameters.client_encoding || "utf8" }), this.queryQueue = [], this.binary = t.binary || xc.binary, this.processID = null, this.secretKey = null, this.ssl = this.connectionParameters.ssl || false, this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this._connectionTimeoutMillis = t.connectionTimeoutMillis || 0;
        }
        _errorAllQueries(e) {
          let t = a(
            (n) => {
              m.nextTick(() => {
                n.handleError(e, this.connection);
              });
            },
            "enqueueError"
          );
          this.activeQuery && (t(this.activeQuery), this.activeQuery = null), this.queryQueue.forEach(t), this.queryQueue.length = 0;
        }
        _connect(e) {
          var t = this, n = this.connection;
          if (this._connectionCallback = e, this._connecting || this._connected) {
            let i = new Error("Client has already been connected. You cannot reuse a client.");
            m.nextTick(() => {
              e(i);
            });
            return;
          }
          this._connecting = true, this.connectionTimeoutHandle, this._connectionTimeoutMillis > 0 && (this.connectionTimeoutHandle = setTimeout(() => {
            n._ending = true, n.stream.destroy(new Error("timeout expired"));
          }, this._connectionTimeoutMillis)), this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
            t.ssl ? n.requestSsl() : n.startup(t.getStartupConf());
          }), n.on("sslconnect", function() {
            n.startup(t.getStartupConf());
          }), this._attachListeners(n), n.once("end", () => {
            let i = this._ending ? new Error("Connection terminated") : new Error("Connection terminated unexpectedly");
            clearTimeout(this.connectionTimeoutHandle), this._errorAllQueries(i), this._ending || (this._connecting && !this._connectionError ? this._connectionCallback ? this._connectionCallback(i) : this._handleErrorEvent(i) : this._connectionError || this._handleErrorEvent(
              i
            )), m.nextTick(() => {
              this.emit("end");
            });
          });
        }
        connect(e) {
          if (e) {
            this._connect(e);
            return;
          }
          return new this._Promise((t, n) => {
            this._connect((i) => {
              i ? n(i) : t();
            });
          });
        }
        _attachListeners(e) {
          e.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this)), e.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this)), e.on("authenticationSASL", this._handleAuthSASL.bind(this)), e.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this)), e.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this)), e.on("backendKeyData", this._handleBackendKeyData.bind(this)), e.on("error", this._handleErrorEvent.bind(this)), e.on(
            "errorMessage",
            this._handleErrorMessage.bind(this)
          ), e.on("readyForQuery", this._handleReadyForQuery.bind(this)), e.on("notice", this._handleNotice.bind(this)), e.on("rowDescription", this._handleRowDescription.bind(this)), e.on("dataRow", this._handleDataRow.bind(this)), e.on("portalSuspended", this._handlePortalSuspended.bind(this)), e.on(
            "emptyQuery",
            this._handleEmptyQuery.bind(this)
          ), e.on("commandComplete", this._handleCommandComplete.bind(this)), e.on("parseComplete", this._handleParseComplete.bind(this)), e.on("copyInResponse", this._handleCopyInResponse.bind(this)), e.on("copyData", this._handleCopyData.bind(this)), e.on("notification", this._handleNotification.bind(this));
        }
        _checkPgPass(e) {
          let t = this.connection;
          typeof this.password == "function" ? this._Promise.resolve().then(
            () => this.password()
          ).then((n) => {
            if (n !== void 0) {
              if (typeof n != "string") {
                t.emit("error", new TypeError("Password must be a string"));
                return;
              }
              this.connectionParameters.password = this.password = n;
            } else this.connectionParameters.password = this.password = null;
            e();
          }).catch((n) => {
            t.emit("error", n);
          }) : this.password !== null ? e() : wc(
            this.connectionParameters,
            (n) => {
              n !== void 0 && (this.connectionParameters.password = this.password = n), e();
            }
          );
        }
        _handleAuthCleartextPassword(e) {
          this._checkPgPass(() => {
            this.connection.password(this.password);
          });
        }
        _handleAuthMD5Password(e) {
          this._checkPgPass(() => {
            let t = gc.postgresMd5PasswordHash(
              this.user,
              this.password,
              e.salt
            );
            this.connection.password(t);
          });
        }
        _handleAuthSASL(e) {
          this._checkPgPass(() => {
            this.saslSession = ln.startSession(e.mechanisms), this.connection.sendSASLInitialResponseMessage(
              this.saslSession.mechanism,
              this.saslSession.response
            );
          });
        }
        _handleAuthSASLContinue(e) {
          ln.continueSession(this.saslSession, this.password, e.data), this.connection.sendSCRAMClientFinalMessage(
            this.saslSession.response
          );
        }
        _handleAuthSASLFinal(e) {
          ln.finalizeSession(
            this.saslSession,
            e.data
          ), this.saslSession = null;
        }
        _handleBackendKeyData(e) {
          this.processID = e.processID, this.secretKey = e.secretKey;
        }
        _handleReadyForQuery(e) {
          this._connecting && (this._connecting = false, this._connected = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback && (this._connectionCallback(null, this), this._connectionCallback = null), this.emit("connect"));
          let { activeQuery: t } = this;
          this.activeQuery = null, this.readyForQuery = true, t && t.handleReadyForQuery(this.connection), this._pulseQueryQueue();
        }
        _handleErrorWhileConnecting(e) {
          if (!this._connectionError) {
            if (this._connectionError = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback) return this._connectionCallback(e);
            this.emit("error", e);
          }
        }
        _handleErrorEvent(e) {
          if (this._connecting) return this._handleErrorWhileConnecting(e);
          this._queryable = false, this._errorAllQueries(e), this.emit("error", e);
        }
        _handleErrorMessage(e) {
          if (this._connecting)
            return this._handleErrorWhileConnecting(e);
          let t = this.activeQuery;
          if (!t) {
            this._handleErrorEvent(
              e
            );
            return;
          }
          this.activeQuery = null, t.handleError(e, this.connection);
        }
        _handleRowDescription(e) {
          this.activeQuery.handleRowDescription(e);
        }
        _handleDataRow(e) {
          this.activeQuery.handleDataRow(
            e
          );
        }
        _handlePortalSuspended(e) {
          this.activeQuery.handlePortalSuspended(this.connection);
        }
        _handleEmptyQuery(e) {
          this.activeQuery.handleEmptyQuery(this.connection);
        }
        _handleCommandComplete(e) {
          this.activeQuery.handleCommandComplete(e, this.connection);
        }
        _handleParseComplete(e) {
          this.activeQuery.name && (this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text);
        }
        _handleCopyInResponse(e) {
          this.activeQuery.handleCopyInResponse(
            this.connection
          );
        }
        _handleCopyData(e) {
          this.activeQuery.handleCopyData(e, this.connection);
        }
        _handleNotification(e) {
          this.emit("notification", e);
        }
        _handleNotice(e) {
          this.emit("notice", e);
        }
        getStartupConf() {
          var e = this.connectionParameters, t = { user: e.user, database: e.database }, n = e.application_name || e.fallback_application_name;
          return n && (t.application_name = n), e.replication && (t.replication = "" + e.replication), e.statement_timeout && (t.statement_timeout = String(parseInt(
            e.statement_timeout,
            10
          ))), e.lock_timeout && (t.lock_timeout = String(parseInt(e.lock_timeout, 10))), e.idle_in_transaction_session_timeout && (t.idle_in_transaction_session_timeout = String(parseInt(
            e.idle_in_transaction_session_timeout,
            10
          ))), e.options && (t.options = e.options), t;
        }
        cancel(e, t) {
          if (e.activeQuery === t) {
            var n = this.connection;
            this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
              n.cancel(
                e.processID,
                e.secretKey
              );
            });
          } else e.queryQueue.indexOf(t) !== -1 && e.queryQueue.splice(e.queryQueue.indexOf(t), 1);
        }
        setTypeParser(e, t, n) {
          return this._types.setTypeParser(e, t, n);
        }
        getTypeParser(e, t) {
          return this._types.getTypeParser(e, t);
        }
        escapeIdentifier(e) {
          return '"' + e.replace(
            /"/g,
            '""'
          ) + '"';
        }
        escapeLiteral(e) {
          for (var t = false, n = "'", i = 0; i < e.length; i++) {
            var s = e[i];
            s === "'" ? n += s + s : s === "\\" ? (n += s + s, t = true) : n += s;
          }
          return n += "'", t === true && (n = " E" + n), n;
        }
        _pulseQueryQueue() {
          if (this.readyForQuery === true) if (this.activeQuery = this.queryQueue.shift(), this.activeQuery) {
            this.readyForQuery = false, this.hasExecuted = true;
            let e = this.activeQuery.submit(this.connection);
            e && m.nextTick(() => {
              this.activeQuery.handleError(e, this.connection), this.readyForQuery = true, this._pulseQueryQueue();
            });
          } else this.hasExecuted && (this.activeQuery = null, this.emit("drain"));
        }
        query(e, t, n) {
          var i, s, o, u, c;
          if (e == null) throw new TypeError("Client was passed a null or undefined query");
          return typeof e.submit == "function" ? (o = e.query_timeout || this.connectionParameters.query_timeout, s = i = e, typeof t == "function" && (i.callback = i.callback || t)) : (o = this.connectionParameters.query_timeout, i = new Is(
            e,
            t,
            n
          ), i.callback || (s = new this._Promise((h, l) => {
            i.callback = (d, b) => d ? l(d) : h(b);
          }))), o && (c = i.callback, u = setTimeout(() => {
            var h = new Error("Query read timeout");
            m.nextTick(
              () => {
                i.handleError(h, this.connection);
              }
            ), c(h), i.callback = () => {
            };
            var l = this.queryQueue.indexOf(i);
            l > -1 && this.queryQueue.splice(l, 1), this._pulseQueryQueue();
          }, o), i.callback = (h, l) => {
            clearTimeout(u), c(h, l);
          }), this.binary && !i.binary && (i.binary = true), i._result && !i._result._types && (i._result._types = this._types), this._queryable ? this._ending ? (m.nextTick(() => {
            i.handleError(
              new Error("Client was closed and is not queryable"),
              this.connection
            );
          }), s) : (this.queryQueue.push(i), this._pulseQueryQueue(), s) : (m.nextTick(
            () => {
              i.handleError(new Error("Client has encountered a connection error and is not queryable"), this.connection);
            }
          ), s);
        }
        ref() {
          this.connection.ref();
        }
        unref() {
          this.connection.unref();
        }
        end(e) {
          if (this._ending = true, !this.connection._connecting) if (e) e();
          else return this._Promise.resolve();
          if (this.activeQuery || !this._queryable ? this.connection.stream.destroy() : this.connection.end(), e) this.connection.once("end", e);
          else return new this._Promise((t) => {
            this.connection.once("end", t);
          });
        }
      };
      a(fn, "Client");
      var _t = fn;
      _t.Query = Is;
      Ps.exports = _t;
    });
    Ms = I((cf, Fs) => {
      "use strict";
      p();
      var Ec = we().EventEmitter, Ls = a(function() {
      }, "NOOP"), Rs = a(
        (r, e) => {
          let t = r.findIndex(e);
          return t === -1 ? void 0 : r.splice(t, 1)[0];
        },
        "removeWhere"
      ), yn = class yn {
        constructor(e, t, n) {
          this.client = e, this.idleListener = t, this.timeoutId = n;
        }
      };
      a(yn, "IdleItem");
      var pn = yn, mn = class mn {
        constructor(e) {
          this.callback = e;
        }
      };
      a(mn, "PendingItem");
      var Ne = mn;
      function _c() {
        throw new Error("Release called on client which has already been released to the pool.");
      }
      a(_c, "throwOnDoubleRelease");
      function At(r, e) {
        if (e) return { callback: e, result: void 0 };
        let t, n, i = a(function(o, u) {
          o ? t(o) : n(u);
        }, "cb"), s = new r(function(o, u) {
          n = o, t = u;
        }).catch((o) => {
          throw Error.captureStackTrace(
            o
          ), o;
        });
        return { callback: i, result: s };
      }
      a(At, "promisify");
      function Ac(r, e) {
        return a(
          function t(n) {
            n.client = e, e.removeListener("error", t), e.on("error", () => {
              r.log("additional client error after disconnection due to error", n);
            }), r._remove(e), r.emit("error", n, e);
          },
          "idleListener"
        );
      }
      a(Ac, "makeIdleListener");
      var gn = class gn extends Ec {
        constructor(e, t) {
          super(), this.options = Object.assign({}, e), e != null && "password" in e && Object.defineProperty(
            this.options,
            "password",
            { configurable: true, enumerable: false, writable: true, value: e.password }
          ), e != null && e.ssl && e.ssl.key && Object.defineProperty(this.options.ssl, "key", { enumerable: false }), this.options.max = this.options.max || this.options.poolSize || 10, this.options.maxUses = this.options.maxUses || 1 / 0, this.options.allowExitOnIdle = this.options.allowExitOnIdle || false, this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0, this.log = this.options.log || function() {
          }, this.Client = this.options.Client || t || Ct().Client, this.Promise = this.options.Promise || S.Promise, typeof this.options.idleTimeoutMillis > "u" && (this.options.idleTimeoutMillis = 1e4), this._clients = [], this._idle = [], this._expired = /* @__PURE__ */ new WeakSet(), this._pendingQueue = [], this._endCallback = void 0, this.ending = false, this.ended = false;
        }
        _isFull() {
          return this._clients.length >= this.options.max;
        }
        _pulseQueue() {
          if (this.log("pulse queue"), this.ended) {
            this.log("pulse queue ended");
            return;
          }
          if (this.ending) {
            this.log(
              "pulse queue on ending"
            ), this._idle.length && this._idle.slice().map((t) => {
              this._remove(
                t.client
              );
            }), this._clients.length || (this.ended = true, this._endCallback());
            return;
          }
          if (!this._pendingQueue.length) {
            this.log("no queued requests");
            return;
          }
          if (!this._idle.length && this._isFull()) return;
          let e = this._pendingQueue.shift();
          if (this._idle.length) {
            let t = this._idle.pop();
            clearTimeout(t.timeoutId);
            let n = t.client;
            n.ref && n.ref();
            let i = t.idleListener;
            return this._acquireClient(n, e, i, false);
          }
          if (!this._isFull()) return this.newClient(e);
          throw new Error("unexpected condition");
        }
        _remove(e) {
          let t = Rs(this._idle, (n) => n.client === e);
          t !== void 0 && clearTimeout(t.timeoutId), this._clients = this._clients.filter((n) => n !== e), e.end(), this.emit("remove", e);
        }
        connect(e) {
          if (this.ending) {
            let i = new Error("Cannot use a pool after calling end on the pool");
            return e ? e(i) : this.Promise.reject(
              i
            );
          }
          let t = At(this.Promise, e), n = t.result;
          if (this._isFull() || this._idle.length) {
            if (this._idle.length && m.nextTick(() => this._pulseQueue()), !this.options.connectionTimeoutMillis)
              return this._pendingQueue.push(new Ne(t.callback)), n;
            let i = a((u, c, h) => {
              clearTimeout(
                o
              ), t.callback(u, c, h);
            }, "queueCallback"), s = new Ne(i), o = setTimeout(() => {
              Rs(
                this._pendingQueue,
                (u) => u.callback === i
              ), s.timedOut = true, t.callback(new Error("timeout exceeded when trying to connect"));
            }, this.options.connectionTimeoutMillis);
            return this._pendingQueue.push(s), n;
          }
          return this.newClient(new Ne(t.callback)), n;
        }
        newClient(e) {
          let t = new this.Client(this.options);
          this._clients.push(t);
          let n = Ac(this, t);
          this.log("checking client timeout");
          let i, s = false;
          this.options.connectionTimeoutMillis && (i = setTimeout(() => {
            this.log("ending client due to timeout"), s = true, t.connection ? t.connection.stream.destroy() : t.end();
          }, this.options.connectionTimeoutMillis)), this.log("connecting new client"), t.connect((o) => {
            if (i && clearTimeout(i), t.on("error", n), o) this.log("client failed to connect", o), this._clients = this._clients.filter((u) => u !== t), s && (o.message = "Connection terminated due to connection timeout"), this._pulseQueue(), e.timedOut || e.callback(
              o,
              void 0,
              Ls
            );
            else {
              if (this.log("new client connected"), this.options.maxLifetimeSeconds !== 0) {
                let u = setTimeout(() => {
                  this.log("ending client due to expired lifetime"), this._expired.add(t), this._idle.findIndex((h) => h.client === t) !== -1 && this._acquireClient(
                    t,
                    new Ne((h, l, d) => d()),
                    n,
                    false
                  );
                }, this.options.maxLifetimeSeconds * 1e3);
                u.unref(), t.once(
                  "end",
                  () => clearTimeout(u)
                );
              }
              return this._acquireClient(t, e, n, true);
            }
          });
        }
        _acquireClient(e, t, n, i) {
          i && this.emit("connect", e), this.emit("acquire", e), e.release = this._releaseOnce(e, n), e.removeListener("error", n), t.timedOut ? i && this.options.verify ? this.options.verify(
            e,
            e.release
          ) : e.release() : i && this.options.verify ? this.options.verify(e, (s) => {
            if (s) return e.release(s), t.callback(s, void 0, Ls);
            t.callback(void 0, e, e.release);
          }) : t.callback(
            void 0,
            e,
            e.release
          );
        }
        _releaseOnce(e, t) {
          let n = false;
          return (i) => {
            n && _c(), n = true, this._release(
              e,
              t,
              i
            );
          };
        }
        _release(e, t, n) {
          if (e.on("error", t), e._poolUseCount = (e._poolUseCount || 0) + 1, this.emit("release", n, e), n || this.ending || !e._queryable || e._ending || e._poolUseCount >= this.options.maxUses) {
            e._poolUseCount >= this.options.maxUses && this.log("remove expended client"), this._remove(e), this._pulseQueue();
            return;
          }
          if (this._expired.has(e)) {
            this.log("remove expired client"), this._expired.delete(e), this._remove(e), this._pulseQueue();
            return;
          }
          let s;
          this.options.idleTimeoutMillis && (s = setTimeout(() => {
            this.log("remove idle client"), this._remove(e);
          }, this.options.idleTimeoutMillis), this.options.allowExitOnIdle && s.unref()), this.options.allowExitOnIdle && e.unref(), this._idle.push(new pn(e, t, s)), this._pulseQueue();
        }
        query(e, t, n) {
          if (typeof e == "function") {
            let s = At(this.Promise, e);
            return x(function() {
              return s.callback(new Error("Passing a function as the first parameter to pool.query is not supported"));
            }), s.result;
          }
          typeof t == "function" && (n = t, t = void 0);
          let i = At(this.Promise, n);
          return n = i.callback, this.connect((s, o) => {
            if (s)
              return n(s);
            let u = false, c = a((h) => {
              u || (u = true, o.release(h), n(h));
            }, "onError");
            o.once("error", c), this.log("dispatching query");
            try {
              o.query(e, t, (h, l) => {
                if (this.log("query dispatched"), o.removeListener("error", c), !u) return u = true, o.release(h), h ? n(h) : n(
                  void 0,
                  l
                );
              });
            } catch (h) {
              return o.release(h), n(h);
            }
          }), i.result;
        }
        end(e) {
          if (this.log("ending"), this.ending) {
            let n = new Error("Called end on pool more than once");
            return e ? e(n) : this.Promise.reject(n);
          }
          this.ending = true;
          let t = At(this.Promise, e);
          return this._endCallback = t.callback, this._pulseQueue(), t.result;
        }
        get waitingCount() {
          return this._pendingQueue.length;
        }
        get idleCount() {
          return this._idle.length;
        }
        get expiredCount() {
          return this._clients.reduce((e, t) => e + (this._expired.has(t) ? 1 : 0), 0);
        }
        get totalCount() {
          return this._clients.length;
        }
      };
      a(gn, "Pool");
      var dn = gn;
      Fs.exports = dn;
    });
    Ds = {};
    ie(Ds, { default: () => Cc });
    ks = z(() => {
      "use strict";
      p();
      Cc = {};
    });
    Us = I((pf, Tc) => {
      Tc.exports = { name: "pg", version: "8.8.0", description: "PostgreSQL client - pure javascript & libpq with the same API", keywords: [
        "database",
        "libpq",
        "pg",
        "postgre",
        "postgres",
        "postgresql",
        "rdbms"
      ], homepage: "https://github.com/brianc/node-postgres", repository: { type: "git", url: "git://github.com/brianc/node-postgres.git", directory: "packages/pg" }, author: "Brian Carlson <brian.m.carlson@gmail.com>", main: "./lib", dependencies: {
        "buffer-writer": "2.0.0",
        "packet-reader": "1.0.0",
        "pg-connection-string": "^2.5.0",
        "pg-pool": "^3.5.2",
        "pg-protocol": "^1.5.0",
        "pg-types": "^2.1.0",
        pgpass: "1.x"
      }, devDependencies: { async: "2.6.4", bluebird: "3.5.2", co: "4.6.0", "pg-copy-streams": "0.3.0" }, peerDependencies: { "pg-native": ">=3.0.1" }, peerDependenciesMeta: {
        "pg-native": { optional: true }
      }, scripts: { test: "make test-all" }, files: ["lib", "SPONSORS.md"], license: "MIT", engines: { node: ">= 8.0.0" }, gitHead: "c99fb2c127ddf8d712500db2c7b9a5491a178655" };
    });
    qs = I((df, Ns) => {
      "use strict";
      p();
      var Os = we().EventEmitter, Ic = (He(), N(je)), wn = et(), qe = Ns.exports = function(r, e, t) {
        Os.call(this), r = wn.normalizeQueryConfig(r, e, t), this.text = r.text, this.values = r.values, this.name = r.name, this.callback = r.callback, this.state = "new", this._arrayMode = r.rowMode === "array", this._emitRowEvents = false, this.on("newListener", function(n) {
          n === "row" && (this._emitRowEvents = true);
        }.bind(this));
      };
      Ic.inherits(
        qe,
        Os
      );
      var Pc = { sqlState: "code", statementPosition: "position", messagePrimary: "message", context: "where", schemaName: "schema", tableName: "table", columnName: "column", dataTypeName: "dataType", constraintName: "constraint", sourceFile: "file", sourceLine: "line", sourceFunction: "routine" };
      qe.prototype.handleError = function(r) {
        var e = this.native.pq.resultErrorFields();
        if (e) for (var t in e) {
          var n = Pc[t] || t;
          r[n] = e[t];
        }
        this.callback ? this.callback(r) : this.emit("error", r), this.state = "error";
      };
      qe.prototype.then = function(r, e) {
        return this._getPromise().then(r, e);
      };
      qe.prototype.catch = function(r) {
        return this._getPromise().catch(r);
      };
      qe.prototype._getPromise = function() {
        return this._promise ? this._promise : (this._promise = new Promise(function(r, e) {
          this._once("end", r), this._once(
            "error",
            e
          );
        }.bind(this)), this._promise);
      };
      qe.prototype.submit = function(r) {
        this.state = "running";
        var e = this;
        this.native = r.native, r.native.arrayMode = this._arrayMode;
        var t = a(
          function(s, o, u) {
            if (r.native.arrayMode = false, x(function() {
              e.emit("_done");
            }), s) return e.handleError(s);
            e._emitRowEvents && (u.length > 1 ? o.forEach((c, h) => {
              c.forEach((l) => {
                e.emit(
                  "row",
                  l,
                  u[h]
                );
              });
            }) : o.forEach(function(c) {
              e.emit("row", c, u);
            })), e.state = "end", e.emit(
              "end",
              u
            ), e.callback && e.callback(null, u);
          },
          "after"
        );
        if (m.domain && (t = m.domain.bind(
          t
        )), this.name) {
          this.name.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error(
            "You supplied %s (%s)",
            this.name,
            this.name.length
          ), console.error("This can cause conflicts and silent errors executing queries"));
          var n = (this.values || []).map(wn.prepareValue);
          if (r.namedQueries[this.name]) {
            if (this.text && r.namedQueries[this.name] !== this.text) {
              let s = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
              return t(s);
            }
            return r.native.execute(this.name, n, t);
          }
          return r.native.prepare(
            this.name,
            this.text,
            n.length,
            function(s) {
              return s ? t(s) : (r.namedQueries[e.name] = e.text, e.native.execute(e.name, n, t));
            }
          );
        } else if (this.values) {
          if (!Array.isArray(this.values)) {
            let s = new Error("Query values must be an array");
            return t(s);
          }
          var i = this.values.map(wn.prepareValue);
          r.native.query(this.text, i, t);
        } else r.native.query(this.text, t);
      };
    });
    Hs = I((wf, js) => {
      "use strict";
      p();
      var Bc = (ks(), N(Ds)), Lc = mt(), gf = Us(), Qs = we().EventEmitter, Rc = (He(), N(je)), Fc = gt(), Ws = qs(), J = js.exports = function(r) {
        Qs.call(this), r = r || {}, this._Promise = r.Promise || S.Promise, this._types = new Lc(r.types), this.native = new Bc({ types: this._types }), this._queryQueue = [], this._ending = false, this._connecting = false, this._connected = false, this._queryable = true;
        var e = this.connectionParameters = new Fc(
          r
        );
        this.user = e.user, Object.defineProperty(this, "password", {
          configurable: true,
          enumerable: false,
          writable: true,
          value: e.password
        }), this.database = e.database, this.host = e.host, this.port = e.port, this.namedQueries = {};
      };
      J.Query = Ws;
      Rc.inherits(J, Qs);
      J.prototype._errorAllQueries = function(r) {
        let e = a(
          (t) => {
            m.nextTick(() => {
              t.native = this.native, t.handleError(r);
            });
          },
          "enqueueError"
        );
        this._hasActiveQuery() && (e(this._activeQuery), this._activeQuery = null), this._queryQueue.forEach(e), this._queryQueue.length = 0;
      };
      J.prototype._connect = function(r) {
        var e = this;
        if (this._connecting) {
          m.nextTick(() => r(new Error("Client has already been connected. You cannot reuse a client.")));
          return;
        }
        this._connecting = true, this.connectionParameters.getLibpqConnectionString(function(t, n) {
          if (t) return r(
            t
          );
          e.native.connect(n, function(i) {
            if (i) return e.native.end(), r(i);
            e._connected = true, e.native.on("error", function(s) {
              e._queryable = false, e._errorAllQueries(s), e.emit("error", s);
            }), e.native.on("notification", function(s) {
              e.emit("notification", { channel: s.relname, payload: s.extra });
            }), e.emit("connect"), e._pulseQueryQueue(true), r();
          });
        });
      };
      J.prototype.connect = function(r) {
        if (r) {
          this._connect(r);
          return;
        }
        return new this._Promise(
          (e, t) => {
            this._connect((n) => {
              n ? t(n) : e();
            });
          }
        );
      };
      J.prototype.query = function(r, e, t) {
        var n, i, s, o, u;
        if (r == null) throw new TypeError("Client was passed a null or undefined query");
        if (typeof r.submit == "function") s = r.query_timeout || this.connectionParameters.query_timeout, i = n = r, typeof e == "function" && (r.callback = e);
        else if (s = this.connectionParameters.query_timeout, n = new Ws(r, e, t), !n.callback) {
          let c, h;
          i = new this._Promise((l, d) => {
            c = l, h = d;
          }), n.callback = (l, d) => l ? h(l) : c(d);
        }
        return s && (u = n.callback, o = setTimeout(() => {
          var c = new Error("Query read timeout");
          m.nextTick(() => {
            n.handleError(c, this.connection);
          }), u(c), n.callback = () => {
          };
          var h = this._queryQueue.indexOf(n);
          h > -1 && this._queryQueue.splice(h, 1), this._pulseQueryQueue();
        }, s), n.callback = (c, h) => {
          clearTimeout(o), u(c, h);
        }), this._queryable ? this._ending ? (n.native = this.native, m.nextTick(() => {
          n.handleError(
            new Error("Client was closed and is not queryable")
          );
        }), i) : (this._queryQueue.push(
          n
        ), this._pulseQueryQueue(), i) : (n.native = this.native, m.nextTick(() => {
          n.handleError(
            new Error("Client has encountered a connection error and is not queryable")
          );
        }), i);
      };
      J.prototype.end = function(r) {
        var e = this;
        this._ending = true, this._connected || this.once(
          "connect",
          this.end.bind(this, r)
        );
        var t;
        return r || (t = new this._Promise(function(n, i) {
          r = a((s) => s ? i(s) : n(), "cb");
        })), this.native.end(function() {
          e._errorAllQueries(new Error(
            "Connection terminated"
          )), m.nextTick(() => {
            e.emit("end"), r && r();
          });
        }), t;
      };
      J.prototype._hasActiveQuery = function() {
        return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
      };
      J.prototype._pulseQueryQueue = function(r) {
        if (this._connected && !this._hasActiveQuery()) {
          var e = this._queryQueue.shift();
          if (!e) {
            r || this.emit("drain");
            return;
          }
          this._activeQuery = e, e.submit(this);
          var t = this;
          e.once(
            "_done",
            function() {
              t._pulseQueryQueue();
            }
          );
        }
      };
      J.prototype.cancel = function(r) {
        this._activeQuery === r ? this.native.cancel(function() {
        }) : this._queryQueue.indexOf(r) !== -1 && this._queryQueue.splice(this._queryQueue.indexOf(r), 1);
      };
      J.prototype.ref = function() {
      };
      J.prototype.unref = function() {
      };
      J.prototype.setTypeParser = function(r, e, t) {
        return this._types.setTypeParser(r, e, t);
      };
      J.prototype.getTypeParser = function(r, e) {
        return this._types.getTypeParser(r, e);
      };
    });
    bn = I((xf, Gs) => {
      "use strict";
      p();
      Gs.exports = Hs();
    });
    Ct = I((Ef, rt) => {
      "use strict";
      p();
      var Mc = Bs(), Dc = Xe(), kc = hn(), Uc = Ms(), { DatabaseError: Oc } = an(), Nc = a((r) => {
        var e;
        return e = class extends Uc {
          constructor(n) {
            super(n, r);
          }
        }, a(e, "BoundPool"), e;
      }, "poolFactory"), Sn = a(function(r) {
        this.defaults = Dc, this.Client = r, this.Query = this.Client.Query, this.Pool = Nc(this.Client), this._pools = [], this.Connection = kc, this.types = Je(), this.DatabaseError = Oc;
      }, "PG");
      typeof m.env.NODE_PG_FORCE_NATIVE < "u" ? rt.exports = new Sn(bn()) : (rt.exports = new Sn(Mc), Object.defineProperty(rt.exports, "native", { configurable: true, enumerable: false, get() {
        var r = null;
        try {
          r = new Sn(bn());
        } catch (e) {
          if (e.code !== "MODULE_NOT_FOUND") throw e;
        }
        return Object.defineProperty(rt.exports, "native", { value: r }), r;
      } }));
    });
    p();
    Tt = Te(Ct());
    wt();
    p();
    pr();
    wt();
    Ks = Te(et());
    zs = Te(mt());
    xn = class xn2 extends Error {
      constructor() {
        super(...arguments);
        _(this, "name", "NeonDbError");
        _(this, "severity");
        _(this, "code");
        _(this, "detail");
        _(this, "hint");
        _(
          this,
          "position"
        );
        _(this, "internalPosition");
        _(this, "internalQuery");
        _(this, "where");
        _(this, "schema");
        _(this, "table");
        _(this, "column");
        _(this, "dataType");
        _(
          this,
          "constraint"
        );
        _(this, "file");
        _(this, "line");
        _(this, "routine");
        _(this, "sourceError");
      }
    };
    a(xn, "NeonDbError");
    Ae = xn;
    $s = "transaction() expects an array of queries, or a function returning an array of queries";
    qc = ["severity", "code", "detail", "hint", "position", "internalPosition", "internalQuery", "where", "schema", "table", "column", "dataType", "constraint", "file", "line", "routine"];
    a(Ys, "neon");
    a(Qc, "createNeonQueryPromise");
    a(Vs, "processQueryResult");
    Js = Te(gt());
    Qe = Te(Ct());
    En = class En2 extends Tt.Client {
      constructor(t) {
        super(t);
        this.config = t;
      }
      get neonConfig() {
        return this.connection.stream;
      }
      connect(t) {
        let { neonConfig: n } = this;
        n.forceDisablePgSSL && (this.ssl = this.connection.ssl = false), this.ssl && n.useSecureWebSocket && console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");
        let i = this.config?.host !== void 0 || this.config?.connectionString !== void 0 || m.env.PGHOST !== void 0, s = m.env.USER ?? m.env.USERNAME;
        if (!i && this.host === "localhost" && this.user === s && this.database === s && this.password === null) throw new Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${s}, db: ${s}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);
        let o = super.connect(t), u = n.pipelineTLS && this.ssl, c = n.pipelineConnect === "password";
        if (!u && !n.pipelineConnect) return o;
        let h = this.connection;
        if (u && h.on("connect", () => h.stream.emit("data", "S")), c) {
          h.removeAllListeners(
            "authenticationCleartextPassword"
          ), h.removeAllListeners("readyForQuery"), h.once(
            "readyForQuery",
            () => h.on("readyForQuery", this._handleReadyForQuery.bind(this))
          );
          let l = this.ssl ? "sslconnect" : "connect";
          h.on(l, () => {
            this._handleAuthCleartextPassword(), this._handleReadyForQuery();
          });
        }
        return o;
      }
      async _handleAuthSASLContinue(t) {
        let n = this.saslSession, i = this.password, s = t.data;
        if (n.message !== "SASLInitialResponse" || typeof i != "string" || typeof s != "string") throw new Error("SASL: protocol error");
        let o = Object.fromEntries(s.split(",").map((U) => {
          if (!/^.=/.test(U)) throw new Error("SASL: Invalid attribute pair entry");
          let K = U[0], le = U.substring(2);
          return [K, le];
        })), u = o.r, c = o.s, h = o.i;
        if (!u || !/^[!-+--~]+$/.test(u)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");
        if (!c || !/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(c)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64");
        if (!h || !/^[1-9][0-9]*$/.test(h)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count");
        if (!u.startsWith(n.clientNonce)) throw new Error(
          "SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce"
        );
        if (u.length === n.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
        let l = parseInt(h, 10), d = y.from(c, "base64"), b = new TextEncoder(), C = b.encode(i), B = await g.subtle.importKey("raw", C, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), W = new Uint8Array(await g.subtle.sign("HMAC", B, y.concat([d, y.from(
          [0, 0, 0, 1]
        )]))), X = W;
        for (var de = 0; de < l - 1; de++) W = new Uint8Array(await g.subtle.sign(
          "HMAC",
          B,
          W
        )), X = y.from(X.map((U, K) => X[K] ^ W[K]));
        let A = X, w = await g.subtle.importKey(
          "raw",
          A,
          { name: "HMAC", hash: { name: "SHA-256" } },
          false,
          ["sign"]
        ), P = new Uint8Array(await g.subtle.sign("HMAC", w, b.encode("Client Key"))), V = await g.subtle.digest(
          "SHA-256",
          P
        ), k = "n=*,r=" + n.clientNonce, j = "r=" + u + ",s=" + c + ",i=" + l, ce = "c=biws,r=" + u, ee = k + "," + j + "," + ce, R = await g.subtle.importKey(
          "raw",
          V,
          { name: "HMAC", hash: { name: "SHA-256" } },
          false,
          ["sign"]
        );
        var G = new Uint8Array(await g.subtle.sign("HMAC", R, b.encode(ee))), he = y.from(P.map((U, K) => P[K] ^ G[K])), ye = he.toString("base64");
        let xe = await g.subtle.importKey(
          "raw",
          A,
          { name: "HMAC", hash: { name: "SHA-256" } },
          false,
          ["sign"]
        ), me = await g.subtle.sign(
          "HMAC",
          xe,
          b.encode("Server Key")
        ), se = await g.subtle.importKey("raw", me, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
        var oe = y.from(await g.subtle.sign(
          "HMAC",
          se,
          b.encode(ee)
        ));
        n.message = "SASLResponse", n.serverSignature = oe.toString("base64"), n.response = ce + ",p=" + ye, this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
      }
    };
    a(En, "NeonClient");
    vn = En;
    a(Wc, "promisify");
    _n = class _n2 extends Tt.Pool {
      constructor() {
        super(...arguments);
        _(this, "Client", vn);
        _(this, "hasFetchUnsupportedListeners", false);
      }
      on(t, n) {
        return t !== "error" && (this.hasFetchUnsupportedListeners = true), super.on(t, n);
      }
      query(t, n, i) {
        if (!_e.poolQueryViaFetch || this.hasFetchUnsupportedListeners || typeof t == "function")
          return super.query(t, n, i);
        typeof n == "function" && (i = n, n = void 0);
        let s = Wc(
          this.Promise,
          i
        );
        i = s.callback;
        try {
          let o = new Js.default(this.options), u = encodeURIComponent, c = encodeURI, h = `postgresql://${u(o.user)}:${u(o.password)}@${u(o.host)}/${c(o.database)}`, l = typeof t == "string" ? t : t.text, d = n ?? t.values ?? [];
          Ys(h, { fullResults: true, arrayMode: t.rowMode === "array" })(l, d, { types: t.types ?? this.options?.types }).then((C) => i(void 0, C)).catch((C) => i(
            C
          ));
        } catch (o) {
          i(o);
        }
        return s.result;
      }
    };
    a(_n, "NeonPool");
    Zs = _n;
    export_ClientBase = Qe.ClientBase;
    export_Connection = Qe.Connection;
    export_DatabaseError = Qe.DatabaseError;
    export_Query = Qe.Query;
    export_defaults = Qe.defaults;
    export_types = Qe.types;
  }
});

// node_modules/@vercel/postgres/dist/chunk-7IR77QAQ.js
function postgresConnectionString(type = "pool") {
  let connectionString;
  switch (type) {
    case "pool": {
      connectionString = process.env.POSTGRES_URL;
      break;
    }
    case "direct": {
      connectionString = process.env.POSTGRES_URL_NON_POOLING;
      break;
    }
    default: {
      const _exhaustiveCheck = type;
      const str = _exhaustiveCheck;
      throw new VercelPostgresError(
        "invalid_connection_type",
        `Unhandled type: ${str}`
      );
    }
  }
  if (connectionString === "undefined") connectionString = void 0;
  return connectionString;
}
function isPooledConnectionString(connectionString) {
  return connectionString.includes("-pooler.");
}
function isDirectConnectionString(connectionString) {
  return !isPooledConnectionString(connectionString);
}
function isLocalhostConnectionString(connectionString) {
  try {
    const withHttpsProtocol = connectionString.replace(
      /^postgresql:\/\//,
      "https://"
    );
    return new URL(withHttpsProtocol).hostname === "localhost";
  } catch (err) {
    if (err instanceof TypeError) {
      return false;
    }
    if (typeof err === "object" && err !== null && "message" in err && typeof err.message === "string" && err.message === "Invalid URL") {
      return false;
    }
    throw err;
  }
}
function sqlTemplate(strings, ...values) {
  var _a, _b;
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new VercelPostgresError(
      "incorrect_tagged_template_call",
      "It looks like you tried to call `sql` as a function. Make sure to use it as a tagged template.\n	Example: sql`SELECT * FROM users`, not sql('SELECT * FROM users')"
    );
  }
  let result = (_a = strings[0]) != null ? _a : "";
  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${(_b = strings[i]) != null ? _b : ""}`;
  }
  return [result, values];
}
function isTemplateStringsArray(strings) {
  return Array.isArray(strings) && "raw" in strings && Array.isArray(strings.raw);
}
function createClient(config) {
  var _a;
  const connectionString = (_a = config == null ? void 0 : config.connectionString) != null ? _a : postgresConnectionString("direct");
  if (!connectionString)
    throw new VercelPostgresError(
      "missing_connection_string",
      "You did not supply a 'connectionString' and no 'POSTGRES_URL_NON_POOLING' env var was found."
    );
  if (!isLocalhostConnectionString(connectionString) && !isDirectConnectionString(connectionString))
    throw new VercelPostgresError(
      "invalid_connection_string",
      "This connection string is meant to be used with a pooled connection. Try `createPool()` instead."
    );
  return new VercelClient({
    ...config,
    connectionString
  });
}
function createPool(config) {
  var _a;
  const connectionString = (_a = config == null ? void 0 : config.connectionString) != null ? _a : postgresConnectionString("pool");
  if (!connectionString)
    throw new VercelPostgresError(
      "missing_connection_string",
      "You did not supply a 'connectionString' and no 'POSTGRES_URL' env var was found."
    );
  if (!isLocalhostConnectionString(connectionString) && !isPooledConnectionString(connectionString))
    throw new VercelPostgresError(
      "invalid_connection_string",
      "This connection string is meant to be used with a direct connection. Make sure to use a pooled connection string or try `createClient()` instead."
    );
  let maxUses = config == null ? void 0 : config.maxUses;
  let max = config == null ? void 0 : config.max;
  if (typeof EdgeRuntime !== "undefined") {
    if (maxUses && maxUses !== 1) {
      console.warn(
        "@vercel/postgres: Overriding `maxUses` to 1 because the EdgeRuntime does not support client reuse."
      );
    }
    if (max && max !== 1e4) {
      console.warn(
        "@vercel/postgres: Overriding `max` to 10,000 because the EdgeRuntime does not support client reuse."
      );
    }
    maxUses = 1;
    max = 1e4;
  }
  const pool2 = new VercelPool({
    ...config,
    connectionString,
    maxUses,
    max
  });
  return pool2;
}
var VercelPostgresError, VercelClient, VercelPool, pool, sql, db;
var init_chunk_7IR77QAQ = __esm({
  "node_modules/@vercel/postgres/dist/chunk-7IR77QAQ.js"() {
    init_serverless();
    init_serverless();
    init_serverless();
    VercelPostgresError = class extends Error {
      constructor(code, message) {
        super(`VercelPostgresError - '${code}': ${message}`);
        this.code = code;
        this.name = "VercelPostgresError";
      }
    };
    VercelClient = class extends vn {
      /**
       * A template literal tag providing safe, easy to use SQL parameterization.
       * Parameters are substituted using the underlying Postgres database, and so must follow
       * the rules of Postgres parameterization.
       * @example
       * ```ts
       * const pool = createClient();
       * const userId = 123;
       * await client.connect();
       * const result = await pool.sql`SELECT * FROM users WHERE id = ${userId}`;
       * // Equivalent to: await pool.query('SELECT * FROM users WHERE id = $1', [id]);
       * await client.end();
       * ```
       * @returns A promise that resolves to the query result.
       */
      async sql(strings, ...values) {
        const [query2, params] = sqlTemplate(strings, ...values);
        return this.query(query2, params);
      }
    };
    VercelPool = class extends Zs {
      constructor(config) {
        var _a;
        super(config);
        this.Client = VercelClient;
        this.connectionString = (_a = config.connectionString) != null ? _a : "";
      }
      /**
       * A template literal tag providing safe, easy to use SQL parameterization.
       * Parameters are substituted using the underlying Postgres database, and so must follow
       * the rules of Postgres parameterization.
       * @example
       * ```ts
       * const pool = createPool();
       * const userId = 123;
       * const result = await pool.sql`SELECT * FROM users WHERE id = ${userId}`;
       * // Equivalent to: await pool.query('SELECT * FROM users WHERE id = $1', [id]);
       * ```
       * @returns A promise that resolves to the query result.
       */
      async sql(strings, ...values) {
        const [query2, params] = sqlTemplate(strings, ...values);
        const sql22 = Ys(this.connectionString, {
          fullResults: true
        });
        return sql22(query2, params);
      }
      connect(callback) {
        return super.connect(
          callback
        );
      }
    };
    sql = new Proxy(
      // eslint-disable-next-line @typescript-eslint/no-empty-function -- [@vercel/style-guide@5 migration]
      () => {
      },
      {
        get(_2, prop) {
          if (!pool) {
            pool = createPool();
          }
          const val = Reflect.get(pool, prop);
          if (typeof val === "function") {
            return val.bind(pool);
          }
          return val;
        },
        apply(_2, __, argumentsList) {
          if (!pool) {
            pool = createPool();
          }
          return pool.sql(...argumentsList);
        }
      }
    );
    db = sql;
  }
});

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: /* @__PURE__ */ Symbol("kIsForOnEventAttribute"),
      kListener: /* @__PURE__ */ Symbol("kListener"),
      kStatusCode: /* @__PURE__ */ Symbol("status-code"),
      kWebSocket: /* @__PURE__ */ Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/node-gyp-build/node-gyp-build.js
var require_node_gyp_build = __commonJS({
  "node_modules/node-gyp-build/node-gyp-build.js"(exports, module) {
    var fs = __require("fs");
    var path = __require("path");
    var os = __require("os");
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require;
    var vars = process.config && process.config.variables || {};
    var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
    var abi = process.versions.modules;
    var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
    var arch = process.env.npm_config_arch || os.arch();
    var platform = process.env.npm_config_platform || os.platform();
    var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
    var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
    var uv = (process.versions.uv || "").split(".")[0];
    module.exports = load;
    function load(dir) {
      return runtimeRequire(load.resolve(dir));
    }
    load.resolve = load.path = function(dir) {
      dir = path.resolve(dir || ".");
      try {
        var name = runtimeRequire(path.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
        if (process.env[name + "_PREBUILD"]) dir = process.env[name + "_PREBUILD"];
      } catch (err) {
      }
      if (!prebuildsOnly) {
        var release = getFirst(path.join(dir, "build/Release"), matchBuild);
        if (release) return release;
        var debug = getFirst(path.join(dir, "build/Debug"), matchBuild);
        if (debug) return debug;
      }
      var prebuild = resolve(dir);
      if (prebuild) return prebuild;
      var nearby = resolve(path.dirname(process.execPath));
      if (nearby) return nearby;
      var target = [
        "platform=" + platform,
        "arch=" + arch,
        "runtime=" + runtime,
        "abi=" + abi,
        "uv=" + uv,
        armv ? "armv=" + armv : "",
        "libc=" + libc,
        "node=" + process.versions.node,
        process.versions.electron ? "electron=" + process.versions.electron : "",
        typeof __webpack_require__ === "function" ? "webpack=true" : ""
        // eslint-disable-line
      ].filter(Boolean).join(" ");
      throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
      function resolve(dir2) {
        var tuples = readdirSync(path.join(dir2, "prebuilds")).map(parseTuple);
        var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0];
        if (!tuple) return;
        var prebuilds = path.join(dir2, "prebuilds", tuple.name);
        var parsed = readdirSync(prebuilds).map(parseTags);
        var candidates = parsed.filter(matchTags(runtime, abi));
        var winner = candidates.sort(compareTags(runtime))[0];
        if (winner) return path.join(prebuilds, winner.file);
      }
    };
    function readdirSync(dir) {
      try {
        return fs.readdirSync(dir);
      } catch (err) {
        return [];
      }
    }
    function getFirst(dir, filter) {
      var files = readdirSync(dir).filter(filter);
      return files[0] && path.join(dir, files[0]);
    }
    function matchBuild(name) {
      return /\.node$/.test(name);
    }
    function parseTuple(name) {
      var arr = name.split("-");
      if (arr.length !== 2) return;
      var platform2 = arr[0];
      var architectures = arr[1].split("+");
      if (!platform2) return;
      if (!architectures.length) return;
      if (!architectures.every(Boolean)) return;
      return { name, platform: platform2, architectures };
    }
    function matchTuple(platform2, arch2) {
      return function(tuple) {
        if (tuple == null) return false;
        if (tuple.platform !== platform2) return false;
        return tuple.architectures.includes(arch2);
      };
    }
    function compareTuples(a2, b) {
      return a2.architectures.length - b.architectures.length;
    }
    function parseTags(file) {
      var arr = file.split(".");
      var extension2 = arr.pop();
      var tags = { file, specificity: 0 };
      if (extension2 !== "node") return;
      for (var i = 0; i < arr.length; i++) {
        var tag = arr[i];
        if (tag === "node" || tag === "electron" || tag === "node-webkit") {
          tags.runtime = tag;
        } else if (tag === "napi") {
          tags.napi = true;
        } else if (tag.slice(0, 3) === "abi") {
          tags.abi = tag.slice(3);
        } else if (tag.slice(0, 2) === "uv") {
          tags.uv = tag.slice(2);
        } else if (tag.slice(0, 4) === "armv") {
          tags.armv = tag.slice(4);
        } else if (tag === "glibc" || tag === "musl") {
          tags.libc = tag;
        } else {
          continue;
        }
        tags.specificity++;
      }
      return tags;
    }
    function matchTags(runtime2, abi2) {
      return function(tags) {
        if (tags == null) return false;
        if (tags.runtime && tags.runtime !== runtime2 && !runtimeAgnostic(tags)) return false;
        if (tags.abi && tags.abi !== abi2 && !tags.napi) return false;
        if (tags.uv && tags.uv !== uv) return false;
        if (tags.armv && tags.armv !== armv) return false;
        if (tags.libc && tags.libc !== libc) return false;
        return true;
      };
    }
    function runtimeAgnostic(tags) {
      return tags.runtime === "node" && tags.napi;
    }
    function compareTags(runtime2) {
      return function(a2, b) {
        if (a2.runtime !== b.runtime) {
          return a2.runtime === runtime2 ? -1 : 1;
        } else if (a2.abi !== b.abi) {
          return a2.abi ? -1 : 1;
        } else if (a2.specificity !== b.specificity) {
          return a2.specificity > b.specificity ? -1 : 1;
        } else {
          return 0;
        }
      };
    }
    function isNwjs() {
      return !!(process.versions && process.versions.nw);
    }
    function isElectron() {
      if (process.versions && process.versions.electron) return true;
      if (process.env.ELECTRON_RUN_AS_NODE) return true;
      return typeof window !== "undefined" && window.process && window.process.type === "renderer";
    }
    function isAlpine(platform2) {
      return platform2 === "linux" && fs.existsSync("/etc/alpine-release");
    }
    load.parseTags = parseTags;
    load.matchTags = matchTags;
    load.compareTags = compareTags;
    load.parseTuple = parseTuple;
    load.matchTuple = matchTuple;
    load.compareTuples = compareTuples;
  }
});

// node_modules/node-gyp-build/index.js
var require_node_gyp_build2 = __commonJS({
  "node_modules/node-gyp-build/index.js"(exports, module) {
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require;
    if (typeof runtimeRequire.addon === "function") {
      module.exports = runtimeRequire.addon.bind(runtimeRequire);
    } else {
      module.exports = require_node_gyp_build();
    }
  }
});

// node_modules/bufferutil/fallback.js
var require_fallback = __commonJS({
  "node_modules/bufferutil/fallback.js"(exports, module) {
    "use strict";
    var mask = (source, mask2, output, offset, length) => {
      for (var i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask2[i & 3];
      }
    };
    var unmask = (buffer, mask2) => {
      const length = buffer.length;
      for (var i = 0; i < length; i++) {
        buffer[i] ^= mask2[i & 3];
      }
    };
    module.exports = { mask, unmask };
  }
});

// node_modules/bufferutil/index.js
var require_bufferutil = __commonJS({
  "node_modules/bufferutil/index.js"(exports, module) {
    "use strict";
    try {
      module.exports = require_node_gyp_build2()(__dirname);
    } catch (e) {
      module.exports = require_fallback();
    }
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = require_bufferutil();
        module.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    var kDone = /* @__PURE__ */ Symbol("kDone");
    var kRun = /* @__PURE__ */ Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    var zlib = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = /* @__PURE__ */ Symbol("permessage-deflate");
    var kTotalLength = /* @__PURE__ */ Symbol("total-length");
    var kCallback = /* @__PURE__ */ Symbol("callback");
    var kBuffers = /* @__PURE__ */ Symbol("buffers");
    var kError = /* @__PURE__ */ Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [options.isServer=false] Create the instance in either
       *     server or client mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    var { isUtf8 } = __require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = __require("utf-8-validate");
        module.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    var { Writable } = __require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxBufferedChunks = options.maxBufferedChunks | 0;
        this._maxFragments = options.maxFragments | 0;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._numFragments = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          cb(
            this.createError(
              RangeError,
              "Too many buffered chunks",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            )
          );
          return;
        }
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
          const error = this.createError(
            RangeError,
            "Too many message fragments",
            false,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS"
          );
          cb(error);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._numFragments = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module.exports = Receiver2;
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    var { Duplex } = __require("stream");
    var { randomFillSync } = __require("crypto");
    var {
      types: { isUint8Array }
    } = __require("util");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = /* @__PURE__ */ Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else if (isUint8Array(data)) {
            buf.set(data, 2);
          } else {
            throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_2, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = /* @__PURE__ */ Symbol("kCode");
    var kData = /* @__PURE__ */ Symbol("kData");
    var kError = /* @__PURE__ */ Symbol("kError");
    var kMessage = /* @__PURE__ */ Symbol("kMessage");
    var kReason = /* @__PURE__ */ Symbol("kReason");
    var kTarget = /* @__PURE__ */ Symbol("kTarget");
    var kType = /* @__PURE__ */ Symbol("kType");
    var kWasClean = /* @__PURE__ */ Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler2, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler2 && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler2, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler2, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler2, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler2, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler2;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler2) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler2 && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension2].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v2) => v2 === true ? k : `${k}=${v2}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var https = __require("https");
    var http = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash } = __require("crypto");
    var { Duplex, Readable } = __require("stream");
    var { URL: URL2 } = __require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = /* @__PURE__ */ Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket3 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxBufferedChunks: options.maxBufferedChunks,
          maxFragments: options.maxFragments,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket3, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket3.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket3, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket3.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket3, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket3.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket3, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket3.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket3.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket3.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler2) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler2 !== "function") return;
          this.addEventListener(method, handler2, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket3.prototype.addEventListener = addEventListener;
    WebSocket3.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket3;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxBufferedChunks: 256 * 1024,
        maxFragments: 16 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket3.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxBufferedChunks: opts.maxBufferedChunks,
          maxFragments: opts.maxFragments,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket3.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket3.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket3.CLOSED) return;
      if (websocket.readyState === WebSocket3.OPEN) {
        websocket._readyState = WebSocket3.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket3.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket3.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket3.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    var WebSocket3 = require_websocket();
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws2, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws2.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws2.pause();
      });
      ws2.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws2.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws2.readyState === ws2.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws2.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws2.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws2.terminate();
      };
      duplex._final = function(callback) {
        if (ws2.readyState === ws2.CONNECTING) {
          ws2.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws2._socket === null) return;
        if (ws2._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws2._socket.once("finish", function finish() {
            callback();
          });
          ws2.close();
        }
      };
      duplex._read = function() {
        if (ws2.isPaused) ws2.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws2.readyState === ws2.CONNECTING) {
          ws2.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws2.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module.exports = createWebSocketStream2;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http = __require("http");
    var { Duplex } = __require("stream");
    var { createHash } = __require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket3 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=16384] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxBufferedChunks: 256 * 1024,
          maxFragments: 16 * 1024,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket3,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws2 = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws2._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws2._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws2.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxBufferedChunks: this.options.maxBufferedChunks,
          maxFragments: this.options.maxFragments,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws2);
          ws2.on("close", () => {
            this.clients.delete(ws2);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws2, req);
      }
    };
    module.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// node_modules/ws/wrapper.mjs
var import_stream, import_extension, import_permessage_deflate, import_receiver, import_sender, import_subprotocol, import_websocket, import_websocket_server, wrapper_default;
var init_wrapper = __esm({
  "node_modules/ws/wrapper.mjs"() {
    import_stream = __toESM(require_stream(), 1);
    import_extension = __toESM(require_extension(), 1);
    import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
    import_receiver = __toESM(require_receiver(), 1);
    import_sender = __toESM(require_sender(), 1);
    import_subprotocol = __toESM(require_subprotocol(), 1);
    import_websocket = __toESM(require_websocket(), 1);
    import_websocket_server = __toESM(require_websocket_server(), 1);
    wrapper_default = import_websocket.default;
  }
});

// node_modules/@vercel/postgres/dist/index-node.js
var index_node_exports = {};
__export(index_node_exports, {
  VercelClient: () => VercelClient,
  VercelPool: () => VercelPool,
  createClient: () => createClient,
  createPool: () => createPool,
  db: () => db,
  postgresConnectionString: () => postgresConnectionString,
  sql: () => sql,
  types: () => export_types
});
var init_index_node = __esm({
  "node_modules/@vercel/postgres/dist/index-node.js"() {
    init_chunk_7IR77QAQ();
    init_serverless();
    init_wrapper();
    if (_e) {
      _e.webSocketConstructor = wrapper_default;
    }
  }
});

// api/_lib/db.ts
import Database from "better-sqlite3";
import { PGlite } from "@electric-sql/pglite";
var POSTGRES_URL = process.env.POSTGRES_URL || "";
var usePGlite = POSTGRES_URL.startsWith("pglite://");
var useSqlite = !POSTGRES_URL || POSTGRES_URL.startsWith("sqlite://") || POSTGRES_URL === "sqlite";
var sqliteDb = null;
var pgliteInstance = null;
var pgliteReady = null;
function getSqlite() {
  if (!sqliteDb) {
    const file = POSTGRES_URL.startsWith("sqlite://") ? POSTGRES_URL.replace("sqlite://", "") : "./viaturas.db";
    sqliteDb = new Database(file);
    sqliteDb.pragma("journal_mode = WAL");
    sqliteDb.pragma("foreign_keys = ON");
    console.log(`[db] SQLite opened: ${file}`);
  }
  return sqliteDb;
}
function getPGlite() {
  if (!pgliteInstance) {
    const dataDir = POSTGRES_URL.startsWith("pglite://") ? POSTGRES_URL.replace("pglite://", "") : "./.pgdata";
    pgliteInstance = new PGlite(dataDir);
    pgliteReady = pgliteInstance.waitReady;
  }
  return pgliteInstance;
}
async function ensurePGlite() {
  if (pgliteReady) await pgliteReady;
}
function toSqlitePlaceholders(sql3) {
  return sql3.replace(/\$\d+/g, "?");
}
async function query(text, params = []) {
  if (useSqlite) {
    await ensureSchema();
    await ensureSeed();
    const db2 = getSqlite();
    const sqliteSql = toSqlitePlaceholders(text);
    const stmt = db2.prepare(sqliteSql);
    let rows;
    let rowCount = 0;
    if (/^\s*(SELECT|PRAGMA)/i.test(text) || /\bRETURNING\b/i.test(text)) {
      rows = stmt.all(...params);
      rowCount = rows.length;
    } else {
      const info = stmt.run(...params);
      rowCount = info.changes;
      rows = [];
    }
    return { rows, rowCount };
  }
  if (usePGlite) {
    await ensurePGlite();
    await ensureSchema();
    await ensureSeed();
    const result2 = await getPGlite().query(text, params);
    return {
      rows: result2.rows,
      rowCount: result2.affectedRows ?? result2.rows.length
    };
  }
  const { sql: vsql } = await Promise.resolve().then(() => (init_index_node(), index_node_exports));
  const result = await vsql.query(text, params);
  return {
    rows: result.rows,
    rowCount: result.rowCount ?? result.rows.length
  };
}
var now = () => Date.now();
var schemaInitialized = false;
async function ensureSchema() {
  if (usePGlite || schemaInitialized) return;
  if (!useSqlite) return;
  const fs = await import("fs/promises");
  const path = await import("path");
  const candidates = [
    path.join(process.cwd(), "schema.sqlite.sql"),
    path.join(process.cwd(), "..", "schema.sqlite.sql"),
    path.join(process.cwd(), "..", "..", "schema.sqlite.sql")
  ];
  let schema = null;
  for (const c of candidates) {
    try {
      schema = await fs.readFile(c, "utf-8");
      break;
    } catch {
    }
  }
  if (!schema) {
    console.warn("[db] schema.sqlite.sql nao encontrado");
    return;
  }
  try {
    getSqlite().exec(schema);
    schemaInitialized = true;
    console.log("[db] Schema SQLite inicializado");
  } catch (e) {
    console.error("[db] Erro ao rodar schema:", e.message);
  }
}
var seedInitialized = false;
async function ensureSeed() {
  if (usePGlite || seedInitialized) return;
  if (!useSqlite) return;
  await ensureSchema();
  const db2 = getSqlite();
  const count = db2.prepare("SELECT COUNT(*) as c FROM units").get();
  if (count.c > 0) {
    seedInitialized = true;
    return;
  }
  const insertUnit = db2.prepare(`
    INSERT OR IGNORE INTO units (code, name, sigla, parentUnit, commandUnit, active)
    VALUES (?, ?, ?, NULL, NULL, 1)
  `);
  const units = [
    ["607000000", "CPI-7", "CPI7"],
    ["607070000", "7o BPM/I", "7BPMI"],
    ["607120000", "12o BPM/I", "12BPMI"],
    ["607140000", "14o BAEP", "14BAEP"],
    ["607220000", "22o BPM/I", "22BPMI"],
    ["607400000", "40o BPM/I", "40BPMI"],
    ["607500000", "50o BPM/I", "50BPMI"],
    ["607530000", "53o BPM/I", "53BPMI"],
    ["607540000", "54o BPM/I", "54BPMI"],
    ["607550000", "55o BPM/I", "55BPMI"]
  ];
  for (const [code, name, sigla] of units) {
    insertUnit.run(code, name, sigla);
  }
  seedInitialized = true;
  console.log("[db] Seed SQLite: 10 units inseridas (clone seed_units.py do Convex)");
}
function buildTaggedSql(strings, values) {
  let text = "";
  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    if (i < values.length) {
      text += `$${i + 1}`;
    }
  }
  return { text, params: values };
}
async function sql2(strings, ...values) {
  const { text, params } = buildTaggedSql(strings, values);
  return query(text, params);
}

// api/_lib/google.ts
import { OAuth2Client } from "google-auth-library";
var CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
var _client = null;
function getClient() {
  if (!_client) {
    _client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
  }
  return _client;
}
async function verifyGoogleToken(credential) {
  if (!CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID n\xE3o configurado");
  }
  const ticket = await getClient().verifyIdToken({
    idToken: credential,
    audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error("Google token inv\xE1lido");
  if (!payload.email_verified) {
    throw new Error("Email do Google n\xE3o verificado");
  }
  return {
    sub: payload.sub,
    email: payload.email,
    email_verified: payload.email_verified,
    name: payload.name,
    picture: payload.picture,
    given_name: payload.given_name,
    family_name: payload.family_name
  };
}
async function exchangeCode(code, redirectUri) {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET nao configurado");
  }
  const client = getClient();
  const { tokens } = await client.getToken({ code, redirect_uri: redirectUri });
  if (!tokens.id_token) {
    throw new Error("Google nao retornou id_token");
  }
  return {
    idToken: tokens.id_token,
    accessToken: tokens.access_token || ""
  };
}

// api/_lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";
var SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "viaturas-pmesp-cpi7-2026-dev-secret-trocar-em-prod"
);
var ALG = "HS256";
var ISSUER = "viaturas-cpi7";
var AUDIENCE = "viaturas-cpi7-app";
async function signSession(payload) {
  return await new SignJWT({ ...payload }).setProtectedHeader({ alg: ALG }).setIssuedAt().setIssuer(ISSUER).setAudience(AUDIENCE).setExpirationTime("7d").sign(SECRET);
}

// api/_lib/audit.ts
async function audit(userId, cpf, action, resource, resourceId, details, req) {
  try {
    await sql2`
      INSERT INTO audit_log (user_id, cpf, action, resource, resource_id, details, ip_origem, user_agent, data_hora)
      VALUES (
        ${userId}, ${cpf}, ${action}, ${resource}, ${resourceId},
        ${JSON.stringify(details)},
        ${req.ip || req.headers["x-forwarded-for"] || null},
        ${req.headers["user-agent"] || null},
        ${now()}
      )
    `;
  } catch (e) {
    console.error("[audit] erro:", e);
  }
}

// api/auth/google/callback.ts
var CLIENT_ID2 = process.env.GOOGLE_CLIENT_ID || "";
async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }
  const { code, state, error } = req.query;
  function fail(message) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(renderResult({ error: message }));
    return;
  }
  if (error) {
    return fail(`Google: ${error}`);
  }
  if (!code) {
    return fail("Code n\xE3o fornecido");
  }
  let redirect_uri;
  let frontendState;
  if (state && state.includes("|")) {
    const idx = state.indexOf("|");
    frontendState = state.substring(0, idx);
    redirect_uri = state.substring(idx + 1);
  }
  if (!redirect_uri) {
    return fail("redirect_uri n\xE3o encontrado no state");
  }
  let idToken;
  try {
    const result2 = await exchangeCode(code, redirect_uri);
    idToken = result2.idToken;
  } catch (e) {
    console.error("[google/callback] token exchange failed:", e.message);
    return fail(`Falha ao trocar code: ${e.message}`);
  }
  let payload;
  try {
    payload = await verifyGoogleToken(idToken);
  } catch (e) {
    console.error("[google/callback] verifyIdToken failed:", e.message);
    return fail(`Token inv\xE1lido: ${e.message}`);
  }
  if (!payload?.sub || !payload?.email) {
    return fail("Payload do Google incompleto");
  }
  let userResult = await sql2`SELECT * FROM users WHERE googleId = ${payload.sub}`;
  let user = userResult.rows[0];
  let isNewUser = false;
  if (!user) {
    userResult = await sql2`SELECT * FROM users WHERE email = ${payload.email}`;
    user = userResult.rows[0];
    if (user) {
      const updateResult = await sql2`
        UPDATE users
        SET googleId = ${payload.sub},
            name = COALESCE(${payload.name}, name),
            picture = COALESCE(${payload.picture}, picture),
            lastLogin = ${now()},
            loginCount = COALESCE(loginCount, 0) + 1
        WHERE id = ${user.id}
        RETURNING *
      `;
      user = updateResult.rows[0];
    } else {
      isNewUser = true;
      const insertResult = await sql2`
        INSERT INTO users (
          googleId, email, name, picture,
          role, viaturasRole, approved, active, escopo,
          isMaster, unidadesGestor, unidadesEditor,
          createdAt, loginCount
        )
        VALUES (
          ${payload.sub}, ${payload.email}, ${payload.name}, ${payload.picture || null},
          'user', 'viewer', FALSE, TRUE, 'restrito',
          FALSE, '[]', '[]',
          ${now()}, 1
        )
        RETURNING *
      `;
      user = insertResult.rows[0];
    }
  } else {
    const updateResult = await sql2`
      UPDATE users
      SET lastLogin = ${now()}, loginCount = COALESCE(loginCount, 0) + 1
      WHERE id = ${user.id}
      RETURNING *
    `;
    user = updateResult.rows[0];
  }
  if (!user.active) {
    return fail("Usu\xE1rio desativado. Contate o administrador.");
  }
  const hasProfile = !!user.cpf;
  const session = {
    googleId: payload.sub,
    email: user.email,
    name: user.name,
    picture: user.picture,
    userId: user.id,
    cpf: user.cpf,
    re: user.re,
    warName: user.warName,
    postoGraduacao: user.postoGraduacao,
    unitId: user.unit,
    unitCode: user.opmCode,
    role: user.role,
    viaturasRole: user.viaturasRole,
    unidadesGestor: parseJsonArray(user.unidadesGestor),
    unidadesEditor: parseJsonArray(user.unidadesEditor),
    approved: user.approved,
    isMaster: user.isMaster,
    escopo: user.escopo || "restrito"
  };
  const token = await signSession(session);
  await audit(
    user.id,
    user.cpf,
    "auth.google",
    "user",
    String(user.id),
    { isNewUser, email: user.email, via: "oauth2_code" },
    req
  );
  const result = {
    token,
    session,
    isNewUser,
    needsProfile: !hasProfile,
    needsApproval: user.approved === false && !user.isMaster
  };
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(renderResult(result));
}
function parseJsonArray(v2) {
  if (Array.isArray(v2)) return v2;
  if (typeof v2 === "string" && v2.trim() !== "") {
    try {
      const parsed = JSON.parse(v2);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
function renderResult(data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Login Viaturas CPI-7</title>
<style>
  body { font-family: system-ui; padding: 40px; text-align: center; background: #f5f5f5; }
  .box { background: white; padding: 30px; border-radius: 8px; max-width: 400px; margin: 40px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  h1 { color: #1e3a5f; }
  .ok { color: #28a745; font-size: 48px; }
  .err { color: #dc3545; }
</style>
</head>
<body>
<div class="box">
  ${data.error ? `<h1 class="err">\u274C Erro</h1><p>${data.error}</p>` : `<h1 class="ok">\u2713</h1><h1>Login OK</h1><p>Voc\xEA pode fechar esta janela.</p>`}
</div>
<script>
(function() {
  var data = ${json};
  var payload = data.error
    ? { type: 'google_oauth_result', error: data.error }
    : { type: 'google_oauth_result', token: data.token, session: data.session, isNewUser: data.isNewUser, needsProfile: data.needsProfile, needsApproval: data.needsApproval };
  if (window.opener) {
    try { window.opener.postMessage(payload, window.location.origin); } catch (e) {}
  }
  setTimeout(function() { window.close(); }, ${data.error ? 4e3 : 800});
})();
</script>
</body>
</html>`;
}
export {
  handler as default
};
/*! Bundled license information:

@neondatabase/serverless/index.mjs:
  (*! Bundled license information:
  
  ieee754/index.js:
    (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  
  buffer/index.js:
    (*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     *)
  *)
*/
