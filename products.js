document.addEventListener('DOMContentLoaded', () => {
    const mtnBundles = [
        { name: '1GB Data', price: '4.8', data_allowance: '1GB', validity: '30 Days', brandKey: 'mtn' },
        { name: '2GB Data', price: '9.6', data_allowance: '2GB', validity: '30 Days', brandKey: 'mtn' },
        { name: '3GB Data', price: '14.5', data_allowance: '3GB', validity: '30 Days', brandKey: 'mtn' },
        { name: '4GB Data', price: '19.2', data_allowance: '4GB', validity: '30 Days', brandKey: 'mtn' },
        { name: '5GB Data', price: '24', data_allowance: '5GB', validity: '30 Days', brandKey: 'mtn' },
        { name: '6GB Data', price: '28.8', data_allowance: '6GB', validity: '30 Days', brandKey: 'mtn' },
        { name: '7GB Data', price: '33.6', data_allowance: '7GB', validity: '30 Days', brandKey: 'mtn' },
        { name: '8GB Data', price: '38.4', data_allowance: '8GB', validity: '30 Days', brandKey: 'mtn' },
        { name: '9GB Data', price: '43.2', data_allowance: '9GB', validity: '30 Days', brandKey: 'mtn' },
        { name: '10GB Data', price: '48', data_allowance: '10GB', validity: '30 Days', brandKey: 'mtn' }
    ];

    const telecelBundles = [
        { name: '5GB Data', price: '22', data_allowance: '5GB', validity: '30 Days', brandKey: 'telecel' },
        { name: '10GB Data', price: '44', data_allowance: '10GB', validity: '30 Days', brandKey: 'telecel' },
        { name: '15GB Data', price: '66', data_allowance: '15GB', validity: '30 Days', brandKey: 'telecel' }
    ];

    const atBundles = [
        { name: '1GB Data', price: '4.5', data_allowance: '1GB', validity: '30 Days', brandKey: 'at' },
        { name: '2GB Data', price: '9', data_allowance: '2GB', validity: '30 Days', brandKey: 'at' },
        { name: '3GB Data', price: '13.5', data_allowance: '3GB', validity: '30 Days', brandKey: 'at' },
        { name: '4GB Data', price: '18', data_allowance: '4GB', validity: '30 Days', brandKey: 'at' },
        { name: '5GB Data', price: '22.5', data_allowance: '5GB', validity: '30 Days', brandKey: 'at' },
        { name: '6GB Data', price: '27', data_allowance: '6GB', validity: '30 Days', brandKey: 'at' },
        { name: '7GB Data', price: '31.5', data_allowance: '7GB', validity: '30 Days', brandKey: 'at' },
        { name: '8GB Data', price: '36', data_allowance: '8GB', validity: '30 Days', brandKey: 'at' },
        { name: '9GB Data', price: '40.5', data_allowance: '9GB', validity: '30 Days', brandKey: 'at' },
        { name: '10GB Data', price: '45', data_allowance: '10GB', validity: '30 Days', brandKey: 'at' }
    ];

    const otherServices = [
        { name: 'AFA Registration', price: '5', provider: 'Service', data_allowance: 'N/A', validity: 'N/A', brandKey: null }
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

    function createProductListItem(bundle, providerName) {
        const fullProductName = providerName ? `${providerName} ${bundle.name}` : bundle.name;
        const productPrice = `GH¢${bundle.price}`;
        let brandPlaceholderHtml = '';

        if (bundle.brandKey === 'mtn') {
            brandPlaceholderHtml = `<span class="product-brand-placeholder mtn-brand-placeholder">MTN</span>`;
        } else if (bundle.brandKey === 'telecel') {
            brandPlaceholderHtml = `<span class="product-brand-placeholder telecel-brand-placeholder">Telecel</span>`;
        } else if (bundle.brandKey === 'at') {
            brandPlaceholderHtml = `<span class="product-brand-placeholder at-brand-placeholder">AT</span>`;
        }


        const listItem = `
            <li class="product-list-item">
                <div class="product-brand-logo-container">
                    ${brandPlaceholderHtml}
                </div>
                <div class="product-info">
                    <h5 class="product-name">${fullProductName}</h5>
                    <div class="product-details">
                        <span class="product-allowance">Data: ${bundle.data_allowance}</span>
                        <span class="product-validity">Validity: ${bundle.validity}</span>
                    </div>
                </div>
                <div class="product-price-action">
                    <span class="product-price">${productPrice}</span>
                    <button class="btn btn-primary add-to-cart-btn" data-name="${fullProductName}" data-price="${productPrice}">Add to Cart</button>
                </div>
            </li>
        `;
        return listItem;
    }

    function renderBundles(bundles, containerId, providerName) {
        const container = document.getElementById(containerId);
        if (container) {
            bundles.forEach(bundle => {
                // Use createProductListItem now
                container.innerHTML += createProductListItem(bundle, bundle.provider || providerName);
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
