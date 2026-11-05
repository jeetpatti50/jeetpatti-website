// JeetPatti shared UI: icons, toast, menus, app shell, card rendering.
(function () {
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    spade: '<path fill="currentColor" stroke="none" d="M12 2.5c-2.6 3.6-7.5 6.6-7.5 10.6a4.1 4.1 0 0 0 6.9 3c-.3 2-1.2 3.6-2.6 5.4h6.4c-1.4-1.8-2.3-3.4-2.6-5.4a4.1 4.1 0 0 0 6.9-3c0-4-4.9-7-7.5-10.6z"/>',
    wallet: '<path d="M19 7V5a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-4a2 2 0 0 0 0 4h4v2a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6"/><circle cx="17" cy="15" r=".6" fill="currentColor"/>',
    bank: '<path d="M3 21h18M4 10h16M5 10v8M9.5 10v8M14.5 10v8M19 10v8M12 3l9 5H3z"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M14.5 8.5h-5M14.5 11.5h-5M10 8.5c3 0 3 3 0 3l4 4"/>',
    coins: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    mobile: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9M12 8S11 3 8 3a2.5 2.5 0 0 0 0 5zM12 8s1-5 4-5a2.5 2.5 0 0 1 0 5z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-5"/>',
    tick: '<path d="M20 6 9 17l-5-5"/>',
    x: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M17.9 17.9A10 10 0 0 1 12 20c-7 0-10-8-10-8a18 18 0 0 1 5-5.9M9.9 4.2A9 9 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-2.2 3.2M9.9 9.9a3 3 0 0 0 4.2 4.2M2 2l20 20"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 21 2M18 5l2 2M15 8l2 2"/>',
    star: '<path d="m12 2 3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z"/>',
    crown: '<path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5z"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    right: '<path d="M9 18l6-6-6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    whatsapp: '<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l1-1.6-2-1-1 .8a4.4 4.4 0 0 1-2.2-2.2l.8-1-1-2z"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    upi: '<path d="M4 4h16v16H4z"/><path d="M8 8h3v3H8zM13 8h3v3h-3zM8 13h3v3H8zM13 13h3v3h-3z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  };
  const icon = (name, cls) =>
    '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || '') + '</svg>';

  // Replace <i data-i="name"></i> placeholders with inline SVG icons.
  function hydrateIcons(root) {
    (root || document).querySelectorAll('i[data-i]').forEach(el => {
      const t = document.createElement('span');
      t.innerHTML = icon(el.dataset.i, el.className);
      el.replaceWith(t.firstChild);
    });
  }

  // ── Playing card markup: accepts "A♠" or {v:'A', s:'♠'} ──
  const RED = ['♥', '♦'];
  function card(c, w) {
    let v, s;
    if (typeof c === 'string') { s = c.slice(-1); v = c.slice(0, -1); } else { v = c.v; s = c.s; }
    const style = w ? ' style="--w:' + w + 'px"' : '';
    return '<div class="pcard' + (RED.includes(s) ? ' red' : '') + '"' + style + '>' +
      '<div class="pc-c tl">' + v + '<i>' + s + '</i></div><div class="pc-s">' + s + '</div>' +
      '<div class="pc-c br">' + v + '<i>' + s + '</i></div></div>';
  }

  // ── Toast ──
  function toast(msg, ic) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.innerHTML = (ic === false ? '' : icon(ic || 'check')) + '<span>' + msg + '</span>';
    t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3000);
  }

  // ── Mobile menu ──
  function toggleMenu() { const m = document.getElementById('mobile-menu'); if (m) m.classList.toggle('open'); }
  document.addEventListener('click', e => {
    const m = document.getElementById('mobile-menu'), h = document.querySelector('.hamburger');
    if (m && h && !m.contains(e.target) && !h.contains(e.target)) m.classList.remove('open');
  });

  function logout() {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    window.location.href = 'login.html';
  }

  // ── Current user (single shared fetch) ──
  let mePromise = null;
  function me() {
    if (mePromise) return mePromise;
    const token = localStorage.getItem('token');
    mePromise = fetch('/api/auth/me', { headers: { Authorization: token } })
      .then(r => { if (!r.ok) throw new Error('auth'); return r.json(); })
      .then(u => { fillUser(u); return u; });
    return mePromise;
  }
  function fillUser(u) {
    const chips = (u.chips || 0).toLocaleString('en-IN');
    document.querySelectorAll('.js-chips').forEach(e => e.textContent = chips);
    document.querySelectorAll('.js-name').forEach(e => e.textContent = u.name || 'Player');
    document.querySelectorAll('.js-first').forEach(e => e.textContent = (u.name || 'Player').split(' ')[0]);
    document.querySelectorAll('.js-initial').forEach(e => e.textContent = (u.name || 'P').charAt(0).toUpperCase());
    document.querySelectorAll('.js-contact').forEach(e => e.textContent = u.phone ? '+91 ' + u.phone : (u.email || ''));
  }

  // ── App shell for logged-in pages: <body data-page="dashboard"> ──
  const NAV = [
    { id: 'dashboard', href: 'dashboard.html', i: 'home', t: 'Home' },
    { id: 'buy', href: 'buy-chips.html', i: 'wallet', t: 'Add Chips' },
    { id: 'sell', href: 'sell-chips.html', i: 'bank', t: 'Withdraw' },
    { id: 'history', href: 'history.html', i: 'history', t: 'History' },
    { id: 'profile', href: 'profile.html', i: 'user', t: 'Profile' },
  ];
  function shell() {
    const page = document.body.dataset.page;
    if (!page) return;
    const top = document.getElementById('topbar');
    if (top) {
      top.className = 'navbar';
      top.innerHTML =
        '<a href="dashboard.html" class="brand"><span class="brand-mark">♠</span><span class="wm">Jeet<b>Patti</b></span></a>' +
        '<div class="nav-right">' +
          '<a href="buy-chips.html" class="chip-pill" title="Add chips"><span class="coin">₹</span><span class="js-chips">—</span><span class="plus">+</span></a>' +
          '<a href="game.html" class="btn btn-ruby btn-sm hide-sm">' + icon('spade') + ' Play Now</a>' +
          '<button class="btn btn-ghost btn-sm hide-sm" onclick="JP.logout()">' + icon('logout') + '</button>' +
        '</div>';
    }
    const sb = document.getElementById('sidebar');
    if (sb) {
      sb.className = 'sidebar';
      sb.innerHTML =
        '<div class="sidebar-user"><div class="avatar js-initial">P</div><div style="min-width:0"><div class="u-name js-name">Loading…</div><div class="u-sub js-contact"></div></div></div>' +
        '<nav class="snav">' + NAV.map(n => '<a href="' + n.href + '"' + (n.id === page ? ' class="active"' : '') + '>' + icon(n.i) + n.t + '</a>').join('') +
        '<a href="#" onclick="JP.logout();return false;">' + icon('logout') + 'Logout</a></nav>' +
        '<a href="game.html" class="btn btn-ruby btn-full sb-play">' + icon('spade') + ' Play Teen Patti</a>' +
        '<div class="sb-foot"><span class="age-badge">18+</span>Play responsibly. ₹1 = 1 Chip</div>';
    }
    const tb = document.getElementById('tabbar');
    if (tb) {
      tb.className = 'bottom-nav';
      const tab = (id, href, i, t) => '<a href="' + href + '"' + (id === page ? ' class="active"' : '') + '><span class="bn-icon">' + icon(i) + '</span>' + t + '</a>';
      tb.innerHTML = tab('dashboard', 'dashboard.html', 'home', 'Home') + tab('buy', 'buy-chips.html', 'wallet', 'Add') +
        '<a href="game.html" class="bn-play"><span class="bn-icon">' + icon('spade') + '</span>Play</a>' +
        tab('history', 'history.html', 'history', 'History') + tab('profile', 'profile.html', 'user', 'Profile');
    }
  }

  // ── Scroll reveal ──
  function reveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach(e => io.observe(e));
  }

  window.JP = { icon, hydrateIcons, card, toast, toggleMenu, logout, me, fillUser };
  window.toggleMenu = toggleMenu;
  window.logout = logout;

  shell();
  hydrateIcons();
  reveal();
})();
