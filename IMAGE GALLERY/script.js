const cards = document.querySelectorAll(".gallery-card");
const filterButtons = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const imageTitle = document.getElementById("imageTitle");
const imageCategory = document.getElementById("imageCategory");
const counter = document.getElementById("counter");

let activeCards = Array.from(cards);
let currentIndex = 0;
 
cards.forEach(card => {
    card.addEventListener("click", () => {
        activeCards = Array.from(cards).filter(item => !item.classList.contains("hide"));
        currentIndex = activeCards.indexOf(card);
        openLightbox();
    });    
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filterValue = button.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        cards.forEach(card => {
            const category = card.dataset.category;

            if (filterValue === "all" || category === filterValue) {
                card.classList.remove("hide");
            } else {
                card.classList.add("hide");
            }
        });

        activeCards = Array.from(cards).filter(card => !card.classList.contains("hide"));
    });
});

function openLightbox() {
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    updateLightbox();
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
}

function updateLightbox() {
    const card = activeCards[currentIndex];
    const img = card.querySelector("img");
    const title = card.querySelector("h3").textContent;
    const category = card.dataset.category;

    lightboxImg.src = img.src;
    imageTitle.textContent = title;
    imageCategory.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    counter.textContent = `${currentIndex + 1} / ${activeCards.length}`;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % activeCards.length;
    updateLightbox();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + activeCards.length) % activeCards.length;
    updateLightbox();
}

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", prevImage);

lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
        closeLightbox();
    }

    if (e.key === "ArrowRight") {
        nextImage();
    }

    if (e.key === "ArrowLeft") {
        prevImage();
    }
});