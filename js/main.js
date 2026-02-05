// Time-based theme system - dynamically changes based on actual time
function updateTheme() {
  const currentHour = new Date().getHours();
  const bodyElement = document.body;
  const themeBadge = document.getElementById("themeBadge");

  let themeClass, themeIcon, themeLabel;

  // Morning: 5 AM - 11:59 AM
  if (currentHour >= 5 && currentHour < 12) {
    themeClass = "morning";
    themeIcon = "🌅";
    themeLabel = "Morning";
  }
  // Afternoon: 12 PM - 4:59 PM
  else if (currentHour >= 12 && currentHour < 17) {
    themeClass = "afternoon";
    themeIcon = "☀️";
    themeLabel = "Afternoon";
  }
  // Evening: 5 PM - 7:59 PM
  else if (currentHour >= 17 && currentHour < 20) {
    themeClass = "evening";
    themeIcon = "🌆";
    themeLabel = "Evening";
  }
  // Night: 8 PM - 4:59 AM
  else {
    themeClass = "night";
    themeIcon = "🌙";
    themeLabel = "Night";
  }

  // Apply the theme to body
  bodyElement.className = themeClass;
  themeBadge.textContent = `${themeIcon} ${themeLabel}`;
  console.log(`Theme updated to: ${themeLabel} at ${currentHour}:00`);
}

// Animate flip cards as they scroll into view
function initializeScrollAnimation() {
  const flipCards = document.querySelectorAll(".flip-card");

  // Intersection observer for scroll animations
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          cardObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px",
    },
  );

  // Observe each flip card
  flipCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    cardObserver.observe(card);
  });
}

// card click functionality
function enhanceCardInteractivity() {
  const allCards = document.querySelectorAll(".flip-card");

  allCards.forEach((card) => {
    card.addEventListener("click", function () {
      const innerCard = this.querySelector(".flip-card-inner");
      const currentTransform = window.getComputedStyle(innerCard).transform;
      if (
        currentTransform === "none" ||
        currentTransform.includes("matrix(1, 0, 0, 1")
      ) {
        innerCard.style.transform = "rotateY(180deg)";
      } else {
        innerCard.style.transform = "rotateY(0deg)";
      }
    });
  });
}

// Smooth scroll behavior for links
function initializeSmoothScroll() {
  const contactLinks = document.querySelectorAll('a[href^="#"]');

  contactLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      if (targetId !== "#") {
        event.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
}

// Main initialization function
function initializePortfolio() {
  // Set initial theme
  updateTheme();

  // Initialize scroll animations
  initializeScrollAnimation();

  // Enhance card interactivity
  enhanceCardInteractivity();

  // Initialize smooth scrolling
  initializeSmoothScroll();

  // Update theme every minute to reflect time changes
  setInterval(updateTheme, 60000);

  console.log("Portfolio initialized successfully!");
}

// Execute when DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePortfolio);
} else {
  initializePortfolio();
}

// Export functions for potential reuse
export {
  updateTheme,
  initializeScrollAnimation,
  enhanceCardInteractivity,
  initializeSmoothScroll,
};
