// Portfolio content is stored in data.json rather than hardcoded in
// index.html — edit that file to update your name, projects, skills,
// and links without touching any markup.
//
// Note: fetch() of a local file needs to be served over http(s), not
// opened directly as a file:// URL (browsers block that for security).
// GitHub Pages serves everything over https, so this works there with
// zero setup. To preview locally, run a tiny local server from this
// folder, e.g.:  python3 -m http.server 8000   then visit
// http://localhost:8000

// Escape user-editable text before inserting it as HTML, so characters
// like < or > in your data (e.g. "CLI tool for <task>") render as plain
// text instead of being parsed as markup.
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function renderNav(data) {  
  document.getElementById('nav-logo').innerHTML =
    `${escapeHtml(data.logoFirst)}<span>@</span>${escapeHtml(data.logoLast)}`;
  document.getElementById('nav-status').innerHTML =
    `<span class="dot"></span>${escapeHtml(data.status)}`;
  document.title = `${data.name} — Software Developer`;
}

function renderHero(data) {
  const h = data.hero;
  document.getElementById('hero-eyebrow').textContent = h.eyebrow;
  document.getElementById('hero-headline').innerHTML =
    `${escapeHtml(h.headline)}<span class="cursor">&nbsp;</span>`;
  document.getElementById('hero-sub').innerHTML =
    `${escapeHtml(h.sub)} <strong>${escapeHtml(h.currentCompany)}</strong>.`;
  document.getElementById('hero-stack').innerHTML =
    h.stack.map(item => `<span>${escapeHtml(item)}</span>`).join('');

  const emailLink = document.getElementById('hero-email-link');
  emailLink.href = `mailto:${data.email}`;
}

function renderWork(projects) {
  const log = document.getElementById('work-log');
  log.innerHTML = projects.map((p, i) => `
    <div class="entry" data-aos="fade-up" data-aos-delay="${i * 80}">
      <div class="hash">${escapeHtml(p.hash)}</div>
      <div>
        <div class="entry-head">
          <div class="entry-title">${escapeHtml(p.title)}</div>
          <div class="entry-links">
            ${p.repo ? `<a href="${escapeHtml(p.repo)}" target="_blank" rel="noopener">Repo</a>` : ''}
            ${p.live ? `<a href="${escapeHtml(p.live)}" target="_blank" rel="noopener">Live</a>` : ''}
          </div>
        </div>
        <p>${escapeHtml(p.description)}</p>
        <div class="entry-tags">
          ${p.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function renderAbout(about) {
  document.getElementById('about-bio').innerHTML =
    about.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');

  document.getElementById('about-skills').innerHTML =
    about.skillGroups.map(group => `
      <h3>${escapeHtml(group.title)}</h3>
      <ul>
        ${group.items.map(item => `
          <li>${escapeHtml(item.name)} <span>${escapeHtml(item.level)}</span></li>
        `).join('')}
      </ul>
    `).join('');
}

function renderFooter(data) {
  const f = data.footer;
  document.getElementById('footer-heading').textContent = f.heading;

  document.getElementById('footer-links').innerHTML = `
    <a class="btn primary" href="mailto:${escapeHtml(data.email)}">Email me</a>
    <a class="btn ghost" href="${escapeHtml(data.github)}" target="_blank" rel="noopener">GitHub</a>
    <a class="btn ghost" href="${escapeHtml(data.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
    <a class="btn ghost" href="${escapeHtml(data.resume)}" target="_blank" rel="noopener">Resume</a>
  `;

  document.getElementById('footer-meta').innerHTML = `
    <span>${escapeHtml(f.copyright)}</span>
    <span>${escapeHtml(f.tagline)}</span>
  `;
}

async function loadPortfolio() {
  try {
    const res = await fetch('data/data.json');
    if (!res.ok) throw new Error(`data.json responded with ${res.status}`);
    const data = await res.json();

    renderNav(data);
    renderHero(data);
    renderWork(data.projects);
    renderAbout(data.about);
    renderFooter(data);
  } catch (err) {
    console.error('Could not load portfolio content from data.json:', err);
    document.body.innerHTML =
      '<p style="font-family:monospace;padding:40px;">' +
      'Couldn\'t load data.json. If you opened this file directly ' +
      '(file://), run a local server instead — see the comment at the ' +
      'top of script.js — or just publish to GitHub Pages, where it ' +
      'works automatically.</p>';
    return;
  }

  // AOS scans the DOM for [data-aos] elements at init time, so it has
  // to run after the content above has been inserted, not before.
  AOS.init({
    duration: 650,
    easing: 'ease-out-quart',
    once: true,
    offset: 60,
    disable: function () {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  });
}

document.addEventListener('DOMContentLoaded', loadPortfolio);