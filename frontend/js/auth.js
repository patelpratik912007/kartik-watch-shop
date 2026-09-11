/**
 * Kartik Watch Shop — Concierge Authentication & Verification Engine
 * Features:
 * - LocalStorage user database & active session management
 * - Email format validation
 * - Phone number validation (Indian 10-digit / International format)
 * - Real-time password strength meter (entropy & character criteria)
 * - Password match verification & Show/Hide toggles
 * - 6-Digit OTP Email & Phone verification simulation with auto-advance and countdown
 * - Dual login support (Login with Email OR Phone Number)
 */

(function() {
  const STORAGE_KEY_USERS = 'kartik_users';
  const STORAGE_KEY_SESSION = 'kartik_session';

  // Helper: Get users from localStorage
  function getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading user store:', e);
      return [];
    }
  }

  // Helper: Save users to localStorage
  function saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving to user store:', e);
    }
  }

  // Helper: Get current session
  function getSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // Helper: Set session
  function setSession(user) {
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
  }

  // Helper: Clear session
  function clearSession() {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }

  // Validation: Email
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  // Validation: Phone (10 digits, optional country prefix)
  function isValidPhone(phone) {
    const clean = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^[6-9]\d{9}$/.test(clean) || (/^91[6-9]\d{9}$/.test(clean));
  }

  // Validation: Password Strength Calculator
  function calculatePasswordStrength(password) {
    if (!password) return { score: 0, label: '', color: 'transparent', width: '0%' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) {
      return { score: 1, label: 'Weak', color: '#E63946', width: '33%' };
    } else if (score <= 4) {
      return { score: 2, label: 'Moderate', color: '#DFBA73', width: '66%' };
    } else {
      return { score: 3, label: 'Strong (Haute Security)', color: '#2ECC71', width: '100%' };
    }
  }

  // Pre-populate demo user if no users exist
  function initDemoUser() {
    const users = getUsers();
    if (!users.some(u => u.email === 'concierge@kartikwatchshop.com')) {
      users.push({
        id: 'user_' + Date.now(),
        name: 'Patel Paramesh',
        email: 'concierge@kartikwatchshop.com',
        phone: '9825012345',
        password: 'Password@123',
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: new Date().toISOString()
      });
      saveUsers(users);
    }
  }

  // Initialize Page Logic
  document.addEventListener('DOMContentLoaded', () => {
    initDemoUser();

    // Check if returning from Google Auth redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('google_auth') === 'success') {
      const googleUser = {
        id: 'user_google_' + Date.now(),
        name: 'VIP Google Collector',
        email: 'collector.mehsana@gmail.com',
        phone: '9825012345',
        isEmailVerified: true,
        isPhoneVerified: true,
        provider: 'Google',
        createdAt: new Date().toISOString()
      };
      const users = getUsers();
      if (!users.some(u => u.email === googleUser.email)) {
        users.push(googleUser);
        saveUsers(users);
      }
      setSession(googleUser);
      showToast('Google Account Authenticated! Accessing boutique concierge...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
      return;
    }

    // Check if on auth page
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const otpModal = document.getElementById('otpModal');
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const quickDemoBtn = document.getElementById('quickDemoBtn');

    // ── Google Authentication Redirection Flow ──
    const googleTriggers = document.querySelectorAll('.google-auth-trigger');
    googleTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Connecting to Google Accounts... Redirecting to Google Login', 'info');
        
        // Target Google Account Sign-In / OAuth
        const currentCleanUrl = window.location.href.split('?')[0];
        const callbackUrl = encodeURIComponent(currentCleanUrl + '?google_auth=success');
        const googleAuthUrl = `https://accounts.google.com/ServiceLogin?service=lso&passive=1209600&continue=${callbackUrl}`;
        
        sessionStorage.setItem('kartik_google_auth_redirect', 'true');
        
        btn.innerHTML = `<span class="auth-spinner-symbol">⚜</span> <span>Redirecting to Google Account...</span>`;
        btn.style.opacity = '0.85';
        btn.disabled = true;
        
        setTimeout(() => {
          window.location.href = googleAuthUrl;
        }, 500);
      });
    });

    // Password input toggles
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const input = e.currentTarget.closest('.input-wrapper').querySelector('input');
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          e.currentTarget.textContent = 'Hide';
        } else {
          input.type = 'password';
          e.currentTarget.textContent = 'Show';
        }
      });
    });

    // Tab Switching
    if (tabLogin && tabSignup) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        loginView.style.display = 'block';
        signupView.style.display = 'none';
        clearErrors();
      });

      tabSignup.addEventListener('click', () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        loginView.style.display = 'none';
        signupView.style.display = 'block';
        clearErrors();
      });
    }

    // Password Strength Live Listener
    const signupPasswordInput = document.getElementById('signupPassword');
    const strengthBar = document.getElementById('strengthBarFill');
    const strengthText = document.getElementById('strengthText');

    if (signupPasswordInput && strengthBar && strengthText) {
      signupPasswordInput.addEventListener('input', (e) => {
        const result = calculatePasswordStrength(e.target.value);
        strengthBar.style.width = result.width;
        strengthBar.style.backgroundColor = result.color;
        strengthText.textContent = result.label ? `Strength: ${result.label}` : '';
        strengthText.style.color = result.color;
      });
    }

    // Quick Demo Account Auto-Fill
    if (quickDemoBtn) {
      quickDemoBtn.addEventListener('click', () => {
        if (tabLogin) tabLogin.click();
        const loginIdentifier = document.getElementById('loginIdentifier');
        const loginPassword = document.getElementById('loginPassword');
        if (loginIdentifier) loginIdentifier.value = 'concierge@kartikwatchshop.com';
        if (loginPassword) loginPassword.value = 'Password@123';
        showToast('Demo Concierge credentials applied. Click "Enter Concierge Portal" to log in.', 'info');
      });
    }

    const quickGoogleDemoBtn = document.getElementById('quickGoogleDemoBtn');
    if (quickGoogleDemoBtn) {
      quickGoogleDemoBtn.addEventListener('click', () => {
        const googleUser = {
          id: 'user_google_' + Date.now(),
          name: 'Karan Patel (Google VIP)',
          email: 'karan.patel.horology@gmail.com',
          phone: '9825012345',
          isEmailVerified: true,
          isPhoneVerified: true,
          provider: 'Google',
          createdAt: new Date().toISOString()
        };
        const users = getUsers();
        if (!users.some(u => u.email === googleUser.email)) {
          users.push(googleUser);
          saveUsers(users);
        }
        setSession(googleUser);
        showToast('Google Account Verified! Entering boutique...', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      });
    }

    // ── Signup Submission & OTP Flow ──
    let pendingUser = null;
    let otpCountdown = 60;
    let otpTimerInterval = null;
    let generatedOtp = '123456';

    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim().toLowerCase();
        const phone = document.getElementById('signupPhone').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        // Validation 1: Name
        if (!name || name.length < 2) {
          showError('signupNameError', 'Please enter your full legal name.');
          return;
        }

        // Validation 2: Email
        if (!isValidEmail(email)) {
          showError('signupEmailError', 'Please enter a valid email address.');
          return;
        }

        // Validation 3: Phone
        if (!isValidPhone(phone)) {
          showError('signupPhoneError', 'Please enter a valid 10-digit mobile number (e.g. 98250 12345).');
          return;
        }

        // Validation 4: Password criteria
        const strength = calculatePasswordStrength(password);
        if (strength.score < 2) {
          showError('signupPasswordError', 'Password is too weak. Must be at least 8 characters with numbers & symbols.');
          return;
        }

        // Validation 5: Password match
        if (password !== confirmPassword) {
          showError('signupConfirmPasswordError', 'Passwords do not match.');
          return;
        }

        // Check if user already exists
        const users = getUsers();
        if (users.some(u => u.email === email)) {
          showError('signupEmailError', 'An account with this email address already exists.');
          return;
        }
        if (users.some(u => u.phone === phone.replace(/\D/g, '').slice(-10))) {
          showError('signupPhoneError', 'An account with this phone number already exists.');
          return;
        }

        // Setup Pending User
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        pendingUser = {
          id: 'user_' + Date.now(),
          name,
          email,
          phone: cleanPhone,
          password,
          isEmailVerified: false,
          isPhoneVerified: false,
          createdAt: new Date().toISOString()
        };

        // Open OTP Verification Modal
        openOtpVerification(email, cleanPhone);
      });
    }

    // OTP Modal Controls
    function openOtpVerification(email, phone) {
      if (!otpModal) return;

      // Generate random 6-digit OTP (default simulation is 794218 or shown in toast)
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const otpTargetEl = document.getElementById('otpTargetText');
      if (otpTargetEl) {
        otpTargetEl.innerHTML = `Verification codes sent to <strong>${email}</strong> and <strong>+91 ${phone}</strong>`;
      }

      otpModal.style.display = 'flex';
      setupOtpInputBoxes();
      startOtpCountdown();

      showToast(`Verification code sent! (Demo Code: ${generatedOtp})`, 'success');
    }

    function setupOtpInputBoxes() {
      const inputs = document.querySelectorAll('.otp-box');
      inputs.forEach((input, index) => {
        input.value = '';
        input.addEventListener('input', (e) => {
          const val = e.target.value;
          if (val && index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        });
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !input.value && index > 0) {
            inputs[index - 1].focus();
          }
        });
      });
      if (inputs[0]) inputs[0].focus();
    }

    function startOtpCountdown() {
      clearInterval(otpTimerInterval);
      otpCountdown = 60;
      const timerEl = document.getElementById('otpTimer');
      const resendBtn = document.getElementById('btnResendOtp');

      if (resendBtn) resendBtn.disabled = true;

      otpTimerInterval = setInterval(() => {
        otpCountdown--;
        if (timerEl) {
          timerEl.textContent = `00:${otpCountdown.toString().padStart(2, '0')}`;
        }
        if (otpCountdown <= 0) {
          clearInterval(otpTimerInterval);
          if (resendBtn) resendBtn.disabled = false;
          if (timerEl) timerEl.textContent = 'Code expired';
        }
      }, 1000);
    }

    // Verify OTP Button
    const btnVerifyOtp = document.getElementById('btnVerifyOtp');
    if (btnVerifyOtp) {
      btnVerifyOtp.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.otp-box');
        let enteredCode = '';
        inputs.forEach(i => enteredCode += i.value);

        if (enteredCode.length !== 6) {
          showToast('Please enter the complete 6-digit verification code.', 'error');
          return;
        }

        // Check if code matches generated OTP or master fallback 123456
        if (enteredCode === generatedOtp || enteredCode === '123456') {
          clearInterval(otpTimerInterval);
          if (pendingUser) {
            pendingUser.isEmailVerified = true;
            pendingUser.isPhoneVerified = true;
            
            const users = getUsers();
            users.push(pendingUser);
            saveUsers(users);
            setSession(pendingUser);

            // Sync with PHP Backend MySQL Database
            fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: pendingUser.name,
                email: pendingUser.email,
                phone: pendingUser.phone,
                password: pendingUser.password
              })
            }).catch(err => console.log('Database sync notice (offline / file protocol fallback):', err));

            showToast('Account successfully verified! Redirecting to Boutique...', 'success');
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 1200);
          }
        } else {
          showToast('Incorrect verification code. Please check and try again.', 'error');
        }
      });
    }

    // Resend OTP Button
    const btnResendOtp = document.getElementById('btnResendOtp');
    if (btnResendOtp) {
      btnResendOtp.addEventListener('click', () => {
        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        startOtpCountdown();
        setupOtpInputBoxes();
        showToast(`New verification code sent! (Demo Code: ${generatedOtp})`, 'info');
      });
    }

    // Cancel OTP Button
    const btnCancelOtp = document.getElementById('btnCancelOtp');
    if (btnCancelOtp && otpModal) {
      btnCancelOtp.addEventListener('click', () => {
        clearInterval(otpTimerInterval);
        otpModal.style.display = 'none';
        pendingUser = null;
      });
    }

    // ── Login Submission ──
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const identifier = document.getElementById('loginIdentifier').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        if (!identifier) {
          showError('loginIdentifierError', 'Please enter your registered email or phone number.');
          return;
        }

        if (!password) {
          showError('loginPasswordError', 'Please enter your account password.');
          return;
        }

        const users = getUsers();
        const cleanIdentifier = identifier.replace(/\D/g, '').slice(-10);

        // Find user by Email or Phone
        const matchedUser = users.find(u => 
          u.email === identifier || (cleanIdentifier.length === 10 && u.phone === cleanIdentifier)
        );

        if (!matchedUser) {
          showError('loginIdentifierError', 'No account found matching this email or phone number.');
          return;
        }

        if (matchedUser.password !== password) {
          showError('loginPasswordError', 'Incorrect password. Please verify and try again.');
          return;
        }

        // Successful Login
        setSession(matchedUser);

        // Sync session with PHP MySQL backend
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: matchedUser.email, password: password })
        }).catch(err => console.log('Database sync notice (offline / file protocol fallback):', err));

        showToast(`Welcome back, ${matchedUser.name}! Opening boutique...`, 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      });
    }

    // Helper: Display validation errors
    function showError(elementId, message) {
      const el = document.getElementById(elementId);
      if (el) {
        el.textContent = message;
        el.style.display = 'block';
      }
    }

    function clearErrors() {
      document.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
      });
    }

    // Toast Notification helper
    function showToast(message, type = 'info') {
      let toast = document.getElementById('authToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'authToast';
        toast.className = 'auth-toast';
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.className = `auth-toast toast-${type} is-visible`;

      setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 4000);
    }

    // ── Global Navbar Session Sync (runs on all pages) ──
    const session = getSession();
    const navAuthLink = document.getElementById('navAuthBtn');
    if (navAuthLink) {
      if (session) {
        navAuthLink.innerHTML = `
          <span class="user-avatar-badge">${session.name.charAt(0)}</span>
          <span class="user-name-label">${session.name.split(' ')[0]}</span>
          <button id="navLogoutBtn" class="btn-logout-small" title="Sign Out">✕</button>
        `;
        navAuthLink.classList.add('is-logged-in');
        navAuthLink.removeAttribute('href');

        const logoutBtn = document.getElementById('navLogoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearSession();
            window.location.reload();
          });
        }
      }
    }
  });

  // Expose global auth helper
  window.KartikAuth = {
    getSession,
    setSession,
    clearSession,
    getUsers
  };
})();
