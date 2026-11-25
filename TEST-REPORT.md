# Test Report — Product Explorer

**Course:** Software Development I (CSE-2340)  
**Project:** Product Explorer (`product-explorer`)  
**Environment Note:** Static file verification, HTML/JS reference checks, Local Storage sanitization checks, and ZIP archive extraction verification were executed. Live browser automation and external internet connectivity to `dummyjson.com` are unavailable in this sandbox, so browser-dependent test cases are marked **NOT TESTED**.

| Test Case | Expected Result | Actual Result | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01: Project Structure & Required Files** | All 11 required files exist inside `product-explorer/`. | All required files created and verified on disk. | **PASS** | Verified via Python filesystem check. |
| **TC-02: HTML & DOM ID Reference Integrity** | Every element ID queried in `js/ui.js` exists in `index.html`. | All queried IDs match elements in `index.html`. | **PASS** | Verified via static ID matching. |
| **TC-03: Local Storage Parsing, Deduplication & Corruption Handling** | Valid favourite items deduplicate by ID; corrupted or non-array JSON resets safely to `[]`. | Simulated sanitization & JSON parse logic passed for corrupted JSON, non-array JSON, and duplicate IDs. | **PASS** | Verified via unit logic check. |
| **TC-04: ZIP Archive Integrity & Extraction** | `Product-Explorer-Mini-Project.zip` passes `testzip()` and extracts cleanly with root folder `product-explorer/`. | ZIP archive verified and extracted cleanly. | **PASS** | Verified via Python `zipfile`. |
| **TC-05: Live DummyJSON API Connectivity & Product Loading** | `fetchAllProducts()`, `fetchCategories()`, `fetchProductsByCategory()`, and `fetchProductById()` retrieve live data from `dummyjson.com`. | Not executed in sandbox because outbound internet access is unavailable. | **NOT TESTED** | Verify in browser with Live Server and internet access. |
| **TC-06: Live Search, Category Filter & Price Sorting** | Typing in search, selecting a category, and sorting low-to-high / high-to-low update cards and counts dynamically. | Not executed in a live browser DOM environment. | **NOT TESTED** | Implemented in `getFilteredAndSortedProducts()` and `handleCategoryChange()`. |
| **TC-07: Favourite Add/Remove & Refresh Persistence in Browser** | Clicking Save/Saved persists to `localStorage` across browser refresh and updates Favourites view. | Not executed in a live browser session. | **NOT TESTED** | Implemented in `js/storage.js` and `js/app.js`. |
| **TC-08: Product Details Modal & Keyboard/Backdrop Close** | Modal opens with product info and closes via close button, outside click, or `Escape` key. | Not executed in a live browser session. | **NOT TESTED** | Implemented in `js/ui.js` and `js/app.js`. |
| **TC-09: Network Error State, Retry Button & Empty State** | Offline/HTTP errors show error message + Retry button; zero matches show empty state + Clear All Filters. | Not executed against live network failure in a browser. | **NOT TESTED** | Implemented in `showErrorState()`, `showEmptyState()`, and `retryBtn` handler. |
| **TC-10: Responsive Layout (Desktop, Tablet, Mobile)** | Layout adapts cleanly across desktop, tablet, and mobile viewports including mobile nav drawer. | Media queries and mobile nav logic are implemented, not rendered in headless browser. | **NOT TESTED** | Verify visually in browser DevTools responsive mode. |
