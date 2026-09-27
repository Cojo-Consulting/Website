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

  // Wissen: live filter for the topic cards. Matching ignores case, umlauts
  // (also typed as ae/oe/ue) and soft hyphens; every search word must match.
  var search = document.querySelector(".topic-search");
  var searchInput = search && search.querySelector(".topic-search__input");
  var searchStatus = search && search.querySelector(".topic-search__status");
  var searchEmpty = document.querySelector(".topic-search__empty");
  var topicCards = document.querySelectorAll(".topic-card[data-search]");
  if (search && searchInput && topicCards.length) {
    var normalize = function (text) {
      return text
        .toLowerCase()
        .replace(/\u00ad/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/([aou])e/g, "$1");
    };
    var cardText = Array.prototype.map.call(topicCards, function (card) {
      return normalize(card.getAttribute("data-search"));
    });

    search.hidden = false;
    searchInput.addEventListener("input", function () {
      var words = normalize(searchInput.value).split(/\s+/).filter(Boolean);
      var matches = 0;
      topicCards.forEach(function (card, i) {
        var isMatch = words.every(function (word) { return cardText[i].indexOf(word) !== -1; });
        card.hidden = !isMatch;
        if (isMatch) {
          card.classList.add("is-visible");
          matches++;
        }
      });
      if (searchEmpty) searchEmpty.hidden = matches > 0;
      searchStatus.textContent = words.length
        ? matches + (matches === 1 ? " Thema gefunden" : " Themen gefunden")
        : "";
    });
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
