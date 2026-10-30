/* components.js — one render function per section type */

const components = {

  /* ── Utilities ──────────────────────────────────────────────────────── */

  esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  /* Render a section header (number badge + h2 + subheading) */
  sectionHead(num, heading, subheading, path) {
    return `
      <div class="section-head">
        <div class="num">${num}</div>
        <div>
          <h2 contenteditable="true" data-path="${path}.heading">${this.esc(heading)}</h2>
          <p class="section-sub" contenteditable="true" data-path="${path}.subheading">${this.esc(subheading)}</p>
        </div>
      </div>`;
  },

  /* Callout box with a non-editable bold label + editable body */
  callout(label, body, bodyPath) {
    return `
      <div class="callout">
        <strong>${this.esc(label)}</strong>
        <span contenteditable="true" data-path="${bodyPath}"> ${this.esc(body)}</span>
      </div>`;
  },

  /* ── Lucide Icon Factory ────────────────────────────────────────────── */

  icon(name, cls = '') {
    const icons = {
      'printer': '<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect width="12" height="8" x="6" y="14"></rect>',
      'save': '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path>',
      'check': '<polyline points="20 6 9 17 4 12"></polyline>',
      'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
      'minus': '<path d="M5 12h14"></path>',
      'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line>',
      'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
      'building': '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>',
      'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path>',
      'smartphone': '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path>',
      'mail': '<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>',
      'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
      'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>',
      'arrow-right': '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
      'arrow-left': '<path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>',
      'arrow-down': '<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>',
      'arrow-up': '<path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path>',
      'chevron-up': '<path d="m18 15-6-6-6 6"></path>',
      'refresh-cw': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path>',
      'copy': '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>',
      'plus': '<path d="M5 12h14"></path><path d="M12 5v14"></path>',
      'trash-2': '<path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>',
      'x': '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
      'sparkles': '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path>',
      'send': '<path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>',
      'edit': '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path>'
    };
    const body = icons[name] || '';
    const classStr = cls ? `lucide-icon ${cls}` : 'lucide-icon';
    return `<svg class="${classStr}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  },

  /* ── Hero ───────────────────────────────────────────────────────────── */

  hero(data) {
    const brandHtml = data.brand ? `
      <div class="brandline">
        <div class="brand">${this.esc(data.brand.main)}<span>${this.esc(data.brand.accent)}</span></div>
        <small contenteditable="true" data-path="hero.tagline">${this.esc(data.tagline)}</small>
      </div>` : '';

    const eyebrowStyle = data.brand ? 'style="margin-top:27px"' : '';

    return `
      <header class="hero">
        ${brandHtml}
        <div class="eyebrow" ${eyebrowStyle}
             contenteditable="true" data-path="hero.eyebrow">${this.esc(data.eyebrow)}</div>
        <h1 contenteditable="true" data-path="hero.headline">${this.esc(data.headline)}</h1>
        <p  contenteditable="true" data-path="hero.subheading">${this.esc(data.subheading)}</p>
        <div class="hero-meta">
          <div>
            <div class="meta-label">${this.icon('user', 'meta-icon')}Prepared for</div>
            <div class="meta-value" contenteditable="true" data-path="hero.preparedFor">${this.esc(data.preparedFor)}</div>
          </div>
          <div>
            <div class="meta-label">${this.icon('building', 'meta-icon')}Prepared by</div>
            <div class="meta-value" contenteditable="true" data-path="hero.preparedBy">${this.esc(data.preparedBy)}</div>
          </div>
          <div>
            <div class="meta-label">${this.icon('calendar', 'meta-icon')}Date / validity</div>
            <div class="meta-value" contenteditable="true" data-path="hero.dateValidity">${this.esc(data.dateValidity)}</div>
          </div>
        </div>
      </header>`;
  },

  /* ── Outcomes ───────────────────────────────────────────────────────── */

  outcomes(section, path) {
    const cards = (section.outcomes || []).map((o, i) => `
      <div class="outcome">
        <strong contenteditable="true" data-path="${path}.outcomes.${i}.title">${this.esc(o.title)}</strong>
        <span   contenteditable="true" data-path="${path}.outcomes.${i}.body">${this.esc(o.body)}</span>
      </div>`).join('');

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <p class="intro">
          Dear
          <strong contenteditable="true" data-path="${path}.clientName">${this.esc(section.clientName)}</strong>,
          <span   contenteditable="true" data-path="${path}.introSuffix">${this.esc(section.introSuffix)}</span>
        </p>
        <div class="outcomes">${cards}</div>
      </section>`;
  },

  /* ── Discovery (Mobile App proposal) ────────────────────────────────── */

  discovery(section, path) {
    const hp = `${path}.highlightCard`;
    const sp = `${path}.softCard`;
    const hc = section.highlightCard;
    const sc = section.softCard;

    const hItems = hc.items.map((item, i) =>
      `<li contenteditable="true" data-path="${hp}.items.${i}">${this.esc(item)}</li>`
    ).join('');

    const sItems = sc.items.map((item, i) =>
      `<li contenteditable="true" data-path="${sp}.items.${i}">${this.esc(item)}</li>`
    ).join('');

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="cards">
          <article class="card highlight">
            <span class="tag" contenteditable="true" data-path="${hp}.tag">${this.esc(hc.tag)}</span>
            <h3  contenteditable="true" data-path="${hp}.title">${this.esc(hc.title)}</h3>
            <div class="price" contenteditable="true" data-path="${hp}.price">${this.esc(hc.price)}</div>
            <p class="note"    contenteditable="true" data-path="${hp}.note">${this.esc(hc.note)}</p>
            <p                 contenteditable="true" data-path="${hp}.body">${this.esc(hc.body)}</p>
            <ul>${hItems}</ul>
          </article>
          <article class="card soft">
            <div class="kicker" contenteditable="true" data-path="${sp}.kicker">${this.esc(sc.kicker)}</div>
            <h3                 contenteditable="true" data-path="${sp}.title">${this.esc(sc.title)}</h3>
            <p                  contenteditable="true" data-path="${sp}.body">${this.esc(sc.body)}</p>
            <ul>${sItems}</ul>
            ${this.callout(sc.calloutLabel, sc.calloutBody, `${sp}.calloutBody`)}
          </article>
        </div>
        <p class="note" contenteditable="true" data-path="${path}.footer">${this.esc(section.footer)}</p>
      </section>`;
  },

  /* ── Free Offers (Real Estate) ──────────────────────────────────────── */

  freeOffers(section, path) {
    const cards = (section.cards || []).map((card, i) => {
      const cp = `${path}.cards.${i}`;
      const items = (card.items || []).map((item, j) =>
        `<li contenteditable="true" data-path="${cp}.items.${j}">${this.esc(item)}</li>`
      ).join('');

      return `
        <article class="free-card">
          <span class="free-tag" contenteditable="true" data-path="${cp}.tag">${this.esc(card.tag)}</span>
          <h3 contenteditable="true" data-path="${cp}.title">${this.esc(card.title)}</h3>
          <div class="free-price" contenteditable="true" data-path="${cp}.price">${this.esc(card.price)}</div>
          <p contenteditable="true" data-path="${cp}.body">${this.esc(card.body)}</p>
          <ul>${items}</ul>
        </article>`;
    }).join('');

    const footer = section.footer
      ? `<p class="small-note" contenteditable="true" data-path="${path}.footer">${this.esc(section.footer)}</p>`
      : '';

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="free-grid">${cards}</div>
        ${footer}
      </section>`;
  },

  /* ── Tiers / Packages (Real Estate) ─────────────────────────────────── */

  tiers(section, path) {
    const tiersHtml = (section.tiers || []).map((t, i) => {
      const tp = `${path}.tiers.${i}`;
      const recClass = t.recommended ? ' recommended' : '';
      const recLabel = t.recommendLabel
        ? `<span class="recommend-label" contenteditable="true" data-path="${tp}.recommendLabel">${this.esc(t.recommendLabel)}</span>`
        : '';

      const items = (t.items || []).map((item, j) =>
        `<li contenteditable="true" data-path="${tp}.items.${j}">${this.esc(item)}</li>`
      ).join('');

      const footItems = (t.footItems || []).map((fi, k) => `
        <strong>${this.esc(fi.label)}</strong>
        <span contenteditable="true" data-path="${tp}.footItems.${k}.text"> ${this.esc(fi.text)}</span>
      `).join('<br>');

      const footNote = t.footNote
        ? `<br><span contenteditable="true" data-path="${tp}.footNote">${this.esc(t.footNote)}</span>`
        : '';

      return `
        <article class="tier${recClass}">
          <div class="tier-head">
            <div class="tier-kicker" contenteditable="true" data-path="${tp}.kicker">${this.esc(t.kicker)}</div>
            ${recLabel}
          </div>
          <h3 contenteditable="true" data-path="${tp}.title">${this.esc(t.title)}</h3>
          <div class="price" contenteditable="true" data-path="${tp}.price">${this.esc(t.price)}</div>
          <p class="tier-desc" contenteditable="true" data-path="${tp}.desc">${this.esc(t.desc)}</p>
          <ul>${items}</ul>
          <div class="tier-foot">${footItems}${footNote}</div>
        </article>`;
    }).join('');

    const enterpriseHtml = section.enterprise ? `
      <div class="enterprise">
        <div>
          <h3 contenteditable="true" data-path="${path}.enterprise.heading">${this.esc(section.enterprise.heading)}</h3>
          <p contenteditable="true" data-path="${path}.enterprise.body">${this.esc(section.enterprise.body)}</p>
        </div>
        <div class="price" contenteditable="true" data-path="${path}.enterprise.cta">${this.esc(section.enterprise.cta)}</div>
      </div>` : '';

    const noteHtml = section.smallNote ? `
      <p class="small-note" contenteditable="true" data-path="${path}.smallNote">${this.esc(section.smallNote)}</p>` : '';

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="tiers">${tiersHtml}</div>
        ${enterpriseHtml}
        ${noteHtml}
      </section>`;
  },

  /* ── Comparison Table (Real Estate) ─────────────────────────────────── */

  comparison(section, path) {
    let headersList = section.headers;
    let rowsList = section.rows;

    if (!headersList && (section.col1 || section.col2)) {
      headersList = ['Feature', section.col1 || '', section.col2 || ''];
    }
    if (!rowsList && Array.isArray(section.table)) {
      rowsList = section.table.map(item => [item.f, item.t1, item.t2]);
    }
    headersList = Array.isArray(headersList) ? headersList : [];
    rowsList = Array.isArray(rowsList) ? rowsList : [];

    const headers = headersList.map(h => `<th>${this.esc(h).replace(/\n/g, '<br>')}</th>`).join('');
    const rows = rowsList.map((row, i) => {
      const cells = (Array.isArray(row) ? row : []).map((cell, j) => {
        let val = cell;
        let explicitCls = '';
        let isObj = false;
        if (typeof cell === 'object' && cell !== null) {
          val = cell.v;
          explicitCls = cell.c || '';
          isObj = true;
        }

        const textVal = String(val ?? '').trim().toLowerCase();
        let cls = explicitCls;
        if (textVal === 'included') {
          cls = 'yes';
        } else if (textVal === 'not included' || textVal === '-' || textVal === '—') {
          cls = 'dash';
        }

        const classAttr = cls ? ` class="${this.esc(cls)}"` : '';
        const dataPath = isObj ? `${path}.rows.${i}.${j}.v` : `${path}.rows.${i}.${j}`;
        return `<td${classAttr} contenteditable="true" data-path="${dataPath}">${this.esc(val)}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const footer = section.footer
      ? `<p class="small-note" contenteditable="true" data-path="${path}.footer">${this.esc(section.footer)}</p>`
      : '';

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="comparison-wrap">
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        ${footer}
      </section>`;
  },

  /* ── Addons (Real Estate) ───────────────────────────────────────────── */

  addons(section, path) {
    const listKey = section.items ? 'items' : (section.cards ? 'cards' : (section.addons ? 'addons' : 'items'));
    const list = section[listKey] || [];
    const items = list.map((item, i) => `
      <div class="addon">
        <strong contenteditable="true" data-path="${path}.${listKey}.${i}.title">${this.esc(item.title)}</strong>
        <p contenteditable="true" data-path="${path}.${listKey}.${i}.body">${this.esc(item.body || item.desc)}</p>
      </div>`).join('');

    const footer = section.footer
      ? `<p class="small-note" contenteditable="true" data-path="${path}.footer">${this.esc(section.footer)}</p>`
      : '';

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="addons">${items}</div>
        ${footer}
      </section>`;
  },

  /* Alias for cards grid */
  cardsGrid(section, path) {
    return this.addons(section, path);
  },

  /* ── Routes (Mobile App proposal) ───────────────────────────────────── */

  routes(section, path) {
    const cards = section.cards.map((card, i) => {
      const cp = `${path}.cards.${i}`;
      const items = card.items.map((item, j) =>
        `<li contenteditable="true" data-path="${cp}.items.${j}">${this.esc(item)}</li>`
      ).join('');
      return `
        <article class="card">
          <div class="kicker" contenteditable="true" data-path="${cp}.kicker">${this.esc(card.kicker)}</div>
          <h3                 contenteditable="true" data-path="${cp}.title">${this.esc(card.title)}</h3>
          <div class="price"  contenteditable="true" data-path="${cp}.price">${this.esc(card.price)}</div>
          <p class="note"     contenteditable="true" data-path="${cp}.note">${this.esc(card.note)}</p>
          <p                  contenteditable="true" data-path="${cp}.body">${this.esc(card.body)}</p>
          <ul>${items}</ul>
          <div class="note">
            <strong>${this.esc(card.rangeNoteLabel)}</strong>
            <span contenteditable="true" data-path="${cp}.rangeNoteBody"> ${this.esc(card.rangeNoteBody)}</span>
          </div>
        </article>`;
    }).join('');

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="cards">${cards}</div>
        ${this.callout(section.calloutLabel, section.calloutBody, `${path}.calloutBody`)}
      </section>`;
  },

  /* ── Table (Mobile App proposal) ────────────────────────────────────── */

  table(section, path) {
    const headers = section.headers.map(h => `<th>${this.esc(h)}</th>`).join('');
    const rows = section.rows.map((row, i) =>
      `<tr>${row.map((cell, j) =>
        `<td contenteditable="true" data-path="${path}.rows.${i}.${j}">${this.esc(cell)}</td>`
      ).join('')}</tr>`
    ).join('');

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="comparison-wrap">
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <p class="note" contenteditable="true" data-path="${path}.footer">${this.esc(section.footer)}</p>
      </section>`;
  },

  /* ── Steps ──────────────────────────────────────────────────────────── */

  steps(section, path) {
    const items = (section.steps || []).map((step, i) => `
      <div class="step">
        <strong contenteditable="true" data-path="${path}.steps.${i}.title">${this.esc(step.title)}</strong>
        <span   contenteditable="true" data-path="${path}.steps.${i}.body">${this.esc(step.body)}</span>
      </div>`).join('');

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="steps">${items}</div>
      </section>`;
  },

  /* ── Support ────────────────────────────────────────────────────────── */

  support(section, path) {
    const cards = section.cards.map((card, i) => {
      const cp = `${path}.cards.${i}`;
      return `
        <article class="card">
          <h3 contenteditable="true" data-path="${cp}.title">${this.esc(card.title)}</h3>
          <div class="price">
            <span contenteditable="true" data-path="${cp}.price">${this.esc(card.price)}</span>
            <small> <span contenteditable="true" data-path="${cp}.priceUnit">${this.esc(card.priceUnit)}</span></small>
          </div>
          <p contenteditable="true" data-path="${cp}.body">${this.esc(card.body)}</p>
        </article>`;
    }).join('');

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="cards">${cards}</div>
        ${this.callout(section.calloutLabel, section.calloutBody, `${path}.calloutBody`)}
      </section>`;
  },

  /* ── Terms ──────────────────────────────────────────────────────────── */

  terms(section, path) {
    const items = (section.terms || []).map((term, i) => `
      <div class="term">
        <strong contenteditable="true" data-path="${path}.terms.${i}.title">${this.esc(term.title)}</strong>
        <p      contenteditable="true" data-path="${path}.terms.${i}.body">${this.esc(term.body)}</p>
      </div>`).join('');

    const footer = section.footer
      ? `<p class="note" contenteditable="true" data-path="${path}.footer">${this.esc(section.footer)}</p>`
      : '';

    const calloutLabel = section.calloutLabel || section.callout?.label;
    const calloutBody = section.calloutBody || section.callout?.body;
    const calloutPath = section.calloutBody ? `${path}.calloutBody` : `${path}.callout.body`;
    const calloutHtml = calloutLabel
      ? this.callout(calloutLabel, calloutBody || '', calloutPath)
      : '';

    return `
      <section id="${section.id || ''}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="terms">${items}</div>
        ${calloutHtml}
        ${footer}
      </section>`;
  },

  /* ── Closing / Contact ──────────────────────────────────────────────── */

  closing(section, path) {
    const paras = (section.paragraphs || []).map((p, i) =>
      `<p contenteditable="true" data-path="${path}.paragraphs.${i}">${this.esc(p)}</p>`
    ).join('');

    const sig = section.signature || {};
    const sp  = `${path}.signature`;
    const email = sig.senderEmail || 'prince.kyei010@gmail.com';
    const phone = sig.senderPhone || '+233247380924';
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    return `
      <section id="${section.id || 'next-steps'}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="closing">
          ${paras}
          <div class="signature">
            <div class="signline">
              <strong contenteditable="true" data-path="${sp}.senderName">${this.esc(sig.senderName || 'PRINCE KYEI')}</strong><br>
              <span contenteditable="true" data-path="${sp}.senderCompany">${this.esc(sig.senderCompany || 'Web-App')}</span><br>
              ${this.icon('mail', 'contact-icon')}<a href="mailto:${this.esc(email)}" class="contact-link" contenteditable="true" data-path="${sp}.senderEmail">${this.esc(email)}</a><br>
              ${this.icon('phone', 'contact-icon')}<a href="tel:${this.esc(cleanPhone)}" class="contact-link" contenteditable="true" data-path="${sp}.senderPhone">${this.esc(phone)}</a>
            </div>
            <div class="signline">
              <strong>Client details</strong><br>
              <span contenteditable="true" data-path="${sp}.clientName">${this.esc(sig.clientName)}</span><br>
              <span contenteditable="true" data-path="${sp}.clientDate">${this.esc(sig.clientDate)}</span>
            </div>
          </div>
        </div>
      </section>`;
  },

  reClosing(section, path) {
    const paras = (section.paragraphs || []).map((p, i) =>
      `<p contenteditable="true" data-path="${path}.paragraphs.${i}">${this.esc(p)}</p>`
    ).join('');

    const sig = section.signature;
    const sp  = `${path}.signature`;
    const email = sig.senderEmail || 'prince.kyei010@gmail.com';
    const phone = sig.senderPhone || '+233247380924';
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    return `
      <section id="${section.id || 'contact'}">
        ${this.sectionHead(section.num, section.heading, section.subheading, path)}
        <div class="closing">
          ${paras}
          <div class="signature">
            <div class="signline">
              <strong contenteditable="true" data-path="${sp}.senderName">${this.esc(sig.senderName || 'PRINCE KYEI')}</strong><br>
              ${this.icon('mail', 'contact-icon')}Email: <a href="mailto:${this.esc(email)}" class="contact-link" contenteditable="true" data-path="${sp}.senderEmail">${this.esc(email)}</a><br>
              ${this.icon('phone', 'contact-icon')}Phone / WhatsApp: <a href="tel:${this.esc(cleanPhone)}" class="contact-link" contenteditable="true" data-path="${sp}.senderPhone">${this.esc(phone)}</a>
            </div>
            <div class="signline">
              <strong>${this.esc(sig.clientLabel || 'Client contact')}</strong><br>
              <strong contenteditable="true" data-path="${sp}.clientName">${this.esc(sig.clientName)}</strong><br>
              ${this.icon('map-pin', 'contact-icon')}<span contenteditable="true" data-path="${sp}.clientLocation">${this.esc(sig.clientLocation)}</span>
            </div>
          </div>
        </div>
      </section>`;
  },

  /* ── Footer ─────────────────────────────────────────────────────────── */

  footer(data) {
    return `
      <span contenteditable="true" data-path="footer.left">${this.esc(data.left)}</span>
      <span contenteditable="true" data-path="footer.right">${this.esc(data.right)}</span>`;
  },

  /* ── Back to Top Floating Component ─────────────────────────────────── */

  backToTop(options = {}) {
    const label = options.label || 'Back to top';
    const showLabel = options.showLabel !== false;
    return `
      <button id="back-to-top-btn" class="back-to-top-btn" type="button" aria-label="${this.esc(label)}" title="${this.esc(label)}">
        ${this.icon('arrow-up', 'btt-icon')}
        ${showLabel ? `<span class="btt-label">${this.esc(label)}</span>` : ''}
      </button>`;
  },

  /* ── Lead Email Templates Component ─────────────────────────────────── */

  emailModal(templates = [], activeIndex = 0, currentTplMeta = {}) {
    const list = Array.isArray(templates) && templates.length > 0 ? templates : [];
    const active = list[activeIndex] || list[0] || {
      name: 'Custom Outreach',
      subject: 'Quick idea for [Client Name]',
      body: 'Hi [Client Name],\n\n...'
    };

    const tabsHtml = list.map((t, idx) => {
      const isSel = idx === activeIndex;
      return `
        <button type="button" class="email-tab-btn${isSel ? ' active' : ''}" data-email-index="${idx}">
          ${this.icon('mail', 'tab-icon')}
          <span class="tab-title">${this.esc(t.name || `Template ${idx + 1}`)}</span>
        </button>`;
    }).join('');

    return `
      <div class="email-modal-backdrop" id="email-modal-backdrop">
        <div class="email-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="email-modal-title">
          
          <div class="email-modal-header">
            <div class="email-modal-title-wrap">
              <div class="email-badge">
                ${this.icon('mail', 'email-head-icon')}
                <span>Lead Pitch Emails</span>
                <span class="email-badge-industry">${this.esc(currentTplMeta.title || 'Client Outreach')}</span>
              </div>
              <h3 id="email-modal-title">Business Lead Outreach Templates</h3>
              <p class="email-modal-subtitle">High-converting cold pitch, proposal delivery, and free audit emails tailored for ${this.esc(currentTplMeta.category || 'this industry')}. Edit inline, copy, or create new variants.</p>
            </div>
            <button type="button" class="email-close-btn" id="email-modal-close" aria-label="Close dialog" title="Close">
              ${this.icon('x', 'email-icon-sm')}
            </button>
          </div>

          <div class="email-modal-tabs-bar">
            <div class="email-tabs-scroll">
              ${tabsHtml}
            </div>
            <div class="email-tabs-actions">
              <button type="button" class="email-btn-secondary email-btn-sm" id="email-add-btn" title="Create a new email template variant">
                ${this.icon('plus', 'btn-icon')}
                <span>New</span>
              </button>
              ${list.length > 1 ? `
              <button type="button" class="email-btn-danger email-btn-sm" id="email-delete-btn" title="Delete current template variant" data-delete-index="${activeIndex}">
                ${this.icon('trash-2', 'btn-icon')}
              </button>` : ''}
            </div>
          </div>

          <div class="email-modal-tokens-bar">
            <div class="tokens-label">Dynamic tokens:</div>
            <div class="tokens-list">
              <span class="token-pill" data-token="[Client Name]" title="Click to copy token">[Client Name]</span>
              <span class="token-pill" data-token="[Proposal Link]" title="Click to copy token">[Proposal Link]</span>
              <span class="token-pill" data-token="[Sender Name]" title="Click to copy token">[Sender Name]</span>
              <span class="token-pill" data-token="[Phone]" title="Click to copy token">[Phone]</span>
            </div>
            <button type="button" class="email-autofill-btn" id="email-autofill-btn" title="Replace tokens with actual client and proposal details from this page">
              ${this.icon('sparkles', 'btn-icon')}
              <span>Auto-fill details</span>
            </button>
          </div>

          <div class="email-modal-body">
            
            <div class="email-field-group">
              <div class="email-field-head">
                <label>Template Name</label>
                <small>Inline editable</small>
              </div>
              <div class="email-input-wrap">
                <input type="text" class="email-name-input" id="email-edit-name" value="${this.esc(active.name)}" placeholder="Template Name">
              </div>
            </div>

            <div class="email-field-group">
              <div class="email-field-head">
                <label>Subject Line</label>
                <button type="button" class="copy-field-btn" id="email-copy-subject" title="Copy subject line">
                  ${this.icon('copy', 'btn-icon')}
                  <span>Copy Subject</span>
                </button>
              </div>
              <div class="email-input-wrap">
                <div class="email-content-editable email-subject-input" id="email-edit-subject" contenteditable="true" spellcheck="false" data-email-path="subject">${this.esc(active.subject)}</div>
              </div>
            </div>

            <div class="email-field-group">
              <div class="email-field-head">
                <label>Email Body</label>
                <button type="button" class="copy-field-btn" id="email-copy-body" title="Copy body text">
                  ${this.icon('copy', 'btn-icon')}
                  <span>Copy Body</span>
                </button>
              </div>
              <div class="email-input-wrap">
                <div class="email-content-editable email-body-input" id="email-edit-body" contenteditable="true" spellcheck="false" data-email-path="body">${this.esc(active.body)}</div>
              </div>
            </div>

          </div>

          <div class="email-modal-footer">
            <div class="email-footer-info">
              <span class="email-stats" id="email-stats"></span>
              <span class="email-save-hint" id="email-save-hint">Edits saved with proposal</span>
            </div>
            <div class="email-footer-actions">
              <button type="button" class="email-btn-secondary" id="email-modal-done">Done</button>
              <button type="button" class="email-btn-primary" id="email-copy-all">
                ${this.icon('copy', 'btn-icon')}
                <span>Copy Full Email</span>
              </button>
            </div>
          </div>

        </div>
      </div>`;
  }
};
