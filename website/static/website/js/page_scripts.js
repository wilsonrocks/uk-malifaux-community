/**
 * Uses the lightbox to show the given public_id
 * */
function setLightbox(id) {
  const url = document
    .querySelector(`[data-public-id=${id}]`)
    .getAttribute("data-lightbox-url");
  const lightbox = document.querySelector("#lightbox");

  const img = lightbox.querySelector("img");
  img.src = url;

  // it's not as simple as just revealing it because we want to wait till it has loaded
  if (img.complete) {
    lightbox.classList.remove("hidden");
  } else {
    img.addEventListener(
      "load",
      () => {
        lightbox.classList.remove("hidden");
      },
      { once: true }
    );
  }
}

window.addEventListener("hashchange", (event) => {
  const [_, id] = event.newURL.split("#");
  setLightbox(id);
});

const lightboxCloseButton = document.querySelector("#lightbox-close-button");
lightboxCloseButton?.addEventListener("click", () => {
  document.querySelector("#lightbox").classList.add("hidden");
  history.pushState(null, null, "#");
});

window.addEventListener("load", () => {
  const id = window.location.hash.slice(1); // Remove the '#' from the hash
  if (id && id.length) {
    setLightboxId(id);
  }
});
