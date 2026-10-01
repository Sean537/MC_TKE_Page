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
  var shareButton = document.getElementById("article-share");
  var cards = document.querySelectorAll("[data-article]");
  var lastFocusedElement = null;
  var activeArticleId = null;
  var articleDocumentPromise = null;
  var lightbox = document.getElementById("image-lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxCounter = document.getElementById("lightbox-counter");
  var lightboxClose = document.getElementById("lightbox-close");
  var lightboxPrevious = document.getElementById("lightbox-previous");
  var lightboxNext = document.getElementById("lightbox-next");
  var articleImages = [];
  var currentImageIndex = 0;
  var lastImageTrigger = null;

  function loadArticleDocument() {
    if (!articleDocumentPromise) {
      articleDocumentPromise = fetch(new URL("articles.html", document.baseURI))
        .then(function (response) {
          if (!response.ok) throw new Error("文章文件加载失败");
          return response.text();
        })
        .then(function (html) {
          return new DOMParser().parseFromString(html, "text/html");
        });
    }
    return articleDocumentPromise;
  }

  function updateArticleUrl(articleId) {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    if (articleId) {
      url.searchParams.set("article", articleId);
    } else {
      url.searchParams.delete("article");
    }
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  function openArticle(card, preserveUrl) {
    var title = card.getAttribute("data-title") || "文章";
    if (!dialog || !dialogTitle || !articleContent) return;

    lastFocusedElement = card;
    activeArticleId = card.getAttribute("data-article");
    if (preserveUrl !== false) updateArticleUrl(activeArticleId);
    dialogTitle.textContent = title;
    articleContent.innerHTML = '<p class="article-error">正在加载文章…</p>';
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    articleContent.scrollTop = 0;
    if (closeButton) closeButton.focus();

    loadArticleDocument().then(function (articleDocument) {
      if (!dialog.open || lastFocusedElement !== card) return;
      var template = articleDocument.getElementById(card.getAttribute("data-article"));
      if (!template || !template.content) throw new Error("找不到文章模板");
      articleContent.replaceChildren(document.importNode(template.content, true));
      prepareArticleImages();
      articleContent.scrollTop = 0;
    }).catch(function () {
      if (!dialog.open || lastFocusedElement !== card) return;
      articleContent.innerHTML = '<p class="article-error">文章暂时无法加载。请通过网页服务器访问，并确认 articles.html 已部署。</p>';
    });
  }

  function prepareArticleImages() {
    if (!articleContent) return;
    articleImages = Array.prototype.slice.call(articleContent.querySelectorAll("img"));
    articleImages.forEach(function (image, index) {
      image.setAttribute("tabindex", "0");
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", (image.alt || "文章图片") + "，点击放大预览");
      image.addEventListener("click", function () { openLightbox(index, image); });
      image.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(index, image);
        }
      });
    });
  }

  function renderLightboxImage() {
    if (!articleImages.length || !lightboxImage) return;
    var image = articleImages[currentImageIndex];
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "文章图片";
    lightboxCaption.textContent = image.alt || "";
    lightboxCounter.textContent = (currentImageIndex + 1) + " / " + articleImages.length;
    var multipleImages = articleImages.length > 1;
    lightboxPrevious.hidden = !multipleImages;
    lightboxNext.hidden = !multipleImages;
  }

  function openLightbox(index, trigger) {
    if (!lightbox || !articleImages.length) return;
    currentImageIndex = index;
    lastImageTrigger = trigger;
    renderLightboxImage();
    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    if (typeof lightbox.close === "function" && lightbox.open) {
      lightbox.close();
    } else {
      lightbox.removeAttribute("open");
    }
  }

  function changeLightboxImage(step) {
    if (articleImages.length < 2) return;
    currentImageIndex = (currentImageIndex + step + articleImages.length) % articleImages.length;
    renderLightboxImage();
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
  if (shareButton) {
    shareButton.addEventListener("click", function () {
      if (!activeArticleId) return;
      var shareUrl = new URL(window.location.href);
      shareUrl.hash = "";
      shareUrl.searchParams.set("article", activeArticleId);
      var link = shareUrl.toString();
      var originalText = shareButton.textContent;
      function copied() {
        shareButton.textContent = "链接已复制";
        window.setTimeout(function () { shareButton.textContent = originalText; }, 1800);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(copied).catch(function () {
          window.prompt("复制文章分享链接：", link);
        });
      } else {
        window.prompt("复制文章分享链接：", link);
      }
    });
  }
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrevious) lightboxPrevious.addEventListener("click", function () { changeLightboxImage(-1); });
  if (lightboxNext) lightboxNext.addEventListener("click", function () { changeLightboxImage(1); });
  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener("close", function () {
      if (lastImageTrigger && dialog && dialog.open) lastImageTrigger.focus();
    });
  }
  document.addEventListener("keydown", function (event) {
    if (!lightbox || !lightbox.open) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      changeLightboxImage(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      changeLightboxImage(1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    }
  });

  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeArticle();
    });
    dialog.addEventListener("close", function () {
      activeArticleId = null;
      updateArticleUrl(null);
      if (lastFocusedElement) lastFocusedElement.focus();
    });
  }

  var sharedArticleId = new URLSearchParams(window.location.search).get("article");
  if (sharedArticleId) {
    var sharedCard = Array.prototype.find.call(cards, function (card) {
      return card.getAttribute("data-article") === sharedArticleId;
    });
    if (sharedCard) openArticle(sharedCard, false);
  }
}());
