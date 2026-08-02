/* ============================================
   VISITORS LOGIN SYSTEM - Admin Dashboard
   Authentication, data table, search, CRUD via API
   ============================================ */

(function () {
  'use strict';

  // ─── Configuration ──────────────────────────
  const API_URL = 'https://script.google.com/macros/s/AKfycbxs9sE5s0jaNhpvMxChC-i79h9h3NuUBQo_NQSqdQwPpgWpgpMc_Pw5BBxFT5ZTCtSvzQ/exec';

  // ─── Admin PIN (simple auth) ────────────
  const ADMIN_PIN = '12345';
  const AUTH_KEY = 'admin_authenticated';

  // ─── DOM References ────────────────────
  const authOverlay = document.getElementById('authOverlay');
  const pinInput = document.getElementById('pinInput');
  const authError = document.getElementById('authError');
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const backBtn = document.getElementById('backBtn');
  const adminMain = document.getElementById('adminMain');
  const totalTodayEl = document.getElementById('totalToday');
  const onSiteEl = document.getElementById('onSite');
  const recentEntryEl = document.getElementById('recentEntry');
  const searchInput = document.getElementById('searchInput');
  const filterTabs = document.querySelectorAll('[data-filter]');
  const viewTabs = document.querySelectorAll('[data-view]');
  const tableBody = document.querySelector('#visitorsTable tbody');
  const employeesTableBody = document.querySelector('#employeesTable tbody');
  const emptyState = document.getElementById('emptyState');
  const emptyStateEmployees = document.getElementById('emptyStateEmployees');
  const overrideForm = document.getElementById('overrideForm');
  const overrideToggle = document.querySelector('.override-header');
  const overrideBody = document.querySelector('.override-body');
  const overrideToggleIcon = document.querySelector('.override-toggle');
  const toast = document.getElementById('toast');

  let currentFilter = 'all';
  let currentView = 'visitors';
  let visitorsCache = [];
  let employeesCache = [];

  // ─── Auth Check ─────────────────────────
  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  function requireAuth() {
    if (!isAuthenticated()) {
      authOverlay.style.display = 'flex';
      adminMain.style.display = 'none';
      return false;
    }
    authOverlay.style.display = 'none';
    adminMain.style.display = 'block';
    return true;
  }

  // ─── Authentication ─────────────────────
  function handleAuth() {
    const pin = pinInput.value.trim();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      authOverlay.style.display = 'none';
      adminMain.style.display = 'block';
      authError.classList.remove('visible');
      pinInput.value = '';
      renderDashboard();
    } else {
      authError.classList.add('visible');
      pinInput.classList.add('error');
      pinInput.value = '';
      pinInput.focus();
      setTimeout(() => {
        authError.classList.remove('visible');
        pinInput.classList.remove('error');
      }, 2500);
    }
  }

  authBtn.addEventListener('click', handleAuth);
  pinInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleAuth();
  });

  // ─── Logout ─────────────────────────────
  logoutBtn.addEventListener('click', function () {
    sessionStorage.removeItem(AUTH_KEY);
    adminMain.style.display = 'none';
    authOverlay.style.display = 'flex';
    pinInput.value = '';
    pinInput.focus();
  });

  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });

  // ─── Toast Notification ─────────────────
  function showToast(message, type) {
    const icon = type === 'error' ? '❌' : '✅';
    toast.innerHTML = `${icon} ${message}`;
    toast.className = `toast ${type || ''}`;
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // ─── API Helpers ──────────────────────────

  // Fetch visitors from the API
  async function fetchVisitors(search, filter) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filter && filter !== 'all') params.set('filter', filter);

    const queryString = params.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    const result = await response.json();

    if (result.status === 'error') {
      throw new Error(result.message || 'API error');
    }

    return result.data || [];
  }

  // Fetch employees from the API
  async function fetchEmployees(search) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    const url = `${API_URL}?action=employees&${params.toString()}`;

    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    const result = await response.json();

    if (result.status === 'error') {
      throw new Error(result.message || 'API error');
    }

    return result.data || [];
  }

  // Send a write command to the API
  async function sendAction(payload) {
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  // ─── Helpers ────────────────────────────
  function formatTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function isToday(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  }

  function timeAgo(isoString) {
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  // ─── Escape HTML ─────────────────────────
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ─── Render Stats ───────────────────────
  function renderStats(visitors) {
    const totalToday = visitors.filter(v => isToday(v.timestamp)).length;
    const onSite = visitors.filter(v => v.status === 'checked-in').length;
    const recent = visitors.length > 0 ? visitors[0] : null;

    totalTodayEl.textContent = totalToday;
    onSiteEl.textContent = onSite;

    if (recent && isToday(recent.timestamp)) {
      recentEntryEl.textContent = `${recent.fullName.split(' ')[0]} · ${timeAgo(recent.timestamp)}`;
    } else if (visitors.length > 0) {
      recentEntryEl.textContent = 'No entries today';
    } else {
      recentEntryEl.textContent = 'No data yet';
    }
  }

  // ─── Render Visitors Table ─────────────
  function renderVisitorsTable() {
    const tableEl = document.querySelector('#visitorsTable tbody');
    const emptyEl = document.getElementById('emptyState');

    if (visitorsCache.length === 0) {
      tableEl.innerHTML = '';
      emptyEl.style.display = 'block';
      return;
    }

    emptyEl.style.display = 'none';

    tableEl.innerHTML = visitorsCache.map(v => `
      <tr>
        <td><span class="visitor-id">${escapeHtml(v.idNumber || '—')}</span></td>
        <td><strong>${escapeHtml(v.fullName)}</strong></td>
        <td>${escapeHtml(v.contactNumber)}</td>
        <td>${escapeHtml(v.contactPerson)}</td>
        <td>${escapeHtml(v.purpose)}</td>
        <td>
          <span class="badge badge--${v.status === 'checked-in' ? 'checked-in' : 'checked-out'}">
            ${v.status === 'checked-in' ? 'On-site' : 'Left'}
          </span>
        </td>
        <td>${formatTime(v.timestamp)}</td>
        <td>
          ${v.status === 'checked-in'
            ? `<button class="action-btn action-btn--checkout" data-id="${escapeHtml(v.id)}">Check Out</button>`
            : `<button class="action-btn action-btn--delete" data-id="${escapeHtml(v.id)}">Delete</button>`
          }
        </td>
      </tr>
    `).join('');

    tableEl.querySelectorAll('.action-btn--checkout').forEach(btn => {
      btn.addEventListener('click', function () {
        checkoutVisitor(this.dataset.id);
      });
    });

    tableEl.querySelectorAll('.action-btn--delete').forEach(btn => {
      btn.addEventListener('click', function () {
        deleteVisitor(this.dataset.id);
      });
    });
  }

  // ─── Render Employees Table ─────────────
  function renderEmployeesTable() {
    if (employeesCache.length === 0) {
      employeesTableBody.innerHTML = '';
      emptyStateEmployees.style.display = 'block';
      return;
    }

    emptyStateEmployees.style.display = 'none';

    employeesTableBody.innerHTML = employeesCache.map(e => `
      <tr>
        <td><span class="visitor-id">${escapeHtml(e.employeeId || '—')}</span></td>
        <td><strong>${escapeHtml(e.fullName)}</strong></td>
        <td>${escapeHtml(e.department)}</td>
        <td><span class="badge badge--employee">${escapeHtml(e.type || 'Employee')}</span></td>
        <td>
          <span class="badge badge--${e.status === 'Time-in' ? 'checked-in' : 'checked-out'}">
            ${e.status === 'Time-in' ? 'On-site' : 'Left'}
          </span>
        </td>
        <td>${formatTime(e.timestamp)}</td>
        <td>
          <button class="action-btn action-btn--delete-employee" data-id="${escapeHtml(e.id)}">Delete</button>
        </td>
      </tr>
    `).join('');

    employeesTableBody.querySelectorAll('.action-btn--delete-employee').forEach(btn => {
      btn.addEventListener('click', function () {
        deleteEmployee(this.dataset.id);
      });
    });
  }

  // ─── Check Out Visitor ──────────────────
  async function checkoutVisitor(id) {
    const visitor = visitorsCache.find(v => v.id === id);
    if (!visitor) return;

    if (confirm(`Check out "${visitor.fullName}"?`)) {
      try {
        await sendAction({ action: 'checkout', id });
        showToast(`${visitor.fullName.split(' ')[0]} has been checked out.`, 'success');
        if (currentView === 'visitors') await renderDashboard();
      } catch (err) {
        showToast('Failed to check out. Please try again.', 'error');
      }
    }
  }

  // ─── Delete Visitor ─────────────────────
  async function deleteVisitor(id) {
    const visitor = visitorsCache.find(v => v.id === id);
    if (!visitor) return;

    if (confirm(`Delete entry for "${visitor.fullName}"? This cannot be undone.`)) {
      try {
        await sendAction({ action: 'delete', id });
        showToast(`Entry deleted.`, 'success');
        if (currentView === 'visitors') await renderDashboard();
      } catch (err) {
        showToast('Failed to delete. Please try again.', 'error');
      }
    }
  }

  // ─── Delete Employee ────────────────────
  async function deleteEmployee(id) {
    const employee = employeesCache.find(e => e.id === id);
    if (!employee) return;

    if (confirm(`Delete entry for "${employee.fullName}"? This cannot be undone.`)) {
      try {
        await sendAction({ action: 'empDelete', id });
        showToast(`Employee entry deleted.`, 'success');
        await renderDashboard();
      } catch (err) {
        showToast('Failed to delete. Please try again.', 'error');
      }
    }
  }

  // ─── Manual Override ────────────────────
  overrideToggle.addEventListener('click', function () {
    overrideBody.classList.toggle('open');
    overrideToggleIcon.classList.toggle('open');
  });

  overrideForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('overrideName').value.trim();
    const contact = document.getElementById('overrideContact').value.trim();
    const person = document.getElementById('overridePerson').value;
    const purposeVal = document.getElementById('overridePurpose').value;

    if (!name || !contact || !person || !purposeVal) {
      showToast('Please fill in all override fields.', 'error');
      return;
    }

    try {
      await sendAction({
        action: 'checkin',
        fullName: name,
        contactNumber: contact,
        contactPerson: person,
        purpose: purposeVal
      });

      showToast(`Manually added "${name}"`, 'success');
      overrideForm.reset();
      if (currentView === 'visitors') await renderDashboard();
    } catch (err) {
      showToast('Failed to add visitor. Please try again.', 'error');
    }
  });

  // ─── Search Input (debounced) ────────────
  let searchTimeout;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      await fetchAndRender();
    }, 300);
  });

  // ─── Filter Tabs ─────────────────────────
  filterTabs.forEach(tab => {
    tab.addEventListener('click', async function () {
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      if (currentView === 'visitors') await fetchAndRender();
    });
  });

  // ─── View Toggle ─────────────────────────
  viewTabs.forEach(tab => {
    tab.addEventListener('click', async function () {
      viewTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentView = this.dataset.view;

      // Toggle sections
      document.getElementById('visitorsSection').style.display = currentView === 'visitors' ? 'block' : 'none';
      document.getElementById('employeesSection').style.display = currentView === 'employees' ? 'block' : 'none';

      // Toggle search/filter elements
      const searchFilterSection = document.getElementById('searchFilterSection');
      if (searchFilterSection) {
        searchFilterSection.style.display = currentView === 'visitors' ? 'block' : 'none';
      }

      if (currentView === 'visitors') {
        await renderVisitorsDashboard();
      } else {
        await renderEmployeesDashboard();
      }
    });
  });

  // ─── Fetch data and render visitors ──
  async function fetchAndRender() {
    try {
      const query = searchInput.value.trim();
      visitorsCache = await fetchVisitors(query, currentFilter);
      renderVisitorsTable();
    } catch (err) {
      console.error('Failed to fetch visitors:', err);
      showToast('Failed to load visitors. Check your API URL.', 'error');
    }
  }

  // ─── Render Visitors Dashboard ──────────
  async function renderVisitorsDashboard() {
    try {
      const query = searchInput.value.trim();
      visitorsCache = await fetchVisitors(query, currentFilter);
      renderStats(visitorsCache);
      renderVisitorsTable();
    } catch (err) {
      console.error('Dashboard load error:', err);
      showToast('Failed to load dashboard. Check your API URL.', 'error');
    }
  }

  // ─── Render Employees Dashboard ───────
  async function renderEmployeesDashboard() {
    try {
      const query = searchInput.value.trim();
      employeesCache = await fetchEmployees(query);
      
      // Update stats for employees
      const totalToday = employeesCache.filter(e => isToday(e.timestamp)).length;
      const onSite = employeesCache.filter(e => e.status === 'Time-in').length;
      const recent = employeesCache.length > 0 ? employeesCache[0] : null;

      totalTodayEl.textContent = totalToday;
      onSiteEl.textContent = onSite;

      if (recent && isToday(recent.timestamp)) {
        recentEntryEl.textContent = `${recent.fullName.split(' ')[0]} · ${timeAgo(recent.timestamp)}`;
      } else if (employeesCache.length > 0) {
        recentEntryEl.textContent = 'No entries today';
      } else {
        recentEntryEl.textContent = 'No data yet';
      }

      renderEmployeesTable();
    } catch (err) {
      console.error('Employees dashboard load error:', err);
      showToast('Failed to load employees. Check your API URL.', 'error');
    }
  }

  // ─── Initial Load ───────────────────────
  if (!requireAuth()) {
    pinInput.focus();
  } else {
    renderDashboard();
  }

  // Re-check auth if coming from another tab
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      requireAuth();
    }
  });

  console.log('%c🔐 Admin Dashboard v1.0 (API)', 'font-size: 18px; font-weight: bold; color: #1a73e8;');
  console.log('%c🔧 API:', 'font-size: 12px; color: #5a6a7e;', API_URL);

})();