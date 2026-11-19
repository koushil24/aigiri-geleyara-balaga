// =====================================================
// AIGIRI ID CARD - drawing the card, PNG / PDF / Print
// 1 Drawing helpers  2 Front  3 Back  4 renderCard
// 5 Sheets (PNG, A4)  6 PDF maker  7 Download + Print
//
// The card is drawn on a <canvas>, so the picture you see on
// the screen is exactly the picture that is downloaded or printed.
// Real card size: 54 x 85.6 mm (like a bank card, standing up).
// =====================================================

const CARD_W = 300;      // drawing size (units). Height keeps the card shape.
const CARD_H = 475;
const FONT = "'Noto Sans Kannada', 'Segoe UI', Roboto, Arial, sans-serif";


// ===== 1. Drawing helpers =====
const imageCache = {};

// Loads a picture once and remembers it
function loadImage(src) {
    if (!imageCache[src]) {
        imageCache[src] = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    return imageCache[src];
}

function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

// Writes centered text
function writeText(ctx, text, x, y, size, color, bold) {
    ctx.font = (bold ? "bold " : "") + size + "px " + FONT;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

// The dark red top band with the logo and the group name
function drawBand(ctx, logo, height, logoY, logoR, nameY, showCity) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#4b0000");
    gradient.addColorStop(1, "#6d0f0f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CARD_W, height);

    if (logo) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(150, logoY, logoR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logo, 150 - logoR, logoY - logoR, logoR * 2, logoR * 2);
        ctx.restore();
    }

    writeText(ctx, "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ", 150, nameY, showCity ? 19 : 15, "#FFD700", true);
    writeText(ctx, "AIGIRI GELEYARA BALAGA", 150, nameY + (showCity ? 18 : 14), showCity ? 11 : 10, "#ffffff", false);
    if (showCity) writeText(ctx, "Mysuru", 150, nameY + 34, 11, "#ffe082", false);
}

// The gold strip at the bottom
function drawStrip(ctx) {
    ctx.fillStyle = "#6d0f0f";
    ctx.fillRect(0, CARD_H - 32, CARD_W, 32);
    writeText(ctx, "Friendship • Culture • Service", 150, CARD_H - 12, 12, "#FFD700", false);
}

// The member's name: one line if it fits, otherwise two lines
function drawName(ctx, name) {
    const maxWidth = 262;
    ctx.fillStyle = "#6d0f0f";

    for (let size = 22; size >= 14; size--) {
        ctx.font = "bold " + size + "px " + FONT;
        if (ctx.measureText(name).width <= maxWidth) {
            ctx.fillText(name, 150, 270);
            return;
        }
    }

    ctx.font = "bold 15px " + FONT;
    const words = name.split(" ");
    let bestSplit = 1;
    let bestWidth = Infinity;
    for (let i = 1; i < words.length; i++) {
        const widest = Math.max(
            ctx.measureText(words.slice(0, i).join(" ")).width,
            ctx.measureText(words.slice(i).join(" ")).width
        );
        if (widest < bestWidth) { bestWidth = widest; bestSplit = i; }
    }
    ctx.fillText(words.slice(0, bestSplit).join(" "), 150, 262);
    ctx.fillText(words.slice(bestSplit).join(" "), 150, 282);
}


// ===== 2. Card colours: maroon and gold chrome only =====
const MAROON = ["#7b1620", "#4a0a10"];
const DARK = "#2e0508";

// shiny gold: a bright top, a dark "horizon" line in the middle and a warm bottom
function chromeV(ctx, y0, y1) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    [[0, "#fffbe0"], [0.2, "#f7d86a"], [0.45, "#c8941a"], [0.5, "#7a5200"], [0.53, "#ffe9a0"], [0.75, "#e3b13b"], [1, "#8d5f05"]].forEach(s => g.addColorStop(s[0], s[1]));
    return g;
}
function chromeH(ctx, x0, x1) {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    [[0, "#fff3b8"], [0.3, "#f2c94c"], [0.55, "#b8860b"], [0.75, "#ffe08a"], [1, "#c99a1b"]].forEach(s => g.addColorStop(s[0], s[1]));
    return g;
}
// text filled with gold chrome
function chromeText(ctx, text, x, y, size, align) {
    ctx.save(); ctx.font = "900 " + size + "px " + FONT; ctx.textAlign = align || "center";
    ctx.fillStyle = chromeV(ctx, y - size * 0.78, y + size * 0.12); ctx.fillText(text, x, y);
    ctx.restore();
}
// big condensed word behind the photo
function giantWord(ctx, word, baseline, maxW) {
    const size = 150; ctx.save(); ctx.font = "900 " + size + "px " + FONT;
    const w = ctx.measureText(word).width, sx = Math.min(1, maxW / w);
    ctx.translate(150, baseline); ctx.scale(sx, 1); ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
    ctx.fillStyle = chromeV(ctx, -size * 0.74, size * 0.03); ctx.fillText(word, 0, 0);
    ctx.restore();
}

function coverImage(ctx, img, x, y, w, h, zoom, ox, oy) {
    const scale = Math.max(w / img.width, h / img.height) * (zoom || 1), sw = w / scale, sh = h / scale;
    const sx = Math.min(Math.max((img.width - sw) * (0.5 + (ox || 0) * 0.5), 0), img.width - sw);
    const sy = Math.min(Math.max((img.height - sh) * (0.5 + (oy || 0) * 0.5), 0), img.height - sh);
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}
function tag(ctx, text, x, y, size, color, align) {
    ctx.save(); if ("letterSpacing" in ctx) ctx.letterSpacing = "1px";
    ctx.textAlign = align || "center"; writeText(ctx, text, x, y, size, color, true); ctx.restore();
}
function cardBackground(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, CARD_H); g.addColorStop(0, MAROON[0]); g.addColorStop(1, MAROON[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, CARD_W, CARD_H);
    const glow = ctx.createRadialGradient(150, 140, 0, 150, 140, 260); glow.addColorStop(0, "rgba(255,190,70,.20)"); glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, CARD_W, CARD_H);
    // gold map-contour lines
    ctx.save(); ctx.strokeStyle = "#f2c94c"; ctx.globalAlpha = 0.13; ctx.lineWidth = 0.9;
    [[225, 120, 1], [30, 350, 2]].forEach(c => {
        for (let k = 1; k <= 16; k++) {
            ctx.beginPath();
            for (let a = 0; a <= 360; a += 6) {
                const t = a * Math.PI / 180, r = k * 15 * (1 + 0.14 * Math.sin(3 * t + k * 0.35 + c[2]) + 0.08 * Math.sin(5 * t - k * 0.2));
                const x = c[0] + Math.cos(t) * r * 1.15, y = c[1] + Math.sin(t) * r;
                if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath(); ctx.stroke();
        }
    });
    ctx.restore();
    // thin gold frame
    ctx.save(); ctx.strokeStyle = chromeV(ctx, 0, CARD_H); ctx.globalAlpha = 0.9; ctx.lineWidth = 1.4; roundedRect(ctx, 6, 6, CARD_W - 12, CARD_H - 12, 13); ctx.stroke(); ctx.restore();
}
function slant(ctx, x, y, w, h, skew, fill) {
    ctx.beginPath(); ctx.moveTo(x + skew, y); ctx.lineTo(x + w + skew, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
}
function strip(ctx, y) {
    const h = CARD_H - y;
    ctx.save(); ctx.fillStyle = DARK; ctx.fillRect(0, y, CARD_W, h); ctx.fillStyle = chromeH(ctx, 0, CARD_W); ctx.fillRect(0, y, CARD_W, 2.5);
    ctx.font = "bold 7.5px " + FONT; ctx.fillStyle = chromeV(ctx, y, y + h); ctx.textAlign = "left";
    const t = "FRIENDSHIP  •  CULTURE  •  SERVICE  •  "; let x = -8;
    while (x < CARD_W) { ctx.fillText(t, x, y + h / 2 + 4); x += ctx.measureText(t).width; }
    ctx.restore();
}
function lanyardSlot(ctx) {
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,.45)"; roundedRect(ctx, 131, 12, 38, 7, 3.5); ctx.fill();
    ctx.strokeStyle = chromeH(ctx, 131, 169); ctx.lineWidth = 1; roundedRect(ctx, 131, 12, 38, 7, 3.5); ctx.stroke(); ctx.restore();
}
function topBar(ctx, logo) {
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2; ctx.fillStyle = chromeH(ctx, 14, 62);
    ctx.beginPath(); ctx.arc(38, 42, 23, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (logo) { ctx.save(); ctx.beginPath(); ctx.arc(38, 42, 19.5, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(logo, 18.5, 22.5, 39, 39); ctx.restore(); }
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 4; ctx.shadowOffsetY = 1.5; chromeText(ctx, "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ", 68, 40, 15, "left"); ctx.restore();
    tag(ctx, "AIGIRI GELEYARA BALAGA  •  MYSURU", 68, 54, 6.6, "#f2d37a", "left");
}
function iconPhone(ctx, x, y) { ctx.save(); ctx.strokeStyle = chromeH(ctx, x - 5, x + 5); ctx.fillStyle = "#f2c94c"; ctx.lineWidth = 1.5; roundedRect(ctx, x - 4, y - 7, 8, 14, 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y + 4, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
function iconDrop(ctx, x, y) { ctx.save(); ctx.fillStyle = chromeV(ctx, y - 8, y + 7); ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.bezierCurveTo(x + 7, y, x + 6, y + 7, x, y + 7); ctx.bezierCurveTo(x - 6, y + 7, x - 7, y, x, y - 8); ctx.fill(); ctx.restore(); }
function iconInsta(ctx, x, y) { ctx.save(); ctx.strokeStyle = chromeH(ctx, x - 7, x + 7); ctx.fillStyle = "#f2c94c"; ctx.lineWidth = 1.5; roundedRect(ctx, x - 7, y - 7, 14, 14, 4); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 4.2, y - 4.2, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }

// ===== 2b. Cut-out: removes the photo background inside the member's own browser =====
// Uses Google's free "selfie segmentation" model (loaded once from a CDN). The photo never leaves the phone.
// If it cannot load (no internet), the card simply shows the photo in a frame instead.
const SEG_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/";
const cutouts = {};          // photo -> { canvas, box }  or false when it did not work
const cutoutJobs = {};
let segmenterPromise = null;

function loadScript(src) {
    return new Promise((ok, fail) => {
        const s = document.createElement("script"); s.src = src; s.crossOrigin = "anonymous";
        s.onload = ok; s.onerror = () => fail(new Error("Could not load " + src)); document.head.appendChild(s);
    });
}
function getSegmenter() {
    if (!segmenterPromise) segmenterPromise = (async () => {
        await loadScript(SEG_BASE + "selfie_segmentation.js");
        const seg = new SelfieSegmentation({ locateFile: (f) => SEG_BASE + f });
        seg.setOptions({ modelSelection: 0 });
        seg.onResults((r) => { seg.lastMask = r.segmentationMask; });
        await seg.initialize();
        return seg;
    })();
    return segmenterPromise;
}
function smooth(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

async function makeCutout(img) {
    const seg = await getSegmenter();
    const w = img.width, h = img.height;
    const src = document.createElement("canvas"); src.width = w; src.height = h; src.getContext("2d").drawImage(img, 0, 0, w, h);
    seg.lastMask = null; await seg.send({ image: src });
    for (let i = 0; i < 30 && !seg.lastMask; i++) await new Promise(r => setTimeout(r, 100));
    if (!seg.lastMask) throw new Error("no mask");

    const mc = document.createElement("canvas"); mc.width = w; mc.height = h; const mctx = mc.getContext("2d");
    mctx.drawImage(seg.lastMask, 0, 0, w, h);
    const md = mctx.getImageData(0, 0, w, h).data;
    let lo = 255, hi = 0; for (let i = 3; i < md.length; i += 4 * 37) { lo = Math.min(lo, md[i]); hi = Math.max(hi, md[i]); }
    const channel = (hi - lo) > 40 ? 3 : 0;                 // the mask is either in the alpha or in the red channel

    const out = document.createElement("canvas"); out.width = w; out.height = h; const octx = out.getContext("2d");
    octx.drawImage(src, 0, 0); const od = octx.getImageData(0, 0, w, h);
    let minX = w, minY = h, maxX = 0, maxY = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4, a = smooth(0.35, 0.65, md[i + channel] / 255);
        od.data[i + 3] = Math.round(a * 255);
        if (a > 0.5) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    }
    if (maxX - minX < w * 0.15 || maxY - minY < h * 0.15) throw new Error("person not found");
    octx.putImageData(od, 0, 0);
    return { canvas: out, box: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } };
}
function startCutout(img, key) {
    if (!cutoutJobs[key]) cutoutJobs[key] = makeCutout(img)
        .then(r => { cutouts[key] = r; window.dispatchEvent(new Event("agb-cutout")); return r; })
        .catch(e => { cutouts[key] = false; console.warn("Cut-out not available:", e.message); return null; });
    return cutoutJobs[key];
}

// ===== 3. Front of the card =====
function drawFront(ctx, data, logo, photo, cut) {
    cardBackground(ctx);
    topBar(ctx, logo); lanyardSlot(ctx);
    ctx.fillStyle = chromeH(ctx, 224, 286); roundedRect(ctx, 224, 60, 62, 17, 8.5); ctx.fill(); tag(ctx, "MEMBER", 255, 72, 7.8, DARK);

    giantWord(ctx, "AIGIRI", 196, 252);
    const st = data.settings || { z: 1, x: 0, y: 0 };      // the member's own zoom and position

    if (cut) {
        // the person stands in front of the big letters
        const b = cut.box, s = Math.min(262 / b.w, 258 / b.h) * (st.z || 1);
        const dx = 150 - (b.x + b.w / 2) * s + (st.x || 0) * 60, dy = 356 - (b.y + b.h) * s + (st.y || 0) * 60;
        ctx.save(); ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
        ctx.drawImage(cut.canvas, dx, dy, cut.canvas.width * s, cut.canvas.height * s); ctx.restore();
    } else {
        // a framed photo (used when the cut-out is not ready or not possible)
        ctx.save(); ctx.translate(150, 272); ctx.rotate(-0.03);
        ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.fillStyle = chromeH(ctx, -126, 126); roundedRect(ctx, -126, -92, 252, 184, 20); ctx.fill(); ctx.shadowColor = "transparent";
        ctx.save(); roundedRect(ctx, -121, -87, 242, 174, 16); ctx.clip();
        if (photo) coverImage(ctx, photo, -121, -87, 242, 174, Math.max(1, st.z || 1), -(st.x || 0), -(st.y || 0));
        else {
            const g = ctx.createLinearGradient(0, -87, 0, 87); g.addColorStop(0, MAROON[0]); g.addColorStop(1, DARK); ctx.fillStyle = g; ctx.fillRect(-121, -87, 242, 174);
            ctx.fillStyle = "rgba(242,201,76,.5)"; ctx.beginPath(); ctx.arc(0, -20, 32, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(0, 90, 66, Math.PI, 0); ctx.fill();
        }
        ctx.restore(); ctx.restore();
    }

    // gold name label and dark role label
    const name = (data.name || "—").toUpperCase();
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4; slant(ctx, 14, 342, 262, 48, 12, chromeH(ctx, 14, 288)); ctx.restore();
    ctx.fillStyle = DARK; let fitted = false;
    for (let s = 25; s >= 15; s--) { ctx.font = "900 " + s + "px " + FONT; if (ctx.measureText(name).width <= 236) { ctx.fillText(name, 151, 372 + (s > 21 ? 3 : 0)); fitted = true; break; } }
    if (!fitted) {
        ctx.font = "900 15px " + FONT; const words = name.split(" "); let best = 1, bw = Infinity;
        for (let i = 1; i < words.length; i++) { const w = Math.max(ctx.measureText(words.slice(0, i).join(" ")).width, ctx.measureText(words.slice(i).join(" ")).width); if (w < bw) { bw = w; best = i; } }
        ctx.fillText(words.slice(0, best).join(" "), 151, 363); ctx.fillText(words.slice(best).join(" "), 151, 381);
    }
    const role = (data.role || "MEMBER").toUpperCase();
    let rs = 10.5; ctx.font = "900 " + rs + "px " + FONT; while (rs > 7.5 && ctx.measureText(role).width > 230) { rs -= 0.5; ctx.font = "900 " + rs + "px " + FONT; }
    const rw = Math.min(262, ctx.measureText(role).width + 34);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2; slant(ctx, 150 - rw / 2 - 5, 394, rw, 22, 10, DARK);
    ctx.strokeStyle = chromeH(ctx, 150 - rw / 2, 150 + rw / 2); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(150 - rw / 2 - 5 + 10, 394); ctx.lineTo(150 + rw / 2 + 5, 394); ctx.lineTo(150 + rw / 2 - 5, 416); ctx.lineTo(150 - rw / 2 - 5, 416); ctx.closePath(); ctx.stroke(); ctx.restore();
    chromeText(ctx, role, 150, 409, rs);

    // details
    [[56, "ID", data.id || ""], [150, "JOINED", String(data.year || "")], [244, "BLOOD", data.blood || "—"]].forEach((c, i) => {
        tag(ctx, c[1], c[0], 429, 6.4, "rgba(255,230,160,.7)"); chromeText(ctx, c[2], c[0], 443, i === 0 ? 11 : 13);
    });
    ctx.save(); ctx.strokeStyle = "rgba(242,201,76,.4)"; ctx.lineWidth = 0.8; [[103, 422, 103, 446], [197, 422, 197, 446]].forEach(l => { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke(); }); ctx.restore();

    strip(ctx, 452);
}

// ===== 4. Back of the card =====
function drawBack(ctx, data, logo, scale) {
    cardBackground(ctx);
    topBar(ctx, logo); lanyardSlot(ctx);

    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
    chromeText(ctx, "SCAN TO", 150, 112, 40);
    let s = 64; ctx.font = "900 " + s + "px " + FONT; while (s > 30 && ctx.measureText("VERIFY").width > 236) { s -= 2; ctx.font = "900 " + s + "px " + FONT; }
    chromeText(ctx, "VERIFY", 150, 112 + s * 0.84, s); ctx.restore();

    // QR code (white, so every phone can read it)
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.fillStyle = "#ffffff"; roundedRect(ctx, 64, 182, 172, 184, 16); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle = chromeH(ctx, 64, 236); ctx.lineWidth = 2.6; ctx.lineCap = "round"; roundedRect(ctx, 64, 182, 172, 184, 16); ctx.stroke(); ctx.restore();
    if (data.verifyUrl) {
        const qr = QR.make(data.verifyUrl);
        const module = Math.floor(132 * scale / qr.size) / scale, full = module * qr.size;
        const left = Math.round((150 - full / 2) * scale) / scale, top = Math.round((260 - full / 2) * scale) / scale;
        ctx.fillStyle = "#000000";
        for (let r = 0; r < qr.size; r++) for (let c = 0; c < qr.size; c++) if (qr.modules[r][c]) ctx.fillRect(left + c * module, top + r * module, module, module);
    }
    ctx.save(); if ("letterSpacing" in ctx) ctx.letterSpacing = "1.5px"; writeText(ctx, data.id || "", 150, 352, 13, "#6d0f0f", true); ctx.restore();

    // contact rows
    ctx.textAlign = "left";
    [[390, iconPhone, data.phone || "—"], [410, iconDrop, "Blood group  " + (data.blood || "—")], [430, iconInsta, "@aigiri2025"]].forEach(r => { r[1](ctx, 88, r[0] - 4); chromeText(ctx, r[2], 104, r[0], 11.5, "left"); });
    ctx.textAlign = "center";
    writeText(ctx, "If found, please return to AGB, Mysuru", 150, 446, 7.4, "rgba(255,230,160,.65)", false);

    strip(ctx, 452);
}


// ===== 4b. renderCard: draws one side and returns a canvas =====
// side = "front" or "back"; scale = how sharp (3 = about 420 dots per inch)
async function renderCard(side, data, scale) {
    const logo = await loadImage("images/logo.png").catch(() => null);
    const photo = data.photo ? await loadImage(data.photo).catch(() => null) : null;

    // background removal: shown as soon as it is ready; downloads wait for it
    let cut = null;
    if (photo && side === "front" && data.cutout !== false) {
        const key = data.photo;
        if (cutouts[key] === undefined) { const job = startCutout(photo, key); if (window.AGB_WAIT_CUTOUT) await job; }
        cut = cutouts[key] || null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = CARD_W * scale;
    canvas.height = CARD_H * scale;

    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.save();
    roundedRect(ctx, 0, 0, CARD_W, CARD_H, 18);
    ctx.clip();
    if (side === "front") drawFront(ctx, data, logo, photo, cut);
    else drawBack(ctx, data, logo, scale);
    ctx.restore();

    roundedRect(ctx, 0.5, 0.5, CARD_W - 1, CARD_H - 1, 18);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,.35)";
    ctx.stroke();

    return canvas;
}


// ===== 5. Sheets: front + back together, ready to save or print =====
async function makeSheet(kind, data) {
    window.AGB_WAIT_CUTOUT = true;                       // wait for the cut-out, so the file is the final card
    let front, back;
    try { front = await renderCard("front", data, 3); back = await renderCard("back", data, 3); }
    finally { window.AGB_WAIT_CUTOUT = false; }

    const sheet = document.createElement("canvas");
    const ctx = sheet.getContext("2d");
    ctx.textAlign = "center";

    if (kind === "png") {
        // simple picture: both sides next to each other
        const margin = 60;
        sheet.width = margin * 3 + front.width * 2;
        sheet.height = margin * 2 + front.height;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sheet.width, sheet.height);
        ctx.drawImage(front, margin, margin);
        ctx.drawImage(back, margin * 2 + front.width, margin);
        return sheet;
    }

    // A4 paper at 300 dots per inch, cards at their real size (54 x 85.6 mm)
    const mm = 300 / 25.4;
    sheet.width = Math.round(210 * mm);
    sheet.height = Math.round(297 * mm);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, sheet.width, sheet.height);

    const cardW = 54 * mm;
    const cardH = 85.6 * mm;
    const gap = 10 * mm;
    const left = (sheet.width - (cardW * 2 + gap)) / 2;
    const top = 15 * mm;

    ctx.drawImage(front, left, top, cardW, cardH);
    ctx.drawImage(back, left + cardW + gap, top, cardW, cardH);

    ctx.strokeStyle = "#bbbbbb";      // thin cutting guides around each card
    ctx.lineWidth = 2;
    ctx.setLineDash([14, 10]);
    [left, left + cardW + gap].forEach(x => ctx.strokeRect(x - 3 * mm, top - 3 * mm, cardW + 6 * mm, cardH + 6 * mm));
    ctx.setLineDash([]);

    ctx.font = "30px " + FONT;
    ctx.fillStyle = "#888888";
    ctx.fillText("Print at 100% (actual size)  •  AIGIRI GELEYARA BALAGA", sheet.width / 2, top + cardH + 12 * mm);
    return sheet;
}


// ===== 6. A tiny PDF maker: one A4 page holding one picture =====
function makePdf(jpegDataUrl, pixelWidth, pixelHeight) {
    const binary = atob(jpegDataUrl.split(",")[1]);
    const jpeg = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) jpeg[i] = binary.charCodeAt(i);

    const encoder = new TextEncoder();
    const parts = [];
    const starts = [];
    let length = 0;

    const add = (piece) => {
        const bytes = typeof piece === "string" ? encoder.encode(piece) : piece;
        parts.push(bytes);
        length += bytes.length;
    };
    const object = (number, body) => {
        starts[number] = length;
        add(number + " 0 obj\n" + body + "\nendobj\n");
    };

    add("%PDF-1.4\n");
    object(1, "<< /Type /Catalog /Pages 2 0 R >>");
    object(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
    object(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>");

    starts[4] = length;
    add("4 0 obj\n<< /Type /XObject /Subtype /Image /Width " + pixelWidth + " /Height " + pixelHeight +
        " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpeg.length + " >>\nstream\n");
    add(jpeg);
    add("\nendstream\nendobj\n");

    const drawing = "q 595.28 0 0 841.89 0 0 cm /Im0 Do Q";
    object(5, "<< /Length " + drawing.length + " >>\nstream\n" + drawing + "\nendstream");

    const tableStart = length;
    let table = "xref\n0 6\n0000000000 65535 f \n";
    for (let n = 1; n <= 5; n++) table += String(starts[n]).padStart(10, "0") + " 00000 n \n";
    add(table + "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + tableStart + "\n%%EOF");

    return new Blob(parts, { type: "application/pdf" });
}


// ===== 7. Download and print =====
function saveFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function canvasToBlob(canvas, type, quality) {
    return new Promise(resolve => canvas.toBlob(resolve, type, quality));
}

async function downloadPng(data) {
    const sheet = await makeSheet("png", data);
    saveFile(await canvasToBlob(sheet, "image/png"), data.id + "-ID-card.png");
}

async function downloadPdf(data) {
    const sheet = await makeSheet("a4", data);
    const jpeg = sheet.toDataURL("image/jpeg", 0.92);
    saveFile(makePdf(jpeg, sheet.width, sheet.height), data.id + "-ID-card.pdf");
}

async function printCard(data) {
    const sheet = await makeSheet("a4", data);

    let box = document.getElementById("printSheet");
    if (!box) {
        box = document.createElement("div");
        box.id = "printSheet";                       // hidden on screen, the only thing shown when printing
        box.innerHTML = '<img alt="">';
        document.body.appendChild(box);
    }

    const picture = box.firstChild;
    picture.src = sheet.toDataURL("image/jpeg", 0.92);
    await picture.decode();
    window.print();
}
