/* Ulfr1k's Blog — progressive enhancement, zero dependencies */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Navigation: solid after scrolling past the fold --- */
  var nav = document.querySelector(".site-nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-solid", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Typed verse (native replacement for Typed.js) --- */
  var verse = document.querySelector("[data-typed]");
  if (verse) {
    var lines;
    try { lines = JSON.parse(verse.getAttribute("data-typed")); }
    catch (e) { lines = [verse.textContent]; }

    if (reduceMotion) {
      verse.textContent = lines[0];
    } else {
      var text = document.createElement("span");
      var caret = document.createElement("span");
      caret.className = "caret";
      caret.setAttribute("aria-hidden", "true");
      verse.textContent = "";
      verse.appendChild(text);
      verse.appendChild(caret);

      var li = 0, ci = 0, deleting = false;
      var TYPE = 110, ERASE = 45, HOLD = 2600, GAP = 600;

      var tick = function () {
        var line = lines[li];
        if (!deleting) {
          text.textContent = line.slice(0, ++ci);
          if (ci === line.length) {
            if (lines.length === 1) { setTimeout(function () { deleting = true; tick(); }, HOLD); return; }
            deleting = true;
            setTimeout(tick, HOLD);
            return;
          }
          setTimeout(tick, TYPE);
        } else {
          text.textContent = line.slice(0, --ci);
          if (ci === 0) {
            deleting = false;
            li = (li + 1) % lines.length;
            setTimeout(tick, GAP);
            return;
          }
          setTimeout(tick, ERASE);
        }
      };
      tick();
    }
  }

  /* --- Footer year --- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
