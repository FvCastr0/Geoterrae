// ============================================
// GEOTERRAE — Main JS (Acessibilidade + UX)
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollAnimations();
  initSmoothScroll();
  initNavbarScroll();
});

// ---------- Menu Hamburger ----------
function initNavbar() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("open");
  });

  // Fecha o menu ao clicar em um link
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    });
  });
}

// ---------- Navbar shadow on scroll ----------
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });
}

// ---------- Animações de entrada (Intersection Observer) ----------
function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  // Respeita prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach(el => observer.observe(el));
}

// ---------- Smooth scroll para links internos ----------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.querySelector(".navbar")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({ top, behavior: "smooth" });
      target.focus({ preventScroll: true });
    });
  });
}

// ---------- Toast Notification ----------
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = "toast show" + (type === "error" ? " error" : "");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// ---------- Formulário ----------
function handleSubmitForm(event) {
  event.preventDefault();

  const name = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const description = document.getElementById("description").value.trim();
  const localization = document.getElementById("localization").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const service = document.getElementById("service").value;

  // Validações
  if (!name) {
    showToast("Por favor, preencha seu nome.", "error");
    document.getElementById("nome").focus();
    return;
  }
  if (!email) {
    showToast("Por favor, preencha seu e-mail.", "error");
    document.getElementById("email").focus();
    return;
  }
  if (!contact) {
    showToast("Por favor, preencha seu telefone.", "error");
    document.getElementById("contact").focus();
    return;
  }
  if (!service) {
    showToast("Por favor, selecione um serviço.", "error");
    document.getElementById("service").focus();
    return;
  }

  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = "Enviando...";
  btn.disabled = true;

  emailjs.init("pTP6zWYYpK4UjRN7G");

  const templateParams = {
    name,
    email,
    description,
    localization,
    contact,
    service,
  };

  emailjs.send("service_kexy56d", "template_igmbkf1", templateParams).then(
    () => {
      showToast("✅ Orçamento enviado com sucesso! Entraremos em contato em breve.");
      event.target.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    },
    (error) => {
      console.error("Erro ao enviar:", error);
      showToast("❌ Erro ao enviar. Tente novamente ou fale pelo WhatsApp.", "error");
      btn.textContent = originalText;
      btn.disabled = false;
    }
  );
}
