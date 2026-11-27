/* ===========================================================
   RealQuickJS Engine — site behaviour
   =========================================================== */
(function () {
  'use strict';

  /* ---------- 主题：黑白反转 ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var STORE = 'rqjs-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0b0b' : '#f4f3ef');
  }

  var saved = null;
  try { saved = localStorage.getItem(STORE); } catch (e) {}
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORE, next); } catch (e) {}
    });
  }

  /* ---------- 滚动进度条 ---------- */
  var bar = document.getElementById('progress');
  function onScroll() {
    if (!bar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 入场动画 ---------- */
  var revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
        el.style.transitionDelay = Math.min(siblings, 6) * 45 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 侧边目录高亮 ---------- */
  var railLinks = Array.prototype.slice.call(document.querySelectorAll('.section-rail a[data-rail]'));
  var railTargets = railLinks.map(function (a) { return document.getElementById(a.getAttribute('data-rail')); }).filter(Boolean);
  if ('IntersectionObserver' in window && railTargets.length) {
    var railSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        railLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('data-rail') === entry.target.id);
        });
      });
    }, { rootMargin: '-20% 0px -68% 0px', threshold: 0 });
    railTargets.forEach(function (t) { railSpy.observe(t); });
  }

  /* ---------- 复制按钮 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.copy-btn'), function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      var done = function () {
        var old = btn.textContent;
        btn.textContent = 'COPIED';
        setTimeout(function () { btn.textContent = old; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
    });
  });

  /* ---------- engine.txt 切换演示 ---------- */
  var ENGINE_INFO = {
    body: { label: 'body', desc: '本仓 fork', src: 'source_body/body/', assets: 'assets/body/', mods: 'mods/body/' },
    vanilla: { label: 'vanilla', desc: '原版 PE 1.0.4', src: 'source_vanilla/vanilla/', assets: 'assets/1.0.4/', mods: 'mods/1.0.4/' },
    pe063: { label: 'pe063', desc: 'Psych Engine 0.6.3', src: 'source_063/pe063/', assets: 'assets/0.6.3/', mods: 'mods/0.6.3/' }
  };
  var switchRows = Array.prototype.slice.call(document.querySelectorAll('.switcher-row'));
  var switchState = document.getElementById('switcher-state');
  var switchFoot = document.getElementById('switcher-foot');

  switchRows.forEach(function (row) {
    row.addEventListener('click', function () {
      var key = row.getAttribute('data-engine');
      var info = ENGINE_INFO[key];
      if (!info) return;

      switchRows.forEach(function (r) { r.setAttribute('aria-pressed', 'false'); });
      row.setAttribute('aria-pressed', 'true');
      if (switchState) switchState.textContent = '当前 · ' + info.label;
      if (switchFoot) switchFoot.textContent = info.desc + ' → ' + info.mods + ' · 重启后生效';

      var target = document.querySelector('.engine-row[data-engine="' + key + '"]');
      if (target) {
        document.querySelectorAll('.engine-row.is-target').forEach(function (el) {
          el.classList.remove('is-target');
        });
        target.classList.add('is-target');
      }
    });
  });

/* ---------- 处刑区：第一次点开黑布，第二次拉开左右抽屉 ---------- */
  var scenes = Array.prototype.slice.call(document.querySelectorAll('.drawer-scene'));
  var lastScene = null;

  function sceneLeftWidth(scene) {
    var left = scene.querySelector('.drawer-left');
    return left ? left.offsetWidth : 0;
  }

  function resetRight(drawer) {
    if (!drawer) return;
    if (typeof drawer.__resetWant === 'function') drawer.__resetWant();
    drawer.style.width = '';
    drawer.classList.remove('is-wide');
  }

  function closeScene(scene, restoreFocus) {
    if (!scene || !scene.classList.contains('is-open')) return;
    var trigger = document.querySelector('.exhibit-frame[aria-controls="' + scene.id + '"]');
    scene.classList.remove('is-open');
    scene.setAttribute('inert', '');
    document.body.classList.remove('is-dragging');
    if (trigger) {
      trigger.classList.remove('is-open');
      trigger.setAttribute('aria-pressed', 'false');
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus !== false && lastScene === scene) {
        requestAnimationFrame(function () { trigger.focus({ preventScroll: true }); });
      }
    }
    lastScene = null;
    if (!document.querySelector('.drawer-scene.is-open')) {
      document.body.classList.remove('is-locked');
    }
  }

  function openScene(scene, trigger) {
    if (!scene) return;
    scenes.forEach(function (other) { if (other !== scene) closeScene(other, false); });
    scene.removeAttribute('inert');
    resetRight(scene.querySelector('.drawer-right'));
    scene.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    lastScene = scene;
    var btn = scene.querySelector('.drawer-close');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (btn && scene.classList.contains('is-open')) btn.focus({ preventScroll: true });
      });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.exhibit-frame'), function (frame) {
    frame.addEventListener('click', function () {
      if (frame.classList.contains('is-open')) {
        openScene(document.getElementById(frame.getAttribute('aria-controls')), frame);
        return;
      }
      frame.classList.add('is-open');
      frame.setAttribute('aria-pressed', 'true');
    });
  });

  scenes.forEach(function (scene) {
    scene.addEventListener('click', function (event) {
      if (event.target.closest('.drawer-close') || event.target.classList.contains('drawer-scrim')) {
        closeScene(scene);
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    /* 有预览窗时 Esc 先关最上面那个窗，抽屉留着 */
    if (document.querySelector('.win')) return;
    var open = document.querySelector('.drawer-scene.is-open');
    if (open) closeScene(open);
  });

  /* 右抽屉：拖动把柄调宽，拉到最左即全屏 */
  scenes.forEach(function (scene) {
    var drawer = scene.querySelector('.drawer-right');
    var grip = scene.querySelector('.drawer-grip');
    if (!drawer || !grip) return;

    var dragging = false, startX = 0, startW = 0, leftW = 0;
    var wantW = null; // 用户「想要」的宽度，和实际渲染宽度分开，方便窗口变化后重算
    drawer.__resetWant = function () { wantW = null; };

    function widthBounds() {
      leftW = sceneLeftWidth(scene);
      var available = window.innerWidth - leftW;
      return { min: Math.min(320, available), max: Math.max(available, 320) };
    }

    function applyWidth(w) {
      var bounds = widthBounds();
      wantW = w;
      var clamped = Math.max(bounds.min, Math.min(bounds.max, w));
      if (clamped >= bounds.max - 2) {
        drawer.style.width = '100%';
        drawer.classList.add('is-wide');
        return;
      }
      drawer.classList.remove('is-wide');
      drawer.style.width = clamped + 'px';
    }

    grip.addEventListener('pointerdown', function (event) {
      if (event.button !== undefined && event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startW = drawer.getBoundingClientRect().width;
      document.body.classList.add('is-dragging');
      grip.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    grip.addEventListener('pointermove', function (event) {
      if (!dragging) return;
      applyWidth(startW + (startX - event.clientX));
    });

    function endDrag(event) {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove('is-dragging');
      if (event && event.pointerId !== undefined && grip.hasPointerCapture(event.pointerId)) {
        grip.releasePointerCapture(event.pointerId);
      }
    }
    grip.addEventListener('pointerup', endDrag);
    grip.addEventListener('pointercancel', endDrag);

    grip.addEventListener('keydown', function (event) {
      var step = event.shiftKey ? 120 : 40;
      var current = drawer.getBoundingClientRect().width;
      if (event.key === 'ArrowLeft') { applyWidth(current + step); event.preventDefault(); }
      else if (event.key === 'ArrowRight') { applyWidth(current - step); event.preventDefault(); }
      else if (event.key === 'Home') { applyWidth(widthBounds().max); event.preventDefault(); }
      else if (event.key === 'End') { applyWidth(320); event.preventDefault(); }
    });

    window.addEventListener('resize', function () {
      // 窄屏（<=720px）抽屉是整宽上下排列，把柄也隐藏了，直接丢掉手动宽度
      if (window.innerWidth <= 720) {
        wantW = null;
        if (drawer.style.width) resetRight(drawer);
        return;
      }
      if (wantW === null) return;
      applyWidth(wantW);
    });
  });

  /* 档案夹：点一层展开一层 */
  Array.prototype.forEach.call(document.querySelectorAll('.folder-tab, .subfolder-tab'), function (tab) {
    tab.addEventListener('click', function () {
      var item = tab.parentElement;
      var open = item.classList.toggle('is-open');
      tab.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });


  /* -----------------------------------------------------------
     证据预览窗：Windows 风格，可多开 / 最小化 / 最大化 / 关闭
     ----------------------------------------------------------- */
  var EV = (window.RQ_EVIDENCE && window.RQ_EVIDENCE.files) || [];
  var EV_MAP = {};
  EV.forEach(function (f) { EV_MAP[f.id] = f; });

  var winLayer = document.getElementById('win-layer');
  var winDock = document.getElementById('win-dock');
  var winSeq = 0;
  var winZ = 90;
  var winList = [];

  function mkEl(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function fmtSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function refreshDock() {
    if (!winDock) return;
    winDock.innerHTML = '';
    var mins = winList.filter(function (w) { return w.isMin; });
    if (!mins.length) { winDock.hidden = true; return; }
    winDock.hidden = false;
    mins.forEach(function (w) {
      var b = mkEl('button', 'dock-item');
      b.type = 'button';
      b.appendChild(mkEl('span', null, w.title));
      b.addEventListener('click', function () { restoreWin(w); });
      winDock.appendChild(b);
    });
  }

  function focusWin(w) {
    winZ += 1;
    w.node.style.zIndex = String(winZ);
    w.node.classList.add('is-focus');
    winList.forEach(function (o) { if (o !== w) o.node.classList.remove('is-focus'); });
  }

  function restoreWin(w) {
    if (!w || !w.isMin) return;
    w.isMin = false;
    var node = w.node;
    node.classList.remove('is-min');
    node.classList.add('is-restoring');
    /* 两帧之后去掉起始态，让 display 已经生效再补间，避免还原时"瞬移" */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { node.classList.remove('is-restoring'); });
    });
    node.style.zIndex = String(++winZ);
    refreshDock();
    focusWin(w);
  }

  function minimizeWin(w) {
    if (!w || w.isMin) return;
    var node = w.node;
    w.isMin = true;
    node.classList.add('is-minimizing');
    refreshDock();
    window.setTimeout(function () {
      if (!w.isMin) return;
      node.classList.remove('is-minimizing');
      node.classList.add('is-min');
    }, 240);
  }

  function closeWin(w) {
    if (!w || w.closing) return;
    w.closing = true;
    var node = w.node;
    node.classList.remove('is-restoring', 'is-minimizing');
    node.classList.remove('is-min');
    node.classList.add('is-closing');
    var removed = false;
    function drop() {
      if (removed) return;
      removed = true;
      node.remove();
    }
    window.setTimeout(drop, 280);
    node.addEventListener('transitionend', function (e) {
      if (e.target === node && e.propertyName === 'opacity') drop();
    });
    winList = winList.filter(function (o) { return o !== w; });
    if (w.trigger) {
      w.trigger.classList.remove('is-active');
      try { w.trigger.focus({ preventScroll: true }); } catch (e) {}
    }
    refreshDock();
  }

  function applyMax(w, on) {
    w.isMax = on;
    var node = w.node;
    node.classList.toggle('is-max', on);
    if (on) {
      node.style.left = '0px';
      node.style.top = '0px';
      node.style.width = '100vw';
      node.style.height = '100vh';
    } else {
      node.style.left = w.geo.x + 'px';
      node.style.top = w.geo.y + 'px';
      node.style.width = w.geo.w + 'px';
      node.style.height = w.geo.h + 'px';
    }
    var key = node.querySelector('[data-win="max"]');
    if (key) {
      key.setAttribute('aria-label', on ? '还原窗口' : '最大化窗口');
      key.innerHTML = on ? '<svg class="win-glyph" viewBox="0 0 10 10" aria-hidden="true"><rect x="1.2" y="3.2" width="5.6" height="5.6" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M3.4 3.2V1.2h5.4v5.4H7.2" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>'
                       : '<svg class="win-glyph" viewBox="0 0 10 10" aria-hidden="true"><rect x="1.2" y="1.2" width="7.6" height="7.6" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
    }
    focusWin(w);
  }

  function openWin(file, trigger) {
    if (!file || !winLayer) return null;
    var seq = ++winSeq;
    var node = mkEl('div', 'win');
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-label', file.name);

    var vw = window.innerWidth, vh = window.innerHeight;
    var w = Math.min(760, Math.max(320, Math.round(vw * 0.62)));
    var h = Math.min(620, Math.max(260, Math.round(vh * 0.7)));
    var x = Math.max(12, Math.round((vw - w) / 2 + ((seq % 5) - 2) * 26));
    var y = Math.max(12, Math.round((vh - h) / 2 + ((seq % 5) - 2) * 22));
    node.style.left = x + 'px';
    node.style.top = y + 'px';
    node.style.width = w + 'px';
    node.style.height = h + 'px';

    var bar = mkEl('div', 'win-bar');
    bar.appendChild(mkEl('span', 'win-dot'));
    bar.appendChild(mkEl('span', 'win-title', file.name));
    var keys = mkEl('div', 'win-keys');

    var minBtn = mkEl('button', 'win-key');
    minBtn.type = 'button';
    minBtn.dataset.win = 'min';
    minBtn.setAttribute('aria-label', '最小化');
    minBtn.innerHTML = '<svg class="win-glyph" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.4 5h7.2" stroke="currentColor" stroke-width="1.3"/></svg>';

    var maxBtn = mkEl('button', 'win-key');
    maxBtn.type = 'button';
    maxBtn.dataset.win = 'max';
    maxBtn.setAttribute('aria-label', '最大化窗口');
    maxBtn.innerHTML = '<svg class="win-glyph" viewBox="0 0 10 10" aria-hidden="true"><rect x="1.2" y="1.2" width="7.6" height="7.6" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';

    var closeBtn = mkEl('button', 'win-key');
    closeBtn.type = 'button';
    closeBtn.dataset.win = 'close';
    closeBtn.setAttribute('aria-label', '关闭窗口');
    closeBtn.innerHTML = '<svg class="win-glyph" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.4 1.4l7.2 7.2M8.6 1.4L1.4 8.6" stroke="currentColor" stroke-width="1.3"/></svg>';

    keys.appendChild(minBtn); keys.appendChild(maxBtn); keys.appendChild(closeBtn);
    bar.appendChild(keys);
    node.appendChild(bar);

    var body = mkEl('div', 'win-body');
    if (file.kind === 'image') {
      var img = new Image();
      img.src = file.src;
      img.alt = file.name;
      img.decoding = 'async';
      body.appendChild(img);
      body.addEventListener('click', function () { body.classList.toggle('is-actual'); });
    } else {
      body.appendChild(mkEl('pre', 'win-text', file.text || '（空文件）'));
    }
    node.appendChild(body);

    var status = mkEl('div', 'win-status');
    status.appendChild(mkEl('span', null, file.kind === 'image' ? (file.w + ' × ' + file.h) : 'TEXT'));
    status.appendChild(mkEl('span', null, fmtSize(file.size)));
    if (file.date) status.appendChild(mkEl('span', null, file.date));
    if (file.kind === 'image') status.appendChild(mkEl('span', null, '点击图片 · 1:1'));
    node.appendChild(status);

    node.classList.add('is-opening');
    winLayer.appendChild(node);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { node.classList.remove('is-opening'); });
    });

    var state = {
      node: node, title: file.name, file: file, trigger: trigger || null,
      isMax: false, isMin: false, seq: seq,
      geo: { x: x, y: y, w: w, h: h }
    };
    winList.push(state);
    focusWin(state);

    minBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      minimizeWin(state);
    });
    maxBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      applyMax(state, !state.isMax);
    });
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeWin(state);
    });
    bar.addEventListener('dblclick', function (e) {
      if (e.target.closest('.win-key')) return;
      applyMax(state, !state.isMax);
    });
    node.addEventListener('pointerdown', function () { focusWin(state); });

    var dragState = null;
    bar.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || e.target.closest('.win-key') || state.isMax) return;
      dragState = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: parseFloat(node.style.left) || 0, oy: parseFloat(node.style.top) || 0 };
      node.style.transition = 'none';
      try { bar.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    bar.addEventListener('pointermove', function (e) {
      if (!dragState || e.pointerId !== dragState.id) return;
      var nx = dragState.ox + (e.clientX - dragState.sx);
      var ny = dragState.oy + (e.clientY - dragState.sy);
      nx = Math.max(-node.offsetWidth + 90, Math.min(window.innerWidth - 60, nx));
      ny = Math.max(0, Math.min(window.innerHeight - 44, ny));
      node.style.left = nx + 'px';
      node.style.top = ny + 'px';
      state.geo.x = nx; state.geo.y = ny;
    });
    function endDrag(e) {
      if (!dragState || (e && e.pointerId !== dragState.id)) return;
      dragState = null;
      node.style.transition = '';
      try { if (e && bar.hasPointerCapture(e.pointerId)) bar.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    bar.addEventListener('pointerup', endDrag);
    bar.addEventListener('pointercancel', endDrag);

    if (trigger) trigger.classList.add('is-active');
    var cbtn = closeBtn;
    try { cbtn.focus({ preventScroll: true }); } catch (e) {}
    return state;
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-ev]'), function (card) {
    card.addEventListener('click', function () {
      var f = EV_MAP[card.getAttribute('data-ev')];
      if (f) openWin(f, card);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !winList.length) return;
    var top = winList.slice().sort(function (a, b) { return b.seq - a.seq; })[0];
    if (top) closeWin(top);
  });

  /* ---------- 档案：键盘展开全部 ---------- */
  var archiveItems = Array.prototype.slice.call(document.querySelectorAll('.archive-item'));
  archiveItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      // 同一时间只开一条，避免长报告把页面撑爆
      archiveItems.forEach(function (other) {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  /* ---------- 年份 ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Releases ---------- */
  var REPOS = ['Wqawa/FNF-PE_RealQuickJs_Engine', 'Wqawa/realQuickJS_Engine'];
  var PER_PAGE = 10;

  function el(id) { return document.getElementById(id); }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate());
  }

  function sizes(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  function emptyLatest(message) {
    var box = el('latest-assets');
    if (box) {
      box.innerHTML = '';
      var span = document.createElement('span');
      span.className = 'muted';
      span.textContent = message;
      box.appendChild(span);
    }
  }

  function renderLatest(release, repo) {
    var name = el('latest-name');
    var date = el('latest-date');
    if (!name || !date) return;

    if (!release) {
      name.textContent = '暂无 Release';
      date.textContent = '';
      emptyLatest('发一版 Release 后，这里会自动出现下载按钮。');
      return;
    }

    name.textContent = release.name || release.tag_name;
    date.textContent = formatDate(release.published_at);

    var assets = (release.assets || []).filter(function (a) { return a.browser_download_url; });
    var box = el('latest-assets');
    if (!box) return;

    if (assets.length === 0) {
      emptyLatest('这个 Release 没有附带文件，去 GitHub 上看看。');
      return;
    }

    box.innerHTML = '';
    assets.forEach(function (a) {
      var link = document.createElement('a');
      link.className = 'asset';
      link.href = a.browser_download_url;

      var label = document.createElement('b');
      label.textContent = a.name;
      var size = document.createElement('small');
      size.textContent = sizes(a.size);

      link.appendChild(label);
      link.appendChild(size);
      box.appendChild(link);
    });
  }

  function renderHistory(releases) {
    var list = el('release-list');
    if (!list) return;

    var rows = releases.filter(function (r) { return !r.draft; }).slice(0, PER_PAGE);
    if (rows.length === 0) {
      list.innerHTML = '';
      var span = document.createElement('span');
      span.className = 'muted';
      span.textContent = '暂无历史版本。';
      list.appendChild(span);
      return;
    }

    list.innerHTML = '';
    rows.forEach(function (r) {
      var row = document.createElement('div');
      row.className = 'release-row';

      var title = document.createElement('span');
      title.textContent = (r.name || r.tag_name) + (r.prerelease ? ' · 预览' : '');

      var right = document.createElement('span');
      var link = document.createElement('a');
      link.href = r.html_url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = '查看 ↗';
      right.appendChild(link);
      right.appendChild(document.createTextNode('  ' + formatDate(r.published_at)));

      row.appendChild(title);
      row.appendChild(right);
      list.appendChild(row);
    });
  }

  function fetchReleases(repo) {
    return fetch('https://api.github.com/repos/' + repo + '/releases?per_page=' + PER_PAGE, {
      headers: { Accept: 'application/vnd.github+json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function load() {
    var i = 0;
    function next() {
      if (i >= REPOS.length) {
        renderLatest(null, REPOS[0]);
        var list = el('release-list');
        if (list) {
          list.innerHTML = '';
          var span = document.createElement('span');
          span.className = 'muted';
          span.textContent = '读取失败，可能是网络问题或 API 限流。';
          list.appendChild(span);
        }
        return;
      }
      var repo = REPOS[i++];
      fetchReleases(repo).then(function (releases) {
        if (!releases.length) { next(); return; }
        var stable = releases.find(function (r) { return !r.draft && !r.prerelease; });
        renderLatest(stable || releases[0], repo);
        renderHistory(releases);
      }).catch(function () { next(); });
    }
    next();
  }

  load();
})();