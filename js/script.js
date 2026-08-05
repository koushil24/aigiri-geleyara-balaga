// ===== Theme Toggle =====

const themeBtn = document.getElementById("themeBtn");
const body = document.body;

// Load saved theme
if(localStorage.getItem("theme") === "dark"){
    body.classList.add("dark-mode");
    themeBtn.textContent = "☀️";
}else{
    themeBtn.textContent = "🌙";
}

themeBtn.addEventListener("click", ()=>{

    body.classList.toggle("dark-mode");

    if(body.classList.contains("dark-mode")){
        localStorage.setItem("theme","dark");
        themeBtn.textContent="☀️";
    }else{
        localStorage.setItem("theme","light");
        themeBtn.textContent="🌙";
    }

});
const langBtn = document.getElementById("langBtn");

let currentLanguage = localStorage.getItem("language") || "kn";

const translations = {

kn:{
    "nav-home":"ಮುಖಪುಟ",
    "nav-about":"ನಮ್ಮ ಬಗ್ಗೆ",
    "nav-events":"ಕಾರ್ಯಕ್ರಮಗಳು",
    "nav-team":"AGB ತಂಡ",
    "nav-gallery":"ಗ್ಯಾಲರಿ",
    "nav-news":"ಸುದ್ದಿ",
    "nav-contact":"ಸಂಪರ್ಕಿಸಿ",
    "hero-title":"ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ",
    "hero-city":"ಮೈಸೂರು",
    "hero-tagline":"ಸೇವೆ • ಸ್ನೇಹ • ಸಂಸ್ಕೃತಿ",
    "btn-events":"ಕಾರ್ಯಕ್ರಮಗಳು",
    "btn-about":"ನಮ್ಮ ಬಗ್ಗೆ",
    "about-title":"ನಮ್ಮ ಬಗ್ಗೆ",
"about-text":"ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ, ಮೈಸೂರು ಸ್ನೇಹ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಮಾಜ ಸೇವೆಗೆ ಸಮರ್ಪಿತ ಯುವಕರ ಸಂಘವಾಗಿದೆ.",

"events-title":"✨ ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು ✨",
"event1-title":"🪔 ಆಷಾಢ ಶುಕ್ರವಾರ ಪೂಜಾ ಮಹೋತ್ಸವ 2026",
"view-details":"ವಿವರಗಳನ್ನು ನೋಡಿ",

"team-title":"👥 AGB ತಂಡ",
"team-subtitle":"ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗದ ಸದಸ್ಯರು",

"gallery-title":"📸 ಗ್ಯಾಲರಿ",
"gallery-subtitle":"ನಮ್ಮ ಕಾರ್ಯಕ್ರಮಗಳ ನೆನಪುಗಳು",
"gallery-video1":"🪔 ಆಷಾಷ ಪೂಜಾ 2025",
"gallery-video2":"🐘 ಗಣೇಶೋತ್ಸವ 2025",

"contact-title":"ಸಂಪರ್ಕಿಸಿ",

"footer-text":"© 2026 ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ | ಮೈಸೂರು"
},

en:{
    "nav-home":"Home",
    "nav-about":"About",
    "nav-events":"Events",
    "nav-team":"AGB Team",
    "nav-gallery":"Gallery",
    "nav-news":"News",
    "nav-contact":"Contact",
    "hero-title":"AIGIRI GELEYARA BALAGA",
    "hero-city":"Mysuru",
    "hero-tagline":"Service • Friendship • Culture",
    "btn-events":"Upcoming Events",
    "btn-about":"About Us",
    "about-title":"About Us",
"about-text":"AIGIRI GELEYARA BALAGA, Mysuru is a youth organization dedicated to friendship, culture and community service.",

"events-title":"✨ Upcoming Events ✨",
"event1-title":"🪔 Ashada Pooja Mahotsava 2026",
"view-details":"View Details",

"team-title":"👥 AGB Team",
"team-subtitle":"Meet the members of AIGIRI GELEYARA BALAGA",

"gallery-title":"📸 Gallery",
"gallery-subtitle":"Memories from our events",
"gallery-video1":"🪔 Ashada Pooja 2025",
"gallery-video2":"🐘 Ganeshotsava 2025",

"contact-title":"Contact Us",

"footer-text":"© 2026 AIGIRI GELEYARA BALAGA | Mysuru"
}

};

function changeLanguage(language){

    for(const id in translations[language]){

        const element=document.getElementById(id);

        if(element){

            element.innerText=translations[language][id];

        }

    }

    langBtn.innerText=language==="kn" ? "🌐 English" : "🌐 ಕನ್ನಡ";

    localStorage.setItem("language",language);

    currentLanguage=language;

}

changeLanguage(currentLanguage);

langBtn.addEventListener("click",()=>{

    changeLanguage(currentLanguage==="kn" ? "en" : "kn");

});
// ===== Mobile Menu =====

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-links");

if(menuToggle && navMenu){

menuToggle.addEventListener("click",()=>{

navMenu.classList.toggle("active");

if(navMenu.classList.contains("active")){

menuToggle.innerHTML="✖";

}else{

menuToggle.innerHTML="☰";

}

});

document.querySelectorAll(".nav-links a").forEach(link=>{

link.addEventListener("click",()=>{

navMenu.classList.remove("active");

menuToggle.innerHTML="☰";

});

});

}
// ===== Sticky Navbar =====

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if(window.scrollY > 20){

        navbar.classList.add("scrolled");

    }else{

        navbar.classList.remove("scrolled");

    }

});
// ===== Back To Top =====

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

topBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});
