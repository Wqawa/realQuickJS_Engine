// 下载区直接读 GitHub Releases，不用后端。改 repo 名就行。
const REPO = 'Wqawa/FNF-PE_RealQuickJs_Engine';
const API = 'https://api.github.com/repos/' + REPO + '/releases';

function el(id) {
  return document.getElementById(id);
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch (e) {
    return '';
  }
}

function sizes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function renderLatest(release) {
  const name = el('latest-name');
  const date = el('latest-date');
  const box = el('latest-assets');
  if (!name || !date || !box) return;

  if (!release) {
    name.textContent = '暂无 Release';
    date.textContent = '';
    box.innerHTML = '<span class="muted">发一个 Release 后这里会自动出现下载按钮。</span>';
    return;
  }

  name.textContent = release.name || release.tag_name;
  date.textContent = formatDate(release.published_at);

  const assets = (release.assets || []).filter(a => a.browser_download_url);
  if (assets.length === 0) {
    box.innerHTML = '<span class="muted">这个 Release 没有附带文件。</span>';
    return;
  }

  box.innerHTML = '';
  assets.forEach(function (a) {
    const link = document.createElement('a');
    link.className = 'asset';
    link.href = a.browser_download_url;

    const label = document.createElement('b');
    label.textContent = a.name;
    const size = document.createElement('small');
    size.textContent = sizes(a.size);

    link.appendChild(label);
    link.appendChild(size);
    box.appendChild(link);
  });
}

function renderHistory(releases) {
  const list = el('release-list');
  if (!list) return;

  const rows = releases.filter(function (r) {
    return !r.draft;
  }).slice(0, 10);

  if (rows.length === 0) {
    list.innerHTML = '<span class="muted">暂无历史版本。</span>';
    return;
  }

  list.innerHTML = '';
  rows.forEach(function (r) {
    const row = document.createElement('div');
    row.className = 'release-row';

    const title = document.createElement('span');
    title.textContent = r.name || r.tag_name;
    if (r.prerelease) title.textContent += ' (预览)';

    const right = document.createElement('span');
    const link = document.createElement('a');
    link.href = r.html_url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = '查看 →';
    right.appendChild(link);
    right.appendChild(document.createTextNode('  ' + formatDate(r.published_at)));

    row.appendChild(title);
    row.appendChild(right);
    list.appendChild(row);
  });
}

async function load() {
  try {
    const response = await fetch(API + '?per_page=10', {
      headers: { 'Accept': 'application/vnd.github+json' }
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const releases = await response.json();

    const stable = releases.find(function (r) {
      return !r.draft && !r.prerelease;
    });
    renderLatest(stable || releases[0] || null);
    renderHistory(releases);
  } catch (e) {
    renderLatest(null);
    const list = el('release-list');
    if (list) list.innerHTML = '<span class="muted">读取失败：' + e.message + '。可能是网络问题或 API 限流。</span>';
  }
}

load();
