document.addEventListener('DOMContentLoaded', function() {
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
        }, 5000); // Muda a cada 5 segundos
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Inicia o autoplay
    startInterval();

    // Pausa o autoplay quando o mouse está sobre o carrossel
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    // Reinicia o autoplay quando o mouse sai do carrossel
    carousel.addEventListener('mouseleave', () => {
        startInterval();
    });
}); 