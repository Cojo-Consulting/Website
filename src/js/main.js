(function () {
  "use strict";

  // Marks JS as available so CSS can gate the fade-in effect behind
  // .js — without this class, [data-fade] content stays fully visible.
  document.documentElement.classList.add("js");

  // Mobile nav toggle
  var toggle = document.querySelector(".site-nav__toggle");
  var navList = document.querySelector(".site-nav__list");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
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
      { threshold: 0.15 }
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
