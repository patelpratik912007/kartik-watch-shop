/**
 * Kartik Watch Shop — Navigation & Dynamic Utilities Script
 * Handles mobile hamburger toggle, auto-close behavior, and copyright year.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation is owned by shared-nav.js. Keep this legacy file only for pages
  // that still include it and need an automatically updated copyright year.
  document.querySelectorAll('#year').forEach(year => {
    year.textContent = new Date().getFullYear();
  });
});
