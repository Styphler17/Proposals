/* app.js — load data, render components, track edits, save to server */

let proposalData = null;
let currentJsonFile = 'proposal.json';

const PROPOSAL_TEMPLATES = [
  {
    json: 'proposal.json',
    url: 'website-mobile-app.html',
    title: 'Website & Mobile App',
    category: 'Digital Products & Apps',
    icon: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path>'
  },
  {
    json: 'real-estate.json',
    url: 'real-estate.html',
    title: 'Real Estate & Property',
    category: 'Agency & Listings',
    icon: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>'
  },
  {
    json: 'restaurant.json',
    url: 'restaurant.html',
    title: 'Restaurants & Hospitality',
    category: 'Menu & Food Ordering',
    icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" x2="6" y1="1" y2="4"></line><line x1="10" x2="10" y1="1" y2="4"></line><line x1="14" x2="14" y1="1" y2="4"></line>'
  },
  {
    json: 'plumbing.json',
    url: 'plumbing-services.html',
    title: 'Plumbing & Trades',
    category: 'Emergency Calls & Booking',
    icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>'
  },
  {
    json: 'healthcare.json',
    url: 'healthcare.html',
    title: 'Clinics & Healthcare',
    category: 'Patient Portal & Doctors',
    icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>'
  },
  {
    json: 'ecommerce.json',
    url: 'ecommerce-retail.html',
    title: 'E-Commerce & Retail',
    category: 'Storefront & Shopping App',
    icon: '<circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>'
  },
  {
    json: 'school-management.json',
    url: 'school-management.html',
    title: 'School Management System',
    category: 'EdTech & Campus Portals',
    icon: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>'
  },
  {
    json: 'church-ministry.json',
    url: 'church-ministry.html',
    title: 'Churches & Ministries',
    category: 'Giving & Congregation App',
    icon: '<path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"></path><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"></path><path d="M18 22V5l-6-3-6 3v17"></path><path d="M12 7v5"></path><path d="M10 9h4"></path>'
  },
  {
    json: 'hotel-hospitality.json',
    url: 'hotel-hospitality.html',
    title: 'Hotels & Hospitality',
    category: 'Direct Bookings & Concierge',
    icon: '<path d="M10 22v-6.57"></path><path d="M12 11h.01"></path><path d="M12 7h.01"></path><path d="M14 15.43V22"></path><path d="M15 11h.01"></path><path d="M15 7h.01"></path><path d="M16 16h3a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"></path><path d="M18 10h.01"></path><path d="M6 10h.01"></path><path d="M6 14h.01"></path><path d="M8 22v-6.57"></path><path d="M9 11h.01"></path><path d="M9 7h.01"></path><rect x="4" y="2" width="16" height="20" rx="2"></rect>'
  }
];

/* ── Boot & Fetch ──────────────────────────────────────────────────────── */

async function fetchProposal(jsonFile = currentJsonFile) {
  const jsonPath = `data/${jsonFile}`;
  const res = await fetch(jsonPath);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  proposalData = await res.json();
  render();
  return proposalData;
}

async function init() {
  const appEl = document.getElementById('app');
  const jsonPath = appEl?.dataset?.json || 'data/proposal.json';
  currentJsonFile = jsonPath.split('/').pop() || 'proposal.json';

  try {
    await fetchProposal(currentJsonFile);
    attachListeners();
  } catch (err) {
    if (appEl) {
      appEl.innerHTML =
        `<div style="padding:48px;color:#c0392b;font-family:monospace">
           <strong>Could not load ${thisEsc(jsonPath)}</strong><br>${thisEsc(err.message)}<br><br>
           Make sure the page is served via MAMP (http://localhost/…), not opened as a file.
         </div>`;
    }
  }
}

function thisEsc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setButtonText(btn, text) {
  if (!btn) return;
  const span = btn.querySelector('.btn-text');
  if (span) {
    span.textContent = text;
  } else {
    btn.textContent = text;
  }
}

/* ── Template Switcher Component ───────────────────────────────────────── */

function renderToolbarSwitcher() {
  const container = document.getElementById('template-switcher-slot');
  if (!container) return;

  const currentTpl = PROPOSAL_TEMPLATES.find(t => t.json === currentJsonFile) || PROPOSAL_TEMPLATES[0];

  const itemsHtml = PROPOSAL_TEMPLATES.map(t => {
    const isActive = t.json === currentJsonFile;
    const activeClass = isActive ? ' active' : '';
    const checkIcon = isActive ? `
      <svg class="lucide-icon item-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>` : '';
    return `
      <a href="${t.url}" class="template-menu-item${activeClass}">
        <div class="item-icon">
          <svg class="lucide-icon" viewBox="0 0 24 24">${t.icon}</svg>
        </div>
        <div class="item-info">
          <span class="item-title">${thisEsc(t.title)}</span>
          <span class="item-sub">${thisEsc(t.category)}</span>
        </div>
        ${checkIcon}
      </a>`;
  }).join('');

  container.innerHTML = `
    <div class="template-dropdown" id="template-dropdown">
      <button type="button" class="dropdown-toggle" id="template-dropdown-btn" aria-haspopup="true" aria-expanded="false" title="Switch between all ${PROPOSAL_TEMPLATES.length} proposal templates">
        <svg class="lucide-icon nav-icon" viewBox="0 0 24 24">${currentTpl.icon}</svg>
        <span>Templates</span>
        <span class="tpl-count">${PROPOSAL_TEMPLATES.length}</span>
        <svg class="lucide-icon chevron-icon" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </button>
      <div class="template-menu" id="template-menu">
        <div class="template-menu-head">
          <span>All Templates</span>
          <small>Select to switch</small>
        </div>
        <div class="template-menu-list">
          ${itemsHtml}
        </div>
      </div>
    </div>`;

  const btn = document.getElementById('template-dropdown-btn');
  const dropdown = document.getElementById('template-dropdown');
  if (btn && dropdown) {
    btn.onclick = (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
    };
  }
}

/* ── Lead Email Templates Component ───────────────────────────────────── */

let currentEmailIndex = 0;

function renderToolbarEmailBtn() {
  const container = document.getElementById('email-template-slot');
  if (!container) return;

  const count = (proposalData?.emailTemplates || []).length;

  container.innerHTML = `
    <button type="button" class="toolbar-email-btn" id="toolbar-email-btn" title="View & edit lead outreach email templates for this proposal">
      <svg class="lucide-icon nav-icon" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
      <span>Leads</span>
      <span class="email-count-badge">${count}</span>
    </button>`;

  const btn = document.getElementById('toolbar-email-btn');
  if (btn) {
    btn.onclick = () => {
      openEmailModal();
    };
  }
}

function closeEmailModal() {
  const slot = document.getElementById('email-modal-slot');
  if (slot) slot.innerHTML = '';
  document.body.classList.remove('email-modal-open');
}

function openEmailModal(index = currentEmailIndex) {
  if (!proposalData) return;
  if (!proposalData.emailTemplates || proposalData.emailTemplates.length === 0) {
    proposalData.emailTemplates = [
      {
        id: 'outreach-1',
        name: 'Cold Outreach',
        subject: `Quick idea for ${proposalData.hero?.preparedFor || '[Client Name]'}`,
        body: `Dear ${proposalData.hero?.preparedFor || '[Client Name]'},\n\nI was looking at your digital presence...\n\n🔗 View Proposal: [Proposal Link]\n\nBest regards,\n${proposalData.hero?.preparedBy || 'PRINCE KYEI'}`
      }
    ];
  }

  currentEmailIndex = Math.max(0, Math.min(index, proposalData.emailTemplates.length - 1));

  const currentTplMeta = PROPOSAL_TEMPLATES.find(t => t.json === currentJsonFile) || {
    title: proposalData.meta?.title || 'Client Proposal',
    category: 'Lead Pitch'
  };

  let modalSlot = document.getElementById('email-modal-slot');
  if (!modalSlot) {
    modalSlot = document.createElement('div');
    modalSlot.id = 'email-modal-slot';
    document.body.appendChild(modalSlot);
  }

  modalSlot.innerHTML = components.emailModal(proposalData.emailTemplates, currentEmailIndex, currentTplMeta);
  document.body.classList.add('email-modal-open');

  attachEmailModalEvents();
}

function updateEmailStats() {
  const statsEl = document.getElementById('email-stats');
  const bodyEl  = document.getElementById('email-edit-body');
  if (!statsEl || !bodyEl) return;
  const text = bodyEl.innerText.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = text.length;
  statsEl.textContent = `${words} words · ${chars} characters`;
}

function attachEmailModalEvents() {
  const modalSlot = document.getElementById('email-modal-slot');
  if (!modalSlot) return;

  const closeBtn = document.getElementById('email-modal-close');
  const doneBtn  = document.getElementById('email-modal-done');
  const backdrop = document.getElementById('email-modal-backdrop');

  if (closeBtn) closeBtn.onclick = closeEmailModal;
  if (doneBtn)  doneBtn.onclick = closeEmailModal;
  if (backdrop) {
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeEmailModal();
    };
  }

  // Switch active template tab
  modalSlot.querySelectorAll('.email-tab-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.emailIndex, 10);
      if (!isNaN(idx)) openEmailModal(idx);
    };
  });

  // Inline editing for Name
  const nameInput = document.getElementById('email-edit-name');
  if (nameInput) {
    nameInput.oninput = (e) => {
      const val = e.target.value;
      if (proposalData.emailTemplates[currentEmailIndex]) {
        proposalData.emailTemplates[currentEmailIndex].name = val;
        markDirty();
        const activeTab = modalSlot.querySelector(`.email-tab-btn[data-email-index="${currentEmailIndex}"] .tab-title`);
        if (activeTab) activeTab.textContent = val || `Template ${currentEmailIndex + 1}`;
      }
    };
  }

  // Inline editing for Subject
  const subjectEl = document.getElementById('email-edit-subject');
  if (subjectEl) {
    subjectEl.oninput = (e) => {
      if (proposalData.emailTemplates[currentEmailIndex]) {
        proposalData.emailTemplates[currentEmailIndex].subject = e.target.innerText;
        markDirty();
      }
    };
  }

  // Inline editing for Body
  const bodyEl = document.getElementById('email-edit-body');
  if (bodyEl) {
    bodyEl.oninput = (e) => {
      if (proposalData.emailTemplates[currentEmailIndex]) {
        proposalData.emailTemplates[currentEmailIndex].body = e.target.innerText;
        markDirty();
        updateEmailStats();
      }
    };
    updateEmailStats();
  }

  // Add new template (Create)
  const addBtn = document.getElementById('email-add-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      const num = proposalData.emailTemplates.length + 1;
      const client = proposalData.hero?.preparedFor || '[Client Name]';
      const sender = proposalData.hero?.preparedBy || 'PRINCE KYEI';
      proposalData.emailTemplates.push({
        id: 'outreach-' + Date.now(),
        name: `Outreach Variant ${num}`,
        subject: `Proposal follow-up for ${client}`,
        body: `Dear ${client},\n\nI wanted to follow up on our proposal:\n🔗 View Proposal: [Proposal Link]\n\nPlease let me know if you have any questions.\n\nWarm regards,\n${sender}`
      });
      markDirty();
      renderToolbarEmailBtn();
      openEmailModal(proposalData.emailTemplates.length - 1);
    };
  }

  // Delete current template (Delete)
  const deleteBtn = document.getElementById('email-delete-btn');
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      if (proposalData.emailTemplates.length <= 1) {
        alert('You must have at least one email template.');
        return;
      }
      const tplName = proposalData.emailTemplates[currentEmailIndex]?.name || 'this template';
      if (confirm(`Are you sure you want to delete "${tplName}"?`)) {
        proposalData.emailTemplates.splice(currentEmailIndex, 1);
        currentEmailIndex = Math.max(0, currentEmailIndex - 1);
        markDirty();
        renderToolbarEmailBtn();
        openEmailModal(currentEmailIndex);
      }
    };
  }

  // Dynamic Token Insertion (Copy or append)
  modalSlot.querySelectorAll('.token-pill').forEach(pill => {
    pill.onclick = () => {
      const token = pill.dataset.token;
      copyText(token, `Copied token ${token}`);
    };
  });

  // Auto-fill tokens with current proposal details
  const autofillBtn = document.getElementById('email-autofill-btn');
  if (autofillBtn) {
    autofillBtn.onclick = () => {
      const active = proposalData.emailTemplates[currentEmailIndex];
      if (!active) return;

      const clientName = (proposalData.hero?.preparedFor || '[Client Name]').trim();
      const senderName = (proposalData.hero?.preparedBy || 'PRINCE KYEI').trim();
      const phone = '+233247380924';
      const email = 'prince.kyei010@gmail.com';
      const proposalLink = window.location.href;

      const replaceTokens = (str) => {
        return str
          .replace(/\[Client Name\]/g, clientName)
          .replace(/\[Client \/ Contact Name\]/g, clientName)
          .replace(/\[Proposal Link\]/g, proposalLink)
          .replace(/\[Sender Name\]/g, senderName)
          .replace(/\[Phone\]/g, phone)
          .replace(/\[Email\]/g, email);
      };

      active.subject = replaceTokens(active.subject);
      active.body = replaceTokens(active.body);

      if (subjectEl) subjectEl.innerText = active.subject;
      if (bodyEl) bodyEl.innerText = active.body;

      markDirty();
      updateEmailStats();
      showToast('Replaced placeholders with live proposal data ✓');
    };
  }

  // Copy Subject
  const copySubBtn = document.getElementById('email-copy-subject');
  if (copySubBtn) {
    copySubBtn.onclick = () => {
      const text = subjectEl ? subjectEl.innerText.trim() : '';
      copyText(text, 'Subject line copied ✓');
    };
  }

  // Copy Body
  const copyBodyBtn = document.getElementById('email-copy-body');
  if (copyBodyBtn) {
    copyBodyBtn.onclick = () => {
      const text = bodyEl ? bodyEl.innerText.trim() : '';
      copyText(text, 'Email body copied ✓');
    };
  }

  // Copy Full Email
  const copyAllBtn = document.getElementById('email-copy-all');
  if (copyAllBtn) {
    copyAllBtn.onclick = () => {
      const sub = subjectEl ? subjectEl.innerText.trim() : '';
      const body = bodyEl ? bodyEl.innerText.trim() : '';
      const full = `Subject: ${sub}\n\n${body}`;
      copyText(full, 'Full email copied to clipboard ✓');
    };
  }
}

function copyText(str, successMessage = 'Copied to clipboard ✓') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(str).then(() => {
      showToast(successMessage);
    }).catch(() => {
      fallbackCopy(str, successMessage);
    });
  } else {
    fallbackCopy(str, successMessage);
  }
}

function fallbackCopy(str, msg) {
  const ta = document.createElement('textarea');
  ta.value = str;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(msg);
  } catch (e) {
    alert('Could not copy automatically. Please select and copy manually.');
  }
  document.body.removeChild(ta);
}

function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

/* ── Render ────────────────────────────────────────────────────────────── */

function render() {
  document.title = proposalData.meta.title;

  renderToolbarSwitcher();
  renderToolbarEmailBtn();

  const scrollBtn = document.getElementById('scroll-btn');
  if (scrollBtn) {
    const targetId = proposalData.scrollTarget || 'next-steps';
    const label = proposalData.scrollShortLabel || 'Packages';
    scrollBtn.title = proposalData.scrollLabel || 'Jump to packages';
    setButtonText(scrollBtn, label);
    scrollBtn.onclick = () => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
  }

  const heroSlot = document.getElementById('hero-slot');
  if (heroSlot) {
    heroSlot.innerHTML = components.hero(proposalData.hero);
  }

  const sectionsSlot = document.getElementById('sections-slot');
  if (sectionsSlot) {
    sectionsSlot.innerHTML = proposalData.sections.map((section, i) => {
      const fn = components[section.type];
      if (!fn) return `<section><p style="color:red">Unknown component type: ${section.type}</p></section>`;
      return fn.call(components, section, `sections.${i}`);
    }).join('');
  }

  const footerSlot = document.getElementById('footer-slot');
  if (footerSlot) {
    footerSlot.innerHTML = components.footer(proposalData.footer);
  }

  renderBackToTop();

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/* ── Back to Top Component Mount ───────────────────────────────────────── */

function renderBackToTop() {
  let btn = document.getElementById('back-to-top-btn');
  if (!btn) {
    const slot = document.getElementById('back-to-top-slot');
    const bttHtml = components.backToTop({ label: 'Back to top' });
    if (slot) {
      slot.innerHTML = bttHtml;
    } else {
      const wrapper = document.createElement('div');
      wrapper.id = 'back-to-top-slot';
      wrapper.innerHTML = bttHtml;
      document.body.appendChild(wrapper);
    }
    btn = document.getElementById('back-to-top-btn');
  }

  if (btn && !btn._hasBttClick) {
    btn._hasBttClick = true;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ── Edit listeners ────────────────────────────────────────────────────── */

function attachListeners() {
  /* Sync contenteditable → in-memory data on every keystroke */
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.contentEditable !== 'true' || !el.dataset.path) return;

    const text = el.textContent.trim();
    const lower = text.toLowerCase();

    // Auto-update comparison cell styles (Included -> green, Not included -> grey)
    if (el.tagName === 'TD' && el.closest('.comparison-wrap')) {
      if (lower === 'included') {
        el.classList.add('yes');
        el.classList.remove('dash');
      } else if (lower === 'not included' || lower === '-' || lower === '—') {
        el.classList.add('dash');
        el.classList.remove('yes');
      } else {
        el.classList.remove('yes', 'dash');
      }
    }

    // Auto-update contact link hrefs
    if (el.classList.contains('contact-link')) {
      if (el.dataset.path.includes('senderEmail')) {
        el.href = `mailto:${text}`;
      } else if (el.dataset.path.includes('senderPhone')) {
        el.href = `tel:${text.replace(/[^\d+]/g, '')}`;
      }
    }

    setPath(proposalData, el.dataset.path, text);

    // Also sync the class property 'c' in the object if applicable
    if (el.dataset.path.endsWith('.v')) {
      const parentPath = el.dataset.path.slice(0, -2);
      const parentObj = getPath(proposalData, parentPath);
      if (parentObj && typeof parentObj === 'object') {
        if (lower === 'included') {
          parentObj.c = 'yes';
        } else if (lower === 'not included' || lower === '-' || lower === '—') {
          parentObj.c = 'dash';
        } else {
          delete parentObj.c;
        }
      }
    }

    markDirty();
  });

  /* Prevent Enter from inserting block elements inside single-line fields */
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.contentEditable === 'true') {
      e.preventDefault();
    }
  });

  /* Close template dropdown when clicking outside */
  document.addEventListener('click', e => {
    const dropdown = document.getElementById('template-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      const btn = document.getElementById('template-dropdown-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });

  /* Close template dropdown & email modal on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const dropdown = document.getElementById('template-dropdown');
      if (dropdown) dropdown.classList.remove('open');
      closeEmailModal();
    }
  });

  /* Toggle Back to Top button visibility on scroll */
  if (!window._bttScrollBound) {
    window._bttScrollBound = true;
    const updateBtt = () => {
      const btn = document.getElementById('back-to-top-btn');
      if (!btn) return;
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', updateBtt, { passive: true });
    updateBtt();
  }
}

/* ── Path helpers ──────────────────────────────────────────────────────── */

function getPath(obj, dotPath) {
  const keys = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length; i++) {
    const k = /^\d+$/.test(keys[i]) ? Number(keys[i]) : keys[i];
    cur = cur?.[k];
    if (cur == null) return null;
  }
  return cur;
}

function setPath(obj, dotPath, value) {
  const keys = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = /^\d+$/.test(keys[i]) ? Number(keys[i]) : keys[i];
    cur = cur[k];
    if (cur == null) return;
  }
  const last = keys[keys.length - 1];
  cur[/^\d+$/.test(last) ? Number(last) : last] = value;
}

/* ── Dirty state ───────────────────────────────────────────────────────── */

function markDirty() {
  const status = document.getElementById('save-status');
  if (status) status.textContent = 'Unsaved changes';
  const btn = document.getElementById('save-btn');
  if (btn) {
    btn.disabled = false;
    setButtonText(btn, 'Save changes');
  }
}

/* ── Save ──────────────────────────────────────────────────────────────── */

async function saveChanges() {
  const btn    = document.getElementById('save-btn');
  const status = document.getElementById('save-status');

  if (btn) {
    btn.disabled = true;
    setButtonText(btn, 'Saving…');
  }
  if (status) status.textContent = 'Saving…';

  try {
    const url = `save.php?file=${encodeURIComponent(currentJsonFile)}`;
    const res = await fetch(url, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body:    JSON.stringify(proposalData, null, 2)
    });

    let json;
    try {
      json = await res.json();
    } catch (e) {
      json = null;
    }

    if (res.ok && json && json.ok) {
      if (status) status.textContent = 'Saved ✓';
      if (btn) {
        setButtonText(btn, 'Save changes');
        btn.disabled = true;
      }
      showToast('Proposal changes saved successfully ✓');
    } else {
      const errMsg = json?.error || (res.status === 405 ? '405 Method Not Allowed — ensure MAMP is running and page is opened via http://localhost/…' : `HTTP ${res.status}`);
      if (status) status.textContent = `Save failed: ${errMsg}`;
      if (btn) {
        setButtonText(btn, 'Retry save');
        btn.disabled = false;
      }
      showToast(`Save failed: ${errMsg}`);
    }
  } catch (err) {
    console.error('Save error:', err);
    if (status) status.textContent = 'Save error — check server';
    if (btn) {
      setButtonText(btn, 'Retry save');
      btn.disabled = false;
    }
    showToast('Save error: make sure MAMP is running on http://localhost/…');
  }
}

/* ── Start ─────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', init);
