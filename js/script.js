document.addEventListener("DOMContentLoaded", () => {
  // 0. Splitting.js Init
  Splitting();

  // 0.5 Swiper Init
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    keyboard: {
      enabled: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is >= 992px
      992: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });

  // 0. Typed.js Initialization
  if (document.querySelector(".typed-text")) {
    var typed = new Typed(".typed-text", {
      strings: ["Developer", "Designer", "Problem Solver", "Nigeria"],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
      backDelay: 2000,
    });
  }

  // 0.5 3D Tilt Effect for Project Cards & Experience Cards
  const projectCards = document.querySelectorAll(".playful-card:not(.askew-card)");
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (max 10 degrees)
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transition = "none"; // Disable transition for instant response
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      card.style.zIndex = "10";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.5s ease"; // Smooth reset
      card.style.transform = ""; // Reset to CSS default
      card.style.zIndex = "1";
    });
  });
  // 1. Scroll Animations (using animate.css)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add Animate.css classes
        entry.target.classList.add("animate__animated", "animate__fadeInUp");
        entry.target.classList.remove("opacity-0"); // Ensure it becomes visible
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Select elements to animate
  const animatedElements = document.querySelectorAll(
    ".card, .hero-text h2, .hero-text p, .section-title, .btn:not(.nav-link)"
  );
  animatedElements.forEach((el) => {
    el.classList.add("opacity-0"); // Hide initially
    // el.classList.add("fade-in-up"); // Remove old custom class
    observer.observe(el);
  });

  // 2. Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // 3. Playful Form Handler
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      const statusDiv = document.getElementById("formStatus");
      const data = new FormData(contactForm);

      // Quick playful animation
      btn.innerText = "🚀 Sending...";
      btn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: data,
          headers: {
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          // Success
          btn.innerText = "Sent!";
          btn.classList.remove("btn-dark");
          btn.classList.add("btn-outline-dark");

          statusDiv.innerHTML =
            "<strong>Message sent!</strong> Thanks for reaching out.";
          statusDiv.classList.add("text-success");

          contactForm.reset();


          // Confetti Celebration!
          celebrate();

          setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.classList.add("btn-dark");
            btn.classList.remove("btn-outline-dark");
            // clear status after a while
            setTimeout(() => {
              statusDiv.innerHTML = "";
              statusDiv.classList.remove("text-success");
            }, 3000);
          }, 4000);
        } else {
          // Service Error
          const result = await response.json();
          statusDiv.innerHTML = "Oops! could not send.";
          statusDiv.classList.add("text-danger");
          if (Object.hasOwn(result, "errors")) {
            statusDiv.innerHTML = result["errors"]
              .map((error) => error["message"])
              .join(", ");
          }
          throw new Error("Form submission failed");
        }
      } catch (error) {
        // Network Error
        btn.innerText = "Retry";
        btn.disabled = false;
        if (!statusDiv.innerHTML) {
          statusDiv.innerHTML = "Oops! Something went wrong.";
          statusDiv.classList.add("text-danger");
        }
        setTimeout(() => {
          statusDiv.innerHTML = "";
          statusDiv.classList.remove("text-danger");
        }, 5000);
      }
    });

  }
});

// Simple Confetti Function
function celebrate() {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    // Launch a few confetti from the left edge
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#000000', '#444444', '#aaaaaa'] // B&W Theme
    });
    // and a few from the right edge
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#000000', '#444444', '#aaaaaa']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// Minimal Confetti Polyfill/implementation (if library not present, we build a tiny one)
// Since we don't have a confetti library file, I'll inject a tiny one here or use a simple DOM approach.
// actually, let's just make a simple DOM-based confetti spawner since I can't rely on 'confetti' global function existing.
function confetti({ particleCount, origin, colors }) {
  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.width = '8px';
    el.style.height = '8px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = (origin.x * 100) + 'vw';
    el.style.top = '50%'; // Start from middle side
    if (origin.x === 0) el.style.top = '80%'; // Adjust based on mock usage
    el.style.top = '90%'; // Just shoot from bottom corners?
    
    // Better implementation:
    el.style.left = (origin.x === 0 ? '0' : '100vw');
    el.style.top = '80vh';
    
    document.body.appendChild(el);

    // Animate
    const angle = origin.x === 0 ? 45 + Math.random() * 45 : 135 - Math.random() * 45;
    const velocity = 10 + Math.random() * 10;
    const rad = angle * (Math.PI / 180);
    let vx = Math.cos(rad) * velocity;
    let vy = -Math.sin(rad) * velocity;
    let gravity = 0.5;

    let x = origin.x === 0 ? 0 : window.innerWidth;
    let y = window.innerHeight * 0.8;

    const animate = () => {
      vx *= 0.99; // Drag
      vy += gravity;
      x += vx;
      y += vy;

      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.transform = `rotate(${Math.random() * 360}deg)`;

      if (y < window.innerHeight) {
        requestAnimationFrame(animate);
      } else {
        el.remove();
      }
    };
    animate();
  }
}
