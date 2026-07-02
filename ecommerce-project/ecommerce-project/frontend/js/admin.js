/* ==================================================
   Admin dashboard: Create, Read, Update, Delete
   against the Spring Boot REST API
================================================== */

const form = document.getElementById("productForm");
const tableBody = document.getElementById("productTableBody");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");

const fields = ["name", "category", "price", "stockQuantity", "imageUrl", "description"];

let editingId = null;

init();

async function init() {
    await refreshTable();
    form.addEventListener("submit", onSubmit);
    document.getElementById("cancelEditBtn").addEventListener("click", exitEditMode);
}

// ---------- READ ----------
async function refreshTable() {
    try {
        const products = await Api.getAll();
        renderTable(products);
    } catch (err) {
        tableBody.innerHTML = "";
        emptyState.style.display = "block";
        emptyState.textContent = "Could not reach the backend at localhost:8080. Is Spring Boot running?";
    }
}

function renderTable(products) {
    if (products.length === 0) {
        tableBody.innerHTML = "";
        emptyState.style.display = "block";
        emptyState.textContent = "No products yet — add one above.";
        return;
    }
    emptyState.style.display = "none";

    tableBody.innerHTML = products.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.category || "—"}</td>
            <td>$${Number(p.price).toFixed(2)}</td>
            <td>${p.stockQuantity}</td>
            <td class="actions">
                <button class="btn btn-outline" onclick="startEdit(${p.id})">Edit</button>
                <button class="btn btn-danger" onclick="onDelete(${p.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

// ---------- CREATE / UPDATE ----------
async function onSubmit(e) {
    e.preventDefault();

    const payload = {
        name: document.getElementById("name").value.trim(),
        category: document.getElementById("category").value.trim(),
        price: parseFloat(document.getElementById("price").value),
        stockQuantity: parseInt(document.getElementById("stockQuantity").value, 10),
        imageUrl: document.getElementById("imageUrl").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    try {
        if (editingId) {
            await Api.update(editingId, payload);
            showToast("Product updated");
        } else {
            await Api.create(payload);
            showToast("Product created");
        }
        exitEditMode();
        await refreshTable();
    } catch (err) {
        showToast(err.message);
    }
}

function startEdit(id) {
    Api.getById(id).then(p => {
        editingId = id;
        document.getElementById("productId").value = p.id;
        document.getElementById("name").value = p.name || "";
        document.getElementById("category").value = p.category || "";
        document.getElementById("price").value = p.price;
        document.getElementById("stockQuantity").value = p.stockQuantity;
        document.getElementById("imageUrl").value = p.imageUrl || "";
        document.getElementById("description").value = p.description || "";

        document.getElementById("formTitle").textContent = `Edit “${p.name}”`;
        document.getElementById("submitBtn").textContent = "Save changes";
        document.getElementById("cancelEditBtn").style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function exitEditMode() {
    editingId = null;
    form.reset();
    document.getElementById("formTitle").textContent = "Add a product";
    document.getElementById("submitBtn").textContent = "Create product";
    document.getElementById("cancelEditBtn").style.display = "none";
}

// ---------- DELETE ----------
async function onDelete(id) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
        await Api.remove(id);
        showToast("Product deleted");
        await refreshTable();
    } catch (err) {
        showToast(err.message);
    }
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}
