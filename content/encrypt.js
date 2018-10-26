var d = {
    zero: ["0", "00", "000", "0000", "00000", "000000", "0000000", "00000000"],
    chars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    strReverse: function (a) {
        var b, c = [];
        for (b = 0,
            l = a.length; b < l; b++)
            c[c.length] = a.charAt(b);
        return c.reverse().join("")
    },
    encrypt: function (a, b, e) {
        var a1 = d.shuzi(a);
        var a2 = d.zimu(a);
        a = a2 + a1;
        var f, g = [];
        for (f = 0,
            l = a.length; f < l; f++)
            g[g.length] = d.to(a.charCodeAt(f), b);
        return d.rnd(e ? d.strReverse(g.join("")) : g.join(""), 4)
    },
    to: function (a, c) {
        var e = "" + d.round(a + 88, c).toString(16)
            , f = c - e.length;
        return f > 0 ? d.zero[f - 1] + e : e
    },
    round: function (a, b) {
        var c = 1 << 4 * b;
        return 0 > a ? a % c + c : a % c
    },
    shuzi: function (a) {
        return a.replace(/[^0-9]+/ig, "")
    },
    zimu: function (a) {
        return a.toLowerCase().replace(/https/g, "http").replace(/[^a-zA-Z]+/ig, "")
    },
    rnd: function (a, b) {
        return d.rd(b) + hex_md5(a) + d.rd(Math.ceil(Math.random() * 10))
    },
    rd: function (a) {
        var res = "";
        for (var i = 0; i < a; i++) {
            res += d.chars[Math.ceil(Math.random() * 35)]
        }
        return res
    }
};