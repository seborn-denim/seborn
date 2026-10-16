const STORAGE_KEY = "denim-ui-state-v1";

const $ = (selector) => document.querySelector(selector);

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
      />
    `;
  } else {
    mainImage.innerHTML = `
      <div class="fabric-swatch detail-fabric ${product.fabricClass}">
        <span>${escapeHtml(product.code || "未编号")}</span>
      </div>
    `;
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
          <img src="${image}" alt="${escapeHtml(product.name)} 图片 ${index + 1}" />
        </button>
      `
    )
    .join("");
}

function renderProduct(product, categories) {
  const category = categories.find((item) => item.id === product.categoryId);
  const specs = [
    ["商品编号", product.code],
    ["颜色", product.color],
    ["织法", product.weave],
    ["成分", product.composition],
    ["布宽", product.width],
    ["克重", product.weight],
    ["挂卡区域", product.location]
  ];

  document.title = "商品详情 - 牛仔布料";
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

  let activeImage = 0;
  renderMainImage(product, activeImage);
  renderThumbnails(product, activeImage);
  $("#productDetail").hidden = false;

  $("#detailThumbnails").addEventListener("click", (event) => {
    const button = event.target.closest("[data-detail-image]");
    if (!button) {
      return;
    }
    activeImage = Number(button.dataset.detailImage);
    renderMainImage(product, activeImage);
    renderThumbnails(product, activeImage);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  let data = getData();
  let product = null;

  if (
    window.denimCloud &&
    window.denimCloud.isConfigured() &&
    productId
  ) {
    try {
      product = await window.denimCloud.fetchProduct(productId);
    } catch (error) {
      console.warn("Unable to load product from Supabase.", error);
      product = data.products.find((item) => item.id === productId) || null;
    }
    try {
      const catalog = await window.denimCloud.fetchCatalog();
      if (catalog) {
        data = {
          products: catalog.products || [],
          categories: catalog.categories || data.categories,
          company: catalog.company && catalog.company.name
            ? catalog.company
            : data.company
        };
      }
    } catch (error) {
      console.warn("Unable to load catalog extras from Supabase.", error);
    }
  } else if (productId) {
    product = data.products.find((item) => item.id === productId);
  }

  if (!product) {
    window.location.replace("index.html");
    return;
  }

  renderProduct(product, data.categories);
}

document.addEventListener("DOMContentLoaded", init);
