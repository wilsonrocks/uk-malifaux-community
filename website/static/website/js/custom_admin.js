function addFilePreviewListener(fileInput) {
  fileInput.addEventListener("change", (event) => {
    blobUrl = URL.createObjectURL(event.target.files[0]);
    fileInput.closest("fieldset").querySelector(".field-file_preview img").src =
      blobUrl;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // TODO this will probably need tweaking when we start allowing file uploads for rules packs
  const fileInputSelector = "input[type=file]";

  const fileInputs = document.querySelectorAll(fileInputSelector);

  for (const fileInput of fileInputs) {
    addFilePreviewListener(fileInput);
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const newFileInputs = node.matches(fileInputSelector)
              ? [node]
              : node.querySelectorAll(fileInputSelector);
            for (const fileInput of newFileInputs) {
              addFilePreviewListener(fileInput);
            }
          }
        });
      }
    }
  });

  // Start observing changes to the document
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
