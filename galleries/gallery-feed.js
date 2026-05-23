(function () {
    const grid = document.getElementById('photo-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const albumLink = document.getElementById('gallery-album-link');
    const galleryTitle = document.getElementById('gallery-title');
    let photos = [];
    let currentIndex = 0;

    function getGallerySlug() {
        const params = new URLSearchParams(location.search);
        const fromQuery = params.get('gallery');
        if (fromQuery) return fromQuery;

        const match = location.pathname.match(/\/galleries\/([^/]+)\/?$/);
        if (match && match[1] !== 'index.html') return match[1];

        return null;
    }

    function formatUrl(template, id) {
        return template.replace('{id}', id);
    }

    function resolvePhotos(template, gallery) {
        return gallery.items.map((id) => ({
            id,
            thumb: formatUrl(template.thumbFormat, id),
            full: formatUrl(template.fullFormat, id),
        }));
    }

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const photo = photos[currentIndex];
        lightboxImg.src = photo.full;
        lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        updateLightbox();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % photos.length;
        updateLightbox();
    }

    function renderGrid() {
        grid.innerHTML = photos.map((photo, i) => `
            <button type="button" class="photo-grid-item" data-index="${i}" aria-label="View photo ${i + 1}">
                <img src="${photo.thumb}" alt="" loading="lazy" decoding="async">
            </button>
        `).join('');
        grid.removeAttribute('aria-busy');

        grid.addEventListener('click', (e) => {
            const item = e.target.closest('.photo-grid-item');
            if (!item) return;
            openLightbox(Number(item.dataset.index));
        });
    }

    function showError(message) {
        grid.innerHTML = `<p class="gallery-error">${message}</p>`;
        grid.removeAttribute('aria-busy');
        if (albumLink) albumLink.closest('.gallery-album-link').style.display = 'none';
    }

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    const slug = getGallerySlug();
    if (!slug) {
        showError('No gallery specified.');
    } else {
        Promise.all([
            fetch('config.json').then((res) => res.json()),
            fetch(`${slug}/photos.json`).then((res) => {
                if (!res.ok) throw new Error('not found');
                return res.json();
            }),
        ])
            .then(([template, gallery]) => {
                const title = gallery.title || slug;
                if (galleryTitle) galleryTitle.textContent = title;
                document.title = `${title} · ROOTED`;

                if (albumLink && gallery.galleryUrl) {
                    albumLink.href = gallery.galleryUrl;
                } else if (albumLink) {
                    albumLink.closest('.gallery-album-link').style.display = 'none';
                }

                photos = resolvePhotos(template, gallery);
                renderGrid();
            })
            .catch(() => showError('Could not load gallery.'));
    }
})();
