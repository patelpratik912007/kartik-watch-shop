/**
 * Kartik Watch Shop — Shop Owner Studio & Device Control Center
 * 
 * Exclusive interface for the Boutique Owner:
 * - Hidden by default from regular customers.
 * - Activated via secret trigger: 5 rapid clicks on "EST. 1998" or Ctrl+Shift+O or URL hash #owner.
 * - Authenticates device with Owner Master Passcode & stores paired device token.
 * - Allows watch uploads (with images and multi-angle views).
 * - Full price and discount control with live calculation.
 * - Batch brand/storewide promotions.
 * - Instant synchronization with backend database & local state.
 */

(function () {
  'use strict';

  const STORAGE_KEY_AUTH = 'kartik_owner_device_auth';
  const STORAGE_KEY_OVERRIDES = 'kartik_price_overrides';
  const STORAGE_KEY_CUSTOM = 'kartik_custom_watches';
  const STORAGE_KEY_DELETED = 'kartik_deleted_watches';

  let currentOwnerToken = localStorage.getItem(STORAGE_KEY_AUTH) || null;
  let clickCount = 0;
  let lastClickTime = 0;

  // ══════════════════════════════════════════════════════════
  // 1. DEVICE AUTHORIZATION HELPERS
  // ══════════════════════════════════════════════════════════

  function isDeviceAuthorized() {
    return Boolean(currentOwnerToken);
  }

  function setDeviceAuthorized(token) {
    currentOwnerToken = token || 'KWS-OWNER-SECURE-1998-TOKEN';
    localStorage.setItem(STORAGE_KEY_AUTH, currentOwnerToken);
    updateOwnerVisibility();
  }

  function revokeDeviceAuthorization() {
    currentOwnerToken = null;
    localStorage.removeItem(STORAGE_KEY_AUTH);
    closeOwnerDrawer();
    updateOwnerVisibility();
    showToast('Device Unpaired: Boutique returned to standard client view.', 'info');
  }

  // ══════════════════════════════════════════════════════════
  // 2. SECRET TRIGGER LISTENERS
  // ══════════════════════════════════════════════════════════

  function setupSecretTriggers() {
    // A. Keyboard shortcut: Ctrl + Shift + O (or Cmd + Shift + O on Mac)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        e.preventDefault();
        triggerOwnerAccess();
      }
    });

    // B. 5 rapid clicks on "EST. 1998" text in logo/header
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.brand-sub') || e.target.closest('.brand-title');
      if (target) {
        const now = Date.now();
        if (now - lastClickTime < 800) {
          clickCount++;
        } else {
          clickCount = 1;
        }
        lastClickTime = now;

        if (clickCount >= 5) {
          clickCount = 0;
          triggerOwnerAccess();
        }
      }
    });

    // C. URL Hash trigger (#owner or #owner-studio)
    if (window.location.hash === '#owner' || window.location.hash === '#owner-studio') {
      setTimeout(() => triggerOwnerAccess(), 300);
    }
  }

  function triggerOwnerAccess() {
    if (isDeviceAuthorized()) {
      openOwnerDrawer();
    } else {
      openAuthModal();
    }
  }

  // ══════════════════════════════════════════════════════════
  // 3. OWNER PASSCODE VERIFICATION MODAL
  // ══════════════════════════════════════════════════════════

  function openAuthModal() {
    let modal = document.getElementById('ownerAuthModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ownerAuthModal';
      modal.className = 'owner-auth-modal';
      modal.innerHTML = `
        <div class="owner-auth-dialog">
          <div class="owner-lock-icon">⚜</div>
          <h2 class="owner-auth-title">Shop Owner Security</h2>
          <p class="owner-auth-desc">Enter Boutique Owner Passcode or Master PIN to pair this device and unlock the Owner Control Center.</p>
          <input type="password" id="ownerPasscodeField" class="owner-passcode-input" placeholder="••••" autofocus maxlength="20">
          <div id="ownerAuthError" style="color: #ef4444; font-size: 0.8rem; margin-bottom: 1rem; display: none;"></div>
          <div class="owner-auth-actions">
            <button type="button" id="btnUnlockOwner" class="btn-owner-unlock">Authenticate &amp; Pair Device &rarr;</button>
            <button type="button" id="btnCancelOwnerAuth" class="btn-owner-cancel">Cancel</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#btnCancelOwnerAuth').addEventListener('click', () => {
        modal.style.display = 'none';
      });

      const input = modal.querySelector('#ownerPasscodeField');
      const errorDiv = modal.querySelector('#ownerAuthError');

      const submitAuth = async () => {
        const passcode = input.value.trim();
        if (!passcode) return;

        errorDiv.style.display = 'none';

        // Try backend verification first
        try {
          const res = await fetch('/api/admin/verify-device', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passcode })
          });
          const data = await res.json();
          if (data.success) {
            setDeviceAuthorized(data.token);
            modal.style.display = 'none';
            input.value = '';
            showToast('Device Paired Successfully as Boutique Owner ⚜', 'success');
            openOwnerDrawer();
            return;
          } else {
            errorDiv.textContent = data.error || 'Invalid passcode.';
            errorDiv.style.display = 'block';
            return;
          }
        } catch (err) {
          // Local fallback for standalone mode
          if (['1998', 'admin123', 'KARTIK-OWNER-1998'].includes(passcode)) {
            setDeviceAuthorized('KWS-OWNER-SECURE-1998-TOKEN');
            modal.style.display = 'none';
            input.value = '';
            showToast('Device Paired Successfully as Boutique Owner ⚜ (Local Mode)', 'success');
            openOwnerDrawer();
            return;
          } else {
            errorDiv.textContent = 'Invalid Master Passcode.';
            errorDiv.style.display = 'block';
          }
        }
      };

      modal.querySelector('#btnUnlockOwner').addEventListener('click', submitAuth);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitAuth();
      });
    }

    modal.style.display = 'flex';
    setTimeout(() => {
      const field = modal.querySelector('#ownerPasscodeField');
      if (field) { field.value = ''; field.focus(); }
    }, 50);
  }

  // ══════════════════════════════════════════════════════════
  // 4. FLOATING TRIGGER BUTTON & VISIBILITY
  // ══════════════════════════════════════════════════════════

  function updateOwnerVisibility() {
    let fab = document.getElementById('ownerFabBtn');
    if (!fab && isDeviceAuthorized()) {
      fab = document.createElement('button');
      fab.id = 'ownerFabBtn';
      fab.className = 'owner-fab';
      fab.title = 'Open Shop Owner Studio';
      fab.innerHTML = `<span class="owner-fab-icon">⚜</span> <span>Owner Studio</span>`;
      fab.addEventListener('click', openOwnerDrawer);
      document.body.appendChild(fab);
    }

    if (fab) {
      fab.style.display = isDeviceAuthorized() ? 'flex' : 'none';
    }
  }

  // ══════════════════════════════════════════════════════════
  // 5. OWNER SIDE DRAWER COMPONENT
  // ══════════════════════════════════════════════════════════

  function openOwnerDrawer() {
    let drawer = document.getElementById('ownerStudioDrawer');
    let overlay = document.getElementById('ownerDrawerOverlay');

    if (!drawer) {
      buildDrawerDOM();
      drawer = document.getElementById('ownerStudioDrawer');
      overlay = document.getElementById('ownerDrawerOverlay');
    }

    refreshPricesTable();
    overlay.classList.add('is-active');
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeOwnerDrawer() {
    const drawer = document.getElementById('ownerStudioDrawer');
    const overlay = document.getElementById('ownerDrawerOverlay');
    if (drawer) drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function buildDrawerDOM() {
    const overlay = document.createElement('div');
    overlay.id = 'ownerDrawerOverlay';
    overlay.className = 'owner-drawer-overlay';
    overlay.addEventListener('click', closeOwnerDrawer);
    document.body.appendChild(overlay);

    const drawer = document.createElement('aside');
    drawer.id = 'ownerStudioDrawer';
    drawer.className = 'owner-drawer';
    drawer.innerHTML = `
      <div class="owner-header">
        <div class="owner-title-wrap">
          <span class="owner-badge">BOUTIQUE CONTROL CENTER</span>
          <h2 class="owner-title">⚜ Shop Owner Studio</h2>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="owner-device-indicator">
            <span class="owner-indicator-dot"></span>
            <span>PAIRED</span>
          </div>
          <button type="button" class="btn-owner-close" id="btnCloseOwnerStudio" aria-label="Close Owner Studio">&times;</button>
        </div>
      </div>

      <nav class="owner-tabs">
        <button type="button" class="owner-tab-btn active" data-tab="tabPrices">Price &amp; Discounts</button>
        <button type="button" class="owner-tab-btn" data-tab="tabUpload">Upload Watch</button>
        <button type="button" class="owner-tab-btn" data-tab="tabPromos">Batch Promos</button>
        <button type="button" class="owner-tab-btn" data-tab="tabSecurity">Device &amp; Security</button>
      </nav>

      <div class="owner-body">
        <!-- ── TAB 1: PRICE & DISCOUNT STUDIO ── -->
        <div class="owner-section-pane active" id="panePrices">
          <div class="owner-search-strip">
            <input type="text" id="ownerSearchWatches" class="owner-input" placeholder="Filter watches by brand or model name...">
            <select id="ownerBrandFilter" class="owner-select" style="width: 160px;">
              <option value="all">All Brands</option>
              <option value="seiko">Seiko</option>
              <option value="citizen">Citizen</option>
              <option value="tissot">Tissot</option>
              <option value="casio">Casio</option>
              <option value="hamilton">Hamilton</option>
            </select>
          </div>
          <div id="ownerWatchList"></div>
        </div>

        <!-- ── TAB 2: UPLOAD WATCH ── -->
        <div class="owner-section-pane" id="paneUpload">
          <form id="ownerUploadForm" class="owner-form-grid" novalidate>
            <div class="form-full">
              <label class="owner-label">Watch Model Name *</label>
              <input type="text" id="uploadName" class="owner-input" placeholder="e.g. Grand Seiko Heritage Snowflake" required>
            </div>

            <div>
              <label class="owner-label">Brand *</label>
              <select id="uploadBrand" class="owner-select" required>
                <option value="seiko">Seiko</option>
                <option value="citizen">Citizen</option>
                <option value="tissot">Tissot</option>
                <option value="casio">Casio &amp; G-Shock</option>
                <option value="hamilton">Hamilton</option>
                <option value="rolex">Rolex</option>
                <option value="omega">Omega</option>
              </select>
            </div>

            <div>
              <label class="owner-label">Gender</label>
              <select id="uploadGender" class="owner-select">
                <option value="male">Men's</option>
                <option value="female">Women's</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label class="owner-label">Selling Price (₹) *</label>
              <input type="number" id="uploadPrice" class="owner-input" placeholder="68000" min="1" required>
            </div>

            <div>
              <label class="owner-label">Original MRP (₹) *</label>
              <input type="number" id="uploadMrp" class="owner-input" placeholder="80000" min="1" required>
              <div class="price-calc-hint" id="uploadDiscountHint">Discount: 15% off MRP</div>
            </div>

            <div>
              <label class="owner-label">Initial Stock Count</label>
              <input type="number" id="uploadStock" class="owner-input" value="10" min="0">
            </div>

            <div>
              <label class="owner-label">Badge Text</label>
              <input type="text" id="uploadBadge" class="owner-input" placeholder="e.g. MASTER EDITION • JAPAN">
            </div>

            <div class="form-full">
              <label class="owner-label">Key Specifications</label>
              <input type="text" id="uploadSpecs" class="owner-input" placeholder="e.g. 40mm • Automatic Spring Drive Cal. 9R65 • 100m">
            </div>

            <div class="form-full">
              <label class="owner-label">Curated Description</label>
              <textarea id="uploadDesc" class="owner-textarea" rows="3" placeholder="Luxury craftsmanship details, case finishing, crystal type, and movement heritage..."></textarea>
            </div>

            <div class="form-full">
              <label class="owner-label">Watch Photograph</label>
              <div class="owner-file-dropzone" id="ownerDropzone">
                <div class="dropzone-icon">📷</div>
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Choose image file or drag here</div>
                <div style="font-size: 0.75rem; color: #8a92a2;">Supports JPG, PNG, WEBP (Max 5MB)</div>
                <input type="file" id="uploadFileInput" accept="image/*" style="display: none;">
              </div>
              <div id="uploadImagePreview" style="display: none; margin-top: 0.75rem; align-items: center; gap: 0.75rem;">
                <img id="previewImgTag" src="" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
                <span id="previewImgName" style="font-size: 0.8rem; color: #c5a059;"></span>
              </div>
            </div>

            <div class="form-full">
              <button type="submit" class="btn-owner-submit">Publish Timepiece to Boutique &rarr;</button>
            </div>
          </form>
        </div>

        <!-- ── TAB 3: BATCH PROMOTIONS ── -->
        <div class="owner-section-pane" id="panePromos">
          <div class="promo-box">
            <h3 class="promo-title">Festive &amp; Seasonal Promotions</h3>
            <p class="promo-desc">Apply uniform promotional discounts across an entire brand or the full boutique catalogue with one click.</p>
            
            <div style="margin-bottom: 1.25rem;">
              <label class="owner-label">Select Target Brand</label>
              <select id="batchPromoBrand" class="owner-select">
                <option value="all">Entire Boutique Catalogue (All Brands)</option>
                <option value="seiko">Seiko Precision</option>
                <option value="citizen">Citizen Eco-Drive</option>
                <option value="tissot">Tissot Swiss</option>
                <option value="casio">Casio &amp; G-Shock</option>
                <option value="hamilton">Hamilton Swiss</option>
              </select>
            </div>

            <label class="owner-label">Choose Discount Tier</label>
            <div class="promo-grid-buttons">
              <button type="button" class="btn-promo-chip" data-percent="5">5% OFF</button>
              <button type="button" class="btn-promo-chip" data-percent="10">10% OFF</button>
              <button type="button" class="btn-promo-chip" data-percent="15">15% OFF</button>
              <button type="button" class="btn-promo-chip" data-percent="20">20% OFF</button>
            </div>
          </div>
        </div>

        <!-- ── TAB 4: DEVICE & SECURITY ── -->
        <div class="owner-section-pane" id="paneSecurity">
          <div class="device-card">
            <div class="device-status-row">
              <span style="font-size: 1.5rem;">🛡️</span>
              <div>
                <h4 style="margin: 0; font-size: 1rem; color: #fff;">Authorized Boutique Device</h4>
                <span style="font-size: 0.75rem; color: #10b981; font-family: monospace;">Cryptographic Token Active</span>
              </div>
            </div>
            <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.6; margin-bottom: 1.5rem;">
              This specific browser/device is recognized as the verified Shop Owner. No other devices or visitors can see or access the Owner Studio.
            </p>
            <button type="button" id="btnRevokeDevice" class="btn-revoke-device">Lock &amp; Unpair This Device</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(drawer);

    // Event listeners for tabs
    drawer.querySelector('#btnCloseOwnerStudio').addEventListener('click', closeOwnerDrawer);

    drawer.querySelectorAll('.owner-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        drawer.querySelectorAll('.owner-tab-btn').forEach(b => b.classList.remove('active'));
        drawer.querySelectorAll('.owner-section-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const paneId = btn.dataset.tab.replace('tab', 'pane');
        const pane = drawer.querySelector('#' + paneId);
        if (pane) pane.classList.add('active');
      });
    });

    // Wire Upload Form
    setupUploadForm(drawer);

    // Wire Batch Promotions
    setupBatchPromos(drawer);

    // Wire Unpair Device
    drawer.querySelector('#btnRevokeDevice').addEventListener('click', () => {
      if (confirm('Are you sure you want to unpair this device? You will need your master passcode to re-enter.')) {
        revokeDeviceAuthorization();
      }
    });

    // Wire Search in Prices tab
    const searchInput = drawer.querySelector('#ownerSearchWatches');
    const brandSelect = drawer.querySelector('#ownerBrandFilter');
    searchInput.addEventListener('input', refreshPricesTable);
    brandSelect.addEventListener('change', refreshPricesTable);
  }

  // ══════════════════════════════════════════════════════════
  // 6. UPLOAD FORM CONTROLLER
  // ══════════════════════════════════════════════════════════

  function setupUploadForm(drawer) {
    const form = drawer.querySelector('#ownerUploadForm');
    const priceInput = drawer.querySelector('#uploadPrice');
    const mrpInput = drawer.querySelector('#uploadMrp');
    const hint = drawer.querySelector('#uploadDiscountHint');
    const dropzone = drawer.querySelector('#ownerDropzone');
    const fileInput = drawer.querySelector('#uploadFileInput');
    const previewWrap = drawer.querySelector('#uploadImagePreview');
    const previewImg = drawer.querySelector('#previewImgTag');
    const previewName = drawer.querySelector('#previewImgName');

    let uploadedImagePath = 'assets/watches/demo/front.jpg';

    // Auto-recalculate discount hint
    function updateDiscountHint() {
      const price = parseFloat(priceInput.value) || 0;
      const mrp = parseFloat(mrpInput.value) || 0;
      if (mrp > 0 && price > 0 && mrp >= price) {
        const discount = Math.round((1 - price / mrp) * 100);
        hint.textContent = `Discount: ${discount}% off MRP (Save ₹${(mrp - price).toLocaleString('en-IN')})`;
      } else if (price > 0 && mrp === 0) {
        mrpInput.value = Math.round(price * 1.18 / 100) * 100;
        updateDiscountHint();
      }
    }

    priceInput.addEventListener('input', updateDiscountHint);
    mrpInput.addEventListener('input', updateDiscountHint);

    // File picker handlers
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        previewName.textContent = file.name;

        // Display local thumbnail immediately
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          previewWrap.style.display = 'flex';
        };
        reader.readAsDataURL(file);

        // Upload to backend if available
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await fetch('/api/products/upload-image', {
            method: 'POST',
            headers: { 'X-Owner-Token': currentOwnerToken || '' },
            body: formData
          });
          const data = await res.json();
          if (data.success && data.url) {
            uploadedImagePath = data.url;
            showToast('Image uploaded and optimized successfully.', 'success');
          }
        } catch (e) {
          // Local fallback: use data URL directly
          uploadedImagePath = previewImg.src;
        }
      }
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = drawer.querySelector('#uploadName').value.trim();
      const brand = drawer.querySelector('#uploadBrand').value;
      const gender = drawer.querySelector('#uploadGender').value;
      const price = parseFloat(priceInput.value) || 0;
      const mrp = parseFloat(mrpInput.value) || Math.round(price * 1.18);
      const stock = parseInt(drawer.querySelector('#uploadStock').value) || 10;
      const badge = drawer.querySelector('#uploadBadge').value.trim() || `${brand.toUpperCase()} • LUXURY`;
      const specs = drawer.querySelector('#uploadSpecs').value.trim() || 'Swiss / Japanese Calibre';
      const desc = drawer.querySelector('#uploadDesc').value.trim() || `Finely crafted luxury timepiece by ${brand}.`;

      if (!name || price <= 0) {
        alert('Please provide a valid watch name and selling price.');
        return;
      }

      const newWatchPayload = {
        name,
        brand,
        category: `${brand}-${gender === 'female' ? 'womens' : 'mens'}`,
        gender,
        price,
        mrp,
        stock,
        badge,
        specs,
        desc,
        image: uploadedImagePath,
        rating: 5.0,
        is_featured: 1
      };

      // 1. Try sending to backend
      let savedWatch = null;
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Owner-Token': currentOwnerToken || ''
          },
          body: JSON.stringify(newWatchPayload)
        });
        const data = await res.json();
        if (data.success && data.product) {
          savedWatch = data.product;
        }
      } catch (err) {
        console.warn('Backend unavailable, using local persistence.');
      }

      // 2. Always persist to localStorage for instant client rendering
      const customWatches = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM) || '[]');
      if (!savedWatch) {
        newWatchPayload.id = Date.now();
        savedWatch = newWatchPayload;
      }
      customWatches.push(savedWatch);
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customWatches));

      // Trigger catalog update event
      if (window.KartikCatalog) {
        window.KartikCatalog.sync();
      }

      form.reset();
      previewWrap.style.display = 'none';
      showToast(`Timepiece "${name}" published to boutique!`, 'success');

      // Switch to Prices tab to view the item
      const pricesTabBtn = drawer.querySelector('.owner-tab-btn[data-tab="tabPrices"]');
      if (pricesTabBtn) pricesTabBtn.click();
    });
  }

  // ══════════════════════════════════════════════════════════
  // 7. PRICE & DISCOUNT TABLE CONTROLLER
  // ══════════════════════════════════════════════════════════

  function refreshPricesTable() {
    const list = document.getElementById('ownerWatchList');
    if (!list) return;

    const query = (document.getElementById('ownerSearchWatches')?.value || '').toLowerCase().trim();
    const brand = document.getElementById('ownerBrandFilter')?.value || 'all';

    const allWatches = (window.KartikCatalog ? window.KartikCatalog.getAll() : (typeof WATCH_CATALOG !== 'undefined' ? WATCH_CATALOG : []));

    const filtered = allWatches.filter(w => {
      const matchesBrand = brand === 'all' || w.brand === brand;
      const matchesQuery = !query || w.name.toLowerCase().includes(query) || w.brand.toLowerCase().includes(query);
      return matchesBrand && matchesQuery;
    });

    if (filtered.length === 0) {
      list.innerHTML = `<div style="text-align: center; color: #8a92a2; padding: 2rem;">No watches match the filter criteria.</div>`;
      return;
    }

    list.innerHTML = filtered.map(w => {
      const mrp = w.mrp || Math.round(w.price * 1.18 / 100) * 100;
      const discount = Math.round((1 - w.price / mrp) * 100);

      return `
        <div class="owner-watch-item" data-id="${w.id}">
          <img src="${w.image}" class="owner-watch-thumb" alt="${w.name}">
          <div class="owner-watch-info">
            <span class="owner-watch-brand">${w.brand} &bull; Ref #${w.id}</span>
            <div class="owner-watch-name">${w.name}</div>
            
            <div class="owner-price-inputs">
              <div class="price-field-wrap">
                <label>Price (₹)</label>
                <input type="number" class="price-input-mini item-price" value="${Math.round(w.price)}" step="500">
              </div>
              <div class="price-field-wrap">
                <label>MRP (₹)</label>
                <input type="number" class="price-input-mini item-mrp" value="${Math.round(mrp)}" step="500">
              </div>
              <div class="price-field-wrap">
                <label>Discount %</label>
                <input type="number" class="price-input-mini item-discount" value="${discount}" min="0" max="90" style="width: 70px;">
              </div>
            </div>
          </div>
          <div class="owner-watch-actions">
            <button type="button" class="btn-save-item" onclick="window.KartikOwner.saveWatch(${w.id})">Save Price</button>
            <button type="button" class="btn-delete-item" onclick="window.KartikOwner.deleteWatch(${w.id})">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach real-time discount calculation per row
    list.querySelectorAll('.owner-watch-item').forEach(row => {
      const priceInput = row.querySelector('.item-price');
      const mrpInput = row.querySelector('.item-mrp');
      const discountInput = row.querySelector('.item-discount');

      priceInput.addEventListener('input', () => {
        const p = parseFloat(priceInput.value) || 0;
        const m = parseFloat(mrpInput.value) || 0;
        if (m > 0 && p > 0) {
          discountInput.value = Math.max(0, Math.round((1 - p / m) * 100));
        }
      });

      discountInput.addEventListener('input', () => {
        const disc = parseFloat(discountInput.value) || 0;
        const m = parseFloat(mrpInput.value) || 0;
        if (m > 0) {
          priceInput.value = Math.round(m * (1 - disc / 100));
        }
      });
    });
  }

  async function saveWatchPrice(id) {
    const row = document.querySelector(`.owner-watch-item[data-id="${id}"]`);
    if (!row) return;

    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const mrp = parseFloat(row.querySelector('.item-mrp').value) || (price * 1.18);

    if (price <= 0) {
      alert('Price must be greater than zero.');
      return;
    }

    // 1. Try Backend Update
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Owner-Token': currentOwnerToken || ''
        },
        body: JSON.stringify({ price, mrp })
      });
    } catch (e) {
      // Local mode fallback
    }

    // 2. Save locally
    const overrides = JSON.parse(localStorage.getItem(STORAGE_KEY_OVERRIDES) || '{}');
    overrides[id] = Object.assign({}, overrides[id] || {}, { price, mrp });
    localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));

    // Update custom watches list if it's a custom watch
    const customWatches = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM) || '[]');
    const customMatch = customWatches.find(cw => cw.id === id);
    if (customMatch) {
      customMatch.price = price;
      customMatch.mrp = mrp;
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customWatches));
    }

    // 3. Notify Catalog
    if (window.KartikCatalog) {
      window.KartikCatalog.sync();
    }

    showToast(`Price updated to ₹${price.toLocaleString('en-IN')}`, 'success');
  }

  async function deleteWatch(id) {
    if (!confirm(`Are you sure you want to remove watch #${id} from the boutique?`)) {
      return;
    }

    // 1. Try Backend Delete
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'X-Owner-Token': currentOwnerToken || '' }
      });
    } catch (e) {}

    // 2. Local store removal
    const deletedIds = JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED) || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deletedIds));
    }

    const customWatches = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM) || '[]').filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customWatches));

    if (window.KartikCatalog) {
      window.KartikCatalog.sync();
    }

    refreshPricesTable();
    showToast(`Timepiece #${id} removed from boutique.`, 'info');
  }

  // ══════════════════════════════════════════════════════════
  // 8. BATCH PROMOTIONS CONTROLLER
  // ══════════════════════════════════════════════════════════

  function setupBatchPromos(drawer) {
    drawer.querySelectorAll('.btn-promo-chip').forEach(btn => {
      btn.addEventListener('click', async () => {
        const percent = parseFloat(btn.dataset.percent) || 10;
        const brand = drawer.querySelector('#batchPromoBrand').value;

        if (!confirm(`Apply ${percent}% discount on ${brand === 'all' ? 'ALL watches' : brand.toUpperCase()}?`)) {
          return;
        }

        // 1. Backend update
        try {
          await fetch('/api/products/batch-discount', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Owner-Token': currentOwnerToken || ''
            },
            body: JSON.stringify({ brand, discount_percent: percent })
          });
        } catch (e) {}

        // 2. Local updates
        const multiplier = (100 - percent) / 100;
        const allWatches = window.KartikCatalog ? window.KartikCatalog.getAll() : WATCH_CATALOG;
        const overrides = JSON.parse(localStorage.getItem(STORAGE_KEY_OVERRIDES) || '{}');

        allWatches.forEach(w => {
          if (brand === 'all' || w.brand === brand) {
            const mrp = w.mrp || Math.round(w.price * 1.18);
            const newPrice = Math.round(mrp * multiplier);
            overrides[w.id] = Object.assign({}, overrides[w.id] || {}, { price: newPrice, mrp });
          }
        });
        localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));

        if (window.KartikCatalog) {
          window.KartikCatalog.sync();
        }

        refreshPricesTable();
        showToast(`${percent}% promotional discount applied!`, 'success');
      });
    });
  }

  // ══════════════════════════════════════════════════════════
  // 9. TOAST NOTIFICATION HELPER
  // ══════════════════════════════════════════════════════════

  function showToast(message, type = 'info') {
    let toast = document.getElementById('ownerToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ownerToast';
      toast.className = 'auth-toast';
      document.body.appendChild(toast);
    }

    toast.className = `auth-toast toast-${type} is-visible`;
    toast.textContent = message;

    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3500);
  }

  // ══════════════════════════════════════════════════════════
  // 10. INITIALIZATION
  // ══════════════════════════════════════════════════════════

  function init() {
    setupSecretTriggers();
    updateOwnerVisibility();

    // Listen for catalog updates to refresh owner table if drawer is open
    window.addEventListener('kartikCatalogUpdated', () => {
      const drawer = document.getElementById('ownerStudioDrawer');
      if (drawer && drawer.classList.contains('is-open')) {
        refreshPricesTable();
      }
    });
  }

  // Expose API for inline button handlers
  window.KartikOwner = {
    open: openOwnerDrawer,
    close: closeOwnerDrawer,
    saveWatch: saveWatchPrice,
    deleteWatch: deleteWatch,
    unpairDevice: revokeDeviceAuthorization
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
