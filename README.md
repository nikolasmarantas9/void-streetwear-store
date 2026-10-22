# VOID — Streetwear Store

A front-end streetwear store demo built with HTML, CSS and vanilla JavaScript.

## Features
- Cinematic entrance animation and Clothing / Sneakers collections.
- Product detail modal with clothing sizes S, M, L, XL, 2XL and EU shoe sizes 39–50.
- Shopping bag with product thumbnails, size, quantity controls, remove action and subtotal.
- Cart persists in this browser using `localStorage` after refresh/reopen.
- Saved products / favorites persist in this browser and can be filtered with **SAVED ♥**.
- Demo customer reviews persist in this browser after refresh.
- Responsive layout and visual styling for desktop and mobile.

## Run locally
Open `index.html` in a modern browser. For the best development workflow, open this folder in VS Code and use the Live Server extension.

## Publish on GitHub Pages
Upload the contents of `VOID_Streetwear_Store_Fixed` to the root of your repository (make sure `index.html`, `style.css`, `script.js`, `clothes/`, `SNEAKERS/`, and `Thunderbolts-void-sentry.webp` are at the repository root). In GitHub, open **Settings → Pages**, choose your deployment branch and `/ (root)` folder, then save.

## Important notes
- This is a portfolio/demo project. Checkout does not process payments and there is no backend, inventory system, customer account, or server-side review database.
- Cart, favorites and demo reviews are saved only in the visitor's current browser via `localStorage`; they do not sync between devices or browsers.
- Images are bundled in the project folders, so keep their folder names and relative paths unchanged.
