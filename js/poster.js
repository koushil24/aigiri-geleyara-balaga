// =====================================================
// AIGIRI GELEYARA BALAGA - Poster Studio
// Draws Birthday / Festival / Event posters on a canvas.
// Everything happens on the phone: photos are never uploaded.
// Sections: 1 Settings  2 Drawing helpers  3 Motifs  4 Posters  5 Page controls
// =====================================================
(function () {
    "use strict";

    const canvas = document.getElementById("posterCanvas");
    if (!canvas) return;
    let ctx = canvas.getContext("2d");
    const $ = (id) => document.getElementById(id);
    let preview = null;                       // sample words used only for the small template previews
    const val = (id) => { if (preview && Object.prototype.hasOwnProperty.call(preview, id)) return preview[id]; return $(id) ? $(id).value.trim() : ""; };
    const TAU = Math.PI * 2;

    // ---------- 1. Settings ----------
    const SIZES = { portrait: [1080, 1350], square: [1080, 1080], story: [1080, 1920] };
    const SANS = '"Noto Sans Kannada","Segoe UI",Roboto,Arial,sans-serif';
    const SERIF = 'Georgia,"Noto Serif Kannada","Times New Roman",serif';
    const ORG = { kn: "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ, ಮೈಸೂರು", en: "AIGIRI GELEYARA BALAGA, Mysuru" };
    const AGB_PHOTOS = [1, 2, 3, 4].map(n => "images/gallery-slider/photo" + n + ".jpg");

    // Four designs. g = headline colours, f = frame/ornament colours, line = thin lines
    const THEMES = {
        royal: {
            bg: ["#7d1313", "#400707", "#1a0303"], glow: "rgba(255,190,70,.30)", text: "#fff4d6",
            g: ["#fff1b8", "#f2b705", "#b97a00"], f: ["#fff1b8", "#f2b705", "#b97a00"], line: "#f2b705", accent: "#ffd24a", dark: "#4a0a0a",
            ov: ["rgba(70,5,5,.80)", "rgba(20,2,2,.92)"], top: 0, panel: "rgba(0,0,0,.30)", pal: ["#ffd24a", "#ff7a59", "#7ad7f0", "#b6f09c", "#ff9ecb"]
        },
        marigold: {
            bg: ["#ffc21a", "#f58a07", "#c2410c"], glow: "rgba(255,255,255,.35)", text: "#4a0a0a",
            g: ["#8a1515", "#a31a1a", "#5a0a0a"], f: ["#b22222", "#8a1515", "#5a0a0a"], line: "#7a1111", accent: "#7a1111", dark: "#fff3c4",
            ov: ["rgba(255,190,40,.78)", "rgba(190,60,10,.90)"], top: 56, panel: "rgba(255,255,255,.38)", pal: ["#c0392b", "#7a1111", "#fff3c4", "#2a9d8f", "#6a1b9a"]
        },
        night: {
            bg: ["#0d1236", "#161c52", "#05071a"], glow: "rgba(120,140,255,.28)", text: "#f4f1ff",
            g: ["#fff1b8", "#ffd86b", "#d99a00"], f: ["#fff1b8", "#ffd86b", "#d99a00"], line: "#ffd86b", accent: "#ffd86b", dark: "#0d1236",
            ov: ["rgba(10,14,50,.80)", "rgba(3,5,22,.93)"], top: 0, panel: "rgba(255,255,255,.08)", pal: ["#ffd86b", "#ff6f91", "#6ee7ff", "#a78bfa", "#7bffb2"]
        },
        cream: {
            bg: ["#fffaf0", "#f7e9cc", "#ecd6a8"], glow: "rgba(255,255,255,.7)", text: "#4a0a0a",
            g: ["#b22222", "#8a1515", "#5a0a0a"], f: ["#e6b94d", "#b8860b", "#7a5a00"], line: "#b8860b", accent: "#8a1515", dark: "#fff3c4",
            ov: ["rgba(255,248,232,.80)", "rgba(236,214,168,.92)"], top: 0, panel: "rgba(255,255,255,.65)", pal: ["#c0392b", "#d4a017", "#2a9d8f", "#e76f51", "#6a1b9a"]
        }
    };

    const FESTIVALS = [
        { id: "ganesh", motif: "ganesh", kn: { name: "ಗಣೇಶ ಚತುರ್ಥಿ", wish: "ಗಣಪತಿ ಬಪ್ಪಾ ಮೋರಯಾ! ವಿಘ್ನ ವಿನಾಶಕ ಗಣೇಶನು ನಿಮ್ಮ ಬಾಳಿನಲ್ಲಿ ಸುಖ, ಶಾಂತಿ ಮತ್ತು ಸಮೃದ್ಧಿ ತರಲಿ." }, en: { name: "Ganesh Chaturthi", wish: "Ganpati Bappa Morya! May Lord Ganesha remove all obstacles and bless you with happiness, peace and prosperity." } },
        { id: "ashada", motif: "ashada", kn: { name: "ಆಷಾಢ ಶುಕ್ರವಾರ", wish: "ಆಷಾಢ ಶುಕ್ರವಾರದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ತಾಯಿಯ ಆಶೀರ್ವಾದ ನಿಮ್ಮ ಕುಟುಂಬದ ಮೇಲೆ ಸದಾ ಇರಲಿ." }, en: { name: "Ashada Shukravara", wish: "Happy Ashada Shukravara! May the Mother's blessings be on you and your family always." } },
        { id: "navaratri", motif: "navaratri", kn: { name: "ನವರಾತ್ರಿ ಮತ್ತು ವಿಜಯದಶಮಿ", wish: "ನವರಾತ್ರಿ ಮತ್ತು ವಿಜಯದಶಮಿಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ಒಳಿತಿನ ಜಯ ಸದಾ ನಿಮ್ಮದಾಗಲಿ." }, en: { name: "Navaratri & Vijayadashami", wish: "Happy Navaratri and Vijayadashami! May good always triumph in your life." } },
        { id: "deepavali", motif: "deepavali", kn: { name: "ದೀಪಾವಳಿ", wish: "ದೀಪಾವಳಿಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ಬೆಳಕಿನ ಹಬ್ಬ ನಿಮ್ಮ ಬಾಳನ್ನು ಸಂತೋಷದಿಂದ ಬೆಳಗಲಿ." }, en: { name: "Deepavali", wish: "Happy Deepavali! May the festival of lights fill your life with joy and prosperity." } },
        { id: "ugadi", motif: "ugadi", kn: { name: "ಯುಗಾದಿ", wish: "ಯುಗಾದಿಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ಬೇವು-ಬೆಲ್ಲದ ಈ ಹೊಸ ವರ್ಷ ನಿಮಗೆ ಸಂತೋಷ ತರಲಿ." }, en: { name: "Ugadi", wish: "Happy Ugadi! May this new year bring you joy, with the sweet and bitter in balance." } },
        { id: "sankranti", motif: "sankranti", kn: { name: "ಮಕರ ಸಂಕ್ರಾಂತಿ", wish: "ಸಂಕ್ರಾಂತಿಯ ಶುಭಾಶಯಗಳು! ಎಳ್ಳು ಬೆಲ್ಲ ತಿಂದು ಒಳ್ಳೆಯ ಮಾತಾಡಿ." }, en: { name: "Makara Sankranti", wish: "Happy Sankranti! Eat sesame and jaggery, and speak good words." } },
        { id: "rajyotsava", motif: "rajyotsava", kn: { name: "ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ", wish: "ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ಕನ್ನಡವನ್ನು ಉಳಿಸೋಣ, ಬೆಳೆಸೋಣ." }, en: { name: "Kannada Rajyotsava", wish: "Happy Kannada Rajyotsava! Let us cherish and grow our beautiful Kannada." } },
        { id: "independence", motif: "tricolor", kn: { name: "ಸ್ವಾತಂತ್ರ್ಯ ದಿನಾಚರಣೆ", wish: "ಸ್ವಾತಂತ್ರ್ಯ ದಿನಾಚರಣೆಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ಜೈ ಹಿಂದ್." }, en: { name: "Independence Day", wish: "Happy Independence Day! Jai Hind." } },
        { id: "republic", motif: "tricolor", kn: { name: "ಗಣರಾಜ್ಯೋತ್ಸವ", wish: "ಗಣರಾಜ್ಯೋತ್ಸವದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ಜೈ ಹಿಂದ್." }, en: { name: "Republic Day", wish: "Happy Republic Day! Jai Hind." } },
        { id: "newyear", motif: "newyear", kn: { name: "ಹೊಸ ವರ್ಷದ ಶುಭಾಶಯಗಳು", wish: "ಹೊಸ ವರ್ಷ ನಿಮ್ಮ ಬಾಳಿನಲ್ಲಿ ಹೊಸ ಆಶಾಕಿರಣ, ಆರೋಗ್ಯ ಮತ್ತು ಸಂತೋಷ ತರಲಿ." }, en: { name: "Happy New Year", wish: "May the new year bring you fresh hope, good health and happiness." } },
        { id: "custom", motif: "custom", kn: { name: "ನಿಮ್ಮ ಶೀರ್ಷಿಕೆ", wish: "ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು!" }, en: { name: "Your Title", wish: "Warm wishes to you and your family!" } }
    ];

    const TEXT = {
        kn: {
            bdTitle: "ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯಗಳು", bdName: "ನಿಮ್ಮ ಹೆಸರು", bdFrom: "ಪ್ರೀತಿಯಿಂದ",
            bdWish: "ನಿಮ್ಮ ಬಾಳು ಸುಖ, ಶಾಂತಿ ಮತ್ತು ಆರೋಗ್ಯದಿಂದ ತುಂಬಿರಲಿ. ಹುಟ್ಟುಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು!",
            festFrom: "ಶುಭಾಶಯಗಳೊಂದಿಗೆ", invited: "ಆತ್ಮೀಯ ಆಹ್ವಾನ", welcome: "ಎಲ್ಲರಿಗೂ ಸ್ವಾಗತ",
            evTitle: "ಕಾರ್ಯಕ್ರಮದ ಹೆಸರು", evDate: "ದಿನಾಂಕ", evTime: "ಸಮಯ", evVenue: "ಸ್ಥಳ",
            sampleDate: "30 ಜುಲೈ 2027", sampleTime: "ಸಂಜೆ 6:00", sampleVenue: "ವಿಜಯನಗರ ವಾಟರ್ ಟ್ಯಾಂಕ್, ಮೈಸೂರು"
        },
        en: {
            bdTitle: "Happy Birthday", bdName: "Your Name", bdFrom: "With love from",
            bdWish: "Wishing you a year filled with joy, good health and success. Many happy returns of the day!",
            festFrom: "With best wishes", invited: "YOU ARE INVITED", welcome: "All are welcome",
            evTitle: "Event Name", evDate: "Date", evTime: "Time", evVenue: "Venue",
            sampleDate: "30 July 2027", sampleTime: "6:00 PM", sampleVenue: "Vijayanagar Water Tank, Mysuru"
        }
    };

    const ui = { tab: "birthday", size: "portrait", lang: "kn", theme: "royal", template: "circle", bgMode: "none", agb: 0 };
    let logo = null, userPhoto = null, bgPhoto = null;
    const agbImages = {};

    // ---------- 2. Drawing helpers ----------
    function rr(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }
    function sh(color, blur, oy) { ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy || 0; }
    function nosh() { ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }
    function grad3(x0, y0, x1, y1, c) {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, c[0]); g.addColorStop(0.5, c[1]); g.addColorStop(1, c[2]);
        return g;
    }
    function star4(x, y, s, color) {
        ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.beginPath();
        for (let i = 0; i < 8; i++) { const r = i % 2 ? s * 0.28 : s; ctx.lineTo(Math.cos(i * Math.PI / 4 - Math.PI / 2) * r, Math.sin(i * Math.PI / 4 - Math.PI / 2) * r); }
        ctx.closePath(); ctx.fill(); ctx.restore();
    }
    function seeded(seed) { let s = seed; return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296; }
    function setFont(size, weight, family) { ctx.font = weight + " " + size + "px " + family; }
    function measure(text, size, weight, family) { setFont(size, weight, family); return ctx.measureText(text).width; }

    function wrapText(text, maxW, size, weight, family) {
        const lines = [];
        text.split("\n").forEach(part => {
            const words = part.split(/\s+/).filter(Boolean);
            let line = "";
            words.forEach(word => {
                const test = line ? line + " " + word : word;
                if (!line || measure(test, size, weight, family) <= maxW) line = test;
                else { lines.push(line); line = word; }
            });
            if (line) lines.push(line);
        });
        return lines;
    }

    // Writes centred text in as many lines as needed; shrinks the letters if it would not fit.
    function paragraph(text, cx, y, maxW, maxH, size, weight, family, fill, lh) {
        let s = size, lines;
        for (;;) {
            lines = wrapText(text, maxW, s, weight, family);
            if ((lines.length - 1) * s * lh + s * 0.35 <= maxH || s <= 20) break;
            s -= 2;
        }
        setFont(s, weight, family);
        ctx.fillStyle = fill; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        lines.forEach((line, i) => ctx.fillText(line, cx, y + i * s * lh));
        return y + (lines.length - 1) * s * lh;
    }

    function oneLine(text, cx, y, maxW, size, weight, family, fill, min) {
        let s = size;
        while (s > (min || 18) && measure(text, s, weight, family) > maxW) s -= 2;
        setFont(s, weight, family);
        ctx.fillStyle = fill; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText(text, cx, y);
        return s;
    }

    // photo (or canvas) drawn to fill a box, with zoom and shift
    function drawCover(img, x, y, w, h, zoom, ox, oy) {
        const iw = img.width, ih = img.height;
        const scale = Math.max(w / iw, h / ih) * (zoom || 1);
        const sw = w / scale, sh2 = h / scale;
        const sx = Math.min(Math.max((iw - sw) * (0.5 + (ox || 0) * 0.5), 0), iw - sw);
        const sy = Math.min(Math.max((ih - sh2) * (0.5 + (oy || 0) * 0.5), 0), ih - sh2);
        ctx.drawImage(img, sx, sy, sw, sh2, x, y, w, h);
    }

    function mandala(cx, cy, R, color, alpha, lw) {
        ctx.save(); ctx.translate(cx, cy); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = lw || 2;
        [1, 0.94].forEach(k => { ctx.beginPath(); ctx.arc(0, 0, R * k, 0, TAU); ctx.stroke(); });
        for (let ring = 0; ring < 3; ring++) {
            const n = 16, pr = R * (0.86 - ring * 0.2), pw = R * (0.13 - ring * 0.025);
            for (let i = 0; i < n; i++) {
                ctx.save(); ctx.rotate(i * TAU / n + ring * Math.PI / n);
                ctx.beginPath(); ctx.moveTo(0, -pr * 0.55);
                ctx.quadraticCurveTo(pw, -pr * 0.8, 0, -pr); ctx.quadraticCurveTo(-pw, -pr * 0.8, 0, -pr * 0.55);
                ctx.stroke(); ctx.restore();
            }
        }
        ctx.restore();
    }

    function divider(cx, y, w, t) {
        ctx.save(); ctx.strokeStyle = t.line; ctx.lineWidth = 2.5; ctx.beginPath();
        ctx.moveTo(cx - w / 2, y); ctx.lineTo(cx - 22, y); ctx.moveTo(cx + 22, y); ctx.lineTo(cx + w / 2, y); ctx.stroke();
        star4(cx, y, 14, t.line); ctx.restore();
    }

    function drawBackground(W, H, t) {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, t.bg[0]); g.addColorStop(0.55, t.bg[1]); g.addColorStop(1, t.bg[2]);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        const r = ctx.createRadialGradient(W / 2, H * 0.38, 0, W / 2, H * 0.38, Math.max(W, H) * 0.7);
        r.addColorStop(0, t.glow); r.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = r; ctx.fillRect(0, 0, W, H);
    }

    // photo as full background (festival + event posters) with a colour wash on top
    function drawBackgroundPhoto(W, H, t) {
        let img = null;
        if (ui.bgMode === "agb") img = agbImages[ui.agb];
        if (ui.bgMode === "mine") img = bgPhoto;
        if (!img) return;
        drawCover(img, 0, 0, W, H, 1, 0, 0);
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, t.ov[0]); g.addColorStop(1, t.ov[1]);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    function drawFrame(W, H, t) {
        ctx.save();
        ctx.strokeStyle = grad3(0, 0, W, H, t.f); ctx.lineWidth = 8; rr(26, 26, W - 52, H - 52, 26); ctx.stroke();
        ctx.lineWidth = 2.5; rr(48, 48, W - 96, H - 96, 18); ctx.stroke();
        [[48, 48], [W - 48, 48], [48, H - 48], [W - 48, H - 48]].forEach(p => {
            ctx.fillStyle = grad3(p[0] - 15, p[1] - 15, p[0] + 15, p[1] + 15, t.f);
            ctx.beginPath(); ctx.arc(p[0], p[1], 15, 0, TAU); ctx.fill(); star4(p[0], p[1], 10, t.dark);
        });
        ctx.restore();
    }

    function garland(W, y0) {
        const n = Math.ceil(W / 56);
        for (let i = 0; i <= n; i++) {
            const x = i * (W / n), y = y0 + Math.sin(i / n * Math.PI * 4) * 14;
            ctx.fillStyle = "#2f8f3a"; ctx.beginPath(); ctx.ellipse(x + 28, y + 12, 18, 8, 0.5, 0, TAU); ctx.fill();
            marigold(x, y, 28, i % 2 ? "#ffb703" : "#fb8500", i % 2 ? "#fb8500" : "#ffb703");
        }
        [0.07, 0.18, 0.82, 0.93].forEach((f, k) => {
            for (let j = 1; j <= 2 + (k % 2); j++) marigold(f * W, y0 + 20 + j * 44, 21, j % 2 ? "#ffb703" : "#fb8500", j % 2 ? "#fb8500" : "#ffb703");
        });
    }

    function themeDecor(W, H, t) {
        if (ui.theme === "royal") {
            mandala(W / 2, H * 0.42, W * 0.62, t.line, 0.12, 2.2);
            const rnd = seeded(7); for (let i = 0; i < 28; i++) star4(rnd() * W, rnd() * H, 6 + rnd() * 10, "rgba(255,225,130,.55)");
        } else if (ui.theme === "night") {
            const rnd = seeded(11);
            for (let i = 0; i < 70; i++) { ctx.fillStyle = "rgba(255,255,255," + (0.3 + rnd() * 0.6) + ")"; ctx.beginPath(); ctx.arc(rnd() * W, rnd() * H, 1 + rnd() * 2.6, 0, TAU); ctx.fill(); }
            for (let i = 0; i < 10; i++) { const x = rnd() * W, y = rnd() * H, r = 30 + rnd() * 60; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, "rgba(255,216,107,.22)"); g.addColorStop(1, "rgba(255,216,107,0)"); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
            mandala(W / 2, H * 0.42, W * 0.6, t.line, 0.08, 2);
        } else if (ui.theme === "marigold") {
            mandala(W / 2, H * 0.45, W * 0.62, "#ffffff", 0.18, 2.4);
            garland(W, 62);
        } else {
            mandala(W / 2, H * 0.44, W * 0.64, t.line, 0.12, 2.2);
        }
    }

    function header(W, t, R) {
        const cx = W / 2, cy = 70 + t.top + R;
        sh("rgba(0,0,0,.4)", 16, 6); ctx.fillStyle = grad3(cx - R, cy - R, cx + R, cy + R, t.f);
        ctx.beginPath(); ctx.arc(cx, cy, R + 6, 0, TAU); ctx.fill(); nosh();
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
        if (logo && logo.complete && logo.naturalWidth) ctx.drawImage(logo, cx - R, cy - R, 2 * R, 2 * R);
        else { ctx.fillStyle = "#7d1313"; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); }
        ctx.restore();
        sh("rgba(0,0,0,.25)", 6, 2);
        const size = oneLine(ORG[ui.lang], cx, cy + R + 46, W * 0.8, 36, "800", SANS, t.text, 20);
        nosh();
        return cy + R + 46 + size * 0.4;
    }

    function footer(W, H, t, small, wMul) {
        divider(W / 2, H - 172, W * (wMul || 0.8) * 0.62, t);
        if (small) {
            setFont(32, "600", SANS); ctx.fillStyle = t.accent; ctx.textAlign = "center"; ctx.fillText(small, W / 2, H - 126);
        }
        oneLine(ORG[ui.lang], W / 2, H - 80, W * (wMul || 0.8), 42, "800", SANS, grad3(W * 0.2, 0, W * 0.8, 0, t.g), 22);
    }

    // ---------- 3. Motifs (drawn pictures) ----------
    function lotus(cx, cy, s, c1, c2) {
        ctx.save(); ctx.translate(cx, cy);
        [[7, 2.3, 0.92], [5, 1.5, 1], [3, 0.7, 1.06]].forEach(layer => {
            for (let i = 0; i < layer[0]; i++) {
                const a = (i / (layer[0] - 1) - 0.5) * layer[1], L = s * layer[2];
                ctx.save(); ctx.rotate(a);
                const g = ctx.createLinearGradient(0, 0, 0, -L); g.addColorStop(0, c1); g.addColorStop(1, c2);
                ctx.fillStyle = g; ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.lineWidth = Math.max(1.5, s * 0.012);
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(L * 0.36, -L * 0.25, L * 0.3, -L * 0.8, 0, -L);
                ctx.bezierCurveTo(-L * 0.3, -L * 0.8, -L * 0.36, -L * 0.25, 0, 0); ctx.fill(); ctx.stroke(); ctx.restore();
            }
        });
        ctx.restore();
    }

    function diya(cx, cy, s) {
        ctx.save(); ctx.translate(cx, cy);
        const glow = ctx.createRadialGradient(0, -s * 0.55, 0, 0, -s * 0.55, s * 1.2);
        glow.addColorStop(0, "rgba(255,200,80,.6)"); glow.addColorStop(1, "rgba(255,160,40,0)");
        ctx.fillStyle = glow; ctx.fillRect(-s * 1.3, -s * 1.9, s * 2.6, s * 2.6);
        const bg = ctx.createLinearGradient(0, -s * 0.3, 0, s * 0.4); bg.addColorStop(0, "#f0a22e"); bg.addColorStop(1, "#a8570f");
        ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(-s * 0.62, -s * 0.12);
        ctx.quadraticCurveTo(-s * 0.5, s * 0.42, 0, s * 0.42); ctx.quadraticCurveTo(s * 0.5, s * 0.42, s * 0.62, -s * 0.12);
        ctx.quadraticCurveTo(0, -s * 0.02, -s * 0.62, -s * 0.12); ctx.fill();
        ctx.strokeStyle = "#ffd88a"; ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(-s * 0.62, -s * 0.12);
        ctx.quadraticCurveTo(0, -s * 0.02, s * 0.62, -s * 0.12); ctx.stroke();
        const fg = ctx.createLinearGradient(0, -s * 0.95, 0, -s * 0.12); fg.addColorStop(0, "#fff4b0"); fg.addColorStop(0.5, "#ffb12a"); fg.addColorStop(1, "#ff7a00");
        ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(0, -s * 0.98);
        ctx.bezierCurveTo(s * 0.3, -s * 0.6, s * 0.22, -s * 0.18, 0, -s * 0.14); ctx.bezierCurveTo(-s * 0.22, -s * 0.18, -s * 0.3, -s * 0.6, 0, -s * 0.98); ctx.fill();
        ctx.restore();
    }

    function kalasha(cx, cy, s) {
        ctx.save(); ctx.translate(cx, cy);
        for (let i = -3; i <= 3; i++) {
            ctx.save(); ctx.translate(0, -s * 0.55); ctx.rotate(i * 0.27); ctx.fillStyle = i % 2 ? "#2f8f3a" : "#3fae4a";
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(s * 0.16, -s * 0.35, 0, -s * 0.78); ctx.quadraticCurveTo(-s * 0.16, -s * 0.35, 0, 0); ctx.fill(); ctx.restore();
        }
        const pg = ctx.createLinearGradient(-s * 0.5, 0, s * 0.5, 0); pg.addColorStop(0, "#b8770f"); pg.addColorStop(0.45, "#ffd873"); pg.addColorStop(1, "#a86a0c");
        ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.55); ctx.lineTo(s * 0.2, -s * 0.55);
        ctx.quadraticCurveTo(s * 0.28, -s * 0.35, s * 0.42, -s * 0.12); ctx.quadraticCurveTo(s * 0.62, s * 0.3, s * 0.3, s * 0.62);
        ctx.lineTo(-s * 0.3, s * 0.62); ctx.quadraticCurveTo(-s * 0.62, s * 0.3, -s * 0.42, -s * 0.12); ctx.quadraticCurveTo(-s * 0.28, -s * 0.35, -s * 0.2, -s * 0.55); ctx.fill();
        ctx.fillStyle = "#ffe08a"; rr(-s * 0.3, -s * 0.62, s * 0.6, s * 0.1, s * 0.05); ctx.fill();
        ctx.strokeStyle = "#c0392b"; ctx.lineWidth = s * 0.06; ctx.beginPath(); ctx.moveTo(-s * 0.44, -s * 0.02); ctx.quadraticCurveTo(0, s * 0.12, s * 0.44, -s * 0.02); ctx.stroke();
        ctx.fillStyle = "#8a5a2b"; ctx.beginPath(); ctx.ellipse(0, -s * 0.8, s * 0.2, s * 0.22, 0, 0, TAU); ctx.fill();
        ctx.restore();
    }

    function marigold(x, y, r, c1, c2) {
        for (let ring = 0; ring < 3; ring++) {
            const n = 12 - ring * 2, rad = r * (1 - ring * 0.25);
            for (let i = 0; i < n; i++) {
                const a = i * TAU / n + ring * 0.3;
                ctx.fillStyle = ring % 2 ? c1 : c2; ctx.beginPath();
                ctx.ellipse(x + Math.cos(a) * rad * 0.55, y + Math.sin(a) * rad * 0.55, rad * 0.42, rad * 0.26, a, 0, TAU); ctx.fill();
            }
        }
        ctx.fillStyle = "#d94f00"; ctx.beginPath(); ctx.arc(x, y, r * 0.2, 0, TAU); ctx.fill();
    }

    function kite(x, y, s, color, rot) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.62, 0); ctx.lineTo(0, s * 1.05); ctx.lineTo(-s * 0.62, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = s * 0.04; ctx.beginPath();
        ctx.moveTo(0, -s); ctx.lineTo(0, s * 1.05); ctx.moveTo(-s * 0.62, 0); ctx.lineTo(s * 0.62, 0); ctx.stroke();
        ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(0, s * 1.05); ctx.bezierCurveTo(s * 0.4, s * 1.4, -s * 0.4, s * 1.7, s * 0.2, s * 2.1); ctx.stroke();
        ctx.restore();
    }

    function firework(x, y, r, color) {
        ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = "round"; ctx.lineWidth = Math.max(3, r * 0.045);
        for (let i = 0; i < 16; i++) {
            ctx.save(); ctx.rotate(i * Math.PI / 8);
            ctx.beginPath(); ctx.moveTo(0, -r * 0.35); ctx.lineTo(0, -r * (i % 2 ? 0.75 : 1)); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, -r * (i % 2 ? 0.88 : 1.12), r * 0.05, 0, TAU); ctx.fill(); ctx.restore();
        }
        ctx.restore();
    }

    function chakra(x, y, r, color) {
        ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = r * 0.07;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * 0.12, 0, TAU); ctx.fill(); ctx.lineWidth = r * 0.035;
        for (let i = 0; i < 24; i++) {
            ctx.save(); ctx.rotate(i * Math.PI / 12); ctx.beginPath(); ctx.moveTo(0, r * 0.12); ctx.lineTo(0, r * 0.94); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, r * 0.94, r * 0.04, 0, TAU); ctx.fill(); ctx.restore();
        }
        ctx.restore();
    }

    function toran(cx, y, w) {
        const n = 9;
        ctx.strokeStyle = "#7a1111"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - w / 2, y); ctx.quadraticCurveTo(cx, y + w * 0.1, cx + w / 2, y); ctx.stroke();
        for (let i = 0; i <= n; i++) {
            const f = i / n, x = cx - w / 2 + f * w, yy = y + Math.sin(f * Math.PI) * w * 0.05;
            ctx.fillStyle = i % 2 ? "#2f8f3a" : "#3fae4a"; ctx.beginPath(); ctx.moveTo(x, yy);
            ctx.quadraticCurveTo(x + 22, yy + 38, x, yy + 90); ctx.quadraticCurveTo(x - 22, yy + 38, x, yy); ctx.fill();
            if (i % 2 === 0) marigold(x, yy + 102, 17, "#ffb703", "#fb8500");
        }
    }

    function flag(cx, cy, S, kind) {
        const w = S * 1.9, h = S * 1.15, x = cx - w / 2, y = cy - h / 2;
        ctx.save(); ctx.fillStyle = "#cfcfcf"; ctx.fillRect(x - 12, y - 28, 12, h + S * 1.2);
        sh("rgba(0,0,0,.35)", 20, 8);
        if (kind === "tricolor") {
            ctx.fillStyle = "#ff9933"; ctx.fillRect(x, y, w, h / 3); ctx.fillStyle = "#ffffff"; ctx.fillRect(x, y + h / 3, w, h / 3); ctx.fillStyle = "#138808"; ctx.fillRect(x, y + 2 * h / 3, w, h / 3);
            nosh(); chakra(cx, cy, h * 0.15, "#000080");
        } else {
            ctx.fillStyle = "#ffd100"; ctx.fillRect(x, y, w, h / 2); ctx.fillStyle = "#d6001c"; ctx.fillRect(x, y + h / 2, w, h / 2); nosh();
        }
        const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, "rgba(255,255,255,.25)"); g.addColorStop(0.5, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(0,0,0,.18)");
        ctx.fillStyle = g; ctx.fillRect(x, y, w, h); ctx.restore();
    }

    function sun(cx, cy, R) {
        ctx.save(); ctx.translate(cx, cy);
        for (let i = 0; i < 24; i++) { ctx.save(); ctx.rotate(i * TAU / 24); ctx.fillStyle = "rgba(255,196,60,.55)"; ctx.beginPath(); ctx.moveTo(-R * 0.1, -R * 1.05); ctx.lineTo(0, -R * 1.5); ctx.lineTo(R * 0.1, -R * 1.05); ctx.closePath(); ctx.fill(); ctx.restore(); }
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R); g.addColorStop(0, "#fff3b0"); g.addColorStop(1, "#ff9f1c");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.restore();
    }

    function sparkles(cx, cy, S, color) {
        [[-1.1, -0.9, 20], [1.15, -0.75, 26], [-1.25, 0.2, 14], [1.3, 0.35, 18], [0.2, -1.35, 16]].forEach(p => star4(cx + p[0] * S, cy + p[1] * S, p[2] * (S / 230) + 6, color));
    }

    function motif(kind, cx, cy, S, t) {
        const sp = "rgba(255,240,170,.95)";
        if (kind === "ganesh") {
            mandala(cx, cy, S * 1.35, t.line, 0.25, 2.2); kalasha(cx, cy + S * 0.05, S * 0.95);
            marigold(cx - S * 0.95, cy + S * 0.45, S * 0.3, "#ffb703", "#fb8500"); marigold(cx + S * 0.95, cy + S * 0.45, S * 0.3, "#ffb703", "#fb8500");
            marigold(cx - S * 0.6, cy + S * 0.8, S * 0.24, "#fb8500", "#ffb703"); marigold(cx + S * 0.6, cy + S * 0.8, S * 0.24, "#fb8500", "#ffb703");
            diya(cx - S * 1.0, cy + S * 1.05, S * 0.3); diya(cx + S * 1.0, cy + S * 1.05, S * 0.3);
        } else if (kind === "ashada") {
            mandala(cx, cy, S * 1.35, t.line, 0.25, 2.2); lotus(cx, cy + S * 0.55, S * 1.25, "#fff0f5", "#ff7eb6");
            diya(cx - S * 0.85, cy + S * 0.95, S * 0.34); diya(cx, cy + S * 1.05, S * 0.4); diya(cx + S * 0.85, cy + S * 0.95, S * 0.34);
        } else if (kind === "navaratri") {
            mandala(cx, cy, S * 1.4, t.line, 0.3, 2.4); lotus(cx, cy + S * 0.4, S * 1.05, "#fff7d6", "#ff9a3c");
            diya(cx - S * 1.0, cy + S * 0.85, S * 0.34); diya(cx + S * 1.0, cy + S * 0.85, S * 0.34);
        } else if (kind === "deepavali") {
            firework(cx - S * 0.95, cy - S * 0.7, S * 0.5, "#ffd24a"); firework(cx + S * 0.95, cy - S * 0.8, S * 0.42, "#ff7a59");
            for (let i = 0; i < 5; i++) { const a = Math.PI * (0.12 + i * 0.19); diya(cx - Math.cos(a) * S * 1.05, cy + S * 0.55 + Math.sin(a - 0.3) * S * 0.5 - (i === 2 ? 0 : 0), S * (i === 2 ? 0.5 : 0.38)); }
            sparkles(cx, cy, S, sp);
        } else if (kind === "ugadi") {
            toran(cx, cy - S * 1.15, S * 2.3); kalasha(cx, cy + S * 0.3, S * 0.85);
            marigold(cx - S * 0.95, cy + S * 0.7, S * 0.3, "#ffb703", "#fb8500"); marigold(cx + S * 0.95, cy + S * 0.7, S * 0.3, "#ffb703", "#fb8500");
        } else if (kind === "sankranti") {
            sun(cx, cy - S * 0.1, S * 0.62);
            kite(cx - S * 1.0, cy - S * 0.55, S * 0.4, "#e63946", -0.4); kite(cx + S * 1.0, cy - S * 0.35, S * 0.36, "#2a9d8f", 0.35); kite(cx + S * 0.1, cy + S * 0.55, S * 0.32, "#ffb703", 0.1);
        } else if (kind === "rajyotsava") {
            mandala(cx, cy + S * 0.1, S * 1.35, t.line, 0.25, 2.2); flag(cx, cy - S * 0.15, S * 1.2, "kannada"); lotus(cx, cy + S * 1.3, S * 0.5, "#fff0f5", "#ff7eb6");
        } else if (kind === "tricolor") {
            flag(cx, cy + S * 0.05, S * 1.2, "tricolor"); firework(cx - S * 1.25, cy - S * 1.1, S * 0.28, "#ff9933"); firework(cx + S * 1.25, cy - S * 1.1, S * 0.28, "#138808"); sparkles(cx, cy + S * 0.2, S, sp);
        } else if (kind === "newyear") {
            firework(cx - S * 0.85, cy - S * 0.55, S * 0.55, "#ffd24a"); firework(cx + S * 0.85, cy - S * 0.65, S * 0.5, "#ff7a59"); firework(cx, cy - S * 0.1, S * 0.38, "#7ad7f0"); sparkles(cx, cy, S, sp);
            const now = new Date(), year = now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear();
            sh("rgba(0,0,0,.4)", 14, 6); oneLine(String(year), cx, cy + S * 1.1, S * 2.2, S * 0.85, "800", SERIF, grad3(cx - S, cy, cx + S, cy, t.g), 40); nosh();
        } else {
            mandala(cx, cy, S * 1.35, t.line, 0.3, 2.4); lotus(cx, cy + S * 0.45, S * 1.1, "#fff0f5", "#ff7eb6"); sparkles(cx, cy, S, sp);
        }
    }

    // ---------- 4. The posters ----------
    function layout() {
        return ({
            portrait: { logoR: 46, bt: 104, ph: 0.445, pr: 0.205, nm: 0.735, bs: 40, wy: 0.795, ft: 108, my: 0.52, ms: 0.205, fw: 42 },
            square: { logoR: 28, bt: 70, ph: 0.445, pr: 0.128, nm: 0.672, bs: 34, wy: 0.742, ft: 84, my: 0.49, ms: 0.14, fw: 36 },
            story: { logoR: 54, bt: 118, ph: 0.42, pr: 0.30, nm: 0.66, bs: 46, wy: 0.725, ft: 124, my: 0.5, ms: 0.25, fw: 48 }
        })[ui.size];
    }

    function balloon(x, y, rx, ry, color) {
        ctx.save(); ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
        const hl = ctx.createRadialGradient(x - rx * 0.35, y - ry * 0.4, 1, x - rx * 0.35, y - ry * 0.4, rx * 0.8);
        hl.addColorStop(0, "rgba(255,255,255,.65)"); hl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = hl; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y + ry); ctx.lineTo(x - 9, y + ry + 15); ctx.lineTo(x + 9, y + ry + 15); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y + ry + 15);
        ctx.bezierCurveTo(x - 16, y + ry + 60, x + 16, y + ry + 95, x, y + ry + 150); ctx.stroke(); ctx.restore();
    }

    // ---------- Birthday templates (10 layouts) ----------
    THEMES.royal.curtain = "#8a1515"; THEMES.marigold.curtain = "#7a1111"; THEMES.night.curtain = "#2b2f80"; THEMES.cream.curtain = "#8a1515";
    THEMES.royal.sil = "rgba(25,2,2,.88)"; THEMES.marigold.sil = "rgba(90,10,10,.92)"; THEMES.night.sil = "rgba(3,5,22,.92)"; THEMES.cream.sil = "rgba(90,10,10,.9)";

    function bdData() {
        const lang = ui.lang, T = TEXT[lang];
        return { lang: lang, T: T, name: val("bName") || T.bdName, raw: val("bName"), age: parseInt(val("bAge"), 10), wish: val("bWish") || T.bdWish };
    }
    function hasAge(d) { return d.age > 0 && d.age < 130; }

    function shapePath(kind, cx, cy, R) {
        if (kind === "roundsq") { rr(cx - R, cy - R, 2 * R, 2 * R, R * 0.3); return; }
        ctx.beginPath();
        if (kind === "arch") { const a = R * 0.86, b = R * 1.0, c = R * 0.2; ctx.moveTo(cx - a, cy + b); ctx.lineTo(cx - a, cy - c); ctx.arc(cx, cy - c, a, Math.PI, 0); ctx.lineTo(cx + a, cy + b); ctx.closePath(); }
        else if (kind === "hex") { for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; ctx.lineTo(cx + Math.cos(a) * R * 1.08, cy + Math.sin(a) * R * 1.08); } ctx.closePath(); }
        else if (kind === "heart") { const s = R * 1.02; ctx.moveTo(cx, cy + s * 0.95); ctx.bezierCurveTo(cx + s * 1.45, cy + s * 0.05, cx + s * 1.0, cy - s * 1.05, cx, cy - s * 0.4); ctx.bezierCurveTo(cx - s * 1.0, cy - s * 1.05, cx - s * 1.45, cy + s * 0.05, cx, cy + s * 0.95); ctx.closePath(); }
        else ctx.arc(cx, cy, R, 0, TAU);
    }

    function photoFill(cx, cy, R, t, d) {
        const bx = cx - R * 1.1, by = cy - R * 1.1, bs = R * 2.2;
        if (userPhoto) { drawCover(userPhoto, bx, by, bs, bs, parseFloat($("zoom").value), parseFloat($("posx").value), parseFloat($("posy").value)); return; }
        const g = ctx.createRadialGradient(cx, cy - R * 0.3, 0, cx, cy, R * 1.2); g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[2]);
        ctx.fillStyle = g; ctx.fillRect(bx, by, bs, bs);
        mandala(cx, cy, R * 0.9, t.line, 0.5, 2);
        const initial = (Array.from(d.raw || "A")[0] || "A").toUpperCase();
        oneLine(initial, cx, cy + R * 0.3, R * 1.2, R * 0.95, "800", SERIF, grad3(cx - R, cy - R, cx + R, cy + R, t.g), 40);
    }

    function framedPhoto(kind, cx, cy, R, t, d, ring) {
        ctx.save(); sh("rgba(0,0,0,.45)", 30, 10); ctx.strokeStyle = grad3(cx - R, cy - R, cx + R, cy + R, t.f); ctx.lineWidth = ring; ctx.lineJoin = "round"; shapePath(kind, cx, cy, R); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.92)"; ctx.lineWidth = ring * 0.3; ctx.lineJoin = "round"; shapePath(kind, cx, cy, R); ctx.stroke(); ctx.restore();
        ctx.save(); shapePath(kind, cx, cy, R); ctx.clip(); photoFill(cx, cy, R, t, d); ctx.restore();
    }

    function ageBadge(bx, by, r, t, age) {
        sh("rgba(0,0,0,.4)", 12, 4); ctx.fillStyle = grad3(bx - r, by - r, bx + r, by + r, t.f); ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill(); nosh();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx, by, r - 8, 0, TAU); ctx.stroke();
        oneLine(String(age), bx, by + r * 0.32, r * 1.4, r * 0.97, "800", SERIF, t.dark, 28);
    }

    function confetti(W, H, t, n, seed) {
        const rnd = seeded(seed || 5); ctx.save();
        for (let i = 0; i < n; i++) {
            ctx.fillStyle = t.pal[i % t.pal.length]; ctx.globalAlpha = 0.75; const x = rnd() * W, y = rnd() * H;
            if (i % 2) { ctx.beginPath(); ctx.arc(x, y, 5 + rnd() * 5, 0, TAU); ctx.fill(); } else { ctx.save(); ctx.translate(x, y); ctx.rotate(rnd() * 3); ctx.fillRect(-7, -3, 14, 6); ctx.restore(); }
        }
        ctx.restore();
    }
    function sunburst(cx, cy, R, t, k) {
        ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = t.line; ctx.globalAlpha = 0.2; const n = 28;
        for (let i = 0; i < n; i++) { ctx.rotate(TAU / n); if (i % 2) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-R * 0.1, -R * (k || 1.62)); ctx.lineTo(R * 0.1, -R * (k || 1.62)); ctx.closePath(); ctx.fill(); } }
        ctx.restore();
    }
    function heart(x, y, s, color) {
        ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y + s * 0.35); ctx.bezierCurveTo(x + s * 0.9, y - s * 0.2, x + s * 0.45, y - s * 0.95, x, y - s * 0.4);
        ctx.bezierCurveTo(x - s * 0.45, y - s * 0.95, x - s * 0.9, y - s * 0.2, x, y + s * 0.35); ctx.fill();
    }
    function ribbon(cx, cy, w, h, t) {
        const x = cx - w / 2, y = cy - h / 2, tail = h * 0.55;
        ctx.save(); sh("rgba(0,0,0,.35)", 14, 6); ctx.fillStyle = grad3(x, y, x + w, y + h, t.f);
        ctx.beginPath(); ctx.moveTo(x - tail * 0.2, y + h * 0.18); ctx.lineTo(x + tail, y + h * 0.18); ctx.lineTo(x + tail, y + h); ctx.lineTo(x - tail * 0.2, y + h); ctx.lineTo(x + tail * 0.25, y + h * 0.59); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + w + tail * 0.2, y + h * 0.18); ctx.lineTo(x + w - tail, y + h * 0.18); ctx.lineTo(x + w - tail, y + h); ctx.lineTo(x + w + tail * 0.2, y + h); ctx.lineTo(x + w - tail * 0.25, y + h * 0.59); ctx.closePath(); ctx.fill();
        nosh(); rr(x + tail * 0.6, y, w - tail * 1.2, h, 10); ctx.fill(); ctx.restore();
    }
    function bunting(W, y0, t) {
        const n = Math.floor(W / 74); ctx.save(); ctx.strokeStyle = t.line; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(40, y0); ctx.quadraticCurveTo(W / 2, y0 + 70, W - 40, y0); ctx.stroke();
        for (let i = 1; i < n; i++) { const f = i / n, x = 40 + f * (W - 80), y = y0 + 2 * (1 - f) * f * 70; ctx.fillStyle = t.pal[i % t.pal.length]; ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.lineTo(x + 30, y); ctx.lineTo(x, y + 66); ctx.closePath(); ctx.fill(); }
        ctx.restore();
    }
    function curtains(W, H, t) {
        const cw = W * 0.19;
        [0, 1].forEach(side => {
            ctx.save(); if (side) { ctx.translate(W, 0); ctx.scale(-1, 1); }
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(cw + 34, 0); ctx.quadraticCurveTo(cw * 0.35, H * 0.5, cw + 34, H); ctx.lineTo(0, H); ctx.closePath();
            ctx.fillStyle = t.curtain; ctx.fill();
            const g = ctx.createLinearGradient(0, 0, cw + 34, 0); for (let i = 0; i <= 6; i++) g.addColorStop(i / 6, i % 2 ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.38)");
            ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = t.line; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
        });
        ctx.fillStyle = t.curtain; ctx.fillRect(0, 0, W, 78);
        const n = 12, r = W / n / 2;
        for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(r + i * 2 * r, 78, r, 0, Math.PI); ctx.fill(); ctx.strokeStyle = t.line; ctx.lineWidth = 3; ctx.stroke(); }
        const sg = ctx.createLinearGradient(0, 0, 0, 90); sg.addColorStop(0, "rgba(0,0,0,.35)"); sg.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, 90);
    }
    function wreath(cx, cy, r, n) {
        for (let i = 0; i < n; i++) { const a = i * TAU / n; ctx.save(); ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.rotate(a + Math.PI / 2); ctx.fillStyle = i % 2 ? "#2f8f3a" : "#3fae4a"; ctx.beginPath(); ctx.ellipse(0, 0, 14, 34, 0.5, 0, TAU); ctx.fill(); ctx.restore(); }
        for (let i = 0; i < n; i++) {
            const a = (i + 0.5) * TAU / n, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
            if (i % 2) marigold(x, y, 26, "#ffb703", "#fb8500"); else { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill(); ctx.fillStyle = "#ffd6e7"; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); }
        }
    }
    function spray(x, y, rot, s) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? "#2f8f3a" : "#3fae4a"; ctx.beginPath(); ctx.ellipse(i * s * 0.55, (i % 2 ? -1 : 1) * s * 0.35, s * 0.55, s * 0.2, (i % 2 ? -0.5 : 0.5), 0, TAU); ctx.fill(); }
        marigold(0, 0, s * 0.62, "#ffb703", "#fb8500"); marigold(s * 0.85, -s * 0.2, s * 0.5, "#fb8500", "#ffb703"); marigold(s * 1.6, s * 0.1, s * 0.4, "#ffb703", "#fb8500");
        ctx.restore();
    }
    function cake(cx, baseY, w, h, t) {
        const tiers = [[1, 0.42, "#f48fb1"], [0.72, 0.32, "#ffcc80"], [0.46, 0.26, "#fff59d"]];
        let y = baseY; ctx.save();
        ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.ellipse(cx, baseY + 8, w * 0.64, 14, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#fffdf6"; ctx.beginPath(); ctx.ellipse(cx, baseY + 2, w * 0.6, 13, 0, 0, TAU); ctx.fill();
        let topW = w;
        tiers.forEach(tr => {
            const tw = w * tr[0], th = h * tr[1]; y -= th; topW = tw;
            ctx.fillStyle = tr[2]; rr(cx - tw / 2, y, tw, th, 12); ctx.fill();
            ctx.fillStyle = "#ffffff"; rr(cx - tw / 2, y, tw, th * 0.26, 12); ctx.fill();
            const N = 7; for (let i = 0; i < N; i++) { ctx.beginPath(); ctx.arc(cx - tw / 2 + tw / N * (i + 0.5), y + th * 0.26, tw / N / 2, 0, Math.PI); ctx.fill(); }
        });
        for (let i = 0; i < 5; i++) {
            const x = cx - topW * 0.34 + i * topW * 0.17, top = y - 44;
            ctx.fillStyle = t.pal[i % t.pal.length]; rr(x - 6, top, 12, 44, 3); ctx.fill();
            const g = ctx.createRadialGradient(x, top - 14, 0, x, top - 14, 30); g.addColorStop(0, "rgba(255,200,80,.6)"); g.addColorStop(1, "rgba(255,160,40,0)"); ctx.fillStyle = g; ctx.fillRect(x - 32, top - 46, 64, 64);
            ctx.fillStyle = "#ffb12a"; ctx.beginPath(); ctx.moveTo(x, top - 30); ctx.bezierCurveTo(x + 11, top - 14, x + 7, top - 2, x, top - 2); ctx.bezierCurveTo(x - 7, top - 2, x - 11, top - 14, x, top - 30); ctx.fill();
        }
        ctx.restore();
    }
    function palace(cx, baseY, w, t) {
        const col = t.sil, lit = t.accent;
        ctx.save();
        const glow = ctx.createRadialGradient(cx, baseY, 0, cx, baseY, w * 0.7); glow.addColorStop(0, "rgba(255,190,70,.35)"); glow.addColorStop(1, "rgba(255,190,70,0)");
        ctx.fillStyle = glow; ctx.fillRect(cx - w, baseY - w * 0.7, w * 2, w * 0.8);
        ctx.fillStyle = col; ctx.fillRect(cx - w / 2, baseY - w * 0.03, w, w * 0.03); ctx.fillRect(cx - w * 0.43, baseY - w * 0.1, w * 0.86, w * 0.07);
        ctx.fillStyle = lit;
        for (let i = 0; i < 13; i++) { const x = cx - w * 0.4 + i * (w * 0.8 / 12), r = w * 0.012; ctx.beginPath(); ctx.arc(x, baseY - w * 0.062, r, Math.PI, 0); ctx.lineTo(x + r, baseY - w * 0.04); ctx.lineTo(x - r, baseY - w * 0.04); ctx.closePath(); ctx.fill(); }
        [[0, 0.11, 0.09], [-0.2, 0.075, 0.07], [0.2, 0.075, 0.07], [-0.34, 0.055, 0.05], [0.34, 0.055, 0.05], [-0.42, 0.04, 0.035], [0.42, 0.04, 0.035]].forEach(tw => {
            const x = cx + tw[0] * w, ww = tw[1] * w, hh = tw[2] * w, top = baseY - w * 0.1 - hh;
            ctx.fillStyle = col; ctx.fillRect(x - ww / 2, top, ww, hh); ctx.fillRect(x - ww * 0.6, top + hh * 0.35, ww * 1.2, w * 0.008);
            ctx.beginPath(); ctx.moveTo(x - ww * 0.62, top); ctx.bezierCurveTo(x - ww * 0.8, top - ww * 0.6, x - ww * 0.22, top - ww * 0.85, x, top - ww * 1.2); ctx.bezierCurveTo(x + ww * 0.22, top - ww * 0.85, x + ww * 0.8, top - ww * 0.6, x + ww * 0.62, top); ctx.closePath(); ctx.fill();
            ctx.fillRect(x - 1.5, top - ww * 1.2 - w * 0.03, 3, w * 0.03);
            ctx.fillStyle = lit; ctx.beginPath(); ctx.arc(x, top + hh * 0.2, ww * 0.14, Math.PI, 0); ctx.lineTo(x + ww * 0.14, top + hh * 0.55); ctx.lineTo(x - ww * 0.14, top + hh * 0.55); ctx.closePath(); ctx.fill();
        });
        ctx.fillStyle = "rgba(255,235,160,.95)";
        for (let i = 0; i <= 40; i++) { ctx.beginPath(); ctx.arc(cx - w * 0.43 + i * (w * 0.86 / 40), baseY - w * 0.1, 3.2, 0, TAU); ctx.fill(); }
        ctx.restore();
    }
    function logoOnly(W, cy, R, t) {
        sh("rgba(0,0,0,.4)", 16, 6); ctx.fillStyle = grad3(W / 2 - R, cy - R, W / 2 + R, cy + R, t.f); ctx.beginPath(); ctx.arc(W / 2, cy, R + 6, 0, TAU); ctx.fill(); nosh();
        ctx.save(); ctx.beginPath(); ctx.arc(W / 2, cy, R, 0, TAU); ctx.clip();
        if (logo && logo.complete && logo.naturalWidth) ctx.drawImage(logo, W / 2 - R, cy - R, 2 * R, 2 * R); else { ctx.fillStyle = "#7d1313"; ctx.fillRect(W / 2 - R, cy - R, 2 * R, 2 * R); }
        ctx.restore(); return cy + R + 18;
    }

    // keeps the photo below the title, whatever the colour design pushes the header down
    function fitPy(py, R, t, m, ratio, titleK) {
        const base = 70 + t.top + 2 * m.logoR + 60 + m.bt * (titleK || 0.95);
        return Math.max(py, base + 44 + R * (ratio || 1) + 20);
    }

    function bdTitle(W, t, baseline, size, maxH, maxW, glow, text) {
        const T = TEXT[ui.lang];
        if (glow) sh(glow, 30, 0); else sh("rgba(0,0,0,.35)", 12, 5);
        const end = paragraph(text || T.bdTitle, W / 2, baseline, maxW || W * 0.84, Math.max(30, maxH), size, "800", SERIF, grad3(W * 0.2, 0, W * 0.8, 0, t.g), 1.22);
        nosh(); return end;
    }
    function bdName(W, y, t, d, size, opts) {
        opts = opts || {};
        if (opts.shadow !== false) sh("rgba(0,0,0,.35)", 12, 5);
        const s = oneLine(d.name, W / 2, y, opts.maxW || W * 0.82, d.lang === "kn" ? size * 0.92 : size, "800", d.lang === "kn" ? SANS : SERIF, opts.fill || grad3(W * 0.2, 0, W * 0.8, 0, t.g), 34);
        nosh(); return s;
    }
    function bdWish(W, H, t, d, y, size, maxW, bottom) {
        return paragraph(d.wish, W / 2, y, maxW || W * 0.78, Math.max(28, (bottom || (H - 196)) - y), size, "500", SANS, t.text, 1.42);
    }

    // 1. Royal Circle
    function bdCircle(W, H, t, m) {
        const d = bdData(), R = W * m.pr, py = fitPy(H * m.ph, R, t, m);
        confetti(W, H, t, 44, 5);
        [[0.1, -0.35, 0], [0.17, 0.05, 1], [0.9, -0.3, 2], [0.83, 0.1, 3]].forEach(b => balloon(W * b[0], py + R * b[1], W * 0.042, W * 0.053, t.pal[b[2] % t.pal.length]));
        const y0 = header(W, t, m.logoR), base = y0 + m.bt * 0.95;
        bdTitle(W, t, base, m.bt, py - R - 40 - base);
        sunburst(W / 2, py, R, t); framedPhoto("circle", W / 2, py, R, t, d, 36);
        if (hasAge(d)) ageBadge(W / 2 + R * 0.78, py + R * 0.78, 58, t, d.age);
        bdName(W, H * m.nm, t, d, 92); bdWish(W, H, t, d, H * m.wy, m.bs); footer(W, H, t, d.T.bdFrom);
    }
    // 2. Arch Window
    function bdArch(W, H, t, m) {
        const d = bdData(), R = W * m.pr * 0.95, py = fitPy(H * m.ph + W * m.pr * 0.95 * 0.06, R, t, m, 1.06, 0.9);
        confetti(W, H, t, 26, 9);
        [0.08, 0.17, 0.83, 0.92].forEach((f, k) => { for (let j = 0; j < 2 + (k % 2); j++) marigold(f * W, 190 + t.top + j * 46, 20, j % 2 ? "#ffb703" : "#fb8500", j % 2 ? "#fb8500" : "#ffb703"); });
        const y0 = header(W, t, m.logoR), base = y0 + m.bt * 0.9;
        bdTitle(W, t, base, m.bt * 0.95, py - R * 1.05 - 40 - base);
        framedPhoto("arch", W / 2, py, R, t, d, 34);
        lotus(W / 2, py + R + 8, R * 0.6, "#fff0f5", "#ff7eb6"); diya(W / 2 - R * 1.0, py + R, R * 0.2); diya(W / 2 + R * 1.0, py + R, R * 0.2);
        if (hasAge(d)) ageBadge(W / 2 + R * 0.8, py - R * 0.85, 54, t, d.age);
        ribbon(W / 2, H * m.nm - 28, W * 0.8, 92, t); bdName(W, H * m.nm, t, d, 80, { fill: t.dark, maxW: W * 0.5, shadow: false });
        bdWish(W, H, t, d, H * m.wy + (ui.size === "square" ? 0 : 14), m.bs); footer(W, H, t, d.T.bdFrom);
    }
    // 3. Polaroid Party
    function bdPolaroid(W, H, t, m) {
        const d = bdData(), cfg = { portrait: { pw: 0.42, cy: 0.545 }, square: { pw: 0.27, cy: 0.5 }, story: { pw: 0.5, cy: 0.52 } }[ui.size];
        confetti(W, H, t, 40, 3); bunting(W, 78 + t.top, t);
        const pw = W * cfg.pw, pad = pw * 0.075, ph = pw + pw * 0.24, cx = W / 2, cy = H * cfg.cy;
        const base = 190 + t.top + m.bt * 0.85;
        bdTitle(W, t, base, m.bt * 0.95, (cy - ph / 2 - 50) - base);
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.065);
        sh("rgba(0,0,0,.45)", 30, 12); ctx.fillStyle = "#fffdf6"; rr(-pw / 2, -ph / 2, pw, ph, 6); ctx.fill(); nosh();
        const s = pw - 2 * pad; ctx.save(); ctx.beginPath(); ctx.rect(-pw / 2 + pad, -ph / 2 + pad, s, s); ctx.clip(); photoFill(0, -ph / 2 + pad + s / 2, s / 2 / 1.1, t, d); ctx.restore();
        const cap = oneLine(d.name, 0, ph / 2 - pad * 1.1, pw - pad * 2, pw * 0.11, "italic 700", d.lang === "kn" ? SANS : SERIF, "#3a1a1a", 22);
        ctx.fillStyle = "rgba(255,235,170,.85)"; ctx.save(); ctx.translate(-pw * 0.32, -ph / 2); ctx.rotate(-0.5); ctx.fillRect(-45, -14, 90, 28); ctx.restore();
        ctx.save(); ctx.translate(pw * 0.32, -ph / 2); ctx.rotate(0.5); ctx.fillRect(-45, -14, 90, 28); ctx.restore();
        ctx.restore();
        if (hasAge(d)) ageBadge(cx + pw * 0.5, cy + ph * 0.34, 52, t, d.age);
        bdWish(W, H, t, d, cy + ph / 2 + (ui.size === "square" ? 56 : 70), m.bs); footer(W, H, t, d.T.bdFrom);
    }
    // 4. Star Stage
    function bdStage(W, H, t, m) {
        const d = bdData(), inner = W * 0.58, R = Math.min(W * m.pr * 0.92, W * 0.17), py = H * m.ph + 6;
        const sg = ctx.createLinearGradient(W / 2, 0, W / 2, py + R * 1.4); sg.addColorStop(0, "rgba(255,250,225,.42)"); sg.addColorStop(1, "rgba(255,250,225,0)");
        ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(W / 2 - 50, 0); ctx.lineTo(W / 2 + 50, 0); ctx.lineTo(W / 2 + R * 1.8, py + R * 1.4); ctx.lineTo(W / 2 - R * 1.8, py + R * 1.4); ctx.closePath(); ctx.fill();
        confetti(W, H, t, 22, 4); curtains(W, H, t);
        const y0 = logoOnly(W, 150, 36, t), base = y0 + m.bt * 0.55;
        bdTitle(W, t, base, m.bt * 0.7, py - R - 50 - base, inner);
        for (let i = 0; i < 16; i++) { const a = i * TAU / 16; star4(W / 2 + Math.cos(a) * (R + 56), py + Math.sin(a) * (R + 56), i % 2 ? 11 : 17, t.line); }
        framedPhoto("circle", W / 2, py, R, t, d, 30);
        if (hasAge(d)) ageBadge(W / 2 + R * 0.78, py + R * 0.78, 52, t, d.age);
        ribbon(W / 2, H * m.nm - 28, inner * 1.1, 88, t); bdName(W, H * m.nm, t, d, 76, { fill: t.dark, maxW: inner * 0.78, shadow: false });
        bdWish(W, H, t, d, H * m.wy + (ui.size === "square" ? 0 : 8), m.bs * 0.92, inner); footer(W, H, t, d.T.bdFrom, 0.58);
    }
    // 5. Floral Wreath
    function bdFloral(W, H, t, m) {
        const d = bdData(), R = W * m.pr * 0.9, py = fitPy(H * m.ph, R, t, m, 1.12);
        spray(70, 120 + t.top, 0.55, 46); spray(W - 70, H - 150, Math.PI + 0.55, 46); spray(W - 70, 120 + t.top, Math.PI - 0.55, 40); spray(70, H - 150, -0.55, 40);
        const y0 = header(W, t, m.logoR), base = y0 + m.bt * 0.95;
        bdTitle(W, t, base, m.bt, py - R - 60 - base);
        framedPhoto("circle", W / 2, py, R, t, d, 26); wreath(W / 2, py, R + 16, 26);
        if (hasAge(d)) ageBadge(W / 2 + R * 0.86, py + R * 0.86, 54, t, d.age);
        bdName(W, H * m.nm, t, d, 92); divider(W / 2, H * m.nm + 34, W * 0.4, t); bdWish(W, H, t, d, H * m.wy + (ui.size === "square" ? 6 : 22), m.bs); footer(W, H, t, d.T.bdFrom);
    }
    // 6. Cake & Candles
    function bdCake(W, H, t, m) {
        const d = bdData(), st = ui.size === "story", R = W * 0.15;
        confetti(W, H, t, 30, 12);
        const y0 = logoOnly(W, 108, 36, t), base = y0 + m.bt * 0.78;
        const py = Math.max(H * (st ? 0.3 : 0.335), base + 44 + R + 20);
        bdTitle(W, t, base, m.bt * 0.78, py - R - 40 - base);
        sunburst(W / 2, py, R, t, 1.5); framedPhoto("circle", W / 2, py, R, t, d, 30);
        if (hasAge(d)) ageBadge(W / 2 + R * 0.78, py + R * 0.78, 50, t, d.age);
        const ny = py + R + (st ? 112 : 88); bdName(W, ny, t, d, 84);
        const cakeH = Math.max(120, Math.min(st ? 430 : 245, (H - 190) - (ny + 175))), cakeTop = (H - 190) - cakeH - 60;
        bdWish(W, H, t, d, ny + 54, m.bs * 0.9, W * 0.78, cakeTop - 6);
        cake(W / 2, H - 190, W * 0.5, cakeH, t); footer(W, H, t, d.T.bdFrom);
    }
    // 7. Modern Pop
    function bdHex(W, H, t, m) {
        const d = bdData(), R = W * m.pr, py = fitPy(H * m.ph, R, t, m, 1.08);
        ctx.save(); ctx.globalAlpha = 0.22;
        [0, 1, 2].forEach(i => { ctx.fillStyle = t.pal[i]; ctx.beginPath(); ctx.moveTo(-50, H * (0.2 + i * 0.22)); ctx.lineTo(W + 50, H * (0.06 + i * 0.22)); ctx.lineTo(W + 50, H * (0.18 + i * 0.22)); ctx.lineTo(-50, H * (0.32 + i * 0.22)); ctx.closePath(); ctx.fill(); });
        const rnd = seeded(8); ctx.globalAlpha = 0.8;
        for (let i = 0; i < 30; i++) { ctx.fillStyle = t.pal[i % t.pal.length]; const x = rnd() * W, y = rnd() * H, s = 10 + rnd() * 14; ctx.save(); ctx.translate(x, y); ctx.rotate(rnd() * 6); ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s, s); ctx.lineTo(-s, s); ctx.closePath(); ctx.fill(); ctx.restore(); }
        ctx.restore();
        const y0 = header(W, t, m.logoR), base = y0 + m.bt * 0.95;
        bdTitle(W, t, base, m.bt, py - R - 50 - base, null, null, ui.lang === "en" ? d.T.bdTitle.toUpperCase() : d.T.bdTitle);
        framedPhoto("hex", W / 2, py, R, t, d, 34);
        if (hasAge(d)) ageBadge(W / 2 + R * 0.86, py + R * 0.7, 54, t, d.age);
        ctx.fillStyle = t.panel; rr(W * 0.1, H * m.nm - 92, W * 0.8, 128, 26); ctx.fill(); ctx.strokeStyle = t.line; ctx.lineWidth = 3; ctx.stroke();
        bdName(W, H * m.nm, t, d, 92, { maxW: W * 0.74 }); bdWish(W, H, t, d, H * m.wy + (ui.size === "square" ? 8 : 20), m.bs); footer(W, H, t, d.T.bdFrom);
    }
    // 8. Fireworks
    function bdFire(W, H, t, m) {
        const d = bdData(), R = W * m.pr, py = fitPy(H * m.ph, R, t, m, 1.1);
        ctx.save(); ctx.globalAlpha = 0.6;
        firework(W * 0.14, py - R * 0.7, W * 0.13, t.pal[0]); firework(W * 0.86, py - R * 0.8, W * 0.12, t.pal[1]); firework(W * 0.12, py + R * 0.9, W * 0.1, t.pal[2]); firework(W * 0.88, py + R * 0.8, W * 0.11, t.pal[3]);
        ctx.restore();
        const rnd = seeded(21); for (let i = 0; i < 26; i++) star4(rnd() * W, rnd() * H, 5 + rnd() * 10, "rgba(255,240,170,.8)");
        const y0 = header(W, t, m.logoR), base = y0 + m.bt * 0.95;
        bdTitle(W, t, base, m.bt, py - R - 50 - base, null, t.accent);
        ctx.save(); sh(t.accent, 44, 0); ctx.strokeStyle = t.accent; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(W / 2, py, R + 30, 0, TAU); ctx.stroke(); ctx.restore();
        framedPhoto("circle", W / 2, py, R, t, d, 26);
        if (hasAge(d)) ageBadge(W / 2 + R * 0.78, py + R * 0.78, 56, t, d.age);
        sh(t.accent, 26, 0); bdName(W, H * m.nm, t, d, 92); nosh(); bdWish(W, H, t, d, H * m.wy, m.bs); footer(W, H, t, d.T.bdFrom);
    }
    // 9. Heart
    function bdHeart(W, H, t, m) {
        const d = bdData(), R = W * m.pr * 1.02, py = fitPy(H * m.ph + W * m.pr * 0.04, R, t, m, 1.05), rnd = seeded(17);
        for (let i = 0; i < 30; i++) { ctx.globalAlpha = 0.5 + rnd() * 0.4; heart(rnd() * W, rnd() * H, 10 + rnd() * 22, t.pal[i % t.pal.length]); } ctx.globalAlpha = 1;
        const y0 = header(W, t, m.logoR), base = y0 + m.bt * 0.95;
        bdTitle(W, t, base, m.bt, py - R * 1.05 - 40 - base);
        framedPhoto("heart", W / 2, py, R, t, d, 34);
        heart(W / 2 - R * 1.25, py - R * 0.5, 34, t.pal[1]); heart(W / 2 + R * 1.2, py - R * 0.2, 26, t.pal[0]); heart(W / 2 + R * 1.05, py + R * 0.75, 40, t.pal[2]);
        if (hasAge(d)) ageBadge(W / 2 - R * 0.95, py + R * 0.8, 52, t, d.age);
        bdName(W, H * m.nm, t, d, 92); bdWish(W, H, t, d, H * m.wy, m.bs); footer(W, H, t, d.T.bdFrom);
    }
    // 10. Mysuru Palace
    function bdPalace(W, H, t, m) {
        const d = bdData(), st = ui.size === "story", R = W * 0.165, py = H * (st ? 0.33 : 0.345);
        const pw = W * (st ? 0.86 : 0.8), baseY = H - 182, palaceTop = baseY - pw * 0.34;
        const rnd = seeded(31); for (let i = 0; i < 36; i++) star4(rnd() * W, rnd() * (palaceTop - 20), 4 + rnd() * 9, "rgba(255,240,170,.7)");
        const y0 = logoOnly(W, 112, 40, t), base = y0 + m.bt * 0.7;
        bdTitle(W, t, base, m.bt * 0.72, py - R - 46 - base);
        framedPhoto("circle", W / 2, py, R, t, d, 30);
        if (hasAge(d)) ageBadge(W / 2 + R * 0.78, py + R * 0.78, 50, t, d.age);
        const ny = py + R + (st ? 120 : 92); bdName(W, ny, t, d, 80);
        bdWish(W, H, t, d, ny + 54, m.bs * 0.88, W * 0.78, palaceTop - 20);
        palace(W / 2, baseY, pw, t); footer(W, H, t, d.T.bdFrom);
    }

    const BD_TEMPLATES = [
        { id: "circle", en: "Royal Circle", kn: "ರಾಯಲ್ ವೃತ್ತ", draw: bdCircle },
        { id: "arch", en: "Arch Window", kn: "ಕಮಾನು ಕಿಟಕಿ", draw: bdArch },
        { id: "polaroid", en: "Polaroid Party", kn: "ಪೋಲರಾಯ್ಡ್ ಪಾರ್ಟಿ", draw: bdPolaroid },
        { id: "stage", en: "Star Stage", kn: "ತಾರಾ ವೇದಿಕೆ", draw: bdStage },
        { id: "floral", en: "Floral Wreath", kn: "ಹೂವಿನ ಹಾರ", draw: bdFloral },
        { id: "cake", en: "Cake & Candles", kn: "ಕೇಕ್ ಮತ್ತು ದೀಪ", draw: bdCake, sizes: ["portrait", "story"] },
        { id: "hex", en: "Modern Pop", kn: "ಮಾಡರ್ನ್ ಪಾಪ್", draw: bdHex },
        { id: "fire", en: "Fireworks", kn: "ಪಟಾಕಿ", draw: bdFire },
        { id: "heart", en: "Heart", kn: "ಹೃದಯ", draw: bdHeart },
        { id: "palace", en: "Mysuru Palace", kn: "ಮೈಸೂರು ಅರಮನೆ", draw: bdPalace, sizes: ["portrait", "story"] }
    ];
    function tplOk(tpl) { return !tpl.sizes || tpl.sizes.indexOf(ui.size) >= 0; }

    function renderBirthday(W, H, t, m) {
        let tpl = BD_TEMPLATES.find(x => x.id === ui.template) || BD_TEMPLATES[0];
        if (!tplOk(tpl)) tpl = BD_TEMPLATES[0];
        tpl.draw(W, H, t, m);
    }

    function renderFestival(W, H, t, m) {
        const lang = ui.lang, T = TEXT[lang];
        const f = FESTIVALS.find(x => x.id === $("fSel").value) || FESTIVALS[0];
        const title = f.id === "custom" ? (val("fTitle") || f[lang].name) : f[lang].name;
        const wish = val("fWish") || f[lang].wish;
        const from = val("fFrom");
        const S = W * m.ms, cy = H * m.my;
        const y0 = header(W, t, m.logoR);
        const baseline = y0 + m.ft * 0.95;
        sh("rgba(0,0,0,.35)", 14, 6);
        paragraph(title, W / 2, baseline, W * 0.86, Math.max(40, cy - S * 1.35 - baseline - 10), m.ft, "800", lang === "kn" ? SANS : SERIF, grad3(W * 0.2, 0, W * 0.8, 0, t.g), 1.22);
        nosh();
        motif(f.motif, W / 2, cy, S, t);
        const wy = Math.max(cy + S * 1.55, H * (ui.size === "square" ? 0.745 : 0.765));
        paragraph(wish, W / 2, wy, W * 0.8, (H - 196) - wy, m.fw, "500", SANS, t.text, 1.42);
        footer(W, H, t, from ? T.festFrom + ": " + from : T.festFrom);
    }

    function iconDot(x, y, r, t, kind) {
        ctx.save(); ctx.fillStyle = grad3(x - r, y - r, x + r, y + r, t.f); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
        ctx.strokeStyle = t.dark; ctx.fillStyle = t.dark; ctx.lineWidth = 3.5; ctx.lineCap = "round";
        if (kind === "date") { rr(x - r * 0.45, y - r * 0.35, r * 0.9, r * 0.8, 5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - r * 0.45, y - r * 0.08); ctx.lineTo(x + r * 0.45, y - r * 0.08); ctx.stroke(); }
        else if (kind === "time") { ctx.beginPath(); ctx.arc(x, y, r * 0.48, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - r * 0.28); ctx.lineTo(x, y); ctx.lineTo(x + r * 0.22, y + r * 0.14); ctx.stroke(); }
        else { ctx.beginPath(); ctx.arc(x, y - r * 0.12, r * 0.3, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - r * 0.28, y + r * 0.02); ctx.lineTo(x, y + r * 0.5); ctx.lineTo(x + r * 0.28, y + r * 0.02); ctx.stroke(); }
        ctx.restore();
    }

    function renderEvent(W, H, t, m) {
        const lang = ui.lang, T = TEXT[lang];
        const title = val("eTitle") || T.evTitle, tag = val("eTag");
        const rows = [["date", T.evDate, val("eDate") || T.sampleDate], ["time", T.evTime, val("eTime") || T.sampleTime], ["pin", T.evVenue, val("eVenue") || T.sampleVenue]];
        const y0 = header(W, t, m.logoR);
        setFont(34, "700", SANS); ctx.fillStyle = t.accent; ctx.textAlign = "center"; ctx.fillText(T.invited, W / 2, y0 + 44);
        divider(W / 2, y0 + 78, W * 0.4, t);
        const rowH = ui.size === "square" ? 100 : 120, panelH = rows.length * rowH + 34, panelY = H - 215 - panelH;
        const ty = y0 + 78 + m.ft * 0.95;
        sh("rgba(0,0,0,.35)", 14, 6);
        const end = paragraph(title, W / 2, ty, W * 0.86, Math.max(40, panelY - 40 - (tag ? 170 : 70) - ty), m.ft, "800", lang === "kn" ? SANS : SERIF, grad3(W * 0.2, 0, W * 0.8, 0, t.g), 1.2);
        nosh();
        let last = end;
        if (tag) last = paragraph(tag, W / 2, end + 62, W * 0.78, 120, m.fw, "500", SANS, t.text, 1.4);
        const gapTop = last + 40, gapBottom = panelY - 24, gap = gapBottom - gapTop;
        if (gap > 150) {                       // fill the empty space with a lotus and two lamps
            const ls = Math.min(150, (gap - 10) / 1.15), lcy = gapBottom - 8;
            lotus(W / 2, lcy, ls, "#fff0f5", "#ff7eb6");
            if (gap > 230) { diya(W / 2 - ls * 1.25, lcy, ls * 0.3); diya(W / 2 + ls * 1.25, lcy, ls * 0.3); }
        }
        // info panel
        ctx.fillStyle = t.panel; rr(W * 0.09, panelY, W * 0.82, panelH, 30); ctx.fill(); ctx.strokeStyle = t.line; ctx.lineWidth = 2.5; ctx.stroke();
        rows.forEach((r, i) => {
            const cy = panelY + 17 + rowH * i + rowH / 2;
            iconDot(W * 0.09 + 70, cy, 36, t, r[0]);
            setFont(26, "700", SANS); ctx.fillStyle = t.accent; ctx.textAlign = "left"; ctx.fillText(r[1], W * 0.09 + 130, cy - 14);
            const s = (function () { let z = 40; while (z > 22 && measure(r[2], z, "600", SANS) > W * 0.82 - 160) z -= 2; return z; })();
            setFont(s, "600", SANS); ctx.fillStyle = t.text; ctx.fillText(r[2], W * 0.09 + 130, cy + 30);
        });
        footer(W, H, t, T.welcome);
    }

    function drawPoster(W, H) {
        const t = THEMES[ui.theme];
        ctx.clearRect(0, 0, W, H); nosh(); ctx.globalAlpha = 1;
        drawBackground(W, H, t);
        if (ui.tab !== "birthday") drawBackgroundPhoto(W, H, t);
        themeDecor(W, H, t);
        const m = layout();
        if (ui.tab === "birthday") renderBirthday(W, H, t, m);
        else if (ui.tab === "festival") renderFestival(W, H, t, m);
        else renderEvent(W, H, t, m);
        drawFrame(W, H, t);
    }

    let pending = false;
    function render() {
        pending = false;
        const size = SIZES[ui.size];
        if (canvas.width !== size[0] || canvas.height !== size[1]) { canvas.width = size[0]; canvas.height = size[1]; }
        drawPoster(size[0], size[1]);
    }

    // small live previews of every birthday template (they use your name, photo and colours)
    function renderThumb(el, id) {
        const W = 1080, H = 1350, k = el.width / W, saved = ctx;
        const keep = { size: ui.size, tab: ui.tab, template: ui.template };
        const real = { bName: val("bName"), bAge: val("bAge"), bWish: val("bWish") };
        preview = { bName: real.bName || (ui.lang === "kn" ? "ರಾಹುಲ್" : "Rahul"), bAge: real.bAge || "25", bWish: real.bWish };
        ctx = el.getContext("2d"); ctx.setTransform(k, 0, 0, k, 0, 0);
        ui.size = "portrait"; ui.tab = "birthday"; ui.template = id;
        try { drawPoster(W, H); } catch (e) { console.error(e); }
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx = saved;
        ui.size = keep.size; ui.tab = keep.tab; ui.template = keep.template; preview = null;
    }
    const tplCanvases = {}, tplLabelEls = {};
    let thumbTimer = null, thumbToken = 0;
    function scheduleThumbs(delay) {
        clearTimeout(thumbTimer);
        thumbTimer = setTimeout(() => {
            const token = ++thumbToken;
            BD_TEMPLATES.forEach((tpl, i) => setTimeout(() => { if (token === thumbToken && tplCanvases[tpl.id]) renderThumb(tplCanvases[tpl.id], tpl.id); }, i * 45));
        }, delay || 300);
    }
    function tplLabels() {
        const kn = document.documentElement.lang === "kn";
        BD_TEMPLATES.forEach(tpl => { if (tplLabelEls[tpl.id]) tplLabelEls[tpl.id].textContent = kn ? tpl.kn : tpl.en; });
    }
    function tplState() {
        const cur = BD_TEMPLATES.find(x => x.id === ui.template);
        if (cur && !tplOk(cur)) ui.template = "circle";
        document.querySelectorAll("#tplStrip button").forEach(b => {
            const tpl = BD_TEMPLATES.find(x => x.id === b.dataset.tpl);
            b.classList.toggle("on", tpl.id === ui.template); b.classList.toggle("off", !tplOk(tpl));
        });
    }
    function buildStrip() {
        const box = $("tplStrip");
        BD_TEMPLATES.forEach(tpl => {
            const b = document.createElement("button"); b.type = "button"; b.dataset.tpl = tpl.id;
            const c = document.createElement("canvas"); c.width = 216; c.height = 270;
            const sp = document.createElement("span"); tplLabelEls[tpl.id] = sp; tplCanvases[tpl.id] = c;
            b.appendChild(c); b.appendChild(sp);
            b.addEventListener("click", () => { if (!tplOk(tpl)) return; ui.template = tpl.id; tplState(); schedule(); });
            box.appendChild(b);
        });
        tplLabels(); tplState();
    }
    function schedule() { if (!pending) { pending = true; requestAnimationFrame(render); } }
    window.renderPosterNow = render;          // used for testing

    // ---------- 5. Page controls ----------
    function shrink(img) {
        const s = Math.min(1, 1600 / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c;
    }
    function readPhoto(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => { const img = new Image(); img.onload = () => resolve(shrink(img)); img.onerror = reject; img.src = reader.result; };
            reader.onerror = reject; reader.readAsDataURL(file);
        });
    }
    function loadAgb(i) {
        if (agbImages[i]) return;
        const img = new Image(); img.onload = () => { agbImages[i] = img; schedule(); }; img.src = AGB_PHOTOS[i];
    }

    function fillFestivalList() {
        const select = $("fSel"), keep = select.value;
        select.innerHTML = "";
        FESTIVALS.forEach(f => { const o = document.createElement("option"); o.value = f.id; o.textContent = f[ui.lang].name; select.appendChild(o); });
        if (keep) select.value = keep;
    }
    function placeholders() {
        const siteKn = document.documentElement.lang === "kn", T = TEXT[ui.lang];
        $("bName").placeholder = siteKn ? "ಉದಾ: ರಾಹುಲ್" : "e.g. Rahul";
        $("bWish").placeholder = T.bdWish;
        $("fTitle").placeholder = siteKn ? "ಉದಾ: ವಾರ್ಷಿಕೋತ್ಸವ" : "e.g. Annual Day";
        $("fFrom").placeholder = siteKn ? "ಉದಾ: ರಾಹುಲ್ ಕುಟುಂಬ" : "e.g. Rahul family";
        $("eTitle").placeholder = siteKn ? "ಉದಾ: ಗಣೇಶೋತ್ಸವ 2027" : "e.g. Ganeshotsava 2027";
        $("eTag").placeholder = siteKn ? "ಉದಾ: ಒಟ್ಟಾಗಿ ಆಚರಿಸೋಣ" : "e.g. Let us celebrate together";
        $("eDate").placeholder = T.sampleDate; $("eTime").placeholder = T.sampleTime; $("eVenue").placeholder = T.sampleVenue;
        tplLabels();
    }
    function setTab(tab) {
        ui.tab = tab;
        document.querySelectorAll(".stab").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
        document.querySelectorAll("[data-panel]").forEach(p => { p.hidden = p.dataset.panel !== tab; });
        $("bgBlock").hidden = tab === "birthday";
        schedule();
    }
    function pick(groupId, attr, key) {
        document.querySelectorAll("#" + groupId + " button").forEach(b => b.addEventListener("click", () => {
            ui[key] = b.dataset[attr];
            document.querySelectorAll("#" + groupId + " button").forEach(x => x.classList.toggle("on", x === b));
            if (key === "lang") { fillFestivalList(); placeholders(); }
            if (key === "size") tplState();
            if (key === "theme" || key === "lang") scheduleThumbs(150);
            schedule();
        }));
    }
    function fileName() {
        const base = (val("bName") || val("eTitle") || val("fTitle") || ui.tab).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || ui.tab;
        return "AGB-" + ui.tab + "-" + base + ".png";
    }
    function saveBlob(blob, name) {
        const url = URL.createObjectURL(blob), a = document.createElement("a");
        a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
    }

    function init() {
        logo = new Image(); logo.onload = () => { schedule(); scheduleThumbs(50); }; logo.src = "images/logo.png";
        fillFestivalList(); placeholders(); buildStrip();
        document.querySelectorAll(".stab").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
        pick("segSize", "size", "size"); pick("segLang", "lang", "lang"); pick("themes", "theme", "theme");
        document.querySelectorAll("#studio input[type=text], #studio input[type=number], #studio textarea, #studio select, #studio input[type=range]").forEach(el => el.addEventListener("input", () => { if (el.id === "bgMode") syncBg(); if (/^(bName|bAge|bWish)$/.test(el.id)) scheduleThumbs(700); schedule(); }));

        $("fPhoto").addEventListener("change", async (e) => { if (e.target.files[0]) { userPhoto = await readPhoto(e.target.files[0]); $("photoTools").hidden = false; schedule(); scheduleThumbs(200); } });
        $("fBg").addEventListener("change", async (e) => { if (e.target.files[0]) { bgPhoto = await readPhoto(e.target.files[0]); schedule(); } });
        $("photoClear").addEventListener("click", () => { userPhoto = null; $("fPhoto").value = ""; $("photoTools").hidden = true; schedule(); scheduleThumbs(200); });

        const thumbs = $("agbThumbs");
        AGB_PHOTOS.forEach((src, i) => {
            const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "AGB photo " + (i + 1));
            const im = document.createElement("img"); im.src = src; im.alt = ""; im.loading = "lazy"; b.appendChild(im);
            b.addEventListener("click", () => { ui.agb = i; loadAgb(i); thumbs.querySelectorAll("button").forEach((x, j) => x.classList.toggle("on", j === i)); schedule(); });
            thumbs.appendChild(b);
        });
        thumbs.firstChild.classList.add("on");
        function syncBg() {
            ui.bgMode = $("bgMode").value;
            $("agbBox").hidden = ui.bgMode !== "agb"; $("mineBox").hidden = ui.bgMode !== "mine";
            if (ui.bgMode === "agb") loadAgb(ui.agb);
        }
        $("bgMode").addEventListener("change", () => { syncBg(); schedule(); });

        $("btnDownload").addEventListener("click", () => { render(); canvas.toBlob(b => saveBlob(b, fileName()), "image/png"); });
        $("btnShare").addEventListener("click", () => {
            render();
            canvas.toBlob(async (blob) => {
                const file = new File([blob], fileName(), { type: "image/png" });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try { await navigator.share({ files: [file], title: "AIGIRI GELEYARA BALAGA" }); return; } catch (err) { if (err && err.name === "AbortError") return; }
                }
                saveBlob(blob, file.name);
            }, "image/png");
        });

        // "Preview poster" button for phones
        const jump = $("jumpPreview"), box = $("studioPreview");
        jump.addEventListener("click", () => box.scrollIntoView({ behavior: "smooth", block: "start" }));
        if ("IntersectionObserver" in window) new IntersectionObserver(e => jump.classList.toggle("show", !e[0].isIntersecting), { threshold: 0.15 }).observe(box);

        new MutationObserver(placeholders).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
        setTab("birthday");
    }
    init();
})();
