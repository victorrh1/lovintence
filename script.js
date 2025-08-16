// ===== VARIÁVEIS DO CARRINHO =====
const cartModal = document.getElementById('carrinho');
const closeCart = document.querySelector('.close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.getElementById('cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    // ===== INICIALIZAÇÃO DO CARRINHO =====
    setupCartEventListeners();
    loadCartFromStorage();
    updateCartUI();

    // ===== CARROSSEL =====
    const carousel = document.querySelector('.banner-carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;

    // Inicializa o primeiro slide
    slides[0].classList.add('active');

    // Função para mudar o slide
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Função para abrir e fechar as subcategorias
    document.querySelectorAll('.has-subcategory > a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const parent = this.parentElement;
            parent.classList.toggle('open');
        });
    });

    // Event listeners para os botões do carrossel
    prevButton.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetInterval();
    });

    nextButton.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetInterval();
    });

    // Event listeners para os dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
    });

    // Autoplay
    function startInterval() {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    startInterval();

    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        startInterval();
    });

    // ===== CONTROLE DO MENU MOBILE =====
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const body = document.body;

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    body.appendChild(overlay);

    function toggleMenu() {
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    const subcategoryLinks = mobileNav.querySelectorAll('.subcategory-list a');
    subcategoryLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    const singleCategoryLinks = mobileNav.querySelectorAll('li:not(.has-subcategory) > a');
    singleCategoryLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// ===== FUNÇÕES DO SISTEMA DE CARRINHO  =====

function setupCartEventListeners() {
    console.log('Configurando event listeners do carrinho...');
    
    // Botões "Adicionar ao Carrinho"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Fechar carrinho
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    // ===== Abrir carrinho - AMBOS OS ÍCONES (DESKTOP E MOBILE) =====
    const cartIcons = document.querySelectorAll('.cart-icon');
    console.log(`Configurando ${cartIcons.length} ícones de carrinho`);
    
    cartIcons.forEach((cartIcon, index) => {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Carrinho clicado (ícone ${index + 1})`);
            if (cartModal) {
                cartModal.classList.add('active');
            } else {
                console.error('Modal do carrinho não encontrado!');
            }
        });
    });

    // Fechar carrinho clicando fora do modal
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Limpar carrinho
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Finalizar compra
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

// Adicionar item ao carrinho
function addToCart(e) {
    const serviceCard = e.target.closest('.service-card');
    const serviceId = parseInt(serviceCard.dataset.id);
    const serviceName = serviceCard.querySelector('h3').textContent;
    const servicePrice = parseFloat(serviceCard.dataset.price);

    // Verificar se o serviço já está no carrinho
    const existingItem = cart.find(item => item.id === serviceId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: serviceId,
            name: serviceName,
            price: servicePrice,
            quantity: 1
        });
    }

    // Notificação de item adicionado
    showNotification(`${serviceName} adicionado ao carrinho!`);

    // Atualizar carrinho
    saveCartToStorage();
    updateCartUI();
}

// ===== interface do carrinho com sincronização mobile =====
function updateCartUI() {
    // Atualizar contagem de itens
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // carrinho - Desktop
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // carrinho - Mobile
    const cartCountMobile = document.getElementById('cart-count-mobile');
    if (cartCountMobile) {
        cartCountMobile.textContent = totalItems;
    }

    // Atualizar itens no modal
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">+</button>
                        <button class="remove" data-id="${item.id}">🗑️</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
    }

    // Atualizar preço total
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    if (cartTotalPrice) {
        cartTotalPrice.textContent = `R$ ${totalPrice.toFixed(2)}`;
    }

    // Configurar botões de ação em cada item
    setupCartItemButtons();
}

// Config botões dos itens do carrinho
function setupCartItemButtons() {
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', decreaseItemQuantity);
    });
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', increaseItemQuantity);
    });
    document.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

// Diminuir quantidade do item
function decreaseItemQuantity(e) {
    const id = parseInt(e.target.dataset.id);
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    saveCartToStorage();
    updateCartUI();
}

// Aumentar quantidade do item
function increaseItemQuantity(e) {
    const id = parseInt(e.target.dataset.id);
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity++;
    }
    saveCartToStorage();
    updateCartUI();
}

// Remover item do carrinho
function removeItem(e) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.filter(i => i.id !== id);
    saveCartToStorage();
    updateCartUI();
}

// Limpar carrinho completamente
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartUI();
    showNotification('Carrinho limpo com sucesso!');
}

// ===== PERSISTÊNCIA DE DADOS do CARRINHO =====

// Salvar carrinho no localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Carregar carrinho do localStorage
function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// ===== FUNCIONALIDADES CARRINHO DE CHECKOUT =====

// Prosseguir para checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Adicione produtos ao carrinho antes de finalizar a compra.');
        return;
    }

    // oque falta implementar:
    // 1. Redirecionar para página de checkout
    // 2. Abrir modal de checkout
    // 3. Integrar com gateway de pagamento
    
    // Exemplo de redirecionamento:
    // window.location.href = '/checkout';
    
    // Exemplo de dados para enviar ao checkout:
    const checkoutData = {
        items: cart,
        total: getCartTotal(),
        itemCount: getCartItemCount()
    };
    
    console.log('Dados do checkout:', checkoutData);
    showNotification('Redirecionando para o checkout...');
    
    // Implementar lógica de checkout....EM CONSTRUÇÃO
}

// Mostrar notificação
function showNotification(message) {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// ===== FUNÇÕES de utilidades CARRINHO =====

// Obter total de itens no carrinho
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Obter valor total do carrinho
function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Verificar se um item está no carrinho
function isItemInCart(itemId) {
    return cart.some(item => item.id === itemId);
}

// Obter item do carrinho por ID
function getCartItem(itemId) {
    return cart.find(item => item.id === itemId);
}

// auto copyright
document.getElementById("copyright-year").textContent = new Date().getFullYear();