const state = {
  isAdmin: false,
  cloudReady: false,
  currentView: "products",
  statusFilter: "all",
  productSearch: "",
  storeSearch: "",
  selectedCategoryId: "",
  storePage: 1,
  storePageSize: 9,
  editingCategoryId: null,
  pendingCompanyLogoFile: null,
  companyCarouselTimer: null,
  companyCarouselAnimationTimer: null,
  companyCarouselShowingBack: false,
  cloudUnsubscribe: null,
  categories: [
    { id: "cat-1", name: "经典靛蓝", sort: 1, enabled: true },
    { id: "cat-2", name: "原色牛仔", sort: 2, enabled: true },
    { id: "cat-3", name: "弹力牛仔", sort: 3, enabled: true },
    { id: "cat-4", name: "黑色牛仔", sort: 4, enabled: true },
    { id: "cat-5", name: "彩色牛仔", sort: 5, enabled: true }
  ],
  products: [
    {
      id: "p-1",
      name: "12盎司右斜靛蓝牛仔",
      code: "DN-1201",
      categoryId: "cat-1",
      color: "深靛蓝",
      weave: "3/1 右斜",
      composition: "98% 棉 2% 氨纶",
      width: "148 cm",
      weight: "12 oz",
      location: "A-01",
      status: "published",
      sort: 1,
      fabricClass: "fabric-indigo",
      images: [],
      updatedAt: "2026-10-15 10:24"
    },
    {
      id: "p-2",
      name: "轻磅浅蓝牛仔",
      code: "DN-0826",
      categoryId: "cat-1",
      color: "浅蓝",
      weave: "2/1 右斜",
      composition: "100% 棉",
      width: "145 cm",
      weight: "8 oz",
      location: "A-02",
      status: "published",
      sort: 2,
      fabricClass: "fabric-light",
      images: [],
      updatedAt: "2026-10-14 16:05"
    },
    {
      id: "p-3",
      name: "无弹原色牛仔",
      code: "DN-1403",
      categoryId: "cat-2",
      color: "原色",
      weave: "3/1 左斜",
      composition: "100% 棉",
      width: "152 cm",
      weight: "14 oz",
      location: "B-01",
      status: "published",
      sort: 3,
      fabricClass: "fabric-ecru",
      images: [],
      updatedAt: "2026-10-14 09:40"
    },
    {
      id: "p-4",
      name: "高弹深色牛仔",
      code: "DN-1008",
      categoryId: "cat-3",
      color: "藏青",
      weave: "斜纹",
      composition: "92% 棉 6% 涤纶 2% 氨纶",
      width: "150 cm",
      weight: "10 oz",
      location: "C-03",
      status: "published",
      sort: 4,
      fabricClass: "fabric-deep",
      images: [],
      updatedAt: "2026-10-13 15:22"
    },
    {
      id: "p-5",
      name: "黑经黑纬牛仔",
      code: "DN-1105",
      categoryId: "cat-4",
      color: "黑色",
      weave: "3/1 右斜",
      composition: "99% 棉 1% 氨纶",
      width: "147 cm",
      weight: "11 oz",
      location: "D-01",
      status: "published",
      sort: 5,
      fabricClass: "fabric-black",
      images: [],
      updatedAt: "2026-10-12 11:18"
    },
    {
      id: "p-6",
      name: "复古棕斜纹牛仔",
      code: "DN-0912",
      categoryId: "cat-5",
      color: "焦糖棕",
      weave: "2/1 右斜",
      composition: "100% 棉",
      width: "146 cm",
      weight: "9 oz",
      location: "D-02",
      status: "published",
      sort: 6,
      fabricClass: "fabric-copper",
      images: [],
      updatedAt: "2026-10-10 14:30"
    },
    {
      id: "p-7",
      name: "13盎司赤耳牛仔",
      code: "DN-1305",
      categoryId: "cat-2",
      color: "深原色",
      weave: "3/1 右斜",
      composition: "100% 棉",
      width: "150 cm",
      weight: "13 oz",
      location: "B-02",
      status: "published",
      sort: 7,
      fabricClass: "fabric-indigo",
      images: [],
      updatedAt: "2026-10-09 10:12"
    },
    {
      id: "p-8",
      name: "冰蓝弹力牛仔",
      code: "DN-1016",
      categoryId: "cat-3",
      color: "冰蓝",
      weave: "2/1 斜纹",
      composition: "91% 棉 7% 涤纶 2% 氨纶",
      width: "149 cm",
      weight: "10 oz",
      location: "C-04",
      status: "published",
      sort: 8,
      fabricClass: "fabric-light",
      images: [],
      updatedAt: "2026-10-08 14:42"
    },
    {
      id: "p-9",
      name: "灰黑斜纹牛仔",
      code: "DN-1218",
      categoryId: "cat-4",
      color: "灰黑",
      weave: "3/1 左斜",
      composition: "98% 棉 2% 氨纶",
      width: "148 cm",
      weight: "12 oz",
      location: "E-01",
      status: "published",
      sort: 9,
      fabricClass: "fabric-black",
      images: [],
      updatedAt: "2026-10-08 09:25"
    }
  ],
  company: {
    name: "示例纺织有限公司",
    address: "广东省佛山市顺德区示例工业园区 8 号",
    phone: "0757-88888888"
  }
};

const statusText = {
  draft: "草稿",
  published: "已上架",
  archived: "已归档"
};

const viewTitles = {
  products: "商品管理",
  categories: "分类管理",
  company: "公司信息"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const STORAGE_KEY = "denim-ui-state-v1";

function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) {
      return;
    }
    if (Array.isArray(saved.products)) {
      state.products = saved.products;
    }
    if (Array.isArray(saved.categories)) {
      state.categories = saved.categories;
    }
    if (saved.company) {
      state.company = saved.company;
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function persistState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      products: state.products,
      categories: state.categories,
      company: state.company
    })
  );
}

function cloudConfigured() {
  return Boolean(
    window.denimCloud && window.denimCloud.isConfigured()
  );
}

async function hydrateFromCloud() {
  if (!cloudConfigured()) {
    state.cloudReady = false;
    return;
  }

  try {
    const catalog = await window.denimCloud.fetchCatalog();
    if (!catalog) {
      return;
    }
    state.categories = Array.isArray(catalog.categories)
      ? catalog.categories
      : [];
    state.products = Array.isArray(catalog.products) ? catalog.products : [];
    if (catalog.company && catalog.company.name) {
      state.company = catalog.company;
    }
    state.cloudReady = true;
    persistState();
    renderStore();
    renderAdminProducts();
    renderCategories();
    renderCompany();
  } catch (error) {
    state.cloudReady = false;
    console.warn("Supabase catalog unavailable, using local data.", error);
  }
}

function subscribeCloud() {
  if (!cloudConfigured() || state.cloudUnsubscribe) {
    return;
  }
  const cleanup = window.denimCloud.subscribeCatalog(() => {
    hydrateFromCloud();
  });
  if (cleanup) {
    state.cloudUnsubscribe = cleanup;
  }
}

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

function renderCompanyLogo(target, logoUrl) {
  if (!target) {
    return;
  }
  target.innerHTML = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="公司图标" />`
    : '<span class="company-logo-fallback">S</span>';
}

function salesDepartments() {
  return Array.isArray(state.company.salesDepartments)
    ? state.company.salesDepartments
    : [];
}

function renderStoreSalesDepartments() {
  const departments = salesDepartments().filter(
    (department) => department.name || department.address || department.phone
  );
  $("#storeSalesDepartments").innerHTML = departments.length
    ? departments
        .map(
          (department) => `
        <article class="store-sales-department">
          <h3>${escapeHtml(department.name || "销售部")}</h3>
          <p>${escapeHtml(department.address || "地址未填写")}</p>
          <div class="sales-department-contact">
            ${
              department.phone
                ? `<a href="tel:${escapeHtml(
                    department.phone.replace(/\s+/g, "")
                  )}">${escapeHtml(department.phone)}</a>`
                : "<span>电话未填写</span>"
            }
          </div>
        </article>
      `
        )
        .join("")
    : '<div class="sales-department-empty">暂无销售部信息</div>';
}

function renderSalesDepartmentsEditor() {
  const departments = salesDepartments();
  $("#salesDepartmentsEditor").innerHTML = departments.length
    ? departments
        .map(
          (department, index) => `
            <div class="sales-editor-row" data-sales-row="${index}">
              <label class="field">
                <span>销售部名称</span>
                <input
                  type="text"
                  value="${escapeHtml(department.name || "")}"
                  data-sales-index="${index}"
                  data-sales-field="name"
                  placeholder="例如：华东销售部"
                />
              </label>
              <label class="field">
                <span>地址</span>
                <input
                  type="text"
                  value="${escapeHtml(department.address || "")}"
                  data-sales-index="${index}"
                  data-sales-field="address"
                  placeholder="填写销售部地址"
                />
              </label>
              <label class="field">
                <span>联系电话</span>
                <input
                  type="tel"
                  value="${escapeHtml(department.phone || "")}"
                  data-sales-index="${index}"
                  data-sales-field="phone"
                  placeholder="填写联系电话"
                />
              </label>
              <button
                class="sales-remove-button"
                type="button"
                title="删除销售部"
                data-remove-sales-department="${index}"
              >
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          `
        )
        .join("")
    : '<div class="sales-editor-empty">暂无销售部信息，点击“新增销售部”添加。</div>';
  refreshIcons();
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function categoryName(categoryId) {
  const category = state.categories.find((item) => item.id === categoryId);
  return category ? category.name : "未分类";
}

function publicProducts(options) {
  const settings = options || {};
  const keyword = state.storeSearch.trim().toLowerCase();
  return state.products
    .filter((product) => {
      if (product.status !== "published") {
        return false;
      }
      if (
        settings.categoryId &&
        product.categoryId !== settings.categoryId
      ) {
        return false;
      }
      const searchable = `${product.name} ${product.code}`.toLowerCase();
      return !keyword || searchable.includes(keyword);
    });
}

function renderStoreProduct(product) {
  const image = product.images.length
    ? `<img src="${product.images[0]}" alt="${escapeHtml(
        product.name
      )}" loading="lazy" decoding="async" />`
    : `<div class="fabric-swatch store-fabric ${product.fabricClass}"></div>`;

  return `
    <a
      class="store-product-card"
      data-store-product="${product.id}"
      href="product.html?id=${encodeURIComponent(product.id)}"
      aria-label="查看 ${escapeHtml(product.name)}"
    >
      <div class="store-product-image">${image}</div>
      <div class="store-product-body">
        <div class="store-product-title">
          <h3>${escapeHtml(product.name)}</h3>
          <span>${escapeHtml(product.code)}</span>
        </div>
        <div class="store-product-tags">
          <span>${escapeHtml(categoryName(product.categoryId))}</span>
          <span>${displayValue(product.color)}</span>
        </div>
        <dl class="store-product-info">
          <div><dt>织法</dt><dd>${displayValue(product.weave)}</dd></div>
          <div><dt>成分</dt><dd>${displayValue(product.composition)}</dd></div>
          <div><dt>布宽</dt><dd>${displayValue(product.width)}</dd></div>
          <div><dt>克重</dt><dd>${displayValue(product.weight)}</dd></div>
          <div><dt>挂卡区域</dt><dd>${displayValue(product.location)}</dd></div>
        </dl>
      </div>
    </a>
  `;
}

function renderStore() {
  $("#storeCompanyName").textContent = state.company.name || "牛仔布料商品目录";
  $("#storeCompanyInfo").textContent =
    state.company.address || "查看牛仔布料的颜色、织法、成分、布宽、克重和挂卡区域。";
  renderCompanyLogo($("#storeCompanyLogo"), state.company.logoUrl || "");
  renderStoreSalesDepartments();

  const publishedProducts = publicProducts();
  const enabledCategories = state.categories
    .filter((category) => category.enabled)
    .sort((a, b) => a.sort - b.sort);
  const enabledCategoryIds = new Set(
    enabledCategories.map((category) => category.id)
  );
  const uncategorizedCount = publishedProducts.filter(
    (product) => !enabledCategoryIds.has(product.categoryId)
  ).length;
  const categories = enabledCategories.concat(
    uncategorizedCount
      ? [{ id: "__uncategorized__", name: "未分类", sort: 9999 }]
      : []
  );
  const searchActive = Boolean(state.storeSearch.trim());
  const selectedCategory = categories.find(
    (category) => category.id === state.selectedCategoryId
  );
  const showProducts = searchActive || Boolean(selectedCategory);
  const products = searchActive
    ? publicProducts()
    : selectedCategory
      ? selectedCategory.id === "__uncategorized__"
        ? publicProducts().filter(
            (product) => !enabledCategoryIds.has(product.categoryId)
          )
        : publicProducts({ categoryId: selectedCategory.id })
      : [];

  $("#storeProductCount").textContent = publishedProducts.length;
  $("#storeCategoryGrid").innerHTML = categories
    .map((category) => {
      const count =
        category.id === "__uncategorized__"
          ? uncategorizedCount
          : state.products.filter(
              (product) =>
                product.status === "published" &&
                product.categoryId === category.id
            ).length;
      return `
        <button
          class="store-category-card"
          type="button"
          data-store-category="${category.id}"
        >
          <div>
            <h3>${escapeHtml(category.name)}</h3>
            <p>点击查看该分类下的商品</p>
          </div>
          <div class="store-category-count">
            ${count}
            <span>款商品</span>
          </div>
        </button>
      `;
    })
    .join("");

  $("#storeCategoryGrid").classList.toggle("is-hidden", showProducts);
  $("#storeGrid").classList.toggle("is-hidden", !showProducts);
  $("#backToCategoriesButton").classList.toggle("is-hidden", !showProducts);

  if (!showProducts) {
    $("#storeSectionTitle").textContent = "商品分类";
    $("#storeSectionSubtitle").textContent =
      "先选择商品分类，再查看该分类下的商品。";
    $("#storeGrid").innerHTML = "";
    $("#storeEmpty").textContent = "暂无商品分类。";
    $("#storeEmpty").hidden = categories.length > 0;
    $("#storePagination").innerHTML = "";
    refreshIcons();
    return;
  }

  const totalPages = Math.max(1, Math.ceil(products.length / state.storePageSize));
  state.storePage = Math.min(state.storePage, totalPages);
  const start = (state.storePage - 1) * state.storePageSize;
  const pageProducts = products.slice(start, start + state.storePageSize);

  $("#storeSectionTitle").textContent = searchActive
    ? "搜索结果"
    : selectedCategory.name;
  $("#storeSectionSubtitle").textContent = searchActive
    ? `找到 ${products.length} 款匹配商品。`
    : `该分类共有 ${products.length} 款商品。`;
  $("#storeGrid").innerHTML = pageProducts.map(renderStoreProduct).join("");
  $("#storeEmpty").hidden = pageProducts.length > 0;
  $("#storeEmpty").textContent = searchActive
    ? "没有找到匹配商品。"
    : "该分类暂无已上架商品。";

  $("#storePagination").innerHTML =
    totalPages > 1
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
          .map(
            (page) =>
              `<button class="${page === state.storePage ? "active" : ""}" data-store-page="${page}">${page}</button>`
          )
          .join("")
      : "";
  refreshIcons();
}

function filteredAdminProducts() {
  const keyword = state.productSearch.trim().toLowerCase();
  return state.products
    .filter((product) => {
      const matchesStatus =
        state.statusFilter === "all" || product.status === state.statusFilter;
      const searchable = `${product.name} ${product.code}`.toLowerCase();
      return matchesStatus && (!keyword || searchable.includes(keyword));
    });
}

function categoryOptions(selectedId) {
  const options = state.categories
    .filter((category) => category.enabled || category.id === selectedId)
    .sort((a, b) => a.sort - b.sort)
    .map(
      (category) => `
        <option value="${escapeHtml(category.id)}" ${
          category.id === selectedId ? "selected" : ""
        }>
          ${escapeHtml(category.name)}
        </option>
      `
    )
    .join("");
  return `
    <option value="" ${selectedId ? "" : "selected"}>未分类</option>
    ${options}
  `;
}

function statusOptions(selectedStatus) {
  return Object.entries(statusText)
    .map(
      ([value, label]) => `
        <option value="${value}" ${value === selectedStatus ? "selected" : ""}>
          ${label}
        </option>
      `
    )
    .join("");
}

function renderAdminProductImage(product) {
  if (product.images.length) {
    return `<img src="${product.images[0]}" alt="${escapeHtml(
      product.name
    )}" loading="lazy" decoding="async" />`;
  }
  return `
    <div class="fabric-swatch product-placeholder ${product.fabricClass}">
      <span>${escapeHtml(product.code || "未编号")}</span>
    </div>
  `;
}

function renderImageThumbs(product) {
  if (!product.images.length) {
    return "";
  }
  return `
    <div class="image-thumbs">
      ${product.images
        .map(
          (image, index) => `
            <div class="image-thumb ${index === 0 ? "cover" : ""}">
              <img src="${image}" alt="${escapeHtml(
                product.name
              )} 图片 ${index + 1}" loading="lazy" decoding="async" />
              <div class="thumb-actions">
                ${
                  index === 0
                    ? '<span class="cover-label">封面</span>'
                    : `<button type="button" title="设为封面" data-set-cover="${product.id}" data-image-index="${index}">
                        <i data-lucide="star"></i>
                      </button>`
                }
                <button type="button" title="移除图片" data-remove-image="${product.id}" data-image-index="${index}">
                  <i data-lucide="x"></i>
                </button>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderAdminProductCard(product) {
  return `
    <article class="product-editor-card" data-product-card="${product.id}">
      <div class="product-image-area" data-drop-product="${product.id}">
        ${renderAdminProductImage(product)}
      </div>

      <div class="image-config">
        <div class="image-config-head">
          <div>
            <strong>商品图片</strong>
            <span>首张图片作为首页封面，最多 9 张</span>
          </div>
          <label class="upload-button" for="file-${product.id}">
            <i data-lucide="image-plus"></i>
            上传图片
          </label>
          <input
            class="file-input"
            id="file-${product.id}"
            type="file"
            accept="image/*"
            multiple
            data-image-input="${product.id}"
          />
        </div>
        ${renderImageThumbs(product)}
      </div>

      <div class="product-editor-body">
        <div class="editor-head">
          <span class="product-code-badge">${escapeHtml(product.code || "未编号")}</span>
          <span class="status ${product.status}">${statusText[product.status]}</span>
        </div>

        <div class="editor-grid">
          <label class="field">
            <span>商品编号</span>
            <input data-product-id="${product.id}" data-field="code" type="text" value="${escapeHtml(product.code)}" />
          </label>
          <label class="field">
            <span>商品分类</span>
            <select data-product-id="${product.id}" data-field="categoryId">
              ${categoryOptions(product.categoryId)}
            </select>
          </label>
          <label class="field">
            <span>颜色</span>
            <input data-product-id="${product.id}" data-field="color" type="text" value="${escapeHtml(product.color)}" />
          </label>
          <label class="field">
            <span>织法</span>
            <input data-product-id="${product.id}" data-field="weave" type="text" value="${escapeHtml(product.weave)}" />
          </label>
          <label class="field">
            <span>成分</span>
            <input data-product-id="${product.id}" data-field="composition" type="text" value="${escapeHtml(product.composition)}" />
          </label>
          <label class="field">
            <span>布宽</span>
            <input data-product-id="${product.id}" data-field="width" type="text" value="${escapeHtml(product.width)}" />
          </label>
          <label class="field">
            <span>克重</span>
            <input data-product-id="${product.id}" data-field="weight" type="text" value="${escapeHtml(product.weight)}" />
          </label>
          <label class="field">
            <span>挂卡区域</span>
            <input data-product-id="${product.id}" data-field="location" type="text" value="${escapeHtml(product.location)}" />
          </label>
          <label class="field">
            <span>商品状态</span>
            <select data-product-id="${product.id}" data-field="status">
              ${statusOptions(product.status)}
            </select>
          </label>
        </div>
      </div>

      <div class="product-card-footer">
        <span>最近更新：${escapeHtml(product.updatedAt)}</span>
        <div>
          <button class="secondary-button" type="button" data-archive-product="${product.id}">
            <i data-lucide="archive"></i>
            归档
          </button>
          <button class="primary-button" type="button" data-save-product="${product.id}">
            <i data-lucide="save"></i>
            保存商品
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderAdminProducts() {
  const products = filteredAdminProducts();
  $("#productCount").textContent = `共 ${products.length} 个商品`;
  $("#productsEmpty").hidden = products.length > 0;
  $("#productEditorGrid").innerHTML = products.map(renderAdminProductCard).join("");
  refreshIcons();
}

function renderCategories() {
  $("#categoriesBody").innerHTML = state.categories
    .sort((a, b) => a.sort - b.sort)
    .map((category) => {
      const productCount = state.products.filter(
        (product) => product.categoryId === category.id
      ).length;
      return `
        <tr>
          <td><strong>${escapeHtml(category.name)}</strong></td>
          <td>${productCount}</td>
          <td>${category.sort}</td>
          <td>
            <button
              class="toggle ${category.enabled ? "on" : ""}"
              title="${category.enabled ? "停用" : "启用"}"
              data-toggle-category="${category.id}"
            ></button>
          </td>
          <td class="align-right">
            <div class="row-actions">
              <button class="icon-button small" title="编辑分类" data-edit-category="${category.id}">
                <i data-lucide="pencil"></i>
              </button>
              <button class="icon-button small danger-icon" title="删除分类" data-delete-category="${category.id}">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
  refreshIcons();
}

function renderCompany() {
  $("#companyName").value = state.company.name;
  $("#companyAddress").value = state.company.address;
  $("#companyPhone").value = state.company.phone;
  renderCompanyLogo(
    $("#companyLogoPreview"),
    state.company.logoUrl || ""
  );
  renderSalesDepartmentsEditor();
}

function switchView(view) {
  state.currentView = view;
  $$(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  $$(".view").forEach((section) => {
    section.classList.toggle("active", section.id === `view-${view}`);
  });
  $("#pageTitle").textContent = viewTitles[view];
  $("#sidebar").classList.remove("open");
  refreshIcons();
}

function stopCompanyCarousel() {
  if (state.companyCarouselTimer) {
    window.clearInterval(state.companyCarouselTimer);
    state.companyCarouselTimer = null;
  }
  if (state.companyCarouselAnimationTimer) {
    window.clearTimeout(state.companyCarouselAnimationTimer);
    state.companyCarouselAnimationTimer = null;
  }
  state.companyCarouselShowingBack = false;
  $("#companyFlipShell").classList.remove(
    "show-back",
    "animating-to-back",
    "animating-to-front"
  );
}

function startCompanyCarousel() {
  stopCompanyCarousel();
  const shell = $("#companyFlipShell");
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }
  state.companyCarouselTimer = window.setInterval(() => {
    if (!state.companyCarouselShowingBack) {
      shell.classList.add("animating-to-back");
      state.companyCarouselAnimationTimer = window.setTimeout(() => {
        shell.classList.remove("animating-to-back");
        shell.classList.add("show-back");
        state.companyCarouselShowingBack = true;
        state.companyCarouselAnimationTimer = null;
      }, 900);
      return;
    }

    shell.classList.add("animating-to-front");
    state.companyCarouselAnimationTimer = window.setTimeout(() => {
      shell.classList.remove("animating-to-front", "show-back");
      state.companyCarouselShowingBack = false;
      state.companyCarouselAnimationTimer = null;
    }, 900);
  }, 3000);
}

function showAdmin() {
  stopCompanyCarousel();
  $("#storeView").classList.add("is-hidden");
  $("#adminApp").classList.remove("is-hidden");
  switchView("products");
}

function showStore() {
  $("#adminApp").classList.add("is-hidden");
  $("#storeView").classList.remove("is-hidden");
  renderStore();
  startCompanyCarousel();
}

function updateProductFromInput(target) {
  const productId = target.dataset.productId;
  const field = target.dataset.field;
  const product = state.products.find((item) => item.id === productId);
  if (!product || !field) {
    return;
  }

  if (field === "code") {
    product[field] = target.value.toUpperCase();
  } else {
    product[field] = target.value;
  }
}

function validateProduct(product) {
  if (!product.code.trim()) {
    return "请填写商品编号。";
  }
  if (!product.images.length) {
    return "请至少上传一张商品图片。";
  }
  const duplicate = state.products.some(
    (item) =>
      item.id !== product.id &&
      item.code.trim().toUpperCase() === product.code.trim().toUpperCase()
  );
  if (duplicate) {
    return "商品编号已存在，请更换后重试。";
  }
  return "";
}

async function saveProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) {
    return;
  }
  const error = validateProduct(product);
  if (error) {
    showToast(error);
    return;
  }

  if (cloudConfigured()) {
    try {
      const saved = await window.denimCloud.saveProduct(product);
      if (saved) {
        Object.assign(product, saved);
      }
    } catch (error) {
      showToast(`云端保存失败：${error.message || "请检查管理员登录和数据表"}`);
      return;
    }
  }

  if (!String(product.name || "").trim()) {
    product.name = product.code.trim().toUpperCase();
  }
  product.updatedAt = "2026-10-15 22:15";
  persistState();
  renderAdminProducts();
  renderStore();
  showToast("保存成功");
}

async function archiveProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) {
    return;
  }

  if (cloudConfigured() && !productId.startsWith("p-")) {
    try {
      const saved = await window.denimCloud.archiveProduct(productId);
      if (saved) {
        Object.assign(product, saved);
      }
    } catch (error) {
      showToast(`云端归档失败：${error.message || "请检查管理员权限"}`);
      return;
    }
  }

  product.status = "archived";
  product.updatedAt = "2026-10-15 22:15";
  persistState();
  renderAdminProducts();
  renderStore();
  showToast("商品已归档");
}

async function deleteCategory(categoryId) {
  const category = state.categories.find((item) => item.id === categoryId);
  if (!category) {
    return;
  }

  const productCount = state.products.filter(
    (product) => product.categoryId === categoryId
  ).length;
  const message =
    productCount > 0
      ? `分类“${category.name}”下有 ${productCount} 个商品。删除后，这些商品会变为“未分类”，确定继续吗？`
      : `确定删除分类“${category.name}”吗？`;
  if (!window.confirm(message)) {
    return;
  }

  if (cloudConfigured()) {
    try {
      await window.denimCloud.deleteCategory(categoryId);
    } catch (error) {
      showToast(`云端删除失败：${error.message || "请检查管理员权限"}`);
      return;
    }
  }

  state.products.forEach((product) => {
    if (product.categoryId === categoryId) {
      product.categoryId = "";
    }
  });
  state.categories = state.categories.filter((item) => item.id !== categoryId);
  persistState();
  renderCategories();
  renderAdminProducts();
  renderStore();
  showToast("分类已删除");
}

function addProduct() {
  const id = `p-${Date.now()}`;
  state.products.push({
    id,
    name: "",
    code: "",
    categoryId: state.categories.find((item) => item.enabled)?.id || "",
    color: "",
    weave: "",
    composition: "",
    width: "",
    weight: "",
    location: "",
    status: "draft",
    fabricClass: "fabric-indigo",
    images: [],
    updatedAt: "尚未保存"
  });
  persistState();
  state.statusFilter = "all";
  state.productSearch = "";
  $("#productSearch").value = "";
  $$("#statusFilter button").forEach((button) => {
    button.classList.toggle("active", button.dataset.status === "all");
  });
  renderAdminProducts();
  const card = $(`[data-product-card="${id}"]`);
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "start" });
    const codeInput = $('[data-field="code"]', card);
    if (codeInput) {
      codeInput.focus();
    }
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function addImages(productId, fileList) {
  const product = state.products.find((item) => item.id === productId);
  if (!product || !fileList || !fileList.length) {
    return;
  }

  const files = Array.from(fileList);
  const remaining = 9 - product.images.length;
  if (remaining <= 0) {
    showToast("每个商品最多上传 9 张图片。");
    return;
  }
  if (files.some((file) => file.size > 8 * 1024 * 1024)) {
    showToast("单张图片不能超过 8MB。");
    return;
  }

  try {
    const selected = files.slice(0, remaining);
    let images = [];
    if (cloudConfigured() && state.isAdmin) {
      showToast("正在上传图片到云端...");
      images = await Promise.all(
        selected.map((file) =>
          window.denimCloud.uploadProductImage(file, product.id)
        )
      );
    } else {
      images = await Promise.all(selected.map(readFileAsDataUrl));
    }
    product.images = product.images.concat(images);
    product.updatedAt = "图片已更新，尚未保存";
    persistState();
    renderAdminProducts();
    showToast(`已添加 ${images.length} 张图片`);
  } catch (error) {
    showToast("图片读取失败，请重新选择。");
  }
}

function removeImage(productId, imageIndex) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) {
    return;
  }
  product.images.splice(imageIndex, 1);
  product.updatedAt = "图片已更新，尚未保存";
  persistState();
  renderAdminProducts();
}

function setCoverImage(productId, imageIndex) {
  const product = state.products.find((item) => item.id === productId);
  if (!product || imageIndex <= 0 || imageIndex >= product.images.length) {
    return;
  }
  const [image] = product.images.splice(imageIndex, 1);
  product.images.unshift(image);
  product.updatedAt = "封面已更新，尚未保存";
  persistState();
  renderAdminProducts();
}

function openCategoryModal(categoryId = null) {
  state.editingCategoryId = categoryId;
  const category = state.categories.find((item) => item.id === categoryId);
  $("#categoryModalTitle").textContent = category ? "编辑分类" : "新增分类";
  $("#categoryName").value = category ? category.name : "";
  $("#categorySort").value = category ? category.sort : state.categories.length + 1;
  $("#categoryEnabled").value = category ? String(category.enabled) : "true";
  openModal("categoryModal");
}

function openModal(modalId) {
  const modal = $(`#${modalId}`);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  refreshIcons();
}

function closeModal(modalId) {
  const modal = $(`#${modalId}`);
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

async function saveCategory(event) {
  event.preventDefault();
  const name = $("#categoryName").value.trim();
  const sort = Number($("#categorySort").value) || 0;
  const enabled = $("#categoryEnabled").value === "true";

  if (!name) {
    showToast("请填写分类名称。");
    return;
  }

  const duplicate = state.categories.some(
    (item) =>
      item.name.toLowerCase() === name.toLowerCase() &&
      item.id !== state.editingCategoryId
  );
  if (duplicate) {
    showToast("分类名称已存在。");
    return;
  }

  const existing = state.categories.find(
    (item) => item.id === state.editingCategoryId
  );
  const category = existing || {
    id: `cat-${Date.now()}`,
    name,
    sort,
    enabled
  };

  if (cloudConfigured()) {
    try {
      const saved = await window.denimCloud.saveCategory({
        ...category,
        name,
        sort,
        enabled
      });
      if (saved) {
        Object.assign(category, saved);
      }
    } catch (error) {
      showToast(`云端保存失败：${error.message || "请检查管理员权限"}`);
      return;
    }
  } else {
    category.name = name;
    category.sort = sort;
    category.enabled = enabled;
  }

  if (!existing) {
    state.categories.push(category);
  }

  persistState();
  renderAdminProducts();
  renderCategories();
  renderStore();
  closeModal("categoryModal");
  showToast("保存成功");
}

async function saveCompany(event) {
  event.preventDefault();
  const company = {
    name: $("#companyName").value.trim(),
    address: $("#companyAddress").value.trim(),
    phone: $("#companyPhone").value.trim(),
    logoUrl: state.company.logoUrl || "",
    salesDepartments: salesDepartments().map((department) => ({
      name: String(department.name || "").trim(),
      address: String(department.address || "").trim(),
      phone: String(department.phone || "").trim()
    }))
  };
  if (!company.name || !company.address || !company.phone) {
    showToast("请填写公司名称、地址和联系电话。");
    return;
  }

  if (cloudConfigured()) {
    try {
      if (state.pendingCompanyLogoFile) {
        company.logoUrl = await window.denimCloud.uploadCompanyLogo(
          state.pendingCompanyLogoFile
        );
      }
      const saved = await window.denimCloud.saveCompany(company);
      if (saved) {
        Object.assign(company, saved);
      }
    } catch (error) {
      showToast(`云端保存失败：${error.message || "请检查管理员权限"}`);
      return;
    }
  } else if (state.pendingCompanyLogoFile) {
    company.logoUrl = await readFileAsDataUrl(state.pendingCompanyLogoFile);
  }

  state.pendingCompanyLogoFile = null;
  state.company = company;
  persistState();
  renderStore();
  showToast("保存成功");
}

function bindEvents() {
  $("#openAdminLogin").addEventListener("click", () => {
    if (window.denimCloud && window.denimCloud.preloadSdk) {
      window.denimCloud.preloadSdk().catch(() => {});
    }
    openModal("adminLoginModal");
  });
  $("#returnStoreButton").addEventListener("click", showStore);
  $("#logoutButton").addEventListener("click", async () => {
    state.isAdmin = false;
    if (state.cloudUnsubscribe) {
      state.cloudUnsubscribe();
      state.cloudUnsubscribe = null;
    }
    if (cloudConfigured()) {
      await window.denimCloud.signOut();
    }
    showStore();
    showToast("已退出管理");
  });

  $("#adminLoginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = $("#adminUsername").value.trim();
    const password = $("#adminPassword").value;
    const expectedLogin = window.denimCloud
      ? window.denimCloud.adminLogin
      : "xbl123";
    if (username !== expectedLogin) {
      showToast("管理员账号或密码不正确。");
      return;
    }

    if (cloudConfigured()) {
      try {
        await window.denimCloud.signIn(
          window.denimCloud.adminEmail,
          password
        );
        await hydrateFromCloud();
      } catch (error) {
        showToast(
          `登录失败：${error.message || "请检查 Supabase 管理员账号"}`
        );
        return;
      }
    } else if (password !== "xbl123") {
      showToast("管理员账号或密码不正确。");
      return;
    }

    state.isAdmin = true;
    $("#adminUsername").value = "";
    $("#adminPassword").value = "";
    closeModal("adminLoginModal");
    showAdmin();
    subscribeCloud();
    showToast(
      state.cloudReady
        ? "登录成功"
        : "登录成功，请先执行 supabase/setup.sql"
    );
  });

  $("#storeSearch").addEventListener("input", (event) => {
    state.storeSearch = event.target.value;
    state.selectedCategoryId = "";
    state.storePage = 1;
    renderStore();
  });

  $("#storeCategoryGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-store-category]");
    if (!button) {
      return;
    }
    state.selectedCategoryId = button.dataset.storeCategory;
    state.storeSearch = "";
    state.storePage = 1;
    $("#storeSearch").value = "";
    renderStore();
    $(".store-section-head").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  $("#backToCategoriesButton").addEventListener("click", () => {
    state.selectedCategoryId = "";
    state.storePage = 1;
    renderStore();
  });

  $("#storePagination").addEventListener("click", (event) => {
    const button = event.target.closest("[data-store-page]");
    if (!button) {
      return;
    }
    state.storePage = Number(button.dataset.storePage);
    renderStore();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  $("#menuButton").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
  });

  $$('[data-action="add-product"]').forEach((button) => {
    button.addEventListener("click", addProduct);
  });

  $$("#statusFilter button").forEach((button) => {
    button.addEventListener("click", () => {
      state.statusFilter = button.dataset.status;
      $$("#statusFilter button").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      renderAdminProducts();
    });
  });

  $("#productSearch").addEventListener("input", (event) => {
    state.productSearch = event.target.value;
    renderAdminProducts();
  });

  $("#globalSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      state.productSearch = event.target.value;
      $("#productSearch").value = state.productSearch;
      switchView("products");
      renderAdminProducts();
    }
  });

  $("#productEditorGrid").addEventListener("input", (event) => {
    if (event.target.matches("[data-product-id][data-field]")) {
      updateProductFromInput(event.target);
    }
  });

  $("#productEditorGrid").addEventListener("change", (event) => {
    if (event.target.matches("[data-product-id][data-field]")) {
      updateProductFromInput(event.target);
      return;
    }
    if (event.target.matches("[data-image-input]")) {
      addImages(event.target.dataset.imageInput, event.target.files);
      event.target.value = "";
    }
  });

  $("#productEditorGrid").addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save-product]");
    const archiveButton = event.target.closest("[data-archive-product]");
    const removeButton = event.target.closest("[data-remove-image]");
    const coverButton = event.target.closest("[data-set-cover]");

    if (saveButton) {
      saveProduct(saveButton.dataset.saveProduct);
      return;
    }
    if (archiveButton) {
      archiveProduct(archiveButton.dataset.archiveProduct);
      return;
    }
    if (removeButton) {
      removeImage(
        removeButton.dataset.removeImage,
        Number(removeButton.dataset.imageIndex)
      );
      return;
    }
    if (coverButton) {
      setCoverImage(
        coverButton.dataset.setCover,
        Number(coverButton.dataset.imageIndex)
      );
    }
  });

  $("#productEditorGrid").addEventListener("dragover", (event) => {
    const dropZone = event.target.closest("[data-drop-product]");
    if (!dropZone) {
      return;
    }
    event.preventDefault();
    dropZone.classList.add("dragover");
  });

  $("#productEditorGrid").addEventListener("dragleave", (event) => {
    const dropZone = event.target.closest("[data-drop-product]");
    if (dropZone) {
      dropZone.classList.remove("dragover");
    }
  });

  $("#productEditorGrid").addEventListener("drop", (event) => {
    const dropZone = event.target.closest("[data-drop-product]");
    if (!dropZone) {
      return;
    }
    event.preventDefault();
    dropZone.classList.remove("dragover");
    addImages(dropZone.dataset.dropProduct, event.dataTransfer.files);
  });

  $("#addCategoryButton").addEventListener("click", () => openCategoryModal());

  $("#categoriesBody").addEventListener("click", async (event) => {
    const toggleButton = event.target.closest("[data-toggle-category]");
    const editButton = event.target.closest("[data-edit-category]");
    const deleteButton = event.target.closest("[data-delete-category]");
    if (toggleButton) {
      const category = state.categories.find(
        (item) => item.id === toggleButton.dataset.toggleCategory
      );
      if (category) {
        const nextEnabled = !category.enabled;
        if (cloudConfigured()) {
          try {
            const saved = await window.denimCloud.saveCategory({
              ...category,
              enabled: nextEnabled
            });
            if (saved) {
              Object.assign(category, saved);
            }
          } catch (error) {
            showToast(`云端更新失败：${error.message || "请检查管理员权限"}`);
            return;
          }
        } else {
          category.enabled = nextEnabled;
        }
        persistState();
        renderCategories();
        renderAdminProducts();
        renderStore();
        showToast(category.enabled ? "分类已启用" : "分类已停用");
      }
      return;
    }
    if (editButton) {
      openCategoryModal(editButton.dataset.editCategory);
      return;
    }
    if (deleteButton) {
      await deleteCategory(deleteButton.dataset.deleteCategory);
    }
  });

  $$("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.dataset.closeModal);
    });
  });

  $$(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("mousedown", (event) => {
      if (event.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  $("#categoryForm").addEventListener("submit", saveCategory);
  $("#companyForm").addEventListener("submit", saveCompany);
  $("#addSalesDepartment").addEventListener("click", () => {
    if (!Array.isArray(state.company.salesDepartments)) {
      state.company.salesDepartments = [];
    }
    state.company.salesDepartments.push({
      name: "",
      address: "",
      phone: ""
    });
    renderSalesDepartmentsEditor();
    const rows = $$(".sales-editor-row", $("#salesDepartmentsEditor"));
    const lastRow = rows[rows.length - 1];
    const firstInput = lastRow && lastRow.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  });

  $("#salesDepartmentsEditor").addEventListener("input", (event) => {
    const input = event.target.closest("[data-sales-index][data-sales-field]");
    if (!input) {
      return;
    }
    const index = Number(input.dataset.salesIndex);
    const field = input.dataset.salesField;
    if (!state.company.salesDepartments[index]) {
      return;
    }
    state.company.salesDepartments[index][field] = input.value;
  });

  $("#salesDepartmentsEditor").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-sales-department]");
    if (!button) {
      return;
    }
    state.company.salesDepartments.splice(
      Number(button.dataset.removeSalesDepartment),
      1
    );
    renderSalesDepartmentsEditor();
  });

  $("#companyLogoInput").addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("公司图标不能超过 2MB。");
      return;
    }
    try {
      const previewUrl = await readFileAsDataUrl(file);
      state.pendingCompanyLogoFile = file;
      renderCompanyLogo($("#companyLogoPreview"), previewUrl);
      showToast("图标已选择，保存后生效");
    } catch (error) {
      showToast("图标读取失败，请重新选择。");
    }
  });

  $("#removeCompanyLogo").addEventListener("click", () => {
    state.pendingCompanyLogoFile = null;
    state.company.logoUrl = "";
    renderCompanyLogo($("#companyLogoPreview"), "");
    showToast("图标已移除，保存后生效");
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopCompanyCarousel();
      return;
    }
    if (!$("#storeView").classList.contains("is-hidden")) {
      startCompanyCarousel();
    }
  });
}

async function init() {
  restoreState();
  bindEvents();
  renderStore();
  renderAdminProducts();
  renderCategories();
  renderCompany();
  showStore();
  await hydrateFromCloud();
  subscribeCloud();
  persistState();
  refreshIcons();
}

document.addEventListener("DOMContentLoaded", init);
