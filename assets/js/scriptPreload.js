const preload = document.querySelector('.preloadCentrado');
const visible = document.querySelector('body');

window.addEventListener('load', () => {
    setTimeout(() => {
        preload.style.display = 'none';
        visible.classList.remove('isPreload');
    }, 3000);
});

window.addEventListener('beforeunload', () => {
    preload.style.display = 'block';
    visible.classList.add('isPreload');
});