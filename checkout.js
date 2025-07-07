document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryList = document.getElementById('order-summary-list');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');
    const payWithPaystackBtn = document.getElementById('pay-with-paystack');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const PAYSTACK_PUBLIC_KEY = 'pk_live_b2627be3c9006fe634fe3f996a15d5c700f20ec8'; // Provided public key

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    function renderOrderSummary() {
        orderSummaryList.innerHTML = ''; // Clear existing items
        if (cart.length === 0) {
            checkoutTotalElement.textContent = '0.00';
            // Optionally redirect to cart page or show message if cart is empty
            alert("Your cart is empty. Redirecting to products page.");
            window.location.href = 'products.html';
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between lh-condensed';
            li.innerHTML = `
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">Quantity: ${item.quantity}</small>
                </div>
                <span class="text-muted">GH¢${itemTotal.toFixed(2)}</span>
            `;
            orderSummaryList.appendChild(li);
        });
        checkoutTotalElement.textContent = total.toFixed(2);
    }

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // This is where Paystack would be triggered.
        // For now, we'll simulate the Paystack call logic.
        initiatePaystackPayment();
    });

    function initiatePaystackPayment() {
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value; // Though not directly sent to Paystack, good for records
        const phone = document.getElementById('phone').value; // Also good for records/notifications
        const amount = parseFloat(checkoutTotalElement.textContent) * 100; // Amount in kobo/pesewas

        if (!email || !name || !phone) {
            alert("Please fill in all billing details.");
            return;
        }
        if (amount <= 0) {
            alert("Cannot process payment for zero amount.");
            return;
        }

        // Actual Paystack integration
        const handler = PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: email,
            amount: amount, // Amount in kobo/pesewas
            currency: "GHS",
            ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a unique reference
            metadata: {
                custom_fields: [
                    {
                        display_name: "Full Name",
                        variable_name: "full_name",
                        value: name
                    },
                    {
                        display_name: "Phone Number",
                        variable_name: "phone_number",
                        value: phone
                    },
                    {
                        display_name: "Cart Items",
                        variable_name: "cart_items",
                        value: JSON.stringify(cart.map(item => `${item.name} (Qty: ${item.quantity})`))
                    }
                ]
            },
            callback: function(response) {
                // Payment successful
                alert('Payment successful! Transaction reference: ' + response.reference);
                // Here you would typically verify the transaction on your backend
                localStorage.removeItem('cart');
                cart = [];
                updateCartCount();
                window.location.href = 'dashboard.html?payment=success&reference=' + response.reference;
            },
            onClose: function() {
                // User closed the popup
                alert('Transaction was not completed.');
            }
        });
        handler.openIframe();
    }


    // Initial render
    renderOrderSummary();
    updateCartCount();

    // Apply theme from localStorage - handled by global script.js
});
