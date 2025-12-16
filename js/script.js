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
          }, 3000);
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
