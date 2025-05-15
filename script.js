// Product Variants (Price and Availability based on Color/Size)
const variants = {
    black: {
        XS: { price: 19.99, stock: 5 },
        S: { price: 19.99, stock: 0 },
        M: { price: 20.99, stock: 10 },
        L: { price: 20.99, stock: 3 }
    },
    white: {
        XS: { price: 19.99, stock: 8 },
        S: { price: 19.99, stock: 12 },
        M: { price: 19.99, stock: 15 },
        L: { price: 19.99, stock: 7 }
    },
    grey: {
        XS: { price: 20.49, stock: 0 },
        S: { price: 20.49, stock: 4 },
        M: { price: 20.49, stock: 6 },
        L: { price: 20.49, stock: 2 }
    },
    green: {
        XS: { price: 21.99, stock: 1 },
        S: { price: 21.99, stock: 0 },
        M: { price: 21.99, stock: 5 },
        L: { price: 21.99, stock: 3 }
    }
};

// Product Image Gallery
const thumbnails = document.querySelectorAll('.thumbnail');
const productImg = document.getElementById('product-img');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('selected'));
        thumbnail.classList.add('selected');
        productImg.src = thumbnail.getAttribute('data-img');
    });

    thumbnail.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            thumbnail.click();
        }
    });
});

// Color Selection
const colors = document.querySelectorAll('.color');
let selectedColor = 'white';

colors.forEach(color => {
    color.addEventListener('click', () => {
        colors.forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-checked', 'false');
        });
        color.classList.add('selected');
        color.setAttribute('aria-checked', 'true');
        selectedColor = color.getAttribute('data-color');
        updateProductDetails();
    });

    color.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            color.click();
        }
    });
});

// Size Selection
const sizeButtons = document.querySelectorAll('.size-btn');
let selectedSize = 'M';

sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        sizeButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-checked', 'false');
        });
        button.classList.add('selected');
        button.setAttribute('aria-checked', 'true');
        selectedSize = button.getAttribute('data-size');
        updateProductDetails();
    });

    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});

// Quantity Controls
const quantityInput = document.getElementById('quantity-input');
const incrementBtn = document.getElementById('increment');
const decrementBtn = document.getElementById('decrement');

incrementBtn.addEventListener('click', () => {
    const maxStock = variants[selectedColor][selectedSize].stock;
    if (parseInt(quantityInput.value) < maxStock) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }
});

decrementBtn.addEventListener('click', () => {
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
});

// Update Product Details (Price and Availability)
const priceElement = document.getElementById('product-price');
const availabilityElement = document.getElementById('product-availability');
const addToCartBtn = document.querySelector('.add-to-cart');

function updateProductDetails() {
    const variant = variants[selectedColor][selectedSize];
    priceElement.textContent = `€${variant.price.toFixed(2)} EUR`;
    availabilityElement.textContent = variant.stock > 0 ? 'In Stock' : 'Out of Stock';
    availabilityElement.classList.toggle('in-stock', variant.stock > 0);
    availabilityElement.classList.toggle('out-of-stock', variant.stock <= 0);
    addToCartBtn.disabled = variant.stock <= 0;
    quantityInput.max = variant.stock;
    if (parseInt(quantityInput.value) > variant.stock) {
        quantityInput.value = variant.stock || 1;
    }
}

// Initial update
updateProductDetails();

// Cart Functionality with API
const cartMessage = document.getElementById('cart-message');
const buttonText = addToCartBtn.querySelector('.button-text');
const spinner = addToCartBtn.querySelector('.spinner');

async function addToCart() {
    if (!selectedColor || !selectedSize) {
        cartMessage.textContent = 'Please select a color and size.';
        cartMessage.classList.remove('success');
        cartMessage.classList.add('error');
        cartMessage.style.display = 'block';
        setTimeout(() => {
            cartMessage.style.display = 'none';
        }, 2000);
        return;
    }

    const variant = variants[selectedColor][selectedSize];
    if (variant.stock <= 0) {
        cartMessage.textContent = 'This item is out of stock.';
        cartMessage.classList.remove('success');
        cartMessage.classList.add('error');
        cartMessage.style.display = 'block';
        setTimeout(() => {
            cartMessage.style.display = 'none';
        }, 2000);
        return;
    }

    if (parseInt(quantityInput.value) > variant.stock) {
        cartMessage.textContent = `Only ${variant.stock} items available in stock.`;
        cartMessage.classList.remove('success');
        cartMessage.classList.add('error');
        cartMessage.style.display = 'block';
        setTimeout(() => {
            cartMessage.style.display = 'none';
        }, 2000);
        return;
    }

    addToCartBtn.disabled = true;
    buttonText.style.display = 'none';
    spinner.style.display = 'inline-block';

    try {
        const product = {
            name: 'Trijbs® Street Tee – White Heat Drop',
            price: variant.price,
            color: selectedColor,
            size: selectedSize,
            quantity: parseInt(quantityInput.value),
            image: productImg.src
        };

        // Simulate API call to add to cart
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) throw new Error('Failed to add to cart');

        // In a real app, store the cart in local storage as a fallback
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));

        cartMessage.textContent = 'Added to cart successfully!';
        cartMessage.classList.remove('error');
        cartMessage.classList.add('success');
        cartMessage.style.display = 'block';

        addToCartBtn.disabled = false;
        buttonText.style.display = 'inline';
        spinner.style.display = 'none';

        setTimeout(() => {
            cartMessage.style.display = 'none';
        }, 2000);
    } catch (error) {
        cartMessage.textContent = 'Error adding to cart. Please try again.';
        cartMessage.classList.remove('success');
        cartMessage.classList.add('error');
        cartMessage.style.display = 'block';

        addToCartBtn.disabled = false;
        buttonText.style.display = 'inline';
        spinner.style.display = 'none';

        setTimeout(() => {
            cartMessage.style.display = 'none';
        }, 2000);
    }
}

addToCartBtn.addEventListener('click', addToCart);

// Social Share Buttons
const shareButtons = document.querySelectorAll('.share-btn');
const productUrl = window.location.href;
const productTitle = 'Trijbs® Street Tee – White Heat Drop';

shareButtons.forEach(button => {
    button.addEventListener('click', () => {
        const platform = button.getAttribute('data-share');
        let shareUrl;

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(productTitle)}&url=${encodeURIComponent(productUrl)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(productTitle + ' ' + productUrl)}`;
                break;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    });
});

// Image Zoom Effect
const imageContainer = document.querySelector('.image-container');
const zoomLens = document.querySelector('.zoom-lens');
const zoomResult = document.querySelector('.zoom-result');

imageContainer.addEventListener('mousemove', (e) => {
    const rect = imageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    zoomLens.style.display = 'block';
    zoomResult.style.display = 'block';

    let lensX = x - zoomLens.offsetWidth / 2;
    let lensY = y - zoomLens.offsetHeight / 2;

    lensX = Math.max(0, Math.min(lensX, productImg.offsetWidth - zoomLens.offsetWidth));
    lensY = Math.max(0, Math.min(lensY, productImg.offsetHeight - zoomLens.offsetHeight));

    zoomLens.style.left = `${lensX}px`;
    zoomLens.style.top = `${lensY}px`;

    const ratioX = zoomResult.offsetWidth / zoomLens.offsetWidth;
    const ratioY = zoomResult.offsetHeight / zoomLens.offsetHeight;

    zoomResult.style.backgroundImage = `url(${productImg.src})`;
    zoomResult.style.backgroundSize = `${productImg.offsetWidth * ratioX}px ${productImg.offsetHeight * ratioY}px`;
    zoomResult.style.backgroundPosition = `-${lensX * ratioX}px -${lensY * ratioY}px`;
});

imageContainer.addEventListener('mouseleave', () => {
    zoomLens.style.display = 'none';
    zoomResult.style.display = 'none';
});

// Dynamic Reviews with Pagination
const reviewsContainer = document.getElementById('reviews-container');
const loadMoreReviewsBtn = document.getElementById('load-more-reviews');
let currentPage = 1;
const reviewsPerPage = 2;

async function fetchReviews(page) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=${reviewsPerPage}`);
        const reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

function displayReviews(reviews) {
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${review.name}</span>
                <span class="review-date">March ${Math.floor(Math.random() * 20) + 1}, 2025</span>
                <span class="review-rating">★★★★★</span>
            </div>
            <p>${review.body}</p>
        `;
        reviewsContainer.appendChild(reviewElement);
    });
}

async function loadMoreReviews() {
    loadMoreReviewsBtn.disabled = true;
    const reviews = await fetchReviews(currentPage);
    if (reviews.length === 0) {
        loadMoreReviewsBtn.textContent = 'No More Reviews';
        return;
    }
    displayReviews(reviews);
    currentPage++;
    loadMoreReviewsBtn.disabled = false;
}

loadMoreReviewsBtn.addEventListener('click', loadMoreReviews);

// Initial load
loadMoreReviews();

