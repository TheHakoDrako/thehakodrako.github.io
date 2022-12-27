const preload = document.querySelector('.preloadCentrado');

window.addEventListener('load', () => {
    setTimeout(() => {
        preload.style.display = 'none';
    }, 2000);
});