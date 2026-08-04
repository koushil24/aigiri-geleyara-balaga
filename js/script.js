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
    "btn-about":"ನಮ್ಮ ಬಗ್ಗೆ"
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
    "btn-about":"About Us"
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
