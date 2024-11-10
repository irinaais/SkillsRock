const IMG_WIDTH = 500;
const SLIDE_INTERVAL_MS = 3000;
const images = document.querySelectorAll('.carousel__image');
const prevButton = document.querySelector('.carousel__button_prev');
const nextButton = document.querySelector('.carousel__button_next');
let currentIndex = 0;

// Функция для обновления видимого изображения
function updateCarousel() {
  const offset = -currentIndex * IMG_WIDTH;
  document.querySelector('.carousel__images').style.transform = `translateX(${offset}px)`;
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel();
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateCarousel();
}

let autoSlide = setInterval(showNextImage, SLIDE_INTERVAL_MS);

// Сброс автопрокрутки при ручной смене изображения
function resetAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(showNextImage, SLIDE_INTERVAL_MS);
}

nextButton.addEventListener('click', () => {
  showNextImage();
  resetAutoSlide();
});

prevButton.addEventListener('click', () => {
  showPrevImage();
  resetAutoSlide();
});
