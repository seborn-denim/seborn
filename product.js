const STORAGE_KEY = "denim-ui-state-v1";
const RECENT_KEY = "seborn-recent-products";

const $ = (selector) => document.querySelector(selector);
let currentProduct = null;
let currentCategories = [];
let currentImageIndex = 0;

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function displayValue(value) {
  return value ? escapeHtml(value) : "未填写";
}

function getData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.products)) {
      return saved;
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
  return window.DENIM_DATA;
}

function renderMainImage(product, imageIndex) {
  const mainImage = $("#detailMainImage");
  if (product.images.length) {
    mainImage.innerHTML = `
      <img
        src="${product.images[imageIndex]}"
        alt="${escapeHtml(product.name)}"
        decoding="async"
        fetchpriority="high"
      />
    `;
    mainImage.onclick = () => openLightbox(imageIndex);
  } else {
    mainImage.innerHTML = `
      <div class="fabric-swatch detail-fabric ${product.fabricClass}">
        <span>${escapeHtml(product.code || "未编号")}</span>
      </div>
    `;
    mainImage.onclick = null;
  }
}

function renderThumbnails(product, activeIndex) {
  $("#detailThumbnails").innerHTML = product.images
    .map(
      (image, index) => `
        <button
          class="${index === activeIndex ? "active" : ""}"
          type="button"
          data-detail-image="${index}"
          aria-label="查看图片 ${index + 1}"
        >
          <img src="${image}" alt="${escapeHtml(
            product.name
          )} 图片 ${index + 1}" loading="lazy" decoding="async" />
        </button>
      `
    )
    .join("");
}

function rememberRecentProduct(productId) {
  try {
    const ids = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const next = [
      productId,
      ...(Array.isArray(ids) ? ids : []).filter((id) => id !== productId)
    ].slice(0, 10);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch (error) {
    localStorage.removeItem(RECENT_KEY);
  }
}

function setNetworkBanner(visible, message) {
  const banner = $("#networkBanner");
  if (message) {
    $("#networkBannerText").textContent = message;
  }
  banner.classList.toggle("is-hidden", !visible);
}

function renderProduct(product, categories) {
  currentProduct = product;
  currentCategories = categories;
  currentImageIndex = 0;
  const category = categories.find((item) => item.id === product.categoryId);
  const specs = [
    ["商品编号", product.code],
    ["颜色", product.color],
    ["织法", product.weave],
    ["成分", product.composition],
    ["布宽", product.width],
    ["克重", product.weight],
    ["参考直缩", product.shrinkageLength],
    ["参考横缩", product.shrinkageWidth],
    ["挂卡区域", product.location]
  ];

  document.title = "商品详情 - 西布朗牛仔面料";
  $("#detailCategory").textContent = category ? category.name : "未分类";
  $("#detailCode").textContent = product.code;
  $("#detailSpecs").innerHTML = specs
    .map(
      ([label, value]) => `
        <div>
          <dt>${escapeHtml(label)}</dt>
          <dd>${displayValue(value)}</dd>
        </div>
      `
    )
    .join("");

  renderMainImage(product, currentImageIndex);
  renderThumbnails(product, currentImageIndex);
  $("#productDetail").hidden = false;
  rememberRecentProduct(product.id);

  $("#detailThumbnails").onclick = (event) => {
    const button = event.target.closest("[data-detail-image]");
    if (!button) {
      return;
    }
    currentImageIndex = Number(button.dataset.detailImage);
    renderMainImage(product, currentImageIndex);
    renderThumbnails(product, currentImageIndex);
  };

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  return Promise.resolve();
}

function productSpecText(product, categories) {
  const category = categories.find((item) => item.id === product.categoryId);
  return [
    `商品编号：${product.code || ""}`,
    `分类：${category ? category.name : "未分类"}`,
    `颜色：${product.color || "未填写"}`,
    `织法：${product.weave || "未填写"}`,
    `成分：${product.composition || "未填写"}`,
    `布宽：${product.width || "未填写"}`,
    `克重：${product.weight || "未填写"}`,
    `参考直缩：${product.shrinkageLength || "未填写"}`,
    `参考横缩：${product.shrinkageWidth || "未填写"}`,
    `挂卡区域：${product.location || "未填写"}`,
    window.location.href
  ].join("\n");
}

function openLightbox(index) {
  if (!currentProduct || !currentProduct.images.length) {
    return;
  }
  currentImageIndex = index;
  showLightboxImage();
  $("#imageLightbox").classList.remove("is-hidden");
  $("#imageLightbox").setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  $("#imageLightbox").classList.add("is-hidden");
  $("#imageLightbox").setAttribute("aria-hidden", "true");
}

function showLightboxImage() {
  if (!currentProduct || !currentProduct.images.length) {
    return;
  }
  const image = $("#lightboxImage");
  image.src = currentProduct.images[currentImageIndex];
  image.alt = `${currentProduct.code} 图片 ${currentImageIndex + 1}`;
}

function moveLightbox(step) {
  if (!currentProduct || !currentProduct.images.length) {
    return;
  }
  const length = currentProduct.images.length;
  currentImageIndex = (currentImageIndex + step + length) % length;
  showLightboxImage();
}

function bindProductActions() {
  $("#copyProductSpecs").addEventListener("click", async () => {
    if (!currentProduct) {
      return;
    }
    await copyText(productSpecText(currentProduct, currentCategories));
    showProductToast("商品规格已复制");
  });

  $("#copyProductLink").addEventListener("click", async () => {
    await copyText(window.location.href);
    showProductToast("商品链接已复制");
  });

  $("#shareProduct").addEventListener("click", async () => {
    const shareData = {
      title: currentProduct ? currentProduct.code : "商品详情",
      text: currentProduct ? productSpecText(currentProduct, currentCategories) : "",
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }
      }
    }
    await copyText(window.location.href);
    showProductToast("链接已复制，可粘贴到微信分享");
  });

  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => moveLightbox(-1));
  $("#lightboxNext").addEventListener("click", () => moveLightbox(1));
  $("#imageLightbox").addEventListener("click", (event) => {
    if (event.target === $("#imageLightbox")) {
      closeLightbox();
    }
  });

  $("#networkReloadButton").addEventListener("click", () => {
    window.location.reload();
  });
  window.addEventListener("online", () => setNetworkBanner(false));
  window.addEventListener("offline", () =>
    setNetworkBanner(true, "网络已断开，当前显示缓存数据。")
  );
  if (!navigator.onLine) {
    setNetworkBanner(true, "网络已断开，当前显示缓存数据。");
  }
}

function showProductToast(message) {
  const toast = $("#productToast");
  if (!toast) {
    return;
  }
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showProductToast.timer);
  showProductToast.timer = window.setTimeout(
    () => toast.classList.remove("show"),
    1800
  );
}

async function init() {
  bindProductActions();
  if (
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "localhost")
  ) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  let data = getData();
  const cachedProduct = data.products.find((item) => item.id === productId);
  let rendered = false;

  if (cachedProduct) {
    renderProduct(cachedProduct, data.categories);
    rendered = true;
  }

  if (!window.denimCloud || !window.denimCloud.isConfigured() || !productId) {
    if (!rendered) {
      window.location.replace("index.html");
    }
    return;
  }

  try {
    const remoteProduct = await window.denimCloud.fetchProduct(productId);
    if (remoteProduct) {
      const categories = await window.denimCloud.fetchCategories();
      renderProduct(remoteProduct, categories);
      rendered = true;
    }
  } catch (error) {
    setNetworkBanner(true, "商品信息刷新失败，当前显示缓存数据。");
    console.warn("Unable to refresh product from Supabase.", error);
  }

  if (!rendered) {
    window.location.replace("index.html");
  }
}

document.addEventListener("DOMContentLoaded", init);
