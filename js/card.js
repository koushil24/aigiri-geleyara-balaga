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


// ===== 2. Card looks: bold modern design (4 colours) =====
// maroon = AGB colours, teal, red and charcoal are the other choices
const CARD_THEMES = {
    maroon:   { base: "#7b1620", dark: "#4a0a10", accent: "#ffc700", accentText: "#3a0a10", nameText: "#7b1620", big: "#ffffff", line: "#ffffff" },
    teal:     { base: "#2a8f94", dark: "#17626a", accent: "#ffd23f", accentText: "#0f4147", nameText: "#17626a", big: "#ffffff", line: "#ffffff" },
    red:      { base: "#d41f1f", dark: "#8e0b0b", accent: "#ffd400", accentText: "#5a0000", nameText: "#b01010", big: "#ffffff", line: "#ffffff" },
    charcoal: { base: "#2b2b2e", dark: "#151517", accent: "#e9dcc2", accentText: "#1c1c1e", nameText: "#1c1c1e", big: "#e9dcc2", line: "#e9dcc2" }
};

function cardTheme(data) {
    let name = data.design;
    if (!name) { try { name = localStorage.getItem("agbCardDesign"); } catch (e) { name = null; } }
    return CARD_THEMES[name] || CARD_THEMES.maroon;
}

function coverImage(ctx, img, x, y, w, h) {
    const scale = Math.max(w / img.width, h / img.height), sw = w / scale, sh = h / scale;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}

// small capital label with a little letter spacing
function tag(ctx, text, x, y, size, color, align) {
    ctx.save(); if ("letterSpacing" in ctx) ctx.letterSpacing = "1px";
    ctx.textAlign = align || "center"; writeText(ctx, text, x, y, size, color, true); ctx.restore();
}

// thin wavy "map contour" lines: the modern background pattern
function contours(ctx, th, h) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, CARD_W, h); ctx.clip();
    ctx.strokeStyle = th.line; ctx.globalAlpha = 0.14; ctx.lineWidth = 0.9;
    [[225, 120, 1], [30, 330, 2]].forEach(c => {
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
}

function slant(ctx, x, y, w, h, skew, fill) {
    ctx.beginPath(); ctx.moveTo(x + skew, y); ctx.lineTo(x + w + skew, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
}

// repeating text band at the bottom
function strip(ctx, th, y) {
    const h = CARD_H - y;
    ctx.save(); ctx.fillStyle = th.dark; ctx.fillRect(0, y, CARD_W, h); ctx.fillStyle = th.accent; ctx.fillRect(0, y, CARD_W, 2.5);
    ctx.font = "bold 7.5px " + FONT; ctx.fillStyle = th.line; ctx.globalAlpha = 0.85; ctx.textAlign = "left";
    const t = "FRIENDSHIP  •  CULTURE  •  SERVICE  •  "; let x = -8;
    while (x < CARD_W) { ctx.fillText(t, x, y + h / 2 + 4); x += ctx.measureText(t).width; }
    ctx.restore();
}

function lanyardSlot(ctx) {
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,.38)"; roundedRect(ctx, 131, 9, 38, 7, 3.5); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 0.8; roundedRect(ctx, 131, 9, 38, 7, 3.5); ctx.stroke(); ctx.restore();
}

function topBar(ctx, logo, th) {
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2; ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(38, 40, 22, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (logo) { ctx.save(); ctx.beginPath(); ctx.arc(38, 40, 19, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(logo, 19, 21, 38, 38); ctx.restore(); }
    ctx.save(); ctx.textAlign = "left"; ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 4; ctx.shadowOffsetY = 1.5;
    writeText(ctx, "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ", 66, 38, 15, "#ffffff", true); ctx.restore();
    tag(ctx, "AIGIRI GELEYARA BALAGA  •  MYSURU", 66, 52, 6.6, th.accent, "left");
}

function iconPhone(ctx, x, y, c) { ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 1.5; roundedRect(ctx, x - 4, y - 7, 8, 14, 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y + 4, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
function iconDrop(ctx, x, y, c) { ctx.save(); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.bezierCurveTo(x + 7, y, x + 6, y + 7, x, y + 7); ctx.bezierCurveTo(x - 6, y + 7, x - 7, y, x, y - 8); ctx.fill(); ctx.restore(); }
function iconInsta(ctx, x, y, c) { ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 1.5; roundedRect(ctx, x - 7, y - 7, 14, 14, 4); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 4.2, y - 4.2, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }

// ===== 3. Front of the card =====
function drawFront(ctx, data, logo, photo, th) {
    ctx.fillStyle = th.base; ctx.fillRect(0, 0, CARD_W, CARD_H);
    const shade = ctx.createLinearGradient(0, 0, 0, CARD_H); shade.addColorStop(0, "rgba(255,255,255,.07)"); shade.addColorStop(1, "rgba(0,0,0,.28)");
    ctx.fillStyle = shade; ctx.fillRect(0, 0, CARD_W, CARD_H);
    contours(ctx, th, CARD_H);
    topBar(ctx, logo, th);
    lanyardSlot(ctx);
    // "MEMBER" tag top right
    ctx.fillStyle = th.accent; roundedRect(ctx, 224, 58, 62, 17, 8.5); ctx.fill(); tag(ctx, "MEMBER", 255, 70, 7.8, th.accentText);

    // giant AGB letters behind the photo
    let size = 150; ctx.font = "900 " + size + "px " + FONT;
    while (size > 40 && ctx.measureText("AGB").width > 240) { size -= 2; ctx.font = "900 " + size + "px " + FONT; }
    ctx.save(); ctx.textAlign = "left"; ctx.fillStyle = th.big; ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
    ctx.fillText("AGB", 24, 168); ctx.restore();

    // photo card, slightly tilted, with a white border
    ctx.save(); ctx.translate(150, 262); ctx.rotate(-0.03);
    ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.fillStyle = "#ffffff"; roundedRect(ctx, -126, -100, 252, 200, 20); ctx.fill(); ctx.shadowColor = "transparent";
    ctx.save(); roundedRect(ctx, -121, -95, 242, 190, 16); ctx.clip();
    if (photo) coverImage(ctx, photo, -121, -95, 242, 190);
    else {
        const g = ctx.createLinearGradient(0, -95, 0, 95); g.addColorStop(0, th.base); g.addColorStop(1, th.dark); ctx.fillStyle = g; ctx.fillRect(-121, -95, 242, 190);
        ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.arc(0, -22, 34, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(0, 95, 70, Math.PI, 0); ctx.fill();
    }
    ctx.restore(); ctx.restore();

    // slanted name label (white) and role label (accent)
    const name = (data.name || "—").toUpperCase();
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4; slant(ctx, 14, 342, 262, 48, 12, "#ffffff"); ctx.restore();
    ctx.fillStyle = th.nameText; let fitted = false;
    for (let s = 25; s >= 15; s--) { ctx.font = "900 " + s + "px " + FONT; if (ctx.measureText(name).width <= 236) { ctx.fillText(name, 151, 372 + (s > 21 ? 3 : 0)); fitted = true; break; } }
    if (!fitted) {
        ctx.font = "900 15px " + FONT; const words = name.split(" "); let best = 1, bw = Infinity;
        for (let i = 1; i < words.length; i++) { const w = Math.max(ctx.measureText(words.slice(0, i).join(" ")).width, ctx.measureText(words.slice(i).join(" ")).width); if (w < bw) { bw = w; best = i; } }
        ctx.fillText(words.slice(0, best).join(" "), 151, 363); ctx.fillText(words.slice(best).join(" "), 151, 381);
    }
    const role = (data.role || "MEMBER").toUpperCase();
    let rs = 10.5; ctx.font = "900 " + rs + "px " + FONT; while (rs > 7.5 && ctx.measureText(role).width > 230) { rs -= 0.5; ctx.font = "900 " + rs + "px " + FONT; }
    const rw = Math.min(262, ctx.measureText(role).width + 34);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2; slant(ctx, 150 - rw / 2 - 5, 392, rw, 22, 10, th.accent); ctx.restore();
    writeText(ctx, role, 150, 407, rs, th.accentText, true);

    // three details in a row
    [[56, "ID", data.id || ""], [150, "JOINED", String(data.year || "")], [244, "BLOOD", data.blood || "—"]].forEach((c, i) => {
        tag(ctx, c[1], c[0], 427, 6.4, "rgba(255,255,255,.7)"); writeText(ctx, c[2], c[0], 442, i === 0 ? 11 : 13, "#ffffff", true);
    });
    ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.lineWidth = 0.8; [[103, 421, 103, 444], [197, 421, 197, 444]].forEach(l => { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke(); }); ctx.restore();

    strip(ctx, th, 452);
}

// ===== 4. Back of the card =====
function drawBack(ctx, data, logo, scale, th) {
    // colour on top, white below with a slanted edge
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, CARD_W, CARD_H);
    ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(CARD_W, 0); ctx.lineTo(CARD_W, 236); ctx.lineTo(0, 262); ctx.closePath(); ctx.clip();
    ctx.fillStyle = th.base; ctx.fillRect(0, 0, CARD_W, 270);
    const shade = ctx.createLinearGradient(0, 0, 0, 270); shade.addColorStop(0, "rgba(255,255,255,.07)"); shade.addColorStop(1, "rgba(0,0,0,.25)"); ctx.fillStyle = shade; ctx.fillRect(0, 0, CARD_W, 270);
    contours(ctx, th, 270); ctx.restore();
    topBar(ctx, logo, th); lanyardSlot(ctx);

    // big title
    ctx.save(); ctx.fillStyle = th.big; ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
    ctx.font = "900 40px " + FONT; ctx.fillText("SCAN TO", 150, 106);
    let s = 62; ctx.font = "900 " + s + "px " + FONT; while (s > 30 && ctx.measureText("VERIFY").width > 236) { s -= 2; ctx.font = "900 " + s + "px " + FONT; }
    ctx.fillText("VERIFY", 150, 106 + s * 0.82); ctx.restore();

    // QR tile
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.fillStyle = "#ffffff"; roundedRect(ctx, 64, 176, 172, 188, 16); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle = th.base; ctx.lineWidth = 2.4; ctx.lineCap = "round";
    [[74, 186, 1, 1], [226, 186, -1, 1]].forEach(c => { ctx.beginPath(); ctx.moveTo(c[0], c[1] + 14); ctx.lineTo(c[0], c[1]); ctx.lineTo(c[0] + c[2] * 14, c[1]); ctx.stroke(); }); ctx.restore();
    if (data.verifyUrl) {
        const qr = QR.make(data.verifyUrl);
        const module = Math.floor(132 * scale / qr.size) / scale, full = module * qr.size;
        const left = Math.round((150 - full / 2) * scale) / scale, top = Math.round((260 - full / 2) * scale) / scale;
        ctx.fillStyle = "#000000";
        for (let r = 0; r < qr.size; r++) for (let c = 0; c < qr.size; c++) if (qr.modules[r][c]) ctx.fillRect(left + c * module, top + r * module, module, module);
    }
    tag(ctx, data.id || "", 150, 348, 13, th.nameText);

    // contact rows
    ctx.textAlign = "left";
    const rows = [[385, iconPhone, data.phone || "—"], [405, iconDrop, "Blood group  " + (data.blood || "—")], [425, iconInsta, "@aigiri2025"]];
    rows.forEach(r => { r[1](ctx, 84, r[0] - 4, th.base); writeText(ctx, r[2], 100, r[0], 11, "#222222", true); });
    ctx.textAlign = "center";
    writeText(ctx, "If found, please return to AGB, Mysuru", 150, 444, 7.6, "#777777", false);

    strip(ctx, th, 452);
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
    if (side === "front") drawFront(ctx, data, logo, photo, th);
    else drawBack(ctx, data, logo, scale, th);
    ctx.restore();

    roundedRect(ctx, 0.5, 0.5, CARD_W - 1, CARD_H - 1, 18);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,.25)";
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
