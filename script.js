/* ========================================================
   Shynia Beauty – Main Script
   ======================================================== */

/* ----- Product Data ----- */
const products = [
  {
    id: 1,
    name: 'Pure Glow Serum',
    category: 'skincare',
    price: 48,
    original: 60,
    emoji: '✨',
    badge: 'Bestseller',
    desc: 'Vitamin C & hyaluronic acid serum for luminous, hydrated skin.'
  },
  {
    id: 2,
    name: 'Rose Petal Lipstick',
    category: 'makeup',
    price: 22,
    original: null,
    emoji: '💄',
    badge: 'New',
    desc: 'Satin-finish long-wear lipstick in 12 stunning shades.'
  },
  {
    id: 3,
    name: 'Blossom Body Mist',
    category: 'fragrance',
    price: 34,
    original: null,
    emoji: '🌺',
    badge: null,
    desc: 'Light floral mist infused with jasmine and peach blossom notes.'
  },
  {
    id: 4,
    name: 'Silk Hair Mask',
    category: 'haircare',
    price: 38,
    original: 50,
    emoji: '💆',
    badge: 'Sale',
    desc: 'Deep-conditioning argan oil mask for silky, frizz-free hair.'
  },
  {
    id: 5,
    name: 'Dewy Skin Tint',
    category: 'makeup',
    price: 30,
    original: null,
    emoji: '🌟',
    badge: null,
    desc: 'Lightweight tinted moisturiser with SPF 30 for a natural glow.'
  },
  {
    id: 6,
    name: 'Retinol Night Cream',
    category: 'skincare',
    price: 58,
    original: 70,
    emoji: '🌙',
    badge: 'Sale',
    desc: 'Retinol-rich night cream that smooths fine lines while you sleep.'
  },
  {
    id: 7,
    name: 'Velvet Eye Shadow Palette',
    category: 'makeup',
    price: 42,
    original: null,
    emoji: '👁️',
    badge: 'New',
    desc: '12-shade neutral palette with matte and shimmer finishes.'
  },
  {
    id: 8,
    name: 'Eau de Shynia Parfum',
    category: 'fragrance',
    price: 85,
    original: null,
    emoji: '🌸',
    badge: null,
    desc: 'Signature floral-woody fragrance – your daily luxury ritual.'
  }
];

/* ----- Cart State ----- */
let cart = [];

/* ----- DOM References ----- */
const productsGrid  = document.getElementById('productsGrid');
const cartCount     = document.getElementById('cartCount');
const cartBtn       = document.getElementById('cartBtn');
const cartSidebar   = document.getElementById('cartSidebar');
const cartOverlay   = document.getElementById('cartOverlay');
const closeCart     = document.getElementById('closeCart');
const cartItems     = document.getElementById('cartItems');
const cartFooter    = document.getElementById('cartFooter');
const cartTotal     = document.getElementById('cartTotal');
const toast         = document.getElementById('toast');
const hamburger     = document.getElementById('hamburger');
const nav           = document.getElementById('nav');
const header        = document.getElementById('header');
const filterBtns    = document.querySelectorAll('.filter-btn');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg  = document.getElementById('newsletterMsg');
const contactForm   = document.getElementById('contactForm');
const contactMsg    = document.getElementById('contactMsg');

/* ========================================================
   Render Products
   ======================================================== */
function renderProducts(filter = 'all') {
  productsGrid.innerHTML = '';

  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  filtered.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.category = p.category;
    card.style.animationDelay = `${i * 0.06}s`;

    card.innerHTML = `
      <div class="product-img">
        <span>${p.emoji}</span>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-body">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">
            $${p.price.toFixed(2)}
            ${p.original ? `<span class="original">$${p.original.toFixed(2)}</span>` : ''}
          </div>
          <button class="add-to-cart" data-id="${p.id}">Add to Bag</button>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });

  /* Re-attach add-to-cart listeners */
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

/* ========================================================
   Filter
   ======================================================== */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

/* Category cards link to filtered products */
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const filter = card.dataset.filter;
    document.querySelector(`[data-filter="${filter}"]`)?.click();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ========================================================
   Cart Logic
   ======================================================== */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  openCart();
  showToast(`${product.name} added to your bag! 🛍️`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  /* Update count badge */
  const total = cart.reduce((s, i) => s + i.qty, 0);
  cartCount.textContent = total;

  /* Update sidebar */
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your bag is empty 🛍️</p>';
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'block';

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
      </div>
    </div>
  `).join('');

  /* Qty button listeners */
  cartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      updateQty(parseInt(btn.dataset.id), parseInt(btn.dataset.delta));
    });
  });

  /* Total */
  const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartTotal.textContent = `$${sum.toFixed(2)}`;
}

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartFn() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartFn);
cartOverlay.addEventListener('click', closeCartFn);

/* ========================================================
   Toast
   ======================================================== */
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ========================================================
   Hamburger
   ======================================================== */
hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  hamburger.textContent = nav.classList.contains('open') ? '✕' : '☰';
});

/* Close nav on link click */
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.textContent = '☰';
  });
});

/* ========================================================
   Header scroll effect
   ======================================================== */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);

  /* Active nav highlight */
  const sections = ['home', 'products', 'about', 'contact'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const { top, bottom } = el.getBoundingClientRect();
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', top <= 80 && bottom > 80);
  });
});

/* ========================================================
   Scroll Reveal
   ======================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function initReveal() {
  document.querySelectorAll('.category-card, .feature-card, .testimonial-card, .product-card')
    .forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
}

/* ========================================================
   Forms
   ======================================================== */
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  newsletterMsg.textContent = '🎉 Thank you for subscribing! Welcome to the Shynia Circle.';
  newsletterForm.reset();
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  contactMsg.textContent = '✅ Your message has been sent! We\'ll get back to you within 24 hours.';
  contactForm.reset();
});

/* ========================================================
   Init
   ======================================================== */
renderProducts();
initReveal();
