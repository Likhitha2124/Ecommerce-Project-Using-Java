/* ==================================================
   Thin wrapper around fetch() for talking to the
   Spring Boot backend at http://localhost:8080
================================================== */

const API_BASE = "http://localhost:8080/api/products";

const Api = {
    async getAll() {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
    },

    async getById(id) {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("Product not found");
        return res.json();
    },

    async search(keyword) {
        const res = await fetch(`${API_BASE}/search?keyword=${encodeURIComponent(keyword)}`);
        if (!res.ok) throw new Error("Search failed");
        return res.json();
    },

    async create(product) {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
        if (!res.ok) throw new Error((await safeJson(res))?.message || "Failed to create product");
        return res.json();
    },

    async update(id, product) {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
        if (!res.ok) throw new Error((await safeJson(res))?.message || "Failed to update product");
        return res.json();
    },

    async remove(id) {
        const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete product");
    }
};

async function safeJson(res) {
    try { return await res.json(); } catch { return null; }
}
