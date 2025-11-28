// Menu Mobile
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav ul');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80, // Compensa o cabeçalho fixo
        behavior: 'smooth'
      });
    }
  });
});

// Botão "Voltar ao Topo"
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.id = 'scrollToTopBtn';
scrollToTopBtn.style.display = 'none';
scrollToTopBtn.style.position = 'fixed';
scrollToTopBtn.style.bottom = '80px';
scrollToTopBtn.style.right = '20px';
scrollToTopBtn.style.zIndex = '9998';
scrollToTopBtn.style.padding = '10px';
scrollToTopBtn.style.borderRadius = '50%';
scrollToTopBtn.style.background = '#ff6b35';
scrollToTopBtn.style.color = 'white';
scrollToTopBtn.style.border = 'none';
scrollToTopBtn.style.cursor = 'pointer';
scrollToTopBtn.style.fontSize = '1.2rem';

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Validação do formulário de contato
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const message = document.querySelector('textarea').value;

    if (name && email && message) {
      alert('Obrigado pelo seu contato! Entraremos em contato em breve.');
      contactForm.reset();
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  });
}