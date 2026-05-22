const API_BASE = 'http://localhost:3000/api/v1';
const TOKEN_KEY = 'ur_admin_token';
const USER_KEY = 'ur_admin_user';

let currentPage = 1;
let currentFilter = '';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginForm')) initLogin();
  if (document.getElementById('leadsBody')) initDashboard();
});

// ==================== LOGIN ====================

function initLogin() {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    window.location.href = 'dashboard.html';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Signing In...';

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.getElementById('username').value.trim(),
          password: document.getElementById('password').value,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, document.getElementById('username').value.trim());
        window.location.href = 'dashboard.html';
      } else {
        errorEl.textContent = data.message || 'Invalid credentials.';
        errorEl.style.display = 'block';
      }
    } catch {
      errorEl.textContent = 'Network error. Cannot reach server.';
      errorEl.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  });
}

// ==================== DASHBOARD ====================

function initDashboard() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('adminUserDisplay').textContent =
    localStorage.getItem(USER_KEY) || 'Admin';

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = 'login.html';
  });

  document.getElementById('statusFilter').addEventListener('change', (e) => {
    currentFilter = e.target.value;
    currentPage = 1;
    fetchLeads();
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('leadModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  fetchLeads();
}

async function fetchLeads() {
  const tbody = document.getElementById('leadsBody');
  tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">Loading...</td></tr>';

  const token = localStorage.getItem(TOKEN_KEY);
  const params = new URLSearchParams({ page: currentPage, limit: 20 });
  if (currentFilter) params.set('status', currentFilter);

  try {
    const res = await fetch(`${API_BASE}/admin/leads?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = 'login.html';
      return;
    }

    const data = await res.json();

    if (data.data && data.data.length > 0) {
      renderLeads(data.data, data.total);
      renderPagination(data.total);
    } else {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No leads found.</td></tr>';
      document.getElementById('pagination').innerHTML = '';
    }
  } catch {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Failed to fetch leads. Check server connection.</td></tr>';
  }
}

function renderLeads(leads, total) {
  const tbody = document.getElementById('leadsBody');
  tbody.innerHTML = leads.map(lead => `
    <tr>
      <td>${lead.id}</td>
      <td><strong>${escapeHtml(lead.name)}</strong></td>
      <td>${escapeHtml(lead.phone)}</td>
      <td>${escapeHtml(lead.service || '—')}</td>
      <td><span class="status-badge status-${lead.status}">${lead.status}</span></td>
      <td>${formatDate(lead.createdAt)}</td>
      <td>
        <button class="action-btn view" onclick="viewLead(${lead.id})">View</button>
        ${lead.status === 'new'
          ? `<button class="action-btn contacted" onclick="updateStatus(${lead.id},'contacted')">Contacted</button>`
          : lead.status === 'contacted'
          ? `<button class="action-btn closed" onclick="updateStatus(${lead.id},'closed')">Close</button>`
          : ''}
      </td>
    </tr>
  `).join('');
}

function renderPagination(total) {
  const totalPages = Math.ceil(total / 20);
  const el = document.getElementById('pagination');

  if (totalPages <= 1) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <button ${currentPage <= 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})">← Prev</button>
    <span class="page-info">Page ${currentPage} of ${totalPages} (${total} leads)</span>
    <button ${currentPage >= totalPages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})">Next →</button>
  `;
}

function goPage(page) {
  currentPage = page;
  fetchLeads();
}

// ==================== LEAD DETAIL ====================

async function viewLead(id) {
  const token = localStorage.getItem(TOKEN_KEY);
  const modalBody = document.getElementById('modalBody');

  modalBody.innerHTML = '<p>Loading...</p>';
  document.getElementById('leadModal').classList.add('active');

  try {
    const res = await fetch(`${API_BASE}/admin/leads/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) { modalBody.innerHTML = '<p>Failed to load lead.</p>'; return; }

    const data = await res.json();
    const lead = data.lead;

    modalBody.innerHTML = `
      <div class="detail-row"><span class="detail-label">ID</span><span class="detail-value">#${lead.id}</span></div>
      <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value">${escapeHtml(lead.name)}</span></div>
      <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${escapeHtml(lead.phone)}</span></div>
      <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${escapeHtml(lead.email || '—')}</span></div>
      <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${escapeHtml(lead.service || '—')}</span></div>
      <div class="detail-row"><span class="detail-label">Message</span><span class="detail-value">${escapeHtml(lead.message || '—')}</span></div>
      <div class="detail-row"><span class="detail-label">Source</span><span class="detail-value">${escapeHtml(lead.source)}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="status-badge status-${lead.status}">${lead.status}</span></span></div>
      <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${formatDate(lead.createdAt)}</span></div>
    `;
  } catch {
    modalBody.innerHTML = '<p>Network error.</p>';
  }
}

function closeModal() {
  document.getElementById('leadModal').classList.remove('active');
}

// ==================== UPDATE STATUS ====================

async function updateStatus(id, status) {
  const token = localStorage.getItem(TOKEN_KEY);

  try {
    const res = await fetch(`${API_BASE}/admin/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) fetchLeads();
  } catch {
    alert('Failed to update status.');
  }
}

// ==================== UTILITIES ====================

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
