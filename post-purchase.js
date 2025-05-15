// Redirect after successful payment
document.getElementById('payNowButton').addEventListener('click', function(e) {
    e.preventDefault();
    // Process payment
    setTimeout(() => {
        window.location.href = '/order-success.html';
    }, 2000);
});