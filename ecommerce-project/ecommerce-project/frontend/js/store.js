/* ==================================================
   Storefront: renders products from the backend and
   runs a simple client-side cart (kept in localStorage)
================================================== */

let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart") || "{}"); // { productId: qty }

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const toast = document.getElementById("toast");

init();

async function init() {
    await loadProducts();
    bindCartUI();
    searchInput.addEventListener("input", debounce(applyFilters, 250));
    categoryFilter.addEventListener("change", applyFilters);
}

async function loadProducts() {
    try {
        allProducts = await Api.getAll();
        populateCategoryFilter();
        renderGrid(allProducts);
    } catch (err) {
        grid.innerHTML = `<div class="empty-state">
            Could not reach the backend at <code>localhost:8080</code>.<br>
            Make sure the Spring Boot app is running.
        </div>`;
    }
}

function populateCategoryFilter() {
    const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
    categoryFilter.innerHTML = `<option value="">All categories</option>` +
        categories.map(c => `<option value="${c}">${c}</option>`).join("");
}

function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    let filtered = allProducts.filter(p =>
        (!keyword || p.name.toLowerCase().includes(keyword)) &&
        (!category || p.category === category)
    );
    renderGrid(filtered);
}

function renderGrid(products) {
    if (products.length === 0) {
        grid.innerHTML = `<div class="empty-state">No products match. Try a different search.</div>`;
        return;
    }

    grid.innerHTML = products.map(p => `
        <div class="card">
            ${p.category ? `<span class="tag">${p.category}</span>` : ""}
            <img src="${p.imageUrl || 'https://placehold.co/400x300?text=No+Image'}" alt="${p.name}">
            <div class="body">
                <h3>${p.name}</h3>
                <p class="desc">${p.description || ""}</p>
                <div class="price-row">
                    <span class="price">$${Number(p.price).toFixed(2)}</span>
                    <span class="stock ${p.stockQuantity <= 5 ? 'low' : ''}">
                        ${p.stockQuantity > 0 ? p.stockQuantity + ' in stock' : 'Out of stock'}
                    </span>
                </div>
                <button class="btn btn-primary" ${p.stockQuantity <= 0 ? 'disabled' : ''}
                        onclick="addToCart(${p.id})">
                    ${p.stockQuantity <= 0 ? 'Sold out' : 'Add to basket'}
                </button>
            </div>
        </div>
    `).join("");
}

/* ---------------- Cart ---------------- */

function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    persistCart();
    showToast("Added to basket");
}

function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    persistCart();
}

function persistCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const items = Object.entries(cart);
    document.getElementById("cartCount").textContent =
        items.reduce((sum, [, qty]) => sum + qty, 0);

    const cartItemsEl = document.getElementById("cartItems");
    if (items.length === 0) {
        cartItemsEl.innerHTML = `<div class="empty-state">Your basket is empty.</div>`;
        document.getElementById("cartTotal").textContent = "$0.00";
        return;
    }

    let total = 0;
    cartItemsEl.innerHTML = items.map(([id, qty]) => {
        const product = allProducts.find(p => p.id == id);
        if (!product) return "";
        const lineTotal = product.price * qty;
        total += lineTotal;
        return `
            <div class="cart-line">
                <div>
                    ${product.name}<br>
                    <div class="qty-controls">
                        <button onclick="changeQty(${id}, -1)">-</button>
                        ${qty}
                        <button onclick="changeQty(${id}, 1)">+</button>
                    </div>
                </div>
                <div>$${lineTotal.toFixed(2)}</div>
            </div>
        `;
    }).join("");

    document.getElementById("cartTotal").textContent = `$${total.toFixed(2)}`;
}

function bindCartUI() {
    const overlay = document.getElementById("cartOverlay");
    const drawer = document.getElementById("cartDrawer");

    document.getElementById("cartToggle").onclick = () => {
        overlay.classList.add("open");
        drawer.classList.add("open");
        renderCart();
    };
    document.getElementById("closeCart").onclick = closeCart;
    overlay.onclick = closeCart;

    document.getElementById("checkoutBtn").onclick = () => {
        if (Object.keys(cart).length === 0) return;
        showToast("Order placed! (demo only — no payment processed)");
        cart = {};
        persistCart();
        closeCart();
    };

    function closeCart() {
        overlay.classList.remove("open");
        drawer.classList.remove("open");
    }

    renderCart();
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}

function debounce(fn, delay) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}
