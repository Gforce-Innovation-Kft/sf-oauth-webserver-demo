// Shared JavaScript utilities for all pages
(function () {
  "use strict";

  // Mobile menu toggle with accessibility
  function initMobileMenu() {
    const mobileMenuButton = document.querySelector(".mobile-menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", function () {
        const isExpanded = mobileMenu.classList.contains("hidden");
        mobileMenu.classList.toggle("hidden");
        mobileMenuButton.setAttribute("aria-expanded", isExpanded.toString());
      });

      // Close menu when clicking outside
      document.addEventListener("click", function (event) {
        if (
          !mobileMenuButton.contains(event.target) &&
          !mobileMenu.contains(event.target)
        ) {
          mobileMenu.classList.add("hidden");
          mobileMenuButton.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  // Smooth scrolling for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          // Close mobile menu if open
          const mobileMenu = document.querySelector(".mobile-menu");
          if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
            mobileMenu.classList.add("hidden");
          }
        }
      });
    });
  }

  // Header scroll effect
  function initHeaderScroll() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        nav.classList.add("backdrop-blur-xl", "bg-dark-900/90");
      } else {
        nav.classList.remove("backdrop-blur-xl", "bg-dark-900/90");
      }
    });
  }

  // Reveal animations on scroll
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 },
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      // Fallback for browsers without IntersectionObserver
      revealElements.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // Initialize all features when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initMobileMenu();
      initSmoothScroll();
      initHeaderScroll();
      initRevealAnimations();
    });
  } else {
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initRevealAnimations();
  }

  // Export for use in other scripts
  window.GforceUtils = {
    initMobileMenu,
    initSmoothScroll,
    initHeaderScroll,
    initRevealAnimations,
  };
})();
