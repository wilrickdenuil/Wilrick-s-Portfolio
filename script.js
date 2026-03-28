// navbar
const mainNav = document.getElementById("main-nav");
const SCROLL_THRESHOLD = 60;
 
function updateNav() {
  if (window.scrollY > SCROLL_THRESHOLD) {
    mainNav.classList.add("scrolled");
  } else {
    mainNav.classList.remove("scrolled");
  }
}
 
window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

// carousel
const carousel = document.querySelector(".carousel");
const leftBtn = document.querySelector(".scroll-btn.left");
const rightBtn = document.querySelector(".scroll-btn.right");

// functie om knoppen te tonen/verbergen
function updateButtons() {
  const isOverflowing = carousel.scrollWidth > carousel.clientWidth + 2;
  carousel.classList.toggle("overflowing", isOverflowing);

  if (carousel.scrollLeft <= 1) {
    leftBtn.style.display = "none";
  } else {
    leftBtn.style.display = "block";
  }

  if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
    rightBtn.style.display = "none";
  } else {
    rightBtn.style.display = "block";
  }
}

// scroll naar rechts
rightBtn.addEventListener("click", () => {
  carousel.scrollBy({
    left: 300,
    behavior: "smooth"
  });
});

// scroll naar links
leftBtn.addEventListener("click", () => {
  carousel.scrollBy({
    left: -300,
    behavior: "smooth"
  });
});

// check tijdens scroll
carousel.addEventListener("scroll", updateButtons);

// check bij resize
window.addEventListener("resize", updateButtons);

// eerste check bij laden
updateButtons();

// footer
document.querySelectorAll('.footer-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const collapsible = toggle.closest('.flex-item-footer').querySelector('.footer-collapsible');
    if (!collapsible) return;

    toggle.classList.toggle('open');
    collapsible.classList.toggle('open');
  });
});