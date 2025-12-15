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

    // Função para carregar o carrinho na página de carrinho
    document.addEventListener('DOMContentLoaded', function() {
      loadCart();

      const cartItemsContainer = document.getElementById('cart-items');
      const cartEmptyContainer = document.getElementById('cart-empty');
      const cartTotalContainer = document.getElementById('cart-total');
      const checkoutBtn = document.getElementById('checkout-btn');

      //Elementos do Modal
      const modal = document.getElementById('info-modal');
      const orderForm = document.getElementById('order-form');
      const cancelModal = document.getElementById('cancel-modal');
      const deliveryAddressDiv = document.getElementById('delivery-address');
      const changeSection = document.getElementById('change-section');

      //Referência para os inputs de tipo de Entrega
      const deliveryRadio = document.querySelector('input[name="delivery-type"][value="entrega"]');
      const pickupRadio = document.querySelector('input[name="delivery-type"][value="retirada"]');

      //Referência para os inputs de Forma de pagamento
      const paymentRadios = document.querySelectorAll('input[name="payment-method"]');

      if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartEmptyContainer.style.display = 'block';
        cartTotalContainer.textContent = 'Total: R$ 0,00';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.pointerEvents = 'none';
      } else {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
          total += item.price * item.quantity;
          const itemElement = document.createElement('div');
          itemElement.className = 'cart-item';
          itemElement.innerHTML = `
            <div class="cart-item-info">
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
        
        //Abrir modal ao clicar no botão de checkout
        checkoutBtn.addEventListener('click',function(e){
          e.preventDefault();
          document.getElementById('info-modal').style.display = 'flex';
        });
      }

      //Evento para mostrar/ocultar endereço de entrega
      if(deliveryRadio && pickupRadio){
        deliveryRadio.addEventListener('change', function(){
          if(this.checked){
            document.getElementById('delivery-address').style.display = 'block';
          }
        });

        pickupRadio.addEventListener('change', function(){
          if(this.checked){
            document.getElementById('delivery-address').style.display = 'none';
          }
        });
      }

      //Evento para mostrar/ocultar campo de troco
      paymentRadios.forEach(radio => {
        radio.addEventListener('change', function(){
          if(this.value === 'dinheiro'){
            document.getElementById('change-section').style.display = 'block';
          } else {
            document.getElementById('change-section').style.display = 'none';
          }
        });
      });

      //fechar o modal
      cancelModal.addEventListener('click', function(){
        document.getElementById('info-modal').style.display = 'none';
      });

      //fechar modal ao clicar fora
      window.addEventListener('click', function(e){
        if(e.target === document.getElementById('info-modal')){
          document.getElementById('info-modal').style.display = 'none';
        }
      });

      //Processar envio de formulário
      orderForm.addEventListener('submit', function(e){
        e.preventDefault();

        const formData = {
          name: document.getElementById('customer-name').value,
          deliveryType: document.querySelector('input[name="delivery-type"]:checked').value,
          address: document.getElementById('address').value,
          paymentMethod: document.querySelector('input[name="payment-method"]:checked').value, // Corrigido: obter o valor do radio selecionado
          changeValue: document.getElementById('change-value').value
        };

        if(!formData.name){
          alert('Por favor, insira seu nome completo.');
          return;
        }
        if(!formData.deliveryType){
          alert('Por favor, selecione o tipo de entrega.');
          return;
        }
        if(formData.deliveryType === 'entrega' && !formData.address){
          alert('Por favor, insira o endereço de entrega.');
          return;
        }
        if(!formData.paymentMethod){ // Corrigido: verificar formData.paymentMethod
          alert('Por favor, selecione a forma de pagamento.');
          return;
        }

        //Recalcular total para garantir precisão
        let currentTotal = 0;
        cart.forEach(item => {
          currentTotal += item.price * item.quantity;
        });

      //validação adicional para entrega
      if(formData.deliveryType === 'entrega' && !formData.address.trim()){ // Corrigido: 'entrega' e não 'emtrega'
        alert('Por favor, insira o endereço de entrega.');
        return;
      }


        //Preparar mensagem para o WhatsApp
        let message = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `          🍔 BRONTO BURGER\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        message += `*👤 CLIENTE:* ${formData.name}\n\n`;

        //Itens do pedido
        message += `*🛒 ITENS DO PEDIDO:*\n`;
        cart.forEach(item => {
          let emoji = '🍔';
          if(item.name.includes('Refrigerante')) emoji = '🥤';
          if(item.name.includes('Batata')) emoji = '🍟';
          if(item.name.includes('vegano')) emoji = '🥗';
          if(item.name.includes('T-Rex')) emoji = '🦖';
          message += `- ${item.name} x${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\\n`;
        });

        message += `\n*💰 Total:* R$ ${currentTotal.toFixed(2).replace('.', ',')}\n\n`; // Corrigido: usar currentTotal

        if(formData.deliveryType === 'entrega') {
          message += `*🚚 Tipo de Entrega:* Entrega\n`;
          message += `*📍 Endereço:* ${formData.address}\n\n`;
          message += `*💸 Taxa de Entrega:* R$ 5,00\n`;
          message += `*💵 Total com Entrega:* R$ ${(currentTotal + 5).toFixed(2).replace('.', ',')}\\n\\n`; // Corrigido: usar currentTotal
        } else {
          message += `*🚶 Tipo de Entrega:* Retirada no Local\n\n`;
        }

        //Forma de pagamento
        let paymentText = '';
        switch(formData.paymentMethod){ // Corrigido: usar formData.paymentMethod
          case 'cartao': // Corrigido: remover 'arguments'
            paymentText = 'Cartão de Crédito/Débito';
            break;
          case 'pix':
            paymentText = 'PIX';
            break;
          case 'dinheiro':
            paymentText = 'Dinheiro';
            if(formData.changeValue > 0){
              paymentText += ` (Troco para R$ ${parseFloat(formData.changeValue).toFixed(2).replace('.', ',')})\\n`; // Corrigido: adicionar \\n
            }
            break; 
        }

        message += `*💳 Forma de Pagamento:* ${paymentText}\n`;

        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `      🍔 Obrigado pelo seu pedido! 🍔\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        //Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5571991953918?text=${encodedMessage}`; // Corrigido: remover espaço extra

        //Abrir WhatsApp com a mensagem
        window.open(whatsappUrl, '_blank');

        //fechar o modal
        document.getElementById('info-modal').style.display = 'none';
      });
    });
