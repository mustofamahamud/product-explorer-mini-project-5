const STORAGE_KEY = "product_explorer_favourites_v1";

function sanitizeFavouriteItem(item) {
  if (!item || typeof item !== "object") return null;
  const numericId = Number(item.id);
  if (!Number.isFinite(numericId) || numericId <= 0) return null;
  return {
    id: numericId,
    title: typeof item.title === "string" && item.title.trim() ? item.title.trim() : "Untitled Product",
    price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
    rating: Number.isFinite(Number(item.rating)) ? Number(item.rating) : 0,
    category: typeof item.category === "string" ? item.category : "general",
    brand: typeof item.brand === "string" ? item.brand : "",
    description: typeof item.description === "string" ? item.description : "",
    stock: Number.isFinite(Number(item.stock)) ? Number(item.stock) : 0,
    thumbnail: typeof item.thumbnail === "string" ? item.thumbnail : ""
  };
}

export function getFavourites() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return [];
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    const uniqueMap = new Map();
    parsed.forEach((entry) => {
      const clean = sanitizeFavouriteItem(entry);
      if (clean && !uniqueMap.has(clean.id)) {
        uniqueMap.set(clean.id, clean);
      }
    });
    return Array.from(uniqueMap.values());
  } catch (error) {
    console.warn("Corrupted favourites data detected in Local Storage. Resetting safely.", error);
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    return [];
  }
}

export function saveFavourites(favourites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(favourites) ? favourites : []));
    return true;
  } catch (error) {
    console.error("Failed to save favourites to Local Storage:", error);
    return false;
  }
}

export function addFavourite(product) {
  const current = getFavourites();
  const cleanProduct = sanitizeFavouriteItem(product);
  if (!cleanProduct) return { favourites: current, added: false, alreadyExists: false };
  if (current.some((item) => item.id === cleanProduct.id)) {
    return { favourites: current, added: false, alreadyExists: true };
  }
  const updated = [...current, cleanProduct];
  saveFavourites(updated);
  return { favourites: updated, added: true, alreadyExists: false };
}

export function removeFavourite(productId) {
  const targetId = Number(productId);
  const current = getFavourites();
  const updated = current.filter((item) => item.id !== targetId);
  const removed = updated.length !== current.length;
  if (removed) {
    if (updated.length === 0) clearFavourites();
    else saveFavourites(updated);
  }
  return { favourites: updated, removed };
}

export function isFavourite(productId) {
  const targetId = Number(productId);
  return getFavourites().some((item) => item.id === targetId);
}

export function clearFavourites() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
}
