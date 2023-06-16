import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'glightbox/dist/css/glightbox.min.css';
import 'aos/dist/aos.css';
import 'swiper/swiper-bundle.css';
import Typed from 'typed.js';
import Isotope from 'isotope-layout';
import AOS from 'aos';
import GLightbox from 'glightbox';
import Swiper from 'swiper/swiper-bundle.esm.js';
import './assets/vendor/waypoints/noframework.waypoints.js';
import emailjs from '@emailjs/browser';

const App = () => {
  useEffect(() => {
    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
      el = el.trim();
      if (all) {
        return [...document.querySelectorAll(el)];
      } else {
        return document.querySelector(el);
      }
    };

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
      let selectEl = select(el, all);
      if (selectEl) {
        if (all) {
          selectEl.forEach((e) => e.addEventListener(type, listener));
        } else {
          selectEl.addEventListener(type, listener);
        }
      }
    };

    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener);
    };

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true);
    const navbarlinksActive = () => {
      let position = window.scrollY + 200;
      navbarlinks.forEach((navbarlink) => {
        if (!navbarlink.hash) return;
        let section = select(navbarlink.hash);
        if (!section) return;
        if (
          position >= section.offsetTop &&
          position <= section.offsetTop + section.offsetHeight
        ) {
          navbarlink.classList.add('active');
        } else {
          navbarlink.classList.remove('active');
        }
      });
    };
    window.addEventListener('load', navbarlinksActive);
    onscroll(document, navbarlinksActive);

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
      let elementPos = select(el).offsetTop;
      window.scrollTo({
        top: elementPos,
        behavior: 'smooth',
      });
    };

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top');
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active');
        } else {
          backtotop.classList.remove('active');
        }
      };
      window.addEventListener('load', toggleBacktotop);
      onscroll(document, toggleBacktotop);
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function (e) {
      select('body').classList.toggle('mobile-nav-active');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let body = select('body');
        if (body.classList.contains('mobile-nav-active')) {
          body.classList.remove('mobile-nav-active');
          let navbarToggle = select('.mobile-nav-toggle');
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
        scrollto(this.hash);
      }
    }, true);

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
      if (window.location.hash) {
        if (select(window.location.hash)) {
          scrollto(window.location.hash);
        }
      }
    });

    /**
     * Preloader
     */
    let preloader = select('#preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.remove();
      }, 1000); //
    }

    /**
     * Hero type effect
     */
    const typed = select('.typed');
    if (typed && !typed.classList.contains('initialized')) {
      let typed_strings = typed.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
      });
      typed.classList.add('initialized');
    }

    /**
     * Skills animation
     */
    let skilsContent = select('.skills-content');
    if (skilsContent) {
      new Waypoint({
        element: skilsContent,
        offset: '80%',
        handler: function (direction) {
          let progress = select('.progress .progress-bar', true);
          progress.forEach((el) => {
            el.style.width = el.getAttribute('aria-valuenow') + '%'
          });
        }
      })
    }

    /**
     * Porfolio isotope and filter
     */
    window.addEventListener('load', () => {
      let portfolioContainer = select('.portfolio-container');
      if (portfolioContainer) {
        let portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item',
        });

        let portfolioFilters = select('#portfolio-flters li', true);

        on('click', '#portfolio-flters li', function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove('filter-active');
          });
          this.classList.add('filter-active');

          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter'),
          });
          portfolioIsotope.on('arrangeComplete', function () {
            AOS.refresh();
          });
        }, true);
      }
    });

    /**
     * Initiate portfolio lightbox 
     */
    const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox',
    });

    /**
     * Initiate portfolio details lightbox 
     */
    const portfolioDetailsLightbox = GLightbox({
      selector: '.portfolio-details-lightbox',
      width: '90%',
      height: '90vh',
    });

    /**
     * Portfolio details slider
     */
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    });

    /**
     * Quotes slider
     */
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    });

    /**
     * Animation on scroll
     */
    window.addEventListener('load', () => {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      });
    });

    /**
     * Contact (form)
     */
    const contactForm = select('#contact-form');
    const submitButton = select('#contact-form button[type="submit"]');
    const formSubmit = (event) => {
      event.preventDefault();
      const nameInput = select('#name');
      const emailInput = select('#email');
      const subjectInput = select('#subject');
      const messageInput = select('#message');

      // Validar que todos los campos estén completos
      if (nameInput.value === '' || emailInput.value === '' || subjectInput.value === '' || messageInput.value === '') {
        alert('Please fill in all fields');
        return;
      }

      // Obtener el valor del reCAPTCHA
      const recaptchaValue = grecaptcha.getResponse();

      // Validar el reCAPTCHA
      if (recaptchaValue === '') {
        const errorMessage = select('.error-message');
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Please complete the captcha.';
        return;
      } else {
        const errorMessage = select('.error-message');
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
      }

      // Desactivar el botón de enviar
      submitButton.disabled = true;

      // Enviar el formulario utilizando EmailJS
      const templateParams = {
        name: nameInput.value,
        email: emailInput.value,
        subject: subjectInput.value,
        message: messageInput.value,
      };

      emailjs.send('service_ykkkueg', 'template_7c7qrra', templateParams, 'hYlwyEv-6d2QR3IXZ')
        .then(() => {
          // Limpiar los campos del formulario después de enviarlo
          nameInput.value = '';
          emailInput.value = '';
          subjectInput.value = '';
          messageInput.value = '';
          grecaptcha.reset();

          // Mostrar mensaje de éxito
          const successMessage = select('.sent-message');
          successMessage.style.display = 'block';
          setTimeout(() => {
            successMessage.style.display = 'none';
          }, 3000);

          // Activar el botón de enviar nuevamente
          submitButton.disabled = false;
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          // Mostrar mensaje de error
          const errorMessage = select('.error-message');
          errorMessage.style.display = 'block';
          errorMessage.textContent = 'Error while sending..';

          // Activar el botón de enviar nuevamente
          submitButton.disabled = false;
        });
    };

    if (contactForm) {
      contactForm.addEventListener('submit', formSubmit);
    }
  }, []);
}

export default App;
