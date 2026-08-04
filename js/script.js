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
