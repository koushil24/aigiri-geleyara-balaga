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


// ===== 2. Card designs (4 colour looks) =====
// royal = maroon + gold, night = deep blue + gold, marigold = orange + maroon, classic = cream + maroon
const CARD_THEMES = {
    royal:    { bg: ["#7d1313", "#3d0707", "#190202"], glow: "rgba(255,190,70,.32)", text: "#fff4d6", sub: "rgba(255,244,214,.78)", head: ["#fff1b8", "#f2b705", "#c98a00"], line: "#f2b705", pill: ["#fff1b8", "#f2b705", "#c98a00"], pillText: "#4a0a0a", tile: "rgba(255,255,255,.09)", sil: "rgba(242,183,5,.32)", lit: "#ffd24a" },
    night:    { bg: ["#0d1236", "#161c52", "#05071a"], glow: "rgba(120,140,255,.30)", text: "#f4f1ff", sub: "rgba(244,241,255,.75)", head: ["#fff1b8", "#ffd86b", "#d99a00"], line: "#ffd86b", pill: ["#fff1b8", "#ffd86b", "#d99a00"], pillText: "#0d1236", tile: "rgba(255,255,255,.08)", sil: "rgba(255,216,107,.30)", lit: "#ffd86b" },
    marigold: { bg: ["#ffc21a", "#f58a07", "#c2410c"], glow: "rgba(255,255,255,.35)", text: "#4a0a0a", sub: "rgba(74,10,10,.78)", head: ["#8a1515", "#a31a1a", "#5a0a0a"], line: "#7a1111", pill: ["#b22222", "#8a1515", "#5a0a0a"], pillText: "#fff3c4", tile: "rgba(255,255,255,.38)", sil: "rgba(90,10,10,.6)", lit: "#fff3c4" },
    classic:  { bg: ["#fffaf0", "#f7e9cc", "#ecd6a8"], glow: "rgba(255,255,255,.75)", text: "#4a0a0a", sub: "rgba(74,10,10,.72)", head: ["#b22222", "#8a1515", "#5a0a0a"], line: "#b8860b", pill: ["#e6b94d", "#b8860b", "#7a5a00"], pillText: "#3a0a0a", tile: "rgba(255,255,255,.65)", sil: "rgba(90,10,10,.5)", lit: "#f2b705" }
};

function cardTheme(data) {
    let name = data.design;
    if (!name) { try { name = localStorage.getItem("agbCardDesign"); } catch (e) { name = null; } }
    return CARD_THEMES[name] || CARD_THEMES.royal;
}

function across(ctx, colors, x0, x1) {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, colors[0]); g.addColorStop(0.5, colors[1]); g.addColorStop(1, colors[2]);
    return g;
}

function star4(ctx, x, y, s, color) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const r = i % 2 ? s * 0.28 : s;
        ctx.lineTo(Math.cos(i * Math.PI / 4 - Math.PI / 2) * r, Math.sin(i * Math.PI / 4 - Math.PI / 2) * r);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
}

function cardMandala(ctx, cx, cy, R, color, alpha) {
    ctx.save(); ctx.translate(cx, cy); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 1;
    [1, 0.94].forEach(k => { ctx.beginPath(); ctx.arc(0, 0, R * k, 0, Math.PI * 2); ctx.stroke(); });
    for (let ring = 0; ring < 3; ring++) {
        const n = 16, pr = R * (0.86 - ring * 0.2), pw = R * (0.13 - ring * 0.025);
        for (let i = 0; i < n; i++) {
            ctx.save(); ctx.rotate(i * Math.PI * 2 / n + ring * Math.PI / n);
            ctx.beginPath(); ctx.moveTo(0, -pr * 0.55); ctx.quadraticCurveTo(pw, -pr * 0.8, 0, -pr); ctx.quadraticCurveTo(-pw, -pr * 0.8, 0, -pr * 0.55);
            ctx.stroke(); ctx.restore();
        }
    }
    ctx.restore();
}

// fine wavy "banknote" lines - hard to copy, looks premium
function drawGuilloche(ctx, th, y0, y1) {
    ctx.save(); ctx.strokeStyle = th.line; ctx.globalAlpha = 0.09; ctx.lineWidth = 0.7;
    for (let k = 0; y0 + k * 3.2 < y1; k++) {
        ctx.beginPath();
        for (let x = 0; x <= CARD_W; x += 4) {
            const y = y0 + k * 3.2 + Math.sin(x / 15 + k * 0.45) * 5;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.restore();
}

function cardBackground(ctx, th) {
    const g = ctx.createLinearGradient(0, 0, 0, CARD_H);
    g.addColorStop(0, th.bg[0]); g.addColorStop(0.55, th.bg[1]); g.addColorStop(1, th.bg[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, CARD_W, CARD_H);
    const r = ctx.createRadialGradient(150, 150, 0, 150, 150, 280);
    r.addColorStop(0, th.glow); r.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = r; ctx.fillRect(0, 0, CARD_W, CARD_H);
    cardMandala(ctx, 150, 230, 205, th.line, 0.11);
    drawGuilloche(ctx, th, 300, CARD_H);
    // thin inner border with four gold studs
    ctx.save(); ctx.strokeStyle = th.line; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.2; roundedRect(ctx, 7, 7, CARD_W - 14, CARD_H - 14, 12); ctx.stroke(); ctx.restore();
    [[14, 14], [CARD_W - 14, 14], [14, CARD_H - 14], [CARD_W - 14, CARD_H - 14]].forEach(p => star4(ctx, p[0], p[1], 5, th.line));
}

function lotusSmall(ctx, cx, cy, s) {
    ctx.save(); ctx.translate(cx, cy);
    [[7, 2.3, 0.92], [5, 1.5, 1], [3, 0.7, 1.06]].forEach(layer => {
        for (let i = 0; i < layer[0]; i++) {
            const a = (i / (layer[0] - 1) - 0.5) * layer[1], L = s * layer[2];
            ctx.save(); ctx.rotate(a);
            const g = ctx.createLinearGradient(0, 0, 0, -L); g.addColorStop(0, "#fff0f5"); g.addColorStop(1, "#ff7eb6");
            ctx.fillStyle = g; ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(L * 0.36, -L * 0.25, L * 0.3, -L * 0.8, 0, -L);
            ctx.bezierCurveTo(-L * 0.3, -L * 0.8, -L * 0.36, -L * 0.25, 0, 0); ctx.fill(); ctx.stroke(); ctx.restore();
        }
    });
    ctx.restore();
}

// Mysuru palace skyline, squashed flat to sit along the bottom edge
function cardPalace(ctx, th, baseY, w) {
    ctx.save(); ctx.translate(150, baseY); ctx.scale(1, 0.62);
    const col = th.sil;
    ctx.fillStyle = col; ctx.fillRect(-w / 2, -w * 0.03, w, w * 0.03); ctx.fillRect(-w * 0.43, -w * 0.1, w * 0.86, w * 0.07);
    ctx.fillStyle = th.lit;
    for (let i = 0; i < 13; i++) { const x = -w * 0.4 + i * (w * 0.8 / 12), r = w * 0.012; ctx.beginPath(); ctx.arc(x, -w * 0.062, r, Math.PI, 0); ctx.lineTo(x + r, -w * 0.04); ctx.lineTo(x - r, -w * 0.04); ctx.closePath(); ctx.fill(); }
    [[0, 0.11, 0.09], [-0.2, 0.075, 0.07], [0.2, 0.075, 0.07], [-0.34, 0.055, 0.05], [0.34, 0.055, 0.05], [-0.42, 0.04, 0.035], [0.42, 0.04, 0.035]].forEach(tw => {
        const x = tw[0] * w, ww = tw[1] * w, hh = tw[2] * w, top = -w * 0.1 - hh;
        ctx.fillStyle = col; ctx.fillRect(x - ww / 2, top, ww, hh);
        ctx.beginPath(); ctx.moveTo(x - ww * 0.62, top); ctx.bezierCurveTo(x - ww * 0.8, top - ww * 0.6, x - ww * 0.22, top - ww * 0.85, x, top - ww * 1.2); ctx.bezierCurveTo(x + ww * 0.22, top - ww * 0.85, x + ww * 0.8, top - ww * 0.6, x + ww * 0.62, top); ctx.closePath(); ctx.fill();
        ctx.fillRect(x - 1, top - ww * 1.2 - w * 0.03, 2, w * 0.03);
        ctx.fillStyle = th.lit; ctx.beginPath(); ctx.arc(x, top + hh * 0.2, ww * 0.14, Math.PI, 0); ctx.lineTo(x + ww * 0.14, top + hh * 0.55); ctx.lineTo(x - ww * 0.14, top + hh * 0.55); ctx.closePath(); ctx.fill();
    });
    ctx.fillStyle = "rgba(255,235,160,.9)";
    for (let i = 0; i <= 40; i++) { ctx.beginPath(); ctx.arc(-w * 0.43 + i * (w * 0.86 / 40), -w * 0.1, 1.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
}

// rainbow "hologram" security strip
function drawHolo(ctx, y, h) {
    const g = ctx.createLinearGradient(0, 0, CARD_W, 0);
    ["#ff9aa2", "#ffd8a8", "#fff3a3", "#b5ead7", "#9ad7ff", "#c7b3ff", "#ff9aa2"].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
    ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, y, CARD_W, h);
    ctx.beginPath(); ctx.rect(0, y, CARD_W, h); ctx.clip(); ctx.fillStyle = "rgba(255,255,255,.45)";
    for (let x = -20; x < CARD_W + 20; x += 44) { ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + 13, y + h); ctx.lineTo(x + 13 + h, y); ctx.lineTo(x + h, y); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    ctx.font = "bold 7px " + FONT; ctx.fillStyle = "rgba(60,20,0,.6)";
    ctx.fillText("AGB  •  MEMBER  •  AGB  •  MEMBER  •  AGB  •  MEMBER  •  AGB", 150, y + h * 0.72);
}

function drawHeader(ctx, logo, th, small) {
    const y = small ? 32 : 42, r = small ? 16 : 22;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
    ctx.fillStyle = across(ctx, th.head, 150 - r, 150 + r); ctx.beginPath(); ctx.arc(150, y, r + 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (logo) { ctx.save(); ctx.beginPath(); ctx.arc(150, y, r, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(logo, 150 - r, y - r, r * 2, r * 2); ctx.restore(); }
    if (small) {
        writeText(ctx, "ಸದಸ್ಯ ಐಡಿ ಕಾರ್ಡ್", 150, 70, 15, th.head[1], true);
        writeText(ctx, "MEMBER ID CARD", 150, 85, 9.5, th.sub, false);
        divider(ctx, th, 95);
    } else {
        ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 4; ctx.shadowOffsetY = 1.5;
        ctx.font = "bold 18px " + FONT; ctx.fillStyle = across(ctx, th.head, 60, 240); ctx.fillText("ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ", 150, 84); ctx.restore();
        writeText(ctx, "AIGIRI GELEYARA BALAGA  •  MYSURU", 150, 99, 8.5, th.sub, true);
        divider(ctx, th, 108);
    }
}

function divider(ctx, th, y) {
    ctx.save(); ctx.strokeStyle = th.line; ctx.lineWidth = 1; ctx.beginPath();
    ctx.moveTo(60, y); ctx.lineTo(132, y); ctx.moveTo(168, y); ctx.lineTo(240, y); ctx.stroke(); ctx.restore();
    star4(ctx, 150, y, 5, th.line);
}

function coverImage(ctx, img, x, y, w, h) {
    const scale = Math.max(w / img.width, h / img.height), sw = w / scale, sh = h / scale;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}

function archPath(ctx, cx, cy, a, bottom) {
    ctx.beginPath(); ctx.moveTo(cx - a, bottom); ctx.lineTo(cx - a, cy); ctx.arc(cx, cy, a, Math.PI, 0); ctx.lineTo(cx + a, bottom); ctx.closePath();
}

// The member's name: one line if it fits, otherwise two lines. Returns true when it used two lines.
function drawNameNew(ctx, name, th) {
    const maxWidth = 252;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 4; ctx.shadowOffsetY = 1.5; ctx.fillStyle = across(ctx, th.head, 40, 260);
    for (let size = 24; size >= 15; size--) {
        ctx.font = "bold " + size + "px " + FONT;
        if (ctx.measureText(name).width <= maxWidth) { ctx.fillText(name, 150, 297); ctx.restore(); return false; }
    }
    ctx.font = "bold 16px " + FONT;
    const words = name.split(" ");
    let bestSplit = 1, bestWidth = Infinity;
    for (let i = 1; i < words.length; i++) {
        const widest = Math.max(ctx.measureText(words.slice(0, i).join(" ")).width, ctx.measureText(words.slice(i).join(" ")).width);
        if (widest < bestWidth) { bestWidth = widest; bestSplit = i; }
    }
    ctx.fillText(words.slice(0, bestSplit).join(" "), 150, 288);
    ctx.fillText(words.slice(bestSplit).join(" "), 150, 308);
    ctx.restore(); return true;
}

function drawRole(ctx, role, top, th) {
    ctx.font = "bold 12px " + FONT;
    const w = Math.min(246, ctx.measureText(role).width + 56), x = 150 - w / 2, h = 22;
    ctx.save(); ctx.fillStyle = across(ctx, th.pill, x, x + w); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2;
    ctx.beginPath(); ctx.moveTo(x - 15, top + 4); ctx.lineTo(x + 12, top + 4); ctx.lineTo(x + 12, top + h + 4); ctx.lineTo(x - 15, top + h + 4); ctx.lineTo(x - 7, top + h / 2 + 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + w + 15, top + 4); ctx.lineTo(x + w - 12, top + 4); ctx.lineTo(x + w - 12, top + h + 4); ctx.lineTo(x + w + 15, top + h + 4); ctx.lineTo(x + w + 7, top + h / 2 + 4); ctx.closePath(); ctx.fill();
    roundedRect(ctx, x, top, w, h, 5); ctx.fill(); ctx.restore();
    writeText(ctx, role, 150, top + 15.5, 12, th.pillText, true);
}

// ===== 3. Front of the card =====
function drawFront(ctx, data, logo, photo, th) {
    drawHeader(ctx, logo, th, false);

    // sunrays behind the photo
    ctx.save(); ctx.translate(150, 196); ctx.fillStyle = th.line; ctx.globalAlpha = 0.14;
    for (let i = 0; i < 24; i++) { ctx.rotate(Math.PI * 2 / 24); if (i % 2) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, -128); ctx.lineTo(7, -128); ctx.closePath(); ctx.fill(); } }
    ctx.restore();

    // photo in a temple arch with a gold frame
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
    ctx.strokeStyle = across(ctx, th.head, 86, 214); ctx.lineWidth = 8; ctx.lineJoin = "round"; archPath(ctx, 150, 182, 60, 262); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.92)"; ctx.lineWidth = 2.4; archPath(ctx, 150, 182, 60, 262); ctx.stroke(); ctx.restore();
    ctx.save(); archPath(ctx, 150, 182, 60, 262); ctx.clip();
    if (photo) coverImage(ctx, photo, 88, 118, 124, 146);
    else {
        const g = ctx.createLinearGradient(0, 118, 0, 264); g.addColorStop(0, th.bg[0]); g.addColorStop(1, th.bg[2]); ctx.fillStyle = g; ctx.fillRect(88, 118, 124, 146);
        ctx.fillStyle = th.line; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(150, 178, 24, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(150, 262, 46, Math.PI, 0); ctx.fill();
    }
    ctx.restore();
    lotusSmall(ctx, 150, 270, 26);

    const twoLines = drawNameNew(ctx, data.name || "—", th);
    drawRole(ctx, data.role || "MEMBER", twoLines ? 322 : 312, th);

    ctx.save(); if ("letterSpacing" in ctx) ctx.letterSpacing = "1.5px";
    writeText(ctx, data.id || "", 150, 366, 22, th.text, true); ctx.restore();
    writeText(ctx, "ಸೇರಿದ ವರ್ಷ / Joined " + (data.year || ""), 150, 384, 11, th.sub, false);

    drawHolo(ctx, 395, 13);
    cardPalace(ctx, th, 474, 290);
}

// ===== 4. Back of the card =====
function drawBack(ctx, data, logo, scale, th) {
    drawHeader(ctx, logo, th, true);

    ctx.save(); if ("letterSpacing" in ctx) ctx.letterSpacing = "1.5px";
    writeText(ctx, data.id || "", 150, 124, 22, th.text, true); ctx.restore();

    [[22, "ರಕ್ತದ ಗುಂಪು / Blood", data.blood || "", 21, "#ff6b6b"], [154, "ಮೊಬೈಲ್ / Phone", data.phone || "", 14, th.text]].forEach(c => {
        ctx.save(); ctx.fillStyle = th.tile; roundedRect(ctx, c[0], 136, 124, 40, 9); ctx.fill(); ctx.strokeStyle = th.line; ctx.globalAlpha = 0.6; ctx.lineWidth = 0.8; ctx.stroke(); ctx.restore();
        writeText(ctx, c[1], c[0] + 62, 149, 8.5, th.sub, false);
        writeText(ctx, c[2], c[0] + 62, 169, c[3], c[4], true);
    });

    // QR code in a white tile with gold corner brackets
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3; ctx.fillStyle = "#ffffff"; roundedRect(ctx, 79, 188, 142, 142, 10); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle = th.line; ctx.lineWidth = 2.2; ctx.lineCap = "round";
    [[84, 193, 1, 1], [216, 193, -1, 1], [84, 325, 1, -1], [216, 325, -1, -1]].forEach(c => { ctx.beginPath(); ctx.moveTo(c[0], c[1] + c[3] * 14); ctx.lineTo(c[0], c[1]); ctx.lineTo(c[0] + c[2] * 14, c[1]); ctx.stroke(); });
    ctx.restore();
    if (data.verifyUrl) {
        const qr = QR.make(data.verifyUrl);
        const module = Math.floor(116 * scale / qr.size) / scale;
        const full = module * qr.size;
        const left = Math.round((150 - full / 2) * scale) / scale;
        const top = Math.round((259 - full / 2) * scale) / scale;
        ctx.fillStyle = "#000000";
        for (let r = 0; r < qr.size; r++) for (let c = 0; c < qr.size; c++) if (qr.modules[r][c]) ctx.fillRect(left + c * module, top + r * module, module, module);
    }
    writeText(ctx, "ಪರಿಶೀಲಿಸಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ / Scan to verify", 150, 346, 9.5, th.sub, false);
    writeText(ctx, "If found, please return to", 150, 364, 9.5, th.sub, false);
    writeText(ctx, "AIGIRI GELEYARA BALAGA, Mysuru", 150, 378, 10.5, th.text, true);
    writeText(ctx, "koushil24.github.io/aigiri-geleyara-balaga", 150, 390, 8, th.head[1], false);

    drawHolo(ctx, 397, 13);
    cardPalace(ctx, th, 474, 290);
}


// ===== 4b. renderCard: draws one side and returns a canvas =====
// side = "front" or "back"; scale = how sharp (3 = about 420 dots per inch)
async function renderCard(side, data, scale) {
    const logo = await loadImage("images/logo.png").catch(() => null);
    const photo = data.photo ? await loadImage(data.photo).catch(() => null) : null;
    const th = cardTheme(data);

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
    cardBackground(ctx, th);

    if (side === "front") drawFront(ctx, data, logo, photo, th);
    else drawBack(ctx, data, logo, scale, th);
    ctx.restore();

    roundedRect(ctx, 0.5, 0.5, CARD_W - 1, CARD_H - 1, 18);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(120,90,30,.6)";
    ctx.stroke();

    return canvas;
}


// ===== 5. Sheets: front + back together, ready to save or print =====
async function makeSheet(kind, data) {
    const front = await renderCard("front", data, 3);
    const back = await renderCard("back", data, 3);

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
