/* ==========================================================================
   iMinerals Case Study — Interactive Presentation Slider & Enhancements
   ========================================================================== */

(function () {
  'use strict';

  const slides = [
    {
      num: '01',
      title: 'Cover — Everyday wellness, clearly expressed',
      src: 'assets/iminerals/portfolio-assets/01-cover.png',
      caption: 'Brand introduction and primary wordmark presentation.'
    },
    {
      num: '02',
      title: 'Problem — Clarity across the supplement range',
      src: 'assets/iminerals/portfolio-assets/02-problem.png',
      caption: 'The challenge of communicating multi-product supplements with warmth.'
    },
    {
      num: '03',
      title: 'Solution — Recognizable, readable, approachable',
      src: 'assets/iminerals/portfolio-assets/03-solution.png',
      caption: 'Three strategic pillars unifying print, packaging, and digital.'
    },
    {
      num: '04',
      title: 'Colour Direction — Burgundy, ivory, and brushed silver',
      src: 'assets/iminerals/portfolio-assets/04-colour.png',
      caption: 'A considered palette balancing warmth with pharmaceutical clarity.'
    },
    {
      num: '05',
      title: 'Typography — Expressive serif & structured sans',
      src: 'assets/iminerals/portfolio-assets/05-typography.png',
      caption: 'Characterful heading contrast paired with scannable information hierarchy.'
    },
    {
      num: '06',
      title: 'Packaging System — One system, distinct products',
      src: 'assets/iminerals/portfolio-assets/06-packaging.png',
      caption: 'Vertical brand anchor with priority product naming and formula specs.'
    },
    {
      num: '07',
      title: 'Art Direction — Natural light & product first',
      src: 'assets/iminerals/portfolio-assets/07-art-direction.png',
      caption: 'Translucent glass in organic sunlight communicating vitality.'
    },
    {
      num: '08',
      title: 'Material Detail — Brushed silver & translucent glass',
      src: 'assets/iminerals/portfolio-assets/08-material-detail.png',
      caption: 'Macro focus on physical textures, tactile finishes, and debossing.'
    },
    {
      num: '09',
      title: 'Digital Experience — Web extension & ecommerce mockup',
      src: 'assets/iminerals/portfolio-assets/09-digital-experience.png',
      caption: 'Carrying the packaging identity seamlessly into responsive web design.'
    },
    {
      num: '10',
      title: 'Design Outcome — Complete connected brand system',
      src: 'assets/iminerals/portfolio-assets/10-design-outcome.png',
      caption: 'Unified brand outcome across all packaging, visual, and web touchpoints.'
    }
  ];

  let currentIndex = 0;
  const stageImg = document.getElementById('deck-stage-img');
  const slideTitle = document.getElementById('deck-slide-title');
  const slideCounter = document.getElementById('deck-counter');
  const prevBtn = document.getElementById('deck-prev');
  const nextBtn = document.getElementById('deck-next');
  const thumbsContainer = document.getElementById('deck-thumbs');

  if (stageImg && thumbsContainer) {
    // Generate Thumbnails
    slides.forEach((slide, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `deck-thumb ${idx === 0 ? 'active' : ''}`;
      btn.setAttribute('aria-label', `Jump to slide ${slide.num}: ${slide.title}`);
      btn.innerHTML = `<img src="${slide.src}" alt="Thumbnail ${slide.num}" loading="lazy">`;
      btn.addEventListener('click', () => goToSlide(idx));
      thumbsContainer.appendChild(btn);
    });

    function updateSlide() {
      const current = slides[currentIndex];
      stageImg.style.opacity = '0';
      
      setTimeout(() => {
        stageImg.src = current.src;
        stageImg.alt = current.title;
        stageImg.style.opacity = '1';
      }, 150);

      if (slideTitle) slideTitle.textContent = current.title;
      if (slideCounter) slideCounter.textContent = `${current.num} / ${String(slides.length).padStart(2, '0')}`;

      // Update Thumbs Active State
      const thumbs = thumbsContainer.querySelectorAll('.deck-thumb');
      thumbs.forEach((thumb, idx) => {
        const isActive = idx === currentIndex;
        thumb.classList.toggle('active', isActive);
        thumb.setAttribute('aria-current', isActive ? 'true' : 'false');
        if (isActive) {
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateSlide();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      const rect = stageImg.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        if (e.key === 'ArrowLeft') {
          goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
          goToSlide(currentIndex + 1);
        }
      }
    });

    // Touch Swipe Support
    let touchStartX = 0;
    stageImg.parentElement.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    stageImg.parentElement.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    }, { passive: true });
  }

  // Color Swatch Click to Copy HEX
  document.querySelectorAll('.swatch-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const hexEl = card.querySelector('.swatch-hex');
      if (hexEl) {
        const hex = hexEl.textContent.trim();
        navigator.clipboard.writeText(hex).then(() => {
          const original = hexEl.textContent;
          hexEl.textContent = 'COPIED!';
          hexEl.style.color = 'var(--purple-accent)';
          setTimeout(() => {
            hexEl.textContent = original;
            hexEl.style.color = '';
          }, 1500);
        }).catch(() => {});
      }
    });
  });

  // Smooth Lightbox Modal for any Media Card Click
  const zoomableImages = document.querySelectorAll('.media-card img, .cs-hero-visual img, .macro-detail-card img');
  const lightbox = document.createElement('div');
  lightbox.id = 'cs-lightbox';
  lightbox.style.cssText = `
    position: fixed; inset: 0; background: rgba(8, 7, 10, 0.94);
    z-index: 1000; display: none; align-items: center; justify-content: center;
    padding: 30px; cursor: zoom-out; backdrop-filter: blur(12px);
  `;
  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width: 95vw; max-height: 92vh; object-fit: contain;
    border-radius: 12px; box-shadow: 0 30px 90px rgba(0,0,0,0.8);
    border: 1px solid rgba(255,255,255,0.15); transition: transform 0.3s ease;
  `;
  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  zoomableImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

})();
