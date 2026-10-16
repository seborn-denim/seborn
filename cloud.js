(function () {
  const config = window.SUPABASE_CONFIG || {};
  const configured = Boolean(config.url && config.anonKey);
  let client = null;
  let sdkPromise = null;

  function ensureSdk() {
    if (client) {
      return Promise.resolve(client);
    }
    if (sdkPromise) {
      return sdkPromise;
    }
    sdkPromise = new Promise((resolve, reject) => {
      const createClient = () => {
        if (!window.supabase || !window.supabase.createClient) {
          reject(new Error("Supabase 客户端加载失败"));
          return;
        }
        client = window.supabase.createClient(config.url, config.anonKey);
        resolve(client);
      };

      if (window.supabase && window.supabase.createClient) {
        createClient();
        return;
      }

      let script = document.querySelector("script[data-supabase-sdk]");
      if (script) {
        script.addEventListener("load", createClient, { once: true });
        script.addEventListener(
          "error",
          () => reject(new Error("Supabase 客户端加载失败")),
          { once: true }
        );
        return;
      }

      script = document.createElement("script");
      script.src = "./vendor/supabase/supabase.js";
      script.dataset.supabaseSdk = "true";
      script.addEventListener("load", createClient, { once: true });
      script.addEventListener(
        "error",
        () => reject(new Error("Supabase 客户端加载失败")),
        { once: true }
      );
      document.head.appendChild(script);
    });
    return sdkPromise;
  }

  async function restHeaders() {
    let accessToken = config.anonKey;
    if (client) {
      try {
        const { data } = await client.auth.getSession();
        if (data && data.session && data.session.access_token) {
          accessToken = data.session.access_token;
        }
      } catch (error) {
        accessToken = config.anonKey;
      }
    }
    return {
      apikey: config.anonKey,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    };
  }

  async function restRequest(path, options) {
    const settings = options || {};
    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      method: settings.method || "GET",
      headers: Object.assign({}, await restHeaders(), settings.headers || {}),
      body: settings.body
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Supabase 请求失败：${response.status}`);
    }
    if (response.status === 204) {
      return null;
    }
    return response.json();
  }

  function formatDate(value) {
    if (!value) {
      return "尚未保存";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    const parts = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}`;
  }

  function mapCategory(row) {
    return {
      id: row.id,
      name: row.name,
      sort: Number(row.sort) || 0,
      enabled: row.enabled !== false
    };
  }

  function mapProduct(row) {
    return {
      id: row.id,
      name: row.name || "",
      code: row.code || "",
      categoryId: row.category_id || "",
      color: row.color || "",
      weave: row.weave || "",
      composition: row.composition || "",
      width: row.width || "",
      weight: row.weight || "",
      location: row.location || "",
      status: row.status || "draft",
      fabricClass: row.fabric_class || "fabric-indigo",
      images: Array.isArray(row.images) ? row.images : [],
      updatedAt: formatDate(row.updated_at)
    };
  }

  function mapCompany(row) {
    return {
      name: row && row.name ? row.name : "",
      address: row && row.address ? row.address : "",
      phone: row && row.phone ? row.phone : "",
      logoUrl: row && row.logo_url ? row.logo_url : "",
      salesDepartments: Array.isArray(row && row.sales_departments)
        ? row.sales_departments.map((department) => ({
            name: department.name || "",
            address: department.address || "",
            phone: department.phone || ""
          }))
        : []
    };
  }

  function productRow(product) {
    const code = product.code.trim().toUpperCase();
    return {
      name: (product.name || code || "未命名商品").trim(),
      code,
      category_id: product.categoryId || null,
      color: product.color || "",
      weave: product.weave || "",
      composition: product.composition || "",
      width: product.width || "",
      weight: product.weight || "",
      location: product.location || "",
      status: product.status || "draft",
      fabric_class: product.fabricClass || "fabric-indigo",
      images: product.images || [],
      updated_at: new Date().toISOString()
    };
  }

  function categoryRow(category) {
    return {
      name: category.name.trim(),
      sort: Number(category.sort) || 0,
      enabled: category.enabled !== false,
      updated_at: new Date().toISOString()
    };
  }

  async function fetchCatalog() {
    if (!configured) {
      return null;
    }
    const [categories, products, companyRows] = await Promise.all([
      restRequest("categories?select=*&order=sort.asc"),
      restRequest("products?select=*&order=updated_at.desc"),
      restRequest("company_profile?select=*&id=eq.company_profile&limit=1")
    ]);
    return {
      categories: (categories || []).map(mapCategory),
      products: (products || []).map(mapProduct),
      company: mapCompany((companyRows || [])[0] || null)
    };
  }

  async function fetchProduct(id) {
    if (!configured || !id) {
      return null;
    }
    const rows = await restRequest(
      `products?select=*&id=eq.${encodeURIComponent(id)}&limit=1`
    );
    return rows && rows[0] ? mapProduct(rows[0]) : null;
  }

  async function fetchCategories() {
    if (!configured) {
      return [];
    }
    const rows = await restRequest("categories?select=*&order=sort.asc");
    return (rows || []).map(mapCategory);
  }

  async function signIn(email, password) {
    if (!configured) {
      return null;
    }
    const supabaseClient = await ensureSdk();
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      throw error;
    }
    return data.session;
  }

  async function signOut() {
    if (!configured || !client) {
      return;
    }
    await client.auth.signOut();
  }

  async function getSession() {
    if (!configured) {
      return null;
    }
    const supabaseClient = await ensureSdk();
    const { data } = await supabaseClient.auth.getSession();
    return data.session || null;
  }

  async function saveProduct(product) {
    if (!configured) {
      return null;
    }
    const supabaseClient = await ensureSdk();
    const payload = productRow(product);
    const isRemoteId =
      typeof product.id === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        product.id
      );
    const query = isRemoteId
      ? supabaseClient.from("products").update(payload).eq("id", product.id)
      : supabaseClient.from("products").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) {
      throw error;
    }
    return mapProduct(data);
  }

  async function archiveProduct(id) {
    if (!configured) {
      return null;
    }
    const supabaseClient = await ensureSdk();
    const { data, error } = await supabaseClient
      .from("products")
      .update({
        status: "archived",
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return mapProduct(data);
  }

  async function saveCategory(category) {
    if (!configured) {
      return null;
    }
    const supabaseClient = await ensureSdk();
    const payload = categoryRow(category);
    const isRemoteId =
      typeof category.id === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        category.id
      );
    const query = isRemoteId
      ? supabaseClient.from("categories").update(payload).eq("id", category.id)
      : supabaseClient.from("categories").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) {
      throw error;
    }
    return mapCategory(data);
  }

  async function deleteCategory(id) {
    if (!configured) {
      return null;
    }
    const supabaseClient = await ensureSdk();
    const { error: updateError } = await supabaseClient
      .from("products")
      .update({
        category_id: null,
        updated_at: new Date().toISOString()
      })
      .eq("category_id", id);
    if (updateError) {
      throw updateError;
    }
    const { data, error } = await supabaseClient
      .from("categories")
      .delete()
      .eq("id", id)
      .select("id")
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async function saveCompany(company) {
    if (!configured) {
      return null;
    }
    const supabaseClient = await ensureSdk();
    const { data, error } = await supabaseClient
      .from("company_profile")
      .upsert(
        {
          id: "company_profile",
          name: company.name,
          address: company.address,
          phone: company.phone,
          logo_url: company.logoUrl || "",
          sales_departments: Array.isArray(company.salesDepartments)
            ? company.salesDepartments
            : [],
          updated_at: new Date().toISOString()
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return mapCompany(data);
  }

  async function uploadProductImage(file, productId) {
    if (!configured) {
      return null;
    }
    const supabaseClient = await ensureSdk();
    const extension = file.name && file.name.includes(".")
      ? file.name.split(".").pop().toLowerCase()
      : "jpg";
    const safeName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}.${extension}`;
    const path = `${productId}/${safeName}`;
    const { error } = await supabaseClient.storage
      .from(config.imageBucket)
      .upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false
      });
    if (error) {
      throw error;
    }
    const { data } = supabaseClient.storage
      .from(config.imageBucket)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async function uploadCompanyLogo(file) {
    if (!configured) {
      return null;
    }
    const supabaseClient = await ensureSdk();
    const extension = file.name && file.name.includes(".")
      ? file.name.split(".").pop().toLowerCase()
      : "png";
    const safeName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}.${extension}`;
    const path = `company-logo/${safeName}`;
    const { error } = await supabaseClient.storage
      .from(config.imageBucket)
      .upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false
      });
    if (error) {
      throw error;
    }
    const { data } = supabaseClient.storage
      .from(config.imageBucket)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  function subscribeCatalog(onChange) {
    if (!configured || !client || typeof onChange !== "function") {
      return null;
    }
    const channel = client
      .channel("denim-catalog")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        onChange
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        onChange
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "company_profile" },
        onChange
      )
      .subscribe();
    return () => client.removeChannel(channel);
  }

  window.denimCloud = {
    isConfigured: () => configured,
    adminLogin: config.adminLogin || "xbl123",
    adminEmail: config.adminEmail || "",
    preloadSdk: ensureSdk,
    fetchCatalog,
    fetchProduct,
    fetchCategories,
    signIn,
    signOut,
    getSession,
    saveProduct,
    archiveProduct,
    saveCategory,
    deleteCategory,
    saveCompany,
    uploadProductImage,
    uploadCompanyLogo,
    subscribeCatalog
  };
})();
