import { formatCategoryLabel } from "./api.js";

const FALLBACK_IMAGE = "assets/images/no-image.svg";

export function getDomElements() {
  return {
    brandLink: document.querySelector("#brand-link"),
    mobileMenuBtn: document.querySelector("#mobile-menu-btn"),
    mainNav: document.querySelector("#main-nav"),
    navExploreBtn: document.querySelector("#nav-explore-btn"),
    navFavouritesBtn: document.querySelector("#nav-favourites-btn"),
    navFavCount: document.querySelector("#nav-fav-count"),
    heroVisibleCount: document.querySelector("#hero-visible-count"),
    heroFavCount: document.querySelector("#hero-fav-count"),
    searchInput: document.querySelector("#search-input"),
    clearSearchBtn: document.querySelector("#clear-search-btn"),
    categorySelect: document.querySelector("#category-select"),
    sortSelect: document.querySelector("#sort-select"),
    resetFiltersBtn: document.querySelector("#reset-filters-btn"),
    resultCountText: document.querySelector("#result-count-text"),
    activeFiltersSummary: document.querySelector("#active-filters-summary"),
    loadingState: document.querySelector("#loading-state"),
    errorState: document.querySelector("#error-state"),
    errorTitle: document.querySelector("#error-title"),
    errorMessage: document.querySelector("#error-message"),
    retryBtn: document.querySelector("#retry-btn"),
    emptyState: document.querySelector("#empty-state"),
    emptyTitle: document.querySelector("#empty-title"),
    emptyMessage: document.querySelector("#empty-message"),
    emptyResetBtn: document.querySelector("#empty-reset-btn"),
    productGrid: document.querySelector("#product-grid"),
    modal: document.querySelector("#product-modal"),
    modalDialog: document.querySelector("#modal-dialog"),
    modalCloseBtn: document.querySelector("#modal-close-btn"),
    modalCloseSecondaryBtn: document.querySelector("#modal-close-secondary-btn"),
    modalImage: document.querySelector("#modal-product-image"),
    modalCategory: document.querySelector("#modal-product-category"),
    modalTitle: document.querySelector("#modal-product-title"),
    modalBrand: document.querySelector("#modal-product-brand"),
    modalPrice: document.querySelector("#modal-product-price"),
    modalRating: document.querySelector("#modal-product-rating"),
    modalStock: document.querySelector("#modal-product-stock"),
    modalDescription: document.querySelector("#modal-product-description"),
    modalFavBtn: document.querySelector("#modal-fav-btn")
  };
}

export function getProductImageUrl(product) {
  if (!product || typeof product !== "object") return FALLBACK_IMAGE;
  const candidate =
    (typeof product.thumbnail === "string" && product.thumbnail.trim()) ||
    (Array.isArray(product.images) && typeof product.images[0] === "string" && product.images[0].trim()) ||
    "";
  if (!candidate) return FALLBACK_IMAGE;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? candidate : FALLBACK_IMAGE;
  } catch (_) {
    return FALLBACK_IMAGE;
  }
}

export function formatPrice(price) {
  const numeric = Number(price);
  return Number.isFinite(numeric) ? `$${numeric.toFixed(2)}` : "$0.00";
}

export function formatRating(rating) {
  const numeric = Number(rating);
  return Number.isFinite(numeric) ? numeric.toFixed(1) : "0.0";
}

export function renderCategoryOptions(selectEl, categories, selectedSlug = "all") {
  if (!selectEl) return;
  selectEl.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All Categories";
  selectEl.appendChild(defaultOption);
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.slug;
    option.textContent = cat.name || formatCategoryLabel(cat.slug);
    selectEl.appendChild(option);
  });
  selectEl.value = selectedSlug || "all";
}

export function updateNavigationState(dom, activeView) {
  const isFavourites = activeView === "favourites";
  dom.navExploreBtn.classList.toggle("is-active", !isFavourites);
  dom.navFavouritesBtn.classList.toggle("is-active", isFavourites);
  dom.navExploreBtn.setAttribute("aria-pressed", String(!isFavourites));
  dom.navFavouritesBtn.setAttribute("aria-pressed", String(isFavourites));
}

export function closeMobileMenu(dom) {
  dom.mainNav.classList.remove("is-open");
  dom.mobileMenuBtn.setAttribute("aria-expanded", "false");
}

export function toggleMobileMenu(dom) {
  const isOpen = dom.mainNav.classList.toggle("is-open");
  dom.mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
}

export function updateCountsAndSummary(dom, { visibleCount, totalFavCount, activeView, searchQuery, category, sortBy }) {
  dom.navFavCount.textContent = String(totalFavCount);
  dom.heroFavCount.textContent = String(totalFavCount);
  dom.heroVisibleCount.textContent = String(visibleCount);

  if (activeView === "favourites") {
    dom.resultCountText.textContent =
      visibleCount === 1 ? "Showing 1 saved favourite product" : `Showing ${visibleCount} saved favourite products`;
  } else {
    dom.resultCountText.textContent =
      visibleCount === 1 ? "Showing 1 product" : `Showing ${visibleCount} products`;
  }

  const filterParts = [];
  if (activeView === "favourites") filterParts.push("View: Favourites");
  if (category && category !== "all") filterParts.push(`Category: ${formatCategoryLabel(category)}`);
  if (searchQuery && searchQuery.trim()) filterParts.push(`Search: "${searchQuery.trim()}"`);
  if (sortBy === "price-asc") filterParts.push("Sort: Price Low to High");
  else if (sortBy === "price-desc") filterParts.push("Sort: Price High to Low");

  dom.activeFiltersSummary.textContent =
    filterParts.length > 0 ? `Active filters — ${filterParts.join(" • ")}` : "Showing all available items";
}

export function showLoadingState(dom) {
  dom.loadingState.classList.remove("is-hidden");
  dom.errorState.classList.add("is-hidden");
  dom.emptyState.classList.add("is-hidden");
  dom.productGrid.classList.add("is-hidden");
}

export function showErrorState(dom, title, message) {
  dom.loadingState.classList.add("is-hidden");
  dom.emptyState.classList.add("is-hidden");
  dom.productGrid.classList.add("is-hidden");
  dom.errorTitle.textContent = title;
  dom.errorMessage.textContent = message;
  dom.errorState.classList.remove("is-hidden");
}

export function showEmptyState(dom, { title, message, showResetButton = true }) {
  dom.loadingState.classList.add("is-hidden");
  dom.errorState.classList.add("is-hidden");
  dom.productGrid.classList.add("is-hidden");
  dom.emptyTitle.textContent = title;
  dom.emptyMessage.textContent = message;
  dom.emptyResetBtn.classList.toggle("is-hidden", !showResetButton);
  dom.emptyState.classList.remove("is-hidden");
}

function createProductCard(product, isFav) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.setAttribute("role", "listitem");
  card.dataset.productId = String(product.id);

  const mediaDiv = document.createElement("div");
  mediaDiv.className = "product-media";
  mediaDiv.title = `View details for ${product.title}`;

  const img = document.createElement("img");
  img.className = "product-image";
  img.src = getProductImageUrl(product);
  img.alt = product.title || "Product image";
  img.loading = "lazy";
  img.addEventListener("error", () => {
    if (!img.dataset.fallbackApplied) {
      img.dataset.fallbackApplied = "true";
      img.src = FALLBACK_IMAGE;
    }
  });
  mediaDiv.appendChild(img);

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "product-body";

  const categorySpan = document.createElement("span");
  categorySpan.className = "product-category";
  categorySpan.textContent = formatCategoryLabel(product.category || "General");

  const titleHeading = document.createElement("h2");
  titleHeading.className = "product-title";
  titleHeading.textContent = product.title || "Untitled Product";
  titleHeading.title = product.title || "Untitled Product";

  const metaDiv = document.createElement("div");
  metaDiv.className = "product-meta";

  const priceSpan = document.createElement("span");
  priceSpan.className = "product-price";
  priceSpan.textContent = formatPrice(product.price);

  const ratingSpan = document.createElement("span");
  ratingSpan.className = "product-rating";
  const starSpan = document.createElement("span");
  starSpan.className = "star-icon";
  starSpan.setAttribute("aria-hidden", "true");
  starSpan.textContent = "★";
  ratingSpan.appendChild(starSpan);
  ratingSpan.appendChild(document.createTextNode(` ${formatRating(product.rating)}`));

  metaDiv.appendChild(priceSpan);
  metaDiv.appendChild(ratingSpan);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "product-actions";

  const detailsBtn = document.createElement("button");
  detailsBtn.type = "button";
  detailsBtn.className = "btn btn-secondary details-btn";
  detailsBtn.dataset.action = "details";
  detailsBtn.dataset.productId = String(product.id);
  detailsBtn.textContent = "Details";

  const favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.className = isFav ? "btn btn-fav is-favourite" : "btn btn-fav";
  favBtn.dataset.action = "favourite";
  favBtn.dataset.productId = String(product.id);
  favBtn.setAttribute("aria-pressed", String(isFav));
  favBtn.setAttribute(
    "aria-label",
    isFav ? `Remove ${product.title} from favourites` : `Add ${product.title} to favourites`
  );
  favBtn.textContent = isFav ? "♥ Saved" : "♡ Save";

  actionsDiv.appendChild(detailsBtn);
  actionsDiv.appendChild(favBtn);

  bodyDiv.appendChild(categorySpan);
  bodyDiv.appendChild(titleHeading);
  bodyDiv.appendChild(metaDiv);
  bodyDiv.appendChild(actionsDiv);

  card.appendChild(mediaDiv);
  card.appendChild(bodyDiv);
  return card;
}

export function renderProductGrid(dom, products, favouriteIdsSet) {
  dom.loadingState.classList.add("is-hidden");
  dom.errorState.classList.add("is-hidden");
  dom.emptyState.classList.add("is-hidden");
  dom.productGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    fragment.appendChild(createProductCard(product, favouriteIdsSet.has(Number(product.id))));
  });
  dom.productGrid.appendChild(fragment);
  dom.productGrid.classList.remove("is-hidden");
}

export function openProductModal(dom, product, isFav) {
  dom.modalImage.src = getProductImageUrl(product);
  dom.modalImage.alt = product.title || "Product preview";
  dom.modalImage.onerror = () => { dom.modalImage.src = FALLBACK_IMAGE; };
  dom.modalCategory.textContent = formatCategoryLabel(product.category || "General");
  dom.modalTitle.textContent = product.title || "Untitled Product";
  dom.modalBrand.textContent = product.brand ? `Brand: ${product.brand}` : "Brand: Not specified";
  dom.modalPrice.textContent = formatPrice(product.price);
  dom.modalRating.textContent = `★ ${formatRating(product.rating)} / 5.0`;
  const stockCount = Number(product.stock);
  dom.modalStock.textContent = Number.isFinite(stockCount) && stockCount > 0 ? `In Stock (${stockCount})` : "Out of Stock";
  dom.modalDescription.textContent = product.description || "No description is available for this product.";
  updateModalFavouriteButton(dom, isFav);
  dom.modal.classList.remove("is-hidden");
  dom.modalCloseBtn.focus();
}

export function updateModalFavouriteButton(dom, isFav) {
  dom.modalFavBtn.textContent = isFav ? "♥ Saved in Favourites" : "♡ Add to Favourites";
  dom.modalFavBtn.classList.toggle("is-favourite", isFav);
  dom.modalFavBtn.setAttribute("aria-pressed", String(isFav));
}

export function closeProductModal(dom) {
  dom.modal.classList.add("is-hidden");
}
