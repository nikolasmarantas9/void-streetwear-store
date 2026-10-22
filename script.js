const products = [
  {id:1,name:"VOID Graphic Pants 01",type:"PANTS",category:"clothing",price:64,image:"PANTS-1.jpg",tag:"NEW DROP",color:"#343a34"},
  {id:2,name:"VOID Graphic Pants 02",type:"PANTS",category:"clothing",price:68,image:"PANTS-2.jpg",tag:"",color:"#38303b"},
  {id:3,name:"VOID Graphic Pants 03",type:"PANTS",category:"clothing",price:62,image:"PANTS-3.jpg",tag:"",color:"#343a43"},
  {id:4,name:"VOID Graphic Pants 04",type:"PANTS",category:"clothing",price:66,image:"PANTS-4.jpg",tag:"LIMITED",color:"#37302c"},
  {id:5,name:"VOID Graphic Pants 05",type:"PANTS",category:"clothing",price:64,image:"PANTS-5.jpg",tag:"",color:"#303743"},
  {id:6,name:"VOID Graphic Tee 01",type:"T-SHIRT",category:"clothing",price:34,image:"T-SHIRT-1.jpg",tag:"BESTSELLER",color:"#343a34"},
  {id:7,name:"VOID Graphic Tee 02",type:"T-SHIRT",category:"clothing",price:36,image:"T-SHIRT-2.jpg",tag:"",color:"#38303b"},
  {id:8,name:"VOID Graphic Tee 03",type:"T-SHIRT",category:"clothing",price:38,image:"T-SHIRT-3.jpg",tag:"",color:"#343a43"},
  {id:9,name:"VOID Graphic Tee 04",type:"T-SHIRT",category:"clothing",price:35,image:"T-SHIRT-4.jpg",tag:"NEW DROP",color:"#37302c"},
  {id:10,name:"VOID Graphic Tee 05",type:"T-SHIRT",category:"clothing",price:34,image:"T-SHIRT-5.jpg",tag:"",color:"#303743"},
  {id:11,name:"VOID Sneaker 01",type:"SNEAKERS",category:"shoes",price:110,image:"SHOES-1.jpg",tag:"NEW DROP",color:"#303743"},
  {id:12,name:"VOID Sneaker 02",type:"SNEAKERS",category:"shoes",price:95,image:"SHOES-2.jpg",tag:"",color:"#393439"},
  {id:13,name:"VOID Sneaker 03",type:"SNEAKERS",category:"shoes",price:125,image:"SHOES-3.jpg",tag:"LIMITED",color:"#39332b"},
  {id:14,name:"VOID Sneaker 04",type:"SNEAKERS",category:"shoes",price:99,image:"SHOES-4.jpg",tag:"",color:"#2c3938"}
];

const STORAGE_KEYS = { cart: "void-store-cart-v1", favorites: "void-store-favorites-v1", reviews: "void-store-reviews-v1" };
function readStorage(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* Storage may be disabled in private or restricted browsing. */ }
}
let cart = readStorage(STORAGE_KEYS.cart, []);
let favorites = readStorage(STORAGE_KEYS.favorites, []);
let showFavoritesOnly = false;
let activeFilter = "all";
let view = "entrance";
let transitionBusy = false;

const $ = (s) => document.querySelector(s);
const productGrid = $("#productGrid");
const newDropShop = document.querySelector("#newDropShop");
if (newDropShop) newDropShop.addEventListener("click", () => {
  showCollection("all");
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth", block: "start" });
});
const scene = $("#storeScene");
const shop = $("#shop");
const enterBtn = $("#enterBtn");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const euro = (n) => new Intl.NumberFormat("el-GR", {style:"currency", currency:"EUR"}).format(n);

const timings = reduceMotion
  ? { cameraDelay: 0, camera: 0, shop: 0, reverseFade: 0, reverseCamera: 0, doorClose: 0, category: 0 }
  : { cameraDelay: 0, camera: 0, shop: 0, reverseFade: 0, reverseCamera: 0, doorClose: 350, category: 0 };

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function setBusy(busy) {
  transitionBusy = busy;
  document.body.classList.toggle("nav-busy", busy);
}

function setView(name) {
  view = name;
  document.body.dataset.view = name;
  document.body.classList.toggle("inside-store", name === "pick" || name === "collection");
  document.body.classList.toggle("collection-view", name === "collection");
  shop.classList.toggle("view-collection", name === "collection");
}

function updateCollectionCopy(filter) {
  if (filter === "shoes") {
    $("#collectionEyebrow").textContent = "02 / SNEAKERS";
    $("#collectionTitle").innerHTML = 'The shoe <span>wall.</span>';
    return;
  }
  if (filter === "clothing") {
    $("#collectionEyebrow").textContent = "01 / CLOTHING";
    $("#collectionTitle").innerHTML = 'The <span>wardrobe.</span>';
    return;
  }
  $("#collectionEyebrow").textContent = "THE FIRST DROP";
  $("#collectionTitle").innerHTML = 'Selected <span>pieces.</span>';
}

function renderProducts() {
 let list;

if (showFavoritesOnly) {
  // Show all saved products, regardless of category.
  list = products.filter((p) => favorites.includes(p.id));
} else {
  // Apply the selected category filter normally.
  list = activeFilter === "all"
    ? products
    : products.filter((p) => p.category === activeFilter);
}
  productGrid.innerHTML = list.map((p) => `<article class="product-card" data-product="${p.id}" tabindex="0" role="button" aria-label="View ${p.name}">
   <div class="product-art product-image-wrap" style="background:radial-gradient(ellipse at 50% 35%,${p.color},#171a20 72%)">
    ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
<button
  class="favorite-btn ${favorites.includes(p.id) ? "is-favorite" : ""}"
  data-favorite="${p.id}"
  aria-label="${favorites.includes(p.id) ? "Remove" : "Save"} ${p.name} ${favorites.includes(p.id) ? "from" : "to"} favorites"
  aria-pressed="${favorites.includes(p.id)}"
>${favorites.includes(p.id) ? "♥" : "♡"}</button>    <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">
   </div>
   <div class="product-info"><p class="product-type">${p.type}</p><p class="product-name">${p.name}</p><div class="product-bottom"><span class="price">${euro(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="View sizes for ${p.name}">+</button></div></div>
  </article>`).join("");
  if (!list.length) productGrid.innerHTML = `<p class="empty-cart product-empty">${showFavoritesOnly ? "No saved pieces yet. Tap the heart on a product to save it." : "No products found in this collection."}</p>`;
  const savedCount = document.querySelector("#favoritesCount");
  if (savedCount) savedCount.textContent = favorites.length;
  const favButton = document.querySelector("#favoritesToggle");
  if (favButton) { favButton.classList.toggle("active", showFavoritesOnly); favButton.setAttribute("aria-pressed", String(showFavoritesOnly)); }
}

function renderCart() {
  writeStorage(STORAGE_KEYS.cart, cart);
  const count = cart.reduce((n, item) => n + item.qty, 0);
  $("#cartCount").textContent = count;
  $("#subtotal").textContent = euro(cart.reduce((n, item) => n + item.qty * item.price, 0));
  if (!cart.length) {
    $("#cartItems").innerHTML = '<p class="empty-cart">Your bag is empty.<br>Find something that feels like you.</p>';
    return;
  }
  $("#cartItems").innerHTML = cart.map((item) => `<div class="cart-item"><div class="cart-thumb"><img src="${item.image}" alt="" loading="lazy"></div><div><div class="cart-item-name">${item.name}</div><div class="cart-item-price">${euro(item.price)} each · Size: ${item.size}</div><div class="qty-controls"><button data-qty="${item.cartKey}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${item.cartKey}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-btn" data-remove="${item.cartKey}">REMOVE</button></div>`).join("");
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

function addToCart(id, size) {
  const p = products.find((item) => item.id === id);
  if (!p || !size) return;
  const found = cart.find((item) => item.id === id && item.size === size);
  if (found) found.qty++;
  else cart.push({...p, size, cartKey: `${id}-${size}`, qty: 1});
  renderCart();
  closeProductModal();
  toast(`${p.name} · ${size} added to your bag`);
}

function openCart() {
  document.body.classList.add("cart-open");
}

function closeCart() {
  document.body.classList.remove("cart-open");
}

async function enterStore() {
  if (transitionBusy || view !== "entrance") return;
  setBusy(true);
  enterBtn.disabled = true;

  // Open the doors, then go straight to PICK A SIDE (no camera zoom).
  scene.classList.add("is-animating");
  scene.classList.remove("closing", "camera-entering", "entering-done", "text-rush");
  scene.classList.add("open", "text-rush");
  document.body.dataset.view = "entering";
  // Only the white ENTER THE VOID lettering rushes toward the viewer and fades out.
  await delay(1050);

  setView("pick");
  window.scrollTo({top: 0, behavior: "instant"});
  enterBtn.disabled = false;
  scene.classList.remove("is-animating");
  setBusy(false);
  toast("Welcome inside. Pick a side.");
}


async function backToEntrance() {
  if (transitionBusy || (view !== "pick" && view !== "collection")) return;

  setBusy(true);
  closeCart();

  shop.classList.remove("leaving-collection");
  scene.classList.add("is-animating", "open");
  scene.classList.remove("entering-done", "text-rush", "text-return");

  document.body.dataset.view = "leaving";
  document.body.classList.remove("inside-store", "collection-view");

  window.scrollTo({ top: 0, behavior: "instant" });

  // Start the reverse animation for the white title.
  scene.classList.add("text-return");
  await delay(1050);

  // Remove the reverse animation and restore the entrance screen.
  scene.classList.remove(
    "text-return",
    "closing",
    "is-animating",
    "text-rush",
    "entering-done",
    "camera-entering"
  );

  scene.classList.remove("open");
  shop.classList.remove("view-collection");

  setView("entrance");
  setBusy(false);
}


async function showCollection(category) {
  if (transitionBusy || view !== "pick") return;
  setBusy(true);
  activeFilter = category;
  document.querySelectorAll(".filter").forEach((f) => f.classList.toggle("active", f.dataset.filter === activeFilter));
  updateCollectionCopy(activeFilter);
  renderProducts();
  setView("collection");
  window.scrollTo({top: 0, behavior: "instant"});
  await delay(timings.category);
  setBusy(false);
}

async function backToSides() {
  if (transitionBusy || view !== "collection") return;
  setBusy(true);
  shop.classList.add("leaving-collection");
  await delay(timings.category);
  shop.classList.remove("leaving-collection");
  setView("pick");
  window.scrollTo({top: 0, behavior: "instant"});
  setBusy(false);
}

enterBtn.addEventListener("click", enterStore);
$("#backToEntrance").addEventListener("click", backToEntrance);
$("#homeLogo").addEventListener("click", (event) => {
  event.preventDefault();

  if (view === "entrance" || transitionBusy) return;

  backToEntrance();
});
$("#backToSides").addEventListener("click", backToSides);
document.querySelectorAll(".department").forEach((btn) => {
  btn.addEventListener("click", () => showCollection(btn.dataset.category));
});
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach((f) => f.classList.toggle("active", f === btn));
    updateCollectionCopy(activeFilter);
    renderProducts();
  });
});
const productModal = document.querySelector("#productModal");
const productModalBackdrop = document.querySelector("#productModalBackdrop");
let selectedProductId = null;
function openProductModal(id) {
  const p = products.find((item) => item.id === Number(id));
  if (!p) return;
  selectedProductId = p.id;
  document.querySelector("#modalProductImage").src = p.image;
  document.querySelector("#modalProductImage").alt = p.name;
  document.querySelector("#modalProductType").textContent = `VOID / ${p.type} · DROP 001`;
  document.querySelector("#modalProductName").textContent = p.name;
  document.querySelector("#modalProductPrice").textContent = euro(p.price);
  const select = document.querySelector("#modalProductSize");
  const label = document.querySelector("#modalSizeLabel");
  const sizes = p.category === "shoes"
    ? Array.from({length: 12}, (_, i) => String(39 + i))
    : ["S", "M", "L", "XL", "2XL"];
  label.textContent = p.category === "shoes" ? "SELECT SHOE SIZE (EU)" : "SELECT CLOTHING SIZE";
  select.innerHTML = '<option value="" selected disabled>Choose a size</option>' + sizes.map((size) => `<option value="${size}">${size}</option>`).join("");
  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("product-modal-open");
  document.querySelector("#productModalClose").focus();
}
function closeProductModal() {
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("product-modal-open");
  selectedProductId = null;
}
document.querySelector("#productModalClose").addEventListener("click", closeProductModal);
productModalBackdrop.addEventListener("click", closeProductModal);
document.querySelector("#modalAddToCart").addEventListener("click", () => {
  const size = document.querySelector("#modalProductSize").value;
  if (!size) { toast("Please choose a size first."); document.querySelector("#modalProductSize").focus(); return; }
  addToCart(selectedProductId, size);
});
productGrid.addEventListener("click", (e) => {
  const favoriteButton = e.target.closest("[data-favorite]");
  if (favoriteButton) {
    e.preventDefault(); e.stopPropagation();
    const id = Number(favoriteButton.dataset.favorite);
    favorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    writeStorage(STORAGE_KEYS.favorites, favorites);
    renderProducts();
    toast(favorites.includes(id) ? "Saved to favorites." : "Removed from favorites.");
    return;
  }
  const card = e.target.closest("[data-product]");
  if (card) openProductModal(card.dataset.product);
});
productGrid.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-product]")) {
    e.preventDefault(); openProductModal(e.target.dataset.product);
  }
});
$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#cartBackdrop").addEventListener("click", closeCart);
$("#cartItems").addEventListener("click", (e) => {
  const qty = e.target.closest("[data-qty]");
  const rem = e.target.closest("[data-remove]");
  if (qty) {
    const item = cart.find((i) => i.cartKey === qty.dataset.qty);
    if (item) {
      item.qty += Number(qty.dataset.delta);
      if (item.qty <= 0) cart = cart.filter((i) => i.cartKey !== item.cartKey);
    }
    renderCart();
  }
  if (rem) {
    cart = cart.filter((i) => i.cartKey !== rem.dataset.remove);
    renderCart();
    toast("Item removed from your bag.");
  }
});
$("#checkoutBtn").addEventListener("click", () => {
  toast(cart.length ? "Checkout is a demo — no payment is processed." : "Your bag is empty.");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeCart(); closeInfo(); closeProductModal(); }
});

renderProducts();
renderCart();


// Store information panel
const infoDrawer = document.querySelector("#infoDrawer");
function openInfo() { document.body.classList.add("info-open"); }
function closeInfo() { document.body.classList.remove("info-open"); }
document.querySelector("#infoOpen").addEventListener("click", openInfo);
document.querySelector("#infoClose").addEventListener("click", closeInfo);
document.querySelector("#infoBackdrop").addEventListener("click", closeInfo);

// Demo reviews persist in this browser only; there is no server-side review database.
function renderSavedReviews() {
  const reviewList = document.querySelector("#reviewList");
  const reviews = readStorage(STORAGE_KEYS.reviews, []);
  if (!reviews.length) return;
  const empty = reviewList.querySelector(".reviews-empty");
  if (empty) empty.remove();
  reviews.slice().reverse().forEach((review) => {
    const card = document.createElement("article"); card.className = "review-card";
    const stars = document.createElement("div"); stars.className = "review-stars"; stars.textContent = "★".repeat(review.rating) + "☆".repeat(5-review.rating);
    const content = document.createElement("p"); content.textContent = review.text;
    const author = document.createElement("span"); author.textContent = review.name.toUpperCase() + " · COMMUNITY REVIEW";
    card.append(stars, content, author); reviewList.prepend(card);
  });
}
document.querySelector("#reviewForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#reviewName").value.trim();
  const rating = Number(document.querySelector("#reviewRating").value);
  const review = document.querySelector("#reviewText").value.trim();
  if (!name || !review) return;
  const card = document.createElement("article");
  card.className = "review-card";
  const stars = document.createElement("div"); stars.className = "review-stars"; stars.textContent = "★".repeat(rating) + "☆".repeat(5-rating);
  const content = document.createElement("p"); content.textContent = review;
  const author = document.createElement("span"); author.textContent = name.toUpperCase() + " · JUST NOW";
  card.append(stars, content, author);
  const reviewList = document.querySelector("#reviewList");
  const emptyMessage = reviewList.querySelector(".reviews-empty");
  if (emptyMessage) emptyMessage.remove();
  reviewList.prepend(card);
  const savedReviews = readStorage(STORAGE_KEYS.reviews, []);
  savedReviews.push({ name, rating, text: review });
  writeStorage(STORAGE_KEYS.reviews, savedReviews);
  event.target.reset();
  toast("Thanks for your review.");
});
renderSavedReviews();

const favoritesToggle = document.querySelector("#favoritesToggle");
if (favoritesToggle) favoritesToggle.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  renderProducts();
  if (showFavoritesOnly) toast("Showing your saved pieces.");
});
