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


// ===== 2. Front of the card =====
function drawFront(ctx, data, logo, photo) {
    drawBand(ctx, logo, 150, 38, 26, 82, true);

    // photo in a gold ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 186, 59, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "#ece4d3";
    ctx.fillRect(91, 127, 118, 118);
    if (photo) {
        ctx.drawImage(photo, 91, 127, 118, 118);
    } else {
        ctx.font = "50px " + FONT;
        ctx.fillText("👤", 150, 204);
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 186, 57, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FFD700";
    ctx.stroke();

    drawName(ctx, data.name || "—");

    // role in a gold pill
    const role = data.role || "MEMBER";
    ctx.font = "bold 13px " + FONT;
    const pillWidth = Math.min(250, ctx.measureText(role).width + 40);
    ctx.fillStyle = "#FFD700";
    roundedRect(ctx, 150 - pillWidth / 2, 292, pillWidth, 22, 11);
    ctx.fill();
    writeText(ctx, role, 150, 308, 13, "#6d0f0f", true);

    writeText(ctx, data.id || "", 150, 352, 23, "#222222", true);
    writeText(ctx, "ಸೇರಿದ ವರ್ಷ / Joined " + (data.year || ""), 150, 376, 13, "#555555", false);

    drawStrip(ctx);
}


// ===== 3. Back of the card =====
function drawBack(ctx, data, logo, scale) {
    drawBand(ctx, logo, 76, 22, 16, 56, false);

    writeText(ctx, "ಸದಸ್ಯ ಐಡಿ / Member ID", 150, 98, 11, "#777777", false);
    writeText(ctx, data.id || "", 150, 122, 20, "#222222", true);

    ctx.strokeStyle = "#c9b98f";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(24, 133);
    ctx.lineTo(276, 133);
    ctx.stroke();
    ctx.setLineDash([]);

    writeText(ctx, "ರಕ್ತದ ಗುಂಪು / Blood", 88, 153, 11, "#777777", false);
    writeText(ctx, data.blood || "", 88, 184, 26, "#b00020", true);
    writeText(ctx, "ಮೊಬೈಲ್ / Phone", 212, 153, 11, "#777777", false);
    writeText(ctx, data.phone || "", 212, 180, 16, "#222222", true);

    // QR code inside a white tile
    ctx.fillStyle = "#ffffff";
    roundedRect(ctx, 84, 198, 132, 132, 8);
    ctx.fill();
    ctx.strokeStyle = "#d9cdb4";
    ctx.stroke();

    if (data.verifyUrl) {
        const qr = QR.make(data.verifyUrl);
        const module = Math.floor(116 * scale / qr.size) / scale;      // whole pixels = sharp squares
        const full = module * qr.size;
        const left = Math.round((150 - full / 2) * scale) / scale;
        const top = Math.round((264 - full / 2) * scale) / scale;

        ctx.fillStyle = "#000000";
        for (let r = 0; r < qr.size; r++) {
            for (let c = 0; c < qr.size; c++) {
                if (qr.modules[r][c]) ctx.fillRect(left + c * module, top + r * module, module, module);
            }
        }
    }
    writeText(ctx, "ಪರಿಶೀಲಿಸಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ / Scan to verify", 150, 347, 10, "#555555", false);

    writeText(ctx, "If found, please return to", 150, 382, 11, "#444444", false);
    writeText(ctx, "AIGIRI GELEYARA BALAGA, Mysuru", 150, 397, 11, "#444444", false);
    writeText(ctx, "koushil24.github.io/aigiri-geleyara-balaga", 150, 412, 9.5, "#6d0f0f", false);

    drawStrip(ctx);
}


// ===== 4. renderCard: draws one side and returns a canvas =====
// side = "front" or "back"; scale = how sharp (3 = about 420 dots per inch)
async function renderCard(side, data, scale) {
    const logo = await loadImage("images/logo.png").catch(() => null);
    const photo = data.photo ? await loadImage(data.photo).catch(() => null) : null;

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
    ctx.fillStyle = side === "front" ? "#ffffff" : "#faf6ef";
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    if (side === "front") drawFront(ctx, data, logo, photo);
    else drawBack(ctx, data, logo, scale);
    ctx.restore();

    roundedRect(ctx, 0.5, 0.5, CARD_W - 1, CARD_H - 1, 18);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#d9cdb4";
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
