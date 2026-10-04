(function () {
  "use strict";

  // Marks JS as available so CSS can gate the fade-in effect behind
  // .js — without this class, [data-fade] content stays fully visible.
  document.documentElement.classList.add("js");

  // Mobile nav toggle
  var toggle = document.querySelector(".site-nav__toggle");
  var navList = document.querySelector(".site-nav__list");
  if (toggle && navList) {
    var toggleLabel = toggle.querySelector(".sr-only");
    var setOpen = function (isOpen) {
      navList.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (toggleLabel) {
        toggleLabel.textContent = toggleLabel.getAttribute(isOpen ? "data-label-close" : "data-label-open");
      }
    };
    toggle.addEventListener("click", function () {
      setOpen(!navList.classList.contains("is-open"));
    });
    // Close after choosing a link (also covers same-page anchors)
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Scroll fade-in for elements marked with [data-fade]
  var fadeEls = document.querySelectorAll("[data-fade]");
  if (fadeEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      // threshold 0 + bottom margin: fires for tall elements too (0.15 never did)
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Hide the Jotform loading spinner once the embedded form has loaded
  var jotformFrame = document.querySelector(".jotform-frame");
  var jotformIframe = jotformFrame && jotformFrame.querySelector("iframe");
  var jotformLoader = jotformFrame && jotformFrame.querySelector(".jotform-loader");
  if (jotformIframe && jotformLoader) {
    jotformIframe.addEventListener("load", function () {
      jotformLoader.style.display = "none";
    });
  }
})();
