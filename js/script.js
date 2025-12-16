document.addEventListener("DOMContentLoaded", () => {
  // 1. Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Select elements to animate
  const animatedElements = document.querySelectorAll(
    ".card, .hero-text, .hero-image, .section-title, p, .btn"
  );
  animatedElements.forEach((el) => {
    el.classList.add("fade-in-up");
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
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      const statusDiv = document.getElementById("formStatus");

      // Quick playful animation
      btn.innerText = "🚀 Sending...";
      btn.disabled = true;

      setTimeout(() => {
        btn.innerText = "Sent!";
        btn.classList.remove("btn-dark");
        btn.classList.add("btn-outline-dark");

        statusDiv.innerHTML =
          "<strong>Message 'sent'!</strong> (This is a demo)";
        statusDiv.classList.add("text-success");

        // Simulate mailto open (as described in HTML)
        // In a real app we'd trigger the mailto here or send an API request
        // window.location.href = `mailto:dvsolaniyi@gmail.com...`;

        setTimeout(() => {
          btn.innerText = originalText;
          btn.disabled = false;
          btn.classList.add("btn-dark");
          btn.classList.remove("btn-outline-dark");
          contactForm.reset();
          statusDiv.innerHTML = "";
          statusDiv.classList.remove("text-success");
        }, 3000);
      }, 1500);
    });
  }
});
