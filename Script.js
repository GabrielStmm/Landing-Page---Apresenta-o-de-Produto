// CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .product-card, .cat-card, input').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // LOADER
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 2000);
  });

  // NAV SCROLL
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // REVEAL ON SCROLL
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));

  // CART
  let cart = [];

  function addToCart(name, price, btn) {
    const existing = cart.find(i => i.name === name);
    if (existing) { existing.qty++; }
    else { cart.push({ name, price, qty: 1, color: getColorForProduct(name) }); }
    updateCart();
    showToast(`${name} adicionado ao carrinho`);
    openCart();
  }

  function getColorForProduct(name) {
    const colors = {
      'Sillage Rouge': 'linear-gradient(135deg, #1a0a0a, #4a1515)',
      'Bleu Nuit': 'linear-gradient(135deg, #0a1520, #1a3a4a)',
      'Or Blanc': 'linear-gradient(135deg, #1a1508, #3a3010)',
      'Forêt Verte': 'linear-gradient(135deg, #0f1a10, #1e3820)',
    };
    return colors[name] || 'linear-gradient(135deg, #1a1410, #3a2a20)';
  }

  function updateCart() {
    const count = cart.reduce((a, i) => a + i.qty, 0);
    document.getElementById('cartCount').textContent = count;

    const body = document.getElementById('cartBody');
    const empty = document.getElementById('cartEmpty');
    const footer = document.getElementById('cartFooter');

    if (cart.length === 0) {
      empty.style.display = 'flex';
      footer.style.display = 'none';
      body.innerHTML = '';
      body.appendChild(empty);
    } else {
      empty.style.display = 'none';
      footer.style.display = 'block';
      body.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
          <div class="cart-item-img" style="background:${item.color}; border-radius:4px;"></div>
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-size">Eau de Parfum · 50ml</div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
            </div>
            <button class="cart-remove" onclick="removeItem(${i})">Remover</button>
          </div>
          <div class="cart-item-price">${item.price}</div>
        </div>
      `).join('');

      const total = cart.reduce((sum, item) => {
        const num = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
        return sum + (num * item.qty);
      }, 0);

      document.getElementById('cartTotalPrice').textContent =
        'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
    }
  }

  function changeQty(i, delta) {
    cart[i].qty += delta;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    updateCart();
  }

  function removeItem(i) {
    cart.splice(i, 1);
    updateCart();
  }

  function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('cartBtn').addEventListener('click', openCart);

  // TOAST
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  // SIZE SELECTOR
  function selectSize(btn) {
    const siblings = btn.closest('.product-sizes').querySelectorAll('.size-btn');
    siblings.forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
  }

  // NEWSLETTER
  function subscribe() {
    const input = document.getElementById('emailInput');
    if (input.value && input.value.includes('@')) {
      showToast('Inscrição realizada com sucesso! ✦');
      input.value = '';
    } else {
      showToast('Por favor, insira um e-mail válido.');
    }
  }