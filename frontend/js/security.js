/**
 * Kartik Watch Shop — Frontend Security Engine
 * Safeguards boutique application against XSS injection, DOM tampering, and storage attacks.
 */

window.KartikSecurity = (function() {
  'use strict';

  /**
   * Escape HTML entities to prevent Cross-Site Scripting (XSS).
   * @param {string} str - Raw input text
   * @returns {string} Sanitized string safe for DOM interpolation
   */
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  /**
   * Strip HTML tags and script/style definitions entirely.
   * @param {string} htmlString - Raw HTML input
   * @returns {string} Plain text with no HTML tags
   */
  function stripTags(htmlString) {
    if (!htmlString) return '';
    return String(htmlString)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, '');
  }

  /**
   * Clean price input to guarantee valid positive number.
   * @param {number|string} val - Input price
   * @returns {number} Validated positive number or 0
   */
  function sanitizePrice(val) {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) return 0;
    return Math.round(num * 100) / 100;
  }

  /**
   * Secure LocalStorage get wrapper with JSON parse protection.
   * @param {string} key
   * @param {*} defaultVal
   */
  function getSafeStorage(key, defaultVal = null) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultVal;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`[Security] Storage parse error for "${key}". Reverting to default.`);
      return defaultVal;
    }
  }

  /**
   * Secure LocalStorage set wrapper with size/error protection.
   * @param {string} key
   * @param {*} val
   */
  function setSafeStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.error(`[Security] Storage write error for "${key}":`, e);
      return false;
    }
  }

  return {
    escapeHTML,
    stripTags,
    sanitizePrice,
    getSafeStorage,
    setSafeStorage
  };
})();
