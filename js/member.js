// =====================================================
// AIGIRI MEMBER PORTAL - Log in / Sign up / ID card
// 1 Helpers  2 Card design  3 Photo  4 Screens  5 Sign up
// 6 Log in   7 Download / Print   8 Log out   8 PNG / PDF / Print
// =====================================================


// ===== 1. Helpers =====
const $ = (id) => document.getElementById(id);

// Gets a text in the language the visitor chose (kn / en)
const t = (key) => translations[currentLanguage][key];

// Are the card files here? (qr.js and card.js must be uploaded into the js folder)
const cardFilesOk = typeof QR !== "undefined" && typeof renderCard === "function" && typeof downloadPng === "function";

// Sends a request to our Google Apps Script and returns its answer
async function callApi(data) {
    if (!MEMBER_CONFIG.apiUrl) {
        throw new Error("apiUrl is missing in js/member-config.js");
    }

    const response = await fetch(MEMBER_CONFIG.apiUrl, {
        method: "POST",
        body: JSON.stringify(data)
    });

    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (error) {
        throw new Error("The server did not send data. Check that the web app is deployed with access: Anyone.");
    }
}

// The "could not connect" sentence. Add ?debug to the page address to also see the technical reason.
function connectionMessage(error) {
    const debug = location.search.indexOf("debug") !== -1;
    return t("mb-neterr") + (debug ? "  [" + error.message + "]" : "");
}

function showMessage(box, text) {
    box.textContent = text;
    box.hidden = (text === "");
}


// ===== 2. Card pictures =====
// The card is drawn by card.js on a canvas. paint() puts the drawing into a box.
async function paint(box, side, data, scale) {
    if (typeof renderCard !== "function") {          // card.js did not load (file missing on the website)
        box.style.cssText = "padding:24px;text-align:center;font-weight:bold;color:#c62828;background:#fff";
        box.textContent = "js/card.js is missing on the website. Please upload it into the js folder.";
        return;
    }
    if (!cardFilesOk) {
        box.innerHTML = '<p class="member-error" style="padding:24px">⚠️ js/card.js or js/qr.js is missing on the website. Open check.html to see which file.</p>';
        return;
    }
    const canvas = await renderCard(side, data, scale);
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "AGB ID card " + side);
    box.replaceChildren(canvas);
}

// ===== 3. Photo: shrink it so it fits in one spreadsheet cell =====
let photoData = "";

function shrinkPhoto(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            URL.revokeObjectURL(url);
            const side = Math.min(img.width, img.height);
            const x = (img.width - side) / 2;
            const y = (img.height - side) * 0.3;       // keep a little more of the top (faces)

            // try bigger first, then smaller until the picture is small enough
            for (const size of [300, 240, 200]) {
                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = size;
                canvas.getContext("2d").drawImage(img, x, y, side, side, 0, 0, size, size);

                for (const quality of [0.75, 0.6, 0.45]) {
                    const result = canvas.toDataURL("image/jpeg", quality);
                    if (result.length <= 40000) return resolve(result);
                }
            }
            reject(new Error("too big"));
        };

        img.onerror = () => reject(new Error("not a picture"));
        img.src = url;
    });
}


// ===== 4. Screens =====
const KEY = "agbMemberData";      // remembers the logged-in member until the tab is closed
let shownMember = null;
let shownIsNew = false;

function showTab(tab) {
    $("loginForm").hidden = (tab !== "login");
    $("signupArea").hidden = (tab !== "signup");
    $("tabLogin").classList.toggle("active", tab === "login");
    $("tabSignup").classList.toggle("active", tab === "signup");
}

function writeNotice() {
    if (!shownMember) return;
    const status = shownMember.status === "Active" ? t("mb-active") : t("mb-pending");
    const intro = shownIsNew ? t("mb-new").replace("{id}", shownMember.id) : t("mb-welcome");
    $("cardNotice").textContent = intro + " " + status;
}

let cardData = null;          // the details used for the card, PNG, PDF and print

function showCard(member, isNew) {
    shownMember = member;
    shownIsNew = isNew;

    cardData = {
        id: member.id, name: member.name, role: member.role.toUpperCase(),
        year: member.joiningYear, photo: member.photo,
        blood: member.bloodGroup, phone: member.phone,
        verifyUrl: new URL("verify.html?id=" + member.id, location.href).href   // the QR code opens this page
    };
    paint($("cardFront"), "front", cardData, 3);
    paint($("cardBack"), "back", cardData, 3);
    writeNotice();

    $("memberAuth").hidden = true;
    $("memberCard").hidden = false;
    window.scrollTo({ top: 0 });
}

function showAuth() {
    $("memberCard").hidden = true;
    $("memberAuth").hidden = false;
    showTab("login");
}

$("tabLogin").addEventListener("click", () => showTab("login"));
$("tabSignup").addEventListener("click", () => showTab("signup"));
langBtn.addEventListener("click", writeNotice);     // change the sentence when the language changes


// ===== 5. Sign up =====
// Joining year list: 2025 up to the current year
const yearList = $("suYear");
for (let y = 2025; y <= new Date().getFullYear(); y++) {
    const option = document.createElement("option");
    option.value = option.textContent = y;
    yearList.appendChild(option);
}

// Live preview: the card updates while the form is being filled
function updatePreview() {
    const year = $("suYear").value;
    paint($("previewCard"), "front", {
        id: "AGB" + (year || "20XX") + "###",
        name: $("suName").value.trim() || "—",
        role: "MEMBER",
        year: year || "—",
        photo: photoData
    }, 2);
}

["suName", "suYear"].forEach(id => $(id).addEventListener("input", updatePreview));
updatePreview();

$("suPhoto").addEventListener("change", async () => {
    const file = $("suPhoto").files[0];
    photoData = "";
    if (file) {
        try {
            photoData = await shrinkPhoto(file);
        } catch (error) {
            showMessage($("signupMsg"), t("mb-v-photo"));
        }
    }
    updatePreview();
});

function cleanPhone(value) {
    return value.replace(/[\s+\-]/g, "").replace(/^91(?=\d{10}$)/, "");
}

// Checks the form; returns a message if something is wrong, or "" if all is fine
function signupProblem() {
    if (!/^[\p{L}\p{M} .'-]{2,60}$/u.test($("suName").value.trim())) return t("mb-v-name");
    if (!/^[6-9]\d{9}$/.test(cleanPhone($("suPhone").value))) return t("mb-v-phone");
    if (!$("suBlood").value) return t("mb-v-blood");
    if (!$("suYear").value) return t("mb-v-year");
    if (!photoData) return t("mb-v-photo");
    if (!/^\d{4,6}$/.test($("suPin").value)) return t("mb-v-pin");
    if ($("suPin").value !== $("suPin2").value) return t("mb-v-pin2");
    if (!$("suConsent").checked) return t("mb-v-consent");
    return "";
}

$("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const problem = signupProblem();
    showMessage($("signupMsg"), problem);
    if (problem) return;

    $("signupBtn").disabled = true;
    $("signupBtn").textContent = t("mb-wait");

    try {
        const answer = await callApi({
            action: "signup",
            name: $("suName").value.trim(),
            phone: cleanPhone($("suPhone").value),
            bloodGroup: $("suBlood").value,
            joiningYear: Number($("suYear").value),
            photo: photoData,
            pin: $("suPin").value,
            consent: true
        });

        if (answer.ok) {
            sessionStorage.setItem(KEY, JSON.stringify(answer.member));
            $("signupForm").reset();
            photoData = "";
            updatePreview();
            showCard(answer.member, true);
        } else {
            showMessage($("signupMsg"), answer.error);
        }
    } catch (error) {
        showMessage($("signupMsg"), connectionMessage(error));
    }

    $("signupBtn").disabled = false;
    $("signupBtn").textContent = t("mb-signup-btn");
});


// ===== 6. Log in =====
$("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = $("loginId").value.trim().toUpperCase();
    const password = $("loginPass").value;

    if (!id || !password) {
        showMessage($("loginMsg"), t("mb-v-login"));
        return;
    }
    showMessage($("loginMsg"), "");

    $("loginBtn").disabled = true;
    $("loginBtn").textContent = t("mb-wait");

    try {
        const answer = await callApi({ action: "login", id: id, password: password });

        if (answer.ok) {
            sessionStorage.setItem(KEY, JSON.stringify(answer.member));
            $("loginPass").value = "";
            showCard(answer.member, false);
        } else {
            showMessage($("loginMsg"), answer.error);
        }
    } catch (error) {
        showMessage($("loginMsg"), connectionMessage(error));
    }

    $("loginBtn").disabled = false;
    $("loginBtn").textContent = t("mb-login-btn");
});


// ===== 7. Download PNG / PDF / Print =====
// Shows "Preparing..." on the button while the file is being made
function wireButton(buttonId, labelKey, action) {
    const button = $(buttonId);
    button.addEventListener("click", async () => {
        if (!cardData) return;
        button.disabled = true;
        button.textContent = t("mb-wait");
        try {
            await action(cardData);
        } catch (error) {
            alert("Sorry, this did not work: " + error.message);
        }
        button.disabled = false;
        button.textContent = t(labelKey);
    });
}

if (cardFilesOk) {
    wireButton("pngBtn", "mb-dl-png", (data) => downloadPng(data));
    wireButton("pdfBtn", "mb-dl-pdf", (data) => downloadPdf(data));
    wireButton("printBtn", "mb-print", (data) => printCard(data));
} else {
    document.querySelector(".dl-row").hidden = true;      // no card files, so no download buttons
}


// ===== 8. Log out, and open the card again after a page reload =====
$("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(KEY);
    shownMember = null;
    showAuth();
});

const saved = sessionStorage.getItem(KEY);
if (saved) {
    showCard(JSON.parse(saved), false);
} else {
    showAuth();
}
