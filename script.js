// ===============================
// AIGIRI GELEYARA BALAGA
// script.js v1.0
// ===============================

// Language Button
const langBtn = document.getElementById("langBtn");

let kannada = true;

langBtn.addEventListener("click", function () {

    if (kannada) {

        document.querySelector(".hero h1").innerHTML =
            "AIGIRI GELEYARA BALAGA";

        document.querySelector(".hero h2").innerHTML =
            "Mysuru";

        document.querySelector(".hero p").innerHTML =
            "Service • Friendship • Culture";

        langBtn.innerHTML = "🌐 English";

        kannada = false;

    } else {

        document.querySelector(".hero h1").innerHTML =
            "ಐಗಿರಿ ಗೆಳೆಯರ ಬಳಗ";

        document.querySelector(".hero h2").innerHTML =
            "ಮೈಸೂರು";

        document.querySelector(".hero p").innerHTML =
            "ಸೇವೆ • ಸ್ನೇಹ • ಸಂಸ್ಕೃತಿ";

        langBtn.innerHTML = "🌐 ಕನ್ನಡ";

        kannada = true;

    }

});

// ===============================
// Dark Mode
// ===============================

const themeBtn = document.getElementById("themeBtn");

let dark = false;

themeBtn.addEventListener("click", function () {

    if (!dark) {

        document.body.style.background = "#121212";
        document.body.style.color = "white";

        themeBtn.innerHTML = "☀️";

        dark = true;

    } else {

        document.body.style.background = "#f5f5f5";
        document.body.style.color = "#222";

        themeBtn.innerHTML = "🌙";

        dark = false;

    }

});

// ===============================
// Welcome Message
// ===============================

window.onload = function () {

    console.log("Welcome to AIGIRI GELEYARA BALAGA");

};

// ===============================
// Button Click Effects
// ===============================

const buttons = document.querySelectorAll("button");

buttons.forEach(function(btn){

    btn.addEventListener("mouseover", function(){

        btn.style.transform = "scale(1.05)";

    });

    btn.addEventListener("mouseout", function(){

        btn.style.transform = "scale(1)";

    });

});
