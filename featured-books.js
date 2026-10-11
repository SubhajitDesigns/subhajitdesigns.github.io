/* Featured book showcase interaction — isolated from the rest of the portfolio */
(() => {
  const root = document.querySelector('#featured');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';
  const books = [...root.querySelectorAll('.fb-book')];
  const title = root.querySelector('#fbDetailTitle');
  const description = root.querySelector('#fbDetailDescription');
  const software = root.querySelector('#fbSoftware');
  const fonts = root.querySelector('#fbFonts');
  const palette = root.querySelector('#fbPalette');
  const price = root.querySelector('#fbPrice');
  const detailImage = root.querySelector('#fbDetailImage');
  const artIndex = root.querySelector('#fbArtIndex');
  const close = root.querySelector('.fb-close');
  const stage = root.querySelector('.fb-stage');
  let selected = null;

  function renderPalette(colors) {
    palette.replaceChildren();
    colors.forEach(color => {
      const swatch = document.createElement('span');
      swatch.className = 'fb-swatch';
      swatch.style.background = color.hex;
      swatch.title = color.hex;
      swatch.setAttribute('aria-label', color.name + ' ' + color.hex);
      const hex = document.createElement('span');
      hex.textContent = color.hex;
      swatch.append(hex);
      palette.append(swatch);
    });
  }

  function openBook(book, shouldScroll = false) {
    const data = {
      title: book.dataset.title,
      description: book.dataset.description,
      software: book.dataset.software,
      fonts: book.dataset.fonts,
      price: book.dataset.price,
      image: book.dataset.image,
      index: book.dataset.index,
      colors: JSON.parse(book.dataset.colors || '[]')
    };
    selected = book;
    books.forEach(item => {
      const active = item === book;
      item.classList.toggle('is-selected', active);
      item.setAttribute('aria-pressed', String(active));
    });
    root.classList.add('is-open');
    title.textContent = data.title;
    description.textContent = data.description;
    software.textContent = data.software;
    fonts.textContent = data.fonts;
    price.textContent = data.price;
    detailImage.src = data.image;
    detailImage.alt = data.title + ' — selected design artwork';
    artIndex.textContent = 'ARTWORK ' + String(data.index).padStart(2, '0') + ' / 03';
    renderPalette(data.colors);
    if (shouldScroll) {
      window.setTimeout(() => {
        const top = root.getBoundingClientRect().top + window.scrollY - 82;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 180);
    }
  }

  function closeBook() {
    root.classList.remove('is-open');
    books.forEach(item => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-pressed', 'false');
    });
    selected = null;
  }

  books.forEach(book => {
    book.setAttribute('aria-pressed', 'false');
    book.addEventListener('click', () => {
      if (selected === book && root.classList.contains('is-open')) {
        closeBook();
      } else {
        openBook(book, true);
      }
    });
  });
  close?.addEventListener('click', closeBook);
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && root.classList.contains('is-open')) closeBook();
  });
  stage?.addEventListener('pointermove', event => {
    if (root.classList.contains('is-open') || event.pointerType === 'touch') return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    books.forEach((book, i) => {
      const amount = i === 1 ? 7 : 4;
      book.style.translate = (x * amount * (i - 1)) + 'px ' + (y * -amount) + 'px';
    });
  });
  stage?.addEventListener('pointerleave', () => books.forEach(book => { book.style.translate = ''; }));
})();
