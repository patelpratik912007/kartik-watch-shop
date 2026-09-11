/**
 * Kartik Watch Shop — High-Performance Sorting & Filtering Engine
 * Handles full catalog filtering across:
 * - Gender tabs (All, Men's, Women's, Unisex)
 * - Brand selector (Rolex, Omega, Seiko, Tissot, Kartik Originals, Casio)
 * - Sorting (Featured, Price: Low-to-High, Price: High-to-Low, Highest Rated)
 * - Real-time debounced multi-keyword search
 * - Instant counter updates & seamless empty states
 */

document.addEventListener('DOMContentLoaded', () => {
  const genderTabs = document.querySelectorAll('.filter-tab');
  const brandSelect = document.getElementById('brandFilter');
  const sortSelect = document.getElementById('sortFilter');
  const searchInput = document.getElementById('searchFilter');
  const resetBtn = document.getElementById('resetFilters');
  const activeCountEl = document.getElementById('activeCount');
  const noResultsEl = document.getElementById('noResults');

  let activeGender = 'all';
  let activeBrand = 'all';
  let activeSort = 'featured';
  let searchQuery = '';
  let isFiltering = false;
  let originalCardOrder = []; // stores initial DOM order to restore "Featured" sort

  /**
   * Main Filter & Sort Function
   */
  function applyFiltersAndSort() {
    if (isFiltering) return;
    isFiltering = true;

    requestAnimationFrame(() => {
      isFiltering = false;

      // Ensure all category cards are rendered if available
      if (window.WatchRenderer && typeof window.WatchRenderer.renderAllCategoryCards === 'function') {
        window.WatchRenderer.renderAllCategoryCards();
      }

      const allCards = document.querySelectorAll('.collection-card');
      const allSections = document.querySelectorAll('.category-section');
      let totalVisible = 0;

      const cleanQuery = searchQuery.trim().toLowerCase();
      const queryTokens = cleanQuery ? cleanQuery.split(/\s+/).filter(Boolean) : [];

      allCards.forEach(card => {
        const cardGender = (card.dataset.gender || 'male').toLowerCase();
        const cardBrand = (card.dataset.brand || '').toLowerCase();
        const cardTitle = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
        const cardDesc = (card.querySelector('.card-desc')?.textContent || '').toLowerCase();
        const cardSpec = (card.querySelector('.card-spec-inline')?.textContent || '').toLowerCase();
        const cardBadge = (card.querySelector('.card-badge')?.textContent || '').toLowerCase();

        // 1. Gender check
        let matchesGender = false;
        if (activeGender === 'all') {
          matchesGender = true;
        } else if (activeGender === 'male') {
          matchesGender = (cardGender === 'male');
        } else if (activeGender === 'female') {
          matchesGender = (cardGender === 'female');
        } else if (activeGender === 'unisex') {
          matchesGender = (cardGender === 'unisex');
        }

        // 2. Brand check
        const matchesBrand = (activeBrand === 'all') || (cardBrand === activeBrand.toLowerCase());

        // 3. Search query multi-token check
        let matchesSearch = true;
        if (queryTokens.length > 0) {
          const searchableText = `${cardTitle} ${cardBrand} ${cardDesc} ${cardSpec} ${cardBadge} ${cardGender}`;
          matchesSearch = queryTokens.every(token => searchableText.includes(token));
        }

        // Apply visibility
        if (matchesGender && matchesBrand && matchesSearch) {
          card.style.display = 'flex';
          card.classList.remove('is-hidden');
          totalVisible++;
        } else {
          card.style.display = 'none';
          card.classList.add('is-hidden');
        }
      });

      // 4. Sort visible cards in the straight unified grid (Amazon-style global sort)
      const grid = document.getElementById('unifiedGrid') || document.querySelector('.collections-grid');
      if (grid) {
        if (!grid.dataset.originalOrder) {
          const orderIds = Array.from(grid.querySelectorAll('.collection-card')).map(c => c.dataset.id);
          grid.dataset.originalOrder = JSON.stringify(orderIds);
        }

        const visibleCards = Array.from(grid.querySelectorAll('.collection-card:not(.is-hidden)'));

        if (activeSort === 'featured' && grid.dataset.originalOrder) {
          const originalIds = JSON.parse(grid.dataset.originalOrder);
          const allGridCards = Array.from(grid.querySelectorAll('.collection-card'));
          const cardMap = new Map(allGridCards.map(c => [c.dataset.id, c]));
          const fragment = document.createDocumentFragment();
          originalIds.forEach(id => {
            const card = cardMap.get(id);
            if (card) fragment.appendChild(card);
          });
          grid.appendChild(fragment);
        } else if (activeSort !== 'featured' && visibleCards.length > 1) {
          visibleCards.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price || 0);
            const priceB = parseFloat(b.dataset.price || 0);
            const ratingA = parseFloat(a.dataset.rating || 0);
            const ratingB = parseFloat(b.dataset.rating || 0);

            if (activeSort === 'price-low') return priceA - priceB;
            if (activeSort === 'price-high') return priceB - priceA;
            if (activeSort === 'rating') return ratingB - ratingA;
            return 0;
          });

          const fragment = document.createDocumentFragment();
          visibleCards.forEach(c => fragment.appendChild(c));
          grid.appendChild(fragment);
        }
      }

      // Also support legacy category sections if any exist
      allSections.forEach(section => {
        const secGrid = section.querySelector('.category-grid');
        if (!secGrid) return;
        const visibleCards = Array.from(secGrid.querySelectorAll('.collection-card:not(.is-hidden)'));
        section.style.display = visibleCards.length === 0 ? 'none' : 'block';
        const countEl = section.querySelector('.category-count');
        if (countEl) countEl.textContent = `${visibleCards.length} timepieces`;
      });

      // 5. Update global counter & empty state
      if (activeCountEl) {
        activeCountEl.textContent = totalVisible;
      }

      if (noResultsEl) {
        noResultsEl.style.display = totalVisible === 0 ? 'block' : 'none';
      }
    });
  }

  // ── Event Handlers ──

  // Gender Tab Clicks
  genderTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      genderTabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeGender = e.currentTarget.dataset.gender || 'all';
      applyFiltersAndSort();
    });
  });

  // Brand Chips (Amazon-style Quick Filter Pills)
  const brandChips = document.querySelectorAll('.brand-chip');
  brandChips.forEach(chip => {
    chip.addEventListener('click', () => {
      brandChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeBrand = chip.dataset.brand || 'all';
      if (brandSelect) brandSelect.value = activeBrand;
      applyFiltersAndSort();
    });
  });

  // Brand Dropdown
  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      activeBrand = e.target.value;
      const chips = document.querySelectorAll('.brand-chip');
      chips.forEach(c => {
        c.classList.toggle('active', c.dataset.brand === activeBrand);
      });
      applyFiltersAndSort();
    });
  }

  // Sort Dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      applyFiltersAndSort();
    });
  }

  // Search Input with 150ms debounce
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value;
        applyFiltersAndSort();
      }, 150);
    });
  }

  // Reset Filters
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeGender = 'all';
      activeBrand = 'all';
      activeSort = 'featured';
      searchQuery = '';

      genderTabs.forEach(t => t.classList.remove('active'));
      const defaultTab = document.querySelector('.filter-tab[data-gender="all"]');
      if (defaultTab) defaultTab.classList.add('active');

      const chips = document.querySelectorAll('.brand-chip');
      chips.forEach(c => {
        c.classList.toggle('active', c.dataset.brand === 'all');
      });

      if (brandSelect) brandSelect.value = 'all';
      if (sortSelect) sortSelect.value = 'featured';
      if (searchInput) searchInput.value = '';

      document.querySelectorAll('.category-section').forEach(s => s.style.display = 'block');
      applyFiltersAndSort();
    });
  }

  // Empty state reset button
  const emptyResetBtn = document.getElementById('emptyStateReset');
  if (emptyResetBtn && resetBtn) {
    emptyResetBtn.addEventListener('click', () => {
      resetBtn.click();
    });
  }

  // Listen for initial renderer ready event
  window.addEventListener('catalogRendered', () => {
    applyFiltersAndSort();
  });

  // Initial pass
  setTimeout(applyFiltersAndSort, 50);
});
