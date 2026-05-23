const ICONS = {
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
    soundcloud: '<svg viewBox="0 0 24 24"><path d="M11.56 8.87V17h8.76c1.85 0 3.36-1.5 3.36-3.34 0-1.84-1.51-3.34-3.36-3.34-.37 0-.73.06-1.06.17C18.92 7.01 16.16 4.5 12.8 4.5c-.85 0-1.65.15-2.4.43v12.07h1.16V8.87zm-2.32-.19v8.32h1.16V8.02c-.4.2-.78.42-1.16.66zm-2.32 1.8v6.52h1.16V11.2c-.4.23-.78.5-1.16.78v.5zm-2.32 2.15v4.37h1.16v-4.96c-.42.17-.8.37-1.16.59zm-2.32 1.1v3.27H3.4v-3.6c-.38.08-.76.18-1.12.33z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
};

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function loadFonts(fonts) {
    const families = [fonts.heading, fonts.body].filter(Boolean).map(f => f.replace(/ /g, '+')).join('&family=');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
    document.head.appendChild(link);
    document.documentElement.style.setProperty('--font-heading', `'${fonts.heading}', sans-serif`);
    document.documentElement.style.setProperty('--font-body', `'${fonts.body}', sans-serif`);
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
}

function applyBackground(bg) {
    document.body.setAttribute('data-bg', bg);
    if (bg === 'particles') {
        initParticles();
    }
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const style = getComputedStyle(document.body);
        const color = style.getPropertyValue('--accent').trim() || '#ffffff';

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();
    window.addEventListener('resize', () => { resize(); createParticles(); });
}

function renderHeader(header) {
    const el = document.getElementById('header');
    let html = '';
    if (header.mode === 'image' || header.mode === 'both') {
        html += `<img class="artist-logo" src="${header.logo}" alt="${header.name}">`;
    }
    if (header.mode === 'text' || header.mode === 'both') {
        html += `<h1 class="artist-name">${header.name}</h1>`;
    }
    el.innerHTML = html;
}

function renderBio(bio) {
    document.getElementById('bio').textContent = bio;
}

function renderLinks(links) {
    const el = document.getElementById('links');
    el.innerHTML = links.map(link => `
        <a class="link-btn${link.half ? ' link-btn--half' : ''}" href="${link.url}" target="_blank" rel="noopener noreferrer">
            ${ICONS[link.icon] || ''}
            <span>${link.name}</span>
        </a>
    `).join('');
}

function renderEvents(events) {
    const el = document.getElementById('events');
    if (!events || events.length === 0) {
        el.style.display = 'none';
        return;
    }
    let html = '<h2>NEXT EVENTS</h2>';
    html += events.map(event => `
        <a class="event-card" href="${event.ticketUrl}" target="_blank" rel="noopener noreferrer">
            <img class="event-flyer" src="${event.flyerImage}" alt="${event.name}" onerror="this.style.display='none'">
            <div class="event-info">
                <div class="event-name">${event.name}</div>
                <div class="event-details">${formatDate(event.date)} · ${event.venue}</div>
                ${event.location ? `<div class="event-location">${event.location}</div>` : ''}
            </div>
        </a>
    `).join('');
    el.innerHTML = html;
}

function renderGalleries(galleries) {
    const el = document.getElementById('galleries');
    if (!el) return;
    if (!galleries || galleries.length === 0) {
        el.style.display = 'none';
        return;
    }
    let html = '<h2>GALLERIES</h2>';
    html += galleries.map(gallery => `
        <a class="event-card gallery-card" href="galleries/index.html?gallery=${gallery.slug}">
            ${gallery.coverImage ? `<img class="event-flyer" src="${gallery.coverImage}" alt="${gallery.name}">` : ''}
            <div class="event-info">
                <div class="event-name">${gallery.name}</div>
                <div class="event-details">${formatDate(gallery.date)}${gallery.details ? ` · ${gallery.details}` : ''}</div>
            </div>
        </a>
    `).join('');
    el.innerHTML = html;
}

async function init() {
    const configFile = document.body.getAttribute('data-config') || 'config.json';
    const res = await fetch(configFile);
    const config = await res.json();

    document.title = config.header.name;
    loadFonts(config.fonts);
    applyTheme(config.theme);
    applyBackground(config.background);
    const page = document.body.getAttribute('data-page') || 'home';

    renderHeader(config.header);
    if (page === 'home') {
        renderBio(config.bio);
        renderLinks(config.links);
        renderEvents(config.events);
        renderGalleries(config.galleries);
    }
}

init();
