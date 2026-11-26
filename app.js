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

  /* ---------- 导航高亮 ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[data-nav]'));
  var sections = navLinks.map(function (a) { return document.getElementById(a.getAttribute('data-nav')); }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('data-nav') === entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
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

/* ---------- 处刑区：点击锁定揭示 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.exhibit-frame'), function (frame) {
    frame.addEventListener('click', function () {
      var open = frame.classList.toggle('is-open');
      frame.setAttribute('aria-pressed', open ? 'true' : 'false');
    });
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