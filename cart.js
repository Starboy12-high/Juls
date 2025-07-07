document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const cartSummaryDiv = document.getElementById('cart-summary');
    const emptyCartMessageDiv = document.getElementById('empty-cart-message');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems(); // Re-render after save
    }

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        if (cart.length === 0) {
            cartSummaryDiv.style.display = 'none';
            emptyCartMessageDiv.style.display = 'block';
            return;
        }

        cartSummaryDiv.style.display = 'block';
        emptyCartMessageDiv.style.display = 'none';
        let total = 0;

        const ul = document.createElement('ul');
        ul.className = 'list-group';

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center cart-item';
            li.innerHTML = `
                <div>
                    <h5>${item.name}</h5>
                    <p>Price: GH¢${item.price.toFixed(2)}</p>
                </div>
                <div>
                    <label for="quantity-${index}" class="sr-only">Quantity</label>
                    <input type="number" class="form-control quantity-input d-inline-block mr-2" id="quantity-${index}" value="${item.quantity}" min="1" data-index="${index}">
                    <span>GH¢${itemTotal.toFixed(2)}</span>
                    <button class="btn btn-danger btn-sm ml-3 remove-item-btn" data-index="${index}">&times;</button>
                </div>
            `;
            ul.appendChild(li);
        });

        cartItemsContainer.appendChild(ul);
        cartTotalElement.textContent = total.toFixed(2);
        attachEventListeners();
    }

    function attachEventListeners() {
        // Remove item buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                saveCart();
            });
        });

        // Quantity change
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                let newQuantity = parseInt(e.target.value);
                if (newQuantity < 1) {
                    newQuantity = 1; // Prevent quantity less than 1
                    e.target.value = newQuantity; // Update input field
                }
                cart[index].quantity = newQuantity;
                saveCart();
            });
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if(confirm("Are you sure you want to clear your cart?")) {
                cart = [];
                saveCart();
            }
        });
    }

    // Initial render
    renderCartItems();
    updateCartCount(); // Also update count on cart page load

    // Apply theme from localStorage - handled by global script.js
});
