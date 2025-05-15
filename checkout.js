// Display Checkout Items
const checkoutItemsContainer = document.getElementById('checkout-items');
const checkoutTotalElement = document.getElementById('checkout-total');

async function fetchCart() {
    // Simulate fetching cart from API
    return JSON.parse(localStorage.getItem('cart')) || [];
}

async function displayCheckout() {
    const cart = await fetchCart();
    checkoutItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        checkoutTotalElement.textContent = '€0,00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
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
                <p>Quantity: ${item.quantity}</p>
                <p>Subtotal: €${itemTotal.toFixed(2)}</p>
            </div>
        `;
        checkoutItemsContainer.appendChild(cartItem);
    });

    checkoutTotalElement.textContent = `€${total.toFixed(2)}`;
}

displayCheckout();

// Payment Processing
const checkoutForm = document.getElementById('checkout-form');
const payBtn = document.querySelector('.pay-btn');
const buttonText = payBtn.querySelector('.button-text');
const spinner = payBtn.querySelector('.spinner');
const paymentMessage = document.getElementById('payment-message');

checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    payBtn.disabled = true;
    buttonText.style.display = 'none';
    spinner.style.display = 'inline-block';

    const formData = new FormData(checkoutForm);
    const paymentDetails = {
        name: formData.get('name'),
        email: formData.get('email'),
        address: formData.get('address'),
        cardNumber: formData.get('card-number'),
        expiry: formData.get('expiry'),
        cvv: formData.get('cvv')
    };

    try {
        // Simulate payment processing with API
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentDetails)
        });

        if (!response.ok) throw new Error('Payment failed');

        // Clear cart after successful payment
        localStorage.removeItem('cart');

        paymentMessage.textContent = 'Payment successful! Thank you for your purchase.';
        paymentMessage.classList.remove('error');
        paymentMessage.classList.add('success');
        paymentMessage.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    } catch (error) {
        paymentMessage.textContent = 'Payment failed. Please try again.';
        paymentMessage.classList.remove('success');
        paymentMessage.classList.add('error');
        paymentMessage.style.display = 'block';

        payBtn.disabled = false;
        buttonText.style.display = 'inline';
        spinner.style.display = 'none';

        setTimeout(() => {
            paymentMessage.style.display = 'none';
        }, 2000);
    }
});