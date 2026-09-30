// =====================================================
// AIGIRI GELEYARA BALAGA - Main script
// 1 Theme  2 Language  3 Menu  4 Scroll  5 Team
// 6 Loader  7 Slider  8 Countdown
// =====================================================


// ===== 1. Theme (light / dark) =====
const themeBtn = document.getElementById("themeBtn");
const body = document.body;

function applyTheme(dark) {
    body.classList.toggle("dark-mode", dark);
    themeBtn.textContent = dark ? "☀️" : "🌙";
    localStorage.setItem("theme", dark ? "dark" : "light");
}

applyTheme(localStorage.getItem("theme") === "dark");

themeBtn.addEventListener("click", () => {
    applyTheme(!body.classList.contains("dark-mode"));
});


// ===== 2. Language (Kannada / English) =====
// Every element with data-i18n="key" is translated using the text below.
// To change any text on the website, edit it here (both kn and en).
const translations = {
    "kn": {
        "nav-home": "ಮುಖಪುಟ",
        "nav-about": "ನಮ್ಮ ಬಗ್ಗೆ",
        "nav-events": "ಕಾರ್ಯಕ್ರಮಗಳು",
        "nav-team": "AGB ತಂಡ",
        "nav-gallery": "ಗ್ಯಾಲರಿ",
        "nav-sponsor": "ಬೆಂಬಲ",
        "nav-contact": "ಸಂಪರ್ಕಿಸಿ",
        "hero-title": "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ",
        "hero-city": "ಮೈಸೂರು",
        "hero-tagline": "ಸೇವೆ • ಸ್ನೇಹ • ಸಂಸ್ಕೃತಿ",
        "btn-events": "ಕಾರ್ಯಕ್ರಮಗಳು",
        "connect": "ನಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ",
        "insta-follow": "Instagram ನಲ್ಲಿ ಫಾಲೋ ಮಾಡಿ",
        "threads-official": "ಅಧಿಕೃತ ಪುಟ",
        "slide-title": "ಗಣೇಶೋತ್ಸವ 2025",
        "slide-sub": "ಏಕತೆ • ಭಕ್ತಿ • ಸ್ನೇಹದ ನೆನಪುಗಳು",
        "upcoming-title": "✨ ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು ✨",
        "past-title": "🕰️ ಹಿಂದಿನ ಕಾರ್ಯಕ್ರಮಗಳು",
        "t-ashada": "🪔 ಆಷಾಢ ಶುಕ್ರವಾರ ಪೂಜಾ ಮಹೋತ್ಸವ",
        "t-ganesh": "🐘 ಗಣೇಶೋತ್ಸವ",
        "d-ashada27": "📅 30 ಜುಲೈ 2027",
        "d-ganesh27": "📅 04 ಸೆಪ್ಟೆಂಬರ್ 2027",
        "cd-days": "ದಿನ",
        "cd-hours": "ಗಂಟೆ",
        "cd-mins": "ನಿಮಿಷ",
        "cd-secs": "ಸೆಕೆಂಡ್",
        "cd-live": "🙏 ಕಾರ್ಯಕ್ರಮ ಪ್ರಾರಂಭವಾಗಿದೆ",
        "watch": "▶ Instagram ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ",
        "about-title": "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗದ ಬಗ್ಗೆ",
        "about-sub": "ಸ್ನೇಹ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಏಕತೆಯ ಮೂಲಕ ಸಮಾಜ ಸೇವೆ",
        "about-p1": "<strong>ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ (AGB), ಮೈಸೂರು</strong> ಸ್ನೇಹ, ಸಂಸ್ಕೃತಿ, ಆಧ್ಯಾತ್ಮಿಕತೆ ಮತ್ತು ಸಮಾಜ ಸೇವೆಯ ಮೂಲಕ ಜನರನ್ನು ಒಟ್ಟುಗೂಡಿಸುವ ಉದ್ದೇಶದಿಂದ <strong>2025</strong>ರಲ್ಲಿ ಸ್ಥಾಪಿತವಾದ ಯುವಕರ ಸಮುದಾಯ ಸಂಘಟನೆಯಾಗಿದೆ.",
        "about-p2": "ಸ್ಥಾಪನೆಯಾದಾಗಿನಿಂದ AGB ಧಾರ್ಮಿಕ ಆಚರಣೆಗಳು, ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು, ಸಾಮಾಜಿಕ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಸಮುದಾಯ ಸೇವಾ ಕಾರ್ಯಗಳನ್ನು ಸಕ್ರಿಯವಾಗಿ ಆಯೋಜಿಸುತ್ತಾ, ಯುವಕರು ಮತ್ತು ಸಮಾಜದಲ್ಲಿ ಏಕತೆ ಹಾಗೂ ಉತ್ತಮ ಮೌಲ್ಯಗಳನ್ನು ಬೆಳೆಸುತ್ತಿದೆ.",
        "about-p3": "ನಮ್ಮ ಪ್ರಮುಖ ಆಚರಣೆಗಳಲ್ಲಿ <strong>ಗಣೇಶೋತ್ಸವ</strong>, <strong>ಆಷಾಢ ಶುಕ್ರವಾರ ಪೂಜಾ ಮಹೋತ್ಸವ</strong> ಮತ್ತು ಸಮಾಜ ಸೇವೆ, ಸಂಪ್ರದಾಯ ಸಂರಕ್ಷಣೆ ಹಾಗೂ ಸ್ವಯಂಸೇವೆಯನ್ನು ಪ್ರೋತ್ಸಾಹಿಸುವ ಮುಂದಿನ ಹಲವು ಉಪಕ್ರಮಗಳು ಸೇರಿವೆ.",
        "about-p4": "ನಿಜವಾದ ಸ್ನೇಹವು ಸೇವೆ, ಗೌರವ, ನಾಯಕತ್ವ ಮತ್ತು ಸಾಮೂಹಿಕ ಜವಾಬ್ದಾರಿಗೆ ಪ್ರೇರಣೆ ನೀಡಿದಾಗ ಅರ್ಥಪೂರ್ಣವಾಗುತ್ತದೆ ಎಂದು ನಾವು ನಂಬುತ್ತೇವೆ. AGB ಯ ಪ್ರತಿಯೊಬ್ಬ ಸದಸ್ಯರೂ ಬಲಿಷ್ಠ, ಒಗ್ಗೂಡಿದ ಮತ್ತು ಕರುಣಾಮಯಿ ಸಮುದಾಯವನ್ನು ಕಟ್ಟುವಲ್ಲಿ ಕೊಡುಗೆ ನೀಡುತ್ತಾರೆ.",
        "motto-title": "<strong>ನಮ್ಮ ಧ್ಯೇಯ:</strong>",
        "motto-1": "🟡 ಸೇವೆ • ಸ್ನೇಹ • ಸಂಸ್ಕೃತಿ",
        "motto-2": "🙏 ಒಟ್ಟಾಗಿ ಬೆಳೆಯೋಣ, ಒಟ್ಟಾಗಿ ಸೇವೆ ಮಾಡೋಣ.",
        "team-title": "👥 AGB ತಂಡ",
        "team-subtitle": "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗದ ಸದಸ್ಯರು",
        "gallery-title": "📸 ಗ್ಯಾಲರಿ",
        "gallery-subtitle": "ನಮ್ಮ ಕಾರ್ಯಕ್ರಮಗಳ ನೆನಪುಗಳು",
        "g-ashada": "🪔 ಆಷಾಢ ಪೂಜಾ",
        "g-ganesh": "🐘 ಗಣೇಶೋತ್ಸವ",
        "sponsor-title": "🤝 ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗವನ್ನು ಬೆಂಬಲಿಸಿ",
        "sponsor-sub": "ನಮ್ಮ ಸಾಂಸ್ಕೃತಿಕ, ಧಾರ್ಮಿಕ ಮತ್ತು ಸಮುದಾಯ ಸೇವಾ ಚಟುವಟಿಕೆಗಳನ್ನು ಬೆಂಬಲಿಸಲು ಬಯಸುವ ವ್ಯಕ್ತಿಗಳು, ಉದ್ಯಮಗಳು ಮತ್ತು ಹಿತೈಷಿಗಳನ್ನು ನಾವು ಸ್ವಾಗತಿಸುತ್ತೇವೆ. ಸ್ವಯಂಸೇವೆ, ಸಾಮಗ್ರಿ ಅಥವಾ ಕಾರ್ಯಕ್ರಮ ಬೆಂಬಲದ ಮೂಲಕ ನೀಡುವ ಪ್ರತಿಯೊಂದು ಕೊಡುಗೆಯೂ ಸಮಾಜಕ್ಕೆ ಉತ್ತಮ ಸೇವೆ ಸಲ್ಲಿಸಲು ನಮಗೆ ನೆರವಾಗುತ್ತದೆ.",
        "sp1-t": "🎉 ಕಾರ್ಯಕ್ರಮ ಬೆಂಬಲ",
        "sp1-p": "ನಮ್ಮ ಸಾಂಸ್ಕೃತಿಕ ಮತ್ತು ಸಮುದಾಯ ಕಾರ್ಯಕ್ರಮಗಳ ಯಶಸ್ವಿ ಆಯೋಜನೆಗೆ ಬೆಂಬಲ ನೀಡಿ.",
        "sp2-t": "🍛 ಅನ್ನದಾನ ಬೆಂಬಲ",
        "sp2-p": "ನಮ್ಮ ಧಾರ್ಮಿಕ ಮತ್ತು ಸಮುದಾಯ ಕಾರ್ಯಕ್ರಮಗಳಲ್ಲಿ ಪ್ರಸಾದ ಮತ್ತು ಆಹಾರ ವಿತರಣೆಗೆ ಬೆಂಬಲ ನೀಡಿ.",
        "sp3-t": "🎵 ಧ್ವನಿ ಮತ್ತು ವೇದಿಕೆ ಬೆಂಬಲ",
        "sp3-p": "ಧ್ವನಿ ವ್ಯವಸ್ಥೆ, ದೀಪಾಲಂಕಾರ, ವೇದಿಕೆ ಸಿದ್ಧತೆ ಮತ್ತು ಕಾರ್ಯಕ್ರಮದ ವ್ಯವಸ್ಥೆಗಳಿಗೆ ಬೆಂಬಲ ನೀಡಿ.",
        "sp4-t": "🎁 ಸಾಮಗ್ರಿ ಬೆಂಬಲ",
        "sp4-p": "ಹೂವುಗಳು, ಅಲಂಕಾರ, ಪೂಜಾ ಸಾಮಗ್ರಿ, ಕುಡಿಯುವ ನೀರು, ಕುರ್ಚಿಗಳು ಮತ್ತು ಇತರ ಕಾರ್ಯಕ್ರಮ ಸಾಮಗ್ರಿಗಳಿಗೆ ಬೆಂಬಲ ನೀಡಿ.",
        "sp5-t": "🙋 ಸ್ವಯಂಸೇವಕರಾಗಿ",
        "sp5-p": "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗದ ಸ್ವಯಂಸೇವಕರಾಗಿ ಸೇರಿ, ಸಮುದಾಯಕ್ಕೆ ಶ್ರದ್ಧೆಯಿಂದ ಸೇವೆ ಸಲ್ಲಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡಿ.",
        "sponsor-cta": "ನಮ್ಮ ಚಟುವಟಿಕೆಗಳನ್ನು ಬೆಂಬಲಿಸಲು ಆಸಕ್ತಿ ಇದೆಯೇ?",
        "sponsor-insta": "📷 Instagram ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ",
        "sponsor-threads": "🧵 Threads ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ",
        "contact-title": "📍 ಸಂಪರ್ಕಿಸಿ",
        "contact-sub": "ನಿಮ್ಮಿಂದ ಕೇಳಲು ನಾವು ಬಯಸುತ್ತೇವೆ. ನಮ್ಮ ಅಧಿಕೃತ ವೇದಿಕೆಗಳ ಮೂಲಕ ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
        "loc-title": "📍 ನಮ್ಮ ವಿಳಾಸ",
        "loc-text": "ವಿಜಯನಗರ ವಾಟರ್ ಟ್ಯಾಂಕ್,<br>ಡಾಲ್ಫಿನ್ ಬೇಕ್ಸ್ ಎನ್ ಐಸ್ ಕ್ರೀಮ್ಸ್ ಎದುರು,<br>ಮೈಸೂರು-570017",
        "loc-btn": "🗺️ ಗೂಗಲ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ",
        "insta-text": "ನಮ್ಮ ಅಧಿಕೃತ ಪುಟವನ್ನು ಫಾಲೋ ಮಾಡಿ",
        "insta-btn": "Instagram ತೆರೆಯಿರಿ",
        "threads-text": "ನಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ",
        "threads-btn": "Threads ತೆರೆಯಿರಿ",
        "email-title": "📧 ಇಮೇಲ್",
        "email-text": "ಅಧಿಕೃತ ಇಮೇಲ್ ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗಲಿದೆ.",
        "phone-title": "📞 ಫೋನ್",
        "phone-text": "ಅಧಿಕೃತ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಯನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕಟಿಸಲಾಗುವುದು.",
        "foot-name": "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ",
        "foot-tag": "🤝 ಸ್ನೇಹ • 🛕 ಸಂಸ್ಕೃತಿ • ❤️ ಸೇವೆ",
        "foot-place": "📍 ಮೈಸೂರು, ಕರ್ನಾಟಕ",
        "foot-copy": "© 2026 ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ",
        "foot-dev": "ರಚನೆ: <b>Koushil R Gowda</b> ❤️",
        "foot-ver": "ವೆಬ್‌ಸೈಟ್ ಆವೃತ್ತಿ 2.2",
        "sp-cta": "💬 Instagram ನಲ್ಲಿ ಸಂದೇಶ ಕಳುಹಿಸಿ",
        "copied": "✅ ಸಂದೇಶ ನಕಲಾಗಿದೆ! Instagram ಚಾಟ್‌ನಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ ಕಳುಹಿಸಿ.",
        "sp1-msg": "ನಮಸ್ಕಾರ ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ! ನಾನು ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮ ಬೆಂಬಲಕ್ಕೆ ಸಹಕರಿಸಲು (Sponsor) ಬಯಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.",
        "sp2-msg": "ನಮಸ್ಕಾರ ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ! ನಾನು ನಿಮ್ಮ ಅನ್ನದಾನ ಬೆಂಬಲಕ್ಕೆ ಸಹಕರಿಸಲು (Sponsor) ಬಯಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.",
        "sp3-msg": "ನಮಸ್ಕಾರ ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ! ನಾನು ನಿಮ್ಮ ಧ್ವನಿ ಮತ್ತು ವೇದಿಕೆ ಬೆಂಬಲಕ್ಕೆ ಸಹಕರಿಸಲು (Sponsor) ಬಯಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.",
        "sp4-msg": "ನಮಸ್ಕಾರ ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ! ನಾನು ನಿಮ್ಮ ಸಾಮಗ್ರಿ ಬೆಂಬಲಕ್ಕೆ ಸಹಕರಿಸಲು (Sponsor) ಬಯಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.",
        "sp5-msg": "ನಮಸ್ಕಾರ ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ! ನಾನು ಸ್ವಯಂಸೇವಕನಾಗಿ ಸೇರಲು ಬಯಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ವಿವರಗಳನ್ನು ತಿಳಿಸಿ."
    },
    "en": {
        "nav-home": "Home",
        "nav-about": "About",
        "nav-events": "Events",
        "nav-team": "AGB Team",
        "nav-gallery": "Gallery",
        "nav-sponsor": "Support",
        "nav-contact": "Contact",
        "hero-title": "AIGIRI GELEYARA BALAGA",
        "hero-city": "Mysuru",
        "hero-tagline": "Service • Friendship • Culture",
        "btn-events": "Upcoming Events",
        "connect": "Connect With Us",
        "insta-follow": "Follow us on Instagram",
        "threads-official": "Official Page",
        "slide-title": "Ganeshotsava 2025",
        "slide-sub": "Memories of Unity • Devotion • Friendship",
        "upcoming-title": "✨ Upcoming Events ✨",
        "past-title": "🕰️ Past Events",
        "t-ashada": "🪔 Ashada Pooja Mahotsava",
        "t-ganesh": "🐘 Ganeshotsava",
        "d-ashada27": "📅 30 July 2027",
        "d-ganesh27": "📅 04 September 2027",
        "cd-days": "Days",
        "cd-hours": "Hours",
        "cd-mins": "Min",
        "cd-secs": "Sec",
        "cd-live": "🙏 Event has started",
        "watch": "▶ Watch on Instagram",
        "about-title": "About AIGIRI GELEYARA BALAGA",
        "about-sub": "Serving Society Through Friendship, Culture &amp; Unity",
        "about-p1": "<strong>AIGIRI GELEYARA BALAGA (AGB), Mysuru</strong> is a youth community organization established in <strong>2025</strong> with the vision of bringing people together through friendship, culture, spirituality, and social service.",
        "about-p2": "Since its inception, AGB has been actively organizing religious celebrations, cultural events, social activities, and community service initiatives that strengthen unity and promote positive values among youth and society.",
        "about-p3": "Our flagship celebrations include <strong>Ganeshotsava</strong>, <strong>Ashada Shukravara Pooja Mahotsava</strong>, and various future initiatives dedicated to serving society, preserving traditions, and encouraging volunteerism.",
        "about-p4": "We believe that true friendship becomes meaningful when it inspires service, respect, leadership, and collective responsibility. Every member of AGB contributes towards building a stronger, united, and compassionate community.",
        "motto-title": "<strong>Our Motto:</strong>",
        "motto-1": "🟡 Service • Friendship • Culture",
        "motto-2": "🙏 Together We Grow, Together We Serve.",
        "team-title": "👥 AGB Team",
        "team-subtitle": "Meet the members of AIGIRI GELEYARA BALAGA",
        "gallery-title": "📸 Gallery",
        "gallery-subtitle": "Memories from our events",
        "g-ashada": "🪔 Ashada Pooja",
        "g-ganesh": "🐘 Ganeshotsava",
        "sponsor-title": "🤝 Support AIGIRI GELEYARA BALAGA",
        "sponsor-sub": "We welcome individuals, businesses and well-wishers who wish to support our cultural, religious and community service activities. Every contribution through volunteering, materials or event support helps us serve society better.",
        "sp1-t": "🎉 Event Support",
        "sp1-p": "Support the successful organization of our cultural and community events.",
        "sp2-t": "🍛 Annadanam Support",
        "sp2-p": "Support prasada and food distribution during our religious and community events.",
        "sp3-t": "🎵 Sound &amp; Stage Support",
        "sp3-p": "Support sound systems, lighting, stage setup and event arrangements.",
        "sp4-t": "🎁 Material Support",
        "sp4-p": "Support flowers, decorations, pooja items, drinking water, chairs and other event materials.",
        "sp5-t": "🙋 Volunteer",
        "sp5-p": "Join AIGIRI GELEYARA BALAGA as a volunteer and help us serve the community with dedication.",
        "sponsor-cta": "Interested in Supporting Our Activities?",
        "sponsor-insta": "📷 Contact on Instagram",
        "sponsor-threads": "🧵 Contact on Threads",
        "contact-title": "📍 Contact Us",
        "contact-sub": "We would love to hear from you. Connect with AIGIRI GELEYARA BALAGA through our official platforms.",
        "loc-title": "📍 Our Location",
        "loc-text": "Vijayanagar Water Tank,<br>Opposite Dolphin Bakes 'N' Ice Creams,<br>Mysuru-570017",
        "loc-btn": "🗺️ Open in Google Maps",
        "insta-text": "Follow our official page",
        "insta-btn": "Open Instagram",
        "threads-text": "Stay connected with us",
        "threads-btn": "Open Threads",
        "email-title": "📧 Email",
        "email-text": "Official Email will be available soon.",
        "phone-title": "📞 Phone",
        "phone-text": "Official Contact Number will be announced soon.",
        "foot-name": "AIGIRI GELEYARA BALAGA",
        "foot-tag": "🤝 Friendship • 🛕 Culture • ❤️ Service",
        "foot-place": "📍 Mysuru, Karnataka",
        "foot-copy": "© 2026 AIGIRI GELEYARA BALAGA",
        "foot-dev": "Developed with ❤️ by <b>Koushil R Gowda</b>",
        "foot-ver": "Website Version 2.2",
        "sp-cta": "💬 Message us on Instagram",
        "copied": "✅ Message copied! Paste it in the Instagram chat and send.",
        "sp1-msg": "Hello AIGIRI GELEYARA BALAGA! I would like to sponsor your Event Support. Please share the details.",
        "sp2-msg": "Hello AIGIRI GELEYARA BALAGA! I would like to sponsor your Annadanam Support. Please share the details.",
        "sp3-msg": "Hello AIGIRI GELEYARA BALAGA! I would like to sponsor your Sound & Stage Support. Please share the details.",
        "sp4-msg": "Hello AIGIRI GELEYARA BALAGA! I would like to sponsor your Material Support. Please share the details.",
        "sp5-msg": "Hello AIGIRI GELEYARA BALAGA! I would like to join as a Volunteer. Please share the details."
    }
};

const langBtn = document.getElementById("langBtn");
let currentLanguage = localStorage.getItem("language") === "en" ? "en" : "kn";

function changeLanguage(language) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const text = translations[language][el.dataset.i18n];
        if (text !== undefined) el.innerHTML = text;
    });

    document.documentElement.lang = language;
    langBtn.textContent = language === "kn" ? "🌐 English" : "🌐 ಕನ್ನಡ";
    localStorage.setItem("language", language);
    currentLanguage = language;
}

changeLanguage(currentLanguage);

langBtn.addEventListener("click", () => {
    changeLanguage(currentLanguage === "kn" ? "en" : "kn");
});


// ===== 3. Mobile Menu =====
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-links");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuToggle.textContent = navMenu.classList.contains("active") ? "✖" : "☰";
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuToggle.textContent = "☰";
        });
    });
}


// ===== 4. Scroll effects (shrinking navbar + back-to-top button) =====
const navbar = document.querySelector(".navbar");
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// ===== 5. Random team order on every visit =====
const teamGrid = document.querySelector(".team-grid");

if (teamGrid) {
    const cards = Array.from(teamGrid.children);

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    cards.forEach(card => teamGrid.appendChild(card));
}


// ===== 6. Loader =====
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => { loader.style.display = "none"; }, 600);
    }, 1800);
});


// ===== 7. Photo slider =====
// Add or remove photos here (files are in images/gallery-slider/)
const galleryImages = [
    "images/gallery-slider/photo1.jpg",
    "images/gallery-slider/photo2.jpg",
    "images/gallery-slider/photo3.jpg",
    "images/gallery-slider/photo4.jpg",
    "images/gallery-slider/photo5.jpg",
    "images/gallery-slider/photo6.jpg",
    "images/gallery-slider/photo7.jpg",
    "images/gallery-slider/photo8.jpg"
];

let galleryIndex = 0;
const sliderImage = document.getElementById("sliderImage");
const dotsContainer = document.getElementById("sliderDots");

function updateDots() {
    document.querySelectorAll("#sliderDots span").forEach((dot, i) => {
        dot.classList.toggle("active", i === galleryIndex);
    });
}

function showSlide(index) {
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    sliderImage.src = galleryImages[galleryIndex];
    updateDots();
}

if (sliderImage) {

    // Auto-play every 4 seconds with a short fade
    setInterval(() => {
        sliderImage.style.opacity = 0;
        setTimeout(() => {
            showSlide(galleryIndex + 1);
            sliderImage.style.opacity = 1;
        }, 300);
    }, 4000);

    document.getElementById("prevSlide").onclick = () => showSlide(galleryIndex - 1);
    document.getElementById("nextSlide").onclick = () => showSlide(galleryIndex + 1);

    if (dotsContainer) {
        galleryImages.forEach((img, index) => {
            const dot = document.createElement("span");
            if (index === 0) dot.classList.add("active");
            dot.onclick = () => showSlide(index);
            dotsContainer.appendChild(dot);
        });
    }

    // Full screen viewer
    const imageViewer = document.getElementById("imageViewer");
    const fullImage = document.getElementById("fullImage");

    sliderImage.onclick = () => {
        fullImage.src = sliderImage.src;
        imageViewer.style.display = "flex";
    };

    document.getElementById("closeViewer").onclick = () => {
        imageViewer.style.display = "none";
    };

    imageViewer.onclick = (e) => {
        if (e.target === imageViewer) imageViewer.style.display = "none";
    };
}


// ===== 8. Upcoming events countdown =====
// To change a date, edit data-date="YYYY-MM-DDTHH:MM:SS" in index.html
document.querySelectorAll(".countdown-card").forEach(card => {
    const target = new Date(card.dataset.date).getTime();
    const box = card.querySelector(".countdown");
    const days = card.querySelector(".cd-days");
    const hours = card.querySelector(".cd-hours");
    const mins = card.querySelector(".cd-mins");
    const secs = card.querySelector(".cd-secs");
    let timer;

    function tick() {
        const diff = target - Date.now();

        if (diff <= 0) {
            box.innerHTML = '<p class="cd-live" data-i18n="cd-live"></p>';
            changeLanguage(currentLanguage);
            clearInterval(timer);
            return;
        }

        days.textContent = Math.floor(diff / 86400000);
        hours.textContent = String(Math.floor(diff / 3600000) % 24).padStart(2, "0");
        mins.textContent = String(Math.floor(diff / 60000) % 60).padStart(2, "0");
        secs.textContent = String(Math.floor(diff / 1000) % 60).padStart(2, "0");
    }

    tick();
    timer = setInterval(tick, 1000);
});


// ===== 9. Support boxes -> Instagram message =====
// Tapping a box copies a ready message and opens our Instagram chat.
// (Instagram does not allow pre-filled text in links, so the user pastes it.)
const toast = document.getElementById("toast");
let toastTimer;

function showToast() {
    toast.textContent = translations[currentLanguage].copied;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 6000);
}

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    return Promise.resolve();
}

document.querySelectorAll("[data-msg]").forEach(card => {
    card.addEventListener("click", () => {
        const message = translations[currentLanguage][card.dataset.msg];
        copyText(message).then(showToast).catch(showToast);
    });
});

