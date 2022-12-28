function validando() {
  var nombre, email, message;

  nombre = document.getElementById("name").value;
  email = document.getElementById("email").value;
  message = document.getElementById("message").value;

  /*const expresion = /^[0-9]*$/;*/

  if (nombre == "") {
  };

  if (email == "") {
  };

  if (message == "") {
  };

}

const btn = document.getElementById('button');

document.getElementById('form')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    btn.value = 'Sending...';

    const serviceID = 'default_service';
    const templateID = 'template_7c7qrra';

    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        btn.value = 'Send Email';
        alert('Message sent!');
      }, (err) => {
        btn.value = 'Send Email';
        alert(JSON.stringify(err));
      });
  });

/* CAPTCHA */

const SECRET_KEY = 'key';

const form = document.getElementById('form');
const submitButton = form.querySelector('input[type="submit"]');

submitButton.disabled = true;

form.addEventListener('submit', event => {
  event.preventDefault();

  grecaptcha.execute('key', { action: 'submit' }).then(function (token) {
    const response = token;

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${response}`;
    fetch(verificationUrl)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          form.submit();
        } else {
          console.error('Error al verificar el reCAPTCHA');
          submitButton.disabled = true;
        }
      })
      .catch(error => {
        console.error(error);
        submitButton.disabled = true;
      });
  });
});





