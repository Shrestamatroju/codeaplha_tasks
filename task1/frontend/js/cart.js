document.addEventListener('DOMContentLoaded', async () => {
  updateAuthLink();

  if (localStorage.getItem('isLoggedIn') !== 'true') {
    document.getElementById('cart-items').innerHTML = "<p>Please login to view cart.</p>";
    document.getElementById('checkout-btn').style.display = "none";
    return;
  }

  const res = await fetch('http://localhost:5000/cart');
  const items = await res.json();

  const container = document.getElementById('cart-items');
  items.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `<p>${item.product.name} - ₹${item.product.price}</p>`;
    container.appendChild(div);
  });
});

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
