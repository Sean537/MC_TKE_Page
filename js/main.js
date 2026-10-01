(function () {
  var copyButtons = document.querySelectorAll("[data-copy]");
  copyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-copy");
      var original = button.textContent;
      function copied() {
        button.textContent = "已复制";
        window.setTimeout(function () { button.textContent = original; }, 1600);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(copied).catch(function () {
          window.prompt("请复制：", value);
        });
      } else {
        window.prompt("请复制：", value);
      }
    });
  });

  var dialog = document.getElementById("article-dialog");
  var dialogTitle = document.getElementById("dialog-title");
  var articleContent = document.getElementById("article-content");
  var closeButton = document.getElementById("dialog-close");
  var cards = document.querySelectorAll("[data-article]");
  var lastFocusedElement = null;

  function openArticle(card) {
    var template = document.getElementById(card.getAttribute("data-article"));
    var title = card.getAttribute("data-title") || "文章";
    if (!template || !dialog || !articleContent) return;

    lastFocusedElement = card;
    dialogTitle.textContent = title;
    articleContent.replaceChildren(template.content.cloneNode(true));
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    articleContent.scrollTop = 0;
    if (closeButton) closeButton.focus();
  }

  function closeArticle() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () { openArticle(card); });
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openArticle(card);
      }
    });
  });

  if (closeButton) closeButton.addEventListener("click", closeArticle);
  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeArticle();
    });
    dialog.addEventListener("close", function () {
      if (lastFocusedElement) lastFocusedElement.focus();
    });
  }
}());
