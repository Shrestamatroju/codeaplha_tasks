const products = [ 
  { id: 1, name: "Men's Ivory Embroidered Kurta", category: "men", price: 2499, image: "assests/men1.jpg", description: "" },
  { id: 2, name: "Men's Olive Green Kurta with Subtle Golden Motifs", category: "men", price: 1899, image: "assests/men2.jpg", description: "" },
  { id: 3, name: "Elegant Off-White Georgette Embroidered Lehenga Set", category: "women", price: 4999, image: "assests/women1.jpg", description: "" },
  { id: 4, name: "Pastel Sage Green Net Saree with Sequin Embellishments", category: "women", price: 3499, image: "assests/women2.jpg", description: "" },
  { id: 5, name: "Floral Layered Princess Dress for Girls", category: "kids", price: 1299, image: "assests/kid1.jpg", description: "" },
  { id: 6, name: "Girls' Banarasi Silk Lehenga Choli Set", category: "kids", price: 225000, image: "assests/kid2.jpg", description: "" }, 
  { id: 7, name: "Men's Classic Navy Blue Kurta", category: "men", price: 1499, image: "assests/men3.jpg", description: "" },
  { id: 8, name: "Black Solid Hoodie for men", category: "men", price: 999, image: "assests/men4.jpg", description: "" },
  { id: 9, name: "Elegant Blush Pink Shirt & White High-Waisted Trousers Set ", category: "women", price: 1499, image: "assests/women8.jpg", description: "" },
  { id: 10, name: "Embroidered Scarlet Orange Lehenga Set – Regal Festive Ensemble", category: "women", price: 3499, image: "assests/women4.jpg", description: "" },
  { id: 11, name: "Ivory Dream – Kids Ethnic Lehenga Choli Set", category: "kids", price: 2999, image: "assests/kid3.jpg", description: "" },
  { id: 12, name: "Traditional South Indian Dhoti Set for Boys", category: "kids", price: 899, image: "assests/kid4.jpg", description: "" },
  { id: 13, name: "Men’s Slim Fit Charcoal Grey Suit Blazer", category: "men", price: 3499, image: "assests/men5.jpg", description: "" },
  { id: 14, name: "Ivory Embroidered Mirror Work Lehenga Choli Set", category: "women", price: 4499, image: "assests/women5.jpg", description: "" },
  { id: 15, name: "Little Gentleman – Boys’ Vintage Suspenders Outfit Set with Cap & Bow Tie", category: "kids", price: 2199, image: "assests/kid5.jpg", description: "" },
  { id: 16, name: "Urban Cool – Toddler Boys' Streetwear Set with Cargo Pants ", category: "kids", price: 2499, image: "assests/kid6.jpg", description: "" }, 
  { id: 17, name: "Men’s Classic Beige Linen Shirt", category: "men", price: 2899, image: "assests/men6.jpg", description: "" },
  { id: 18, name: "Men’s Olive Green Muscle-Fit Tee", category: "men", price: 2299, image: "assests/men7.jpg", description: "" },
  { id: 19, name: "Pastel Plazo Style with Sequin Detailing", category: "women", price: 4299, image: "assests/women6.jpg", description: "" },
  { id: 20, name: "Floral Puff Sleeve Sweetheart Crop Top ", category: "women", price: 799, image: "assests/women7.jpg", description: "" },
  { id: 21, name: "Dapper Days – Boys' Smart Casual Linen Shirt & Check Trousers Set", category: "kids", price: 1899, image: "assests/kid7.jpg", description: "" },
  { id: 22, name: "Urban Cool – Kids’ Oversized Streetwear Tracksuit", category: "kids", price: 2499, image: "assests/kid8.jpg", description: "" },
  { id: 23, name: "Men’s Chunky Sole White & Beige Sneakers", category: "men", price: 2499, image: "assests/men8.jpg", description: "" },
  { id: 24, name: "Rust Rose Embroidered Anarkali Set with Dupatta", category: "women", price: 2799, image: "assests/women3.jpg", description: "" },
  
  { id: 25, name: "Seiko Astron GPS Solar Black Titanium Watch", category: "men", price: 215000, image: "assests/men9.jpg", description: "" },
  { id: 26, name: "Men's Olive Green Slim-Fit Casual Shirt", category: "men", price: 1499, image: "assests/men10.jpg", description: "" },
  { id: 27, name: "Vintage Grey High-Waist Wide Leg Jeans", category: "women", price: 1199, image: "assests/women9.jpg", description: "" },
  { id: 28, name: "Elegant Off-Shoulder Bodycon Dress", category: "women", price: 1899, image: "assests/women10.jpg", description:"" },
  { id: 29, name: "Girls’ Urban Streetwear Co-ord Set – Black Crop Top & Wide-Leg Pants", category: "kids", price: 1199, image: "assests/kid9.jpg", description: "" },
  { id: 30, name: "Keep There – Monochrome Girl’s Street Style Set", category: "kids", price: 1899, image: "assests/kid10.jpg", description: "" }, 
  { id: 31, name: "Men's Classic Black Slim-Fit Formal Shirt", category: "men", price: 1799, image: "assests/men11.jpg", description: "" },
  { id: 32, name: "Men’s Royal Blue Modern Fit Cotton Shirt", category: "men", price: 1499, image: "assests/men12.jpg", description: "" },
  { id: 33, name: "One-Shoulder Ruched Black Bodycon Dress", category: "women", price: 1499, image: "assests/women11.jpg", description: "" },
  { id: 34, name: "Powder Blue Cable-Knit Crop Top ", category: "women", price: 849, image: "assests/women12.jpg", description: "" },
  { id: 35, name: "Boys’ Classic Winter Formal Set – Turtleneck Sweater, Wool Trousers", category: "kids", price: 2899, image: "assests/kid11.jpg", description: "" },
  { id: 36, name: "Lavender Breeze Elegant Girls Ethnic Sharara Co-ord Set", category: "kids", price: 2299, image: "assests/kid12.jpg", description: "" }
];

const productsContainer = document.getElementById('products-container');
const cartCountElem = document.getElementById('cart-count');
const navLinks = document.querySelectorAll('.nav-links a');
const loginBtn = document.querySelector('.login-btn');
const cartLink = document.querySelector('.cart');

let cartCount = 0;
let user = null;

// Check login on page load
function checkLogin() {
  const userData = localStorage.getItem('myshopUser');
  if (userData) {
    user = JSON.parse(userData);
    loginBtn.textContent = 'Logout';
    cartLink.style.display = 'inline-block';
    fetchCartCount();
  } else {
    user = null;
    loginBtn.textContent = 'Login';
    cartLink.style.display = 'none';
    cartCount = 0;
    updateCartCount();
  }
}

// Fetch cart items count from backend
async function fetchCartCount() {
  try {
    const res = await fetch(`http://localhost:5000/api/cart/${encodeURIComponent(user.id)}`);
    const items = await res.json();
    cartCount = items.reduce((sum, item) => sum + item.qty, 0);
    updateCartCount();
  } catch (err) {
    console.error('Error fetching cart:', err);
  }
}

// Update cart count display
function updateCartCount() {
  cartCountElem.textContent = cartCount;
}


if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    if (user) {
      localStorage.removeItem('myshopUser');
      user = null;
      cartCount = 0;
      updateCartCount();
      loginBtn.textContent = 'Login';
      if (cartLink) cartLink.style.display = 'none';
      displayProducts(getActiveCategory && getActiveCategory());
      alert('Logged out!');
    } else {
      window.location.href = 'pages/login.html';
    }
  });
}


// Get active category
function getActiveCategory() {
  const activeLink = document.querySelector('.nav-links a.active');
  return activeLink ? activeLink.getAttribute('data-category') : 'all';
}

// Display products with add to cart if logged in
function displayProducts(category = 'all') {
  productsContainer.innerHTML = '';
  const filtered = category === 'all' ? products : products.filter(p => p.category === category);

  filtered.forEach(prod => {
    const prodElem = document.createElement('div');
    prodElem.classList.add('product-card');
    prodElem.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" />
      <div class="product-info">
        <h3>${prod.name}</h3>
        <p>${prod.description}</p>
        <div class="price">₹${prod.price}</div>
        ${user ? '<button class="add-to-cart-btn">Add to Cart</button>' : ''}
      </div>
    `;

    if (user) {
      const btn = prodElem.querySelector('.add-to-cart-btn');
      btn.addEventListener('click', async () => {
        try {
          console.log('Adding product to cart:', prod);
          const res = await fetch('http://localhost:5000/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              productId: prod.id,
              name: prod.name,
              price: prod.price,
              image: prod.image,
              qty: 1
            })
          });
          console.log('Response status:', res.status);
          const data = await res.json();
          console.log('Response data:', data);
          if (!res.ok) throw new Error(data.message || 'Failed to add item');

          cartCount++;
          updateCartCount();
          alert(`${prod.name} added to cart!`);
        } catch (err) {
          alert('Error adding to cart: ' + err.message);
          console.error(err);
        }
      });
    }
     

    productsContainer.appendChild(prodElem);
  });
}

// Category filtering
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    displayProducts(link.getAttribute('data-category'));
  });
});

// Initialize
checkLogin();
displayProducts();
