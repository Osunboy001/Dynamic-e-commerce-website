
  // ── SUPABASE CONFIG ──


  // ── CHANGE THIS PASSWORD ──
  let ADMIN_PASSWORD = 'furniture2025';

  let products = [];

  /* ── LOGIN ── */
  function login() {
    const entered = document.getElementById('passwordInput').value;
    if (entered === ADMIN_PASSWORD) {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('adminDashboard').classList.add('show');
      loadProducts();
    } else {
      document.getElementById('errorMsg').classList.add('show');
      document.getElementById('passwordInput').value = '';
    }
  }

  function logout() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').classList.remove('show');
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMsg').classList.remove('show');
  }

  /* ── LOAD PRODUCTS FROM SUPABASE ── */
  async function loadProducts() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      products = await res.json();
      buildEditRows();
    } catch (err) {
      document.getElementById('editRows').innerHTML = '<div class="loading"> Failed to load. Check connection.</div>';
    }
  }

  /* ── BUILD EDIT ROWS ── */
  function buildEditRows() {
    const container = document.getElementById('editRows');
    container.innerHTML = '';

    products.forEach((p, i) => {
      container.innerHTML += `
        <div class="edit-card">
          <img id="previewImg_${i}" src="${p.image}" alt="${p.name}"/>
          <div class="field">
            <label>Product Name</label>
            <input type="text" id="editName_${i}" value="${p.name}" placeholder="Product name"/>
          </div>
          <div class="field">
            <label>Price</label>
            <input type="text" id="editPrice_${i}" value="${p.price}" placeholder="e.g ₦ 50,000"/>
          </div>
          <div class="field">
            <label>Image URL</label>
            <input type="text" id="editImg_${i}" value="${p.image}" placeholder="Paste image URL" oninput="previewImage(${i})"/>
          </div>
        </div>
      `;
    });
  }

  /* ── LIVE IMAGE PREVIEW ── */
  function previewImage(i) {
    const url = document.getElementById(`editImg_${i}`).value;
    document.getElementById(`previewImg_${i}`).src = url;
  }

  /* SAVING TO MY SUPABASE */
  async function saveChanges() {
    const btn = document.getElementById('saveBtn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
      // Update each product in Supabase one by one
      for (let i = 0; i < products.length; i++) {
        const newName  = document.getElementById(`editName_${i}`).value;
        const newPrice = document.getElementById(`editPrice_${i}`).value;
        const newImg   = document.getElementById(`editImg_${i}`).value;

        await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${products[i].id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newName,
            price: newPrice,
            image: newImg
          })
        });
      }

      // Show success
      const success = document.getElementById('saveSuccess');
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 3000);

    } catch (err) {
      alert(' Save failed.Please Check your connection');
    }

    btn.disabled = false;
    btn.textContent = 'Timmyfurniture Save Changes';
  }
