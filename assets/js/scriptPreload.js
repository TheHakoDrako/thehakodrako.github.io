const preload = document.querySelector('.preloadCentrado');
const wrap = document.querySelector('.wrapperLoad');

wrap.style.display = 'none';

window.addEventListener('load', () => {
    setTimeout(() => {
        preload.style.display = 'none';
        wrap.style.display = 'block';
    }, 2000);
});