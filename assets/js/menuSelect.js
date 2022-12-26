document.getElementById("intro-content").style.display = "none";
document.getElementById("work-content").style.display = "none";
document.getElementById("about-content").style.display = "none";
document.getElementById("contact-content").style.display = "none";


document.getElementById("intro-button").addEventListener("click", function () {
    // Muestra el contenido de Intro al hacer clic en el botón
    document.getElementById("intro-content").style.display = "block";
    // Oculta los demás contenidos
    document.getElementById("work-content").style.display = "none";
    document.getElementById("about-content").style.display = "none";
    document.getElementById("contact-content").style.display = "none";
});
document.getElementById("work-button").addEventListener("click", function () {
    // Muestra el contenido de Work al hacer clic en el botón
    document.getElementById("work-content").style.display = "block";
    // Oculta los demás contenidos
    document.getElementById("intro-content").style.display = "none";
    document.getElementById("about-content").style.display = "none";
    document.getElementById("contact-content").style.display = "none";
});
document.getElementById("about-button").addEventListener("click", function () {
    // Muestra el contenido de About al hacer clic en el botón
    document.getElementById("about-content").style.display = "block";
    // Oculta los demás contenidos
    document.getElementById("intro-content").style.display = "none";
    document.getElementById("work-content").style.display = "none";
    document.getElementById("contact-content").style.display = "none";
});
document.getElementById("contact-button").addEventListener("click", function () {
    // Muestra el contenido de About al hacer clic en el botón
    document.getElementById("contact-content").style.display = "block";
    // Oculta los demás contenidos
    document.getElementById("intro-content").style.display = "none";
    document.getElementById("work-content").style.display = "none";
    document.getElementById("about-content").style.display = "none";
});