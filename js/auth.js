// js/auth.js

function showAuthModal() {
  const modal = new bootstrap.Modal(document.getElementById('authModal'));
  modal.show();
}

function hideAuthModal() {
  const modalEl = document.getElementById('authModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 5px;
    color: white; font-weight: bold; z-index: 2000; transition: opacity 0.3s ease;
    ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

// Check user status and update UI
function checkUserStatus() {
  fetch('/api/user')
    .then(res => res.json())
    .then(data => {
      const userStatus = document.getElementById('user-status');
      const loginBtn = document.getElementById('login-btn');
      const logoutBtn = document.getElementById('logout-btn');
      const adminLink = document.getElementById('admin-link');
      if (data.logged_in) {
        userStatus.innerHTML = `👤 ${data.username} ${data.is_admin ? '<span class="admin-badge">Admin</span>' : ''}`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = '';
        adminLink.style.display = data.is_admin ? '' : 'none';
        updateDemoVisibility(true);
      } else {
        userStatus.innerHTML = '';
        loginBtn.style.display = '';
        logoutBtn.style.display = 'none';
        adminLink.style.display = 'none';
        updateDemoVisibility(false);
      }
    });
}

// Login form handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotification('Login successful!', 'success');
          hideAuthModal();
          checkUserStatus();
        } else {
          showNotification(data.error || 'Login failed', 'error');
        }
      });
  });
}

// Register form handler
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotification('Registration successful! Please log in.', 'success');
          document.getElementById('login-tab').click();
        } else {
          showNotification(data.error || 'Registration failed', 'error');
        }
      });
  });
}

// Logout handler
function logoutUser() {
  fetch('/api/logout', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      showNotification('Logged out successfully.', 'success');
      checkUserStatus();
    });
}

// Expose for main page
window.checkUserStatus = checkUserStatus;
window.logoutUser = logoutUser;
window.showAuthModal = showAuthModal; 