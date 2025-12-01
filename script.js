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

// Função para inicializar o carrossel
function initCarousel() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;

  if (slides.length === 0) {
    console.warn("Nenhum slide encontrado para o carrossel.");
    return;
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
    });
    slides[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }

  // Auto-play a cada 5 segundos
  setInterval(nextSlide, 5000);

  // Botões de navegação
  const nextBtn = document.querySelector('.promo-carousel .next');
  const prevBtn = document.querySelector('.promo-carousel .prev');

  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }
}

// Executa quando o DOM estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}