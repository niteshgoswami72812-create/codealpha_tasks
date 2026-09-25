
const cards = document.querySelectorAll(".gallery-card");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

const imageTitle = document.getElementById("imageTitle");
const imageCategory = document.getElementById("imageCategory");
const counter = document.getElementById("counter");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


let visibleCards = [...cards];

let currentIndex = 0;


/* =========================
   3D CARD TILT
========================= */

cards.forEach(card => {

    const inner = card.querySelector(".card-inner");
    const shine = card.querySelector(".shine");

    card.addEventListener("mousemove", event => {

        const rect = card.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;


        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;


        const rotateY =
            ((x - centerX) / centerX) * 10;

        const rotateX =
            ((centerY - y) / centerY) * 10;


        inner.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.025,1.025,1.025)
        `;


        const shineX =
            (x / rect.width) * 100;

        const shineY =
            (y / rect.height) * 100;


        shine.style.background = `
            radial-gradient(
                circle at ${shineX}% ${shineY}%,
                rgba(255,255,255,0.35),
                transparent 35%
            )
        `;

    });


    card.addEventListener("mouseleave", () => {

        inner.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1,1,1)
        `;

        shine.style.background = `
            linear-gradient(
                120deg,
                transparent 25%,
                rgba(255,255,255,0.2) 45%,
                transparent 60%
            )
        `;

    });

});


/* =========================
   FILTER
========================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        const filter =
            button.dataset.filter;


        visibleCards = [];


        cards.forEach(card => {

            const category =
                card.dataset.category;


            if (
                filter === "all" ||
                category === filter
            ) {

                card.classList.remove("hidden");

                visibleCards.push(card);

            } else {

                card.classList.add("hidden");

            }

        });

    });

});


/* =========================
   OPEN LIGHTBOX
========================= */

cards.forEach(card => {

    card.addEventListener("click", () => {

        if (card.classList.contains("hidden")) {
            return;
        }


        visibleCards =
            [...document.querySelectorAll(
                ".gallery-card:not(.hidden)"
            )];


        currentIndex =
            visibleCards.indexOf(card);


        showImage();

    });

});


function showImage() {

    if (!visibleCards.length) {
        return;
    }


    const card =
        visibleCards[currentIndex];


    const image =
        card.querySelector("img");


    const title =
        card.querySelector("h3");


    const category =
        card.querySelector(".category");


    lightboxImg.src =
        image.src;


    lightboxImg.alt =
        image.alt;


    imageTitle.textContent =
        title.textContent;


    imageCategory.textContent =
        category.textContent;


    counter.textContent =
        `${currentIndex + 1} / ${visibleCards.length}`;


    lightbox.classList.add("active");


    document.body.style.overflow =
        "hidden";

}


/* =========================
   NEXT
========================= */

function nextImage() {

    if (!visibleCards.length) {
        return;
    }


    currentIndex++;


    if (
        currentIndex >=
        visibleCards.length
    ) {

        currentIndex = 0;

    }


    showImage();

}


nextBtn.addEventListener(
    "click",
    nextImage
);


/* =========================
   PREVIOUS
========================= */

function previousImage() {

    if (!visibleCards.length) {
        return;
    }


    currentIndex--;


    if (currentIndex < 0) {

        currentIndex =
            visibleCards.length - 1;

    }


    showImage();

}


prevBtn.addEventListener(
    "click",
    previousImage
);


/* =========================
   CLOSE
========================= */

function closeLightbox() {

    lightbox.classList.remove("active");

    document.body.style.overflow =
        "";

}


closeBtn.addEventListener(
    "click",
    closeLightbox
);


/* =========================
   CLICK BACKGROUND
========================= */

lightbox.addEventListener(
    "click",
    event => {

        if (
            event.target.classList
                .contains("lightbox-bg")
        ) {

            closeLightbox();

        }

    }
);


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !lightbox.classList
                .contains("active")
        ) {

            return;

        }


        if (event.key === "Escape") {

            closeLightbox();

        }


        if (event.key === "ArrowRight") {

            nextImage();

        }


        if (event.key === "ArrowLeft") {

            previousImage();

        }

    }
);


/* =========================
   TOUCH SWIPE
========================= */

let touchStartX = 0;


lightbox.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.touches[0].clientX;

    }
);


lightbox.addEventListener(
    "touchend",
    event => {

        const touchEndX =
            event.changedTouches[0].clientX;


        const difference =
            touchStartX - touchEndX;


        if (Math.abs(difference) < 50) {
            return;
        }


        if (difference > 0) {

            nextImage();

        } else {

            previousImage();

        }

    }
);