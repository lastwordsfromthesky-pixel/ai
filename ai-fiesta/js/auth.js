// Toast Notification System
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Tab Switching for Auth Page
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update underline position
    const underline = document.querySelector('.tab-underline');
    const tabIndex = Array.from(document.querySelectorAll('.tab-btn')).indexOf(btn);
    underline.style.transform = `translateX(calc(${tabIndex} * 100%))`;
    
    // Update active form
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    if (tab === 'signin') {
      document.getElementById('signin-form').classList.add('active');
    } else {
      document.getElementById('signup-form').classList.add('active');
    }
  });
});

// Password Toggle
document.querySelectorAll('.password-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? '👁️‍🗨️' : '👁️';
  });
});

// Sign In Form
if (document.getElementById('signin-form')) {
  document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;
    
    if (!email || !password) {
      showToast('❌ Please fill in all fields', 'error');
      return;
    }
    
    try {
      await auth.signInWithEmailAndPassword(email, password);
      showToast('✅ Signed in successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    } catch (error) {
      const errorMessages = {
        'auth/user-not-found': 'User not found. Please sign up first.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many failed login attempts. Please try again later.'
      };
      const message = errorMessages[error.code] || `❌ Error: ${error.message}`;
      showToast(message, 'error');
    }
  });

  // Google Sign In
  document.getElementById('signin-google').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithPopup(provider);
      showToast('✅ Google sign in successful!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    } catch (error) {
      showToast(`❌ Error: ${error.message}`, 'error');
    }
  });

  // Forgot Password
  document.getElementById('forgot-password-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    
    if (!email) {
      showToast('❌ Please enter your email first', 'error');
      return;
    }
    
    try {
      await auth.sendPasswordResetEmail(email);
      showToast('📧 Password reset email sent! Check your inbox.', 'success');
    } catch (error) {
      showToast(`❌ Error: ${error.message}`, 'error');
    }
  });
}

// Sign Up Form
if (document.getElementById('signup-form')) {
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    if (!name || !email || !password || !confirm) {
      showToast('❌ Please fill in all fields', 'error');
      return;
    }
    
    if (password !== confirm) {
      showToast('❌ Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 6) {
      showToast('❌ Password must be at least 6 characters', 'error');
      return;
    }
    
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      await result.user.updateProfile({ displayName: name });
      showToast('✅ Account created successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    } catch (error) {
      const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/weak-password': 'Password is too weak. Please use a stronger password.',
        'auth/operation-not-allowed': 'Sign up is currently disabled.'
      };
      const message = errorMessages[error.code] || `❌ Error: ${error.message}`;
      showToast(message, 'error');
    }
  });

  // Google Sign Up
  document.getElementById('signup-google').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithPopup(provider);
      showToast('✅ Account created successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    } catch (error) {
      showToast(`❌ Error: ${error.message}`, 'error');
    }
  });
}

// Auth State Observer
auth.onAuthStateChanged((user) => {
  const isAuthPage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/index.html';
  const isDashboard = window.location.pathname.includes('dashboard.html');
  
  if (user) {
    // User is logged in
    if (isAuthPage) {
      window.location.href = 'dashboard.html';
    }
  } else {
    // User is not logged in
    if (isDashboard || (!isAuthPage && !isDashboard && !window.location.pathname.includes('vercel.json'))) {
      window.location.href = 'index.html';
    }
  }
});

// Logout
if (document.getElementById('logout-btn')) {
  document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
      await auth.signOut();
      showToast('👋 Logged out successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    } catch (error) {
      showToast(`❌ Error: ${error.message}`, 'error');
    }
  });
}
