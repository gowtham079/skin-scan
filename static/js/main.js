(function () {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      all ? selectEl.forEach(e => e.addEventListener(type, listener)) : selectEl.addEventListener(type, listener);
    }
  };

  const onscroll = (el, listener) => el.addEventListener("scroll", listener);

  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;
    if (!header.classList.contains("header-scrolled")) offset -= 16;
    let elementPos = select(el).offsetTop;
    window.scrollTo({ top: elementPos - offset, behavior: "smooth" });
  };

  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      window.scrollY > 100 ? selectHeader.classList.add("header-scrolled") : selectHeader.classList.remove("header-scrolled");
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      window.scrollY > 100 ? backtotop.classList.add("active") : backtotop.classList.remove("active");
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }


  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  on("click", ".navbar .dropdown > a", function (e) {
    if (select("#navbar").classList.contains("navbar-mobile")) {
      e.preventDefault();
      this.nextElementSibling.classList.toggle("dropdown-active");
    }
  }, true);

  on("click", ".scrollto", function (e) {
    if (select(this.hash)) {
      e.preventDefault();
      let navbarCollapse = document.getElementById("navbarResponsive");
      if (navbarCollapse && navbarCollapse.classList.contains("show") && window.bootstrap) {
        let bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          new bootstrap.Collapse(navbarCollapse).hide();
        }
      }
      let navbar = select("#navbar");
      if (navbar && navbar.classList.contains("navbar-mobile")) {
        navbar.classList.remove("navbar-mobile");
        let navbarToggle = select(".mobile-nav-toggle");
        if (navbarToggle) {
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
      }
      scrollto(this.hash);
    }
  }, true);

  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  let preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => preloader.remove());
  }

  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    slidesPerView: "auto",
    pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 40 },
      1200: { slidesPerView: 3, spaceBetween: 40 }
    }
  });

  const portfolioLightbox = GLightbox({ selector: ".portfolio-lightbox" });

  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", type: "bullets", clickable: true }
  });

  window.addEventListener("load", () => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true, mirror: false });
  });

  myForm.addEventListener("submit", e => {
    e.preventDefault();
    const endpoint = "/upload";
    const formData = new FormData();
    formData.append("user-img", inpImg.files[0]);

    fetch(endpoint, {
      method: "post",
      body: formData
    })
    .then(response => response.json())
    .then((data) => {
      const diseaseInfo = {
        "Eczema": {
          cause: "Genetic factors, allergens, or immune system dysfunction.",
          cure: "Use moisturizers, corticosteroid creams, and avoid triggers."
        },
        "Psoriasis": {
          cause: "Overactive immune system causing skin cell buildup.",
          cure: "Topical treatments, light therapy, or medications."
        },
        "Acne": {
          cause: "Clogged hair follicles from oil and dead skin cells.",
          cure: "Topical creams, salicylic acid, or dermatologist treatment."
        },
        "Ringworm": {
          cause: "Fungal infection caused by dermatophytes.",
          cure: "Antifungal creams or oral medication."
        }
      };

      const resultDiv = document.getElementById("result");
      const predictedDisease = data["result"];
      const info = diseaseInfo[predictedDisease];

      if (info) {
        resultDiv.innerHTML = `
          <div style="border:2px solid green; background:#eaffea; padding:15px; border-radius:10px; font-family:Arial;">
            <h2>🦠 Disease Detected: ${predictedDisease}</h2>
            <p><strong>📌 Cause:</strong> ${info.cause}</p>
            <p><strong>💊 Cure:</strong> ${info.cure}</p>
          </div>
        `;
      } else {
        resultDiv.innerHTML = `
          <div style="border:2px solid red; background:#ffeaea; padding:15px; border-radius:10px; font-family:Arial;">
            <h2>🦠 Disease Detected: ${predictedDisease}</h2>
            <p>No additional info available for this condition.</p>
          </div>
        `;
      }
    });
  });

  new PureCounter();
})();

function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      $('#imageResult').attr('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

$(function () {
  $('#upload').on('change', function () {
    readURL(this);
  });
});
