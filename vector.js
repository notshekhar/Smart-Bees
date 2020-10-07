!(function (t) {
    var e = {}
    function i(n) {
        if (e[n]) return e[n].exports
        var s = (e[n] = { i: n, l: !1, exports: {} })
        return t[n].call(s.exports, s, s.exports, i), (s.l = !0), s.exports
    }
    ;(i.m = t),
        (i.c = e),
        (i.d = function (t, e, n) {
            i.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n })
        }),
        (i.r = function (t) {
            "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(t, Symbol.toStringTag, {
                    value: "Module",
                }),
                Object.defineProperty(t, "__esModule", { value: !0 })
        }),
        (i.t = function (t, e) {
            if ((1 & e && (t = i(t)), 8 & e)) return t
            if (4 & e && "object" == typeof t && t && t.__esModule) return t
            var n = Object.create(null)
            if (
                (i.r(n),
                Object.defineProperty(n, "default", {
                    enumerable: !0,
                    value: t,
                }),
                2 & e && "string" != typeof t)
            )
                for (var s in t)
                    i.d(
                        n,
                        s,
                        function (e) {
                            return t[e]
                        }.bind(null, s)
                    )
            return n
        }),
        (i.n = function (t) {
            var e =
                t && t.__esModule
                    ? function () {
                          return t.default
                      }
                    : function () {
                          return t
                      }
            return i.d(e, "a", e), e
        }),
        (i.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }),
        (i.p = ""),
        i((i.s = 0))
})([
    function (t, e) {
        class i {
            constructor(t, e, i) {
                ;(this.x = t || 0), (this.y = e || 0), (this.z = i || 0)
            }
            add(t) {
                return t instanceof i
                    ? new i(this.x + t.x, this.y + t.y, this.z + t.z)
                    : new i(this.x + t, (this.y += t), this.z + t)
            }
            subtract(t) {
                return t instanceof i
                    ? new i(this.x - t.x, this.y - t.y, this.z - t.z)
                    : new i(this.x - t, this.y - t, this.z - t)
            }
            multiply(t) {
                return t instanceof i
                    ? new i(this.x * t.x, this.y * t.y, this.z * t.z)
                    : new i(this.x * t, this.y * t, this.z * t)
            }
            init(t, e, i) {
                ;(this.x = t || 0), (this.y = e || 0), (this.z = i || 0)
            }
            dot(t) {
                return this.x * t.x + this.y * t.y + this.z * t.z
            }
            cross(t) {
                return new i(
                    this.y * t.z - this.z * t.y,
                    this.z * t.x - this.x * t.z,
                    this.x * t.y - this.y * t.x
                )
            }
            magnitude() {
                return Math.sqrt(this.dot(this))
            }
            unit() {
                return new i(
                    this.x / this.magnitude(),
                    this.y / this.magnitude(),
                    this.z / this.magnitude()
                )
            }
            copy() {
                return new i(this.x, this.y, this.z)
            }
            distance(t) {
                let e =
                    Math.pow(this.x - t.x, 2) +
                    Math.pow(this.y - t.y, 2) +
                    Math.pow(this.z - t.z, 2)
                return Math.sqrt(e)
            }
            angle(t) {
                return t
                    ? Math.acos(
                          (this.dot(t) / this.magnitude()) * t.magnitude()
                      )
                    : {
                          theta: Math.atan2(this.z, this.x),
                          pi: Math.asin(this.y / this.magnitude()),
                      }
            }
        }
        window.vector = (t, e, n) => new i(t, e, n)
    },
])
