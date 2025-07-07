document.addEventListener('DOMContentLoaded', () => {
    const mtnBundles = [
        { name: '1GB', price: '4.8' }, { name: '2GB', price: '9.6' }, { name: '3GB', price: '14.5' },
        { name: '4GB', price: '19.2' }, { name: '5GB', price: '24' }, { name: '6GB', price: '28.8' },
        { name: '7GB', price: '33.6' }, { name: '8GB', price: '38.4' }, { name: '9GB', price: '43.2' },
        { name: '10GB', price: '48' }
    ];

    const telecelBundles = [
        { name: '5GB', price: '22' }, { name: '10GB', price: '44' }, { name: '15GB', price: '66' }
    ];

    const atBundles = [
        { name: '1GB', price: '4.5' }, { name: '2GB', price: '9' }, { name: '3GB', price: '13.5' },
        { name: '4GB', price: '18' }, { name: '5GB', price: '22.5' }, { name: '6GB', price: '27' },
        { name: '7GB', price: '31.5' }, { name: '8GB', price: '36' }, { name: '9GB', price: '40.5' },
        { name: '10GB', price: '45' }
    ];

    const otherServices = [
        { name: 'AFA Registration', price: '5', provider: 'Service' }
    ];

    // Initialize cart from localStorage or create an empty one
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount(); // Update cart count in navbar
    }

    function addToCart(productName, productPrice) {
        const price = parseFloat(productPrice.replace('GH¢', ''));
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: productName, price: price, quantity: 1 });
        }
        saveCart();
        alert(`${productName} added to cart!`);
    }

    // Update cart count in navbar (to be called when cart changes)
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }


    function createProductCard(bundle, providerName) {
        const productName = `${providerName} ${bundle.name}`;
        const productPrice = `GH¢${bundle.price}`;
        const card = `
            <div class="col-md-4">
                <div class="card product-card">
                    <div class="card-body">
                        <h5 class="card-title">${productName}</h5>
                        <p class="card-text">Price: ${productPrice}</p>
                        <button class="btn btn-primary add-to-cart-btn" data-name="${productName}" data-price="${productPrice}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    function renderBundles(bundles, containerId, providerName) {
        const container = document.getElementById(containerId);
        if (container) {
            bundles.forEach(bundle => {
                container.innerHTML += createProductCard(bundle, providerName);
            });
        }
    }

    renderBundles(mtnBundles, 'mtn-bundles', 'MTN');
    renderBundles(telecelBundles, 'telecel-bundles', 'Telecel');
    renderBundles(atBundles, 'at-bundles', 'AT');
    renderBundles(otherServices, 'other-services', ''); // Render AFA registration, providerName can be empty or 'Service'

    // Event delegation for "Add to Cart" buttons
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-to-cart-btn')) {
            const productName = event.target.getAttribute('data-name');
            const productPrice = event.target.getAttribute('data-price');
            addToCart(productName, productPrice);
        }
    });

    updateCartCount(); // Initial cart count update on page load

    // Remove original purchase modal logic as it's replaced by cart
    // const purchaseModal = $('#purchaseModal');
    // const modalBundleName = document.getElementById('modal-bundle-name');
    // const modalBundlePrice = document.getElementById('modal-bundle-price');
    // const purchaseForm = document.getElementById('purchase-form');
    // const phoneNumberInput = document.getElementById('phone-number');

    // Global script.js handles theme loading
});
