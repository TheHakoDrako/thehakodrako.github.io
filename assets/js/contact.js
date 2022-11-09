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
        alert('Sent!');
      }, (err) => {
        btn.value = 'Send Email';
        alert(JSON.stringify(err));
      });
  });
