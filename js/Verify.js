// =====================================================
// AIGIRI - Member verification page (opened from the QR code)
// It reads ?id=AGB2025001 from the address, asks our Google
// script about that ID, and shows ONLY name, role and status.
// =====================================================

const $ = (id) => document.getElementById(id);
const t = (key) => translations[currentLanguage][key];

const memberId = (new URLSearchParams(location.search).get("id") || "").trim().toUpperCase();
let result = null;          // what the server answered (so the text can change with the language)

function showResult() {
    const status = $("verifyStatus");

    if (!result) {
        status.textContent = t("vf-checking");
        return;
    }
    if (result.error) {                              // member not found, or a connection problem
        status.textContent = result.notFound ? t("vf-notfound") : t("mb-neterr");
        status.className = "verify-status bad";
        return;
    }

    const member = result.member;
    $("vfId").textContent = member.id;
    $("vfName").textContent = member.name;
    $("vfRole").textContent = member.role;
    $("vfYear").textContent = member.joiningYear;
    $("verifyDetails").hidden = false;

    if (member.status === "Active") {
        status.textContent = t("vf-ok");
        status.className = "verify-status good";
    } else if (member.status === "Pending") {
        status.textContent = t("vf-pending");
        status.className = "verify-status wait";
    } else {
        status.textContent = t("vf-inactive");
        status.className = "verify-status bad";
    }
}

async function checkMember() {
    if (!/^AGB\d{7}$/.test(memberId)) {
        result = { error: true, notFound: true };
        return showResult();
    }
    try {
        const response = await fetch(MEMBER_CONFIG.apiUrl, {
            method: "POST",
            body: JSON.stringify({ action: "verify", id: memberId })
        });
        const answer = JSON.parse(await response.text());
        result = answer.ok ? { member: answer.member } : { error: true, notFound: /No member/.test(answer.error) };
    } catch (error) {
        result = { error: true };
    }
    showResult();
}

langBtn.addEventListener("click", showResult);      // change the sentence when the language changes
checkMember();
