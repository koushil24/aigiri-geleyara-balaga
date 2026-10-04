// =====================================================
// QR CODE MAKER (no outside library needed)
// Makes a QR code for a piece of text, e.g. a web address.
// QR.make("hello") gives { size: 29, modules: [[true,false,...], ...] }
// true = dark square, false = light square.
// It supports short text up to about 100 letters (QR versions 1-6,
// error correction level M = "medium").
// =====================================================
const QR = (function () {

    // ----- 1. Maths used by QR error correction (numbers 0-255) -----
    const EXP = new Array(512);
    const LOG = new Array(256);
    let value = 1;
    for (let i = 0; i < 255; i++) {
        EXP[i] = value;
        LOG[value] = i;
        value <<= 1;
        if (value & 256) value ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];

    function multiply(a, b) {
        return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];
    }

    // The "repair" numbers added after the data, so a damaged code can still be read
    function repairBytes(data, count) {
        let generator = [1];
        for (let i = 0; i < count; i++) {
            const next = new Array(generator.length + 1).fill(0);
            for (let j = 0; j < generator.length; j++) {
                next[j] ^= generator[j];
                next[j + 1] ^= multiply(generator[j], EXP[i]);
            }
            generator = next;
        }

        const result = new Array(count).fill(0);
        for (const byte of data) {
            const factor = byte ^ result[0];
            result.shift();
            result.push(0);
            for (let i = 0; i < count; i++) result[i] ^= multiply(generator[i + 1], factor);
        }
        return result;
    }


    // ----- 2. Sizes of the QR versions we support (level M) -----
    // [total data bytes, repair bytes per block, [[number of blocks, data bytes per block]]]
    const VERSIONS = [
        null,
        [16, 10, [[1, 16]]],
        [28, 16, [[1, 28]]],
        [44, 26, [[1, 44]]],
        [64, 18, [[2, 32]]],
        [86, 24, [[2, 43]]],
        [108, 16, [[4, 27]]]
    ];
    const ALIGNMENT = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34]];


    // ----- 3. Turn the text into data bytes + repair bytes -----
    function buildCodewords(text, version) {
        const bytes = Array.from(new TextEncoder().encode(text));
        const [totalData, repairCount, blockInfo] = VERSIONS[version];

        // bits: mode (0100 = bytes), length, the bytes, end marker, padding
        const bits = [];
        const push = (number, length) => {
            for (let i = length - 1; i >= 0; i--) bits.push((number >> i) & 1);
        };
        push(4, 4);
        push(bytes.length, 8);
        bytes.forEach(b => push(b, 8));
        push(0, Math.min(4, totalData * 8 - bits.length));
        while (bits.length % 8 !== 0) bits.push(0);

        const data = [];
        for (let i = 0; i < bits.length; i += 8) {
            data.push(parseInt(bits.slice(i, i + 8).join(""), 2));
        }
        for (let pad = 0xec; data.length < totalData; pad ^= 0xec ^ 0x11) data.push(pad);

        // split into blocks, add repair bytes to each block
        const blocks = [];
        let position = 0;
        blockInfo.forEach(([count, size]) => {
            for (let i = 0; i < count; i++) {
                const part = data.slice(position, position + size);
                position += size;
                blocks.push({ data: part, repair: repairBytes(part, repairCount) });
            }
        });

        // mix the blocks together (first byte of each block, second byte of each...)
        const result = [];
        const longest = Math.max(...blocks.map(b => b.data.length));
        for (let i = 0; i < longest; i++) blocks.forEach(b => { if (i < b.data.length) result.push(b.data[i]); });
        for (let i = 0; i < repairCount; i++) blocks.forEach(b => result.push(b.repair[i]));
        return result;
    }


    // ----- 4. Draw the squares -----
    const MASKS = [
        (r, c) => (r + c) % 2 === 0,
        (r, c) => r % 2 === 0,
        (r, c) => c % 3 === 0,
        (r, c) => (r + c) % 3 === 0,
        (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
        (r, c) => (r * c) % 2 + (r * c) % 3 === 0,
        (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
        (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0
    ];

    function formatBits(mask) {
        const data = (0 << 3) | mask;                  // 00 = error level M
        let rest = data << 10;
        for (let i = 14; i >= 10; i--) {
            if ((rest >> i) & 1) rest ^= 0x537 << (i - 10);
        }
        return ((data << 10) | rest) ^ 0x5412;
    }

    function drawFormat(modules, size, mask) {
        const bits = formatBits(mask);
        const bit = (i) => ((bits >> i) & 1) === 1;
        for (let i = 0; i <= 5; i++) modules[i][8] = bit(i);
        modules[7][8] = bit(6);
        modules[8][8] = bit(7);
        modules[8][7] = bit(8);
        for (let i = 9; i < 15; i++) modules[8][14 - i] = bit(i);
        for (let i = 0; i < 8; i++) modules[8][size - 1 - i] = bit(i);
        for (let i = 8; i < 15; i++) modules[size - 15 + i][8] = bit(i);
        modules[size - 8][8] = true;                   // the one square that is always dark
    }

    // Score for how "ugly" a pattern is; the best-looking mask is used
    function penalty(modules, size) {
        let score = 0;

        for (let a = 0; a < size; a++) {
            for (const vertical of [false, true]) {
                const line = [];
                for (let b = 0; b < size; b++) line.push(vertical ? modules[b][a] : modules[a][b]);

                let run = 1;
                for (let i = 1; i <= size; i++) {
                    if (i < size && line[i] === line[i - 1]) { run++; continue; }
                    if (run >= 5) score += 3 + (run - 5);
                    run = 1;
                }

                const text = line.map(v => (v ? "1" : "0")).join("");
                const finderA = "10111010000", finderB = "00001011101";
                for (let i = 0; i + 11 <= size; i++) {
                    const part = text.substr(i, 11);
                    if (part === finderA || part === finderB) score += 40;
                }
            }
        }

        for (let r = 0; r < size - 1; r++) {
            for (let c = 0; c < size - 1; c++) {
                const v = modules[r][c];
                if (v === modules[r][c + 1] && v === modules[r + 1][c] && v === modules[r + 1][c + 1]) score += 3;
            }
        }

        let dark = 0;
        modules.forEach(row => row.forEach(v => { if (v) dark++; }));
        score += Math.floor(Math.abs(dark * 100 / (size * size) - 50) / 5) * 10;
        return score;
    }

    function make(text) {
        // pick the smallest version that fits
        const length = new TextEncoder().encode(text).length;
        let version = 0;
        for (let v = 1; v <= 6; v++) {
            if (length <= VERSIONS[v][0] - 2) { version = v; break; }
        }
        if (!version) throw new Error("QR text is too long");

        const size = 17 + 4 * version;
        const modules = Array.from({ length: size }, () => new Array(size).fill(false));
        const fixed = Array.from({ length: size }, () => new Array(size).fill(false));

        const setFixed = (r, c, dark) => { modules[r][c] = dark; fixed[r][c] = true; };

        // three big corner squares + the light border around them
        [[0, 0], [0, size - 7], [size - 7, 0]].forEach(([top, left]) => {
            for (let r = -1; r <= 7; r++) {
                for (let c = -1; c <= 7; c++) {
                    const row = top + r, col = left + c;
                    if (row < 0 || col < 0 || row >= size || col >= size) continue;
                    const dark = r >= 0 && r <= 6 && c >= 0 && c <= 6 &&
                        (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
                    setFixed(row, col, dark);
                }
            }
        });

        // dotted lines between the corners
        for (let i = 8; i < size - 8; i++) {
            setFixed(6, i, i % 2 === 0);
            setFixed(i, 6, i % 2 === 0);
        }

        // small squares for bigger codes
        const spots = ALIGNMENT[version];
        spots.forEach(r => spots.forEach(c => {
            if (fixed[r][c]) return;                   // skip the ones that touch a corner square
            for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                    setFixed(r + dr, c + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
                }
            }
        }));

        // keep room for the format information
        for (let i = 0; i < 9; i++) { fixed[8][i] = true; fixed[i][8] = true; }
        for (let i = 0; i < 8; i++) { fixed[8][size - 1 - i] = true; fixed[size - 1 - i][8] = true; }
        fixed[size - 8][8] = true;

        // place the data, going up and down in two-column strips from the bottom right
        const codewords = buildCodewords(text, version);
        const bits = [];
        codewords.forEach(byte => { for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1); });

        let index = 0;
        let up = true;
        for (let col = size - 1; col > 0; col -= 2) {
            if (col === 6) col--;
            for (let i = 0; i < size; i++) {
                const row = up ? size - 1 - i : i;
                for (let k = 0; k < 2; k++) {
                    const c = col - k;
                    if (!fixed[row][c]) {
                        modules[row][c] = index < bits.length ? bits[index] === 1 : false;
                        index++;
                    }
                }
            }
            up = !up;
        }

        // try all 8 patterns, keep the best one
        let best = null;
        let bestScore = Infinity;
        for (let mask = 0; mask < 8; mask++) {
            const trial = modules.map(row => row.slice());
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (!fixed[r][c] && MASKS[mask](r, c)) trial[r][c] = !trial[r][c];
                }
            }
            drawFormat(trial, size, mask);
            const score = penalty(trial, size);
            if (score < bestScore) { bestScore = score; best = trial; }
        }

        return { size: size, modules: best };
    }

    return { make: make };
})();
             
