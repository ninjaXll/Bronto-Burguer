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

// Carrinho de Compras
let cart = [];

// Função para salvar o carrinho no localStorage
function saveCart() {
  localStorage.setItem('bronto-cart', JSON.stringify(cart));
}

// Função para carregar o carrinho do localStorage
function loadCart() {
  const savedCart = localStorage.getItem('bronto-cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartCount(); // Atualiza o contador do ícone do carrinho
  updateAllQuantitiesDisplay(); // Atualiza todos os contadores dos botões
}

// Função para atualizar a contagem no ícone do carrinho
function updateCartCount() {
  const cartCounterElements = document.querySelectorAll('.cart-counter'); // Atualiza todos os elementos com essa classe
  cartCounterElements.forEach(element => {
    element.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  });

  // Atualiza também o contador no cabeçalho
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// Função para atualizar a exibição de quantidade em todos os itens do cardápio
function updateAllQuantitiesDisplay() {
  document.querySelectorAll('.quantity').forEach(qtyElement => {
    const itemName = qtyElement.closest('.menu-item')?.querySelector('.add-to-cart')?.getAttribute('data-name');
    if (itemName) {
      const itemInCart = cart.find(item => item.name === itemName);
      qtyElement.textContent = itemInCart ? itemInCart.quantity : '0';
    }
  });
}


// Função para adicionar item ao carrinho
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      image,
      quantity: 1
    });
  }

  saveCart();
  updateCartCount(); // Atualiza o contador do ícone
  updateAllQuantitiesDisplay(); // Atualiza todos os contadores dos botões

  // Feedback visual ao adicionar item
  const buttons = document.querySelectorAll(`.add-to-cart[data-name="${name}"]`);
  buttons.forEach(button => {
    button.style.transform = 'scale(1.2)';
    button.style.backgroundColor = '#e55a2b';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
      button.style.backgroundColor = '';
    }, 200);
  });
}

// Função para remover item do carrinho
function removeFromCart(name) {
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }

    saveCart();
    updateCartCount(); // Atualiza o contador do ícone
    updateAllQuantitiesDisplay(); // Atualiza todos os contadores dos botões
    
    // Feedback visual ao remover item
    const removeButtons = document.querySelectorAll(`.remove-from-cart[data-name="${name}"]`);
    removeButtons.forEach(button => {
      button.style.transform = 'scale(1.2)';
      button.style.backgroundColor = '#e55a2b';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.backgroundColor = '';
      }, 200);
    });
  }

}

// Carrega o carrinho quando a página é aberta
document.addEventListener('DOMContentLoaded', function() {
  loadCart();

  // Adiciona evento aos botões "Adicionar ao Carrinho"
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const name = this.getAttribute('data-name');
      const price = parseFloat(this.getAttribute('data-price'));
      const image = this.getAttribute('data-image');
      addToCart(name, price, image);
    });
  });

  // Adiciona evento aos botões de remoção (se existirem)
  document.querySelectorAll('.remove-from-cart').forEach(button => {
    button.addEventListener('click', function() {
      const name = this.getAttribute('data-name');
      removeFromCart(name);
    });
  });
});
