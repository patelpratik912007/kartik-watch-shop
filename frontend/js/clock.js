/**
 * Kartik Watch Shop — Real-Time High-Beat Horology Analog Clock Script
 * Optimized for Low-Spec & No-GPU Devices:
 * - IntersectionObserver pauses the animation loop when scrolled out of viewport (0% CPU idle).
 * - Page Visibility API halts the loop when the browser tab is hidden.
 * - Composite-only CSS transforms prevent unnecessary layout recalcs or paint overhead.
 */

document.addEventListener('DOMContentLoaded', () => {
  const clockWrapper = document.querySelector('.hero-clock-wrapper');
  const hourHand = document.getElementById('hourHand');
  const minuteHand = document.getElementById('minuteHand');
  const secondHand = document.getElementById('secondHand');

  if (!hourHand || !minuteHand || !secondHand) return;

  let isClockVisible = true;
  let isTabActive = !document.hidden;
  let animationFrameId = null;

  function updateClockSmooth() {
    if (!isClockVisible || !isTabActive) {
      animationFrameId = null;
      return;
    }

    const now = new Date();
    const ms = now.getMilliseconds();
    const seconds = now.getSeconds() + ms / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    // Calculate rotation angles
    const secondDeg = seconds * 6; // 360 / 60
    const minuteDeg = minutes * 6; // 360 / 60
    const hourDeg = hours * 30;    // 360 / 12

    secondHand.style.transform = `rotate(${secondDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;

    animationFrameId = requestAnimationFrame(updateClockSmooth);
  }

  function startClockLoop() {
    if (!animationFrameId && isClockVisible && isTabActive) {
      animationFrameId = requestAnimationFrame(updateClockSmooth);
    }
  }

  function stopClockLoop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // 1. Intersection Observer for Low-Spec Battery/CPU Preservation
  if ('IntersectionObserver' in window && clockWrapper) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isClockVisible = entry.isIntersecting;
        if (isClockVisible) {
          startClockLoop();
        } else {
          stopClockLoop();
        }
      });
    }, { threshold: 0.05 });

    observer.observe(clockWrapper);
  } else {
    // Fallback if IntersectionObserver is not supported on legacy browser
    startClockLoop();
  }

  // 2. Tab Visibility Listener
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive && isClockVisible) {
      startClockLoop();
    } else {
      stopClockLoop();
    }
  });

  // Initial Start
  startClockLoop();
});
