/* INTRO */

const btnAbrirModalIntro = document.querySelector('#btnIntro');
const btnCerrarModalIntro = document.querySelector('#btnCerrarIntro');
const modalIntro = document.querySelector('#modalIntro');


btnAbrirModalIntro.addEventListener('click',()=>{
    modalIntro.showModal();
})

btnCerrarModalIntro.addEventListener('click',()=>{
    modalIntro.close();
})

/* WORK */

const btnAbrirModalWork = document.querySelector('#btnWork');
const btnCerrarModalWork = document.querySelector('#btnCerrarWork');
const modalWork = document.querySelector('#modalWork');


btnAbrirModalWork.addEventListener('click',()=>{
    modalWork.showModal();
})

btnCerrarModalWork.addEventListener('click',()=>{
    modalWork.close();
})

/* ABOUT */

const btnAbrirModalAbout = document.querySelector('#btnAbout');
const btnCerrarModalAbout = document.querySelector('#btnCerrarAbout');
const modalAbout = document.querySelector('#modalAbout');


btnAbrirModalAbout.addEventListener('click',()=>{
    modalAbout.showModal();
})

btnCerrarModalAbout.addEventListener('click',()=>{
    modalAbout.close();
})

/* CONTACT */

const btnAbrirContact = document.querySelector('#btnContact');
const btnCerrarContact = document.querySelector('#btnCerrarContact');
const modalContact = document.querySelector('#modalContact');


btnAbrirContact.addEventListener('click',()=>{
    modalContact.showModal();
})

btnCerrarContact.addEventListener('click',()=>{
    modalContact.close();
})