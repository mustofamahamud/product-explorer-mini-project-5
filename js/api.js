const BASE_URL = "https://dummyjson.com";
const DEFAULT_LIMIT = 100;

async function requestJson(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP request failed with status ${response.status} (${response.statusText || "Error"})`);
  }
  const data = await response.json();
  if (!data || typeof data !== "object") {
    throw new Error("Received invalid JSON response from server.");
  }
  return data;
}

export async function fetchAllProducts(limit = DEFAULT_LIMIT) {
  const data = await requestJson(`/products?limit=${encodeURIComponent(limit)}`);
  if (!Array.isArray(data.products)) {
    throw new Error("API response is missing a valid products array.");
  }
  return data.products;
}

export async function fetchCategories() {
  const data = await requestJson("/products/categories");
  if (!Array.isArray(data)) {
    throw new Error("API response for categories is not an array.");
  }
  return data
    .map((item) => {
      if (typeof item === "string") {
        const cleanSlug = item.trim();
        return { slug: cleanSlug, name: formatCategoryLabel(cleanSlug) };
      }
      if (item && typeof item === "object") {
        const slug = String(item.slug || item.name || "").trim();
        const name = String(item.name || formatCategoryLabel(slug)).trim();
        return { slug, name };
      }
      return null;
    })
    .filter((cat) => cat && cat.slug.length > 0);
}

export async function fetchProductsByCategory(categorySlug) {
  const safeSlug = encodeURIComponent(String(categorySlug).trim());
  const data = await requestJson(`/products/category/${safeSlug}`);
  if (!Array.isArray(data.products)) {
    throw new Error(`Invalid products list returned for category "${categorySlug}".`);
  }
  return data.products;
}

export async function fetchProductById(productId) {
  const safeId = encodeURIComponent(String(productId).trim());
  const product = await requestJson(`/products/${safeId}`);
  if (!product || typeof product.id === "undefined") {
    throw new Error("Product details response is incomplete.");
  }
  return product;
}

export function formatCategoryLabel(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
