document.addEventListener('DOMContentLoaded', function() {
    // Código do carrossel existente
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

    // Event listeners para os botões
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

    // Controle do Menu Mobile
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

    // CORREÇÃO: Fechar menu apenas ao clicar em links de subcategorias ou categorias sem subcategorias
    // Links de subcategorias (dentro de .subcategory-list)
    const subcategoryLinks = mobileNav.querySelectorAll('.subcategory-list a');
    subcategoryLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Links de categorias que NÃO possuem subcategorias (não possuem a classe .has-subcategory)
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


