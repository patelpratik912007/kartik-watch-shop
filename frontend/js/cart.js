/**
 * Kartik Watch Shop — Cart Manager
 * localStorage-based persistent shopping cart with badge sync
 */

const KartikCart = (() => {
  const STORAGE_KEY = 'kartik_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateBadge();
    window.dispatchEvent(new CustomEvent('kartikCartUpdated', { detail: cart }));
  }

  function addItem(watch, qty = 1) {
    const cart = getCart();
    const existing = cart.find(i => i.id === watch.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: watch.id,
        name: watch.name,
        brand: watch.brand,
        price: watch.price,
        image: watch.image,
        badge: watch.badge,
        specs: watch.specs,
        qty
      });
    }
    saveCart(cart);
    showToast(`"${watch.name}" added to cart!`);
  }

  function removeItem(watchId) {
    const cart = getCart().filter(i => i.id !== watchId);
    saveCart(cart);
  }

  function updateQty(watchId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === watchId);
    if (item) {
      item.qty = Math.max(1, qty);
      saveCart(cart);
    }
  }

  function clearCart() {
    saveCart([]);
  }

  function getCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function getTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function updateBadge() {
    const count = getCount();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function showToast(msg) {
    let toast = document.getElementById('kartik-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'kartik-toast';
      toast.style.cssText = `
        position:fixed;bottom:28px;right:28px;
        background:linear-gradient(135deg,var(--rolex-green,#006039),#003B23);
        color:var(--ivory,#F3E0B5);padding:14px 22px;border-radius:12px;
        font-family:'Manrope',sans-serif;font-size:0.9rem;font-weight:600;
        box-shadow:0 8px 30px rgba(0,0,0,0.18);
        z-index:99999;transform:translateY(80px);opacity:0;
        transition:all 0.4s cubic-bezier(0.16,1,0.3,1);
        border:1px solid rgba(197,160,89,0.4);
        display:flex;align-items:center;gap:10px;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-cart-icon">🛒</span> ${msg}`;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.transform = 'translateY(80px)';
      toast.style.opacity = '0';
    }, 3000);
  }

  // Init badge on load
  document.addEventListener('DOMContentLoaded', updateBadge);

  return { getCart, addItem, removeItem, updateQty, clearCart, getCount, getTotal, updateBadge };
})();
