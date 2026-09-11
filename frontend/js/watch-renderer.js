/**
 * Kartik Watch Shop — Updated Watch Renderer
 * Amazon-style cards: Buy Now, Add to Cart, product page links
 */

(function() {
  const renderedCategories = new Set();
  let sectionElements = {};

  function createCardHTML(w) {
    const formattedPrice = Number(w.price).toLocaleString('en-IN');
    const brandCapitalized = w.brand.charAt(0).toUpperCase() + w.brand.slice(1);
    const genderLabel = w.gender === 'female' ? "Women's" : w.gender === 'unisex' ? 'Unisex' : "Men's";

    const fullStars = Math.floor(w.rating);
    const hasHalf = w.rating % 1 >= 0.5;
    const starsHTML = '★'.repeat(fullStars) + (hasHalf ? '½' : '');

    // Discount display (show 15–20% MRP for realism)
    const mrpMultiplier = 1.18;
    const mrp = Math.round(w.price * mrpMultiplier / 100) * 100;
    const discount = Math.round((1 - w.price / mrp) * 100);

    // Stock badge
    const stockBadge = w.price > 80000
      ? '<span class="stock-badge stock-low">Only 2 left</span>'
      : '<span class="stock-badge stock-in">In Stock</span>';

    return `<article class="collection-card rolex-style-card amz-card" data-id="${w.id}" data-gender="${w.gender}" data-brand="${w.brand}" data-price="${w.price}" data-rating="${w.rating}" data-category="${w.category}">
      <a href="product.html?id=${w.id}" class="card-image-link">
        <div class="card-image-wrap">
          <div class="card-pedestal-light"></div>
          <img src="${w.image}" alt="${w.name}" class="card-img" loading="lazy" decoding="async">
          <div class="card-badge rolex-badge">${w.badge}</div>
          <div class="card-rating-badge"><span class="star-icon">★</span> ${w.rating.toFixed(1)}</div>
          ${stockBadge}
        </div>
      </a>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-tag">${genderLabel}</span>
          <span class="card-divider">•</span>
          <span class="card-brand">${brandCapitalized}</span>
        </div>
        <a href="product.html?id=${w.id}" class="card-title-link">
          <h3 class="card-title">${w.name}</h3>
        </a>
        <p class="card-desc">${w.desc}</p>

        <div class="card-rating-row">
          <span class="stars-gold">${starsHTML}</span>
          <span class="rating-num">(${w.rating.toFixed(1)})</span>
          <span class="card-spec-inline">${w.specs}</span>
        </div>

        <div class="card-price-row">
          <div class="price-block">
            <span class="price-mrp">₹${mrp.toLocaleString('en-IN')}</span>
            <span class="price-discount">-${discount}%</span>
            <span class="price-val">₹${formattedPrice}</span>
          </div>
        </div>

        <div class="card-amz-actions">
          <button class="btn-add-cart" data-id="${w.id}" aria-label="Add ${w.name} to cart">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Add to Cart
          </button>
          <a href="product.html?id=${w.id}" class="btn-buy-now">Buy Now</a>
        </div>
      </div>
    </article>`;
  }

  function attachCardEvents(container) {
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(btn.dataset.id);
        const watch = WATCH_CATALOG.find(w => w.id === id);
        if (watch && typeof KartikCart !== 'undefined') {
          KartikCart.addItem(watch);
          btn.textContent = '✓ Added!';
          btn.style.background = 'var(--rolex-green)';
          setTimeout(() => {
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart`;
            btn.style.background = '';
          }, 2000);
        }
      });
    });
  }

  function renderCategoryCards(catId) {
    if (renderedCategories.has(catId)) return;
    const section = sectionElements[catId];
    if (!section) return;
    const grid = section.querySelector('.category-grid');
    if (!grid) return;

    const catWatches = WATCH_CATALOG.filter(w => w.category === catId);
    if (!catWatches.length) return;

    const fragment = document.createDocumentFragment();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = catWatches.map(createCardHTML).join('');
    while (tempDiv.firstChild) fragment.appendChild(tempDiv.firstChild);
    grid.appendChild(fragment);
    renderedCategories.add(catId);
    grid.dataset.rendered = 'true';

    const countEl = section.querySelector('.category-count');
    if (countEl) countEl.textContent = `${catWatches.length} timepieces`;

    attachCardEvents(grid);
  }

  function renderAllCardsDirectly() {
    const collectionsContainer = document.getElementById('dynamicCollections');
    if (!collectionsContainer || typeof WATCH_CATALOG === 'undefined') return;

    // Check if already rendered
    if (document.getElementById('unifiedGrid')) return;

    collectionsContainer.innerHTML = '';

    // Create the Amazon-style straight product catalog grid
    const grid = document.createElement('div');
    grid.className = 'collections-grid collections-straight-grid';
    grid.id = 'unifiedGrid';

    // Render all 31 watches directly in one straight continuous catalog
    grid.innerHTML = WATCH_CATALOG.map(createCardHTML).join('');
    collectionsContainer.appendChild(grid);

    attachCardEvents(grid);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const collectionsContainer = document.getElementById('dynamicCollections');
    if (!collectionsContainer || typeof WATCH_CATALOG === 'undefined') return;

    renderAllCardsDirectly();

    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('catalogRendered'));
    });
  });

  window.WatchRenderer = {
    renderCategoryCards: () => renderAllCardsDirectly(),
    renderAllCategoryCards: () => renderAllCardsDirectly(),
    isRendered: () => !!document.getElementById('unifiedGrid')
  };
})();
