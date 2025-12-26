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
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) {
    console.warn("Nenhum slide encontrado para o carrossel.");
    return; // Sai da função se não houver slides
  }

  let currentSlide = 0;
  const totalSlides = slides.length;

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
  console.log('Carrinho salvo:', cart);
}

// Função para carregar o carrinho do localStorage
function loadCart() {
  const savedCart = localStorage.getItem('bronto-cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartCount(); // Atualiza o contador do ícone do carrinho
  updateAllQuantitiesDisplay(); // Atualiza todos os contadores dos botões

  // Verifica se está na página de carrinho para carregar os itens
  if (window.location.pathname.includes('carrinho.html')) {
    loadCartItems();
  }
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
  showToast(`${name} adicionado ao carrinho! 🍔`);
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

// Função para carregar e exibir os itens do carrinho na página de carrinho
function loadCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartEmptyContainer = document.getElementById('cart-empty');
  const cartTotalContainer = document.getElementById('cart-total');
  const saveCart =localStorage.getItem('bronto-cart');
  if (saveCart) {
    cart = JSON.parse(saveCart);
    console.log('Carrinho carregado na página de carrinho:', cart);
  }

  updateCartCount(); // Atualiza o contador do ícone
  updateAllQuantitiesDisplay();

  if (cart.length === 0) {
    cartItemsContainer.style.display = 'none';
    cartEmptyContainer.style.display = 'block';
    cartTotalContainer.textContent = 'Total: R$ 0,00';
  } else {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>${item.quantity}x</p>
          </div>
        </div>
        <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });

    cartTotalContainer.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
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

  // Verifica se está na página de carrinho para inicializar o formulário
  if (window.location.pathname.includes('carrinho.html')) {
    initializeCheckoutForm();
  }
});

// Função para inicializar o formulário de checkout na página de carrinho
function initializeCheckoutForm() {
  const pedidoForm = document.getElementById('pedido-form');
  const orderTypeSelect = document.getElementById('order-type');
  const deliveryInfoDiv = document.getElementById('delivery-info');
  const paymentMethodSelect = document.getElementById('payment-method');
  const trocoInfoDiv = document.getElementById('troco-info');

  if (!pedidoForm) return; // Sai se o formulário não existir

  //Evento para Alterar o tipo de pedido.
  orderTypeSelect.addEventListener('change', function(){
    if(this.value === 'entrega'){
      deliveryInfoDiv.style.display = 'block';
    } else {
      deliveryInfoDiv.style.display = 'none';
    }
  });
  
  // Evento para alterar a forma de pagamento
  paymentMethodSelect.addEventListener('change', function(){
    if(this.value === 'dinheiro'){
      trocoInfoDiv.style.display = 'block';
    } else {
      trocoInfoDiv.style.display = 'none';
    }
  });

  // Evento para submeter o formulário
  pedidoForm.addEventListener('submit', function(e){
    e.preventDefault();

    const formData = {
      customerName: document.getElementById('customer-name').value.trim(),
      orderType: orderTypeSelect.value,
      address: document.getElementById('address').value.trim(),
      paymentMethod: paymentMethodSelect.value,
      changeValue: document.getElementById('troco-value').value.trim(),
      items: cart,
      total: parseFloat(document.getElementById('cart-total').textContent.replace('Total: R$ ', '').replace(',', '.'))
    };

    //Validação Simples
    if(!formData.customerName || !formData.orderType || !formData.paymentMethod){
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if(formData.orderType === 'entrega' && !formData.address){
      alert('Por favor, insira o endereço de entrega.');
      return;
    }
    if(formData.paymentMethod === 'dinheiro' && !formData.changeValue){
      alert('Por favor, insira o valor do troco.');
      return;
    }

    //Envia os dados para o back-end (substitua a url real do seu backend quando disponível)
    const backendUrl = 'https://meu-backend-bronto.onrender.com/api/pedidos'; // Removi os espaços extras

    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if(!response.ok){ // <-- Correção: jogar erro se NÃO for ok
        return response.json().then(err => {throw new Error(err.message || 'Erro na resposta do servidor')}); // Corrigido: err.message
      }
      return response.json();
    })
    .then(data => {
      //Sucesso
      alert('Pedido enviado com sucesso! Acompanhe o status aqui no Site');
      //Opcional: Limpar o carrinho após o envio
      cart = [];
      saveCart();
      updateCartCount();
      //Recarregar a página para refletir o carrinho Vazio
      location.reload();
    })
    .catch(error => {
      console.error('Erro ao enviar o pedido:', error);
      alert('Houve um erro ao enviar seu pedido. Por favor, tente novamente mais tarde.');
    });
  });
}

/* ==========================================================================
   #PÁGINA DE ACOMPANHAMENTO
   ========================================================================== */
    // Função para carregar o carrinho ao carregar a página
    document.addEventListener('DOMContentLoaded', function() {
      loadCart(); // Carrega o carrinho e atualiza o contador

      const trackOrderForm = document.getElementById('track-order-form');
      const orderNumberInput = document.getElementById('order-number');
      const orderStatusDiv = document.getElementById('order-status');

      trackOrderForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário

        const orderNumber = orderNumberInput.value.trim();

        if (!orderNumber) {
          alert('Por favor, insira o número do pedido.');
          return;
        }

        // Exemplo de status (quando o backend estiver pronto, substitua por uma chamada fetch)
        // Exemplo de chamada fetch para o backend:
        /*
        fetch('https://meu-backend-bronto.onrender.com/api/pedidos/' + orderNumber)
          .then(response => {
            if (!response.ok) {
              throw new Error('Pedido não encontrado');
            }
            return response.json();
          })
          .then(data => {
            orderStatusDiv.innerHTML = `
              <h3>Pedido #${data.numero}</h3>
              <p><strong>Cliente:</strong> ${data.cliente}</p>
              <p><strong>Status:</strong> ${data.status}</p>
              <p><strong>Itens:</strong> ${data.itens.map(item => item.nome).join(', ')}</p>
              <p><strong>Total:</strong> R$ ${data.total}</p>
            `;
          })
          .catch(error => {
            orderStatusDiv.innerHTML = `<p class="error">Erro: ${error.message}</p>`;
          });
        */

        // Exemplo de status temporário (até o backend estar pronto)
        orderStatusDiv.innerHTML = `
          <h3>Pedido #${orderNumber}</h3>
          <p><strong>Status:</strong> Em Preparo</p>
          <p><strong>Previsão de Entrega:</strong> Em 25 minutos</p>
          <p><strong>Forma de Pagamento:</strong> Cartão de Crédito</p>
        `;
      });
    });

    /* ==========================================================================
   #Notificação TOAST
   ========================================================================== */

   // Função para exibir notificações Toast
function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message; // Define o texto (ex: "X-Burger adicionado!")
    toast.className = "show";    // Mostra
    
    // Esconde depois de 3 segundos
    setTimeout(function(){ 
      toast.className = toast.className.replace("show", ""); 
    }, 3000);
  }
}