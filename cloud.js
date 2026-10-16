(function () {
  const config = window.SUPABASE_CONFIG || {};
  const configured = Boolean(
    config.url && config.anonKey && window.supabase && window.supabase.createClient
  );
  const client = configured
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;

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
      sort: Number(row.sort) || 0,
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
    return {
      name: product.name.trim(),
      code: product.code.trim().toUpperCase(),
      category_id: product.categoryId,
      color: product.color || "",
      weave: product.weave || "",
      composition: product.composition || "",
      width: product.width || "",
      weight: product.weight || "",
      location: product.location || "",
      status: product.status || "draft",
      sort: Number(product.sort) || 0,
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
    const [categoriesResult, productsResult, companyResult] = await Promise.all([
      client.from("categories").select("*").order("sort", { ascending: true }),
      client.from("products").select("*").order("sort", { ascending: true }),
      client.from("company_profile").select("*").eq("id", "company_profile").maybeSingle()
    ]);
    const error =
      categoriesResult.error || productsResult.error || companyResult.error;
    if (error) {
      throw error;
    }
    return {
      categories: (categoriesResult.data || []).map(mapCategory),
      products: (productsResult.data || []).map(mapProduct),
      company: mapCompany(companyResult.data)
    };
  }

  async function fetchProduct(id) {
    if (!configured || !id) {
      return null;
    }
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      throw error;
    }
    return data ? mapProduct(data) : null;
  }

  async function signIn(email, password) {
    if (!configured) {
      return null;
    }
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      throw error;
    }
    return data.session;
  }

  async function signOut() {
    if (configured) {
      await client.auth.signOut();
    }
  }

  async function getSession() {
    if (!configured) {
      return null;
    }
    const { data } = await client.auth.getSession();
    return data.session || null;
  }

  async function saveProduct(product) {
    if (!configured) {
      return null;
    }
    const payload = productRow(product);
    const isRemoteId =
      typeof product.id === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        product.id
      );
    const query = isRemoteId
      ? client.from("products").update(payload).eq("id", product.id)
      : client.from("products").insert(payload);
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
    const { data, error } = await client
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
    const payload = categoryRow(category);
    const isRemoteId =
      typeof category.id === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        category.id
      );
    const query = isRemoteId
      ? client.from("categories").update(payload).eq("id", category.id)
      : client.from("categories").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) {
      throw error;
    }
    return mapCategory(data);
  }

  async function saveCompany(company) {
    if (!configured) {
      return null;
    }
    const { data, error } = await client
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
    const extension = file.name && file.name.includes(".")
      ? file.name.split(".").pop().toLowerCase()
      : "jpg";
    const safeName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}.${extension}`;
    const path = `${productId}/${safeName}`;
    const { error } = await client.storage
      .from(config.imageBucket)
      .upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false
      });
    if (error) {
      throw error;
    }
    const { data } = client.storage.from(config.imageBucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function uploadCompanyLogo(file) {
    if (!configured) {
      return null;
    }
    const extension = file.name && file.name.includes(".")
      ? file.name.split(".").pop().toLowerCase()
      : "png";
    const safeName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}.${extension}`;
    const path = `company-logo/${safeName}`;
    const { error } = await client.storage
      .from(config.imageBucket)
      .upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false
      });
    if (error) {
      throw error;
    }
    const { data } = client.storage.from(config.imageBucket).getPublicUrl(path);
    return data.publicUrl;
  }

  function subscribeCatalog(onChange) {
    if (!configured || typeof onChange !== "function") {
      return () => {};
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
    fetchCatalog,
    fetchProduct,
    signIn,
    signOut,
    getSession,
    saveProduct,
    archiveProduct,
    saveCategory,
    saveCompany,
    uploadProductImage,
    uploadCompanyLogo,
    subscribeCatalog
  };
})();
