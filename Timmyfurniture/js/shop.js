
  // ── SUPABASE CONFIG ──

  const WHATSAPP_NUMBER = '23408157240158';

  let allProducts = [];

  // ── FETCH PRODUCTS FROM SUPABASE ──
  async function loadProducts() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      const data = await response.json();
      allProducts = data;
      renderProducts(data);

    } catch (error) {
      document.getElementById('productsGrid').innerHTML = '<div class="loading"> Failed to load products. Check your connection.</div>';
    }
  }

  // ── BUILD PRODUCT CARDS ──
  function renderProducts(products) {
    const grid = document.getElementById('productsGrid');

    if (products.length === 0) {
      grid.innerHTML = '<div class="no-results show"> No products found in this category.</div>';
      document.getElementById('countDisplay').textContent = 0;
      return;
    }

    grid.innerHTML = products.map(p => ` 
      <div class="product-card" data-category="${p.category}">
        <div class="product-img">
          <img src="${p.image}" alt="${p.name}"/>
          <span class="cat-tag">${p.category}</span>
        </div>
        <div class="product-body">
          <h3>${p.name}</h3>
          <div class="price">${p.price}</div>
          <div class="product-buttons">
            <button class="btn-desc" onclick='openModal(${JSON.stringify(p)})'>Description</button>
            <a class="btn-order" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello! I want to order:\n\n*${p.name}*\nPrice: ${p.price}`)}" target="_blank">
              <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.528 5.855L.057 23.882l6.197-1.448A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.366l-.36-.214-3.68.86.925-3.585-.235-.368A9.818 9.818 0 1112 21.818z"/></svg>
              Order
            </a>
          </div>
        </div>
      </div>
    `).join('');

    document.getElementById('countDisplay').textContent = products.length;
  }

  // ── FILTER ──
  function filterProducts() {
    const selected = document.getElementById('categoryFilter').value;
    if (selected === 'all') {
      renderProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === selected);
      renderProducts(filtered);
    }
  }

  // ── MODAL ──
  function openModal(p) {
    document.getElementById('modalImg').src         = p.image;
    document.getElementById('modalTag').innerText   = p.category;
    document.getElementById('modalName').innerText  = p.name;
    document.getElementById('modalPrice').innerText = p.price;
    document.getElementById('modalDesc').innerText  = p.description;
    const msg = `Hello! I want to order:\n\n*${p.name}*\nPrice: ${p.price}\nImage: ${p.image}`;
    document.getElementById('modalWhatsapp').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    document.getElementById('modalBackdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('modalBackdrop').classList.remove('open');
    document.body.style.overflow = '';
  }

  function closeModalOutside(e) {
    if (e.target === document.getElementById('modalBackdrop')) closeModal();
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── INIT ──
  loadProducts();

