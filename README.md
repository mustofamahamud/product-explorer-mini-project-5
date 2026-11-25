# Product Explorer

## 1. Project Title
**Product Explorer** — Interactive API-Driven Product Discovery Web Application

## 2. Project Overview
Product Explorer is a frontend-focused web application built with HTML5, CSS3, Vanilla JavaScript (ES6+), the Fetch API, and Browser Local Storage. It retrieves live product and category data from the public **DummyJSON** REST API (`https://dummyjson.com/products`) and lets users search, filter by category, sort by price, inspect product details in a modal dialog, and save or remove favourite products persistently in their browser.

## 3. Problem Statement
When learning frontend web development, students often build static pages with hardcoded data that resets on page refresh and lacks realistic error or loading states. A practical product discovery interface requires asynchronous data fetching, dynamic DOM updates without page reloads, clean client-side filtering/sorting, graceful error/empty states, and persistent user preferences using browser storage.

## 4. Project Objectives
- Dynamically render product listings and categories from an external JSON API using `fetch()` and `async/await`.
- Manipulate and update the DOM cleanly without page reloads using modern JavaScript (`querySelector`, `querySelectorAll`, `createElement`, `appendChild`, and event listeners).
- Apply array operations (`map()`, `filter()`, `forEach()`, `find()`) for real search, filtering, sorting, and lookup tasks.
- Persist user-selected favourite products across browser reloads using `localStorage`, `JSON.stringify()`, and `JSON.parse()` while safely handling missing or corrupted data.
- Deliver a responsive, accessible, and easy-to-maintain codebase structured across modular ES6 files.

## 5. Main Features
1. **Professional Homepage & Hero Summary**: Displays live visible product counts and saved favourite counts.
2. **Responsive Navigation Bar & Mobile Menu**: Switch between **Explore Products** and **Favourites** views, with a collapsible menu on smaller screens.
3. **Dynamic Product Listing**: Renders product cards with thumbnail/fallback image, formatted category label, title, price, and star rating.
4. **Live Product Search**: Filters products dynamically by title, brand, or category as the user types, plus a Clear button.
5. **Dynamic Category Filter**: Populates categories from DummyJSON and filters products with caching to avoid redundant network requests.
6. **Price Sorting**: Sorts displayed products by **Price: Low to High** or **Price: High to Low**.
7. **Favourite / Unfavourite System**: Save or remove products with duplicate prevention and persistent Local Storage.
8. **Dedicated Favourites View**: View and manage saved favourite products separately from the main catalog.
9. **Product Details Modal**: Inspect full product description, brand, stock status, rating, price, and favourite toggle; close via close button, backdrop click, or `Escape` key.
10. **Loading, Error & Empty States**: Shows a loading spinner during requests, user-friendly error messages with a **Retry Request** button, and helpful empty-state guidance with **Clear All Filters**.

## 6. Technology Stack
- **HTML5**: Semantic page structure and accessible modal/navigation markup.
- **CSS3**: CSS custom properties, Flexbox/CSS Grid layouts, responsive media queries, and clean minimalist styling.
- **Vanilla JavaScript (ES6+)**: Native ES modules (`type="module"`), `async/await`, `Map`/`Set`, and array helpers.
- **Fetch API**: Asynchronous HTTP GET requests to DummyJSON.
- **Browser Local Storage**: Client-side persistence for favourite products.

## 7. API Endpoints
All requests target `https://dummyjson.com`:
- `GET https://dummyjson.com/products?limit=100` — Retrieves the product catalog.
- `GET https://dummyjson.com/products/categories` — Retrieves available product categories.
- `GET https://dummyjson.com/products/category/{category}` — Retrieves products for a chosen category (cached in memory).
- `GET https://dummyjson.com/products/{id}` — Retrieves detailed information for a selected product.

## 8. Project Folder Structure
```text
product-explorer/
├── index.html
├── README.md
├── ACADEMIC-REQUIREMENTS.md
├── TEST-REPORT.md
├── .gitignore
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── api.js
│   ├── ui.js
│   └── storage.js
└── assets/
    └── images/
        └── no-image.svg
```

## 9. Installation Instructions
1. Download and extract `Product-Explorer-Mini-Project.zip` to a folder on your computer.
2. Open the `product-explorer` folder in **Visual Studio Code**.
3. No `npm install`, backend server, database, or API key is required.

## 10. VS Code Live Server Instructions
Because the project uses ES6 modules (`<script type="module" src="js/app.js"></script>`), run it through a local HTTP server rather than opening `index.html` via `file://`:
1. In VS Code, open the **Extensions** view (`Ctrl+Shift+X` on Windows/Linux or `Cmd+Shift+X` on macOS).
2. Search for **Live Server** (by Ritwick Dey) and click **Install**.
3. Open `index.html` in the editor.
4. Right-click inside `index.html` and select **Open with Live Server** (or click **Go Live** in the bottom status bar).
5. Your browser will open at a local address such as `http://127.0.0.1:5500/index.html`.

## 11. Application Usage Instructions
- **Browse & Search**: Type a keyword into the search box to filter products immediately; click **Clear** to reset the search text.
- **Filter & Sort**: Choose a category from **Category** or pick a sort option from **Sort by Price**. Click **Clear All Filters** to restore default settings.
- **Inspect Details**: Click a product's image, title, or **Details** button to open the Product Details Modal. Close it using the `×` button, **Close** button, clicking outside the modal card, or pressing `Esc`.
- **Manage Favourites**: Click **Save** / **Saved** on a card or inside the modal to add or remove favourites. Click **Favourites** in the navigation bar to view saved items.

## 12. Local Storage Explanation
- Favourites are stored under the key `"product_explorer_favourites_v1"` using `localStorage.setItem()` and `JSON.stringify()`.
- On startup, `getFavourites()` reads data via `localStorage.getItem()` and parses it with `JSON.parse()`.
- Duplicate entries are prevented by checking product IDs before saving.
- If Local Storage is empty, contains non-array JSON, or has corrupted/invalid JSON text, `getFavourites()` catches the error, cleans up invalid data with `localStorage.removeItem()` where appropriate, and safely returns an empty array `[]`.

## 13. Error Handling Explanation
- **Network / Offline / HTTP Errors**: `requestJson()` in `js/api.js` checks `response.ok` and validates parsed JSON structure; `app.js` detects offline status or caught errors and displays the error state with a **Retry Request** button.
- **Empty Results**: When no products match active filters or no favourites are saved yet, a dedicated empty state is displayed with guidance and a filter reset option.
- **Missing or Broken Images**: `getProductImageUrl()` and card/modal `error` listeners fall back to `assets/images/no-image.svg`.
- **Safe Text Rendering**: Untrusted API strings are inserted using `textContent` rather than raw HTML injection.

## 14. Academic Requirement Mapping
See [ACADEMIC-REQUIREMENTS.md](ACADEMIC-REQUIREMENTS.md) for the complete requirement-by-requirement traceability table covering MP3 (DOM Manipulation — 4 Marks; Event Handling — 3 Marks) and MP4 (API Integration — 4 Marks; Local Storage — 3 Marks).

## 15. Testing Report
See [TEST-REPORT.md](TEST-REPORT.md) for full details of automated/static verification, unit-level storage checks, and tests that require a live browser or network connection.

## 16. Screenshot Placeholders with Instructions
Replace each placeholder below with your own captured screenshots when preparing your lab/viva submission:
- `[Screenshot Placeholder 1: Homepage & Product Grid — Desktop View]` — Capture the full catalog grid with header, search/filter bar, and visible counts.
- `[Screenshot Placeholder 2: Category Filter, Search & Price Sorting]` — Capture filtered results with active filter summary text.
- `[Screenshot Placeholder 3: Product Details Modal]` — Capture an open modal showing product image, price, rating, stock, description, and favourite button.
- `[Screenshot Placeholder 4: Favourites View & Mobile Responsive View]` — Capture saved favourites in the Favourites view and the mobile layout.

## 17. GitHub Upload Instructions
1. Create a new repository on GitHub (for example, `product-explorer`).
2. Open a terminal inside the `product-explorer` folder and initialize Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Product Explorer mini project"
   git branch -M main
   git remote add origin https://github.com/<your-username>/product-explorer.git
   git push -u origin main
   ```

## 18. Student Information Placeholders
- **Student Name:** `[Enter Your Full Name]`
- **Student ID:** `[Enter Your Student ID]`
- **Section:** `[Enter Your Section]`
- **University:** International Islamic University Chittagong (IIUC)
- **Department:** Computer Science and Engineering (CSE)
- **Course:** Software Development I (CSE-2340)
- **Assessment:** Mini Project 3-4 (MP3-MP4)
