const preloadCentrado = document.querySelector('.preloadCentrado');

window.addEventListener('load', () => {
    setTimeout(() => {
        preloadCentrado.style.display = 'none';
    }, 3000);
});