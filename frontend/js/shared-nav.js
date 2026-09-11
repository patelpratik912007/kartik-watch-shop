/**
 * Kartik Watch Shop — Shared Luxury Navigation & Universal Footer
 * Quiet Luxury Theme: Cream (#FAF6F0), Navy (#162544), Muted Gold (#C5A059), Light Grey (#D8DCE3)
 * Injects responsive icon navbar with 3-dots menu button and universal 8-page interconnected footer.
 */

(function () {
  const NAV_ITEMS = [
    { href: 'index.html',       icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`, label: 'Home' },
    { href: 'collections.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`, label: 'Collections' },
    { href: 'services.html',    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`, label: 'Services' },
    { href: 'sell.html',        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, label: 'Sell Watch' },
    { href: 'cart.html',        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`, label: 'Cart', isCart: true },
    { href: 'auth.html',        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`, label: 'Sign In / VIP', isAuth: true },
  ];

  function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function buildNav() {
    const currentPage = getCurrentPage();
    const header = document.createElement('header');
    header.className = 'nav';
    header.id = 'top';

    header.innerHTML = `
      <div class="nav-container">
        <a href="index.html" class="brand" aria-label="Kartik Watch Shop Home">
          <!-- Premium K Monogram Logo -->
          <svg class="brand-symbol" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" stroke="url(#kGold)" stroke-width="1.5"/>
            <rect x="17.5" y="0.5" width="5" height="3" rx="1" fill="url(#kGold)"/>
            <circle cx="20" cy="20" r="15.5" stroke="url(#kGold)" stroke-width="0.8" stroke-dasharray="1.2 2"/>
            <rect x="19.3" y="5.5" width="1.4" height="3" rx="0.4" fill="url(#kGold)"/>
            <rect x="31.5" y="19.3" width="3" height="1.4" rx="0.4" fill="url(#kGold)"/>
            <rect x="19.3" y="31.5" width="1.4" height="3" rx="0.4" fill="url(#kGold)"/>
            <rect x="5.5" y="19.3" width="3" height="1.4" rx="0.4" fill="url(#kGold)"/>
            <text x="20" y="25.5" font-family="Georgia,serif" font-size="15" font-weight="700" fill="url(#kGold)" text-anchor="middle" letter-spacing="-1">K</text>
            <defs>
              <linearGradient id="kGold" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#F2E5CE"/>
                <stop offset="40%" stop-color="#E2C384"/>
                <stop offset="70%" stop-color="#C5A059"/>
                <stop offset="100%" stop-color="#8A6828"/>
              </linearGradient>
            </defs>
          </svg>

          <div class="brand-text">
            <span class="brand-title">KARTIK</span>
            <span class="brand-sub">MEHSANA &bull; EST. 1998</span>
          </div>
        </a>

        <!-- Responsive Menu Button with Modern Luxury 3-Dots Icon -->
        <button class="nav-toggle nav-toggle-dots" id="navToggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle Navigation Menu">
          <span class="nav-dot"></span>
          <span class="nav-dot"></span>
          <span class="nav-dot"></span>
        </button>

        <!-- Navigation Menu & Mobile Drawer -->
        <nav class="nav-menu nav-icon-menu" id="nav-menu" role="navigation">
          <div class="drawer-header">
            <div class="drawer-brand">
              <span class="drawer-brand-title">KARTIK</span>
              <span class="drawer-brand-sub">BOUTIQUE</span>
            </div>
            <button id="navDrawerClose" class="drawer-close-btn" aria-label="Close menu">&times;</button>
          </div>

          <ul class="nav-list">
            ${NAV_ITEMS.map(item => {
              const isActive = currentPage === item.href;
              const cartBadge = item.isCart ? '<span class="cart-badge is-hidden">0</span>' : '';
              const authClass = item.isAuth ? ' btn-nav' : '';
              return `<li>
                <a href="${item.href}" class="nav-icon-link${authClass}${isActive ? ' nav-active' : ''}" aria-label="${item.label}">
                  <span class="nav-icon-svg">${item.icon}</span>
                  <span class="nav-icon-label">${item.label}</span>
                  ${cartBadge}
                </a>
              </li>`;
            }).join('')}
          </ul>
        </nav>
        <button class="nav-scrim" id="navScrim" type="button" tabindex="-1" aria-label="Close navigation menu"></button>
      </div>
    `;

    document.body.insertAdjacentElement('afterbegin', header);

    // Mobile toggle handlers
    const toggle = header.querySelector('#navToggle');
    const menu = header.querySelector('#nav-menu');
    const closeBtn = header.querySelector('#navDrawerClose');
    const scrim = header.querySelector('#navScrim');

    function toggleMenu(open) {
      const state = open !== undefined ? open : !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', state);
      scrim.classList.toggle('is-visible', state);
      document.body.classList.toggle('nav-open', state);
      toggle.setAttribute('aria-expanded', state ? 'true' : 'false');
      menu.setAttribute('aria-hidden', state ? 'false' : 'true');
      if (state) {
        closeBtn?.focus();
      } else if (document.activeElement && menu.contains(document.activeElement)) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(false);
      });
    }

    scrim.addEventListener('click', () => toggleMenu(false));

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) toggleMenu(false);
    });

    document.addEventListener('click', e => {
      if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && menu.classList.contains('is-open')) toggleMenu(false);
    });

    // Update cart badge
    if (typeof KartikCart !== 'undefined') {
      KartikCart.updateBadge();
    }
    window.addEventListener('kartikCartUpdated', () => {
      if (typeof KartikCart !== 'undefined') KartikCart.updateBadge();
    });
  }

  // Universal Quiet Luxury Footer Builder (ensures 100% interconnected pages)
  function buildFooter() {
    let footer = document.querySelector('footer.footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.className = 'footer';
      document.body.appendChild(footer);
    }

    const year = new Date().getFullYear();

    footer.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <!-- Brand Column -->
          <div class="footer-brand">
            <a href="index.html" class="brand" aria-label="Kartik Watch Shop Home">
              <svg class="brand-symbol" viewBox="0 0 40 40" width="36" height="36" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="19" stroke="url(#kGoldFooter)" stroke-width="1.5"/>
                <rect x="17.5" y="0.5" width="5" height="3" rx="1" fill="url(#kGoldFooter)"/>
                <circle cx="20" cy="20" r="15.5" stroke="url(#kGoldFooter)" stroke-width="0.8" stroke-dasharray="1.2 2"/>
                <text x="20" y="25.5" font-family="Georgia,serif" font-size="15" font-weight="700" fill="url(#kGoldFooter)" text-anchor="middle" letter-spacing="-1">K</text>
                <defs>
                  <linearGradient id="kGoldFooter" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#F2E5CE"/>
                    <stop offset="40%" stop-color="#E2C384"/>
                    <stop offset="70%" stop-color="#C5A059"/>
                    <stop offset="100%" stop-color="#8A6828"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="brand-text">
                <span class="brand-title">KARTIK</span>
                <span class="brand-sub">MEHSANA &bull; EST. 1998</span>
              </div>
            </a>
            <p class="footer-tagline">
              Mehsana's premier luxury horology destination for Swiss &amp; Japanese timepieces, certified servicing, and master atelier restoration.
            </p>
            <div class="footer-contact-info">
              <div>📍 Radhanpur Road, Mehsana, Gujarat 384002</div>
              <div>📞 +91 98250 12345 &bull; ✉️ contact@kartikwatches.in</div>
            </div>
          </div>

          <!-- Links Grid: All 8 Pages Interconnected -->
          <div class="footer-links-grid">
            <!-- 1. All Pages -->
            <div class="footer-col">
              <h4 class="footer-heading">Boutique Pages</h4>
              <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="collections.html">Watch Collections (31)</a></li>
                <li><a href="services.html">Horology Services</a></li>
                <li><a href="sell.html">Sell Your Watch</a></li>
                <li><a href="cart.html">Shopping Bag &amp; Cart</a></li>
                <li><a href="payment.html">Secure Checkout</a></li>
                <li><a href="auth.html">VIP Concierge / Login</a></li>
                <li><a href="/api/health" target="_blank" class="footer-health-link">⚙ API Health Check</a></li>
              </ul>
            </div>

            <!-- 2. Top Brands -->
            <div class="footer-col">
              <h4 class="footer-heading">Iconic Brands</h4>
              <ul>
                <li><a href="collections.html?brand=seiko">Seiko Precision</a></li>
                <li><a href="collections.html?brand=citizen">Citizen Eco-Drive</a></li>
                <li><a href="collections.html?brand=tissot">Tissot Swiss Made</a></li>
                <li><a href="collections.html?brand=casio">Casio &amp; G-Shock</a></li>
                <li><a href="collections.html?brand=hamilton">Hamilton Swiss</a></li>
              </ul>
            </div>

            <!-- 3. Atelier Services -->
            <div class="footer-col">
              <h4 class="footer-heading">Atelier Services</h4>
              <ul>
                <li><a href="services.html#services">Mechanical Calibration</a></li>
                <li><a href="services.html#services">Full Movement Overhaul</a></li>
                <li><a href="services.html#services">Battery &amp; Pressure Test</a></li>
                <li><a href="services.html#services">Laser Custom Engraving</a></li>
                <li><a href="services.html#services">Water Resistance 300m</a></li>
              </ul>
            </div>

            <!-- 4. Client Care & Hours -->
            <div class="footer-col">
              <h4 class="footer-heading">Hours &amp; Care</h4>
              <ul>
                <li><span class="footer-hours-strong">Mon &ndash; Sat:</span> 10:00 AM &ndash; 8:30 PM</li>
                <li><span class="footer-hours-gold">Sunday:</span> By Appointment</li>
                <li><a href="services.html#faq">Warranty &amp; Authenticity</a></li>
                <li><a href="sell.html#sell-form">Instant Watch Valuation</a></li>
                <li><a href="services.html#services">Laser Engraving &amp; Care</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; ${year} Kartik Watch Shop Mehsana. All rights reserved. Quiet Luxury Horology.</p>
          <p class="footer-credit">Handcrafted Precision &bull; 100% Genuine Timepieces Guaranteed</p>
        </div>
      </div>
    `;
  }

  function init() {
    buildNav();
    buildFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
