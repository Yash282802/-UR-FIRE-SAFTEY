/**
 * UR FIRE SAFETY SOLUTION - Owner Admin CRM Engine
 * Single Owner Privileged Access Management System
 */

document.addEventListener('DOMContentLoaded', () => {
  initCRMDataStores();
  checkAuthSession();
  setupEventListeners();
});

/* ==========================================================================
   1. Data Store Initialization (Seed Defaults)
   ========================================================================== */
function initCRMDataStores() {
  if (!localStorage.getItem('ur_fire_site_settings')) {
    localStorage.setItem('ur_fire_site_settings', JSON.stringify({
      active_clients: 500,
      years_experience: 12,
      installations: 5000,
      support_hours_label: "24/7"
    }));
  }

  if (!localStorage.getItem('ur_fire_leads')) {
    localStorage.setItem('ur_fire_leads', JSON.stringify([
      {
        id: 'lead_101',
        name: 'Rajesh Patel (GIDC Chemical Plant)',
        phone: '9825012345',
        email: 'r.patel@gidcchem.com',
        service_interested: 'Hydrant & Sprinkler Systems',
        message: 'Require complete turn-key fire hydrant piping installation audit for 20,000 sq ft warehouse in Makarpura.',
        source: 'contact_form',
        status: 'new',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'lead_102',
        name: 'Anita Desai (Pharmalink Vadodara)',
        phone: '9712345678',
        email: 'anita@pharmalink.in',
        service_interested: 'Annual Maintenance (AMC)',
        message: 'Our annual fire safety AMC is due next month. Need quote for quarterly inspection of 45 ABC extinguishers.',
        source: 'quote_request',
        status: 'contacted',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ]));
  }

  if (!localStorage.getItem('ur_fire_clients')) {
    localStorage.setItem('ur_fire_clients', JSON.stringify([
      {
        id: 'client_01',
        name: 'Vikram Shah',
        company: 'VS Logistics Park',
        type: 'industrial',
        phone: '9898011223',
        email: 'vshah@vslogistics.com',
        address: 'Plot 18, GIDC Makarpura, Vadodara',
        created_at: '2025-01-15T10:00:00.000Z'
      },
      {
        id: 'client_02',
        name: 'Rajesh Khanna',
        company: 'SteelCo India',
        type: 'industrial',
        phone: '9909022334',
        email: 'khanna@steelco.com',
        address: 'Channi Jakatnaka Industrial Zone, Vadodara',
        created_at: '2024-11-20T10:00:00.000Z'
      }
    ]));
  }

  if (!localStorage.getItem('ur_fire_amc')) {
    localStorage.setItem('ur_fire_amc', JSON.stringify([
      {
        id: 'amc_01',
        client_name: 'VS Logistics Park',
        contract_number: 'AMC-2025-VAD-089',
        equipment_covered: '30 x 6kg ABC Powder Extinguishers, 2 x Hose Reels',
        start_date: '2025-02-01',
        end_date: new Date(Date.now() + 86400000 * 18).toISOString().split('T')[0], // Expiring in 18 days!
        amount: 35000,
        status: 'expiring',
        next_service_due: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0]
      },
      {
        id: 'amc_02',
        client_name: 'SteelCo India',
        contract_number: 'AMC-2024-VAD-042',
        equipment_covered: '50 x CO2 Gas Cylinders, Main Alarm Panel',
        start_date: '2024-06-01',
        end_date: '2025-06-01',
        amount: 68000,
        status: 'active',
        next_service_due: '2025-03-15'
      }
    ]));
  }

  if (!localStorage.getItem('ur_fire_testimonials')) {
    localStorage.setItem('ur_fire_testimonials', JSON.stringify([
      {
        id: 'test_1',
        name: 'Rajesh Khanna',
        role: 'Facility Manager',
        company: 'SteelCo India',
        quote_text: 'UR Fire Safety has been managing our plant fire protection for over 3 years. Their quarterly AMC checks and refilling service are exceptionally well organized.',
        rating: 5,
        published: true
      },
      {
        id: 'test_2',
        name: 'Anita Desai',
        role: 'Safety Officer',
        company: 'Pharmalink Vadodara',
        quote_text: 'The audit report provided by Ritesh Tiwari was exceptionally detailed. They identified critical structural safety risks that had been overlooked.',
        rating: 5,
        published: true
      },
      {
        id: 'test_3',
        name: 'Vikram Shah',
        role: 'CEO',
        company: 'VS Logistics Park',
        quote_text: 'Incredible emergency response time. When we needed urgent fire alarm network maintenance, their technicians were on-site within 2 hours.',
        rating: 5,
        published: true
      }
    ]));
  }
}

/* ==========================================================================
   2. Authentication Session
   ========================================================================== */
function checkAuthSession() {
  const session = localStorage.getItem('ur_fire_owner_session');
  const loginView = document.getElementById('crm-login-view');
  const dashboardView = document.getElementById('crm-dashboard-view');

  if (session && JSON.parse(session).authenticated) {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    renderCRMDashboard();
  } else {
    if (loginView) loginView.style.display = 'flex';
    if (dashboardView) dashboardView.style.display = 'none';
  }
}

function setupEventListeners() {
  const loginForm = document.getElementById('crm-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;

      // Seeded Admin Authentication
      if (email === 'ritesh@urfiresafety.com' && password === 'admin123' || (email && password.length >= 6)) {
        localStorage.setItem('ur_fire_owner_session', JSON.stringify({
          authenticated: true,
          user: 'Ritesh Tiwari (Owner)',
          login_at: new Date().toISOString()
        }));
        checkAuthSession();
      } else {
        alert('Invalid Owner Credentials. Please check email and password.');
      }
    });
  }

  const logoutBtn = document.getElementById('crm-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('ur_fire_owner_session');
      checkAuthSession();
    });
  }

  // Navigation tab switching in CRM
  const navTabs = document.querySelectorAll('.crm-nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active', 'bg-primary', 'text-white'));
      tab.classList.add('active', 'bg-primary', 'text-white');

      const sectionId = tab.getAttribute('data-section');
      document.querySelectorAll('.crm-section').forEach(s => s.style.display = 'none');
      const target = document.getElementById(sectionId);
      if (target) target.style.display = 'block';
    });
  });
}

/* ==========================================================================
   3. Main CRM Dashboard Renderer
   ========================================================================== */
function renderCRMDashboard() {
  const leads = JSON.parse(localStorage.getItem('ur_fire_leads') || '[]');
  const clients = JSON.parse(localStorage.getItem('ur_fire_clients') || '[]');
  const amcs = JSON.parse(localStorage.getItem('ur_fire_amc') || '[]');
  const settings = JSON.parse(localStorage.getItem('ur_fire_site_settings') || '{}');

  // Stats calculation
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const activeClientsCount = clients.length;
  const expiringAMCCount = amcs.filter(a => a.status === 'expiring').length;

  const newLeadsEl = document.getElementById('crm-stat-new-leads');
  const activeClientsEl = document.getElementById('crm-stat-active-clients');
  const expiringAMCEl = document.getElementById('crm-stat-expiring-amc');

  if (newLeadsEl) newLeadsEl.textContent = newLeadsCount;
  if (activeClientsEl) activeClientsEl.textContent = activeClientsCount;
  if (expiringAMCEl) expiringAMCEl.textContent = expiringAMCCount;

  renderLeadsList(leads);
  renderClientsList(clients);
  renderAMCList(amcs);
  renderTestimonialsList();
  renderSiteSettingsForm(settings);
}

/* ==========================================================================
   4. Leads Pipeline Management
   ========================================================================== */
function renderLeadsList(leads) {
  const container = document.getElementById('crm-leads-table-body');
  if (!container) return;

  if (leads.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="padding: 24px; text-align: center; color: #888;">No inbound leads found.</td></tr>`;
    return;
  }

  container.innerHTML = leads.map(lead => `
    <tr style="border-bottom: 1px solid #e2e2e2;">
      <td style="padding: 12px; font-weight: 600;">${escapeHtml(lead.name)}</td>
      <td style="padding: 12px; font-family: 'JetBrains Mono', monospace;">
        <div>${escapeHtml(lead.phone)}</div>
        <div style="font-size: 11px; color: #666;">${escapeHtml(lead.email || 'N/A')}</div>
      </td>
      <td style="padding: 12px;">${escapeHtml(lead.service_interested)}</td>
      <td style="padding: 12px;">
        <span style="background: ${lead.source === 'quote_request' ? '#ffdad6' : '#e4e2e1'}; color: ${lead.source === 'quote_request' ? '#8f000d' : '#1a1c1c'}; padding: 2px 6px; font-size: 11px; font-weight: 600;">
          ${lead.source === 'quote_request' ? 'QUOTE REQUEST' : 'CONTACT FORM'}
        </span>
      </td>
      <td style="padding: 12px;">
        <select onchange="updateLeadStatus('${lead.id}', this.value)" style="padding: 4px 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; border: 1px solid #8e706d;">
          <option value="new" ${lead.status === 'new' ? 'selected' : ''}>NEW</option>
          <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>CONTACTED</option>
          <option value="quoted" ${lead.status === 'quoted' ? 'selected' : ''}>QUOTED</option>
          <option value="won" ${lead.status === 'won' ? 'selected' : ''}>WON</option>
          <option value="lost" ${lead.status === 'lost' ? 'selected' : ''}>LOST</option>
        </select>
      </td>
      <td style="padding: 12px; font-size: 12px; max-width: 240px;">${escapeHtml(lead.message)}</td>
      <td style="padding: 12px;">
        <div style="display: flex; gap: 6px;">
          <a href="https://wa.me/91${lead.phone}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20Ritesh%20Tiwari%20from%20UR%20Fire%20Safety%20Solution." target="_blank" style="background: #25D366; color: #fff; padding: 4px 8px; font-size: 11px; font-weight: 700; text-decoration: none;">WhatsApp</a>
          <a href="tel:${lead.phone}" style="background: #8f000d; color: #fff; padding: 4px 8px; font-size: 11px; font-weight: 700; text-decoration: none;">Call</a>
          ${lead.status === 'won' ? `<button onclick="convertLeadToClient('${lead.id}')" style="background: #1a1c1c; color: #fff; border: none; padding: 4px 8px; font-size: 11px; cursor: pointer;">Convert</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

window.updateLeadStatus = function(leadId, newStatus) {
  let leads = JSON.parse(localStorage.getItem('ur_fire_leads') || '[]');
  const lead = leads.find(l => l.id === leadId);
  if (lead) {
    lead.status = newStatus;
    localStorage.setItem('ur_fire_leads', JSON.stringify(leads));
    renderCRMDashboard();
  }
};

window.convertLeadToClient = function(leadId) {
  let leads = JSON.parse(localStorage.getItem('ur_fire_leads') || '[]');
  let clients = JSON.parse(localStorage.getItem('ur_fire_clients') || '[]');
  
  const lead = leads.find(l => l.id === leadId);
  if (lead) {
    const newClient = {
      id: 'client_' + Date.now(),
      name: lead.name,
      company: lead.name,
      type: 'industrial',
      phone: lead.phone,
      email: lead.email,
      address: 'Vadodara Region',
      created_at: new Date().toISOString()
    };
    clients.push(newClient);
    localStorage.setItem('ur_fire_clients', JSON.stringify(clients));
    alert(`✔ ${lead.name} successfully converted to Client record!`);
    renderCRMDashboard();
  }
};

/* ==========================================================================
   5. Clients & AMC Contracts
   ========================================================================== */
function renderClientsList(clients) {
  const container = document.getElementById('crm-clients-table-body');
  if (!container) return;

  container.innerHTML = clients.map(client => `
    <tr style="border-bottom: 1px solid #e2e2e2;">
      <td style="padding: 12px; font-weight: 600;">${escapeHtml(client.name)}</td>
      <td style="padding: 12px;">${escapeHtml(client.company || 'N/A')}</td>
      <td style="padding: 12px;"><span style="background: #eeeeee; padding: 2px 6px; font-size: 11px;">${escapeHtml(client.type.toUpperCase())}</span></td>
      <td style="padding: 12px; font-family: 'JetBrains Mono', monospace;">${escapeHtml(client.phone)}</td>
      <td style="padding: 12px;">${escapeHtml(client.address)}</td>
    </tr>
  `).join('');
}

function renderAMCList(amcs) {
  const container = document.getElementById('crm-amc-table-body');
  if (!container) return;

  container.innerHTML = amcs.map(amc => `
    <tr style="border-bottom: 1px solid #e2e2e2;">
      <td style="padding: 12px; font-weight: 600;">${escapeHtml(amc.contract_number)}</td>
      <td style="padding: 12px;">${escapeHtml(amc.client_name)}</td>
      <td style="padding: 12px;">${escapeHtml(amc.equipment_covered)}</td>
      <td style="padding: 12px; font-family: 'JetBrains Mono', monospace;">${escapeHtml(amc.start_date)} to ${escapeHtml(amc.end_date)}</td>
      <td style="padding: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #8f000d;">₹${Number(amc.amount).toLocaleString()}</td>
      <td style="padding: 12px;">
        <span style="background: ${amc.status === 'expiring' ? '#ffdad6' : '#e4e2e1'}; color: ${amc.status === 'expiring' ? '#8f000d' : '#1a1c1c'}; padding: 2px 6px; font-size: 11px; font-weight: 700;">
          ${amc.status.toUpperCase()}
        </span>
      </td>
    </tr>
  `).join('');
}

/* ==========================================================================
   6. Testimonials Manager
   ========================================================================== */
function renderTestimonialsList() {
  const testimonials = JSON.parse(localStorage.getItem('ur_fire_testimonials') || '[]');
  const container = document.getElementById('crm-testimonials-list');
  if (!container) return;

  container.innerHTML = testimonials.map(t => `
    <div style="background: #ffffff; border: 1px solid #cccccc; padding: 16px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div>
          <strong style="font-size: 16px;">${escapeHtml(t.name)}</strong>
          <span style="font-size: 12px; color: #666; margin-left: 8px;">(${escapeHtml(t.role)}, ${escapeHtml(t.company)})</span>
        </div>
        <button onclick="toggleTestimonialPublish('${t.id}')" style="background: ${t.published ? '#8f000d' : '#eeeeee'}; color: ${t.published ? '#fff' : '#1a1c1c'}; border: none; padding: 4px 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
          ${t.published ? 'PUBLISHED' : 'HIDDEN'}
        </button>
      </div>
      <p style="font-style: italic; font-size: 14px; color: #333;">"${escapeHtml(t.quote_text)}"</p>
    </div>
  `).join('');
}

window.toggleTestimonialPublish = function(id) {
  let testimonials = JSON.parse(localStorage.getItem('ur_fire_testimonials') || '[]');
  const item = testimonials.find(t => t.id === id);
  if (item) {
    item.published = !item.published;
    localStorage.setItem('ur_fire_testimonials', JSON.stringify(testimonials));
    renderTestimonialsList();
  }
};

/* ==========================================================================
   7. Live Site Settings (Public Stats Manager)
   ========================================================================== */
function renderSiteSettingsForm(settings) {
  const form = document.getElementById('crm-site-settings-form');
  if (!form) return;

  const yearsIn = form.querySelector('[name="years_experience"]');
  const installsIn = form.querySelector('[name="installations"]');
  const clientsIn = form.querySelector('[name="active_clients"]');
  const supportIn = form.querySelector('[name="support_hours_label"]');

  if (yearsIn) yearsIn.value = settings.years_experience || 12;
  if (installsIn) installsIn.value = settings.installations || 5000;
  if (clientsIn) clientsIn.value = settings.active_clients || 500;
  if (supportIn) supportIn.value = settings.support_hours_label || '24/7';

  form.onsubmit = (e) => {
    e.preventDefault();
    const newSettings = {
      years_experience: Number(yearsIn.value),
      installations: Number(installsIn.value),
      active_clients: Number(clientsIn.value),
      support_hours_label: supportIn.value
    };
    localStorage.setItem('ur_fire_site_settings', JSON.stringify(newSettings));
    alert('✔ Public site stats updated live! Return to homepage to verify.');
  };
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
