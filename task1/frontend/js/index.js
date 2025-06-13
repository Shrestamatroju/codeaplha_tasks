document.addEventListener('DOMContentLoaded', async () => {
  updateAuthLink();
  const res = await fetch('http://localhost:5000/products');
  const products = await res.json();

  const container = document.getElementById('products-container');
  products.forEach(product => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.price} INR</p>
      <button onclick="addToCart('${product._id}')">Add to Cart</button>
    `;
    container.appendChild(div);
  });
});

function addToCart(productId) {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    alert('Please login first.');
    window.location.href = 'login.html';
    return;
  }

  fetch('http://localhost:5000/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
  }).then(res => res.json()).then(data => {
    alert('Added to cart');
  });
}

function updateAuthLink() {
  const link = document.getElementById('auth-link');
  if (localStorage.getItem('isLoggedIn') === 'true') {
    link.innerHTML = `<a href="#" onclick="logout()">Logout</a>`;
  }
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.reload();
}
