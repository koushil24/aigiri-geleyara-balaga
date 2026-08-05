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
// ===== Random Team Shuffle =====

const teamGrid = document.querySelector(".team-grid");

if(teamGrid){

const cards = Array.from(teamGrid.children);

for(let i = cards.length - 1; i > 0; i--){

const j = Math.floor(Math.random() * (i + 1));

[cards[i], cards[j]] = [cards[j], cards[i]];

}

cards.forEach(card => teamGrid.appendChild(card));

}
// ===== Loader =====

window.addEventListener("load",()=>{

setTimeout(()=>{

document.getElementById("loader").style.opacity="0";

setTimeout(()=>{

document.getElementById("loader").style.display="none";

},600);

},1800);

});
/* ==========================
   GALLERY IMAGE SLIDER
========================== */

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

if(sliderImage){

setInterval(()=>{

galleryIndex++;

if(galleryIndex>=galleryImages.length){
galleryIndex=0;
}

sliderImage.style.opacity=0;

setTimeout(()=>{

sliderImage.src=galleryImages[galleryIndex];

sliderImage.style.opacity=1;

updateDots();   // ← Add this line

},300);

},4000);

}
document.getElementById("prevSlide").onclick=()=>{

galleryIndex--;

if(galleryIndex<0){

galleryIndex=galleryImages.length-1;

}

sliderImage.src=galleryImages[galleryIndex];

updateDots();

};
document.getElementById("nextSlide").onclick=()=>{

galleryIndex++;

if(galleryIndex>=galleryImages.length){

galleryIndex=0;

}

sliderImage.src=galleryImages[galleryIndex];

updateDots();

};
/* ===== Gallery Dots ===== */

const dotsContainer = document.getElementById("sliderDots");

if(dotsContainer){

galleryImages.forEach((img,index)=>{

const dot=document.createElement("span");

if(index===0) dot.classList.add("active");

dot.onclick=()=>{

galleryIndex=index;

sliderImage.src=galleryImages[index];

updateDots();

};

dotsContainer.appendChild(dot);

});

}

function updateDots(){

const dots=document.querySelectorAll("#sliderDots span");

dots.forEach((dot,i)=>{

dot.classList.toggle("active",i===galleryIndex);

});

}
/* ===== Full Screen Gallery ===== */

const imageViewer=document.getElementById("imageViewer");

const fullImage=document.getElementById("fullImage");

sliderImage.onclick=()=>{

fullImage.src=sliderImage.src;

imageViewer.style.display="flex";

};

document.getElementById("closeViewer").onclick=()=>{

imageViewer.style.display="none";

};

imageViewer.onclick=(e)=>{

if(e.target===imageViewer){

imageViewer.style.display="none";

}

};
