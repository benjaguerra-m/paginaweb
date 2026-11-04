
// CORE JS FOR ALL PAGES - SYNTAX ERROR FIXED WITH BACKTICKS
const ADMIN_PASSWORD = 'hwPVc0z3942mf8Nf31sf48NAJ3zm1DAef49ZCVMna83';

const initialProducts = [
    { id: 'prod-1', name: 'Agenda Perpetua Floral Chiloé', category: 'agendas', price: 18990, badge: 'Más Vendido 🌸', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', description: 'Agenda sin fecha. Tapa dura termolaminada mate.' },
    { id: 'prod-2', name: 'Calendario de Mesa Ilustrado 2026', category: 'calendarios', price: 12500, badge: 'Nuevo ✨', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80', description: 'Calendario de base rígida para escritorio con frases inspiradoras.' },
    { id: 'prod-3', name: 'Álbum de Fotos & Memorias Tela', category: 'papeleria', price: 22000, badge: 'Hecho a Mano 💕', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', description: 'Encuadernación artesanal empastada en tela lino rosa.' }
];

let products = [];
let cart = [];
let activeCategoryFilter = 'todos';

// FIXED ADMIN TRIGGER VARIABLES
let heartClickCount = 0;
let heartClickTimer = null;

function loadData() {
    const savedProds = localStorage.getItem('papelia_products_db');
    if (savedProds) {
        try { products = JSON.parse(savedProds); } catch(e) { products = [...initialProducts]; }
    } else {
        products = [...initialProducts];
        localStorage.setItem('papelia_products_db', JSON.stringify(products));
    }
}

function saveProductsToStorage() {
    localStorage.setItem('papelia_products_db', JSON.stringify(products));
}

// ==== UI RENDERERS ====
function renderProducts(items = null) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    let list = items || (activeCategoryFilter === 'todos' ? products : products.filter(p => p.category === activeCategoryFilter));
    
    grid.innerHTML = list.map(product => `
        <div class="bg-white rounded-3xl p-5 border border-blush-soft/60 shadow-sm flex flex-col justify-between">
            <div class="relative overflow-hidden rounded-2xl mb-4 h-56 bg-cream">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                <span class="absolute top-3 left-3 bg-blush-light text-blush-dark font-bold text-xs px-3 py-1 rounded-full border border-blush-soft">${product.badge}</span>
            </div>
            <h3 class="font-serif font-bold text-xl text-charcoal mb-2">${product.name}</h3>
            <p class="text-xs text-charcoal/70 mb-4 line-clamp-2">${product.description}</p>
            <div class="flex justify-between items-center mt-2 border-t border-cream pt-3">
                <span class="font-bold text-sage text-lg">$${product.price.toLocaleString('es-CL')}</span>
                <button onclick="addToCart('${product.id}')" class="bg-blush hover:bg-blush-dark text-white text-xs font-bold px-4 py-2 rounded-full">+ Añadir</button>
            </div>
        </div>
`).join('');
}

function renderFeaturedProducts() {
    const grid = document.getElementById('featuredProductsGrid');
    if (!grid) return; // Only runs on index.html
    const featured = products.slice(0, 3);
    grid.innerHTML = featured.map(product => `
        <div class="bg-white rounded-3xl p-5 border border-blush-soft/60 shadow-sm flex flex-col justify-between">
            <div class="relative overflow-hidden rounded-2xl mb-4 h-56 bg-cream">
                <img src="${product.image}" class="w-full h-full object-cover">
                <span class="absolute top-3 left-3 bg-blush-light text-blush-dark font-bold text-xs px-3 py-1 rounded-full border border-blush-soft">${product.badge}</span>
            </div>
            <h3 class="font-serif font-bold text-xl text-charcoal mb-2">${product.name}</h3>
            <div class="flex justify-between items-center mt-2 border-t border-cream pt-3">
                <span class="font-bold text-sage text-lg">$${product.price.toLocaleString('es-CL')}</span>
                <button onclick="addToCart('${product.id}')" class="bg-blush hover:bg-blush-dark text-white text-xs font-bold px-4 py-2 rounded-full">+ Añadir</button>
            </div>
        </div>
    `).join('');
}

// ==== CART LOGIC ====
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const exist = cart.find(i => i.id === id);
    if(exist) exist.quantity++;
    else cart.push({...product, quantity: 1});
    updateCartUI();
    showToast(`¡${product.name} añadido!`);
}

function updateCartUI() {
    document.getElementById('cartCountBadge').innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    const list = document.getElementById('cartItemsList');
    if (!list) return;
    let total = 0;
    list.innerHTML = cart.map((item, i) => {
        total += item.price * item.quantity;
        return `
        <div class="flex gap-3 bg-white p-3 rounded-2xl border border-blush-soft">
            <img src="${item.image}" class="w-12 h-12 rounded-xl object-cover">
            <div class="flex-grow"><h4 class="font-bold text-sm text-charcoal">${item.name}</h4><span class="text-xs text-charcoal">$${item.price.toLocaleString()} x ${item.quantity}</span></div>
            <button onclick="cart.splice(${i},1); updateCartUI();" class="text-rose-400 text-xs"><i class="fa-solid fa-trash"></i></button>
        </div>`;
    }).join('');
    document.getElementById('cartTotal').innerText = `$${total.toLocaleString('es-CL')}`;
}

function openCart() {
    document.getElementById('cartDrawer').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('cartBackdrop').classList.remove('opacity-0');
        document.getElementById('cartPanel').classList.remove('translate-x-full');
    }, 10);
}

function closeCart() {
    document.getElementById('cartBackdrop').classList.add('opacity-0');
    document.getElementById('cartPanel').classList.add('translate-x-full');
    setTimeout(() => { document.getElementById('cartDrawer').classList.add('hidden'); }, 300);
}

function sendOrderWhatsApp() {
    if(cart.length === 0) return showToast("Carrito vacío");
    let msg = `¡Hola Papelia Papelería! 💕 Quisiera encargar:

`; // FIXED SYNTAX ERROR: Multiline strings need backticks
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        msg += `- ${item.name} (x${item.quantity}) = $${(item.price * item.quantity).toLocaleString()}
`;
    });
    msg += `
*TOTAL:* $${total.toLocaleString()}
Quedo atento/a. ✨`;
    window.open(`https://wa.me/56936105596?text=${encodeURIComponent(msg)}`);
}

// ==== SECRETO ADMIN FIX (HEART & KEYBOARD) ====
window.handleSecretClick = function(e) {
    e.preventDefault();
    heartClickCount++;
    clearTimeout(heartClickTimer);
    if (heartClickCount >= 5) {
        heartClickCount = 0;
        openSecretPasswordModal();
    } else {
        heartClickTimer = setTimeout(() => { heartClickCount = 0; }, 1200);
    }
};

document.addEventListener('keydown', (e) => {
    // Teclas: Ctrl + Shift + Y
    if (e.ctrlKey && e.shiftKey && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        openSecretPasswordModal();
    }
});

function openSecretPasswordModal() {
    document.getElementById('secretPass1').value = '';
    document.getElementById('secretPasswordModal').classList.remove('hidden');
}

function closeSecretPasswordModal() { document.getElementById('secretPasswordModal').classList.add('hidden'); }

document.getElementById('secretPassForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if(document.getElementById('secretPass1').value === ADMIN_PASSWORD) {
        closeSecretPasswordModal();
        document.getElementById('adminModal').classList.remove('hidden');
        renderAdminTable();
        showToast('¡Modo Admin Activado! ⚙️');
    } else {
        showToast('Contraseña incorrecta ❌');
    }
});

function closeAdminModal() { document.getElementById('adminModal').classList.add('hidden'); }

// ==== ADMIN PANEL ACTIONS ====
function switchAdminTab(tab) {
    document.getElementById('adminTabList').classList.add('hidden');
    document.getElementById('adminTabAdd').classList.add('hidden');
    if (tab === 'list') {
        document.getElementById('adminTabList').classList.remove('hidden');
        renderAdminTable();
    } else {
        document.getElementById('adminTabAdd').classList.remove('hidden');
    }
}

function renderAdminTable() {
    document.getElementById('adminProductCount').innerText = products.length;
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = products.map(product => `
        <tr class="border-t border-cream-dark">
            <td class="p-3"><img src="${product.image}" class="w-10 h-10 rounded-lg object-cover"></td>
            <td class="p-3 font-bold">${product.name}</td>
            <td class="p-3">$${product.price.toLocaleString()}</td>
            <td class="p-3 text-center">
                <button onclick="openEditModal('${product.id}')" class="text-sage mx-1"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteProduct('${product.id}')" class="text-rose-500 mx-1"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function handleCreateProduct(e) {
    e.preventDefault();
    const newProduct = {
        id: 'prod-' + Date.now(),
        name: document.getElementById('newProdName').value,
        price: parseInt(document.getElementById('newProdPrice').value),
        category: document.getElementById('newProdCategory').value,
        badge: document.getElementById('newProdBadge').value,
        image: document.getElementById('newProdUrlInput').value || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        description: document.getElementById('newProdDescription').value
    };
    products.unshift(newProduct);
    saveProductsToStorage();
    e.target.reset();
    switchAdminTab('list');
    refreshAllViews();
    showToast('Producto añadido ✨');
}

function deleteProduct(id) {
    if(confirm('¿Eliminar producto?')) {
        products = products.filter(p => p.id !== id);
        saveProductsToStorage();
        renderAdminTable();
        refreshAllViews();
        showToast('Eliminado 🗑️');
    }
}

function openEditModal(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;
    document.getElementById('editProdId').value = p.id;
    document.getElementById('editProdName').value = p.name;
    document.getElementById('editProdPrice').value = p.price;
    document.getElementById('editProdBadge').value = p.badge;
    document.getElementById('editProdImage').value = p.image;
    document.getElementById('editProdDescription').value = p.description;
    document.getElementById('editProductModal').classList.remove('hidden');
}

function closeEditModal() { document.getElementById('editProductModal').classList.add('hidden'); }

function handleSaveEditedProduct(e) {
    e.preventDefault();
    const id = document.getElementById('editProdId').value;
    const p = products.find(x => x.id === id);
    if(p) {
        p.name = document.getElementById('editProdName').value;
        p.price = parseInt(document.getElementById('editProdPrice').value);
        p.badge = document.getElementById('editProdBadge').value;
        p.image = document.getElementById('editProdImage').value;
        p.description = document.getElementById('editProdDescription').value;
        saveProductsToStorage();
        closeEditModal();
        renderAdminTable();
        refreshAllViews();
        showToast('Actualizado 💕');
    }
}

function resetToOriginalCatalog() {
    if(confirm('¿Volver a los productos por defecto?')) {
        products = [...initialProducts];
        saveProductsToStorage();
        renderAdminTable();
        refreshAllViews();
        showToast('Restablecido ✨');
    }
}

function refreshAllViews() {
    renderProducts();
    renderFeaturedProducts();
}

function showToast(msg) {
    document.getElementById('toastMessage').innerText = msg;
    const t = document.getElementById('toast');
    t.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => t.classList.add('translate-y-20', 'opacity-0'), 2500);
}

function handleContactSubmit(e) {
    e.preventDefault();
    showToast('¡Mensaje enviado!');
    e.target.reset();
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    refreshAllViews();
});
