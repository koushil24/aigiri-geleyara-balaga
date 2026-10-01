// =====================================================
// AIGIRI MEMBER PORTAL - password gate (version 1)
// 1 Helpers  2 Which screen to show  3 Unlock  4 Setup helper
// =====================================================


// ===== 1. Helpers =====
const memberGate = document.getElementById("memberGate");
const memberTool = document.getElementById("memberTool");
const memberSetup = document.getElementById("memberSetup");

// Turns any text into a scrambled code (SHA-256). The same text always gives the same code.
async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const buffer = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Shows one of the three boxes and hides the others
function showBox(box) {
    [memberGate, memberTool, memberSetup].forEach(b => { b.hidden = (b !== box); });
}


// ===== 2. Which screen to show =====
const passwordIsSet = MEMBER_CONFIG.passwordHash !== "";
const wantsSetup = location.search.indexOf("setup") !== -1;

if (wantsSetup || !passwordIsSet) {
    showBox(memberSetup);
} else if (sessionStorage.getItem("agbMember") === "yes") {
    showBox(memberTool);          // already unlocked in this browser tab
} else {
    showBox(memberGate);
}


// ===== 3. Unlock / lock =====
document.getElementById("memberForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const typed = document.getElementById("memberPass").value.trim();
    const code = await sha256(typed);

    if (code === MEMBER_CONFIG.passwordHash) {
        sessionStorage.setItem("agbMember", "yes");   // remembered until the tab is closed
        document.getElementById("memberError").hidden = true;
        showBox(memberTool);
    } else {
        document.getElementById("memberError").hidden = false;
    }
});

document.getElementById("memberLock").addEventListener("click", () => {
    sessionStorage.removeItem("agbMember");
    document.getElementById("memberPass").value = "";
    showBox(memberGate);
});


// ===== 4. Setup helper (member.html?setup) =====
const setupPass = document.getElementById("setupPass");
const setupHash = document.getElementById("setupHash");

setupPass.addEventListener("input", async () => {
    const typed = setupPass.value.trim();
    setupHash.textContent = typed ? await sha256(typed) : "…";
});

document.getElementById("setupCopy").addEventListener("click", () => {
    const code = setupHash.textContent;
    if (code.length > 10) navigator.clipboard.writeText(code);
});
