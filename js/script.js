// ===== Theme Toggle =====
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


// ===== Language Toggle (Kannada / English) =====
const langBtn = document.getElementById("langBtn");
let currentLanguage = localStorage.getItem("language") || "kn";

const translations = {
    kn: {
        "nav-home": "ಮುಖಪುಟ",
        "nav-about": "ನಮ್ಮ ಬಗ್ಗೆ",
        "nav-events": "ಕಾರ್ಯಕ್ರಮಗಳು",
        "nav-team": "AGB ತಂಡ",
        "nav-gallery": "ಗ್ಯಾಲರಿ",
        "nav-contact": "ಸಂಪರ್ಕಿಸಿ",
        "hero-title": "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ",
        "hero-city": "ಮೈಸೂರು",
        "hero-tagline": "ಸೇವೆ • ಸ್ನೇಹ • ಸಂಸ್ಕೃತಿ",
        "btn-events": "ಕಾರ್ಯಕ್ರಮಗಳು",
        "about-title": "ನಮ್ಮ ಬಗ್ಗೆ",
        "about-text": "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ, ಮೈಸೂರು ಸ್ನೇಹ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಮಾಜ ಸೇವೆಗೆ ಸಮರ್ಪಿತ ಯುವಕರ ಸಂಘವಾಗಿದೆ.",
        "upcoming-title": "✨ ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು ✨",
        "past-title": "🕰️ ಹಿಂದಿನ ಕಾರ್ಯಕ್ರಮಗಳು",
        "team-title": "👥 AGB ತಂಡ",
        "team-subtitle": "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗದ ಸದಸ್ಯರು",
        "gallery-title": "📸 ಗ್ಯಾಲರಿ",
        "gallery-subtitle": "ನಮ್ಮ ಕಾರ್ಯಕ್ರಮಗಳ ನೆನಪುಗಳು",
        "gallery-video1": "🪔 ಆಷಾಢ ಪೂಜಾ 2025",
        "gallery-video2": "🐘 ಗಣೇಶೋತ್ಸವ 2025"
    },
    en: {
        "nav-home": "Home",
        "nav-about": "About",
        "nav-events": "Events",
        "nav-team": "AGB Team",
        "nav-gallery": "Gallery",
        "nav-contact": "Contact",
        "hero-title": "AIGIRI GELEYARA BALAGA",
        "hero-city": "Mysuru",
        "hero-tagline": "Service • Friendship • Culture",
        "btn-events": "Upcoming Events",
        "about-title": "About Us",
        "about-text": "AIGIRI GELEYARA BALAGA, Mysuru is a youth organization dedicated to friendship, culture and community service.",
        "upcoming-title": "✨ Upcoming Events ✨",
        "past-title": "🕰️ Past Events",
        "team-title": "👥 AGB Team",
        "team-subtitle": "Meet the members of AIGIRI GELEYARA BALAGA",
        "gallery-title": "📸 Gallery",
        "gallery-subtitle": "Memories from our events",
        "gallery-video1": "🪔 Ashada Pooja 2025",
        "gallery-video2": "🐘 Ganeshotsava 2025"
    }
};

function changeLanguage(language) {
    for (const id in translations[language]) {
        const element = document.getElementById(id);
        if (element) element.innerText = translations[language][id];
    }
    langBtn.innerText = language === "kn" ? "🌐 English" : "🌐 ಕನ್ನಡ";
    localStorage.setItem("language", language);
    currentLanguage = language;
}

changeLanguage(currentLanguage);

langBtn.addEventListener("click", () => {
    changeLanguage(currentLanguage === "kn" ? "en" : "kn");
});


// ===== Mobile Menu =====
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-links");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuToggle.innerHTML = navMenu.classList.contains("active") ? "✖" : "☰";
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuToggle.innerHTML = "☰";
        });
    });
}


// ===== Sticky Navbar (shrinks on scroll) =====
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
});


// ===== Back To Top =====
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// ===== Random Team Shuffle =====
const teamGrid = document.querySelector(".team-grid");

if (teamGrid) {
    const cards = Array.from(teamGrid.children);

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    cards.forEach(card => teamGrid.appendChild(card));
}


// ===== Loader =====
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => { loader.style.display = "none"; }, 600);
    }, 1800);
});


// ===== Gallery Image Slider =====
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

    // Dots
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


// ===== Upcoming Events Countdown =====
// Change the date in index.html (data-date="YYYY-MM-DDTHH:MM:SS") to update a countdown
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
            box.innerHTML = '<p class="cd-live">🙏 ಕಾರ್ಯಕ್ರಮ ಪ್ರಾರಂಭವಾಗಿದೆ · Event has started</p>';
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
