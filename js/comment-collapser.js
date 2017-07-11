function injectCSS() {
  const styleEl = document.createElement("style");

  styleEl.textContent = `
    :root body div.sitetable div.comment {
      padding-left: 20px !important;
      position: relative !important;
    }

    :root body div.sitetable div.comment .expand {
      all: initial !important;
      background-color: rgba(255, 255, 0, 0.05) !important;
      border: 1px dotted rgba(0, 0, 0, 0.1) !important;
      border-radius: initial !important;
      height: 100% !important;
      left: 0 !important;
      font-size: 10px !important;
      margin: initial !important;
      padding: initial !important;
      position: absolute !important;
      top: 0 !important;
      width: 15px !important;
      text-align: center !important;
      transition: initial !important;
    }

    :root body div.sitetable div.comment .expand:hover {
      background-color: rgba(255, 255, 0, 0.3) !important;
      text-decoration: initial !important;
    }

    :root body div.sitetable div.comment .entry {
      position: initial !important;
    }

    :root body div.sitetable div.comment .entry:before {
      width: 0 !important;
    }

    :root body div.sitetable div.comment .child {
      padding-left: 0 !important;
      margin-left: 0px !important;
      border-left: 0 !important;
    }

    :root body div.sitetable div.comment .midcol {
      margin-left: 0px !important;
    }

    :root body.res div.sitetable div.comment .expand {
      border: none !important;
    }

    .res-nightmode .comment .expand {
      color: #DDDDDD !important;
    }

    .expand::before,
    .expand::after {
      content: initial !important;
    }
  `;

  document.documentElement.appendChild(styleEl);
}

// Based on: https://github.com/alicelieutier/smoothScroll
function smoothScroll(destination) {
  let duration = 250;

  function getComputedPosition (startScroll, destination, elapsed) {
    if (elapsed > duration) {
      return destination;
    } else {
      return (
        startScroll + (destination - startScroll) *
        (elapsed / duration)
      );
    }
  }

  let startScroll = window.scrollY;
  let startTime = Date.now();

  window.requestAnimationFrame(function step () {
    let elapsed = Date.now() - startTime;

    window.scroll(window.scrollX, getComputedPosition(startScroll, destination, elapsed));

    if (elapsed <= duration) {
      window.requestAnimationFrame(step);
    }
  });
}

injectCSS();

window.addEventListener("click", function (ev) {
  // Only trigger for expando clicks
  if (!ev.target.matches(".expand")) return;

  let comment = ev.target.closest(".comment");
  let rect = comment.getBoundingClientRect();

  // If top of comment is out of viewport, scroll to it
  if (rect.top < 0) {
    const padding = 10;
    let scrollPosition = (window.scrollY + rect.top) - padding;

    try {
      // Try and use browser's smooth scrolling if available
      window.scroll({
        top: scrollPosition,
        behavior: "smooth"
      });
    } catch (e) {
      // Fallback
      smoothScroll(scrollPosition);
    }
  }
});
