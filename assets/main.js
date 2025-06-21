function handleSubmitForm(event) {
  event.preventDefault();

  const name = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const description = document.getElementById("description").value;
  const localization = document.getElementById("localization").value;
  const contact = document.getElementById("contact").value;
  const service = document.getElementById("service").value;

  if (service === "") {
    alert("Por favor, selecione um serviço.");
    return;
  }

  emailjs.init("pTP6zWYYpK4UjRN7G");

  const templateParams = {
    name: name,
    email: email,
    description: description,
    localization: localization,
    contact: contact,
    service: service
  };

  emailjs.send("service_kexy56d", "template_igmbkf1", templateParams).then(
    () => {
      alert("E-mail enviado com sucesso!");
    },
    error => {
      console.error("Erro ao enviar o e-mail:", error);
      alert("Erro ao enviar o e-mail. Tente novamente.");
    }
  );
}
