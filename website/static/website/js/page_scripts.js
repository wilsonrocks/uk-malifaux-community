/**
 * Uses the lightbox to show the given public_id
 * */
function setLightbox(id) {
  if (!id) return;

  const allLightboxes = document.querySelectorAll("[data-lightbox-public-id]");

  for (const lightbox of allLightboxes) {
    if (lightbox.getAttribute("data-lightbox-public-id") === id) {
      lightbox.classList.remove("hidden");
    } else {
      lightbox.classList.add("hidden");
    }
  }
}

function closeLightbox() {
  const openLightboxes = document.querySelectorAll(
    "[data-lightbox-public-id]:not(.hidden)"
  );
  for (const lightbox of openLightboxes) {
    lightbox.classList.add("hidden");
  }
  history.pushState(null, null, "#");
}

window.addEventListener("hashchange", (event) => {
  const [_, id] = event.newURL.split("#");
  setLightbox(id);
});

window.addEventListener("load", () => {
  const id = window.location.hash.slice(1); // Remove the '#' from the hash
  if (id && id.length) {
    setLightbox(id);
  }

  const lightboxCloseButtons = document.querySelectorAll(
    "[data-lightbox-public-id]"
  );

  for (const lightbox of lightboxCloseButtons) {
    lightbox.querySelector("button").addEventListener("click", closeLightbox);
  }
});
