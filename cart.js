// Display Cart Items
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

async function fetchCart() {
    // Simulate fetching cart from API
    // In a real app, replace with: await fetch('your-api-endpoint/cart')
    return JSON.parse(localStorage.getItem('cart')) || [];
}

async function updateCartItem(index, quantity) {
    let cart = await fetchCart();
    if (quantity < 1) return;

    cart[index].quantity = quantity;

    // Simulate API call to update cart
    await fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart[index])
    });

    // Update local storage as a fallback
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

async function removeCartItem(index) {
    let cart = await fetchCart();
    cart.splice(index, 1);

    // Simulate API call to remove item
    await fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'DELETE'
    });

    // Update local storage as a fallback
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

async function displayCart() {
    const cart = await fetchCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalElement.textContent = '€0,00';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Color: ${item.color}</p>
                <p>Size: ${item.size}</p>
                <p>Price: €${item.price.toFixed(2)}</p>
                <p>Subtotal: €${itemTotal.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartItem(${index}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly>
                    <button class="quantity-btn" onclick="updateCartItem(${index}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = `€${total.toFixed(2)}`;
}

displayCart();