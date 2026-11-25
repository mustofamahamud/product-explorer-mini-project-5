import { fetchAllProducts, fetchCategories, fetchProductsByCategory, fetchProductById } from "./api.js";
import { getFavourites, addFavourite, removeFavourite, isFavourite } from "./storage.js";
import {
  getDomElements, renderCategoryOptions, updateNavigationState, closeMobileMenu,
  toggleMobileMenu, updateCountsAndSummary, showLoadingState, showErrorState,
  showEmptyState, renderProductGrid, openProductModal, updateModalFavouriteButton,
  closeProductModal
} from "./ui.js";

const state = {
  allProducts: [],
  categories: [],
  categoryCache: new Map(),
  favourites: [],
  activeView: "explore",
  searchQuery: "",
  selectedCategory: "all",
  sortBy: "default",
  selectedProduct: null,
  isLoading: false
};

const dom = getDomElements();

function getFavouriteIdSet() {
  return new Set(state.favourites.map((item) => Number(item.id)));
}

function findProductByIdLocal(productId) {
  const targetId = Number(productId);
  const fromMain = state.allProducts.find((item) => Number(item.id) === targetId);
  if (fromMain) return fromMain;
  const fromFavs = state.favourites.find((item) => Number(item.id) === targetId);
  if (fromFavs) return fromFavs;
  for (const cachedList of state.categoryCache.values()) {
    const found = cachedList.find((item) => Number(item.id) === targetId);
    if (found) return found;
  }
  return undefined;
}

function getSourceProducts() {
  if (state.activeView === "favourites") return state.favourites;
  if (state.selectedCategory && state.selectedCategory !== "all") {
    return state.categoryCache.get(state.selectedCategory) || state.allProducts.filter(
      (item) => String(item.category).toLowerCase() === String(state.selectedCategory).toLowerCase()
    );
  }
  return state.allProducts;
}

function getFilteredAndSortedProducts(products) {
  const query = state.searchQuery.trim().toLowerCase();
  const filtered = products.filter((product) => {
    if (!query) return true;
    const titleMatch = String(product.title || "").toLowerCase().includes(query);
    const brandMatch = String(product.brand || "").toLowerCase().includes(query);
    const categoryMatch = String(product.category || "").toLowerCase().includes(query);
    return titleMatch || brandMatch || categoryMatch;
  });

  const decorated = filtered.map((item) => ({
    product: item,
    numericPrice: Number.isFinite(Number(item.price)) ? Number(item.price) : 0
  }));

  if (state.sortBy === "price-asc") decorated.sort((a, b) => a.numericPrice - b.numericPrice);
  else if (state.sortBy === "price-desc") decorated.sort((a, b) => b.numericPrice - a.numericPrice);

  return decorated.map((entry) => entry.product);
}

function renderCurrentView() {
  if (state.isLoading) return;
  const favIds = getFavouriteIdSet();
  const sourceProducts = getSourceProducts();
  const displayedProducts = getFilteredAndSortedProducts(sourceProducts);

  updateCountsAndSummary(dom, {
    visibleCount: displayedProducts.length,
    totalFavCount: state.favourites.length,
    activeView: state.activeView,
    searchQuery: state.searchQuery,
    category: state.selectedCategory,
    sortBy: state.sortBy
  });

  if (displayedProducts.length === 0) {
    if (state.activeView === "favourites" && state.favourites.length === 0 && !state.searchQuery.trim()) {
      showEmptyState(dom, {
        title: "No saved favourites yet",
        message: "Click the Save button on any product card or inside the details modal to build your favourites list.",
        showResetButton: false
      });
    } else {
      showEmptyState(dom, {
        title: "No matching products found",
        message: "No products matched your current search or filter criteria. Try clearing filters or searching another keyword.",
        showResetButton: true
      });
    }
    return;
  }

  renderProductGrid(dom, displayedProducts, favIds);
}

async function loadInitialCatalog() {
  state.isLoading = true;
  showLoadingState(dom);
  try {
    const [products, categories] = await Promise.all([fetchAllProducts(100), fetchCategories()]);
    state.allProducts = products;
    state.categories = categories;
    state.categoryCache.set("all", products);
    renderCategoryOptions(dom.categorySelect, state.categories, state.selectedCategory);
    state.isLoading = false;
    renderCurrentView();
  } catch (error) {
    state.isLoading = false;
    const isOffline = typeof navigator !== "undefined" && navigator.onLine === false;
    showErrorState(
      dom,
      isOffline ? "You appear to be offline" : "Failed to load catalog",
      isOffline
        ? "Please check your internet connection and click Retry Request."
        : (error.message || "Could not retrieve products from DummyJSON API.")
    );
  }
}

async function handleCategoryChange(categorySlug) {
  state.selectedCategory = categorySlug || "all";
  if (state.activeView === "favourites" || state.selectedCategory === "all" || state.categoryCache.has(state.selectedCategory)) {
    renderCurrentView();
    return;
  }
  state.isLoading = true;
  showLoadingState(dom);
  try {
    const categoryProducts = await fetchProductsByCategory(state.selectedCategory);
    state.categoryCache.set(state.selectedCategory, categoryProducts);
    state.isLoading = false;
    renderCurrentView();
  } catch (error) {
    state.isLoading = false;
    showErrorState(
      dom,
      "Category filter failed",
      error.message || `Could not load products for category "${state.selectedCategory}".`
    );
  }
}

function handleToggleFavourite(productId) {
  const targetId = Number(productId);
  if (!Number.isFinite(targetId) || targetId <= 0) return;

  if (isFavourite(targetId)) {
    state.favourites = removeFavourite(targetId).favourites;
  } else {
    const product = findProductByIdLocal(targetId);
    if (!product) return;
    state.favourites = addFavourite(product).favourites;
  }

  if (state.selectedProduct && Number(state.selectedProduct.id) === targetId) {
    updateModalFavouriteButton(dom, isFavourite(targetId));
  }

  renderCurrentView();
}

async function handleOpenProductModal(productId) {
  const localProduct = findProductByIdLocal(productId);
  if (localProduct) {
    state.selectedProduct = localProduct;
    openProductModal(dom, localProduct, isFavourite(localProduct.id));
  }
  try {
    const freshProduct = await fetchProductById(productId);
    state.selectedProduct = freshProduct;
    if (!dom.modal.classList.contains("is-hidden")) {
      openProductModal(dom, freshProduct, isFavourite(freshProduct.id));
    }
  } catch (_) {}
}

function resetAllFilters() {
  state.searchQuery = "";
  state.selectedCategory = "all";
  state.sortBy = "default";
  dom.searchInput.value = "";
  dom.categorySelect.value = "all";
  dom.sortSelect.value = "default";
  renderCurrentView();
}

function switchView(viewName) {
  state.activeView = viewName;
  updateNavigationState(dom, state.activeView);
  closeMobileMenu(dom);
  renderCurrentView();
}

function bindEvents() {
  dom.mobileMenuBtn.addEventListener("click", () => toggleMobileMenu(dom));
  dom.navExploreBtn.addEventListener("click", () => switchView("explore"));
  dom.navFavouritesBtn.addEventListener("click", () => switchView("favourites"));
  dom.brandLink.addEventListener("click", () => {
    state.activeView = "explore";
    updateNavigationState(dom, "explore");
    resetAllFilters();
  });

  dom.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value;
    renderCurrentView();
  });

  dom.clearSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    dom.searchInput.value = "";
    dom.searchInput.focus();
    renderCurrentView();
  });

  dom.categorySelect.addEventListener("change", (event) => handleCategoryChange(event.target.value));
  dom.sortSelect.addEventListener("change", (event) => {
    state.sortBy = event.target.value;
    renderCurrentView();
  });

  dom.resetFiltersBtn.addEventListener("click", resetAllFilters);
  dom.emptyResetBtn.addEventListener("click", resetAllFilters);
  dom.retryBtn.addEventListener("click", () => {
    if (state.selectedCategory && state.selectedCategory !== "all" && state.allProducts.length > 0) {
      handleCategoryChange(state.selectedCategory);
    } else {
      loadInitialCatalog();
    }
  });

  dom.productGrid.addEventListener("click", (event) => {
    const actionBtn = event.target.closest("[data-action]");
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      const productId = actionBtn.dataset.productId;
      if (action === "favourite") handleToggleFavourite(productId);
      else if (action === "details") handleOpenProductModal(productId);
      return;
    }
    const card = event.target.closest(".product-card");
    if (card && (event.target.closest(".product-media") || event.target.closest(".product-title"))) {
      handleOpenProductModal(card.dataset.productId);
    }
  });

  dom.modalCloseBtn.addEventListener("click", () => closeProductModal(dom));
  dom.modalCloseSecondaryBtn.addEventListener("click", () => closeProductModal(dom));
  dom.modal.addEventListener("click", (event) => {
    if (event.target === dom.modal) closeProductModal(dom);
  });
  dom.modalFavBtn.addEventListener("click", () => {
    if (state.selectedProduct) handleToggleFavourite(state.selectedProduct.id);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.modal.classList.contains("is-hidden")) {
      closeProductModal(dom);
    }
  });
}

function initApp() {
  state.favourites = getFavourites();
  updateNavigationState(dom, state.activeView);
  bindEvents();
  loadInitialCatalog();
}

document.addEventListener("DOMContentLoaded", initApp);
